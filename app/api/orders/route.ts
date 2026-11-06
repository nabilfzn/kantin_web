import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const orders = store.getOrders();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      orderNotes,
      items,
    } = body;

    if (!customerName || !customerPhone || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'Nama, nomor telepon, dan email wajib diisi' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Keranjang belanja tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Validasi menu ketersediaan
    for (const item of items) {
      const menuItem = store.getMenuItemById(item.menuItemId);
      if (!menuItem) {
        return NextResponse.json(
          { success: false, message: `Menu dengan ID ${item.menuItemId} tidak ditemukan` },
          { status: 400 }
        );
      }
      if (!menuItem.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            message: `Maaf, menu "${menuItem.name}" baru saja habis. Silakan periksa kembali keranjang Anda.`,
          },
          { status: 400 }
        );
      }
    }

    const order = store.createOrder({
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      orderNotes,
      items,
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat membuat pesanan' },
      { status: 500 }
    );
  }
}

