import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { User, Phone, Mail, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OrderCard } from "@/components/order-card";
import { SignOutButton } from "@/components/sign-out-button";
import { getCurrentCustomer } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/orders";
import { getRatedOrderIds } from "@/app/actions/ratings";

export const metadata: Metadata = {
    title: "حسابي | O2 Gaza Restaurant",
    description: "تابع طلباتك السابقة وقيّم تجربتك في مطعم O2.",
};

export default async function AccountPage() {
    const customer = await getCurrentCustomer();
    if (!customer) redirect("/account/login");

    const [orders, ratedIds] = await Promise.all([
        getCustomerOrders(customer.id),
        getRatedOrderIds(customer.id),
    ]);
    const ratedSet = new Set(ratedIds);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 md:pt-32 pb-20 md:pb-28">
                <div className="container mx-auto px-4">
                    {/* Header / profile card */}
                    <div className="max-w-3xl mx-auto mb-10">
                        <div className="rounded-2xl bg-card border-2 border-border p-6 md:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <span className="text-primary text-sm font-medium tracking-wider mb-2 block">
                                        حسابك الشخصي
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
                                        <User className="w-7 h-7 text-primary" />
                                        {customer.name}
                                    </h1>
                                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span dir="ltr">{customer.phone}</span>
                                        </span>
                                        {customer.email && (
                                            <span className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary" />
                                                <span dir="ltr">{customer.email}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <SignOutButton />
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-primary" />
                            طلباتي
                        </h2>

                        {orders.length === 0 ? (
                            <div className="rounded-2xl bg-card border-2 border-dashed border-border p-10 text-center">
                                <p className="text-muted-foreground">لا توجد طلبات سابقة بعد.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        alreadyRated={ratedSet.has(order.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
