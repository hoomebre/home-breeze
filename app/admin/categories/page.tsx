"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Edit, Trash2, Loader2, Search } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
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
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Error fetching categories:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.image_url,
        display_order: category.display_order,
        is_active: category.is_active
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        display_order: categories.length + 1,
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([payload]);
        if (error) throw error;
      }

      setIsDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and collections.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Image/Icon</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    No categories found. Start by adding one.
                  </td>
                </tr>
              ) : categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden relative shrink-0">
                      {category.image_url ? (
                        <Image src={category.image_url} alt={category.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">/{category.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    {category.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                      <Edit className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 border-0 shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif font-bold tracking-tight">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Set the foundational details and branding for this collection.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cat-name" className="text-[13px] font-semibold text-gray-900">Category Name</Label>
                <Input 
                  id="cat-name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Luxury Showers"
                  required
                  className="h-11 rounded-lg border-gray-200 focus:ring-accent"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cat-desc" className="text-[13px] font-semibold text-gray-900">Description</Label>
                <Input 
                  id="cat-desc" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief summary of what's in this category..."
                  className="h-11 rounded-lg border-gray-200"
                />
              </div>
              
              <div className="pt-2">
                <ImageUpload 
                  label="Category Cover Image"
                  value={formData.image_url}
                  aspectRatio={4/5}
                  recommendedSize="1080 x 1350 px"
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  onRemove={() => setFormData({ ...formData, image_url: "" })}
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="px-6">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="min-w-[140px] shadow-lg shadow-primary/10">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
