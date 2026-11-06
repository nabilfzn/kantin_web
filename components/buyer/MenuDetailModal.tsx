'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShoppingBag, Store as StoreIcon } from 'lucide-react';
import { MenuItem, Store } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/format';

interface MenuDetailModalProps {
  item: MenuItem | null;
  store: Store | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, store: Store, quantity: number, notes: string) => void;
}

export function MenuDetailModal({
  item,
  store,
  open,
  onClose,
  onAddToCart,
}: MenuDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setNotes('');
    }
  }, [open, item]);

  if (!item || !store) return null;

  const totalItemPrice = item.price * quantity;

  // Preset quick note tags based on category
  const quickTags =
    item.category.toLowerCase().includes('minum') || item.category.toLowerCase().includes('jus')
      ? ['Sedikit Es', 'Tanpa Gula', 'Manis Sedang', 'Bungkus Plastik']
      : ['Jangan Pedas', 'Pedas Sedang', 'Kuah Dipisah', 'Tanpa Bawang Goreng', 'Bungkus Plastik'];

  const handleAddTag = (tag: string) => {
    if (!notes.includes(tag)) {
      setNotes((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  const handleConfirm = () => {
    onAddToCart(item, store, quantity, notes);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={item.name} subtitle={store.name} maxWidth="md">
      <div className="space-y-4">
        {/* Photo */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-charm-accent border border-charm-border">
          <Image
            src={item.photo}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Info & Category */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {item.category}
              </span>
              <span className="text-[11px] text-charm-muted flex items-center gap-1">
                <StoreIcon size={12} />
                <span>{store.name}</span>
              </span>
            </div>
            <span className="font-mono text-base font-bold text-emerald-800">
              {formatRupiah(item.price)}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-charm-heading mt-2">
            {item.name}
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-charm-body leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Quantity selector */}
        <div className="pt-3 border-t border-charm-border flex items-center justify-between">
          <span className="text-xs font-bold text-charm-heading">Jumlah Porsi:</span>
          <div className="flex items-center gap-3 bg-charm-surface border border-charm-border rounded-full p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-charm-heading shadow-xs hover:bg-charm-accent disabled:opacity-40 transition-colors"
              aria-label="Kurangi porsi"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-xs font-mono font-bold text-charm-heading">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-charm-heading shadow-xs hover:bg-charm-accent transition-colors"
              aria-label="Tambah porsi"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Quick Request Chips */}
        <div>
          <span className="block text-[11px] font-semibold text-charm-muted mb-1.5">
            Pilihan cepat catatan:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  notes.includes(tag)
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-charm-border text-charm-body hover:bg-charm-surface'
                }`}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Notes Input */}
        <div>
          <label
            htmlFor="item-notes"
            className="block text-xs font-bold text-charm-heading mb-1.5"
          >
            Catatan Khusus <span className="text-charm-muted font-normal">(opsional)</span>:
          </label>
          <input
            id="item-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan tambahan untuk dapur..."
            className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-emerald-700"
            maxLength={100}
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            className="font-bold py-3 text-xs sm:text-sm bg-emerald-800 hover:bg-emerald-900 shadow-xs"
          >
            <ShoppingBag size={16} />
            <span>Masukkan ke Keranjang • {formatRupiah(totalItemPrice)}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
