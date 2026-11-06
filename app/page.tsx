'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Navbar } from '@/components/buyer/Navbar';
import { HeroSection } from '@/components/buyer/HeroSection';
import { StoreCard } from '@/components/buyer/StoreCard';
import { StoreDetailView } from '@/components/buyer/StoreDetailView';
import { MenuDetailModal } from '@/components/buyer/MenuDetailModal';
import { FloatingCartBar } from '@/components/buyer/FloatingCartBar';
import { CartDrawerModal } from '@/components/buyer/CartDrawerModal';
import { CheckoutConfirmModal } from '@/components/buyer/CheckoutConfirmModal';
import { PaymentModal } from '@/components/buyer/PaymentModal';
import { OrderTrackerModal } from '@/components/buyer/OrderTrackerModal';
import { Store, MenuItem, CartItem, Order } from '@/lib/types';
import { INITIAL_STORES, INITIAL_MENU_ITEMS } from '@/lib/data';
import { formatRupiah } from '@/lib/format';

export default function CanteenHomePage() {
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Active Order state
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Modals state
  const [isMenuDetailOpen, setIsMenuDetailOpen] = useState(false);
  const [menuForDetail, setMenuForDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Fetch initial stores and menus from API on mount
  useEffect(() => {
    fetch('/api/stores')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setStores(json.data);
      })
      .catch(() => {});

    fetch('/api/menu')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setMenuItems(json.data);
      })
      .catch(() => {});
  }, []);

  // Restore cart and active order from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('canteen_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrderId = localStorage.getItem('canteen_active_order_id');
      if (savedOrderId) {
        fetch(`/api/orders/${savedOrderId}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data) {
              setActiveOrder(json.data);
            }
          })
          .catch(() => {});
      }
    } catch {
      // localStorage error catch
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('canteen_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist active order id to localStorage
  useEffect(() => {
    try {
      if (activeOrder?.id) {
        localStorage.setItem('canteen_active_order_id', activeOrder.id);
      }
    } catch {}
  }, [activeOrder]);

  // Derived cart stats
  const totalCartItems = useMemo(
    () => cart.reduce((acc, curr) => acc + curr.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0),
    [cart]
  );

  const distinctStoreCount = useMemo(() => {
    const storeIds = new Set(cart.map((c) => c.store.id));
    return storeIds.size;
  }, [cart]);

  const cartItemCountsByMenuId = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach((c) => {
      map[c.menuItem.id] = (map[c.menuItem.id] || 0) + c.quantity;
    });
    return map;
  }, [cart]);

  // Open menu detail handler
  const handleOpenMenuItemDetail = (item: MenuItem) => {
    setMenuForDetail(item);
    setIsMenuDetailOpen(true);
  };

  // Add to cart handler
  const handleAddToCart = (
    item: MenuItem,
    storeObj: Store,
    quantity: number,
    notes: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.menuItem.id === item.id && c.notes === notes
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { menuItem: item, store: storeObj, quantity, notes }];
    });
  };

  // Cart update actions
  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleUpdateCartNotes = (index: number, notes: string) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].notes = notes;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Flow transitions: Cart -> Checkout Confirmation -> Payment -> Order Tracker
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (order: Order) => {
    setActiveOrder(order);
    setCart([]); // Clear cart once order is confirmed
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true); // Open QRIS payment
  };

  const handlePaymentSubmitted = (order: Order) => {
    setActiveOrder(order);
    setIsPaymentOpen(false);
    setIsOrderTrackerOpen(true); // Open live tracking
  };

  const matchingMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return menuItems.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [menuItems, searchQuery]);

  const openStoresCount = useMemo(
    () => stores.filter((s) => s.isOpen).length,
    [stores]
  );

  return (
    <div className="min-h-screen flex flex-col bg-charm-surface pb-24">
      {/* Top Navbar */}
      <Navbar
        cartItemCount={totalCartItems}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrderNumber={activeOrder?.orderNumber || null}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      <main className="flex-1">
        {selectedStore ? (
          /* View 2: Detailed Store Menu View */
          <StoreDetailView
            store={selectedStore}
            menuItems={menuItems.filter((m) => m.storeId === selectedStore.id)}
            onBack={() => setSelectedStore(null)}
            onOpenMenuItemDetail={handleOpenMenuItemDetail}
            cartItemCountsByMenuId={cartItemCountsByMenuId}
          />
        ) : (
          /* View 1: Main Home & All Stores */
          <div>
            <HeroSection
              onExploreClick={() => {
                const el = document.getElementById('stan-kantin');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <section id="stan-kantin" className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#146B3E] tracking-tight">
                    {searchQuery.trim() ? `Hasil Pencarian "${searchQuery}"` : 'Stan Kantin'}
                  </h2>
                  <p className="text-xs text-charm-muted mt-0.5">
                    {searchQuery.trim()
                      ? `Ditemukan ${matchingMenuItems.length} menu yang cocok`
                      : 'Pilih stan untuk melihat menu dan memesan langsung'}
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charm-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari menu (mie, bakso, es, nasi...)"
                    className="w-full text-xs bg-white border border-charm-border rounded-full pl-9 pr-4 py-2 text-charm-heading placeholder:text-charm-muted/60 focus:outline-none focus:border-emerald-700 transition-colors shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charm-muted hover:text-charm-heading"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* If Searching: Display Matching Menus */}
              {searchQuery.trim() ? (
                matchingMenuItems.length === 0 ? (
                  <div className="bg-white border border-charm-border rounded-2xl p-8 text-center">
                    <p className="text-xs text-charm-muted">
                      Tidak ada menu yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Tampilkan Semua Stan
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchingMenuItems.map((item) => {
                      const stall = stores.find((s) => s.id === item.storeId);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (item.isAvailable && (!stall || stall.isOpen)) {
                              handleOpenMenuItemDetail(item);
                            }
                          }}
                          className="bg-white border border-charm-border rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-charm-muted mb-1">
                              <span className="font-mono text-emerald-800 font-medium">
                                {stall ? stall.name : 'Stan Kantin'}
                              </span>
                              <span>{item.category}</span>
                            </div>
                            <h3 className="font-display font-bold text-sm text-charm-heading group-hover:text-emerald-800 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-charm-muted mt-1 line-clamp-2">
                              {item.shortDescription || item.description}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-charm-border/60 flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-emerald-800">
                              {formatRupiah(item.price)}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Pilih Menu +
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Default View: Grid of Stores */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {stores.map((store) => {
                    const storeMenuCount = menuItems.filter(
                      (m) => m.storeId === store.id
                    ).length;
                    return (
                      <StoreCard
                        key={store.id}
                        store={store}
                        menuCount={storeMenuCount}
                        onSelect={(s) => setSelectedStore(s)}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Floating Cart Bar (Bottom sticky) */}
      <FloatingCartBar
        totalItems={totalCartItems}
        subtotal={cartSubtotal}
        distinctStoreCount={distinctStoreCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 1. Modal Detail Menu */}
      <MenuDetailModal
        item={menuForDetail}
        store={
          menuForDetail
            ? stores.find((s) => s.id === menuForDetail.storeId) || selectedStore
            : null
        }
        open={isMenuDetailOpen}
        onClose={() => setIsMenuDetailOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Modal Keranjang Belanja */}
      <CartDrawerModal
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateNotes={handleUpdateCartNotes}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Modal Konfirmasi Data Pemesan */}
      <CheckoutConfirmModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBackToCart={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        items={cart}
        onOrderCreated={handleOrderCreated}
      />

      {/* 4. Modal Pembayaran QRIS */}
      <PaymentModal
        order={activeOrder}
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSubmitted={handlePaymentSubmitted}
      />

      {/* 5. Modal Pelacak Status Pesanan Mandiri */}
      <OrderTrackerModal
        order={activeOrder}
        open={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        onOrderUpdated={(updated) => setActiveOrder(updated)}
      />
    </div>
  );
}

