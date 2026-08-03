import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core"

export const restaurantRatings = pgTable("restaurant_ratings", {
  id: serial("id").primaryKey(),
  branch: text("branch").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  rating: text("rating").notNull(),
  ratingValue: integer("rating_value").notNull(),
  foodQuality: integer("food_quality"),
  variety: integer("variety"),
  prices: integer("prices"),
  service: integer("service"),
  cleanliness: integer("cleanliness"),
  atmosphere: integer("atmosphere"),
  likedMost: text("liked_most"),
  notes: text("notes"),
  customerId: integer("customer_id"),
  orderId: text("order_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  birthday: text("birthday"),
  anniversary: text("anniversary"),
  dietaryNotes: text("dietary_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const customerAddresses = pgTable("customer_addresses", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  label: text("label").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const customerComplaints = pgTable("customer_complaints", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const notificationPrefs = pgTable("notification_prefs", {
  customerId: integer("customer_id").primaryKey(),
  general: boolean("general").notNull().default(true),
  personalized: boolean("personalized").notNull().default(true),
  timing: boolean("timing").notNull().default(true),
  occasions: boolean("occasions").notNull().default(true),
})

export const customerSessions = pgTable("customer_sessions", {
  token: text("token").primaryKey(),
  customerId: integer("customer_id").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
