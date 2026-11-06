'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Utensils,
  Check,
} from 'lucide-react';
import { Store, MenuItem, Order, StoreOrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRupiah, formatJam } from '@/lib/format';

interface SellerDashboardProps {
  params: Promise<{ token: string }>;
}

export default function SellerDashboardPage({ params }: SellerDashboardProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [storeInfo, setStoreInfo] = useState<Store | null>(null);
  const [storeOrders, setStoreOrders] = useState<
    { order: Order; storeStatus: StoreOrderStatus }[]
  >([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'kds' | 'menu' | 'rekap'>('kds');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const prevOrderCountRef = useRef(0);

  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {}
  };

  const fetchStallData = async () => {
    try {
      const res = await fetch(`/api/seller/orders?token=${token}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Tautan stan tidak valid');
      }

      setStoreInfo(json.data.store);
      setStoreOrders(json.data.orders);
      setMenuItems(json.data.menuItems);

      // Trigger sound if order count increased
      if (
        prevOrderCountRef.current > 0 &&
        json.data.orders.length > prevOrderCountRef.current
      ) {
        playChimeSound();
      }
      prevOrderCountRef.current = json.data.orders.length;
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memuat data stan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStallData();
    const interval = setInterval(fetchStallData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleUpdateStatus = async (orderId: string, newStatus: StoreOrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, orderId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchStallData();
      }
    } catch {
      alert('Gagal memperbarui status pengerjaan pesanan.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleToggleMenu = async (menuId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: menuId, isAvailable: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setMenuItems((prev) =>
          prev.map((m) => (m.id === menuId ? { ...m, isAvailable: !currentStatus } : m))
        );
      }
    } catch {
      alert('Gagal mengubah status ketersediaan menu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charm-surface flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="animate-spin text-charm-brand mx-auto mb-2" size={24} />
          <p className="text-xs font-semibold text-charm-muted">Menghubungkan ke Dapur Stan...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !storeInfo) {
    return (
      <div className="min-h-screen bg-charm-surface flex items-center justify-center p-4">
        <div className="bg-charm-panel border border-charm-border rounded-3xl p-8 max-w-md text-center shadow-panel">
          <AlertCircle size={32} className="text-rose-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-charm-heading">Akses Dapur Ditolak</h2>
          <p className="text-xs text-charm-muted mt-1">{errorMsg}</p>
          <div className="mt-5">
            <Link
              href="/"
              className="text-xs font-bold text-charm-brand-text hover:underline"
            >
              Kembali ke Beranda Kantin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active cooking vs ready vs completed
  const cookingOrders = storeOrders.filter((o) => o.storeStatus === 'DIPROSES');
  const readyOrders = storeOrders.filter((o) => o.storeStatus === 'SIAP_DIAMBIL');
  const completedOrders = storeOrders.filter((o) => o.storeStatus === 'SELESAI');

  return (
    <div className="min-h-screen bg-charm-surface flex flex-col text-charm-body">
      {/* Top Header */}
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
            <div className="w-8 h-8 rounded-full bg-charm-brand text-white flex items-center justify-center shadow-xs">
              <ChefHat size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-charm-heading leading-none">
                Dapur: {storeInfo.name}
              </h1>
              <span className="text-[10px] text-charm-muted">
                Kitchen Display System (KDS) & Pengelolaan Stan
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playChimeSound}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-charm-border bg-white text-xs font-semibold text-charm-heading hover:bg-charm-surface transition-colors"
            title="Uji nada dering pesanan"
          >
            <Bell size={13} className="text-charm-brand" />
            <span>Tes Notifikasi Suara</span>
          </button>
          <button
            type="button"
            onClick={fetchStallData}
            className="p-2 rounded-full border border-charm-border text-charm-muted hover:text-charm-heading hover:bg-charm-surface transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {/* Main KDS Area */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-charm-border pb-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('kds')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'kds'
                  ? 'bg-charm-brand text-white shadow-cta'
                  : 'bg-charm-panel border border-charm-border text-charm-body hover:text-charm-heading'
              }`}
            >
              <span>Antrean Pesanan Masuk</span>
              {cookingOrders.length > 0 && (
                <span className="ml-2 bg-white text-charm-brand px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                  {cookingOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'menu'
                  ? 'bg-charm-brand text-white shadow-cta'
                  : 'bg-charm-panel border border-charm-border text-charm-body hover:text-charm-heading'
              }`}
            >
              Stok Menu Stan ({menuItems.length})
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
              Ringkasan Harian
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-charm-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Polling Dapur Aktif</span>
          </div>
        </div>

        {/* TAB 1: KDS Queue */}
        {activeTab === 'kds' && (
          <div className="space-y-6">
            {/* Section: Sedang Diproses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-charm-heading uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Perlu Dimasak / Dipersiapkan ({cookingOrders.length})</span>
                </h2>
              </div>

              {cookingOrders.length === 0 ? (
                <div className="bg-charm-panel border border-charm-border rounded-2xl p-6 text-center text-xs text-charm-muted">
                  Semua pesanan sudah siap diambil atau belum ada pesanan baru yang dibayar.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cookingOrders.map(({ order }) => (
                    <div
                      key={order.id}
                      className="bg-charm-panel border-2 border-amber-300 rounded-2xl p-4 shadow-panel flex flex-col justify-between"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-charm-border pb-2.5">
                          <div>
                            <span className="font-mono text-base font-extrabold text-slate-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs font-bold text-charm-heading block mt-1">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="text-right text-[10px] text-charm-muted">
                            <Clock size={12} className="inline mr-1" />
                            <span>{formatJam(order.createdAt)}</span>
                            <span className="block font-semibold text-charm-heading">
                              {order.pickupLocation || 'Ambil Sendiri'}
                            </span>
                          </div>
                        </div>

                        {/* Items for this stall */}
                        <div className="py-3 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-charm-border">
                              <div className="flex items-center justify-between text-xs font-bold text-charm-heading">
                                <span>{item.name}</span>
                                <span className="bg-charm-brand-light text-charm-brand-text px-2 py-0.5 rounded-md font-mono text-sm">
                                  {item.quantity} porsi
                                </span>
                              </div>
                              {item.notes && (
                                <p className="text-[11px] text-rose-700 bg-rose-50 rounded-lg p-1.5 mt-1 font-medium">
                                  Catatan: &ldquo;{item.notes}&rdquo;
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 1-Click Action to mark READY */}
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          fullWidth
                          onClick={() => handleUpdateStatus(order.id, 'SIAP_DIAMBIL')}
                          disabled={updatingOrderId === order.id}
                          className="font-bold shadow-cta text-xs"
                        >
                          <Check size={14} />
                          <span>
                            {updatingOrderId === order.id
                              ? 'Memperbarui...'
                              : 'Tandai Siap Diambil'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Siap Diambil */}
            {readyOrders.length > 0 && (
              <div className="pt-4 border-t border-charm-border">
                <h2 className="text-sm font-extrabold text-charm-heading uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Menunggu Siswa Mengambil di Meja Stan ({readyOrders.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {readyOrders.map(({ order }) => (
                    <div
                      key={order.id}
                      className="bg-emerald-50/60 border border-emerald-300 rounded-2xl p-4 shadow-panel flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-extrabold text-emerald-950 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs font-bold text-charm-heading">
                            {order.customerName}
                          </span>
                        </div>

                        <div className="py-2.5 text-xs text-charm-body">
                          {order.items.map((i, idx) => (
                            <span key={idx} className="block">
                              <strong>{i.quantity}x</strong> {i.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'SELESAI')}
                          disabled={updatingOrderId === order.id}
                          className="w-full py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          Tandai Sudah Selesai Diambil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Kelola Stok Menu */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-charm-heading">
                Status Ketersediaan Menu Makanan & Minuman
              </h2>
              <p className="text-xs text-charm-muted">
                Jika bahan habis, matikan sakelar agar siswa tidak dapat memesannya di etalase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-charm-panel border border-charm-border rounded-2xl p-4 flex items-center justify-between shadow-panel"
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-[10px] font-bold text-charm-muted uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-charm-heading line-clamp-1 leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-xs font-bold text-charm-brand-text">
                      {formatRupiah(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        item.isAvailable ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {item.isAvailable ? 'Tersedia' : 'Habis'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleMenu(item.id, item.isAvailable)}
                      className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                        item.isAvailable ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Rekap Harian */}
        {activeTab === 'rekap' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-charm-heading">
              Rekap Penjualan Stan Hari Ini
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-charm-panel border border-charm-border rounded-2xl p-5 shadow-panel">
                <span className="text-xs text-charm-muted font-medium">Total Pesanan Diproses:</span>
                <div className="text-2xl font-extrabold text-charm-heading mt-1">
                  {storeOrders.length} Pesanan
                </div>
              </div>

              <div className="bg-charm-panel border border-charm-border rounded-2xl p-5 shadow-panel">
                <span className="text-xs text-charm-muted font-medium">Estimasi Omzet Stan Ini:</span>
                <div className="text-2xl font-extrabold text-charm-brand-text mt-1">
                  {formatRupiah(
                    storeOrders.reduce(
                      (acc, curr) =>
                        acc +
                        curr.order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                      0
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

