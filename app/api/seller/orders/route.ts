import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { StoreOrderStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token stan penjual wajib disertakan' },
      { status: 401 }
    );
  }

  const stall = store.getStoreByToken(token);
  if (!stall) {
    return NextResponse.json(
      { success: false, message: 'Tautan atau token stan tidak valid' },
      { status: 403 }
    );
  }

  const storeOrders = store.getOrdersByStore(stall.id);
  const menuItems = store.getMenuItems(stall.id);

  return NextResponse.json({
    success: true,
    data: {
      store: stall,
      orders: storeOrders,
      menuItems,
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, orderId, status: newStatus } = body;

    if (!token || !orderId || !newStatus) {
      return NextResponse.json(
        { success: false, message: 'Token, orderId, dan status baru wajib disertakan' },
        { status: 400 }
      );
    }

    const stall = store.getStoreByToken(token);
    if (!stall) {
      return NextResponse.json(
        { success: false, message: 'Token stan tidak valid' },
        { status: 403 }
      );
    }

    const validStatuses: StoreOrderStatus[] = ['DIPROSES', 'SIAP_DIAMBIL', 'SELESAI'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid' },
        { status: 400 }
      );
    }

    const updated = store.updateStoreOrderStatus(orderId, stall.id, newStatus);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status pesanan stan' },
      { status: 500 }
    );
  }
}

