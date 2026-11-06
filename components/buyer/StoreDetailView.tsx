'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowLeft, Clock, Plus, Check } from 'lucide-react';
import { Store, MenuItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/format';

interface StoreDetailViewProps {
  store: Store;
  menuItems: MenuItem[];
  onBack: () => void;
  onOpenMenuItemDetail: (item: MenuItem) => void;
  cartItemCountsByMenuId: Record<string, number>;
}

export function StoreDetailView({
  store,
  menuItems,
  onBack,
  onOpenMenuItemDetail,
  cartItemCountsByMenuId,
}: StoreDetailViewProps) {
  // Category filtering
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((m) => m.category));
    return ['Semua', ...Array.from(cats)];
  }, [menuItems]);

  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Semua') return menuItems;
    return menuItems.filter((m) => m.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-charm-body hover:text-charm-heading py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Semua Stan Kantin</span>
      </button>

      {/* Store Banner & Summary */}
      <div className="bg-white border border-charm-border rounded-2xl p-6 sm:p-7 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-charm-accent border border-charm-border shrink-0">
              <Image
                src={store.bannerImage || store.logo || '/card-mie.jpg'}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium text-emerald-800 uppercase tracking-wider">
                  {store.category}
                </span>
                <Badge variant={store.isOpen ? 'success' : 'neutral'}>
                  {store.isOpen ? 'Stan Buka' : 'Stan Tutup'}
                </Badge>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-charm-heading mt-1">
                {store.name}
              </h1>
              <p className="text-xs sm:text-sm text-charm-muted mt-1 max-w-2xl leading-relaxed">
                {store.description}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-charm-border/60 text-xs text-charm-muted shrink-0">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock size={14} />
              <span>Jam Operasional:</span>
            </div>
            <span className="font-mono font-bold text-charm-heading text-sm mt-0.5">
              {store.openTime} – {store.closeTime} WIB
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-charm-border text-charm-body hover:text-charm-heading hover:bg-[#F2F1ED]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu Grid with Clean Non-Slop Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const qtyInCart = cartItemCountsByMenuId[item.id] || 0;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.isAvailable && store.isOpen) {
                  onOpenMenuItemDetail(item);
                }
              }}
              className={`bg-white border border-charm-border rounded-2xl p-4 flex flex-col justify-between transition-colors duration-150 ${
                item.isAvailable && store.isOpen
                  ? 'hover:border-slate-300 cursor-pointer group shadow-xs'
                  : 'opacity-60 cursor-not-allowed bg-[#F4F4F1]'
              }`}
            >
              <div className="flex gap-3.5">
                {/* Photo */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-charm-accent shrink-0 border border-charm-border/70">
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                  />
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded-full">
                        Habis
                      </span>
                    </div>
                  )}
                </div>

                {/* Details (Anti-slop copywriting: 1-2 natural sentences max) */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-charm-heading group-hover:text-emerald-800 transition-colors line-clamp-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-charm-muted line-clamp-2 mt-1 leading-relaxed">
                    {item.shortDescription || item.description}
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-800">
                    {formatRupiah(item.price)}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3.5 pt-2.5 border-t border-charm-border/60 flex items-center justify-between">
                <span className="text-[10px] text-charm-muted font-medium">
                  {item.prepTimeMinutes ? `± ${item.prepTimeMinutes} menit saji` : 'Siap saji'}
                </span>

                {item.isAvailable && store.isOpen ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMenuItemDetail(item);
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      qtyInCart > 0
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-800 hover:text-white border border-emerald-200'
                    }`}
                  >
                    {qtyInCart > 0 ? (
                      <>
                        <Check size={12} />
                        <span>{qtyInCart} di keranjang</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>Pilih Menu</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-rose-600">
                    {!store.isOpen ? 'Stan Tutup' : 'Menu Habis'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
