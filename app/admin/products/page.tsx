"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Loader2, Image as ImageIcon, Ruler } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Product, Category, ProductImage, ProductSpecification } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    category_id: string;
    price: number;
    compare_at_price: number | null;
    sku: string;
    stock_quantity: number;
    description: string;
    short_description: string;
    is_active: boolean;
    is_featured: boolean;
    images: { image_url: string; is_primary: boolean }[];
    specifications: { spec_name: string; spec_value: string }[];
  }>({
    name: "",
    slug: "",
    category_id: "",
    price: 0,
    compare_at_price: null,
    sku: "",
    stock_quantity: 0,
    description: "",
    short_description: "",
    is_active: true,
    is_featured: false,
    images: [{ image_url: "", is_primary: true }],
    specifications: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*, categories(*), product_images(*), product_specifications(*)'),
        supabase.from('categories').select('*')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      // Map Supabase response to local Product type
      const mappedProducts = productsRes.data.map((p: any) => ({
        ...p,
        images: p.product_images || [],
        specifications: p.product_specifications || []
      }));

      setProducts(mappedProducts);
      setCategories(categoriesRes.data || []);
    } catch (err: any) {
      console.error("Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        category_id: product.category_id,
        price: product.price,
        compare_at_price: product.compare_at_price,
        sku: product.sku || "",
        stock_quantity: product.stock_quantity,
        description: product.description,
        short_description: product.short_description,
        is_active: product.is_active,
        is_featured: product.is_featured,
        images: product.images.length > 0 ? product.images : [{ image_url: "", is_primary: true }],
        specifications: product.specifications || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        slug: "",
        category_id: categories[0]?.id || "",
        price: 0,
        compare_at_price: null,
        sku: "",
        stock_quantity: 0,
        description: "",
        short_description: "",
        is_active: true,
        is_featured: false,
        images: [{ image_url: "", is_primary: true }],
        specifications: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const productPayload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        category_id: formData.category_id,
        price: formData.price,
        compare_at_price: formData.compare_at_price,
        sku: formData.sku,
        stock_quantity: formData.stock_quantity,
        description: formData.description,
        short_description: formData.short_description,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      let productId: string;

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
        if (error) throw error;
        productId = editingProduct.id;
      } else {
        const { data, error } = await supabase.from('products').insert([productPayload]).select();
        if (error) throw error;
        productId = data[0].id;
      }

      // Handle Images & Specs (Delete old, insert new for simplicity in this MVP)
      await Promise.all([
        supabase.from('product_images').delete().eq('product_id', productId),
        supabase.from('product_specifications').delete().eq('product_id', productId)
      ]);

      const validImages = formData.images.filter(img => img.image_url).map(img => ({ ...img, product_id: productId }));
      const validSpecs = formData.specifications.filter(s => s.spec_name && s.spec_value).map(s => ({ ...s, product_id: productId }));

      if (validImages.length > 0) {
        const { error } = await supabase.from('product_images').insert(validImages);
        if (error) throw error;
      }
      
      if (validSpecs.length > 0) {
        const { error } = await supabase.from('product_specifications').insert(validSpecs);
        if (error) throw error;
      }

      setIsDialogOpen(false);
      fetchInitialData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the product and its data.")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchInitialData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addSpecification = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { spec_name: "", spec_value: "" }] });
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Set prices, manage inventory, and add product media.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border overflow-hidden relative shrink-0">
                        <Image src={product.images.find(img => img.is_primary)?.image_url || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock_quantity} left
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-0 shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif font-bold">
              {editingProduct ? "Edit Product" : "New Product"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Provide product details, pricing, stock levels, and high-quality imagery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-8 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: General & Pricing */}
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">General Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-semibold text-gray-900">Product Name</Label>
                      <Input 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. Chrome Waterfall Shower"
                        required 
                        className="h-11 rounded-lg border-gray-200 focus:ring-accent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-[13px] font-semibold text-gray-900">Category</Label>
                        <Select value={formData.category_id} onValueChange={(val: string | null) => setFormData({...formData, category_id: val ?? ""})}>
                          <SelectTrigger className="h-11 rounded-lg border-gray-200"><SelectValue placeholder="Select Category" /></SelectTrigger>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[13px] font-semibold text-gray-900">SKU</Label>
                        <Input 
                          value={formData.sku} 
                          onChange={e => setFormData({...formData, sku: e.target.value})} 
                          placeholder="e.g. HB-SHW-001"
                          className="h-11 rounded-lg border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Pricing & Inventory</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-semibold text-gray-900">Sales Price ($)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                        required 
                        className="h-11 rounded-lg border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-semibold text-gray-900">Compare at Price ($)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={formData.compare_at_price || ""} 
                        onChange={e => setFormData({...formData, compare_at_price: e.target.value ? parseFloat(e.target.value) : null})} 
                        className="h-11 rounded-lg border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-semibold text-gray-900">Initial Stock</Label>
                      <Input 
                        type="number" 
                        value={formData.stock_quantity} 
                        onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})} 
                        className="h-11 rounded-lg border-gray-200"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <Checkbox 
                        id="feat" 
                        checked={formData.is_featured} 
                        onCheckedChange={checked => setFormData({...formData, is_featured: !!checked})} 
                      />
                      <Label htmlFor="feat" className="text-sm font-medium cursor-pointer">Feature on Homepage</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Full Description</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-semibold text-gray-900">Short Summary</Label>
                      <Input 
                        value={formData.short_description} 
                        onChange={e => setFormData({...formData, short_description: e.target.value})} 
                        placeholder="Visible on product cards..."
                        className="h-11 rounded-lg border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-semibold text-gray-900">Long Description</Label>
                      <Textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        className="h-32 rounded-lg border-gray-200 resize-none" 
                        placeholder="Detailed specifications..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Media & Specifications */}
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Product Media</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group/media">
                        <ImageUpload 
                          label={idx === 0 ? "Main Image" : `Gallery #${idx}`}
                          value={img.image_url}
                          aspectRatio={4/5}
                          recommendedSize="1080 x 1350 px"
                          onChange={(url) => {
                            const newImages = [...formData.images];
                            newImages[idx].image_url = url;
                            setFormData({ ...formData, images: newImages });
                          }}
                          onRemove={() => {
                            if (formData.images.length > 1) {
                              const newImages = formData.images.filter((_, i) => i !== idx);
                              setFormData({ ...formData, images: newImages });
                            } else {
                              const newImages = [...formData.images];
                              newImages[idx].image_url = "";
                              setFormData({ ...formData, images: newImages });
                            }
                          }}
                        />
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, images: [...formData.images, { image_url: "", is_primary: false }]})}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary/30 transition-all aspect-[4/5]"
                    >
                      <Plus className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Add More</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Specifications</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={addSpecification} className="h-6 text-accent hover:bg-accent/5">
                      <Plus className="w-3 h-3 mr-1" /> Add Spec
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-2 group/spec items-start animate-in fade-in slide-in-from-top-1 duration-200">
                        <Input 
                          placeholder="Name" 
                          value={spec.spec_name} 
                          onChange={e => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[idx].spec_name = e.target.value;
                            setFormData({...formData, specifications: newSpecs});
                          }} 
                          className="h-10 text-xs"
                        />
                        <Input 
                          placeholder="Value" 
                          value={spec.spec_value} 
                          onChange={e => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[idx].spec_value = e.target.value;
                            setFormData({...formData, specifications: newSpecs});
                          }} 
                          className="h-10 text-xs"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            const newSpecs = formData.specifications.filter((_, i) => i !== idx);
                            setFormData({...formData, specifications: newSpecs});
                          }}
                          className="h-10 w-10 text-gray-300 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="px-8">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="min-w-[140px] shadow-lg shadow-primary/20">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingProduct ? "Update Product" : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
