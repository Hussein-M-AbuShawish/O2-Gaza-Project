"use server"

import { redirect } from "next/navigation"
import { or, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth"

export type AuthState = { success: boolean; message: string } | null

function normalizePhone(phone: string) {
  return phone.replace(/[\s-]/g, "")
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim().toLowerCase() || null
  const phone = normalizePhone(String(formData.get("phone") || "").trim())
  const password = String(formData.get("password") || "")

  if (!name) return { success: false, message: "الرجاء إدخال الاسم." }
  if (!/^[0-9]{7,15}$/.test(phone)) return { success: false, message: "الرجاء إدخال رقم جوال صحيح." }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "البريد الإلكتروني غير صحيح." }
  }
  if (password.length < 6) return { success: false, message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }

  // Ensure phone/email are not already taken
  const existing = await db
    .select({ id: customers.id, phone: customers.phone, email: customers.email })
    .from(customers)
    .where(email ? or(eq(customers.phone, phone), eq(customers.email, email)) : eq(customers.phone, phone))

  if (existing.some((c) => c.phone === phone)) {
    return { success: false, message: "رقم الجوال مسجّل مسبقاً. سجّل الدخول بدلاً من ذلك." }
  }
  if (email && existing.some((c) => c.email === email)) {
    return { success: false, message: "البريد الإلكتروني مسجّل مسبقاً." }
  }

  const [customer] = await db
    .insert(customers)
    .values({ name, email, phone, passwordHash: hashPassword(password) })
    .returning({ id: customers.id })

  await createSession(customer.id)
  redirect("/account")
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = String(formData.get("identifier") || "").trim()
  const password = String(formData.get("password") || "")

  if (!identifier || !password) {
    return { success: false, message: "الرجاء إدخال البريد/الجوال وكلمة المرور." }
  }

  const isEmail = identifier.includes("@")
  const lookup = isEmail ? identifier.toLowerCase() : normalizePhone(identifier)

  const [customer] = await db
    .select()
    .from(customers)
    .where(isEmail ? eq(customers.email, lookup) : eq(customers.phone, lookup))
    .limit(1)

  if (!customer || !verifyPassword(password, customer.passwordHash)) {
    return { success: false, message: "بيانات الدخول غير صحيحة." }
  }

  await createSession(customer.id)
  redirect("/account")
}

export async function signOut() {
  await destroySession()
  redirect("/account/login")
}
