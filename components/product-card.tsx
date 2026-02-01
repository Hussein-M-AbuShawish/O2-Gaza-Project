"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface MenuItem {
  name: string;
  price?: number;
  pricePerKg?: number;
  desc?: string;
  image: string;
  delivery?: boolean;
  active?: boolean;
}

interface ProductCardProps {
  item: MenuItem;
  index: number;
  onClick: () => void;
  byWeight?: boolean;
}

export function ProductCard({
  item,
  index,
  onClick,
  byWeight,
}: ProductCardProps) {
  const displayPrice = item.pricePerKg
    ? `${item.pricePerKg} ₪/كغ`
    : `${item.price} ₪`;

  const isUnavailable = item.delivery === false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className={`group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isUnavailable
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-2xl active:scale-[0.98]"
      }`}
    >
      {/* Outer border effect */}
      <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-300 pointer-events-none z-20" />

      {/* Image Container with overlay */}
      <div className="relative w-full overflow-hidden bg-secondary/50 aspect-square">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 ${
            !isUnavailable && "group-hover:scale-110"
          }`}
          sizes="(max-width: 500px) 50vw, (max-width: 768px) 33vw, 25vw"
        />

        {/* Image overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Unavailable Badge */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white font-bold text-sm text-center px-2">
              غير متاح
            </span>
          </div>
        )}

        {/* Price Badge - positioned on image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 + 0.2 }}
          className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg z-10"
        >
          {displayPrice}
        </motion.div>

        {/* Quick view indicator */}
        {!isUnavailable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap pointer-events-none"
          >
            اضغط للتفاصيل
          </motion.div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="text-sm md:text-base font-bold text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>

        {/* Description if available */}
        {item.desc && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {item.desc}
          </p>
        )}

        {/* Footer with weight indicator */}
        {byWeight && (
          <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10">
              ⚖️
            </span>
            <span>يباع بالوزن</span>
          </div>
        )}
      </div>

      {/* Hover background accent */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
        initial={false}
      />
    </motion.div>
  );
}
