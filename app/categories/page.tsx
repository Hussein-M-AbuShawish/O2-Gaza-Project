"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, ShoppingBasket, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getMenuByBranch } from "@/lib/menu-data";
import { useCart } from "@/lib/cart-context";

const CATEGORY_DISPLAY = [
  { id: "shawarma", name: "الشاورما", image: "/menu/shawarma/53.jpg" },
  { id: "italian", name: "الإيطالي", image: "/menu/italian/35.jpg" },
  { id: "sandwiches", name: "الوجبات الغربية", image: "/menu/western/43.jpg" },
  { id: "easternSweets", name: "الحلويات الشرقية", image: "/menu/sweets/23.jpg" },
  { id: "westernSweets", name: "الكيك والحلويات", image: "/menu/Cake/38.jpg" },
  { id: "barSweets", name: "حلويات البار", image: "/menu/bar/14.jpg" },
  { id: "drinks", name: "المشروبات", image: "/menu/drinks/1.jpg" },
  { id: "salads", name: "السلطات والمقبلات", image: "/menu/salad/20.jpeg" },
  { id: "gelato", name: "الجيلاتو", image: "/menu/Gelato/72.jpeg" },
];

// Minimal Cart Modal
function CartModal({ cart, onClose, onUpdateQty, onClear }: {
  cart: any[];
  onClose: () => void;
  onUpdateQty: (index: number, change: number) => void;
  onClear: () => void;
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
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-5 pb-3 border-b-2 border-primary">سلة الطلبات</h2>
        {cart.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">السلة فارغة</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div key={item.key} className="flex justify-between items-center bg-white/5 p-3 rounded-xl gap-3">
                <div className="flex-1 text-right text-sm">
                  <b>{item.name}</b>
                  <div className="text-muted-foreground text-xs">السعر: {item.price.toFixed(1)}₪</div>
                  <div className="text-primary font-bold">الإجمالي: {(item.price * item.qty).toFixed(1)}₪</div>
                </div>
                <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg">
                  <button onClick={() => onUpdateQty(idx, -1)} className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-5 text-center text-sm">{item.qty}</span>
                  <button onClick={() => onUpdateQty(idx, 1)} className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center">
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
        <button onClick={onClear} className="w-full py-3.5 rounded-xl bg-secondary text-secondary-foreground font-bold mb-3 flex items-center justify-center gap-2">
          <Trash2 className="w-5 h-5" /> إفراغ السلة
        </button>
        <button onClick={onClose} className="w-full py-2.5 text-muted-foreground hover:text-foreground transition-colors">
          إغلاق
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const branch =
    searchParams.get("branch") ||
    (typeof window !== "undefined" ? localStorage.getItem("branch") : null) ||
    "gaza";
  const branchMenu = getMenuByBranch(branch);
  const categories = useMemo(
    () => CATEGORY_DISPLAY.filter((c) => branchMenu[c.id as keyof typeof branchMenu]),
    [branchMenu]
  );

  // Cart logic
  const { cart, updateQty, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartTotal = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleUpdateCartQty = (index: number, change: number) => {
    const item = cart[index];
    if (item) {
      updateQty(item.key, item.qty + change);
    }
  };

  if (!categories.length) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#dc2626]/30">
      <Navbar />

      {/* Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] z-[1500]"
        >
          <ShoppingBasket className="w-6 h-6 md:w-7 md:h-7" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-primary rounded-full text-xs font-bold flex items-center justify-center">
            {cartTotal}
          </span>
        </button>
      )}


      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <CartModal
            cart={cart}
            onClose={() => setIsCartOpen(false)}
            onUpdateQty={handleUpdateCartQty}
            onClear={clearCart}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 overflow-hidden">
        {/* ...existing hero code... */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-72 md:h-72 bg-[#dc2626] rounded-full blur-[100px] md:blur-[120px] opacity-[0.08]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 md:w-72 md:h-72 bg-[#dc2626] rounded-full blur-[100px] md:blur-[120px] opacity-[0.08]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 mb-4 md:mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
              قائمة {branch === "middle" ? "فرع الوسطى" : "فرع غزة"}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight"
          >
            استكشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] to-[#ef4444]">الأقسام</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/select-branch"
              className="group inline-flex items-center gap-2 mx-auto mt-6 rounded-lg
             bg-primary px-5 py-2.5 text-sm md:text-base font-medium
             text-primary-foreground
             transition-all duration-300
             hover:bg-primary/90 hover:gap-3
             focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span>تغيير الفرع الحالي</span>
              <ArrowLeft
                className="w-4 h-4 transition-transform duration-300
               group-hover:-translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24 md:pb-32">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {categories.map((cat, index) => (
            <motion.div key={cat.id}>
              <Link href={`/category/${cat.id}`} className="group block relative">
                <div className="relative h-[350px] md:h-[400px] w-full rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800/50 bg-zinc-900 transition-all duration-500 group-hover:border-[#dc2626]/30 group-hover:shadow-[0_0_40px_-10px_rgba(220,38,38,0.2)]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-90"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-[#dc2626] transition-colors">
                      {cat.name}
                    </h2>
                    <div className="w-12 h-1 bg-[#dc2626] rounded-full mb-4 md:mb-6 transform origin-center transition-all duration-500 group-hover:w-20 md:group-hover:w-24" />
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        عرض القائمة
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#dc2626]" />
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-[#dc2626] opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl md:rounded-3xl" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-10 flex justify-center">
          {cart.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 left-6 w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] z-[1500]"
            >
              <ShoppingBasket className="w-6 h-6 md:w-7 md:h-7" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-primary rounded-full text-xs font-bold flex items-center justify-center">
                {cartTotal}
              </span>
            </button>
          )}

        </div>
      </section>

      <Footer />

      <style jsx global>{`
        body {
          background-color: #050505;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>
    </main>
  );
}