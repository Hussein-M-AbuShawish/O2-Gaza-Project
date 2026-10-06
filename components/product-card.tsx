"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { imgSrc } from "../lib/img";

interface MenuItem {
  name: string;
  price?: number;
  pricePerKg?: number;
  variants?: { name: string; price: number }[];
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
  const getDisplayPrice = () => {
    if (item.pricePerKg) return `${item.pricePerKg} ₪/كغ`;
    if (item.variants && item.variants.length > 0) {
      const minPrice = Math.min(...item.variants.map((v) => v.price));
      return `تبدأ من ${minPrice} ₪`;
    }
    return `${item.price} ₪`;
  };

  const displayPrice = getDisplayPrice();

  // غير متوفر حالياً (من لوحة التحكم): يظهر ولا يُطلب
  const isOut = item.active === false;
  // لا توصيل: يظهر ويُطلب من المطعم فقط
  const isUnavailable = item.delivery === false || isOut;

  return (
    <motion.div
      // ظهور خفيف بلا تحجيم: التحجيم مع تأخير كل بطاقة كان يبدو كتكرار
      // للصور ثم انضمامها. التأخير محدود بأول 8 بطاقات فقط.
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index, 8) * 0.04,
        ease: "easeOut",
      }}
      // الرفع عند المرور عبر framer-motion نفسه — كان transition-all في CSS
      // يلاحق كل إطار من حركة الظهور فتتأخر البطاقة وتهتز يميناً ويساراً
      whileHover={isUnavailable ? undefined : { y: -4 }}
      whileTap={isUnavailable ? undefined : { scale: 0.98 }}
      onClick={onClick}
      aria-disabled={isOut || undefined}
      className={`group relative bg-card rounded-lg overflow-hidden aspect-[3/4] ${
        isOut ? "cursor-not-allowed" : "cursor-pointer"
      } transition-shadow duration-300 ${
        isUnavailable ? "" : "hover:shadow-lg hover:shadow-primary/10"
      }`}
    >
      {/* Image Container */}
      <div className={`relative w-full h-2/3 overflow-hidden ${isUnavailable && !isOut ? "opacity-60" : ""}`}>
        <Image
          src={imgSrc(item.image) || "/placeholder.svg"}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-500 ease-out ${
            isOut ? "grayscale" : !isUnavailable ? "group-hover:scale-105" : ""
          }`}
          sizes="(max-width: 500px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        {isOut && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-black/80 border border-white/20 text-white text-xs md:text-sm font-bold">
              غير متوفر حالياً
            </span>
          </div>
        )}
        {!isUnavailable && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
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
          {isOut ? (
            <span className="text-xs text-muted-foreground font-medium">غير متوفر</span>
          ) : isUnavailable ? (
            <span className="text-xs text-muted-foreground font-medium">غير متاح</span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
