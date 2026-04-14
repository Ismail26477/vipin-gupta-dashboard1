import { useState } from "react";
import { Star, Trash2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockReviews = [
  { id: 1, product: "Voyager Cabin 20\"", customer: "Rahul S.", rating: 5, comment: "Excellent quality! Lightweight and durable. Survived 3 international trips.", date: "2026-04-08" },
  { id: 2, product: "Explorer Check-in 28\"", customer: "Priya P.", rating: 4, comment: "Spacious and well-built. Zipper could be smoother. Overall great value.", date: "2026-04-07" },
  { id: 3, product: "Urban Backpack Pro", customer: "Amit K.", rating: 3, comment: "Good backpack but padding on straps could be better for heavy loads.", date: "2026-04-06" },
  { id: 4, product: "Elite Spinner 24\"", customer: "Sneha R.", rating: 5, comment: "Absolutely love the spinner wheels! Glides effortlessly. Premium feel.", date: "2026-04-05" },
  { id: 5, product: "Weekend Duffel", customer: "Vikram S.", rating: 2, comment: "Handle broke after 2 months. Disappointed with the quality.", date: "2026-04-04" },
  { id: 6, product: "Hardshell Carry-on", customer: "Anita G.", rating: 4, comment: "Solid construction. Love the color options. Worth the price.", date: "2026-04-03" },
];

export default function Reviews() {
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = mockReviews.filter((r) => ratingFilter === "all" || r.rating === Number(ratingFilter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground text-sm">Moderate customer reviews</p>
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[140px] h-9"><Filter className="h-3.5 w-3.5 mr-2" /><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{r.customer}</span>
                    <span className="text-xs text-muted-foreground">on</span>
                    <span className="text-sm font-medium text-primary">{r.product}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
