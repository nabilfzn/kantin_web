'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ReceiptText, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '@/lib/format';

interface NavbarProps {
  cartItemCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  activeOrderNumber: string | null;
  onOpenOrderTracker: () => void;
}

export function Navbar({
  cartItemCount,
  cartSubtotal,
  onOpenCart,
  activeOrderNumber,
  onOpenOrderTracker,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charm-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand: Logo + Kantin Darussalam */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/logo-transparent.png"
              alt="Logo Pondok Pesantren Daarussa'adah"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-charm-heading block leading-none">
              Kantin Darussalam
            </span>
            <span className="text-[11px] text-charm-muted font-normal block mt-0.5">
              Pondok Pesantren Daarussa&apos;adah
            </span>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active order button if exists */}
          {activeOrderNumber && (
            <button
              type="button"
              onClick={onOpenOrderTracker}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <ReceiptText size={14} className="text-emerald-700" />
              <span>Pesanan: {activeOrderNumber}</span>
            </button>
          )}

          {/* Quick Demo Navigation */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-charm-muted bg-[#F1F2EA] border border-charm-border rounded-full px-2.5 py-1">
            <Link
              href="/admin"
              className="px-2 py-0.5 rounded-full hover:bg-white hover:text-charm-heading transition-colors inline-flex items-center gap-1 font-medium"
            >
              <ShieldCheck size={12} /> Kasir
            </Link>
            <span className="text-charm-border">•</span>
            <Link
              href="/seller/token-pak-kumis-771"
              className="px-2 py-0.5 rounded-full hover:bg-white hover:text-charm-heading transition-colors font-medium"
            >
              Dapur Stan
            </Link>
          </div>

          {/* Cart button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-charm-border hover:border-emerald-700 text-charm-heading text-xs sm:text-sm font-semibold transition-colors duration-150 shadow-xs"
            aria-label="Buka keranjang belanja"
          >
            <div className="relative">
              <ShoppingBag size={17} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            {cartSubtotal > 0 && (
              <span className="font-mono font-bold text-xs text-emerald-800">
                {formatRupiah(cartSubtotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
