import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your store preferences</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Store Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Store Name</Label><Input defaultValue="LugAdmin Store" /></div>
            <div className="space-y-2"><Label>Contact Email</Label><Input defaultValue="admin@lugadmin.com" /></div>
          </div>
          <div className="space-y-2"><Label>Store URL</Label><Input defaultValue="https://lugadmin.com" /></div>
          <div className="space-y-2"><Label>Currency</Label><Input defaultValue="INR (₹)" disabled /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {["New order alerts", "Low stock warnings", "Customer review notifications", "Weekly analytics digest"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Shipping</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Free Shipping Threshold (₹)</Label><Input type="number" defaultValue="999" /></div>
            <div className="space-y-2"><Label>Default Shipping Fee (₹)</Label><Input type="number" defaultValue="99" /></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
