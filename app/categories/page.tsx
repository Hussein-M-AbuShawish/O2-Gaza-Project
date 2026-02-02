"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useBranch } from "@/lib/branch-context";
import { getMenuByBranch } from "@/lib/menu-data";

// استيراد الصور (نفس الصور السابقة)
import shawarma from "@/public/menu/shawarma/13.jpg";
import italian from "@/public/menu/italian/35.jpg";
import sandwichess from "@/public/menu/western/43.jpg";
import easternSweets from "@/public/menu/sweets/23.jpg";
import barSweets from "@/public/menu/bar/16.jpg";
import westernSweets from "@/public/menu/Cake/11.2.jpg";
import drinkss from "@/public/menu/drinks/13.jpg";
import salads from "@/public/menu/salad/20.jpeg";
import gelatoo from "@/public/menu/Gelato/72.jpeg";

const CATEGORY_DISPLAY = [
  { id: "shawarma", name: "الشاورما", image: shawarma, },
  { id: "italian", name: "الإيطالي", image: italian, },
  { id: "sandwiches", name: "السندويشات", image: sandwichess, },
  { id: "easternSweets", name: "الحلويات الشرقية", image: easternSweets, },
  { id: "westernSweets", name: "الكيك والحلويات", image: westernSweets, },
  { id: "barSweets", name: "حلويات البار", image: barSweets, },
  { id: "drinks", name: "المشروبات", image: drinkss, },
  { id: "salads", name: "السلطات", image: salads, },
  { id: "gelato", name: "الجيلاتو", image: gelatoo, },
];

export default function CategoriesPage() {
  const { selectedBranch } = useBranch();
  const branchMenu = getMenuByBranch(selectedBranch || "gaza");

  const categories = useMemo(
    () => CATEGORY_DISPLAY.filter((c) => branchMenu[c.id as keyof typeof branchMenu]),
    [branchMenu]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (!categories.length) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#dc2626]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#dc2626] rounded-full blur-[120px] opacity-[0.08]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#dc2626] rounded-full blur-[120px] opacity-[0.08]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
              قائمة {selectedBranch === "middle" ? "فرع الوسطى" : "فرع غزة"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          >
            تذوق <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] to-[#ef4444]">الإبداع</span>
          </motion.h1>

          <Link href="/select-branch">
            <motion.button
              whileHover={{ x: -5 }}
              className="group flex items-center gap-2 mx-auto text-zinc-400 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium">تغيير الفرع الحالي</span>
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link href={`/category/${cat.id}`} className="group block relative">
                <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-zinc-800/50 bg-zinc-900 transition-all duration-500 group-hover:border-[#dc2626]/30 group-hover:shadow-[0_0_40px_-10px_rgba(220,38,38,0.2)]">

                  {/* Image with Parallax-like effect */}
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-90"
                  />

                  {/* Smart Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                  {/* Content Positioned at Bottom */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">


                    <h2 className="text-3xl font-black mb-2 group-hover:text-[#dc2626] transition-colors">
                      {cat.name}
                    </h2>

                    <div className="w-12 h-1 bg-[#dc2626] rounded-full mb-6 transform origin-center transition-all duration-500 group-hover:w-24" />

                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        عرض القائمة
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#dc2626]" />
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 border-2 border-[#dc2626] opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />

      <style jsx global>{`
        body {
          background-color: #050505;
        }
        /* Custom scrollbar for a premium feel */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>
    </main>
  );
}