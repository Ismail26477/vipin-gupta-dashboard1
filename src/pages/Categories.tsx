import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Edit, Trash2, ChevronRight, Upload, Image as ImageIcon, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/services/mongodb";

interface Category {
  _id: string;
  id?: string;
  name: string;
  image_url: string | null;
  icon_url?: string | null;
  sort_order: number;
  is_deal: boolean;
}

interface Subcategory {
  _id: string;
  id?: string;
  category_id: string;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [isDeal, setIsDeal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [subcatInput, setSubcatInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newSubName, setNewSubName] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [cats, subs] = await Promise.all([
        api.getCategories(),
        api.getSubcategories(),
      ]);
      setCategories(cats);
      setSubcategories(subs);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditCat(null); setName(""); setIsDeal(false); setImageUrl(null); setSubcatInput(""); setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCat(cat); setName(cat.name); setIsDeal(cat.is_deal); setImageUrl(cat.image_url); setSubcatInput(""); setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const catData = { name: name.trim(), image_url: imageUrl, is_deal: isDeal, sort_order: editCat?.sort_order ?? categories.length };

      let catId: string;
      if (editCat) {
        await api.updateCategory(editCat._id, catData);
        catId = editCat._id;
      } else {
        const result = await api.addCategory(catData);
        catId = result._id;
      }

      // Add subcategories
      if (subcatInput.trim()) {
        const newSubs = subcatInput.split(",").map(s => s.trim()).filter(Boolean).map(s => ({ category_id: catId, name: s }));
        if (newSubs.length > 0) {
          await api.addSubcategories(newSubs);
        }
      }

      toast.success(editCat ? "Category updated!" : "Category added!");
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save category");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.deleteCategory(id);
      toast.success("Category deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const addSubcategory = async (categoryId: string) => {
    if (!newSubName.trim()) return;
    try {
      await api.addSubcategory({ category_id: categoryId, name: newSubName.trim() });
      setNewSubName("");
      fetchData();
    } catch (error) {
      toast.error("Failed to add subcategory");
    }
  };

  const deleteSubcategory = async (id: string) => {
    try {
      await api.deleteSubcategory(id);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm">Organize your product catalog</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCat ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editCat ? "Update category details" : "Create a new product category"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 6 Trolley" />
            </div>
            <div className="space-y-2">
              <Label>Category Image</Label>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              {imageUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border mx-auto">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImageUrl(null)} className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{uploading ? "Uploading..." : "Click to upload category image"}</p>
                  <p className="text-xs mt-1">PNG, JPG (recommended: 120×120px circular)</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Is Deal / Offer Category</span>
              <Switch checked={isDeal} onCheckedChange={setIsDeal} />
            </div>
            <div className="space-y-2">
              <Label>Subcategories (comma-separated)</Label>
              <Input value={subcatInput} onChange={e => setSubcatInput(e.target.value)} placeholder="Small, Medium, Large" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editCat ? "Update" : "Save Category"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Circular Category Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Frontend Category Bar Preview</h3>
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet. Add your first category!</p>
            ) : categories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 border-border flex items-center justify-center ${cat.is_deal ? 'bg-orange-50' : 'bg-muted/50'}`}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-orange-500 text-xl font-bold">%</span>
                  )}
                </div>
                <span className="text-xs font-medium text-center whitespace-nowrap">{cat.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category List */}
      <div className="grid gap-3">
        {categories.map((cat) => {
          const catSubs = subcategories.filter(s => s.category_id === cat.id);
          return (
            <Card key={cat.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border flex items-center justify-center bg-muted/30">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{catSubs.length} subcategories</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(cat); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedId === cat.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                {expandedId === cat.id && (
                  <div className="border-t bg-muted/20 p-4 pl-20">
                    <div className="flex flex-wrap gap-2">
                      {catSubs.map((sub) => (
                        <Badge key={sub.id} variant="secondary" className="text-xs group">
                          {sub.name}
                          <button onClick={() => deleteSubcategory(sub.id)} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <div className="flex items-center gap-1">
                        <Input value={newSubName} onChange={e => setNewSubName(e.target.value)}
                          placeholder="New sub..." className="h-6 text-xs w-24"
                          onKeyDown={e => e.key === "Enter" && addSubcategory(cat.id)} />
                        <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => addSubcategory(cat.id)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
