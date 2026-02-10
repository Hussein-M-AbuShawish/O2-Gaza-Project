"use client";

import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  UtensilsCrossed,
  Clock,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data
const dailySalesData = [
  { day: "السبت", sales: 4200 },
  { day: "الأحد", sales: 3800 },
  { day: "الاثنين", sales: 5100 },
  { day: "الثلاثاء", sales: 4600 },
  { day: "الأربعاء", sales: 5800 },
  { day: "الخميس", sales: 7200 },
  { day: "الجمعة", sales: 6400 },
];

const monthlySalesData = [
  { month: "يناير", revenue: 85000, expenses: 62000 },
  { month: "فبراير", revenue: 78000, expenses: 58000 },
  { month: "مارس", revenue: 92000, expenses: 65000 },
  { month: "أبريل", revenue: 88000, expenses: 61000 },
  { month: "مايو", revenue: 105000, expenses: 70000 },
  { month: "يونيو", revenue: 112000, expenses: 72000 },
];

const departmentSales = [
  { name: "الشاورما", value: 35, color: "#c89650" },
  { name: "الإيطالي", value: 25, color: "#6d9dc5" },
  { name: "الغربي", value: 20, color: "#7bc589" },
  { name: "الحلويات", value: 12, color: "#d4a574" },
  { name: "البار", value: 8, color: "#b485c4" },
];

const recentOrders = [
  { id: "#1234", table: "طاولة 5", items: 4, total: 120, status: "يُحضَّر", time: "منذ 5 دقائق" },
  { id: "#1233", table: "طاولة 12", items: 2, total: 85, status: "جاهز", time: "منذ 10 دقائق" },
  { id: "#1232", table: "توصيل", items: 6, total: 210, status: "في الطريق", time: "منذ 15 دقيقة" },
  { id: "#1231", table: "طاولة 3", items: 3, total: 95, status: "مُقدَّم", time: "منذ 20 دقيقة" },
  { id: "#1230", table: "سفري", items: 1, total: 45, status: "جاهز", time: "منذ 25 دقيقة" },
];

const statusColors: Record<string, string> = {
  "يُحضَّر": "bg-amber-500/20 text-amber-400",
  "جاهز": "bg-green-500/20 text-green-400",
  "في الطريق": "bg-blue-500/20 text-blue-400",
  "مُقدَّم": "bg-primary/20 text-primary",
};

const stats = [
  {
    title: "إيرادات اليوم",
    value: "7,250",
    unit: "شيكل",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "الطلبات اليوم",
    value: "148",
    unit: "طلب",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "الموظفون النشطون",
    value: "24",
    unit: "موظف",
    change: "-2",
    trend: "down" as const,
    icon: Users,
  },
  {
    title: "متوسط الطلب",
    value: "48.9",
    unit: "شيكل",
    change: "+3.1%",
    trend: "up" as const,
    icon: TrendingUp,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء المطعم اليوم</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground mr-1">{stat.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly Sales Bar Chart */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">مبيعات الأسبوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 65%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(0 0% 65%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0 0% 12%)",
                      border: "1px solid hsl(0 0% 22%)",
                      borderRadius: "8px",
                      color: "hsl(0 0% 98%)",
                    }}
                    formatter={(value: number) => [`${value} شيكل`, "المبيعات"]}
                  />
                  <Bar dataKey="sales" fill="#c89650" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Pie Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">مبيعات الأقسام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentSales}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentSales.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0 0% 12%)",
                      border: "1px solid hsl(0 0% 22%)",
                      borderRadius: "8px",
                      color: "hsl(0 0% 98%)",
                    }}
                    formatter={(value: number) => [`${value}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {departmentSales.map((dept) => (
                <div key={dept.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-muted-foreground">{dept.name}</span>
                  <span className="text-foreground font-medium mr-auto">{dept.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend + Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">الإيرادات والمصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(0 0% 65%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(0 0% 65%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0 0% 12%)",
                      border: "1px solid hsl(0 0% 22%)",
                      borderRadius: "8px",
                      color: "hsl(0 0% 98%)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c89650"
                    fill="#c8965020"
                    name="الإيرادات"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#6d9dc5"
                    fill="#6d9dc520"
                    name="المصروفات"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">آخر الطلبات</CardTitle>
              <span className="text-xs text-muted-foreground">عرض الكل</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {order.id} - {order.table}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusColors[order.status] || "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-foreground">{order.total} <span className="text-xs font-normal">شيكل</span></span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">2</p>
              <p className="text-xs text-muted-foreground">فروع نشطة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">6</p>
              <p className="text-xs text-muted-foreground">أقسام</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">340</p>
              <p className="text-xs text-muted-foreground">صنف بالمخزون</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">92%</p>
              <p className="text-xs text-muted-foreground">رضا العملاء</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
