"use client";

import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBasket,
  X,
  Plus,
  Minus,
  Phone,
  User,
  MapPin,
  Building,
  Check,
  Trash2,
  MessageCircle,
  FileText,
  Edit3,
  Send,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useBranch } from "@/lib/branch-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { getMenuByBranch } from "@/lib/menu-data";

// ================= CONFIGURATION =================
const CONFIG = {
  whatsappNumbers: {
    gaza: "972595201049",
    middle: "972597111811",
  },
  deliveryLocations: {
    gaza: [
      { name: "غزة - المدينة", price: 5 },
      { name: "غزة - الشمال", price: 8 },
      { name: "غزة - الرمال", price: 5 },
      { name: "غزة - الشيخ رضوان", price: 6 },
      { name: "غزة - النصر", price: 7 },
    ],
    middle: [
      { name: "النصيرات", price: 10 },
      { name: "البريج", price: 15 },
      { name: "سوارحة الشرقية", price: 15 },
      { name: "سوارحة الغربية", price: 15 },
      { name: "الزوايدة", price: 20 },
      { name: "المغازي", price: 25 },
      { name: "دير البلح", price: 30 },
    ],
  },
};

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

interface MenuCategory {
  title: string;
  byWeight?: boolean;
  items: MenuItem[];
}

interface CartItem {
  key: string;
  name: string;
  price: number;
  unitPrice: number;
  qty: number;
  weight: number | null;
  isByWeight: boolean;
}

interface OrderState {
  customerInfo: { name: string; phone: string; address: string };
  location: DeliveryLocation | null;
  province: string;
  notes: string;
}

interface DeliveryLocation {
  name: string;
  price: number;
}

// ================= LEGACY MENU DATA (FOR FALLBACK) =================
// This is kept for reference/fallback only. Branch-specific menus are in /lib/menu-data.ts

