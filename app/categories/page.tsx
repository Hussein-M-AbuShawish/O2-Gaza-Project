"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBasket,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  Phone,
  User,
  MapPin,
  Check,
  X,
  Edit3,
  Send,
  FileText,
  ChevronLeft
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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
  { id: "salads", name: "السلطات والمقبلات", image: "/menu/salad/89.jpeg" },
  { id: "gelato", name: "الجيلاتو", image: "/menu/Gelato/72.jpeg" },
];

// ================= CONFIGURATION =================
const CONFIG = {
  whatsappNumbers: {
    gaza: "972569000400",
    middle: "972597111811",
  },
  deliveryLocations: {
    gaza: [
      { name: "فوري", price: 0 },
      { name: "النصر", price: 5 },
      { name: "الشاطىء ", price: 5 },
      { name: " الميناء", price: 5 },
      { name: "الساحة", price: 10 },
      { name: "الشعبية", price: 10 },
      { name: "الدرج", price: 10 },
      { name: "دوار ال 17", price: 10 },
      { name: "الشاليهات", price: 10 },
      { name: "الشيخ رضوان", price: 10 },
      { name: "الكرامة", price: 10 },
      { name: "الرمال الجنووبي", price: 10 },
      { name: "تل الهوا", price: 10 },
      { name: "اليرموك", price: 10 },
      { name: "النفق", price: 10 },
      { name: "التفاح", price: 15 },
      { name: "شارع يافا", price: 15 },
      { name: "الصبرة", price: 15 },
      { name: "الزيتون", price: 15 },
      { name: "الصفطاوي", price: 15 },
      { name: "دوار ابو شرخ", price: 15 },
    ],
    middle: [
      { name: "فوري", price: 0 },
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

interface DeliveryLocation {
  name: string;
  price: number;
}

// Toast Component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
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

// Cart Modal Component
function CartModal({
  cart,
  onClose,
  onUpdateQty,
  onClear,
  onCheckout,
}: {
  cart: any[];
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
                  {loc.name} - : {loc.price} ₪
                </option>
              ))}
            </select>
            {selectedLocation && (
              <div className="mt-2 p-3 bg-primary/10 border-2 border-primary rounded-xl text-center font-bold text-primary">
                : {selectedLocation.price} ₪
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
  notes = "",
}: {
  cart: any[];
  customerInfo: { name: string; phone: string; address: string };
  location: DeliveryLocation;
  branch: string;
  onClose: () => void;
  onEdit: () => void;
  onSend: () => void;
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

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [orderNotes, setOrderNotes] = useState("");

  const cartTotal = cart.reduce((acc, item) => acc + item.qty, 0);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  const getWhatsAppNumber = useCallback(() => {
    return (
      branch &&
      CONFIG.whatsappNumbers[branch as keyof typeof CONFIG.whatsappNumbers]
    ) || CONFIG.whatsappNumbers.middle;
  }, [branch]);

  const handleUpdateCartQty = useCallback((index: number, change: number) => {
    const item = cart[index];
    if (item) {
      updateQty(item.key, item.qty + change);
    }
  }, [cart, updateQty]);

  const handleCheckout = useCallback(() => {
    // التحقق من وقت العمل (من 10 صباحاً حتى 10 ليلاً)
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 10 && currentHour < 22) {
      // المطعم مفتوح
    } else {
      showToast(
        "عذراً، المطعم مغلق حالياً. أوقات العمل من 10:00 صباحاً حتى 10:00 ليلاً."
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
    const provinceName = branch === "gaza" ? "محافظة غزة" : "المحافظة الوسطى";
    const fullAddress = `${provinceName} - ${selectedLocation.name} - ${customerInfo.address}`;
    const targetNumber = getWhatsAppNumber();

    // Helper function for padding
    const pad = (text: string, length: number) => {
      const s = String(text);
      const spaces = length - s.length;
      return s + (spaces > 0 ? " ".repeat(spaces) : "");
    };

    let msg = "🧾 *فاتورة طلب — O2 Restaurant*\n\n";
    msg += "────────────────────────\n\n";

    msg += "👤 *بيانات العميل*\n";
    msg += `الاسم: ${customerInfo.name}\n`;
    msg += `الهاتف: ${customerInfo.phone}\n`;
    msg += `العنوان: ${fullAddress}\n\n`;

    msg += "────────────────────────\n\n";

    msg += "🍽️ *تفاصيل الطلب*\n";
    msg += "```\n";
    msg += "المنتج             الكمية   السعر   المجموع\n";
    msg += "-------------------------------------------\n";

    cart.forEach((i) => {
      const itemTotal = i.price * i.qty;
      itemsTotal += itemTotal;

      const displayName = i.isByWeight
        ? `${i.name} (${i.weight?.toFixed(2)}ك)`
        : i.name;

      const nameCol = pad(displayName.substring(0, 18), 18);
      const qtyCol = pad(String(i.qty), 8);
      const priceCol = pad(i.unitPrice + "₪", 8);
      const totalCol = pad(itemTotal.toFixed(0) + "₪", 8);

      msg += `${nameCol}${qtyCol}${priceCol}${totalCol}\n`;
    });

    msg += "-------------------------------------------\n";
    msg += `رسوم التوصيل                  ${selectedLocation.price}₪\n`;
    msg += "-------------------------------------------\n";
    msg += `الإجمالي                     ${(itemsTotal + selectedLocation.price).toFixed(0)}₪\n`;
    msg += "```\n\n";

    if (orderNotes) {
      msg += `📝 *ملاحظات*\n${orderNotes}\n\n`;
    }

    msg += "────────────────────────\n";
    msg += "شكراً لطلبكم من O2 Restaurant";

    window.open(
      `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`
    );

    clearCart();
    setCustomerInfo({ name: "", phone: "", address: "" });
    setOrderNotes("");
    setIsConfirmationOpen(false);
  }, [cart, customerInfo, selectedLocation, orderNotes, getWhatsAppNumber, clearCart, branch]);

  if (!categories.length) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#dc2626]/30">
      <Navbar />

      {/* Cart Button (floating) */}
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast(null)}
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
            onClear={clearCart}
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
            branch={branch}
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
            branch={branch}
            notes={orderNotes}
            onClose={() => setIsConfirmationOpen(false)}
            onEdit={() => {
              setIsConfirmationOpen(false);
              setIsCustomerFormOpen(true);
            }}
            onSend={handleSendOrder}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 overflow-hidden">
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

        {/* Checkout Button Below Grid */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={handleCheckout}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <ShoppingBasket className="w-6 h-6" />
              اذهب الى اتمام الطلب
              <span className="bg-white text-primary px-3 py-1 rounded-full text-sm font-extrabold">
                {cartTotal}
              </span>
            </button>
          </motion.div>
        )}
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