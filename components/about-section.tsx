"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-2 md:order-1"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/restaurant-interior.jpg"
                alt="داخل مطعم أوتو غزة"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/30 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <span className="text-primary text-sm font-medium tracking-wider mb-4 block">
              من نحن
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground text-balance">
              قصة <span className="text-primary">O2 Gaza</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                مرحباً بكم في أوتو غزة، حيث نجمع بين الأصالة والحداثة في كل طبق نقدمه. منذ تأسيسنا، التزمنا بتقديم أفضل تجربة طعام لعملائنا الكرام.
              </p>
              <p>
                نستخدم أجود المكونات الطازجة ونحضر أطباقنا بعناية فائقة لنضمن لكم مذاقاً استثنائياً في كل مرة تزوروننا فيها.
              </p>
              <p>
                فريقنا المتميز من الطهاة المحترفين يعمل بشغف لتقديم قائمة متنوعة من الأطباق الشرقية والغربية التي ترضي جميع الأذواق.
              </p>
            </div>
            
            {/* Stats mini */}
            <div className="flex gap-8 mt-8 pt-8 border-t border-border/50">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">فروع لمطعمنا</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">+50</div>
                <div className="text-sm text-muted-foreground">صنف مميز</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">+5000</div>
                <div className="text-sm text-muted-foreground">عميل سعيد</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
