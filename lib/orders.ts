// Pluggable orders layer.
//
// Today this returns mock data so the customer account page works end-to-end.
// When the restaurant's real API is ready, set the two env vars below and this
// module will fetch live orders instead — no changes needed anywhere else.
//
//   RESTAURANT_API_URL   e.g. https://api.o2restaurant.ps
//   RESTAURANT_API_KEY   the access token for that API
//
// The rest of the app only imports `getCustomerOrders` / `getOrderById`, so the
// data source is fully swappable behind this interface.

export type OrderItem = {
  name: string
  quantity: number
  price: number
}

export type OrderStatus = "pending" | "preparing" | "delivered" | "cancelled"

export type Order = {
  id: string
  branch: "gaza" | "nuseirat"
  createdAt: string // ISO date
  status: OrderStatus
  items: OrderItem[]
  total: number
  currency: string
}

const API_URL = process.env.RESTAURANT_API_URL
const API_KEY = process.env.RESTAURANT_API_KEY

// --- Live API implementation (used automatically once env vars are set) ---
async function fetchFromApi(path: string): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    // orders change over time; keep them reasonably fresh
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`Restaurant API error: ${res.status}`)
  return res.json()
}

// --- Mock implementation (temporary, until the API is connected) ---
function mockOrders(customerId: number): Order[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  // Deterministic per-customer so the demo is stable across reloads.
  const seed = customerId % 3

  const base: Order[] = [
    {
      id: `ORD-${1000 + customerId}-1`,
      branch: seed === 0 ? "gaza" : "nuseirat",
      createdAt: new Date(now - 1 * day).toISOString(),
      status: "delivered",
      currency: "شيكل",
      items: [
        { name: "شاورما عربي دجاج", quantity: 2, price: 15 },
        { name: "بطاطا مقلية", quantity: 1, price: 8 },
        { name: "مشروب غازي", quantity: 2, price: 5 },
      ],
      total: 48,
    },
    {
      id: `ORD-${1000 + customerId}-2`,
      branch: seed === 0 ? "gaza" : "nuseirat",
      createdAt: new Date(now - 6 * day).toISOString(),
      status: "delivered",
      currency: "شيكل",
      items: [
        { name: "وجبة برجر لحم", quantity: 1, price: 25 },
        { name: "سلطة سيزر", quantity: 1, price: 12 },
      ],
      total: 37,
    },
    {
      id: `ORD-${1000 + customerId}-3`,
      branch: seed === 0 ? "gaza" : "nuseirat",
      createdAt: new Date(now - 20 * day).toISOString(),
      status: "delivered",
      currency: "شيكل",
      items: [{ name: "بيتزا خضار وسط", quantity: 1, price: 30 }],
      total: 30,
    },
  ]

  return base
}

/**
 * Returns a customer's orders, newest first.
 * Uses the live restaurant API when configured, otherwise mock data.
 */
export async function getCustomerOrders(customerId: number): Promise<Order[]> {
  if (API_URL && API_KEY) {
    const data = (await fetchFromApi(`/customers/${customerId}/orders`)) as Order[]
    return data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }
  return mockOrders(customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

/** Returns a single order for a customer, or null if not found. */
export async function getOrderById(customerId: number, orderId: string): Promise<Order | null> {
  const orders = await getCustomerOrders(customerId)
  return orders.find((o) => o.id === orderId) ?? null
}

export const BRANCH_LABELS: Record<Order["branch"], string> = {
  gaza: "فرع غزة",
  nuseirat: "فرع النصيرات",
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  preparing: "قيد التحضير",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
}
