'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Terminal,
  Sparkles,
  Server
} from 'lucide-react';
import { checkSupabaseConnection, resetMockData } from '@/lib/db';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

const SQL_SCHEMA_TEXT = `-- ===================================================
-- SCHEMA DATABASE SUPABASE UNTUK ADMIN PANEL NONGKI
-- Jalankan di: Supabase Console -> SQL Editor -> Run
-- ===================================================

CREATE TABLE IF NOT EXISTS public.nongki_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    open_hours VARCHAR(100) NOT NULL,
    price_range VARCHAR(50) NOT NULL,
    facilities TEXT[] DEFAULT '{}',
    rating NUMERIC(2,1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    image_url TEXT,
    phone VARCHAR(50),
    instagram VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.nongki_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES public.nongki_places(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.nongki_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    table_number VARCHAR(50),
    order_type VARCHAR(50) DEFAULT 'Dine In',
    place_id UUID REFERENCES public.nongki_places(id) ON DELETE SET NULL,
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(12,2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Diproses',
    payment_status VARCHAR(50) DEFAULT 'Lunas',
    payment_method VARCHAR(50) DEFAULT 'QRIS',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.nongki_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES public.nongki_places(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    admin_reply TEXT,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS & Policies
ALTER TABLE public.nongki_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nongki_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nongki_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nongki_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Akses Penuh Tempat Nongki" ON public.nongki_places FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Menu Nongki" ON public.nongki_menus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Pesanan" ON public.nongki_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Ulasan" ON public.nongki_reviews FOR ALL USING (true) WITH CHECK (true);
`;

export default function DatabaseSyncModal({
  isOpen,
  onClose,
  onDataReset,
}: DatabaseSyncModalProps) {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await checkSupabaseConnection();
    setTestResult(res.message);
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-300 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-caramel-100 text-caramel-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-coffee-950">
                Integrasi Database Supabase Cloud
              </h2>
              <p className="text-xs text-brownies-500">
                Status koneksi & panduan eksekusi SQL Schema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brownies-400 hover:text-coffee-900 hover:bg-cream-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials Overview */}
        <div className="mt-5 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-coffee-900">Project Supabase URL:</span>
              <span className="font-mono text-caramel-700 font-bold">
                https://gzvzoknxomzgiigbirvy.supabase.co
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-coffee-900">Status Akun Admin:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> admin@nongki.id (Aktif)
              </span>
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-caramel-50 border border-caramel-200">
            <div>
              <p className="font-bold text-coffee-900">Uji Koneksi Real-time</p>
              <p className="text-[11px] text-brownies-600">
                {testResult || 'Periksa status respons REST API Supabase'}
              </p>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3.5 py-1.5 rounded-xl bg-caramel-500 hover:bg-caramel-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Menguji...' : 'Tes Ping'}</span>
            </button>
          </div>

          {/* SQL Schema Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-coffee-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-caramel-600" />
                SQL Migration Script (supabase_schema.sql)
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-xl bg-caramel-500 hover:bg-caramel-600 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-coffee-950 text-cream-200 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed border border-coffee-800">
                {SQL_SCHEMA_TEXT}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 space-y-1.5">
            <p className="font-bold text-coffee-950 text-xs">
              Cara Menjalankan di Supabase:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-brownies-600 text-[11px] leading-relaxed">
              <li>Buka dashboard Supabase project Anda di browser.</li>
              <li>Masuk ke menu <strong>SQL Editor</strong> di sidebar kiri.</li>
              <li>Klik <strong>New Query</strong>, lalu paste (tempel) SQL di atas.</li>
              <li>Klik tombol <strong>Run</strong> untuk membuat tabel secara instan.</li>
            </ol>
          </div>

          {/* Reset Mock Data Option */}
          <div className="pt-2 flex items-center justify-between border-t border-cream-200">
            <span className="text-brownies-500 text-[11px]">
              Ingin mengembalikan data awal simulasi?
            </span>
            <button
              onClick={() => {
                resetMockData();
                onDataReset();
                alert('Data berhasil di-reset ke sample awal cafe nongki!');
              }}
              className="text-xs font-semibold text-caramel-700 hover:text-caramel-800 cursor-pointer underline"
            >
              Reset Data Contoh
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-cream-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-caramel-500 hover:bg-caramel-600 text-white font-semibold text-xs cursor-pointer shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
