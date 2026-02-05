"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getMenuByBranch } from "@/lib/menu-data";

// ❌ لا تستورد الصور هكذا (سيكسر البناء على Vercel)
// import shawarma from "@/public/menu/shawarma/53.jpg";
// import italian from "@/public/menu/italian/35.jpg";
// import sandwiches from "@/public/menu/western/43.jpg";
// import easternSweets from "@/public/menu/sweets/23.jpg";
// import bar from "@/public/menu/bar/16.jpg";
// import westernSweets from "@/public/menu/Cake/11.2.jpg";
// import drinks from "@/public/menu/drinks/13.jpg";
// import salads from "@/public/menu/salad/20.jpeg";
// import gelato from "@/public/menu/Gelato/72.jpeg";

// ✅ استخدم المسار النصي مباشرة
const CATEGORY_DISPLAY = [
  { id: "shawarma", name: "الشاورما", image: "/menu/shawarma/53.jpg" },
  { id: "italian", name: "الإيطالي", image: "/menu/italian/35.jpg" },
  { id: "sandwiches", name: "الوجبات الغربية", image: "/menu/western/43.jpg" },
  { id: "easternSweets", name: "الحلويات الشرقية", image: "/menu/sweets/23.jpg" },
  { id: "westernSweets", name: "الكيك والحلويات", image: "/menu/Cake/38.jpg" },
  { id: "barSweets", name: "حلويات البار", image: "/menu/bar/14.jpg" },
  { id: "drinks", name: "المشروبات", image: "/menu/drinks/1.jpg" },
  { id: "salads", name: "المقبلات", image: "/menu/salad/20.jpeg" },
  { id: "gelato", name: "الجيلاتو", image: "/menu/Gelato/72.jpeg" },
];

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const branch =
    searchParams.get("branch") ||
    (typeof window !== "undefined" ? localStorage.getItem("branch") : null) ||
    "gaza";

  const branchMenu = getMenuByBranch(branch);

  const categories = useMemo(
    () => CATEGORY_DISPLAY.filter((c) => branchMenu[c.id as keyof typeof branchMenu]),
    [branchMenu]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (!categories.length) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#dc2626]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-72 md:h-72 bg-[#dc2626] rounded-full blur-[100px] md:blur-[120px] opacity-[0.08]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 md:w-72 md:h-72 bg-[#dc2626] rounded-full blur-[100px] md:blur-[120px] opacity-[0.08]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 mb-4 md:mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
              قائمة {branch === "middle" ? "فرع الوسطى" : "فرع غزة"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight"
          >
            استكشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] to-[#ef4444]">الأقسام</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/select-branch"
              className="group inline-flex items-center gap-2 mx-auto mt-6 rounded-lg
             bg-primary px-5 py-2.5 text-sm md:text-base font-medium
             text-primary-foreground
             transition-all duration-300
             hover:bg-primary/90 hover:gap-3
             focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span>تغيير الفرع الحالي</span>
              <ArrowLeft
                className="w-4 h-4 transition-transform duration-300
               group-hover:-translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24 md:pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {categories.map((cat, index) => (
            <motion.div key={cat.id}>
              <Link href={`/category/${cat.id}`} className="group block relative">
                <div className="relative h-[350px] md:h-[400px] w-full rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800/50 bg-zinc-900 transition-all duration-500 group-hover:border-[#dc2626]/30 group-hover:shadow-[0_0_40px_-10px_rgba(220,38,38,0.2)]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-90"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-[#dc2626] transition-colors">
                      {cat.name}
                    </h2>
                    <div className="w-12 h-1 bg-[#dc2626] rounded-full mb-4 md:mb-6 transform origin-center transition-all duration-500 group-hover:w-20 md:group-hover:w-24" />
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        عرض القائمة
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#dc2626]" />
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-[#dc2626] opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl md:rounded-3xl" />
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