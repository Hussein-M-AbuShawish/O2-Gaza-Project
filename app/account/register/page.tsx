import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomerAuthForm } from "@/components/customer-auth-form";
import { getCurrentCustomer } from "@/lib/auth";

export const metadata: Metadata = {
    title: "إنشاء حساب | O2 Gaza Restaurant",
    description: "أنشئ حساباً جديداً لمتابعة طلباتك وتقييمها في مطعم O2.",
};

export default async function RegisterPage() {
    const customer = await getCurrentCustomer();
    if (customer) redirect("/account");

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 md:pt-32 pb-20 md:pb-28">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-medium tracking-wider mb-4 block">
                            انضم إلينا
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                            إنشاء حساب جديد
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                            أنشئ حسابك لمتابعة طلباتك السابقة وتقييم كل تجربة بسهولة
                        </p>
                    </div>
                    <div className="max-w-md mx-auto">
                        <CustomerAuthForm mode="sign-up" />
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
