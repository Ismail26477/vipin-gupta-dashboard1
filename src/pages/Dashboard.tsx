import { useState, useEffect } from "react";
import { IndianRupee, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { api } from "@/services/mongodb";
import { toast } from "sonner";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, customersData, productsData, categoriesData] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getProducts(),
        api.getCategories(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("[v0] Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const kpis = [
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: IndianRupee, gradient: "gradient-card-revenue" },
    { title: "Total Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingCart, gradient: "gradient-card-orders" },
    { title: "Total Customers", value: totalCustomers.toString(), change: "+15.3%", up: true, icon: Users, gradient: "gradient-card-customers" },
    { title: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, change: "-2.1%", up: false, icon: TrendingUp, gradient: "gradient-card-aov" },
  ];

  // Calculate revenue by category
  const revenueByCategory = categories.map(cat => ({
    category: cat.name,
    revenue: products
      .filter(p => p.category_id === cat._id)
      .reduce((sum, p) => sum + (p.price * (p.quantity_sold || 0)), 0),
  })).filter(item => item.revenue > 0);

  // Calculate order status distribution
  const orderStatusCounts = orders.reduce((acc, order) => {
    const status = order.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    Delivered: "hsl(160, 84%, 39%)",
    Shipped: "hsl(200, 80%, 50%)",
    Pending: "hsl(40, 90%, 55%)",
    Cancelled: "hsl(0, 75%, 60%)",
  };

  const orderStatus = Object.entries(orderStatusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status] || "hsl(0, 0%, 50%)",
  }));

  // Get top products
  const topProducts = products
    .filter(p => p.quantity_sold && p.quantity_sold > 0)
    .sort((a, b) => (b.quantity_sold || 0) - (a.quantity_sold || 0))
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      category: p.category_name || "Unknown",
      sold: p.quantity_sold || 0,
      revenue: `₹${((p.price || 0) * (p.quantity_sold || 0)).toLocaleString()}`,
    }));

  // Generate monthly revenue data
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString("default", { month: "short" });
    const monthRevenue = orders
      .filter(o => new Date(o.created_at || new Date()).getMonth() === i)
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { month, revenue: monthRevenue };
  });
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here's your store overview.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3 sm:p-5">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your store overview.</p>
      </div>

      {/* KPI Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className={`${kpi.gradient} border-0 text-white`}>
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-center justify-between">
                <kpi.icon className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
                <span className="flex items-center gap-0.5 text-[10px] sm:text-xs font-medium rounded-full px-1.5 sm:px-2 py-0.5 bg-white/20">
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <div className="mt-2 sm:mt-3">
                <p className="text-lg sm:text-2xl font-bold">{kpi.value}</p>
                <p className="text-[10px] sm:text-xs opacity-80 mt-0.5">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(200, 80%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={orderStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {orderStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile card view */}
            <div className="sm:hidden space-y-3">
              {topProducts.map((p) => (
                <div key={p.name} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.sold} sold</p>
                  </div>
                  <p className="text-sm font-semibold">{p.revenue}</p>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Product</th>
                    <th className="text-left py-2 font-medium">Category</th>
                    <th className="text-right py-2 font-medium">Sold</th>
                    <th className="text-right py-2 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.name} className="border-b last:border-0">
                      <td className="py-2.5 font-medium">{p.name}</td>
                      <td className="py-2.5 text-muted-foreground">{p.category}</td>
                      <td className="py-2.5 text-right">{p.sold}</td>
                      <td className="py-2.5 text-right font-medium">{p.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
