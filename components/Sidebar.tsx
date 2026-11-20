'use client';

import React from 'react';
import { 
  Coffee, 
  LayoutDashboard, 
  Users,
  Store, 
  UtensilsCrossed, 
  ShoppingBag, 
  MessageSquareHeart, 
  Database, 
  LogOut, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AdminUser } from '@/lib/types';

export type NavTab = 'dashboard' | 'profiles' | 'places' | 'menus' | 'orders' | 'reviews' | 'database';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  adminUser: AdminUser;
  onLogout: () => void;
  ordersCount: number;
  profilesCount: number;
  openSyncModal: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  adminUser,
  onLogout,
  ordersCount,
  profilesCount,
  openSyncModal,
}: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Analytics',
      sublabel: 'Ringkasan & Metrik',
      icon: LayoutDashboard,
    },
    {
      id: 'profiles' as NavTab,
      label: 'User & Profil',
      sublabel: 'Data Pengguna Nongki',
      icon: Users,
      badge: profilesCount > 0 ? profilesCount : undefined,
    },
    {
      id: 'places' as NavTab,
      label: 'Tempat Nongki',
      sublabel: 'Kelola Cafe & Spot',
      icon: Store,
    },
    {
      id: 'menus' as NavTab,
      label: 'Daftar Menu',
      sublabel: 'Kopi & Makanan',
      icon: UtensilsCrossed,
    },
    {
      id: 'orders' as NavTab,
      label: 'Pesanan Masuk',
      sublabel: 'Transaksi & Meja',
      icon: ShoppingBag,
      badge: ordersCount > 0 ? ordersCount : undefined,
    },
    {
      id: 'reviews' as NavTab,
      label: 'Ulasan Pelanggan',
      sublabel: 'Rating & Feedback',
      icon: MessageSquareHeart,
    },
    {
      id: 'database' as NavTab,
      label: 'Supabase Cloud',
      sublabel: 'Status DB & Schema',
      icon: Database,
    },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 text-cream-100 flex flex-col justify-between shrink-0 shadow-2xl border-r border-coffee-800/80 min-h-screen">
      {/* Top Branding Section */}
      <div>
        <div className="p-6 border-b border-coffee-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-caramel-600 to-caramel-400 flex items-center justify-center shadow-lg shadow-caramel-500/30">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl tracking-wide text-white">Nongki</span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-caramel-500/30 text-caramel-300 border border-caramel-400/30 uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-cream-300/70">Coffee & Hangout Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-6 space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-coffee-300/80 mb-2">
            Menu Utama
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-caramel-500 to-caramel-600 text-white font-semibold shadow-lg shadow-caramel-600/30 translate-x-1'
                    : 'text-cream-200 hover:text-white hover:bg-coffee-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-coffee-800/80 text-caramel-300 group-hover:bg-caramel-500/20 group-hover:text-caramel-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm tracking-tight block">{item.label}</span>
                    <span
                      className={`text-[11px] block transition-colors ${
                        isActive ? 'text-caramel-100' : 'text-coffee-300 group-hover:text-cream-300'
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined ? (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive
                        ? 'bg-coffee-950 text-caramel-300'
                        : 'bg-caramel-500 text-white shadow-sm shadow-caramel-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-coffee-400 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Supabase card & Admin profile */}
      <div className="p-4 space-y-4">
        {/* Supabase status badge card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-coffee-800/90 to-brownies-800/80 border border-coffee-700/60 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-caramel-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supabase Cloud</span>
            </div>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-cream-300/80 leading-relaxed mb-3">
            Tabel profiles & places terhubung aktif ke Supabase.
          </p>
          <button
            onClick={openSyncModal}
            className="w-full py-2 px-3 rounded-xl bg-caramel-500/20 hover:bg-caramel-500 text-caramel-200 hover:text-white border border-caramel-400/30 transition-all font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Buka SQL & Status</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Admin User Card */}
        <div className="p-3.5 rounded-2xl bg-coffee-900 border border-coffee-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={adminUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={adminUser.full_name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-caramel-500/50 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{adminUser.full_name}</p>
              <p className="text-[10px] text-caramel-300 font-mono truncate">{adminUser.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Keluar / Logout"
            className="p-2 rounded-xl text-coffee-300 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
