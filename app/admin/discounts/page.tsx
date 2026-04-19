"use client";

import { useEffect, useState } from "react";
import { Plus, Scissors, MoreHorizontal, Trash2, Loader2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: 0,
    min_order_amount: 0,
    is_active: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const { data, error } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDiscounts(data || []);
    } catch (err: any) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (discount?: any) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        code: discount.code,
        type: discount.type,
        value: discount.value,
        min_order_amount: discount.min_order_amount || 0,
        is_active: discount.is_active
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        min_order_amount: 0,
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, code: formData.code.toUpperCase() };
      if (editingDiscount) {
        const { error } = await supabase.from('discount_codes').update(payload).eq('id', editingDiscount.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('discount_codes').insert([payload]);
        if (error) throw error;
      }
      setIsDialogOpen(false);
      fetchDiscounts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from('discount_codes').delete().eq('id', id);
      if (error) throw error;
      fetchDiscounts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Discounts</h1>
          <p className="text-muted-foreground">Manage promo codes and special offers.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Discount
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Title / Code</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : discounts.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No discount codes found.</td></tr>
              ) : discounts.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold font-mono text-gray-900 tracking-wide">{promo.code}</p>
                        <p className="text-gray-500 text-xs mt-0.5">Min. Order: ${promo.min_order_amount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    <span className="font-medium">{promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value.toFixed(2)}`}</span>
                    <span className="text-gray-500 text-xs ml-2">({promo.type})</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(promo)}><Edit className="w-4 h-4 text-gray-400" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 border-0 shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif font-bold tracking-tight">
              {editingDiscount ? "Edit Discount" : "New Discount Code"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Configure promotional offers and minimum spend requirements.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-gray-900">Promo Code</Label>
                <Input 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value})} 
                  placeholder="e.g. BREEZE20"
                  className="h-11 rounded-lg border-gray-200 font-mono tracking-widest text-lg focus:ring-accent uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-gray-900">Discount Type</Label>
                  <Select value={formData.type} onValueChange={(val: string | null) => setFormData({...formData, type: val ?? "percentage"})}>
                    <SelectTrigger className="h-11 rounded-lg border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-gray-900">Value</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} 
                    required 
                    className="h-11 rounded-lg border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-gray-900">Minimum Order Amount ($)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={formData.min_order_amount} 
                  onChange={e => setFormData({...formData, min_order_amount: parseFloat(e.target.value)})} 
                  placeholder="0.00"
                  className="h-11 rounded-lg border-gray-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="px-6">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="min-w-[140px] shadow-lg shadow-primary/10">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingDiscount ? "Update Code" : "Create Code"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
