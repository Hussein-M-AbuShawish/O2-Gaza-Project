"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RotatingCategories } from "@/components/rotating-categories";
import { useBranch } from "@/lib/branch-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CATEGORIES = [
  { id: "shawarma", name: "الشاورما", icon: "🌯" },
  { id: "italian", name: "الإيطالي", icon: "🍕" },
  { id: "sandwiches", name: "السندويشات", icon: "🍔" },
  { id: "easternSweets", name: "الحلويات الشرقية", icon: "🍯" },
  { id: "westernSweets", name: "الكيك والحلويات", icon: "🍰" },
  { id: "barSweets", name: "حلويات البار", icon: "🍩" },
  { id: "drinks", name: "المشروبات", icon: "🥤" },
  { id: "salads", name: "السلطات", icon: "🥗" },
];

export default function MenuPage() {
  const { selectedBranch } = useBranch();
  const router = useRouter();

  // Redirect to select branch if no branch selected
  useEffect(() => {
    if (!selectedBranch) {
      router.push("/select-branch");
    }
  }, [selectedBranch, router]);

  if (!selectedBranch) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 md:pt-32 pb-20 md:pb-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-primary text-sm font-medium tracking-wider mb-4 block">
              قائمة الأطباق
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              اختر ما يروق لك
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              تصفح أقسامنا المتنوعة واختر أطباقك المفضلة
            </p>
          </motion.div>

          {/* Rotating Categories */}
          <RotatingCategories categories={CATEGORIES} branch={selectedBranch} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
