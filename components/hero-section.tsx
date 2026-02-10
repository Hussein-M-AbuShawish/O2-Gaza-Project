"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const floatingImages = [
  { src: "/images/burger.jpg", alt: "برجر لذيذ", className: "top-[15%] right-[10%] w-32 h-32 md:w-44 md:h-44" },
  { src: "/images/shawarma.jpg", alt: "شاورما", className: "top-[60%] right-[5%] w-28 h-28 md:w-36 md:h-36" },
  { src: "/images/dessert.jpg", alt: "حلويات", className: "top-[25%] left-[8%] w-28 h-28 md:w-40 md:h-40" },
  { src: "/images/drink.jpg", alt: "مشروبات", className: "bottom-[20%] left-[12%] w-24 h-24 md:w-32 md:h-32" },
  { src: "/images/falafel.jpg", alt: "فلافل", className: "top-[45%] left-[3%] w-24 h-24 md:w-28 md:h-28" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(200, 150, 80, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(200, 150, 80, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(200, 150, 80, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(200, 150, 80, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Floating food images */}
      {floatingImages.map((img, index) => (
        <motion.div
          key={img.src}
          className={`absolute ${img.className} hidden md:block`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: index * 0.2 },
            scale: { duration: 0.8, delay: index * 0.2 },
            y: { duration: 3 + index * 0.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50">
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary">O2</span>{" "}
            <span className="text-foreground">Gaza</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            مطعم أوتو غزة
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            تجربة طعام استثنائية تجمع بين الأصالة والحداثة، حيث نقدم لكم أشهى المأكولات في أجواء راقية ومميزة
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="#menu">استكشف قائمتنا</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-border hover:bg-secondary/50 transition-all bg-transparent"
            >
              <Link href="#contact">تواصل معنا</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1.5 },
          y: { duration: 1.5, repeat: Number.POSITIVE_INFINITY }
        }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  );
}
