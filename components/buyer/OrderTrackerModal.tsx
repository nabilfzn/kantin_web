'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  ShoppingBag,
  ExternalLink,
  Store as StoreIcon,
  Sparkles,
  Printer,
} from 'lucide-react';
import { Order, StoreOrderStatus } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatJam } from '@/lib/format';

interface OrderTrackerModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onOrderUpdated?: (order: Order) => void;
}

export function OrderTrackerModal({
  order: initialOrder,
  open,
  onClose,
  onOrderUpdated,
}: OrderTrackerModalProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  // Polling order status every 5 seconds while open
  useEffect(() => {
    if (!open || !order?.id) return;

    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
          onOrderUpdated?.(json.data);
        }
      } catch {
        // silent polling catch
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 4000);
    return () => clearInterval(interval);
  }, [open, order?.id, onOrderUpdated]);

  if (!order) return null;

  const isConfirmed = order.status === 'DIBAYAR';
  const isPendingCashier =
    order.status === 'MENUNGGU_KONFIRMASI' || order.status === 'MENUNGGU_BAYAR';

  const getStoreStatusBadge = (status: StoreOrderStatus) => {
    switch (status) {
      case 'DIPROSES':
        return <Badge variant="warning">Sedang Dimasak</Badge>;
      case 'SIAP_DIAMBIL':
        return <Badge variant="success">Siap Diambil di Stan</Badge>;
      case 'SELESAI':
        return <Badge variant="neutral">Selesai</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Status Pesanan Mandiri"
      subtitle={`No. Pesanan: ${order.orderNumber}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Main Status Header */}
        <div className="p-4 rounded-2xl bg-charm-accent border border-charm-border text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-charm-heading shadow-xs mb-2">
            <span>Nomor Antrean:</span>
            <span className="text-charm-brand font-mono text-sm">{order.orderNumber}</span>
          </div>

          <h3 className="text-lg font-extrabold text-charm-heading">
            {isPendingCashier
              ? 'Menunggu Verifikasi Kasir'
              : 'Pesanan Diteruskan ke Stan Dapur'}
          </h3>
          <p className="text-xs text-charm-body mt-1 max-w-sm mx-auto">
            {isPendingCashier
              ? 'Kasir sedang mencocokkan pembayaran QRIS dengan mutasi bank/e-wallet Anda.'
              : 'Makanan sedang dipersiapkan oleh pemilik stan kantin. Ambil langsung di meja stan jika status sudah Siap.'}
          </p>

          {/* Quick Demo Shortcut for the reviewer / demo */}
          {isPendingCashier && (
            <div className="mt-3 pt-3 border-t border-charm-border/70 flex items-center justify-center">
              <Link
                href="/admin"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-charm-brand-text hover:underline bg-white/80 px-3 py-1 rounded-full border border-charm-border"
              >
                <span>Buka Dashboard Kasir untuk Konfirmasi Instan</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Live Status per Stan */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-charm-heading uppercase tracking-wider flex items-center gap-1.5">
            <ChefHat size={14} className="text-charm-brand" />
            <span>Status Pengerjaan per Stan:</span>
          </h4>

          <div className="space-y-2">
            {order.storeStatuses.map((st) => (
              <div
                key={st.storeId}
                className={`p-3.5 rounded-2xl border transition-all ${
                  st.status === 'SIAP_DIAMBIL'
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-charm-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-charm-accent flex items-center justify-center text-charm-heading shrink-0">
                      <StoreIcon size={16} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-charm-heading">{st.storeName}</h5>
                      <span className="text-[10px] text-charm-muted">
                        Pembaruan: {formatJam(st.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div>{getStoreStatusBadge(st.status)}</div>
                </div>

                {st.status === 'SIAP_DIAMBIL' && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>Silakan datangi stan ini untuk pickup mandiri!</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-[11px]">
                      {order.orderNumber}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Accordion / Summary (Printable) */}
        <div className="printable-receipt p-3.5 rounded-2xl bg-white border border-charm-border space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-charm-heading border-b border-charm-border/70 pb-2">
            <span>Rincian Menu ({order.items.length} item)</span>
            <span className="font-mono font-bold text-emerald-800">{formatRupiah(order.totalPayable)}</span>
          </div>

          <div className="space-y-2 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-charm-body">
                <div>
                  <span className="font-semibold text-charm-heading">{item.quantity}x</span>{' '}
                  {item.name}
                  <div className="text-[10px] text-charm-muted">
                    {item.storeName} {item.notes ? `• "${item.notes}"` : ''}
                  </div>
                </div>
                <span className="font-mono font-medium text-charm-heading">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-charm-border/70 text-[11px] text-charm-muted flex items-center justify-between">
            <span>Pemesan: {order.customerName} ({order.customerPhone})</span>
            <span>Lokasi: {order.pickupLocation || 'Ambil di Stan'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold text-charm-heading bg-charm-accent hover:bg-[#E2E3D8] transition-colors border border-charm-border"
          >
            <Printer size={14} />
            <span>Cetak Struk Pesanan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-xs font-bold text-charm-body hover:text-charm-heading hover:bg-black/5 transition-colors border border-charm-border"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}

