// Loyalty program — "الرحلة المطعمية" (Culinary Journey)
//
// Three gamified levels. Points can be awarded from anywhere (orders, ratings,
// etc.) via awardPoints(); the UI reads the derived level + progress from
// getLoyaltyProgress().

import { Utensils, ChefHat, Crown, type LucideIcon } from "lucide-react"

export type LoyaltyLevel = {
  index: number
  key: "foodie" | "chef" | "vip"
  name: string
  subtitle: string
  min: number
  max: number | null // null = no upper bound
  icon: LucideIcon
  // theming tokens (already defined in globals via primary/accent, we use classes)
  color: string
  perks: string[]
}

export const LOYALTY_LEVELS: LoyaltyLevel[] = [
  {
    index: 0,
    key: "foodie",
    name: "المتذوق",
    subtitle: "Foodie",
    min: 0,
    max: 200,
    icon: Utensils,
    color: "text-amber-600",
    perks: ["جمع نقاط عادية على كل طلب", "هدية ترحيبية عند التسجيل"],
  },
  {
    index: 1,
    key: "chef",
    name: "الشيف",
    subtitle: "Chef",
    min: 200,
    max: 500,
    icon: ChefHat,
    color: "text-orange-600",
    perks: ["نقاط مضاعفة في عطلة نهاية الأسبوع", "مقبلات مجانية مع طلبك"],
  },
  {
    index: 2,
    key: "vip",
    name: "السلطان",
    subtitle: "V.I.P Gourmet",
    min: 500,
    max: null,
    icon: Crown,
    color: "text-primary",
    perks: ["حجز أولوية دائم", "طبق حلا مجاني كل شهر", "توصيل مجاني دائم"],
  },
]

export type LoyaltyProgress = {
  points: number
  current: LoyaltyLevel
  next: LoyaltyLevel | null
  pointsIntoLevel: number
  pointsForLevel: number // span of the current level
  pointsToNext: number
  percent: number // 0-100 within current level
  motivation: string
}

export function getLevelForPoints(points: number): LoyaltyLevel {
  // highest level whose min <= points
  let level = LOYALTY_LEVELS[0]
  for (const l of LOYALTY_LEVELS) {
    if (points >= l.min) level = l
  }
  return level
}

export function getLoyaltyProgress(points: number): LoyaltyProgress {
  const current = getLevelForPoints(points)
  const next = LOYALTY_LEVELS[current.index + 1] ?? null

  if (!next) {
    return {
      points,
      current,
      next: null,
      pointsIntoLevel: points - current.min,
      pointsForLevel: 0,
      pointsToNext: 0,
      percent: 100,
      motivation: "لقد وصلت إلى أعلى مستوى! أنت من ملوك O2. استمتع بكل المزايا الحصرية.",
    }
  }

  const pointsForLevel = next.min - current.min
  const pointsIntoLevel = points - current.min
  const pointsToNext = next.min - points
  const percent = Math.min(100, Math.round((pointsIntoLevel / pointsForLevel) * 100))

  return {
    points,
    current,
    next,
    pointsIntoLevel,
    pointsForLevel,
    pointsToNext,
    percent,
    motivation: `بقي لك ${pointsToNext} نقطة لتصل إلى مستوى «${next.name}» وتحصل على مزايا أكبر!`,
  }
}
