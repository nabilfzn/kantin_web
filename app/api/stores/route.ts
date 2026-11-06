import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const stores = store.getStores();
  return NextResponse.json({ success: true, data: stores });
}

