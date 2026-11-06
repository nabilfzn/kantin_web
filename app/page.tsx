'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

export default function CanteenHomePage() {
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

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
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#146B3E] tracking-tight">
                    Stan Kantin
                  </h2>
                  <p className="text-xs text-charm-muted mt-0.5">
                    Pilih stan untuk melihat menu dan memesan langsung
                  </p>
                </div>
                <span className="text-xs font-mono font-medium text-charm-muted">
                  {stores.length} Stan Tersedia
                </span>
              </div>

              {/* Grid of Stores */}
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

