"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Loader2, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Track and manage customer orders and fulfillment status.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, name, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No orders found.</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">
                    {order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className={`text-xs font-medium rounded-full px-2 py-1 outline-none border-0 ring-1 ring-inset ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                        order.status === 'processing' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 
                        order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : 
                        'bg-red-50 text-red-700 ring-red-600/20'
                      }`}
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">${order.total_amount.toFixed(2)}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{order.order_items?.length || 0} items</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl p-0 border-0 shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4 bg-gray-50/50 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl font-serif font-bold tracking-tight">
                  Order #{selectedOrder?.id?.slice(0, 8).toUpperCase()}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">Placed on {selectedOrder && new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                selectedOrder?.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                selectedOrder?.status === 'processing' ? 'bg-blue-100 text-blue-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedOrder?.status}
              </div>
            </div>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="p-8 space-y-10">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Customer Information</h4>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer_email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Shipping Log</h4>
                  <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-accent/20 pl-4">
                    {selectedOrder.shipping_address}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Product Manifest</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-6 py-3 text-left">Item Name</th>
                        <th className="px-6 py-3 text-center">Qty</th>
                        <th className="px-6 py-3 text-right">Unit Price</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.order_items?.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{item.products?.name}</td>
                          <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-6 py-4 text-right text-gray-600">${item.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50/50">
                      <tr className="border-t-2 border-gray-100">
                        <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-900">Final Total</td>
                        <td className="px-6 py-4 text-right font-bold text-xl text-primary">${selectedOrder.total_amount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="rounded-lg px-8">Close Details</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
