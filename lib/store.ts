import { Store, MenuItem, Order, OrderStatus, StoreOrderStatus } from './types';
import { INITIAL_STORES, INITIAL_MENU_ITEMS } from './data';

// Singleton in-memory state for seamless local demo and instant reactivity
class CanteenStore {
  private stores: Store[] = [...INITIAL_STORES];
  private menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
  private orders: Order[] = [
    // Pre-populate with one completed and one in-progress demo order so dashboards are live
    {
      id: 'ord-demo-1',
      orderNumber: 'K-1015',
      customerName: 'Ahmad Fauzi',
      customerPhone: '081234567890',
      customerEmail: 'ahmad.fauzi@sekolah.sch.id',
      pickupLocation: 'Kelas XII IPA 1',
      orderNotes: 'Jangan terlalu pedas ya pak',
      items: [
        {
          id: 'item-1',
          storeId: 'store-1',
          storeName: 'Mie & Bakso Pak Kumis',
          menuItemId: 'menu-101',
          name: 'Mie Ayam Pangsit Spesial',
          price: 15000,
          quantity: 1,
          notes: 'Kuah dipisah',
        },
        {
          id: 'item-2',
          storeId: 'store-3',
          storeName: 'Minuman Segar Bu Ani',
          menuItemId: 'menu-301',
          name: 'Es Teh Manis Jumbo',
          price: 5000,
          quantity: 1,
          notes: 'Sedikit es batu',
        },
      ],
      subtotal: 20000,
      uniqueCode: 17,
      totalPayable: 20017,
      status: 'DIBAYAR',
      storeStatuses: [
        {
          storeId: 'store-1',
          storeName: 'Mie & Bakso Pak Kumis',
          status: 'SIAP_DIAMBIL',
          updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          storeId: 'store-3',
          storeName: 'Minuman Segar Bu Ani',
          status: 'SIAP_DIAMBIL',
          updatedAt: new Date(Date.now() - 7 * 60000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      confirmedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
      id: 'ord-demo-2',
      orderNumber: 'K-1018',
      customerName: 'Siti Rahma',
      customerPhone: '085712349988',
      customerEmail: 'siti.rahma@sekolah.sch.id',
      pickupLocation: 'Meja 06',
      items: [
        {
          id: 'item-3',
          storeId: 'store-2',
          storeName: 'Dapur Bu Sri - Aneka Nasi',
          menuItemId: 'menu-201',
          name: 'Nasi Ayam Geprek Sambal Bawang',
          price: 16000,
          quantity: 2,
          notes: 'Level 2 sedang',
        },
      ],
      subtotal: 32000,
      uniqueCode: 42,
      totalPayable: 32042,
      status: 'MENUNGGU_KONFIRMASI',
      storeStatuses: [
        {
          storeId: 'store-2',
          storeName: 'Dapur Bu Sri - Aneka Nasi',
          status: 'DIPROSES',
          updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    },
  ];

  private orderCounter = 1020;

  // Stores
  getStores(): Store[] {
    return this.stores;
  }

  getStoreBySlug(slug: string): Store | undefined {
    return this.stores.find((s) => s.slug === slug);
  }

  getStoreByToken(token: string): Store | undefined {
    return this.stores.find((s) => s.token === token);
  }

  updateStoreStatus(storeId: string, isOpen: boolean): Store | undefined {
    const store = this.stores.find((s) => s.id === storeId);
    if (store) {
      store.isOpen = isOpen;
    }
    return store;
  }

  // Menu items
  getMenuItems(storeId?: string): MenuItem[] {
    if (storeId) {
      return this.menuItems.filter((m) => m.storeId === storeId);
    }
    return this.menuItems;
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find((m) => m.id === id);
  }

  toggleMenuItemAvailability(id: string, isAvailable: boolean): MenuItem | undefined {
    const item = this.menuItems.find((m) => m.id === id);
    if (item) {
      item.isAvailable = isAvailable;
    }
    return item;
  }

  // Orders
  getOrders(): Order[] {
    return this.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  getOrdersByStore(storeId: string): { order: Order; storeStatus: StoreOrderStatus }[] {
    const results: { order: Order; storeStatus: StoreOrderStatus }[] = [];
    for (const order of this.orders) {
      // Hanya pesanan DIBAYAR yang diteruskan ke dapur penjual
      if (order.status === 'DIBAYAR') {
        const storeStatusObj = order.storeStatuses.find((ss) => ss.storeId === storeId);
        if (storeStatusObj) {
          // Filter hanya item milik toko ini
          const storeItems = order.items.filter((i) => i.storeId === storeId);
          if (storeItems.length > 0) {
            results.push({
              order: {
                ...order,
                items: storeItems,
              },
              storeStatus: storeStatusObj.status,
            });
          }
        }
      }
    }
    return results;
  }

  createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    pickupLocation?: string;
    orderNotes?: string;
    items: {
      menuItemId: string;
      quantity: number;
      notes?: string;
    }[];
  }): Order {
    this.orderCounter++;
    const orderNumber = `K-${this.orderCounter}`;

    // Generate unique code (1-99) not currently used by waiting orders
    const usedCodes = new Set(
      this.orders
        .filter((o) => o.status === 'MENUNGGU_BAYAR' || o.status === 'MENUNGGU_KONFIRMASI')
        .map((o) => o.uniqueCode)
    );

    let uniqueCode = Math.floor(Math.random() * 89) + 10;
    while (usedCodes.has(uniqueCode)) {
      uniqueCode = Math.floor(Math.random() * 89) + 10;
    }

    const orderItems: Order['items'] = [];
    const storeMap = new Map<string, string>();
    let subtotal = 0;

    for (const inputItem of data.items) {
      const menuItem = this.menuItems.find((m) => m.id === inputItem.menuItemId);
      if (!menuItem) continue;

      const store = this.stores.find((s) => s.id === menuItem.storeId);
      const storeName = store ? store.name : 'Stan Kantin';
      storeMap.set(menuItem.storeId, storeName);

      const itemTotal = menuItem.price * inputItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        storeId: menuItem.storeId,
        storeName,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: inputItem.quantity,
        notes: inputItem.notes || '',
      });
    }

    const totalPayable = subtotal + uniqueCode;

    const storeStatuses: Order['storeStatuses'] = Array.from(storeMap.entries()).map(
      ([storeId, storeName]) => ({
        storeId,
        storeName,
        status: 'DIPROSES',
        updatedAt: new Date().toISOString(),
      })
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: data.customerEmail.trim(),
      pickupLocation: data.pickupLocation?.trim() || 'Ambil di Stan',
      orderNotes: data.orderNotes?.trim() || '',
      items: orderItems,
      subtotal,
      uniqueCode,
      totalPayable,
      status: 'MENUNGGU_BAYAR',
      storeStatuses,
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  markAsPaidNotification(orderId: string, proofUrl?: string): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order && order.status === 'MENUNGGU_BAYAR') {
      order.status = 'MENUNGGU_KONFIRMASI';
      if (proofUrl) {
        order.paymentProofUrl = proofUrl;
      }
    }
    return order;
  }

  confirmPaymentByAdmin(orderId: string): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order && (order.status === 'MENUNGGU_KONFIRMASI' || order.status === 'MENUNGGU_BAYAR')) {
      order.status = 'DIBAYAR';
      order.confirmedAt = new Date().toISOString();
      // Pastikan store status diset ke DIPROSES
      order.storeStatuses.forEach((ss) => {
        ss.status = 'DIPROSES';
        ss.updatedAt = new Date().toISOString();
      });
    }
    return order;
  }

  updateStoreOrderStatus(
    orderId: string,
    storeId: string,
    newStatus: StoreOrderStatus
  ): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      const storeStatusObj = order.storeStatuses.find((ss) => ss.storeId === storeId);
      if (storeStatusObj) {
        storeStatusObj.status = newStatus;
        storeStatusObj.updatedAt = new Date().toISOString();
      }
    }
    return order;
  }
}

// Global singleton instance across Next.js API requests
const globalForCanteen = globalThis as unknown as {
  canteenStore?: CanteenStore;
};

export const store = globalForCanteen.canteenStore || new CanteenStore();
if (process.env.NODE_ENV !== 'production') {
  globalForCanteen.canteenStore = store;
}

