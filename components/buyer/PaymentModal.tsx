'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, QrCode, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/format';

interface PaymentModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onPaymentSubmitted: (order: Order) => void;
}

export function PaymentModal({
  order,
  open,
  onClose,
  onPaymentSubmitted,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [proofNote, setProofNote] = useState('');

  // 15-minute countdown
  useEffect(() => {
    if (!open || !order) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, order]);

  if (!order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const copyNominal = () => {
    navigator.clipboard.writeText(order.totalPayable.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsPaid = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MARK_PAID',
          proofUrl: proofNote ? `Catatan: ${proofNote}` : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengirim konfirmasi pembayaran.');
      }

      onPaymentSubmitted(json.data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi gangguan saat konfirmasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pembayaran QRIS Kantin"
      subtitle={`No. Pesanan: ${order.orderNumber}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Countdown & Order Number Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-charm-accent border border-charm-border">
          <div className="flex items-center gap-1.5 text-xs text-charm-heading font-semibold">
            <span className="text-charm-muted">Nomor Pesanan:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-charm-border font-bold">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-charm-brand-text">
            <Clock size={14} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Nominal persis dengan kode unik */}
        <div className="p-4 rounded-2xl bg-white border border-charm-border text-center shadow-panel">
          <span className="text-[11px] font-bold text-charm-muted uppercase tracking-wider block">
            Total Transfer Persis (+ Kode Unik {order.uniqueCode})
          </span>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-charm-heading font-mono tracking-tight">
              {formatRupiah(order.totalPayable)}
            </span>
            <button
              type="button"
              onClick={copyNominal}
              className="p-1.5 rounded-lg text-charm-body hover:text-charm-heading hover:bg-charm-surface border border-charm-border transition-colors text-xs font-semibold flex items-center gap-1"
              title="Salin nominal persis"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span className="text-[10px]">{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
          <p className="mt-1 text-[11px] text-charm-muted">
            Harap bayar <strong className="text-charm-heading">persis hingga 2 digit terakhir</strong> agar kasir dapat memverifikasi dalam hitungan detik.
          </p>
        </div>

        {/* Master QRIS visual */}
        <div className="p-5 rounded-2xl bg-white border border-charm-border flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-xl border-2 border-dashed border-charm-border p-2 flex flex-col items-center justify-center">
            {/* Clean QRIS visual representation */}
            <div className="w-full h-full bg-slate-900 rounded-lg p-2.5 flex flex-col items-center justify-between text-white">
              <div className="w-full flex items-center justify-between text-[10px] font-bold tracking-widest text-zinc-300">
                <span>QRIS</span>
                <span className="bg-rose-600 text-[8px] px-1 rounded">KANTIN</span>
              </div>
              <div className="my-auto bg-white p-2 rounded flex flex-col items-center justify-center text-slate-900">
                <QrCode size={100} className="text-slate-900" />
                <span className="text-[8px] font-mono font-bold tracking-tight mt-1 text-slate-600">
                  {order.orderNumber} • {order.totalPayable}
                </span>
              </div>
              <div className="text-[9px] text-zinc-400 font-mono">
                NMID: ID102026110601
              </div>
            </div>
          </div>
          <span className="mt-2.5 text-xs font-semibold text-charm-heading">
            Scan dengan BCA, GoPay, OVO, Dana, ShopeePay, atau Livin
          </span>
        </div>

        {/* Optional Proof note */}
        <div>
          <label className="block text-xs font-bold text-charm-heading mb-1">
            Konfirmasi / Catatan Rekening Pengirim <span className="text-charm-muted font-normal">(opsional)</span>:
          </label>
          <input
            type="text"
            value={proofNote}
            onChange={(e) => setProofNote(e.target.value)}
            placeholder="Contoh: Transfer atas nama Budi Santoso / GoPay"
            className="w-full text-xs bg-white border border-charm-border rounded-xl px-3.5 py-2.5 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-charm-brand"
          />
        </div>

        {/* CTA "Saya Sudah Bayar" */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleMarkAsPaid}
            disabled={loading}
            className="font-bold shadow-cta"
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Mengirim Konfirmasi...' : 'Saya Sudah Bayar'}</span>
            <ArrowRight size={16} />
          </Button>
          <p className="text-[11px] text-center text-charm-muted mt-2">
            Pesanan otomatis diteruskan ke stan kantin setelah kasir mengonfirmasi dana masuk.
          </p>
        </div>
      </div>
    </Modal>
  );
}

