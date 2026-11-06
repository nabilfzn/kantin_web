import React from 'react';
import Image from 'next/image';
import { Clock, ArrowRight, Store as StoreIcon } from 'lucide-react';
import { Store } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface StoreCardProps {
  store: Store;
  menuCount: number;
  onSelect: (store: Store) => void;
}

export function StoreCard({ store, menuCount, onSelect }: StoreCardProps) {
  const stallImage = store.bannerImage || store.logo || '/card-mie.jpg';

  return (
    <div
      onClick={() => onSelect(store)}
      className="group bg-white border border-charm-border rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-colors duration-150 hover:border-slate-300 shadow-xs"
    >
      <div>
        {/* Top Image Banner */}
        <div className="relative w-full aspect-[16/10] bg-charm-accent overflow-hidden border-b border-charm-border/60">
          <Image
            src={stallImage}
            alt={store.name}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
          />
          <div className="absolute top-2.5 right-2.5">
            <Badge variant={store.isOpen ? 'success' : 'neutral'}>
              {store.isOpen ? 'Buka' : 'Tutup'}
            </Badge>
          </div>
        </div>

        {/* Elongated Card Body */}
        <div className="p-4 sm:p-4.5">
          {/* Category */}
          <span className="text-[11px] font-mono uppercase tracking-wider text-charm-muted font-medium block">
            {store.category}
          </span>

          {/* Stall Name */}
          <h3 className="font-display font-bold text-base text-charm-heading group-hover:text-emerald-800 transition-colors mt-0.5 leading-snug">
            {store.name}
          </h3>

          {/* Short tagline */}
          <p className="text-xs text-charm-muted mt-1 line-clamp-1 leading-relaxed">
            {store.tagline || store.description}
          </p>

          {/* Rentang Harga (Price Range) */}
          <div className="mt-3.5 pt-2.5 border-t border-charm-border/60 flex items-center justify-between">
            <span className="text-[11px] text-charm-muted">Rentang Harga:</span>
            <span className="font-mono text-xs font-bold text-emerald-800">
              {store.priceRange || 'Rp 5.000 – Rp 20.000'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-charm-muted border-t border-charm-border/40">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Clock size={12} className="text-charm-muted shrink-0" />
          <span>{store.openTime} – {store.closeTime}</span>
        </div>

        <div className="flex items-center gap-1 font-semibold text-xs text-charm-heading group-hover:text-emerald-800 transition-colors">
          <span>{menuCount} Menu</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
}
