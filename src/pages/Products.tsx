import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Upload, X, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/services/mongodb";

interface Category {
  _id: string;
  id?: string;
  name: string;
  image_url: string | null;
  is_deal: boolean;
}

interface Product {
  _id: string;
  id?: string;
  name: string;
  description: string | null;
  category_id: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  brand: string | null;
  tags: string[] | null;
  specifications: any;
  images: string[] | null;
  featured: boolean;
  trending: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  status: string;
  rating: number;
  categories?: Category;
}

function ProductFilters({ search, setSearch, categoryFilter, setCategoryFilter, categories }: {
  search: string; setSearch: (v: string) => void;
  categoryFilter: string; setCategoryFilter: (v: string) => void;
  categories: Category[];
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    {cat.image_url && <img src={cat.image_url} alt="" className="w-4 h-4 rounded-full object-cover" />}
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function AddProductDialog({
  open, onOpenChange, categories, onSaved, editProduct,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  categories: Category[];
  onSaved: () => void;
  editProduct: Product | null;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Capacity", value: "" }, { key: "Material", value: "" }, { key: "Wheels", value: "" },
  ]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setDescription(editProduct.description || "");
      setCategoryId(editProduct.category_id || "");
      setPrice(String(editProduct.price));
      setDiscountPrice(editProduct.discount_price ? String(editProduct.discount_price) : "");
      setStock(String(editProduct.stock));
      setBrand(editProduct.brand || "");
      setTags(editProduct.tags?.join(", ") || "");
      setSpecs(Array.isArray(editProduct.specifications) && editProduct.specifications.length > 0
        ? editProduct.specifications
        : [{ key: "Capacity", value: "" }, { key: "Material", value: "" }, { key: "Wheels", value: "" }]);
      setUploadedImages(editProduct.images || []);
      setFeatured(editProduct.featured);
      setTrending(editProduct.trending);
      setBestSeller(editProduct.best_seller);
      setNewArrival(editProduct.new_arrival);
    } else {
      resetForm();
    }
  }, [editProduct, open]);

  const resetForm = () => {
    setName(""); setDescription(""); setCategoryId(""); setPrice(""); setDiscountPrice("");
    setStock(""); setBrand(""); setTags("");
    setSpecs([{ key: "Capacity", value: "" }, { key: "Material", value: "" }, { key: "Wheels", value: "" }]);
    setUploadedImages([]); setFeatured(false); setTrending(false); setBestSeller(false); setNewArrival(false);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (uploadedImages.length + fileArray.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setUploading(true);
    for (const file of fileArray) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setUploadedImages(prev => [...prev, dataUrl]);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error(`Upload failed: ${error}`);
      }
    }
    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!price) { toast.error("Price is required"); return; }
    setSaving(true);

    const productData = {
      name: name.trim(),
      description: description || null,
      category_id: categoryId || null,
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      stock: parseInt(stock) || 0,
      brand: brand || null,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      specifications: specs.filter(s => s.key && s.value),
      images: uploadedImages,
      featured, trending, best_seller: bestSeller, new_arrival: newArrival,
    };

    try {
      if (editProduct) {
        await api.updateProduct(editProduct._id, productData);
      } else {
        await api.addProduct(productData);
      }
      toast.success(editProduct ? "Product updated!" : "Product added!");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(`Save failed: ${error}`);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {editProduct ? "Update product details" : "Add a new product to your catalog"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Wave Luxe Set – Fuchsia" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      <div className="flex items-center gap-2">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                        ) : cat.is_deal ? (
                          <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] text-orange-500 font-bold">%</span>
                        ) : null}
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Premium cabin-size trolley..." rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="8999" />
            </div>
            <div className="space-y-2">
              <Label>Discount Price (₹)</Label>
              <Input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} placeholder="7919" />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="59" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. WAVE" />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="premium, lightweight, spinner" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Key Highlights / Specifications</Label>
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input placeholder="Key" value={s.key} onChange={e => { const n = [...specs]; n[i].key = e.target.value; setSpecs(n); }} />
                <Input placeholder="Value" value={s.value} onChange={e => { const n = [...specs]; n[i].value = e.target.value; setSpecs(n); }} />
              </div>
            ))}
            <Button variant="outline" size="sm" className="text-xs" onClick={addSpec}>+ Add Specification</Button>
          </div>

          {/* Product Images with drag & drop */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
            <div className="flex flex-wrap gap-3">
              {uploadedImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border group">
                  <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[9px] text-center py-0.5">Main</span>
                  )}
                </div>
              ))}
              {uploadedImages.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer transition-colors ${dragOver ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:text-primary"}`}
                >
                  {uploading ? (
                    <span className="text-[10px] animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mb-1" />
                      <span className="text-[10px]">Upload</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Upload 3–5 images. Drag & drop or click. First image = main.</p>
          </div>

          <div className="space-y-3">
            <Label>Product Flags</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Featured", value: featured, set: setFeatured },
                { label: "Trending", value: trending, set: setTrending },
                { label: "Best Seller", value: bestSeller, set: setBestSeller },
                { label: "New Arrival", value: newArrival, set: setNewArrival },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">{f.label}</span>
                  <Switch checked={f.value} onCheckedChange={f.set} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editProduct ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductTable({ products, categories, onEdit, onDelete }: {
  products: Product[]; categories: Category[];
  onEdit: (p: Product) => void; onDelete: (id: string) => void;
}) {
  const getCategoryName = (catId: string | null) => {
    if (!catId) return "—";
    const cat = categories.find(c => c._id === catId);
    return cat?.name || "—";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-right p-3 font-medium">Price</th>
                <th className="text-right p-3 font-medium">Stock</th>
                <th className="text-center p-3 font-medium">Rating</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">No products found. Add your first product!</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <span className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">🧳</span>
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {p.featured && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Featured</Badge>}
                          {p.trending && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Trending</Badge>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{getCategoryName(p.category_id)}</td>
                  <td className="p-3 text-right font-medium">₹{Number(p.price).toLocaleString()}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-center">⭐ {Number(p.rating).toFixed(1)}</td>
                  <td className="p-3 text-center">
                    <Badge variant={p.status === "Active" ? "default" : p.status === "Low Stock" ? "secondary" : "destructive"} className="text-xs">
                      {p.stock === 0 ? "Out of Stock" : p.stock < 20 ? "Low Stock" : p.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(p)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(p.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      toast.error("Failed to load data");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      toast.success("Product deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setDialogOpen(true);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category_id === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your luggage catalog</p>
        </div>
        <Button onClick={() => { setEditProduct(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Product
        </Button>
      </div>

      <AddProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        onSaved={fetchData}
        editProduct={editProduct}
      />
      <ProductFilters search={search} setSearch={setSearch} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} categories={categories} />
      <ProductTable products={filtered} categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
