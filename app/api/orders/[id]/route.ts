import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = store.getOrderById(id);

  if (!order) {
    return NextResponse.json(
      { success: false, message: 'Pesanan tidak ditemukan' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { action, proofUrl } = body;

    if (action === 'MARK_PAID') {
      const order = store.markAsPaidNotification(id, proofUrl);
      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Pesanan tidak ditemukan atau tidak dapat diproses' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: order });
    }

    if (action === 'CONFIRM_PAYMENT') {
      const order = store.confirmPaymentByAdmin(id);
      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Pesanan tidak ditemukan' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: order });
    }

    return NextResponse.json(
      { success: false, message: 'Aksi tidak dikenali' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pesanan' },
      { status: 500 }
    );
  }
}

