'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Database, 
  Store, 
  UtensilsCrossed, 
  ShoppingBag,
  Users,
  Sparkles
} from 'lucide-react';
import { AdminUser } from '@/lib/types';

interface HeaderProps {
  adminUser: AdminUser;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddUser: () => void;
  onOpenAddPlace: () => void;
  onOpenAddMenu: () => void;
  onOpenAddOrder: () => void;
  onOpenSyncModal: () => void;
  dbConnected: boolean;
}

export default function Header({
  adminUser,
  searchQuery,
  setSearchQuery,
  onOpenAddUser,
  onOpenAddPlace,
  onOpenAddMenu,
  onOpenAddOrder,
  onOpenSyncModal,
  dbConnected,
}: HeaderProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <header className="h-20 bg-cream-50/90 backdrop-blur-md border-b border-cream-300/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Search input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brownies-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user, tempat nongki, menu kopi, pesanan..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-cream-300 text-sm text-coffee-900 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-caramel-400 focus:border-caramel-400 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Supabase Status Pill */}
        <button
          onClick={onOpenSyncModal}
          className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-caramel-100/80 border border-caramel-300/80 text-coffee-800 text-xs hover:bg-caramel-200/80 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-caramel-600" />
          <span className="font-medium">Supabase Cloud</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Quick Add Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-caramel-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Baru</span>
          </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-300/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brownies-400">
                Pilih Entitas
              </p>
              
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenAddUser();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs text-coffee-900 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block">User / Profil</span>
                  <span className="text-[10px] text-brownies-400">Admin, Merchant, Kasir, User</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenAddPlace();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs text-coffee-900 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block">Tempat Nongki</span>
                  <span className="text-[10px] text-brownies-400">Tambah Cafe / Spot</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenAddMenu();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs text-coffee-900 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block">Menu / Produk</span>
                  <span className="text-[10px] text-brownies-400">Kopi, Snack & Pastry</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenAddOrder();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs text-coffee-900 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-caramel-100 text-caramel-600 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block">Pesanan Baru</span>
                  <span className="text-[10px] text-brownies-400">Input Order Manual</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button className="w-10 h-10 rounded-2xl bg-white border border-cream-300 text-coffee-700 flex items-center justify-center hover:bg-cream-100 hover:text-caramel-600 transition-colors cursor-pointer shadow-xs">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-caramel-500 ring-2 ring-white" />
          </button>
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-cream-300">
          <img
            src={adminUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={adminUser.full_name}
            className="w-10 h-10 rounded-2xl object-cover border-2 border-caramel-400/40 shadow-xs"
          />
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-coffee-900 leading-tight">{adminUser.full_name}</p>
            <p className="text-[11px] text-brownies-500">{adminUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
