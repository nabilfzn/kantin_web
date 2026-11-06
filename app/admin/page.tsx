'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Check,
  Clock,
  Store as StoreIcon,
  Download,
  ArrowLeft,
  RefreshCw,
  QrCode,
  DollarSign,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { Order, Store } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah, formatTanggal, formatJam } from '@/lib/format';

export default function AdminKasirDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [activeTab, setActiveTab] = useState<'verifikasi' | 'stan' | 'rekap'>('verifikasi');
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success && json.data) {
        setOrders(json.data);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      const json = await res.json();
      if (json.success && json.data) {
        setStores(json.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
    fetchStores();
    const interval = setInterval(fetchOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders waiting for cashier confirmation
  const pendingOrders = orders.filter(
    (o) => o.status === 'MENUNGGU_KONFIRMASI' || o.status === 'MENUNGGU_BAYAR'
  );

  const confirmedOrders = orders.filter((o) => o.status === 'DIBAYAR');

  const totalOmzet = confirmedOrders.reduce((acc, curr) => acc + curr.totalPayable, 0);

  const handleConfirmPayment = async (orderId: string) => {
    try {
      setConfirmingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CONFIRM_PAYMENT' }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchOrders();
      }
    } catch {
      alert('Gagal mengonfirmasi pembayaran.');
    } finally {
      setConfirmingId(null);
    }
  };

  const exportCsvRecap = () => {
    const headers = ['Nomor Pesanan', 'Waktu', 'Nama Pemesan', 'Telepon', 'Subtotal', 'Kode Unik', 'Total Bayar', 'Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.createdAt}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      o.subtotal,
      o.uniqueCode,
      o.totalPayable,
      o.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_transaksi_kantin_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-charm-surface flex flex-col text-charm-body">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-charm-panel border-b border-charm-border px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full border border-charm-border flex items-center justify-center text-charm-body hover:text-charm-heading hover:bg-charm-surface transition-colors"
            title="Kembali ke Etalase Pembeli"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-charm-heading leading-none">
                Dashboard Kasir & Admin Kantin
              </h1>
              <span className="text-[10px] text-charm-muted">
                Pencocokan QRIS & Manajemen Penjualan
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            className="p-2 rounded-full border border-charm-border text-charm-muted hover:text-charm-heading hover:bg-charm-surface transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full bg-charm-accent border border-charm-border text-xs font-semibold text-charm-heading hover:bg-[#E2E3D8] transition-colors"
          >
            Buka Halaman Pembeli
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-charm-border pb-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('verifikasi')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'verifikasi'
                  ? 'bg-charm-brand text-white shadow-cta'
                  : 'bg-charm-panel border border-charm-border text-charm-body hover:text-charm-heading'
              }`}
            >
              <span>Verifikasi QRIS</span>
              {pendingOrders.length > 0 && (
                <span className="ml-2 bg-white text-charm-brand px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stan')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'stan'
                  ? 'bg-charm-brand text-white shadow-cta'
                  : 'bg-charm-panel border border-charm-border text-charm-body hover:text-charm-heading'
              }`}
            >
              Kelola Stan Kantin ({stores.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rekap')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'rekap'
                  ? 'bg-charm-brand text-white shadow-cta'
                  : 'bg-charm-panel border border-charm-border text-charm-body hover:text-charm-heading'
              }`}
            >
              Rekap Transaksi ({orders.length})
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-charm-muted">Total Omzet Dikonfirmasi:</span>
            <span className="font-extrabold text-charm-heading text-sm">
              {formatRupiah(totalOmzet)}
            </span>
          </div>
        </div>

        {/* TAB 1: Verifikasi Pembayaran QRIS */}
        {activeTab === 'verifikasi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-charm-heading">
                  Antrean Verifikasi Pembayaran Masuk
                </h2>
                <p className="text-xs text-charm-muted">
                  Cocokkan nominal persis di mutasi bank/e-wallet kasir, lalu klik Konfirmasi.
                </p>
              </div>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="bg-charm-panel border border-charm-border rounded-3xl p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h3 className="text-sm font-bold text-charm-heading">Tidak Ada Pesanan Menunggu</h3>
                <p className="text-xs text-charm-muted mt-1 max-w-sm mx-auto">
                  Semua pesanan pembayaran QRIS telah diverifikasi atau belum ada pesanan baru.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-charm-panel border border-charm-border rounded-2xl p-5 shadow-panel flex flex-col justify-between"
                  >
                    <div>
                      {/* Card header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-lg">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs font-bold text-charm-heading">
                              {order.customerName}
                            </span>
                          </div>
                          <span className="text-[11px] text-charm-muted block mt-0.5">
                            {order.customerPhone} • {formatJam(order.createdAt)}
                          </span>
                        </div>

                        <Badge
                          variant={
                            order.status === 'MENUNGGU_KONFIRMASI' ? 'warning' : 'neutral'
                          }
                        >
                          {order.status === 'MENUNGGU_KONFIRMASI'
                            ? 'Pembeli Sudah Bayar'
                            : 'Belum Konfirmasi'}
                        </Badge>
                      </div>

                      {/* Nominal banner */}
                      <div className="mt-4 p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                            Nominal Mutasi Yang Dicocokkan:
                          </span>
                          <span className="text-lg font-extrabold text-amber-950 font-mono">
                            {formatRupiah(order.totalPayable)}
                          </span>
                        </div>
                        <div className="text-right text-[11px] text-amber-900 font-mono">
                          Kode Unik: <strong className="text-charm-brand-text">+{order.uniqueCode}</strong>
                        </div>
                      </div>

                      {/* Items breakdown */}
                      <div className="mt-3.5 space-y-1 text-xs">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-charm-body text-[11px]"
                          >
                            <span>
                              <strong>{item.quantity}x</strong> {item.name}{' '}
                              <span className="text-charm-muted">({item.storeName})</span>
                            </span>
                            <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {order.paymentProofUrl && (
                        <div className="mt-2.5 p-2 rounded-lg bg-white border border-charm-border text-[11px] text-charm-heading">
                          <strong>Catatan Pengirim:</strong> {order.paymentProofUrl}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-5 pt-3 border-t border-charm-border flex items-center justify-between">
                      <span className="text-[11px] text-charm-muted">
                        Lokasi: {order.pickupLocation || 'Stan'}
                      </span>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmPayment(order.id)}
                        disabled={confirmingId === order.id}
                        className="font-bold shadow-cta"
                      >
                        <Check size={14} />
                        <span>{confirmingId === order.id ? 'Memproses...' : 'Konfirmasi Pembayaran'}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Kelola Stan Kantin */}
        {activeTab === 'stan' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-charm-heading">
                  Daftar Stan Kantin & Tautan Dapur Penjual
                </h2>
                <p className="text-xs text-charm-muted">
                  Buka tautan khusus dapur masing-masing pemilik stan untuk menerima pesanan real-time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map((stall) => (
                <div
                  key={stall.id}
                  className="bg-charm-panel border border-charm-border rounded-2xl p-5 shadow-panel"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-charm-brand-text uppercase tracking-wider">
                        {stall.category}
                      </span>
                      <h3 className="text-base font-bold text-charm-heading mt-0.5">{stall.name}</h3>
                      <p className="text-xs text-charm-muted mt-1">{stall.tagline}</p>
                    </div>
                    <Badge variant={stall.isOpen ? 'success' : 'neutral'}>
                      {stall.isOpen ? 'Buka' : 'Tutup'}
                    </Badge>
                  </div>

                  <div className="mt-4 pt-3 border-t border-charm-border flex items-center justify-between">
                    <span className="text-xs text-charm-muted">
                      Jam: {stall.openTime} – {stall.closeTime}
                    </span>
                    <Link
                      href={`/seller/${stall.token}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-charm-brand-text hover:underline"
                    >
                      <span>Buka Dapur KDS</span>
                      <ArrowLeft size={12} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Rekap Transaksi & Ekspor CSV */}
        {activeTab === 'rekap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-charm-heading">
                  Rekap Seluruh Transaksi Penjualan
                </h2>
                <p className="text-xs text-charm-muted">
                  Digunakan untuk pembagian dana manual ke masing-masing pemilik stan kantin.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={exportCsvRecap}
                className="font-bold gap-1.5"
              >
                <Download size={14} />
                <span>Ekspor CSV</span>
              </Button>
            </div>

            <div className="bg-charm-panel border border-charm-border rounded-2xl overflow-hidden shadow-panel">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-charm-surface border-b border-charm-border text-charm-muted font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">No. Pesanan</th>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Pelanggan</th>
                      <th className="px-4 py-3">Item Pesanan</th>
                      <th className="px-4 py-3 text-right">Total Bayar</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charm-border/60">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-charm-heading">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-charm-muted">
                          {formatTanggal(order.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-charm-heading block">{order.customerName}</span>
                          <span className="text-[10px] text-charm-muted">{order.customerPhone}</span>
                        </td>
                        <td className="px-4 py-3">
                          {order.items.map((i, idx) => (
                            <span key={idx} className="block text-[11px] text-charm-body">
                              {i.quantity}x {i.name}
                            </span>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-charm-heading">
                          {formatRupiah(order.totalPayable)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={
                              order.status === 'DIBAYAR'
                                ? 'success'
                                : order.status === 'MENUNGGU_KONFIRMASI'
                                ? 'warning'
                                : 'neutral'
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

