'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Store, 
  Star, 
  ArrowUpRight, 
  Coffee, 
  Users, 
  Clock, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Place, MenuItem, Order, Review } from '@/lib/types';

interface DashboardViewProps {
  places: Place[];
  menus: MenuItem[];
  orders: Order[];
  reviews: Review[];
  onNavigateTab: (tab: 'places' | 'menus' | 'orders' | 'reviews') => void;
  onSelectOrder: (order: Order) => void;
}

export default function DashboardView({
  places,
  menus,
  orders,
  reviews,
  onNavigateTab,
  onSelectOrder,
}: DashboardViewProps) {
  const [chartPeriod, setChartPeriod] = useState<'mingguan' | 'bulanan'>('mingguan');

  // Compute metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total_amount, 0);
  const activePlacesCount = places.filter((p) => p.is_active).length;
  const popularMenus = menus.filter((m) => m.is_popular).slice(0, 4);
  const avgRating = (
    places.reduce((acc, curr) => acc + curr.rating, 0) / (places.length || 1)
  ).toFixed(1);

  // SVG Chart points for weekly sales
  const weeklyData = [
    { day: 'Sen', sales: 42, visits: 85 },
    { day: 'Sel', sales: 58, visits: 110 },
    { day: 'Rab', sales: 65, visits: 125 },
    { day: 'Kam', sales: 52, visits: 95 },
    { day: 'Jum', sales: 88, visits: 190 },
    { day: 'Sab', sales: 120, visits: 260 },
    { day: 'Min', sales: 115, visits: 240 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-coffee-900 via-coffee-800 to-brownies-700 text-white relative overflow-hidden shadow-xl border border-coffee-700/50">
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80')`,
          }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-caramel-500/20 border border-caramel-400/30 text-caramel-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Overview Analytics Nongki</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50 leading-tight">
            Pantau Performa Cafe & Pesanan Secara Real-time
          </h1>
          <p className="mt-2 text-sm text-cream-200/90 leading-relaxed">
            Data terintegrasi langsung dengan database Supabase Cloud. Kelola menu favorit, lacak status meja pelanggan, dan lihat ulasan terbaru.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Omset */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brownies-500 uppercase tracking-wider">
              Total Omset
            </span>
            <div className="w-9 h-9 rounded-xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-coffee-950 font-sans">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Pesanan */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brownies-500 uppercase tracking-wider">
              Total Pesanan
            </span>
            <div className="w-9 h-9 rounded-xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-coffee-950 font-sans">
              {orders.length} Transaksi
            </p>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-caramel-600 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{orders.filter((o) => o.order_status === 'Diproses').length} sedang diseduh</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tempat Nongki */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brownies-500 uppercase tracking-wider">
              Tempat Nongki
            </span>
            <div className="w-9 h-9 rounded-xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-coffee-950 font-sans">
              {places.length} Cafe & Spot
            </p>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activePlacesCount} lokasi aktif melayani</span>
            </div>
          </div>
        </div>

        {/* Card 4: Kepuasan Nongki */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brownies-500 uppercase tracking-wider">
              Rating Pelanggan
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-coffee-950 font-sans">
              {avgRating} <span className="text-sm font-normal text-brownies-400">/ 5.0</span>
            </p>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-brownies-600 font-medium">
              <span>Berdasarkan {reviews.length} ulasan terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Favorite Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales & Visit Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-cream-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-coffee-950">
                Tren Kunjungan & Penjualan Nongki
              </h2>
              <p className="text-xs text-brownies-500">
                Aktivitas akhir pekan cenderung naik hingga 140% di cafe rooftop & vintage.
              </p>
            </div>
            <div className="flex items-center bg-cream-100 p-1 rounded-2xl border border-cream-200 text-xs">
              <button
                onClick={() => setChartPeriod('mingguan')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  chartPeriod === 'mingguan'
                    ? 'bg-caramel-500 text-white shadow-xs'
                    : 'text-coffee-700 hover:text-coffee-950'
                }`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setChartPeriod('bulanan')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  chartPeriod === 'bulanan'
                    ? 'bg-caramel-500 text-white shadow-xs'
                    : 'text-coffee-700 hover:text-coffee-950'
                }`}
              >
                Bulanan
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization in warm coffee/caramel tones */}
          <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-cream-200">
            {weeklyData.map((d, i) => {
              const maxVal = 140;
              const barHeight = (d.sales / maxVal) * 100;
              const visitHeight = (d.visits / 300) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Bar 1: Sales (Caramel) */}
                    <div
                      style={{ height: `${barHeight}%` }}
                      className="w-full max-w-[18px] bg-gradient-to-t from-caramel-600 to-caramel-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-coffee-950 text-white text-[10px] py-1 px-1.5 rounded font-mono pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-md">
                        {d.sales} Cup
                      </div>
                    </div>
                    {/* Bar 2: Visitors (Brownies/Coffee) */}
                    <div
                      style={{ height: `${visitHeight}%` }}
                      className="w-full max-w-[18px] bg-gradient-to-t from-coffee-800 to-brownies-500 rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-coffee-950 text-white text-[10px] py-1 px-1.5 rounded font-mono pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-md">
                        {d.visits} Tamu
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-coffee-600 mt-2 block">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-brownies-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-caramel-500" />
                <span>Kopi Terjual (Cup)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-coffee-800" />
                <span>Pengunjung Cafe (Orang)</span>
              </div>
            </div>
            <span className="text-[11px] text-brownies-400">Puncak order: Jumat - Sabtu</span>
          </div>
        </div>

        {/* Right 1 Col: Favorite Nongki Items (matching Image 1) */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-coffee-950">
                Menu Favorit Nongki
              </h2>
              <button
                onClick={() => onNavigateTab('menus')}
                className="text-xs font-semibold text-caramel-600 hover:text-caramel-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {popularMenus.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-2.5 rounded-2xl bg-cream-50/80 hover:bg-caramel-50/60 border border-cream-200 transition-colors"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-13 h-13 rounded-xl object-cover shrink-0 border border-cream-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-coffee-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-brownies-500 truncate">{item.place_name}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-semibold text-caramel-600">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-700 font-medium">
                        Tersedia
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-cream-200">
            <button
              onClick={() => onNavigateTab('places')}
              className="w-full py-2.5 px-3 rounded-2xl bg-cream-100 hover:bg-caramel-100 text-coffee-900 hover:text-caramel-800 border border-cream-300 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4 text-caramel-600" />
              <span>Kelola {places.length} Tempat Nongki</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-cream-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-serif font-bold text-coffee-950">Pesanan Terkini</h2>
              <p className="text-xs text-brownies-500">Daftar transaksi pelanggan nongki terbaru</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-caramel-600 hover:text-caramel-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Semua Pesanan ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 text-brownies-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">No. Order</th>
                  <th className="pb-3">Pelanggan</th>
                  <th className="pb-3">Lokasi / Meja</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.slice(0, 5).map((order) => {
                  const statusColors: Record<string, string> = {
                    Menunggu: 'bg-amber-100 text-amber-700 border-amber-300',
                    Diproses: 'bg-blue-100 text-blue-700 border-blue-300',
                    Selesai: 'bg-emerald-100 text-emerald-700 border-emerald-300',
                    Dibatalkan: 'bg-red-100 text-red-700 border-red-300',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-cream-50/80 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-coffee-900">
                        {order.order_number}
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-coffee-900">{order.customer_name}</p>
                        <p className="text-[10px] text-brownies-400">{order.customer_phone}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-coffee-800">{order.place_name || 'Cafe'}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cream-200 text-coffee-700 font-mono">
                          {order.table_number}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-caramel-600">
                        Rp {order.total_amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            statusColors[order.order_status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1 rounded-xl bg-caramel-100 hover:bg-caramel-200 text-caramel-700 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews (1 col) */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-coffee-950">Ulasan Terbaru</h2>
              <button
                onClick={() => onNavigateTab('reviews')}
                className="text-xs font-semibold text-caramel-600 hover:text-caramel-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {reviews.slice(0, 3).map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-cream-50/90 border border-cream-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-coffee-900">{rev.customer_name}</span>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-coffee-700 line-clamp-2 leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <p className="text-[10px] text-brownies-400 mt-2 font-medium">
                    {rev.place_name || 'Cafe Nongki'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cream-200 text-center">
            <span className="text-[11px] text-brownies-400">
              Moderasi ulasan aktif di menu Ulasan Pelanggan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
