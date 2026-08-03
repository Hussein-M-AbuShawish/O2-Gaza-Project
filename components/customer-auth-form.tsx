"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Lock, Loader2, LogIn, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

function SubmitButton({ mode }: { mode: "sign-in" | "sign-up" }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جارٍ المعالجة...
                </>
            ) : mode === "sign-in" ? (
                <>
                    <LogIn className="w-5 h-5" />
                    تسجيل الدخول
                </>
            ) : (
                <>
                    <UserPlus className="w-5 h-5" />
                    إنشاء حساب
                </>
            )}
        </Button>
    );
}

export function CustomerAuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
    const action = mode === "sign-in" ? signIn : signUp;
    const [state, formAction] = useActionState<AuthState, FormData>(action, null);

    return (
        <div className="rounded-2xl bg-card border-2 border-border p-6 md:p-8">
            <form action={formAction}>
                {mode === "sign-up" && (
                    <div className="mb-6">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                            <User className="w-4 h-4 text-primary" />
                            الاسم
                        </label>
                        <Input id="name" name="name" type="text" required placeholder="أدخل اسمك" className="h-11" />
                    </div>
                )}

                {mode === "sign-in" ? (
                    <div className="mb-6">
                        <label htmlFor="identifier" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                            <User className="w-4 h-4 text-primary" />
                            البريد الإلكتروني أو رقم الجوال
                        </label>
                        <Input
                            id="identifier"
                            name="identifier"
                            type="text"
                            required
                            dir="ltr"
                            placeholder="example@mail.com أو 059xxxxxxx"
                            className="h-11 text-right"
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                <Phone className="w-4 h-4 text-primary" />
                                رقم الجوال
                            </label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                required
                                dir="ltr"
                                placeholder="059xxxxxxx"
                                className="h-11 text-right"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                <Mail className="w-4 h-4 text-primary" />
                                البريد الإلكتروني <span className="text-muted-foreground font-normal">(اختياري)</span>
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                dir="ltr"
                                placeholder="example@mail.com"
                                className="h-11 text-right"
                            />
                        </div>
                    </>
                )}

                <div className="mb-6">
                    <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Lock className="w-4 h-4 text-primary" />
                        كلمة المرور
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        dir="ltr"
                        placeholder="••••••••"
                        className="h-11 text-right"
                    />
                </div>

                <AnimatePresence>
                    {state && !state.success && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive text-center"
                        >
                            {state.message}
                        </motion.p>
                    )}
                </AnimatePresence>

                <SubmitButton mode={mode} />
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "sign-in" ? (
                    <>
                        ليس لديك حساب؟{" "}
                        <Link href="/account/register" className="font-bold text-primary hover:underline">
                            أنشئ حساباً جديداً
                        </Link>
                    </>
                ) : (
                    <>
                        لديك حساب بالفعل؟{" "}
                        <Link href="/account/login" className="font-bold text-primary hover:underline">
                            سجّل الدخول
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
}
