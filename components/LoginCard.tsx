'use client';

import React, { useState } from 'react';
import { Coffee, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginAdmin, DEFAULT_ADMIN } from '@/lib/auth';
import { AdminUser } from '@/lib/types';

interface LoginCardProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export default function LoginCard({ onLoginSuccess }: LoginCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoFilled, setAutoFilled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan isi email dan kata sandi admin.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Login gagal. Periksa kembali email dan password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail(DEFAULT_ADMIN.email);
    setPassword('AdminNongki2026!');
    setAutoFilled(true);
    setErrorMessage('');
    setTimeout(() => setAutoFilled(false), 3000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-cream-100 via-cream-200 to-caramel-100">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-caramel-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brownies-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-cream-300/80 grid grid-cols-1 md:grid-cols-2">
        {/* Left column: Coffee Aesthetic Visual (matching Image 2) */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-b from-coffee-900 to-coffee-950 text-white overflow-hidden">
          {/* Coffee Photo Background with warm overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-65 mix-blend-overlay transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-900/60 to-transparent" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-caramel-500 flex items-center justify-center shadow-lg shadow-caramel-500/30">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight text-white">Nongki Admin</h2>
              <p className="text-xs text-caramel-200 font-medium">Coffee & Places Management</p>
            </div>
          </div>

          {/* Center Quote / Atmosphere */}
          <div className="relative z-10 my-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-caramel-500/30 text-caramel-200 border border-caramel-400/40 backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Edisi Hangat & Cozy
            </span>
            <h3 className="text-2xl font-serif font-bold text-cream-50 leading-snug">
              Kelola Tempat Hangout, Menu Kopi & Pesanan Terbaik
            </h3>
            <p className="mt-3 text-sm text-cream-200/90 leading-relaxed">
              Panel administrasi terpadu untuk pengelola cafe, barista, dan kurasi tempat nongkrong asik di Indonesia.
            </p>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-cream-100">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-caramel-400" />
              <span>Supabase Cloud Connected</span>
            </div>
            <span className="font-mono text-[11px] text-caramel-300">v2.0 • Active</span>
          </div>
        </div>

        {/* Right column: Form (matching Image 2) */}
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-cream-50/70">
          <div className="mb-6">
            <div className="md:hidden flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-caramel-500 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-coffee-900">Nongki Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-900">
              Selamat Datang!
            </h1>
            <p className="mt-1.5 text-sm text-brownies-500">
              Masuk untuk mengelola data cafe, menu, dan transaksi nongki.
            </p>
          </div>

          {/* Quick Autofill Admin Pill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-caramel-100/70 border border-caramel-300/80 flex items-center justify-between">
            <div className="text-xs">
              <p className="font-semibold text-coffee-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-caramel-600" /> Akun Admin Bawaan
              </p>
              <p className="text-[11px] text-brownies-600 mt-0.5 font-mono">
                admin@nongki.id • AdminNongki2026!
              </p>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                autoFilled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-caramel-500 text-white hover:bg-caramel-600 shadow-sm'
              }`}
            >
              {autoFilled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terisi!
                </>
              ) : (
                'Gunakan'
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brownies-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nongki.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-coffee-900 text-sm focus:outline-none focus:ring-2 focus:ring-caramel-400 focus:border-caramel-400 transition-all placeholder:text-coffee-300"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-coffee-800 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <span className="text-xs text-caramel-600 hover:text-caramel-700 cursor-pointer">
                  Bantuan Akses?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brownies-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-coffee-900 text-sm focus:outline-none focus:ring-2 focus:ring-caramel-400 focus:border-caramel-400 transition-all placeholder:text-coffee-300"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-brownies-600 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="rounded border-cream-300 text-caramel-600 focus:ring-caramel-400" 
                />
                <span>Ingat sesi masuk</span>
              </label>
              <span className="text-caramel-600">Database: Supabase</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-caramel-500 via-caramel-600 to-brownies-600 hover:from-caramel-600 hover:to-brownies-700 shadow-md shadow-caramel-500/25 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Dashboard Nongki</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-cream-200/80 text-center">
            <p className="text-xs text-brownies-400">
              Admin Nongki Platform • Dibuat dengan Supabase & Next.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
