import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

const mockOrders = [
  { id: "ORD-1001", customer: "Rahul Sharma", amount: 4998, status: "Delivered", date: "2026-04-10", items: ["Voyager Cabin 20\"", "Travel Organizer Set"], address: "123 MG Road, Mumbai", payment: "UPI" },
  { id: "ORD-1002", customer: "Priya Patel", amount: 2999, status: "Shipped", date: "2026-04-09", items: ["Explorer Check-in 28\""], address: "456 Nehru St, Delhi", payment: "Card" },
  { id: "ORD-1003", customer: "Amit Kumar", amount: 1999, status: "Pending", date: "2026-04-09", items: ["Voyager Cabin 20\""], address: "789 Park Ave, Bangalore", payment: "COD" },
  { id: "ORD-1004", customer: "Sneha Reddy", amount: 5498, status: "Delivered", date: "2026-04-08", items: ["Elite Spinner 24\"", "Urban Backpack Pro"], address: "321 Lake Rd, Hyderabad", payment: "Card" },
  { id: "ORD-1005", customer: "Vikram Singh", amount: 999, status: "Cancelled", date: "2026-04-08", items: ["Urban Backpack Pro"], address: "654 Hill Rd, Pune", payment: "UPI" },
  { id: "ORD-1006", customer: "Anita Gupta", amount: 3498, status: "Shipped", date: "2026-04-07", items: ["Weekend Duffel", "Voyager Cabin 20\""], address: "987 Main St, Chennai", payment: "Card" },
];

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const filtered = mockOrders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">Track and manage customer orders</p>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] h-9"><Filter className="h-3.5 w-3.5 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {filtered.map((o) => (
          <Card key={o.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-medium text-primary">{o.id}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[o.status]}`}>
                  {o.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{o.amount.toLocaleString()}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(o)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
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
                <th className="text-left p-3 font-medium">Order ID</th>
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-right p-3 font-medium">Amount</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-center p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-medium text-primary">{o.id}</td>
                  <td className="p-3">{o.customer}</td>
                  <td className="p-3 text-right font-medium">₹{o.amount.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{o.date}</td>
                  <td className="p-3 text-center">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(o)}><Eye className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle>Order {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedOrder.customer}</p></div>
                <div><p className="text-muted-foreground">Amount</p><p className="font-medium">₹{selectedOrder.amount.toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Payment</p><p className="font-medium">{selectedOrder.payment}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{selectedOrder.date}</p></div>
              </div>
              <div><p className="text-muted-foreground">Shipping Address</p><p className="font-medium">{selectedOrder.address}</p></div>
              <div>
                <p className="text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item) => (
                  <Badge key={item} variant="secondary" className="mr-2 mb-1">{item}</Badge>
                ))}
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Update Status</p>
                <Select defaultValue={selectedOrder.status}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
