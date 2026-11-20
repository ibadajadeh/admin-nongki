'use client';

import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Coffee, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  X,
  AlertCircle
} from 'lucide-react';
import { MenuItem, MenuCategory, Place } from '@/lib/types';

interface MenuViewProps {
  menus: MenuItem[];
  places: Place[];
  onAddMenu: (item: Omit<MenuItem, 'id' | 'created_at'>) => Promise<void>;
  onUpdateMenu: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  onDeleteMenu: (id: string) => Promise<void>;
  searchQuery: string;
}

const CATEGORIES: MenuCategory[] = [
  'Signature Coffee',
  'Espresso Based',
  'Manual Brew',
  'Non-Coffee',
  'Pastry & Cake',
  'Makanan Berat',
  'Snacks & Bites',
];

export default function MenuView({
  menus,
  places,
  onAddMenu,
  onUpdateMenu,
  onDeleteMenu,
  searchQuery,
}: MenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    place_id: places[0]?.id || '',
    category: 'Signature Coffee' as MenuCategory,
    price: 25000,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80',
    is_available: true,
    is_popular: false,
  });

  const filteredMenus = menus.filter((m) => {
    const matchCategory = selectedCategory === 'Semua' || m.category === selectedCategory;
    const matchPlace = selectedPlaceId === 'Semua' || m.place_id === selectedPlaceId;
    const matchQuery =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPlace && matchQuery;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      place_id: places[0]?.id || '',
      category: 'Signature Coffee',
      price: 25000,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80',
      is_available: true,
      is_popular: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      place_id: item.place_id,
      category: item.category as MenuCategory,
      price: item.price,
      description: item.description,
      image_url: item.image_url,
      is_available: item.is_available,
      is_popular: item.is_popular || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const place = places.find((p) => p.id === formData.place_id);

    if (editingItem) {
      await onUpdateMenu(editingItem.id, {
        ...formData,
        place_name: place?.name || 'Cafe Nongki',
      });
    } else {
      await onAddMenu({
        ...formData,
        place_name: place?.name || 'Cafe Nongki',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-coffee-950">
            Daftar Menu & Produk Nongki
          </h1>
          <p className="text-xs text-brownies-500">
            Kelola menu minuman kopi, makanan ringan, pastry dan status ketersediaan stok.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-caramel-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter Category & Place Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-2xl">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'Semua'
                ? 'bg-caramel-500 text-white shadow-xs'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Semua Menu ({menus.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-caramel-500 text-white shadow-xs'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter by Cafe select */}
        <div className="shrink-0">
          <select
            value={selectedPlaceId}
            onChange={(e) => setSelectedPlaceId(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-cream-300 text-xs text-coffee-800 font-medium focus:ring-2 focus:ring-caramel-400 focus:outline-none"
          >
            <option value="Semua">Semua Tempat Nongki</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Menus */}
      {filteredMenus.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-cream-200 text-brownies-500">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-caramel-400 mb-3" />
          <p className="font-serif font-bold text-base text-coffee-900">
            Tidak ada menu yang sesuai
          </p>
          <p className="text-xs text-brownies-400 mt-1">
            Silakan ubah filter kategori atau tambahkan menu baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMenus.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative h-44 w-full bg-cream-100 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2.5 py-0.8 rounded-xl text-[10px] font-bold bg-white/95 text-coffee-900 backdrop-blur-md shadow-xs">
                      {item.category}
                    </span>
                    {item.is_popular && (
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-caramel-500 text-white flex items-center gap-1 shadow-xs">
                        <Flame className="w-2.5 h-2.5" /> Favorit
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() =>
                        onUpdateMenu(item.id, { is_available: !item.is_available })
                      }
                      title="Klik untuk ubah ketersediaan stok"
                      className={`px-2 py-0.8 rounded-xl text-[10px] font-bold backdrop-blur-md shadow-xs cursor-pointer flex items-center gap-1 ${
                        item.is_available
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-red-600/90 text-white'
                      }`}
                    >
                      {item.is_available ? 'Tersedia' : 'Habis'}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-sm text-coffee-950 leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-caramel-700 font-semibold truncate">
                    {item.place_name || 'Cafe Nongki'}
                  </p>
                  <p className="text-[11px] text-brownies-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Bar */}
              <div className="p-4 pt-2 border-t border-cream-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brownies-400 block">Harga</span>
                  <span className="text-sm font-bold text-coffee-950 font-sans">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl text-brownies-600 hover:text-caramel-600 hover:bg-cream-100 transition-colors cursor-pointer"
                    title="Edit Menu"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-2 rounded-xl text-brownies-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-cream-300 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-serif font-bold text-lg text-coffee-950">
              Hapus Menu Nongki?
            </h3>
            <p className="text-center text-xs text-brownies-500 mt-2">
              Item menu ini akan dihapus dari sistem dan katalog cafe.
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
                  await onDeleteMenu(deletingId);
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

      {/* Add / Edit Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-300 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-coffee-950">
                    {editingItem ? 'Edit Menu Nongki' : 'Tambah Menu Baru'}
                  </h2>
                  <p className="text-xs text-brownies-500">
                    Form input katalog menu kopi & makanan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-brownies-400 hover:text-coffee-900 hover:bg-cream-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Es Kopi Susu Tetangga"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Tempat Nongki Asal *
                  </label>
                  <select
                    value={formData.place_id}
                    onChange={(e) => setFormData({ ...formData, place_id: e.target.value })}
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
                    Kategori Menu
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as MenuCategory })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  Harga Satuan (Rupiah) *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  Deskripsi Menu
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Komposisi, rasa, atau notes penyajian..."
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  URL Foto Produk / Minuman
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) =>
                      setFormData({ ...formData, is_available: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-caramel-600 focus:ring-caramel-400"
                  />
                  <span className="text-xs font-semibold text-coffee-900">
                    Stok Tersedia
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) =>
                      setFormData({ ...formData, is_popular: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-caramel-600 focus:ring-caramel-400"
                  />
                  <span className="text-xs font-semibold text-coffee-900">
                    Tandai Menu Favorit
                  </span>
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-cream-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-coffee-700 hover:bg-cream-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white text-xs font-semibold shadow-md shadow-caramel-500/25 cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
