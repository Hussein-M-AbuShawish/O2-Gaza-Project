"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useBranch } from "@/lib/branch-context";
import { getMenuByBranch } from "@/lib/menu-data";

import shawarma from "@/public/menu/Shawarma/18.jpg";

import italian from "@/public/menu/Italian/35.jpg";

import sandwiches from "@/public/menu/Western/43.jpg";

import easternSweets from "@/public/menu/Sweets/27.jpg";

import barSweets from "@/public/menu/Bar/16.jpg";

import westernSweets from "@/public/menu/Cake/11.2.jpg";

import drinks from "@/public/menu/drinks/13.jpg";

import salads from "@/public/menu/salad/20.jpeg";

import gelato from "@/public/menu/Gelato/72.jpeg";

const CATEGORY_DISPLAY = [
  { id: "shawarma", name: "الشاورما", image: shawarma, emoji: "🌯" },
  { id: "italian", name: "الإيطالي", image: italian, emoji: "🍕" },
  { id: "sandwiches", name: "السندويشات", image: sandwiches, emoji: "🥪" },
  {
    id: "easternSweets",
    name: "الحلويات الشرقية",
    image: easternSweets,
    emoji: "🍰",
  },
  {
    id: "westernSweets",
    name: "الكيك والحلويات",
    image: westernSweets,
    emoji: "🎂",
  },
  { id: "barSweets", name: "حلويات البار", image: barSweets, emoji: "🍫" },
  { id: "drinks", name: "المشروبات", image: drinks, emoji: "🥤" },
  { id: "salads", name: "السلطات", image: salads, emoji: "🥗" },
  { id: "gelato", name: "الجيلاتو", image: gelato, emoji: "🍰" },
];

export default function CategoriesPage() {
  const { selectedBranch } = useBranch();
  const branchMenu = getMenuByBranch(selectedBranch || "gaza");

  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ radius: 210, itemSize: 110 });

  const categories = useMemo(
    () =>
      CATEGORY_DISPLAY.filter(
        (c) => branchMenu[c.id as keyof typeof branchMenu]
      ),
    [branchMenu]
  );

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setDimensions({ radius: 140, itemSize: 75 });
      else if (w < 768) setDimensions({ radius: 180, itemSize: 90 });
      else if (w < 1024) setDimensions({ radius: 220, itemSize: 100 });
      else setDimensions({ radius: 260, itemSize: 110 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!categories.length) return null;

  const { radius, itemSize } = dimensions;

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Header Section */}
      <section className="pt-28 pb-10 text-center">
        <Link href="/select-branch">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 inline-flex items-center gap-2 rounded-lg cursor-pointer bg-primary px-5 py-2.5 font-semibold text-primary-foreground  hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            اختر فرع آخر
          </motion.button>
        </Link>
        <h1 className="text-4xl font-bold">استكشف الأقسام</h1>
        <p className="mt-2 text-muted-foreground">
          {selectedBranch === "middle" ? "فرع الوسطى" : "فرع غزة"}
        </p>
      </section>

      {/* Orbit Container */}
      <section className="relative flex items-center justify-center h-[520px] pb-10 mt-10">
        {/* 1. الحاوية الدوارة (للأقسام فقط) */}
        <motion.div
          className="relative z-10"
          style={{ width: radius * 2 + 140, height: radius * 2 + 140 }}
          animate={isPaused ? {} : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {categories.map((cat, i) => {
            const angle = (i / categories.length) * 2 * Math.PI - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={cat.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: itemSize,
                  height: itemSize,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Link href={`/category/${cat.id}`}>
                  {/* نقوم بتدوير المحتوى عكسياً ليبقى النص معتدلاً أثناء الدوران */}
                  <motion.div
                    className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary shadow-lg hover:scale-110 transition bg-card"
                    animate={isPaused ? {} : { rotate: -360 }}
                    transition={{
                      duration: 40,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-end justify-center p-2">
                      <span className="text-white text-[10px] sm:text-xs font-bold text-center">
                        {cat.name}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 2. المركز الثابت (كلمة الأقسام) - خارج الـ motion.div الدوار */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-white flex flex-col items-center justify-center font-extrabold shadow-2xl z-20 pointer-events-none"
          style={{
            width: itemSize * 1.2,
            height: itemSize * 1.2,
            maxWidth: "160px",
            maxHeight: "160px",
          }}
        >
          <span className="text-2xl sm:text-4xl">🍽️</span>
          <span className="text-sm sm:text-xl mt-1">الأقسام</span>
        </div>
      </section>

      <Footer />
    </main>
  );
}
