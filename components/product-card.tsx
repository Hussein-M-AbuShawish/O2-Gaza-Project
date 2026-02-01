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
      className={`group relative bg-card rounded-lg ${
        item.active ? "" : "hidden"
      } overflow-hidden aspect-[3/4] cursor-pointer transition-all duration-300 ${
        isUnavailable ? "opacity-60" : "hover:shadow-md active:scale-[0.98]"
      }`}
    >
      {/* Image Container */}
      <div className="relative w-full h-2/3">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 ${
            !isUnavailable && "group-hover:scale-105"
          }`}
          sizes="(max-width: 500px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-4 h-1/3 flex flex-col justify-between bg-card">
        <h3 className="text-sm md:text-base font-semibold text-foreground leading-tight line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <span className="text-primary font-bold text-sm md:text-base">
            {displayPrice}
          </span>
          {isUnavailable && (
            <span className="text-xs text-muted-foreground font-medium">
              غير متاح
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
