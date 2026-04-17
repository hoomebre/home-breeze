"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { count: productCount, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (ordersError) throw ordersError;
      if (productError) throw productError;

      // Calculate stats
      const validOrders = orders.filter(o => o.status !== 'cancelled');
      const revenue = validOrders.reduce((acc, o) => acc + o.total_amount, 0);
      const avgValue = validOrders.length > 0 ? revenue / validOrders.length : 0;

      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        activeProducts: productCount || 0,
        avgOrderValue: avgValue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err: any) {
      console.error("Dashboard data fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-gray-500">Total Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Life-time revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-gray-500">Orders</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.totalOrders}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Total orders received</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-gray-500">Products</h3>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.activeProducts}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Active items in store</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-gray-500">Avg. Order Value</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${stats.avgOrderValue.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Average sale per order</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-serif font-semibold text-lg">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-[10px] text-gray-400">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'processing' || order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">${order.total_amount.toFixed(2)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
