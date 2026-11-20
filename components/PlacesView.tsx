'use client';

import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Edit, 
  Trash2, 
  ExternalLink, 
  X, 
  Check, 
  Coffee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Place, CategoryPlace } from '@/lib/types';

interface PlacesViewProps {
  places: Place[];
  onAddPlace: (place: Omit<Place, 'id' | 'created_at' | 'review_count'>) => Promise<void>;
  onUpdatePlace: (id: string, updates: Partial<Place>) => Promise<void>;
  onDeletePlace: (id: string) => Promise<void>;
  searchQuery: string;
}

const CATEGORIES: CategoryPlace[] = [
  'Coffee Shop',
  'Roastery',
  'Rooftop Cafe',
  'Working Space',
  'Cozy Vintage',
  'Outdoor Garden',
];

const AVAILABLE_FACILITIES = [
  'WiFi Cepat',
  'Colokan Banyak',
  'AC Dingin',
  'Smoking Area',
  'Outdoor Rooftop',
  'Live Music',
  'Parkir Luas',
  'Musholla',
  'Pet Friendly',
  'Spot Foto Aesthetic',
];

export default function PlacesView({
  places,
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
  searchQuery,
}: PlacesViewProps) {
  const [selectedCity, setSelectedCity] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Coffee Shop' as CategoryPlace,
    address: '',
    city: 'Jakarta Selatan',
    open_hours: '08:00 - 22:00 WIB',
    price_range: 'Rp 20.000 - Rp 50.000',
    facilities: ['WiFi Cepat', 'Colokan Banyak'],
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    phone: '',
    instagram: '',
    is_active: true,
  });

  const cities = ['Semua', ...Array.from(new Set(places.map((p) => p.city)))];

  const filteredPlaces = places.filter((p) => {
    const matchCity = selectedCity === 'Semua' || p.city === selectedCity;
    const matchQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchQuery;
  });

  const handleOpenAdd = () => {
    setEditingPlace(null);
    setFormData({
      name: '',
      category: 'Coffee Shop',
      address: '',
      city: 'Jakarta Selatan',
      open_hours: '08:00 - 22:00 WIB',
      price_range: 'Rp 25.000 - Rp 60.000',
      facilities: ['WiFi Cepat', 'Colokan Banyak'],
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      phone: '0812-3456-7890',
      instagram: '@nongkicafe',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      category: place.category as CategoryPlace,
      address: place.address,
      city: place.city,
      open_hours: place.open_hours,
      price_range: place.price_range,
      facilities: place.facilities || [],
      rating: place.rating,
      image_url: place.image_url,
      phone: place.phone || '',
      instagram: place.instagram || '',
      is_active: place.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingPlace) {
      await onUpdatePlace(editingPlace.id, {
        ...formData,
        slug,
      });
    } else {
      await onAddPlace({
        ...formData,
        slug,
      });
    }
    setIsModalOpen(false);
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header bar for Places */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-coffee-950">
            Tempat Nongki & Cafe Hub
          </h1>
          <p className="text-xs text-brownies-500">
            Kelola data cafe, spot nongkrong, fasilitas, dan jam operasional.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-caramel-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tempat Nongki</span>
        </button>
      </div>

      {/* Filter by City Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCity === city
                ? 'bg-caramel-500 text-white shadow-xs'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Grid of Places */}
      {filteredPlaces.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-cream-200 text-brownies-500">
          <Store className="w-12 h-12 mx-auto text-caramel-400 mb-3" />
          <p className="font-serif font-bold text-base text-coffee-900">
            Tidak ada tempat nongki ditemukan
          </p>
          <p className="text-xs text-brownies-400 mt-1">
            Coba ubah filter pencarian atau tambahkan tempat nongki baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Place Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-cream-100">
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/90 text-coffee-900 backdrop-blur-md shadow-xs">
                      {place.category}
                    </span>
                    <span
                      className={`px-2 py-0.8 rounded-xl text-[10px] font-bold text-white shadow-xs ${
                        place.is_active ? 'bg-emerald-600' : 'bg-red-500'
                      }`}
                    >
                      {place.is_active ? 'Buka' : 'Tutup'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-black/60 text-amber-400 backdrop-blur-md text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{place.rating}</span>
                  </div>

                  {/* Bottom Image Overlay text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-lg leading-tight drop-shadow-sm truncate">
                      {place.name}
                    </h3>
                    <p className="text-xs text-cream-200 flex items-center gap-1 mt-0.5 truncate drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-caramel-300" />
                      {place.city}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-brownies-600 line-clamp-2 leading-relaxed">
                    {place.address}
                  </p>

                  <div className="flex items-center justify-between text-xs text-coffee-800 pt-1 border-t border-cream-100">
                    <div className="flex items-center space-x-1.5 text-brownies-500">
                      <Clock className="w-3.5 h-3.5 text-caramel-600" />
                      <span>{place.open_hours}</span>
                    </div>
                    <div className="font-semibold text-caramel-700">
                      {place.price_range}
                    </div>
                  </div>

                  {/* Facilities Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {place.facilities?.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-cream-100 text-brownies-600 text-[10px] font-medium"
                      >
                        {f}
                      </span>
                    ))}
                    {(place.facilities?.length || 0) > 3 && (
                      <span className="px-1.5 py-0.5 rounded-lg bg-cream-100 text-brownies-400 text-[10px]">
                        +{(place.facilities?.length || 0) - 3} lagi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-cream-50/70 border-t border-cream-100 flex items-center justify-between">
                <button
                  onClick={() =>
                    onUpdatePlace(place.id, { is_active: !place.is_active })
                  }
                  className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                    place.is_active
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  Status: {place.is_active ? 'Aktif' : 'Non-aktif'}
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEdit(place)}
                    className="p-2 rounded-xl text-brownies-600 hover:text-caramel-600 hover:bg-white transition-colors cursor-pointer"
                    title="Edit Data"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(place.id)}
                    className="p-2 rounded-xl text-brownies-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Tempat"
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
              Hapus Tempat Nongki?
            </h3>
            <p className="text-center text-xs text-brownies-500 mt-2">
              Tindakan ini akan menghapus data tempat nongki dari database Supabase dan sistem.
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
                  await onDeletePlace(deletingId);
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

      {/* Add / Edit Place Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-300 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-coffee-950">
                    {editingPlace ? 'Edit Tempat Nongki' : 'Tambah Tempat Nongki Baru'}
                  </h2>
                  <p className="text-xs text-brownies-500">
                    Form manajemen data cafe & hangout spot
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Nama Tempat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Kopi Tuku Cipete"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Kategori Tempat
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as CategoryPlace })
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Kota
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Jakarta Selatan, Bandung, dll"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.open_hours}
                    onChange={(e) => setFormData({ ...formData, open_hours: e.target.value })}
                    placeholder="08:00 - 22:00 WIB"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Nama Jalan No. XX, Kecamatan, Kota"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Kisaran Harga
                  </label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    placeholder="Rp 20.000 - Rp 50.000"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@nama.cafe"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  URL Foto Tempat Nongki
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
              </div>

              {/* Facilities Pill selector */}
              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1.5">
                  Fasilitas Tersedia
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_FACILITIES.map((facility) => {
                    const isSelected = formData.facilities.includes(facility);
                    return (
                      <button
                        type="button"
                        key={facility}
                        onClick={() => toggleFacility(facility)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-caramel-500 text-white shadow-xs'
                            : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{facility}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="place_status"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-caramel-600 focus:ring-caramel-400"
                />
                <label htmlFor="place_status" className="text-xs font-semibold text-coffee-900 cursor-pointer">
                  Tempat Nongki Aktif / Melayani Pengunjung
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
                  {editingPlace ? 'Simpan Perubahan' : 'Tambahkan Tempat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
