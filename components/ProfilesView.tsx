'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  Store, 
  CreditCard, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X, 
  AlertCircle,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Profile, UserRole, UserStatus, Place } from '@/lib/types';

interface ProfilesViewProps {
  profiles: Profile[];
  places: Place[];
  onAddProfile: (profile: Omit<Profile, 'id' | 'created_at'>) => Promise<void>;
  onUpdateProfile: (id: string, updates: Partial<Profile>) => Promise<void>;
  onDeleteProfile: (id: string) => Promise<void>;
  searchQuery: string;
}

const ROLES: UserRole[] = ['admin', 'merchant', 'cashier', 'customer'];

export default function ProfilesView({
  profiles,
  places,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  searchQuery,
}: ProfilesViewProps) {
  const [selectedRole, setSelectedRole] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'customer' as UserRole,
    store_id: '',
    store_name: '',
    avatar_url: '',
    status: 'active' as UserStatus,
  });

  const filteredProfiles = profiles.filter((p) => {
    const matchRole = selectedRole === 'Semua' || p.role === selectedRole;
    const matchStatus = selectedStatus === 'Semua' || p.status === selectedStatus;
    const matchQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.store_name && p.store_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchStatus && matchQuery;
  });

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      role: 'customer',
      store_id: '',
      store_name: '',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone || '',
      role: profile.role as UserRole,
      store_id: profile.store_id || '',
      store_name: profile.store_name || '',
      avatar_url: profile.avatar_url || '',
      status: profile.status as UserStatus,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStore = places.find((pl) => pl.id === formData.store_id);

    const payload = {
      ...formData,
      store_name: selectedStore ? selectedStore.name : formData.store_name || null,
      store_id: formData.store_id || null,
      phone: formData.phone || null,
      avatar_url: formData.avatar_url || null,
    };

    if (editingProfile) {
      await onUpdateProfile(editingProfile.id, payload);
    } else {
      await onAddProfile(payload);
    }
    setIsModalOpen(false);
  };

  const roleBadge = (role: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      admin: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-800', label: 'Admin' },
      merchant: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-800', label: 'Merchant Cafe' },
      cashier: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-800', label: 'Kasir' },
      customer: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-800', label: 'Pelanggan' },
    };

    const conf = styles[role] || { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-800', label: role };
    return (
      <span className={`px-2.5 py-0.8 rounded-full text-[10px] font-bold border ${conf.bg} ${conf.text}`}>
        {conf.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-coffee-950">
            Manajemen Profil & Pengguna Nongki
          </h1>
          <p className="text-xs text-brownies-500">
            Kelola data akun pengguna, hak akses peran (Admin, Merchant, Kasir, Pelanggan), dan status akun.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-caramel-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah User Baru</span>
        </button>
      </div>

      {/* User Stats Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-cream-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-brownies-400 uppercase tracking-wider block">Total User</span>
          <p className="text-xl font-bold text-coffee-950 mt-1 font-sans">{profiles.length} Pengguna</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-cream-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-brownies-400 uppercase tracking-wider block">Merchant Cafe</span>
          <p className="text-xl font-bold text-amber-700 mt-1 font-sans">
            {profiles.filter((p) => p.role === 'merchant').length} Mitra
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-cream-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-brownies-400 uppercase tracking-wider block">Kasir</span>
          <p className="text-xl font-bold text-blue-700 mt-1 font-sans">
            {profiles.filter((p) => p.role === 'cashier').length} Kasir
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-cream-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-brownies-400 uppercase tracking-wider block">Pelanggan Aktif</span>
          <p className="text-xl font-bold text-emerald-700 mt-1 font-sans">
            {profiles.filter((p) => p.role === 'customer').length} Akun
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Role Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedRole('Semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedRole === 'Semua'
                ? 'bg-caramel-500 text-white shadow-xs'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Semua Peran ({profiles.length})
          </button>
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all cursor-pointer ${
                selectedRole === r
                  ? 'bg-caramel-500 text-white shadow-xs'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {r === 'merchant' ? 'Merchant' : r === 'cashier' ? 'Kasir' : r === 'customer' ? 'Pelanggan' : 'Admin'} (
              {profiles.filter((p) => p.role === r).length})
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-cream-300 text-xs text-coffee-800 font-medium focus:ring-2 focus:ring-caramel-400 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="active">Aktif (Active)</option>
            <option value="inactive">Non-aktif (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="rounded-3xl bg-white border border-cream-200/90 shadow-xs overflow-hidden">
        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center text-brownies-500">
            <Users className="w-12 h-12 mx-auto text-caramel-400 mb-3" />
            <p className="font-serif font-bold text-base text-coffee-900">
              Tidak ada profil pengguna ditemukan
            </p>
            <p className="text-xs text-brownies-400 mt-1">
              Ubah filter peran atau gunakan tombol "Tambah User Baru".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream-50/80 border-b border-cream-200 text-brownies-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pl-6">Profil Pengguna</th>
                  <th className="py-3.5 px-4">Kontak (Email / Telp)</th>
                  <th className="py-3.5 px-4">Peran (Role)</th>
                  <th className="py-3.5 px-4">Store Afiliasi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Terdaftar</th>
                  <th className="py-3.5 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredProfiles.map((user) => (
                  <tr key={user.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            user.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F2D8BA&color=7A4B2C`
                          }
                          alt={user.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-cream-300 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-coffee-950">{user.name}</p>
                          <p className="text-[11px] text-brownies-400 font-mono">@{user.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-coffee-800">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-caramel-500 shrink-0" />
                        <span className="font-medium truncate">{user.email}</span>
                      </div>
                      {user.phone ? (
                        <div className="flex items-center space-x-1.5 mt-0.5 text-[11px] text-brownies-400">
                          <Phone className="w-3 h-3 text-brownies-400 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-brownies-300">-</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {roleBadge(user.role)}
                    </td>

                    <td className="py-4 px-4">
                      {user.store_name ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-xl bg-cream-100 text-coffee-800 text-[11px] font-semibold border border-cream-200">
                          <Store className="w-3 h-3 text-caramel-600" />
                          <span>{user.store_name}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-brownies-400 italic">Semua Toko / Global</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() =>
                          onUpdateProfile(user.id, {
                            status: user.status === 'active' ? 'inactive' : 'active',
                          })
                        }
                        title="Klik untuk ubah status aktif"
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.8 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Non-aktif</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-brownies-400 text-[11px]">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 rounded-xl text-brownies-600 hover:text-caramel-600 hover:bg-cream-100 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(user.id)}
                          className="p-2 rounded-xl text-brownies-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-cream-300 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-serif font-bold text-lg text-coffee-950">
              Hapus User Profil?
            </h3>
            <p className="text-center text-xs text-brownies-500 mt-2">
              Akun pengguna ini akan dihapus dari tabel profiles Supabase.
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
                  await onDeleteProfile(deletingId);
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

      {/* Add / Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-300 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-coffee-950">
                    {editingProfile ? 'Edit Profil Pengguna' : 'Tambah Pengguna Baru'}
                  </h2>
                  <p className="text-xs text-brownies-500">
                    Form pendaftaran & pengaturan hak akses user nongki
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
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Bambang Sudarsono"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="bambang_impian"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@nongki.id"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    No. Handphone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Peran / Role Pengguna *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white font-medium"
                  >
                    <option value="customer">Pelanggan (Customer)</option>
                    <option value="merchant">Merchant Cafe</option>
                    <option value="cashier">Kasir Cafe</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Status Akun
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white font-medium"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-aktif / Diblokir</option>
                  </select>
                </div>
              </div>

              {/* Store Assignment (for merchant / cashier) */}
              {(formData.role === 'merchant' || formData.role === 'cashier') && (
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                    Pilih Cafe Afiliasi (Store)
                  </label>
                  <select
                    value={formData.store_id}
                    onChange={(e) => {
                      const st = places.find((p) => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        store_id: e.target.value,
                        store_name: st ? st.name : '',
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none bg-white font-medium"
                  >
                    <option value="">-- Pilih Tempat Nongki --</option>
                    {places.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name} ({pl.address})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1">
                  URL Avatar / Foto Profil
                </label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                />
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
                  {editingProfile ? 'Simpan Perubahan' : 'Tambahkan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