const menuData: Record<string, MenuCategory> = {
  shawarma: {
    title: "الشاورما",
    items: [
      { name: "بيتا شاورما", price: 15, image: "/menu/shawarma/54.jpg" },
      { name: "شاورما عادي", price: 15, image: "/menu/shawarma/48.jpg" },
      { name: "فرشوحه دبل", price: 17, image: "/menu/shawarma/5O1A7108.jpg" },
      {
        name: "فرشوحه دبل لحمة",
        price: 23,
        image: "/menu/shawarma/5O1A7124.jpg",
      },
      {
        name: "فرشوحه دبل دبل",
        price: 25,
        image:
          "https://images.unsplash.com/photo-1542574271-7f3b92e6c821?w=800&q=80",
        delivery: false,
      },
      { name: "سوري", price: 35, image: "/menu/shawarma/53.jpg" },
      {
        name: "صفيحة",
        price: 38,
        desc: "شاورما - جبنة - زيتون اسود",
        image: "/menu/shawarma/51.jpg",
      },
      {
        name: "باشكا",
        price: 40,
        desc: "خبزة باشكا - شاورما - جبنة - زيتون - صوص بيكانتي",
        image: "/menu/shawarma/18.jpg",
      },
      {
        name: "شاورما عربي",
        price: 38,
        desc: "قطع شاورما - جبنة - زيتون اسود",
        image: "/menu/shawarma/17.jpg",
      },
      {
        name: "شاورما نابلسي",
        price: 38,
        desc: "شاورما - بطاطا - صوص بيكانتي - جبنة - زيتون اسود",
        image: "/menu/shawarma/19.jpg",
      },
      { name: "صحن شاورما كبير", price: 30, image: "/menu/shawarma/14.jpg" },
      { name: "صحن شاورما صغير", price: 20, image: "/menu/shawarma/13.jpg" },
    ],
  },
  italian: {
    title: "الإيطالي",
    items: [
      {
        name: "كاليزوني دجاج",
        price: 25,
        desc: "صدر دجاج - جبنة - زيتون - رانش",
        image: "/menu/italian/35.jpg",
      },
      {
        name: "كاليزوني خضار",
        price: 15,
        desc: "فليفلة - بصل - ذرة - مشروم - زيتون",
        image: "/menu/italian/32.jpg",
      },
      {
        name: "بيتزا مكسيكي دجاج",
        price: 25,
        desc: "صدر دجاج - جبنة - زيتون",
        image: "/menu/italian/33.jpg",
      },
      {
        name: "ميجا",
        price: 30,
        desc: "صدر دجاج - فليفلة - مشروم - جرادة - بصل - كريمة طعام",
        image: "/menu/italian/34.jpg",
      },
      {
        name: "بيتزا",
        price: 20,
        desc: "خضار - ذرة - زيتون",
        image: "/menu/italian/32.jpg",
      },
      {
        name: "بيتزا ماما روزا بالاناناس",
        price: 20,
        desc: "أناناس",
        image: "/menu/italian/2.jpg",
      },
      {
        name: "نابولي",
        price: 20,
        desc: "بيتزا بالتونة والزيتون",
        image: "/menu/italian/3.jpg",
      },
      { name: "مارجريتا", price: 20, desc: "جبنة", image: "/menu/italian/1.jpg" },
      {
        name: "صوص إضافي",
        price: 3,
        image:
          "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80",
      },
    ],
  },
  sandwiches: {
    title: "السندويشات الغربية",
    items: [
      {
        name: "زينجر",
        price: 25,
        desc: "شرائح صدر دجاج متبّلة مع بندورة طازجة، جرجير، حلقات بصل",
        image: "/menu/western/44.jpg",
      },
      {
        name: "بيف برجر",
        price: 25,
        desc: "قطعة لحمة - بصل - بندورة - جبنة - مخلل - صوص بيكانتي",
        image: "/menu/western/40.jpg",
      },
      {
        name: "بيغ ماك",
        price: 35,
        desc: "قطعتين لحمة - بصل - بندورة - جبنة - مخلل - صوص بيكانتي",
        image: "/menu/western/46.jpg",
      },
      {
        name: "تشكن بيتزا",
        price: 25,
        desc: "صدر دجاج - مشروم - فليفلة - بصل - زيتون اسود - جبنة",
        image: "/menu/western/42.jpg",
      },
      {
        name: "شيش طاووق",
        price: 25,
        desc: "فخد دجاج - جرجير - بندورة -مخلل -صوص بيكانتي",
        image: "/menu/western/47.jpg",
      },
      {
        name: "فطيرة الذهبية",
        price: 25,
        desc: "صدر دجاج - فليفلة - بصل - زيتون اسود - جبنة - ذرة - كريمة طعام",
        image: "/menu/western/43.jpg",
      },
    ],
  },
  easternSweets: {
    title: "الحلويات الشرقية",
    byWeight: true,
    items: [
      { name: "نمورة", pricePerKg: 25, image: "/menu/sweets/25.jpg" },
      { name: "معكوفة لوز", pricePerKg: 35, image: "/menu/sweets/6.jpg" },
      { name: "سرة", pricePerKg: 35, image: "/menu/sweets/2.jpg" },
      { name: "معكوفة عين جمل", pricePerKg: 35, image: "/menu/sweets/26.jpg" },
      { name: "وربات", pricePerKg: 35, image: "/menu/sweets/2.jpg" },
      { name: "كلاج", pricePerKg: 30, image: "/menu/sweets/3.jpg" },
      { name: "عش البلبل", pricePerKg: 35, image: "/menu/sweets/7.jpg" },
      { name: "سنيورة", pricePerKg: 35, image: "/menu/sweets/8.jpg" },
      { name: "كلّ وشكر", pricePerKg: 35, image: "/menu/sweets/5.jpg" },
      { name: "كنافة عربية", pricePerKg: 40, image: "/menu/sweets/11.jpg" },
      {
        name: "بسبوسة نوتيلا",
        pricePerKg: 40,
        image: "/menu/sweets/5K7A6205.jpg",
      },
      { name: "بقلاوة عين جمل", pricePerKg: 55, image: "/menu/sweets/41.jpg" },
      { name: "بقلاوة لوز", pricePerKg: 48, image: "/menu/sweets/9.jpg" },
      { name: "بقلاوة حلبي", pricePerKg: 100, image: "/menu/sweets/10.jpg" },
      {
        name: "أساور لوز",
        pricePerKg: 48,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      },
      {
        name: "أساور كاجو",
        pricePerKg: 48,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      },
      { name: "نابلسية", pricePerKg: 50, image: "/menu/sweets/23.jpg" },
      { name: "كاسات مكسرات", pricePerKg: 80, image: "/menu/sweets/24.jpg" },
      {
        name: "بورما حلبي",
        pricePerKg: 100,
        image:
          "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80",
        delivery: false,
      },
      {
        name: "بلورية حلبي",
        pricePerKg: 130,
        image:
          "https://images.unsplash.com/photo-1571167530149-c6f274f6db8f?w=800&q=80",
      },
      { name: "دولمة حلبي", pricePerKg: 130, image: "/menu/sweets/27.jpg" },
    ],
  },
  westernSweets: {
    title: "الكيك والحلويات الغربية",
    items: [
      { name: "قالب كيك صغير", price: 60, image: "/menu/cake/9.jpg" },
      { name: "قالب كيك كبير", price: 80, image: "/menu/cake/10.jpg" },
      { name: "قالب كيك سبيشل", price: 120, image: "/menu/cake/38.jpg" },
      { name: "سويس رول", price: 8, image: "/menu/cake/31.jpg" },
      { name: "تريلتشا", price: 10, image: "/menu/cake/21.jpg" },
      {
        name: "قطع كيك سبيشل",
        price: 15,
        desc: "نوتيلا / بيستاشيو / لوتس",
        image: "/menu/cake/30.jpg",
      },
      {
        name: "سوبريم",
        price: 20,
        desc: "لوتس - نوتيلا - بيستاشيو",
        image: "/menu/cake/28.jpg",
      },
      {
        name: "موس نوتيلا",
        price: 15,
        desc: "كيندر- لوتس - نوتيلا - بيستاشيو",
        image: "/menu/cake/4.jpg",
      },
      { name: "تشيس كيك", price: 15, image: "/menu/cake/7.jpg" },
      { name: "كرانش بار", price: 15, image: "/menu/cake/23.jpg" },
      { name: "قالب نص بلاطة", price: 150, image: "/menu/cake/8.jpg" },
    ],
  },
  barSweets: {
    title: "حلويات البار",
    items: [
      { name: "كريب شوكولاتة", price: 15, image: "/menu/bar/16.jpg" },
      {
        name: "كريب (نوتيلا / بيستاشيو / لوتس)",
        price: 30,
        image: "/menu/bar/64.jpg",
      },
      { name: "كريب دبي", price: 30, image: "/menu/bar/14.jpg" },
      {
        name: "بان كيك نوتيلا",
        price: 30,
        desc: "نوتيلا / بيستاشيو / لوتس",
        image: "/menu/bar/13.jpg",
      },
      { name: "رينجز", price: 25, image: "/menu/bar/56.jpg" },
      { name: "لقيمات شوكولاتة", price: 15, image: "/menu/bar/15.jpg" },
      {
        name: "لقيمات (نوتيلا / بيستاشيو / لوتس)",
        price: 30,
        image: "/menu/bar/55.jpg",
      },
      {
        name: "بان كيك شوكولاتة",
        price: 15,
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      },
      { name: "مولتن كيك", price: 25, image: "/menu/bar/37.jpg" },
      { name: "هوت كيك", price: 25, image: "/menu/bar/59.jpg" },
      { name: "براونيز", price: 25, image: "/menu/bar/38.jpg" },
      { name: "كنافة نويتلا", price: 15, image: "/menu/bar/58.jpg" },
    ],
  },
  drinks: {
    title: "المشروبات",
    items: [
      { name: "عصير الموسم", price: 12, image: "/menu/drinks/1.jpg" },
      { name: "عصير أناناس", price: 12, image: "/menu/drinks/2.jpg" },
      { name: "ليمون ونعنع", price: 12, image: "/menu/drinks/3.jpg" },
      { name: "أفوكادو", price: 18, image: "/menu/drinks/4.jpg" },
      { name: "شوكو بارد", price: 12, image: "/menu/drinks/7.jpg" },
      { name: "ايس موكا", price: 12, image: "/menu/drinks/5.jpg" },
      { name: "آيس كافي", price: 12, image: "/menu/drinks/10.jpg" },
      { name: "ميلك شيك", price: 15, image: "/menu/drinks/8.jpg" },
      { name: "موهيتو", price: 25, image: "/menu/drinks/16.jpg" },
      { name: "آيس كريم", price: 10, image: "/menu/drinks/14.jpg" },
      { name: "براد", price: 5, image: "/menu/drinks/15.jpg" },
      { name: "نسكافيه", price: 7, image: "/menu/drinks/9.jpg" },
      { name: "شاي", price: 5, image: "/menu/drinks/11.jpg" },
      { name: "بلو", price: 4, image: "/menu/drinks/17.jpg" },
      { name: "كوكا كولا", price: 4, image: "/menu/drinks/18.jpg" },
      { name: "سبرايت", price: 4, image: "/menu/drinks/19.jpg" },
      { name: "مياه معدنية 200 ملم", price: 1, image: "/menu/drinks/12.jpg" },
      { name: "مياه معدنية 500 ملم", price: 2, image: "/menu/drinks/13.jpg" },
    ],
  },
  salads: {
    title: "السلطات",
    items: [
      {
        name: "سلطات مشكلة",
        image: "/menu/salad/1.jpeg",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "ذرة مايونيز ",
        image: "/menu/salad/5.jpeg",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "بيكانتي ",
        image: "/menu/salad/1.jpeg",
        desc: "ذرة مايونيز / بيكانتي / تركية / ثومية",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "تركية",
        image: "/menu/salad/4.jpeg",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "ثومية",
        image: "/menu/salad/2.jpeg",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "ملفوف",
        image: "/menu/salad/3.jpeg",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "كول سلو",
        image: "/menu/salad/6.jpeg",
        variants: [
          { name: "كبير", price: 15 },
          { name: "وسط", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
      {
        name: "بطاطا",
        image: "/menu/salad/20.jpeg",
        variants: [
          { name: "كبير", price: 10 },
          { name: "صغير", price: 5 },
        ],
      },
    ],
  },
};

// Toast Component
function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[3000] bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-2xl font-bold text-center max-w-[90vw]"
    >
      {message}
    </motion.div>
  );
}

// Product Modal Component
function ProductModal({
  product,
  isByWeight,
  onClose,
  onAddToCart,
  whatsappNumber,
}: {
  product: MenuItem | null;
  isByWeight: boolean;
  onClose: () => void;
  onAddToCart: (
    product: MenuItem,
    qty: number,
    weight: number,
    price: number,
    isByWeight: boolean
  ) => void;
  whatsappNumber: string;
}) {
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(1);
  const [priceInput, setPriceInput] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants ? product.variants[0] : null
  );

  const calculatedPrice = useMemo(() => {
    if (isByWeight && product?.pricePerKg) {
      return weight * product.pricePerKg;
    }
    if (selectedVariant) {
      return selectedVariant.price * qty;
    }
    return (product?.price || 0) * qty;
  }, [isByWeight, product, weight, qty, selectedVariant]);

  const canDeliver = product?.delivery !== false;

  const handlePriceInput = (value: string) => {
    setPriceInput(value);
    const val = parseFloat(value);
    if (!isNaN(val) && val > 0 && product?.pricePerKg) {
      setWeight(val / product.pricePerKg);
    }
  };

  const handleWeightPreset = (w: number) => {
    setWeight(w);
    setPriceInput("");
  };

  const adjustWeight = (delta: number) => {
    const newWeight = Math.max(0.25, parseFloat((weight + delta).toFixed(2)));
    setWeight(newWeight);
    setPriceInput("");
  };

  const whatsappText = useMemo(() => {
    if (!product) return "";
    if (isByWeight && weight > 0) {
      return `أريد طلب: ${product.name} - وزن ${weight.toFixed(2)} كغ (السعر ${calculatedPrice.toFixed(1)} شيكل)`;
    }
    const variantStr = selectedVariant ? ` (${selectedVariant.name})` : "";
    return `أريد طلب: ${product.name}${variantStr} × ${qty}`;
  }, [product, isByWeight, weight, qty, calculatedPrice, selectedVariant]);

  const handleAddToCart = () => {
    if (!product || !canDeliver) return;
    if (isByWeight && (calculatedPrice <= 0 || weight <= 0)) return;

    let finalProduct = product;
    if (selectedVariant) {
      finalProduct = {
        ...product,
        name: `${product.name} - ${selectedVariant.name}`,
        price: selectedVariant.price,
      };
    }

    onAddToCart(finalProduct, qty, weight, calculatedPrice, isByWeight);
    onClose();
  };

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-3 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 md:h-64">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/80 hover:text-white text-3xl"
          >
            <X className="w-8 h-8" />
          </button>

          <h2 className="text-xl md:text-2xl font-bold mb-2">{product.name}</h2>
          {product.desc && (
            <p className="text-muted-foreground text-sm mb-3">{product.desc}</p>
          )}

          <div className="text-2xl md:text-3xl font-extrabold text-primary mb-4">
            {calculatedPrice.toFixed(1)} ₪
            {isByWeight && (
              <span className="text-sm text-muted-foreground font-normal block">
                ({weight.toFixed(2)} كغ × {product.pricePerKg} ₪/كغ)
              </span>
            )}
          </div>

          {!canDeliver && (
            <div className="bg-secondary border-2 border-primary rounded-xl p-4 mb-4 flex items-center justify-center gap-2">
              <span className="font-bold">
                🚫 هذا المنتج متوفر للطلب من{" "}
                <span className="text-primary">المطعم فقط</span> - لا يوجد توصيل
              </span>
            </div>
          )}

          {isByWeight && canDeliver && (
            <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 mb-4">
              <label className="block text-right mb-2 font-bold text-sm">
                💰 أدخل المبلغ الذي تريد دفعه (شيكل)
              </label>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => handlePriceInput(e.target.value)}
                placeholder="أدخل السعر"
                className="w-full p-3 bg-white text-black rounded-lg text-center text-xl font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[0.25, 0.5, 0.75, 1].map((w) => (
                  <button
                    key={w}
                    onClick={() => handleWeightPreset(w)}
                    className={`py-2 px-3 border-2 border-primary rounded-lg font-semibold transition-colors ${weight === w && !priceInput ? "bg-primary text-primary-foreground" : "bg-transparent text-white"}`}
                  >
                    {w} كغ
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants && (
            <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 mb-4">
              <label className="block text-right mb-2 font-bold text-sm">
                🏷️ اختر النوع / الحجم
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v)}
                    className={`py-2 px-1 border-2 border-primary rounded-lg font-semibold transition-colors text-xs md:text-sm ${selectedVariant?.name === v.name ? "bg-primary text-primary-foreground" : "bg-transparent text-white"}`}
                  >
                    {v.name} ({v.price} ₪)
                  </button>
                ))}
              </div>
            </div>
          )}

          {canDeliver && (
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => (isByWeight ? adjustWeight(-1) : setQty(Math.max(1, qty - 1)))}
                className="w-11 h-11 rounded-xl border-2 border-primary bg-transparent text-white flex items-center justify-center transition-all active:bg-primary active:scale-90"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-extrabold min-w-[80px] text-center">
                {isByWeight ? `${weight.toFixed(2)} كغ` : qty}
              </span>
              <button
                onClick={() => (isByWeight ? adjustWeight(1) : setQty(qty + 1))}
                className="w-11 h-11 rounded-xl border-2 border-primary bg-transparent text-white flex items-center justify-center transition-all active:bg-primary active:scale-90"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}

          {canDeliver && (
            <>
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold mb-3 transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBasket className="w-5 h-5" />
                أضف إلى السلة
              </button>

            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Cart Modal Component
function CartModal({
  cart,
  onClose,
  onUpdateQty,
  onClear,
  onCheckout,
}: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (index: number, change: number) => void;
  onClear: () => void;
  onCheckout: () => void;
}) {
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[2100] flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-5 pb-3 border-b-2 border-primary">
          سلة الطلبات
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">السلة فارغة</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div
                key={item.key}
                className="flex justify-between items-center bg-white/5 p-3 rounded-xl gap-3"
              >
                <div className="flex-1 text-right text-sm">
                  <b>
                    {item.name}
                    {item.isByWeight && ` (${item.weight?.toFixed(2)} كغ)`}
                  </b>
                  <div className="text-muted-foreground text-xs">
                    السعر: {item.price.toFixed(1)}₪
                  </div>
                  <div className="text-primary font-bold">
                    الإجمالي: {(item.price * item.qty).toFixed(1)}₪
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg">
                  <button
                    onClick={() => onUpdateQty(idx, -1)}
                    className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-5 text-center text-sm">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(idx, 1)}
                    className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xl font-extrabold text-primary text-center my-5 p-4 bg-primary/10 rounded-xl">
          المجموع: {total.toFixed(1)} ₪
        </div>

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full py-3.5 rounded-xl bg-[#25d366] text-white font-bold mb-3 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          إتمام الطلب
        </button>
        <button
          onClick={onClear}
          className="w-full py-3.5 rounded-xl bg-secondary text-secondary-foreground font-bold mb-3 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          إفراغ السلة
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          إغلاق
        </button>
      </motion.div>
    </motion.div>
  );
}

// Customer Form Modal Component
function CustomerFormModal({
  onClose,
  onBack,
  onSubmit,
  deliveryLocations,
  branch,
  initialData,
}: {
  onClose: () => void;
  onBack: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    address: string;
    location: DeliveryLocation;
    notes: string;
  }) => void;
  deliveryLocations: typeof CONFIG.deliveryLocations;
  branch: string;
  initialData?: {
    name: string;
    phone: string;
    address: string;
    location: DeliveryLocation | null;
    notes: string;
  };
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [locationName, setLocationName] = useState<string>(initialData?.location?.name || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const locations = deliveryLocations[branch as keyof typeof deliveryLocations] || [];
  const selectedLocation = locations.find((l) => l.name === locationName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !selectedLocation) return;
    onSubmit({
      name,
      phone,
      address,
      location: selectedLocation,
      notes,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[2100] flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-5 text-center flex items-center justify-center gap-2">
          <User className="w-6 h-6 text-primary" />
          معلومات التوصيل
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-right">
            <label className="block mb-1 font-semibold text-muted-foreground text-sm">
              <User className="w-4 h-4 inline ml-1" />
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
              required
              className="w-full p-3 rounded-xl border border-primary/30 bg-white/5 text-white transition-colors focus:outline-none focus:border-primary focus:bg-white/10"
            />
          </div>

          <div className="text-right">
            <label className="block mb-1 font-semibold text-muted-foreground text-sm">
              <Phone className="w-4 h-4 inline ml-1" />
              رقم الهاتف *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="059XXXXXXXX"
              required
              maxLength={10}
              className="w-full p-3 rounded-xl border border-primary/30 bg-card text-white appearance-none cursor-pointer transition-colors focus:outline-none focus:border-primary"
            />
          </div>

          <div className="text-right">
            <label className="block mb-1 font-semibold text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 inline ml-1" />
              منطقة التوصيل *
            </label>
            <select
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-primary/30 bg-card text-white appearance-none cursor-pointer transition-colors focus:outline-none focus:border-primary"
            >
              <option value="">-- اختر المنطقة --</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} - رسوم التوصيل: {loc.price} ₪
                </option>
              ))}
            </select>
            {selectedLocation && (
              <div className="mt-2 p-3 bg-primary/10 border-2 border-primary rounded-xl text-center font-bold text-primary">
                رسوم التوصيل: {selectedLocation.price} ₪
              </div>
            )}
          </div>

          <div className="text-right">
            <label className="block mb-1 font-semibold text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 inline ml-1" />
              العنوان بالتفصيل *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: حي الشيخ رضوان، شارع الجلاء، بجانب مسجد..."
              required
              rows={3}
              className="w-full p-3 rounded-xl border border-primary/30 bg-white/5 text-white resize-y transition-colors focus:outline-none focus:border-primary focus:bg-white/10"
            />
          </div>

          <div className="text-right">
            <label className="block mb-1 font-semibold text-muted-foreground text-sm">
              <MessageCircle className="w-4 h-4 inline ml-1" />
              ملاحظات الطلب (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: بدون بصل، إضافة جبنة زيادة، طلب خاص..."
              rows={3}
              className="w-full p-3 rounded-xl border border-primary/30 bg-white/5 text-white resize-y transition-colors focus:outline-none focus:border-primary focus:bg-white/10"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            تاكيد الطلب
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-xl bg-secondary text-secondary-foreground font-bold mt-3 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          العودة للسلة
        </button>
      </motion.div>
    </motion.div>
  );
}

