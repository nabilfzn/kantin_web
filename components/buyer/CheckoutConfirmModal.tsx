'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { CartItem, Order } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/format';

interface CheckoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onBackToCart: () => void;
  items: CartItem[];
  onOrderCreated: (order: Order) => void;
}

export function CheckoutConfirmModal({
  open,
  onClose,
  onBackToCart,
  items,
  onOrderCreated,
}: CheckoutConfirmModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama pemesan wajib diisi');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Nomor WhatsApp / HP wajib diisi');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Email yang valid wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          pickupLocation: location || 'Ambil di Stan',
          orderNotes: notes,
          items: items.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
            notes: i.notes,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memproses pesanan.');
      }

      // Order created successfully!
      onOrderCreated(json.data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi gangguan saat membuat pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Konfirmasi Data Pemesan"
      subtitle="Pastikan data terisi dengan benar untuk notifikasi & pengambilan"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-charm-heading mb-1">
              Nama Lengkap Penerima <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charm-heading mb-1">
                No. WhatsApp / HP <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charm-heading mb-1">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charm-heading mb-1">
              Kelas / Meja Pengambilan <span className="text-charm-muted font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Kelas XI IPA 2 atau Meja 05"
              className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charm-heading mb-1">
              Catatan Pesanan <span className="text-charm-muted font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pesan tambahan untuk kasir / penjual..."
              className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
            />
          </div>
        </div>

        {/* Ringkasan Pembelian */}
        <div className="pt-3 border-t border-charm-border">
          <h4 className="text-xs font-bold text-charm-heading uppercase tracking-wider mb-2">
            Rincian Pembelian ({items.length} item)
          </h4>
          <div className="bg-charm-surface/80 rounded-xl p-3 space-y-2 border border-charm-border/70 max-h-36 overflow-y-auto">
            {items.map((cartItem, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs text-charm-heading"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold">{cartItem.quantity}x</span>{' '}
                  <span>{cartItem.menuItem.name}</span>
                  <span className="text-[10px] text-charm-muted block truncate">
                    {cartItem.store.name} {cartItem.notes ? `• "${cartItem.notes}"` : ''}
                  </span>
                </div>
                <span className="font-semibold shrink-0">
                  {formatRupiah(cartItem.menuItem.price * cartItem.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-charm-muted">Subtotal Murni:</span>
            <span className="text-sm font-extrabold text-charm-heading">
              {formatRupiah(subtotal)}
            </span>
          </div>

          <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
            <ShieldCheck size={14} className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              Kode unik verifikasi (1–99 rupiah) akan ditambahkan otomatis di layar QRIS untuk pencocokan mutasi kasir.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onBackToCart}
            disabled={loading}
            className="text-xs"
          >
            <ArrowLeft size={14} />
            <span>Keranjang</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={loading}
            className="text-xs font-bold shadow-cta"
          >
            <Check size={14} />
            <span>{loading ? 'Memproses Pesanan...' : 'Konfirmasi & Masuk Pembayaran'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}

