"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getMenuByBranch } from "@/lib/menu-data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export default function GazaLocalCategoryItems() {
    const params = useParams();
    const categoryId = params.id as string;
    const branchMenu = getMenuByBranch("gaza");
    const categoryData = branchMenu[categoryId as keyof typeof branchMenu];

    if (!categoryData) return null;

    const isByWeight = !!categoryData.byWeight;

    return (
        <main className="min-h-screen bg-background">
            <div className="pt-20 md:pt-28 pb-20 md:pb-24">
                <div className="container mx-auto px-4">
                    {/* Back Button - Same as Original */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed top-[32px] right-4 md:top-[40px] md:right-8 z-[1000]"
                    >
                        <Link href={`/local/${params.branch}/categories`}>
                            <Button
                                variant="default"
                                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                الأقسام
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Header - Same as Original */}
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
                            تصفح قائمة الطعام - فرع غزة
                        </p>
                    </motion.div>

                    {/* Grid - Same as Original */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
                    >
                        {categoryData.items.map((item, index) => (
                            <ProductCard
                                key={item.name + index}
                                item={item}
                                index={index}
                                onClick={() => { }} // Disabled ordering
                                byWeight={isByWeight}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
