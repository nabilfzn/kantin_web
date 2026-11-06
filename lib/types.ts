export interface Store {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  bannerImage?: string;
  priceRange?: string;
  category: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  token: string;
}

export interface MenuItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  photo: string;
  category: string;
  isAvailable: boolean;
  prepTimeMinutes?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  store: Store;
  quantity: number;
  notes: string;
}

export type OrderStatus =
  | 'MENUNGGU_BAYAR'
  | 'MENUNGGU_KONFIRMASI'
  | 'DIBAYAR'
  | 'KEDALUWARSA'
  | 'DIBATALKAN';

export type StoreOrderStatus = 'DIPROSES' | 'SIAP_DIAMBIL' | 'SELESAI';

export interface StoreOrderItemStatus {
  storeId: string;
  storeName: string;
  status: StoreOrderStatus;
  updatedAt: string;
}

export interface OrderItemSnapshot {
  id: string;
  storeId: string;
  storeName: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation?: string;
  orderNotes?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  uniqueCode: number;
  totalPayable: number;
  status: OrderStatus;
  storeStatuses: StoreOrderItemStatus[];
  paymentProofUrl?: string;
  createdAt: string;
  confirmedAt?: string;
}

