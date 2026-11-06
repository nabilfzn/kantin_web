'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatRupiah } from '@/lib/format';

interface FloatingCartBarProps {
  totalItems: number;
  subtotal: number;
  distinctStoreCount: number;
  onOpenCart: () => void;
}

export function FloatingCartBar({
  totalItems,
  subtotal,
  distinctStoreCount,
  onOpenCart,
}: FloatingCartBarProps) {
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto">
        <div
          onClick={onOpenCart}
          className="bg-charm-heading text-white rounded-full p-2.5 sm:p-3 shadow-lift flex items-center justify-between gap-3 cursor-pointer hover:bg-black transition-all duration-200 transform hover:-translate-y-0.5 border border-white/10"
        >
          <div className="flex items-center gap-3 pl-2">
            <div className="relative w-8 h-8 rounded-full bg-charm-brand flex items-center justify-center text-white shrink-0">
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 bg-white text-charm-heading font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-charm-heading">
                {totalItems}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold leading-none text-white">
                {totalItems} Porsi Dipilih
              </div>
              <div className="text-[11px] text-zinc-300 leading-tight mt-0.5">
                {distinctStoreCount} stan • {formatRupiah(subtotal)}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-charm-brand hover:bg-charm-brand-hover text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-xs"
          >
            <span>Buka Keranjang</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

