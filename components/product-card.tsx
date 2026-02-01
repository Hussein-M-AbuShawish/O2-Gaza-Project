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
}: {
  item: MenuItem;
  index: number;
  onClick: () => void;
  byWeight?: boolean;
}) {
  const displayPrice = item.pricePerKg
    ? `${item.pricePerKg} ₪/كغ`
    : `${item.price} ₪`;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative bg-card rounded-xl overflow-hidden aspect-[3/4] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(226,0,4,0.3)] active:scale-[0.98]"
    >
      {item.delivery === false && (
        <div className="absolute top-2 left-2 z-10 w-10 h-10 bg-white/90 border-2 border-primary rounded-full flex items-center justify-center shadow-lg">
          <div className="absolute w-full h-[3px] bg-red-600 rotate-[-45deg] rounded" />
          <span className="text-lg">🚚</span>
        </div>
      )}
      <div className="relative w-full h-full">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          sizes="(max-width: 500px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
        <h3 className="text-sm md:text-base font-bold text-white leading-tight mb-1">
          {item.name}
        </h3>
        <div className="text-primary font-extrabold text-lg md:text-xl">
          {displayPrice}
        </div>
      </div>
    </motion.div>
  );
}