// Confirmation Modal with Invoice
function ConfirmationModal({
  cart,
  customerInfo,
  location,
  branch,
  onClose,
  onEdit,
  onSend,
  onChangeBranch,
  notes = "",
}: {
  cart: CartItem[];
  customerInfo: { name: string; phone: string; address: string };
  location: DeliveryLocation;
  branch: string;
  onClose: () => void;
  onEdit: () => void;
  onSend: () => void;
  onChangeBranch: () => void;
  notes?: string;
}) {
  const itemsTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const grandTotal = itemsTotal + location.price;
  const branchName = branch === "gaza" ? "محافظة غزة" : "المحافظة الوسطى";
  const fullAddress = `${branchName} - ${location.name} - ${customerInfo.address}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[2100] flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl w-full max-w-lg p-4 max-h-[90vh] overflow-y-auto border-2 border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-left text-white/80 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2 clear-both">
          <FileText className="w-6 h-6" />
          تأكيد الطلب
        </h2>

        {/* Invoice */}
        <div className="bg-white text-black rounded-xl p-4 mb-4 overflow-x-auto">
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h3 className="text-primary text-xl font-bold">
              🍽️ O<sub>2</sub> Restaurant
            </h3>
            <p className="text-gray-500 text-sm">فاتورة طلب توصيل</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm">
            <div className="flex mb-2">
              <span className="font-bold text-gray-700 min-w-[60px]">
                👤 الاسم:
              </span>
              <span className="text-gray-600 flex-1">
                {customerInfo.name}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="font-bold text-gray-700 min-w-[60px]">
                📱 الهاتف:
              </span>
              <span className="text-gray-600 flex-1">
                {customerInfo.phone}
              </span>
            </div>
            <div className="flex">
              <span className="font-bold text-gray-700 min-w-[60px]">
                📍 العنوان:
              </span>
              <span className="text-gray-600 flex-1 break-words">
                {fullAddress}
              </span>
            </div>
          </div>

          <table className="w-full border-collapse text-xs md:text-sm mb-4 min-w-[280px]">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-2 text-right">الصنف</th>
                <th className="p-2 text-center">الكمية</th>
                <th className="p-2 text-center">السعر</th>
                <th className="p-2 text-center">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.key} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-2 text-right font-semibold max-w-[150px]">
                    {item.name}
                    {item.isByWeight && (
                      <span className="block text-gray-500 text-xs">
                        ({item.weight?.toFixed(2)} كغ)
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center">{item.qty}</td>
                  <td className="p-2 text-center">
                    {item.isByWeight
                      ? `${item.unitPrice} ₪/كغ`
                      : `${item.unitPrice} ₪`}
                  </td>
                  <td className="p-2 text-center">
                    {(item.price * item.qty).toFixed(1)} ₪
                  </td>
                </tr>
              ))}
              <tr className="bg-amber-50 border-b-2 border-primary">
                <td className="p-2 text-right font-semibold text-orange-600">
                  🚚 رسوم التوصيل
                </td>
                <td className="p-2 text-center text-orange-600">-</td>
                <td className="p-2 text-center text-orange-600">
                  {location.name}
                </td>
                <td className="p-2 text-center font-semibold text-orange-600">
                  {location.price} ₪
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bg-gradient-to-l from-primary to-red-500 text-white p-3 rounded-xl flex items-center justify-between">
            <div className="text-sm">إجمالي الفاتورة</div>
            <div className="text-2xl font-extrabold">
              {grandTotal.toFixed(1)} ₪
            </div>
          </div>

          {notes && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 mt-4">
              <div className="font-bold text-blue-900 text-sm mb-1">📝 ملاحظات الطلب:</div>
              <div className="text-gray-700 text-sm whitespace-pre-wrap">{notes}</div>
            </div>
          )}

          <div className="text-center mt-4 pt-4 border-t-2 border-dashed border-gray-300 text-gray-500 text-xs">
            <p>شكراً لطلبكم من O2 Restaurant 🙏</p>
            <p>سيتم التواصل معكم قريباً</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold flex items-center justify-center gap-2"
            >
              <Edit3 className="w-5 h-5" />
              تعديل
            </button>
            <button
              onClick={onSend}
              className="flex-1 py-3 rounded-xl bg-[#25d366] text-white font-bold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              إرسال الطلب
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CategoryPageContent({ defaultBranch }: { defaultBranch: string }) {
  const params = useParams();
  const categoryId = params.id as string;
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { cart, addToCart: addToGlobalCart, clearCart, updateQty } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [orderNotes, setOrderNotes] = useState("");

  // Get menu data for the current branch - each branch has independent menu
  const branchMenu = getMenuByBranch(defaultBranch);
  const categoryData = branchMenu[categoryId];
  const isByWeight = categoryData?.byWeight || false;

  const handleChangeBranch = useCallback(() => {
    router.push("/select-branch");
  }, [router]);

  const getWhatsAppNumber = useCallback(() => {
    return (
      defaultBranch &&
      CONFIG.whatsappNumbers[defaultBranch as keyof typeof CONFIG.whatsappNumbers]
    ) || CONFIG.whatsappNumbers.middle;
  }, [defaultBranch]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  const handleAddToCart = useCallback(
    (
      product: MenuItem,
      qty: number,
      weight: number,
      price: number,
      isByWeight: boolean
    ) => {
      if (product.delivery === false) {
        showToast("هذا المنتج غير متاح للتوصيل");
        return;
      }

      const itemKey = isByWeight ? `${product.name}-${weight}` : product.name;

      addToGlobalCart({
        key: itemKey,
        name: product.name,
        price: isByWeight ? price : product.price!,
        unitPrice: isByWeight ? product.pricePerKg! : product.price!,
        qty: isByWeight ? 1 : qty,
        weight: isByWeight ? weight : null,
        isByWeight,
      });

      showToast(`تم إضافة ${product.name} إلى السلة`);
    },
    [addToGlobalCart, showToast]
  );

  const handleUpdateCartQty = useCallback((index: number, change: number) => {
    const item = cart[index];
    if (item) {
      updateQty(item.key, item.qty + change);
    }
  }, [cart, updateQty]);

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    // التحقق من وقت العمل (من 10 صباحاً حتى 12 ليلاً)
    const now = new Date();
    const currentHour = now.getHours();

    // وقت العمل من 10 صباحاً (10) حتى 6 مساءً (18)
    if (currentHour >= 10 && currentHour < 22) {

    } else {
      showToast(
        "عذراً، المطعم مغلق حالياً. أوقات العمل من 10:00 صباحاً حتى 12:00 ليلاً."
      );
      return;
    }

    if (cart.length === 0) {
      showToast("السلة فارغة");
      return;
    }
    setIsCartOpen(false);
    setIsCustomerFormOpen(true);
  }, [cart.length, showToast]);

  const handleCustomerSubmit = useCallback(
    (data: {
      name: string;
      phone: string;
      address: string;
      location: DeliveryLocation;
      notes: string;
    }) => {
      setCustomerInfo({
        name: data.name,
        phone: data.phone,
        address: data.address,
      });
      setSelectedLocation(data.location);
      setOrderNotes(data.notes);
      setIsCustomerFormOpen(false);
      setIsConfirmationOpen(true);
    },
    []
  );

  const handleSendOrder = useCallback(() => {
    if (!selectedLocation) return;

    let itemsTotal = 0;
    const provinceName = defaultBranch === "gaza" ? "محافظة غزة" : "المحافظة الوسطى";
    const fullAddress = `${provinceName} - ${selectedLocation.name} - ${customerInfo.address}`;
    const targetNumber = getWhatsAppNumber();

    let msg = "🍽️ *طلب جديد من O2 Restaurant*\n━━━━━━━━━━━━━━\n\n";
    msg += `👤 *بيانات العميل:*\n`;
    msg += `• الاسم: ${customerInfo.name}\n`;
    msg += `• الهاتف: ${customerInfo.phone}\n`;
    msg += `• العنوان: ${fullAddress}\n\n`;
    msg += "📋 *تفاصيل الطلب:*\n";
    msg += "┌────────────────────────┐\n";

    cart.forEach((i) => {
      const itemTotal = i.price * i.qty;
      itemsTotal += itemTotal;
      const displayName = i.isByWeight
        ? `${i.name} (${i.weight?.toFixed(2)} كغ)`
        : i.name;
      const unitPriceDisplay = i.isByWeight
        ? `${i.unitPrice} ₪/كغ`
        : `${i.unitPrice} ₪`;
      msg += `│ ${displayName}\n`;
      msg += `│   الكمية: ${i.qty} | السعر: ${unitPriceDisplay}\n`;
      msg += `│   المبلغ: ${itemTotal.toFixed(1)} ₪\n`;
      msg += `├────────────────────────┤\n`;
    });

    msg += `│ 🚚 رسوم التوصيل: ${selectedLocation.price} ₪\n`;
    msg += `└────────────────────────┘\n\n`;

    if (orderNotes) {
      msg += `📝 *ملاحظات الطلب:*\n${orderNotes}\n\n`;
    }

    msg += `━━━━━━━━━━━━━━\n`;
    msg += `💵 *إجمالي الفاتورة: ${(itemsTotal + selectedLocation.price).toFixed(1)} ₪*`;

    window.open(
      `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`
    );

    // Reset state
    setCustomerInfo({ name: "", phone: "", address: "" });
    setOrderNotes("");
    setIsConfirmationOpen(false);
  }, [cart, customerInfo, selectedLocation, orderNotes, getWhatsAppNumber]);

  const cartTotal = cart.reduce((acc, item) => acc + item.qty, 0);
  const currentProvince = defaultBranch;

  if (!categoryData) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <p className="text-xl text-muted-foreground">القسم غير موجود</p>
          <Link href="/categories">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              الأقسام
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 md:pt-28 pb-20 md:pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <Link href="/categories">
              <Button
                variant="outline"
                className="text-foreground bg-primary border-border hover:text-amber-50 hover:bg-primary/90 gap-2  "
              >
                <ChevronLeft className="w-4 h-4" />
                الأقسام
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-primary text-xs md:text-sm font-semibold tracking-wider mb-2 block uppercase">
              {categoryId}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {categoryData.title}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              اختر من مجموعة متنوعة من المنتجات الطازجة والمميزة
            </p>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
          >
            {categoryData.items.map((item, index) => (
              <ProductCard
                key={item.name}
                item={item}
                index={index}
                onClick={() => setSelectedProduct(item)}
                byWeight={isByWeight}
              />
            ))}
          </motion.div>
        </div>
      </div>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] z-[1500]"
      >
        <ShoppingBasket className="w-6 h-6 md:w-7 md:h-7" />
        {cartTotal > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-primary rounded-full text-xs font-bold flex items-center justify-center">
            {cartTotal}
          </span>
        )}
      </button>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isByWeight={isByWeight}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            whatsappNumber={getWhatsAppNumber()}
          />
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <CartModal
            cart={cart}
            onClose={() => setIsCartOpen(false)}
            onUpdateQty={handleUpdateCartQty}
            onClear={handleClearCart}
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>

      {/* Customer Form Modal */}
      <AnimatePresence>
        {isCustomerFormOpen && (
          <CustomerFormModal
            onClose={() => setIsCustomerFormOpen(false)}
            onBack={() => {
              setIsCustomerFormOpen(false);
              setIsCartOpen(true);
            }}
            onSubmit={handleCustomerSubmit}
            deliveryLocations={CONFIG.deliveryLocations}
            branch={defaultBranch}
            initialData={{
              name: customerInfo.name,
              phone: customerInfo.phone,
              address: customerInfo.address,
              location: selectedLocation,
              notes: orderNotes,
            }}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmationOpen && selectedLocation && (
          <ConfirmationModal
            cart={cart}
            customerInfo={customerInfo}
            location={selectedLocation}
            branch={defaultBranch}
            notes={orderNotes}
            onClose={() => setIsConfirmationOpen(false)}
            onEdit={() => {
              setIsConfirmationOpen(false);
              setIsCustomerFormOpen(true);
            }}
            onSend={handleSendOrder}
            onChangeBranch={handleChangeBranch}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

function BranchDetector() {
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

  return <CategoryPageContent defaultBranch={selectedBranch} />;
}

function CategoryPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <BranchDetector />
    </Suspense>
  );
}

export default CategoryPage;
