"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

export function RotatingCategories({
  categories,
  branch,
}: {
  categories: Category[];
  branch: string;
}) {
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotation, setRotation] = useState(0);
  const itemCount = categories.length;
  const angleSlice = 360 / itemCount;

  // Auto-rotate every 3 seconds
  React.useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev - angleSlice);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating, angleSlice]);

  return (
    <div className="relative w-full h-auto min-h-[600px] md:min-h-[700px] flex items-center justify-center py-20">
      {/* Center text - fixed and non-rotatable */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center"
      >
        <p className="text-muted-foreground text-sm md:text-base mb-2">اختر القسم</p>
        <p className="text-2xl md:text-3xl font-bold text-primary text-balance">الأقسام</p>
      </motion.div>

      {/* Static ring background (visual reference) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />
          {/* Middle ring */}
          <div className="absolute inset-4 md:inset-6 rounded-full border border-primary/10" />
        </div>
      </div>

      {/* Rotating container for categories - only the ring rotates, items stay upright */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        onMouseEnter={() => setIsAutoRotating(false)}
        onMouseLeave={() => setIsAutoRotating(true)}
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          willChange: "transform",
        }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {categories.map((category, index) => {
            const angle = (index * angleSlice * Math.PI) / 180;
            const radius = 120; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={category.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <Link
                  href={`/category/${category.id}?branch=${branch}`}
                  className="block"
                >
                  <motion.div
                    // Counter-rotate to keep item upright while ring rotates
                    animate={{ rotate: -rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                    style={{
                      willChange: "transform",
                    }}
                  >
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-primary/40 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group bg-card flex flex-col items-center justify-center hover:bg-card/80"
                    >
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-primary/12 group-hover:from-primary/15 group-hover:to-primary/20 transition-colors duration-300" />

                      {/* Icon/Label */}
                      <div className="relative z-10 text-center px-2">
                        <div className="text-2xl md:text-3xl mb-1.5">
                          {category.icon}
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-foreground text-balance leading-tight line-clamp-2">
                          {category.name}
                        </div>
                      </div>
                    </div>

                    {/* Tooltip on hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-background border-2 border-primary/50 rounded-lg px-3 py-2 text-xs whitespace-nowrap pointer-events-none shadow-lg z-50"
                    >
                      اختر هذا القسم
                    </motion.div>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Drag indicator for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground pointer-events-none z-10"
      >
        حرّك فوق الحلقة لإيقاف الدوران
      </motion.div>
    </div>
  );
}
