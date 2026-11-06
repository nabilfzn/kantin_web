'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, Trash2, ArrowRight, Store, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/format';

interface CartDrawerModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export function CartDrawerModal({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartDrawerModalProps) {
  const subtotal = items.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Keranjang Belanja"
      subtitle={`${items.length} jenis item pesanan`}
      maxWidth="md"
    >
      {items.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-charm-accent border border-charm-border flex items-center justify-center mx-auto text-charm-muted mb-3">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-sm font-bold text-charm-heading">Keranjang Masih Kosong</h3>
          <p className="text-xs text-charm-muted mt-1 max-w-xs mx-auto">
            Silakan pilih stan kantin dan tambahkan menu makanan atau minuman kesukaanmu.
          </p>
          <div className="mt-5">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Pilih Menu Sekarang
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items list */}
          <div className="space-y-3 divide-y divide-charm-border/60">
            {items.map((cartItem, idx) => (
              <div key={`${cartItem.menuItem.id}-${idx}`} className="pt-3 first:pt-0">
                <div className="flex gap-3 items-start justify-between">
                  <div className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-charm-accent border border-charm-border shrink-0">
                      <Image
                        src={cartItem.menuItem.photo}
                        alt={cartItem.menuItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-charm-muted">
                        <Store size={11} />
                        <span>{cartItem.store.name}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-charm-heading leading-tight mt-0.5">
                        {cartItem.menuItem.name}
                      </h4>
                      <div className="text-xs font-bold text-charm-brand-text mt-1">
                        {formatRupiah(cartItem.menuItem.price * cartItem.quantity)}
                        <span className="text-[10px] font-normal text-charm-muted ml-1">
                          (@ {formatRupiah(cartItem.menuItem.price)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-charm-surface border border-charm-border rounded-full p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-charm-heading shadow-xs hover:bg-charm-accent transition-colors"
                        aria-label="Kurangi porsi"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-charm-heading font-mono">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-charm-heading shadow-xs hover:bg-charm-accent transition-colors"
                        aria-label="Tambah porsi"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-charm-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus menu ini"
                      aria-label="Hapus menu"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Notes editing */}
                <div className="mt-2 pl-1">
                  <input
                    type="text"
                    value={cartItem.notes}
                    onChange={(e) => onUpdateNotes(idx, e.target.value)}
                    placeholder="Tambah catatan (cth: jangan pedas, kuah dipisah)..."
                    className="w-full text-[11px] bg-white border border-charm-border/80 rounded-lg px-2.5 py-1.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
                    maxLength={100}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal Banner */}
          <div className="pt-4 border-t border-charm-border bg-charm-surface/40 -mx-6 -mb-5 px-6 pb-5 rounded-b-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-charm-muted block">
                  Total Makanan & Minuman:
                </span>
                <span className="text-[10px] text-charm-muted">
                  *Belum termasuk kode unik QRIS (1–99 rupiah)
                </span>
              </div>
              <span className="text-base font-extrabold text-charm-heading">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                className="text-xs"
              >
                Tambah Menu Lain
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onProceedToCheckout}
                className="text-xs font-bold shadow-cta"
              >
                <span>Konfirmasi Data</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

