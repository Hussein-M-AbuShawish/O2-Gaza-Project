"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const menuItems = [
  { src: "/images/burger.jpg", alt: "برجر لذيذ", name: "البرجر المميز" },
  { src: "/images/shawarma.jpg", alt: "شاورما", name: "شاورما عربية" },
  { src: "/images/grilled-meat.jpg", alt: "مشاوي", name: "مشاوي متنوعة" },
  { src: "/images/falafel.jpg", alt: "فلافل", name: "فلافل طازجة" },
  { src: "/images/pizza.jpg", alt: "بيتزا", name: "بيتزا إيطالية" },
  { src: "/images/fresh-salad.jpg", alt: "سلطات", name: "سلطات طازجة" },
  { src: "/images/dessert.jpg", alt: "حلويات", name: "حلويات شرقية" },
  { src: "/images/drink.jpg", alt: "مشروبات", name: "مشروبات منعشة" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export function MenuSection() {
  return (
    <section id="menu" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-wider mb-4 block">
            قائمتنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            استكشف أطباقنا المميزة
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            تشكيلة واسعة من الأطباق الشهية المحضرة بعناية من أجود المكونات
          </p>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {menuItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Link
                href="https://dainty-dragon-98cefd.netlify.app/"
                target="_blank"
                className="group block"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-foreground font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      {item.name}
                    </h3>
                    <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      عرض القائمة <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8"
          >
            <Link
              href="https://dainty-dragon-98cefd.netlify.app/"
              target="_blank"
              className="flex items-center gap-2"
            >
              عرض القائمة الكاملة
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
