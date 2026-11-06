import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId') || undefined;

  const items = store.getMenuItems(storeId);
  return NextResponse.json({ success: true, data: items });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isAvailable } = body;

    if (!id || typeof isAvailable !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'ID dan status ketersediaan wajib diisi' },
        { status: 400 }
      );
    }

    const updated = store.toggleMenuItemAvailability(id, isAvailable);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status menu' },
      { status: 500 }
    );
  }
}

