"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    CalendarDays,
    Receipt,
    Star,
    Frown,
    Meh,
    Smile,
    Loader2,
    CheckCircle2,
    ChevronDown,
    UtensilsCrossed,
    ThumbsUp,
    MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitOrderRating, type RatingFormState } from "@/app/actions/ratings";
import { BRANCH_LABELS, STATUS_LABELS, type Order } from "@/lib/orders";

const RATING_OPTIONS = [
    { label: "سيئة جداً", icon: Frown, color: "text-red-500", activeBg: "bg-red-500" },
    { label: "سيئة", icon: Frown, color: "text-orange-500", activeBg: "bg-orange-500" },
    { label: "متوسطة", icon: Meh, color: "text-yellow-500", activeBg: "bg-yellow-500" },
    { label: "جيدة", icon: Smile, color: "text-lime-500", activeBg: "bg-lime-500" },
    { label: "ممتازة", icon: Star, color: "text-green-500", activeBg: "bg-green-500" },
];

const ASPECTS = [
    { name: "foodQuality", label: "جودة الطعام" },
    { name: "variety", label: "تنوع الأصناف" },
    { name: "prices", label: "الأسعار" },
    { name: "service", label: "الخدمة والموظفين" },
    { name: "cleanliness", label: "النظافة" },
    { name: "atmosphere", label: "الأجواء والمكان" },
];

const SCALE_SIZES = ["w-6 h-6", "w-7 h-7", "w-8 h-8", "w-9 h-9", "w-10 h-10"];

const STATUS_STYLES: Record<string, string> = {
    delivered: "bg-green-500/10 text-green-600",
    preparing: "bg-yellow-500/10 text-yellow-600",
    pending: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
};

function AspectRating({ name, label }: { name: string; label: string }) {
    const [value, setValue] = useState(0);
    return (
        <div className="rounded-xl border border-border p-4">
            <div className="mb-3 font-bold text-foreground">{label}</div>
            <div className="flex items-end justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">سيء</span>
                <div className="flex items-end gap-1.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                        <button
                            type="button"
                            key={v}
                            onClick={() => setValue(v)}
                            aria-label={`${label}: ${v} من 5`}
                            aria-pressed={value === v}
                            className={`${SCALE_SIZES[v - 1]} rounded-full border-2 transition-all duration-200 ${value >= v ? "border-primary bg-primary" : "border-border bg-transparent hover:border-primary/50"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">ممتاز</span>
            </div>
            <input type="hidden" name={name} value={value || ""} />
        </div>
    );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending || disabled}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جارٍ الإرسال...
                </>
            ) : (
                "إرسال التقييم"
            )}
        </Button>
    );
}

export function OrderCard({ order, alreadyRated }: { order: Order; alreadyRated: boolean }) {
    const [open, setOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState("");
    const [state, formAction] = useActionState<RatingFormState, FormData>(submitOrderRating, null);

    const dateLabel = new Intl.DateTimeFormat("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(order.createdAt));

    const rated = alreadyRated || state?.success;

    return (
        <div className="rounded-2xl bg-card border-2 border-border overflow-hidden">
            <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Receipt className="w-4 h-4 text-primary" />
                            <span dir="ltr">{order.id}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-primary" />
                                {BRANCH_LABELS[order.branch]}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4 text-primary" />
                                {dateLabel}
                            </span>
                        </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                    </span>
                </div>

                <ul className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">
                                {item.name} <span className="text-muted-foreground">×{item.quantity}</span>
                            </span>
                            <span className="text-muted-foreground" dir="ltr">
                                {item.price * item.quantity} {order.currency}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="font-bold text-foreground">الإجمالي</span>
                    <span className="font-bold text-primary" dir="ltr">
                        {order.total} {order.currency}
                    </span>
                </div>
            </div>

            <div className="border-t border-border bg-muted/30 px-5 md:px-6 py-4">
                {rated ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        تم تقييم هذا الطلب. شكراً لك!
                    </div>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            className="flex w-full items-center justify-between text-sm font-bold text-foreground"
                            aria-expanded={open}
                        >
                            <span className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-primary" />
                                قيّم هذا الطلب
                            </span>
                            <ChevronDown className={`w-5 h-5 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <form action={formAction} className="pt-5 space-y-6">
                                        <input type="hidden" name="orderId" value={order.id} />
                                        <input type="hidden" name="rating" value={selectedRating} />

                                        {/* Overall rating */}
                                        <fieldset>
                                            <legend className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                                                <Star className="w-4 h-4 text-primary" />
                                                التقييم العام
                                            </legend>
                                            <div className="grid grid-cols-5 gap-2">
                                                {RATING_OPTIONS.map((option) => {
                                                    const active = selectedRating === option.label;
                                                    const Icon = option.icon;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={option.label}
                                                            onClick={() => setSelectedRating(option.label)}
                                                            aria-pressed={active}
                                                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all duration-200 ${active ? `${option.activeBg} border-transparent text-white` : "border-border hover:border-primary/50"
                                                                }`}
                                                        >
                                                            <Icon className={`w-5 h-5 ${active ? "text-white" : option.color}`} />
                                                            <span className={`text-[10px] md:text-xs font-medium text-center leading-tight ${active ? "text-white" : "text-foreground"}`}>
                                                                {option.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>

                                        {/* Aspects */}
                                        <fieldset>
                                            <legend className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                                                <UtensilsCrossed className="w-4 h-4 text-primary" />
                                                تقييم الجوانب
                                            </legend>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {ASPECTS.map((aspect) => (
                                                    <AspectRating key={aspect.name} name={aspect.name} label={aspect.label} />
                                                ))}
                                            </div>
                                        </fieldset>

                                        <div>
                                            <label htmlFor={`likedMost-${order.id}`} className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                                <ThumbsUp className="w-4 h-4 text-primary" />
                                                أكثر ما أعجبك
                                            </label>
                                            <Textarea id={`likedMost-${order.id}`} name="likedMost" rows={2} placeholder="أخبرنا بأكثر ما أعجبك..." className="resize-none" />
                                        </div>

                                        <div>
                                            <label htmlFor={`notes-${order.id}`} className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                                ملاحظات أو اقتراحات
                                            </label>
                                            <Textarea id={`notes-${order.id}`} name="notes" rows={2} placeholder="شاركنا ملاحظاتك أو اقتراحاتك..." className="resize-none" />
                                        </div>

                                        <AnimatePresence>
                                            {state && !state.success && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive text-center"
                                                >
                                                    {state.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>

                                        <SubmitButton disabled={!selectedRating} />
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}
