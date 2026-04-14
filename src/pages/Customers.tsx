import { Search, Eye } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const mockCustomers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", orders: 5, spent: 12495, joined: "2025-11-01", recentOrders: ["ORD-1001", "ORD-980", "ORD-945"] },
  { id: 2, name: "Priya Patel", email: "priya@email.com", orders: 3, spent: 7497, joined: "2025-12-15", recentOrders: ["ORD-1002", "ORD-960"] },
  { id: 3, name: "Amit Kumar", email: "amit@email.com", orders: 2, spent: 3998, joined: "2026-01-10", recentOrders: ["ORD-1003"] },
  { id: 4, name: "Sneha Reddy", email: "sneha@email.com", orders: 8, spent: 24990, joined: "2025-08-22", recentOrders: ["ORD-1004", "ORD-990", "ORD-975"] },
  { id: 5, name: "Vikram Singh", email: "vikram@email.com", orders: 1, spent: 999, joined: "2026-03-05", recentOrders: ["ORD-1005"] },
  { id: 6, name: "Anita Gupta", email: "anita@email.com", orders: 4, spent: 9996, joined: "2025-10-18", recentOrders: ["ORD-1006", "ORD-970"] },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof mockCustomers[0] | null>(null);

  const filtered = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground text-sm">Manage your customer base</p>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
          </div>
        </CardContent>
      </Card>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(c)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
                <span><strong className="text-foreground">{c.orders}</strong> orders</span>
                <span><strong className="text-foreground">₹{c.spent.toLocaleString()}</strong> spent</span>
                <span className="ml-auto">Joined {c.joined}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-right p-3 font-medium">Orders</th>
                <th className="text-right p-3 font-medium">Total Spent</th>
                <th className="text-left p-3 font-medium">Joined</th>
                <th className="text-center p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{c.email}</td>
                  <td className="p-3 text-right">{c.orders}</td>
                  <td className="p-3 text-right font-medium">₹{c.spent.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground">{c.joined}</td>
                  <td className="p-3 text-center">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(c)}><Eye className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle>Customer Profile</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                  {selected.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold">{selected.name}</p>
                  <p className="text-muted-foreground truncate">{selected.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="rounded-lg bg-muted p-2 sm:p-3"><p className="text-lg sm:text-xl font-bold">{selected.orders}</p><p className="text-[10px] sm:text-xs text-muted-foreground">Orders</p></div>
                <div className="rounded-lg bg-muted p-2 sm:p-3"><p className="text-lg sm:text-xl font-bold">₹{selected.spent.toLocaleString()}</p><p className="text-[10px] sm:text-xs text-muted-foreground">Total Spent</p></div>
                <div className="rounded-lg bg-muted p-2 sm:p-3"><p className="text-lg sm:text-xl font-bold">₹{Math.round(selected.spent / selected.orders).toLocaleString()}</p><p className="text-[10px] sm:text-xs text-muted-foreground">Avg. Order</p></div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Recent Orders</p>
                <div className="flex flex-wrap gap-2">
                  {selected.recentOrders.map((o) => <Badge key={o} variant="secondary">{o}</Badge>)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
