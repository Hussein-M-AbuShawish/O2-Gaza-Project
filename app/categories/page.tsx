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
import italian from "@/public/menu/Italian/1.jpg";
import sandwiches from "@/public/menu/Western/43.jpg";
import easternSweets from "@/public/menu/Sweets/27.jpg";
import barSweets from "@/public/menu/Bar/16.jpg";
import westernSweets from "@/public/menu/Cake/11.2.jpg";
import drinks from "@/public/menu/drinks/13.jpg";
import salads from "@/public/menu/salad/20.jpeg";
const CATEGORY_DISPLAY = [
  { id: "shawarma", name: "الشاورما", image: shawarma, emoji: "🌯" },
  { id: "italian", name: "الإيطالي", image: italian, emoji: "🍕" },
  { id: "sandwiches", name: "السندويشات", image: sandwiches, emoji: "🥪" },
  { id: "easternSweets", name: "الحلويات الشرقية", image: easternSweets, emoji: "🍰" },
  { id: "westernSweets", name: "الكيك والحلويات", image: westernSweets, emoji: "🎂" },
  { id: "barSweets", name: "حلويات البار", image: barSweets, emoji: "🍫" },
  { id: "drinks", name: "المشروبات", image: drinks, emoji: "🥤" },
  { id: "salads", name: "السلطات", image: salads, emoji: "🥗" },
];

export default function CategoriesPage() {
  const { selectedBranch } = useBranch();
  const branchMenu = getMenuByBranch(selectedBranch || "gaza");
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ radius: 210, itemSize: 110 });

  const availableCategories = useMemo(
    () => CATEGORY_DISPLAY.filter((cat) => branchMenu[cat.id as keyof typeof branchMenu]),
    [branchMenu]
  );

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      let newRadius, newItemSize;

      if (width < 480) {
        newRadius = Math.min(width * 0.36, 140);
        newItemSize = Math.min(width * 0.18, 75);
      } else if (width < 640) {
        newRadius = Math.min(width * 0.38, 180);
        newItemSize = Math.min(width * 0.16, 90);
      } else if (width < 1024) {
        newRadius = Math.min(width * 0.35, 220);
        newItemSize = 100;
      } else {
        newRadius = Math.min(width * 0.3, 260);
        newItemSize = 110;
      }

      setDimensions({ radius: newRadius, itemSize: newItemSize });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (availableCategories.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <Footer />
      </main>
    );
  }

  const total = availableCategories.length;
  const { radius, itemSize } = dimensions;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      {/* Header Section */}
      <div className="relative z-10 pt-24 md:pt-32 pb-8 md:pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link href="/select-branch">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 mb-8 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
              <span>اختر فرع آخر</span>
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              استكشف الأقسام
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {selectedBranch === "middle" ? "فرع الوسطى" : "فرع غزة"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Orbit Container */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-220px)] md:min-h-[calc(100vh-280px)] py-8 md:py-12">
        <div className="relative">
          {/* Multiple Orbit Rings */}
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-primary/20"
              style={{
                width: radius * 2 + 140 + ring * 20,
                height: radius * 2 + 140 + ring * 20,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                borderStyle: ring % 2 === 0 ? "dashed" : "dotted",
              }}
              animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 60 + ring * 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Main Rotating Container */}
          <motion.div
            className="relative cursor-pointer"
            style={{
              width: radius * 2 + 140,
              height: radius * 2 + 140,
            }}
            animate={isPaused ? {} : { rotate: 360 }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Category Items */}
            {availableCategories.map((category, index) => {
              const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={category.id}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    width: itemSize,
                    height: itemSize,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0, rotate: 90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                  }}
                >
                  <Link href={`/category/${category.id}`}>
                    <motion.div
                      className="relative w-full h-full rounded-full overflow-hidden cursor-pointer border-[3px] border-transparent hover:border-primary transition-all shadow-md hover:shadow-xl bg-card"
                      whileHover={{
                        scale: 1.15,
                        borderWidth: 4,
                        boxShadow: "0 10px 40px rgba(226, 0, 4, 0.4)",
                      }}
                      whileTap={{ scale: 1.1 }}
                      animate={{ rotate: -360 }}
                      transition={{
                        rotate: {
                          duration: 40,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                    >
                      {/* Category Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                          sizes={`${itemSize}px`}
                        />
                      </div>

                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Hover Glow Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/0 to-primary/0"
                        whileHover={{
                          background: "linear-gradient(to top, rgba(226, 0, 4, 0.2), transparent)",
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Category Name */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 z-10 text-center">
                        <motion.p
                          className="text-white font-bold leading-tight drop-shadow-lg"
                          style={{
                            fontSize: itemSize < 90 ? "0.6rem" : itemSize < 100 ? "0.65rem" : "0.75rem",
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {category.name}
                        </motion.p>
                      </div>

                      {/* Small Emoji Badge on Hover */}
                      <motion.div
                        className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-sm sm:text-base shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {category.emoji}
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Center Circle */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary to-primary/80 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(226,0,4,0.3)] z-20 border-4 border-primary/30"
              style={{
                width: Math.max(itemSize * 1.2, 100),
                height: Math.max(itemSize * 1.2, 100),
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
            >
              {/* Rotating Ring Inside Center */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-dashed border-white/20"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.span
                className="text-3xl sm:text-4xl md:text-5xl z-10"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🍽️
              </motion.span>
              <h2
                className="text-primary-foreground font-extrabold text-center mt-1 drop-shadow-lg z-10 leading-tight"
                style={{
                  fontSize: itemSize < 90 ? "0.85rem" : itemSize < 100 ? "0.95rem" : "1.1rem",
                }}
              >
                الأقسام
              </h2>
            </motion.div>
          </motion.div>

          {/* Instruction Text */}
          <motion.p
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            انقر على أي قسم لاستكشاف القائمة
          </motion.p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
