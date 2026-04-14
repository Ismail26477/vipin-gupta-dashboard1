import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const salesTrend = [
  { month: "Jan", sales: 120, customers: 45 },
  { month: "Feb", sales: 180, customers: 62 },
  { month: "Mar", sales: 250, customers: 89 },
  { month: "Apr", sales: 220, customers: 78 },
  { month: "May", sales: 340, customers: 112 },
  { month: "Jun", sales: 310, customers: 98 },
  { month: "Jul", sales: 420, customers: 145 },
  { month: "Aug", sales: 380, customers: 130 },
  { month: "Sep", sales: 290, customers: 105 },
  { month: "Oct", sales: 450, customers: 160 },
  { month: "Nov", sales: 560, customers: 195 },
  { month: "Dec", sales: 720, customers: 240 },
];

const categoryPerformance = [
  { category: "Cabin", revenue: 890000, orders: 342 },
  { category: "Check-in", revenue: 1240000, orders: 487 },
  { category: "Backpack", revenue: 560000, orders: 456 },
  { category: "Duffel", revenue: 340000, orders: 167 },
  { category: "Accessories", revenue: 210000, orders: 389 },
  { category: "Kids", revenue: 120000, orders: 89 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm">Deep dive into your store performance</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Sales Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="hsl(160, 84%, 39%)" fill="url(#salesGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Customer Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="hsl(280, 65%, 60%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Category Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
