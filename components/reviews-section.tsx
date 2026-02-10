"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "أحمد محمد",
    rating: 5,
    text: "من أفضل المطاعم التي زرتها! الطعام لذيذ جداً والخدمة ممتازة. أنصح الجميع بتجربة البرجر المميز.",
    date: "قبل أسبوع",
    likes: 24,
  },
  {
    id: 2,
    name: "سارة أحمد",
    rating: 5,
    text: "أجواء رائعة وطعام شهي. الشاورما هنا لا تُضاهى! سأعود بالتأكيد مرة أخرى.",
    date: "قبل أسبوعين",
    likes: 18,
  },
  {
    id: 3,
    name: "محمود علي",
    rating: 4,
    text: "تجربة مميزة مع العائلة. الأطفال أحبوا البيتزا والحلويات. الأسعار معقولة والجودة عالية.",
    date: "قبل شهر",
    likes: 31,
  },
  {
    id: 4,
    name: "فاطمة حسن",
    rating: 5,
    text: "خدمة التوصيل سريعة والطعام وصل ساخناً وطازجاً. أفضل مطعم للطلبات الخارجية.",
    date: "قبل 3 أيام",
    likes: 12,
  },
  {
    id: 5,
    name: "يوسف خالد",
    rating: 5,
    text: "المشاوي هنا استثنائية! اللحم طري ومتبل بشكل مثالي. تجربة لا تُنسى.",
    date: "قبل 5 أيام",
    likes: 27,
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState<Record<number, number>>(
    reviews.reduce((acc, review) => ({ ...acc, [review.id]: review.likes }), {})
  );
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleLike = (id: number) => {
    if (!liked[id]) {
      setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setLiked((prev) => ({ ...prev, [id]: true }));
    }
  };

  const visibleReviews = [
    reviews[(currentIndex - 1 + reviews.length) % reviews.length],
    reviews[currentIndex],
    reviews[(currentIndex + 1) % reviews.length],
  ];

  return (
    <section id="reviews" className="py-20 md:py-32">
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
            آراء العملاء
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            نفخر بثقة عملائنا ونسعى دائماً لتقديم أفضل تجربة
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border-border hover:bg-card hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border-border hover:bg-card hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Reviews */}
          <div className="overflow-hidden px-4 md:px-16">
            <div className="flex gap-6 justify-center">
              <AnimatePresence mode="popLayout">
                {visibleReviews.map((review, index) => (
                  <motion.div
                    key={`${review.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: index === 1 ? 1 : 0.5,
                      scale: index === 1 ? 1 : 0.9,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-full md:w-[350px] ${
                      index !== 1 ? "hidden md:block" : ""
                    }`}
                  >
                    <div className="relative p-6 rounded-2xl bg-card border border-border/50 h-full">
                      {/* Quote icon */}
                      <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? "text-primary fill-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="text-foreground mb-6 leading-relaxed">
                        {review.text}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div>
                          <p className="font-bold text-foreground">{review.name}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleLike(review.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                            liked[review.id]
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{likes[review.id]}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <Button variant="outline" size="icon" onClick={prevSlide}>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
