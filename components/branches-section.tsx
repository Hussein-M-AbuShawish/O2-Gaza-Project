"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback } from "react";
import { useBranch, BRANCHES } from "@/lib/branch-context";
import { MapPin, Phone } from "lucide-react";

export function BranchesSection() {
  const { setSelectedBranch } = useBranch();

  const handleBranchClick = useCallback((branchId: string) => {
    setSelectedBranch(branchId);
  }, [setSelectedBranch]);

  const branchList = Object.values(BRANCHES);

  return (
    <section id="branches" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-wider mb-4 block">
            اختر فرعك القريب
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            فروعنا المتعددة
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            اختر الفرع الأقرب إليك واستمتع بخدمتنا المميزة
          </p>
        </motion.div>

        {/* Branches Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {branchList.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/category/shawarma?branch=${branch.id}`}
                onClick={() => handleBranchClick(branch.id)}
              >
                <motion.div
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
                  transition={{ duration: 0.3 }}
                  className="group h-full bg-card rounded-2xl border-2 border-border/50 hover:border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 p-8 flex flex-col justify-between"
                >
                  {/* Top decorative element */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Branch Name */}
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors duration-300">
                      {branch.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 font-semibold">العنوان</p>
                        <p className="text-foreground">{branch.address}</p>
                      </div>
                    </div>

                    {/* Region */}
                    <div className="flex items-start gap-3 mb-6">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 font-semibold">المحافظة</p>
                        <p className="text-foreground">{branch.region}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 font-semibold">الهاتف</p>
                        <a
                          href={`tel:${branch.phone}`}
                          className="text-foreground hover:text-primary transition-colors font-semibold"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* CTA Text */}
                  <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <p className="text-primary font-bold group-hover:translate-x-2 transition-transform duration-300">
                      اختر هذا الفرع →
                    </p>
                  </div>

                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
