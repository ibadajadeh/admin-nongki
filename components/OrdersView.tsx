'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Coffee, 
  ChevronRight, 
  Eye, 
  Trash2,
  Calendar,
  User,
  CreditCard,
  Receipt,
  Printer
} from 'lucide-react';
import { Order, OrderStatus, Place, MenuItem, OrderItem } from '@/lib/types';

interface OrdersViewProps {
  orders: Order[];
  places: Place[];
  menus: MenuItem[];
  onAddOrder: (order: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Promise<void>;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  searchQuery: string;
  selectedOrderForDetail: Order | null;
  setSelectedOrderForDetail: (order: Order | null) => void;
}

const ORDER_STATUSES: OrderStatus[] = ['Menunggu', 'Diproses', 'Selesai', 'Dibatalkan'];

export default function OrdersView({
  orders,
  places,
  menus,
  onAddOrder,
  onUpdateStatus,
  onDeleteOrder,
  searchQuery,
  selectedOrderForDetail,
  setSelectedOrderForDetail,
}: OrdersViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Order Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    table_number: 'Meja 01',
    order_type: 'Dine In' as 'Dine In' | 'Take Away' | 'Reservasi',
    place_id: places[0]?.id || '',
    payment_method: 'QRIS',
    notes: '',
    selectedMenuId: menus[0]?.id || '',
    menuQuantity: 1,
  });

  const [currentItems, setCurrentItems] = useState<OrderItem[]>([]);

  const filteredOrders = orders.filter((o) => {
    const matchStatus = selectedStatus === 'Semua' || o.order_status === selectedStatus;
    const matchType = selectedType === 'Semua' || o.order_type === selectedType;
    const matchQuery =
      !searchQuery ||
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.table_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchType && matchQuery;
  });

  const handleAddItemToOrder = () => {
    const menuItem = menus.find((m) => m.id === formData.selectedMenuId);
    if (!menuItem) return;

    const newItem: OrderItem = {
      id: `oi-${Date.now()}`,
      menu_id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: formData.menuQuantity,
    };

    setCurrentItems([...currentItems, newItem]);
    setFormData((prev) => ({ ...prev, menuQuantity: 1 }));
  };

  const handleRemoveItem = (id: string) => {
    setCurrentItems(currentItems.filter((i) => i.id !== id));
  };

  const calculatedTotal = currentItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentItems.length === 0) {
      alert('Pilih minimal satu item menu.');
      return;
    }

    const place = places.find((p) => p.id === formData.place_id);

    await onAddOrder({
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      table_number: formData.table_number,
      order_type: formData.order_type,
      place_id: formData.place_id,
      place_name: place?.name || 'Cafe Nongki',
      items: currentItems,
      total_amount: calculatedTotal,
      order_status: 'Diproses',
      payment_status: 'Lunas',
      payment_method: formData.payment_method,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    setCurrentItems([]);
  };

  const statusBadge = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      Menunggu: 'bg-amber-100 text-amber-800 border-amber-300',
      Diproses: 'bg-blue-100 text-blue-800 border-blue-300',
      Selesai: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Dibatalkan: 'bg-red-100 text-red-800 border-red-300',
    };
    return (
      <span
        className={`px-2.5 py-0.8 rounded-full text-[11px] font-bold border ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-coffee-950">
            Daftar Pesanan Nongki
          </h1>
          <p className="text-xs text-brownies-500">
            Pantau dan proses transaksi pemesanan meja dan takeaway.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentItems([]);
            setIsAddModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-caramel-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Order Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedStatus('Semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedStatus === 'Semua'
                ? 'bg-caramel-500 text-white shadow-xs'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Semua Status ({orders.length})
          </button>
          {ORDER_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-caramel-500 text-white shadow-xs'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {st} ({orders.filter((o) => o.order_status === st).length})
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-cream-300 text-xs text-coffee-800 font-medium focus:ring-2 focus:ring-caramel-400 focus:outline-none"
          >
            <option value="Semua">Semua Tipe Order</option>
            <option value="Dine In">Dine In (Di Tempat)</option>
            <option value="Take Away">Take Away</option>
            <option value="Reservasi">Reservasi Meja</option>
          </select>
        </div>
      </div>

      {/* Orders Table (matching Image 1) */}
      <div className="rounded-3xl bg-white border border-cream-200/90 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-brownies-500">
            <ShoppingBag className="w-12 h-12 mx-auto text-caramel-400 mb-3" />
            <p className="font-serif font-bold text-base text-coffee-900">
              Tidak ada pesanan ditemukan
            </p>
            <p className="text-xs text-brownies-400 mt-1">
              Gunakan tombol "Buat Order Baru" untuk menambah order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream-50/80 border-b border-cream-200 text-brownies-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pl-6">No. Order</th>
                  <th className="py-3.5 px-4">Tanggal & Waktu</th>
                  <th className="py-3.5 px-4">Nama Pelanggan</th>
                  <th className="py-3.5 px-4">Lokasi & Meja</th>
                  <th className="py-3.5 px-4">Ringkasan Item</th>
                  <th className="py-3.5 px-4">Total Bayar</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-4 pl-6 font-mono font-bold text-coffee-950">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-4 text-brownies-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-caramel-500" />
                        <span>{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <span className="text-[10px] text-brownies-400 font-mono">
                        {new Date(order.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-coffee-900">{order.customer_name}</p>
                      <p className="text-[11px] text-brownies-400">{order.customer_phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-coffee-800">{order.place_name || 'Cafe'}</p>
                      <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-md bg-cream-200 text-coffee-800 font-medium font-mono">
                        {order.table_number} ({order.order_type})
                      </span>
                    </td>
                    <td className="py-4 px-4 text-coffee-700 max-w-xs truncate">
                      {order.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ') || '-'}
                    </td>
                    <td className="py-4 px-4 font-bold text-caramel-600 font-sans">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                      <span className="block text-[10px] text-brownies-400 font-normal">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          onUpdateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="text-[11px] font-bold py-1 px-2 rounded-xl border border-cream-300 bg-white text-coffee-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-caramel-400"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedOrderForDetail(order)}
                          className="px-2.5 py-1 rounded-xl bg-caramel-100 hover:bg-caramel-200 text-caramel-800 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => setDeletingId(order.id)}
                          className="p-1.5 rounded-xl text-brownies-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal (inspired by Image 1 "Order Details") */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-300 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-base font-bold text-coffee-950">
                    {selectedOrderForDetail.order_number}
                  </span>
                  {statusBadge(selectedOrderForDetail.order_status)}
                </div>
                <p className="text-xs text-brownies-500 mt-0.5">
                  Pesanan masuk pada {new Date(selectedOrderForDetail.created_at).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="p-2 rounded-xl text-brownies-400 hover:text-coffee-900 hover:bg-cream-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Status Progress */}
            <div className="py-5 border-b border-cream-200">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {['Menunggu', 'Diproses', 'Selesai', 'Selesai'].map((step, idx) => {
                  const stepIndex = ['Menunggu', 'Diproses', 'Selesai'].indexOf(
                    selectedOrderForDetail.order_status
                  );
                  const isPassed = stepIndex >= idx;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                          isPassed
                            ? 'bg-caramel-500 text-white shadow-sm'
                            : 'bg-cream-200 text-brownies-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          isPassed ? 'text-coffee-950 font-bold' : 'text-brownies-400'
                        }`}
                      >
                        {idx === 0
                          ? 'Dipesan'
                          : idx === 1
                          ? 'Disiapkan'
                          : idx === 2
                          ? 'Siap Saji'
                          : 'Selesai'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-cream-200 text-xs">
              <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] font-bold text-brownies-400 uppercase tracking-wider block mb-1">
                  Data Pelanggan
                </span>
                <p className="font-bold text-coffee-950 text-sm">
                  {selectedOrderForDetail.customer_name}
                </p>
                <p className="text-brownies-600 mt-0.5">{selectedOrderForDetail.customer_phone}</p>
                {selectedOrderForDetail.notes && (
                  <p className="mt-2 text-[11px] italic text-caramel-700 bg-caramel-50 p-2 rounded-xl border border-caramel-200">
                    Catatan: "{selectedOrderForDetail.notes}"
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] font-bold text-brownies-400 uppercase tracking-wider block mb-1">
                  Info Lokasi & Meja
                </span>
                <p className="font-bold text-coffee-950 text-sm">
                  {selectedOrderForDetail.place_name || 'Cafe Nongki'}
                </p>
                <p className="text-brownies-600 mt-0.5">
                  Posisi: {selectedOrderForDetail.table_number} ({selectedOrderForDetail.order_type})
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  Metode: {selectedOrderForDetail.payment_method} ({selectedOrderForDetail.payment_status})
                </p>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="py-4">
              <h4 className="text-xs font-bold text-coffee-800 uppercase tracking-wider mb-2">
                Rincian Menu Dipesan
              </h4>
              <div className="rounded-2xl border border-cream-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-cream-100/70 border-b border-cream-200 text-brownies-500 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 text-left">Item Menu</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Harga</th>
                      <th className="py-2.5 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {selectedOrderForDetail.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-cream-50/50">
                        <td className="py-2.5 px-4 font-medium text-coffee-950">
                          {item.name}
                          {item.notes && (
                            <span className="block text-[10px] text-brownies-400 italic">
                              {item.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-4 text-right text-brownies-600">
                          Rp {item.price.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-coffee-950">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="mt-4 p-4 rounded-2xl bg-cream-100/80 border border-cream-200 flex justify-between items-center text-xs">
                <span className="font-bold text-coffee-900 text-sm">Total Tagihan:</span>
                <span className="font-bold text-xl text-caramel-700 font-sans">
                  Rp {selectedOrderForDetail.total_amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white border border-cream-300 text-coffee-800 text-xs font-semibold hover:bg-cream-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-caramel-600" />
                <span>Cetak Struk</span>
              </button>

              <div className="flex items-center space-x-2">
                {selectedOrderForDetail.order_status !== 'Selesai' && (
                  <button
                    onClick={async () => {
                      await onUpdateStatus(selectedOrderForDetail.id, 'Selesai');
                      setSelectedOrderForDetail(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    Tandai Selesai
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="px-4 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-coffee-800 text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-cream-300 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-serif font-bold text-lg text-coffee-950">
              Hapus Pesanan Ini?
            </h3>
            <p className="text-center text-xs text-brownies-500 mt-2">
              Data pesanan akan dihapus secara permanen dari sistem.
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-coffee-700 hover:bg-cream-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await onDeleteOrder(deletingId);
                  setDeletingId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-600/20 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-300 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-coffee-950">
                    Buat Pesanan Baru
                  </h2>
                  <p className="text-xs text-brownies-500">
                    Input pesanan kasir atau reservasi tempat nongki
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-brownies-400 hover:text-coffee-900 hover:bg-cream-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Nama Pelanggan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    No. Handphone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Tempat Nongki *
                  </label>
                  <select
                    value={formData.place_id}
                    onChange={(e) =>
                      setFormData({ ...formData, place_id: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white"
                  >
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Nomor Meja
                  </label>
                  <input
                    type="text"
                    value={formData.table_number}
                    onChange={(e) =>
                      setFormData({ ...formData, table_number: e.target.value })
                    }
                    placeholder="Meja 05"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Tipe Pesanan
                  </label>
                  <select
                    value={formData.order_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order_type: e.target.value as 'Dine In' | 'Take Away' | 'Reservasi',
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white"
                  >
                    <option value="Dine In">Dine In</option>
                    <option value="Take Away">Take Away</option>
                    <option value="Reservasi">Reservasi</option>
                  </select>
                </div>
              </div>

              {/* Add Items Sub-form */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200">
                <span className="text-xs font-bold text-coffee-900 block mb-2">
                  Tambahkan Menu Minuman / Makanan
                </span>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.selectedMenuId}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedMenuId: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-cream-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-caramel-400"
                  >
                    {menus.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} - Rp {m.price.toLocaleString('id-ID')}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={formData.menuQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        menuQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-16 px-2.5 py-2 rounded-xl border border-cream-300 text-xs text-center font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToOrder}
                    className="px-3 py-2 rounded-xl bg-caramel-500 hover:bg-caramel-600 text-white font-semibold text-xs shadow-xs cursor-pointer"
                  >
                    + Masukkan
                  </button>
                </div>

                {/* Items Selected List */}
                <div className="mt-3 space-y-1.5">
                  {currentItems.length === 0 ? (
                    <p className="text-[11px] text-brownies-400 italic">
                      Belum ada item ditambahkan ke keranjang pesanan.
                    </p>
                  ) : (
                    currentItems.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-cream-200 text-xs"
                      >
                        <span className="font-semibold text-coffee-900">
                          {it.quantity}x {it.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-caramel-700">
                            Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="text-brownies-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_method: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white"
                  >
                    <option value="QRIS">QRIS Dinamis</option>
                    <option value="Tunai / Kasir">Tunai / Kasir</option>
                    <option value="Debit Card">Debit / EDC</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Catatan Khusus
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Less sugar, takeaway cup, dll"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Total display */}
              <div className="p-3.5 rounded-2xl bg-caramel-50 border border-caramel-200 flex items-center justify-between">
                <span className="text-xs font-bold text-coffee-900">Total Pesanan:</span>
                <span className="text-base font-bold text-caramel-700 font-sans">
                  Rp {calculatedTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-cream-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-coffee-700 hover:bg-cream-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white text-xs font-semibold shadow-md shadow-caramel-500/25 cursor-pointer"
                >
                  Simpan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
