import { randomBytes, scryptSync, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { customers, customerSessions } from "@/lib/db/schema"

const SESSION_COOKIE = "o2_customer_session"
const SESSION_DAYS = 30

// --- Password hashing (Node built-in scrypt, no extra dependency) ---
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const derived = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":")
  if (!salt || !key) return false
  const derived = scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(key, "hex")
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}

// --- Session management (DB-backed opaque tokens) ---
export async function createSession(customerId: number) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await db.insert(customerSessions).values({ token, customerId, expiresAt })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: expiresAt,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await db.delete(customerSessions).where(eq(customerSessions.token, token))
    cookieStore.delete(SESSION_COOKIE)
  }
}

export type CurrentCustomer = {
  id: number
  name: string
  email: string | null
  phone: string
}

export async function getCurrentCustomer(): Promise<CurrentCustomer | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const [session] = await db
    .select()
    .from(customerSessions)
    .where(eq(customerSessions.token, token))
    .limit(1)

  if (!session) return null
  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(customerSessions).where(eq(customerSessions.token, token))
    return null
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, session.customerId))
    .limit(1)

  if (!customer) return null
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  }
}
