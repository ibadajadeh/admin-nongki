'use client';

import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  Star, 
  Check, 
  EyeOff, 
  Trash2, 
  CornerDownRight, 
  Send, 
  AlertCircle,
  X
} from 'lucide-react';
import { Review, Place } from '@/lib/types';

interface ReviewsViewProps {
  reviews: Review[];
  places: Place[];
  onUpdateReview: (id: string, updates: Partial<Review>) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
  searchQuery: string;
}

export default function ReviewsView({
  reviews,
  places,
  onUpdateReview,
  onDeleteReview,
  searchQuery,
}: ReviewsViewProps) {
  const [ratingFilter, setRatingFilter] = useState<number | 'Semua'>('Semua');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('Semua');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => {
    const matchRating = ratingFilter === 'Semua' || r.rating === ratingFilter;
    const matchPlace = selectedPlaceId === 'Semua' || r.place_id === selectedPlaceId;
    const matchQuery =
      !searchQuery ||
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRating && matchPlace && matchQuery;
  });

  const handleOpenReply = (rev: Review) => {
    setReplyingReviewId(rev.id);
    setReplyText(rev.admin_reply || '');
  };

  const handleSaveReply = async (id: string) => {
    await onUpdateReview(id, { admin_reply: replyText });
    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-coffee-950">
            Ulasan & Moderasi Pelanggan
          </h1>
          <p className="text-xs text-brownies-500">
            Kelola rating bintang, moderasi komentar, dan balas feedback pelanggan nongki.
          </p>
        </div>

        {/* Quick Review Stats badge */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold self-start sm:self-auto">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Rata-rata: 4.8 / 5.0 ({reviews.length} Ulasan)</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Rating Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setRatingFilter('Semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              ratingFilter === 'Semua'
                ? 'bg-caramel-500 text-white shadow-xs'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Semua Bintang ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1 ${
                ratingFilter === r
                  ? 'bg-caramel-500 text-white shadow-xs'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              <span>{r}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        {/* Cafe Filter */}
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

      {/* Reviews List (matching Image 1 "Review") */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-cream-200 text-brownies-500">
            <MessageSquareHeart className="w-12 h-12 mx-auto text-caramel-400 mb-3" />
            <p className="font-serif font-bold text-base text-coffee-900">
              Tidak ada ulasan ditemukan
            </p>
            <p className="text-xs text-brownies-400 mt-1">
              Ubah filter bintang atau pencarian untuk melihat ulasan lain.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              {/* Header: Customer, Stars, Date, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-caramel-500 to-caramel-400 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {rev.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-coffee-950">
                      {rev.customer_name}
                    </h3>
                    <p className="text-[11px] text-caramel-700 font-medium">
                      {rev.place_name || 'Cafe Nongki'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Star Rating Icons */}
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-cream-200 text-cream-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-coffee-800 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>

                  <span className="text-[11px] text-brownies-400">
                    {new Date(rev.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Review Comment Text */}
              <p className="text-xs sm:text-sm text-coffee-800 leading-relaxed bg-cream-50/50 p-3 rounded-2xl border border-cream-100">
                "{rev.comment}"
              </p>

              {/* Admin Reply Section */}
              {rev.admin_reply && (
                <div className="pl-4 border-l-2 border-caramel-400 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-caramel-700 font-bold text-[11px]">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Balasan Admin Nongki:</span>
                  </div>
                  <p className="text-brownies-700 bg-caramel-50/80 p-2.5 rounded-xl border border-caramel-200/80">
                    {rev.admin_reply}
                  </p>
                </div>
              )}

              {/* Reply Input Box (when replying) */}
              {replyingReviewId === rev.id && (
                <div className="pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis balasan apresiasi atau solusi untuk pelanggan..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-caramel-400 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveReply(rev.id)}
                      className="px-4 py-2 rounded-xl bg-caramel-500 hover:bg-caramel-600 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </button>
                    <button
                      onClick={() => setReplyingReviewId(null)}
                      className="p-2 rounded-xl text-brownies-400 hover:text-coffee-900 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Moderation Controls Bar */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      onUpdateReview(rev.id, { is_approved: !rev.is_approved })
                    }
                    className={`px-2.5 py-1 rounded-xl font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                      rev.is_approved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rev.is_approved ? (
                      <>
                        <Check className="w-3 h-3" /> Ditampilkan
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Disembunyikan
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenReply(rev)}
                    className="px-2.5 py-1 rounded-xl bg-cream-100 hover:bg-cream-200 text-coffee-800 font-semibold text-[11px] cursor-pointer"
                  >
                    {rev.admin_reply ? 'Edit Balasan' : 'Balas Ulasan'}
                  </button>
                </div>

                <button
                  onClick={() => setDeletingId(rev.id)}
                  className="p-1.5 rounded-xl text-brownies-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-cream-300 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-serif font-bold text-lg text-coffee-950">
              Hapus Ulasan Ini?
            </h3>
            <p className="text-center text-xs text-brownies-500 mt-2">
              Ulasan pelanggan ini akan dihapus dari sistem.
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
                  await onDeleteReview(deletingId);
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
    </div>
  );
}
