"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Building2,
  UtensilsCrossed,
  ClipboardList,
  DollarSign,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  {
    group: "الرئيسية",
    items: [
      { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
    ],
  },
  {
    group: "العمليات",
    items: [
      { href: "/admin/captain", label: "كابتن الضيافة", icon: UtensilsCrossed },
      { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
    ],
  },
  {
    group: "الإدارة",
    items: [
      { href: "/admin/employees", label: "الموظفين", icon: Users },
      { href: "/admin/branches", label: "الفروع", icon: Building2 },
    ],
  },
  {
    group: "المالية",
    items: [
      { href: "/admin/inventory", label: "المخزون", icon: Package },
      { href: "/admin/sales", label: "المبيعات", icon: DollarSign },
      { href: "/admin/purchases", label: "المشتريات", icon: ShoppingCart },
    ],
  },
  {
    group: "التقارير",
    items: [
      { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
      { href: "/admin/settings", label: "الإعدادات", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 flex flex-col border-l border-border/50 bg-card transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <span className="text-primary">O2</span>{" "}
                <span className="text-foreground text-sm">لوحة التحكم</span>
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
            aria-label={collapsed ? "توسيع القائمة" : "تصغير القائمة"}
          >
            {collapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
            aria-label="إغلاق القائمة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {sidebarLinks.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <p className="text-xs font-medium text-muted-foreground mb-2 px-3">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "العودة للموقع" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>العودة للموقع</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary transition-colors text-foreground"
            aria-label="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">مدير النظام</span>
              <span className="text-xs text-muted-foreground">فرع غزة</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              م
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
