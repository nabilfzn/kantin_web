-- ==========================================================
-- SKEMA DATABASE SUPABASE: KANTIN SEKOLAH ONLINE
-- Model Data PostgreSQL, Row Level Security, dan Relasi
-- ==========================================================

-- Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Toko / Stan Kantin
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    tagline TEXT,
    deskripsi TEXT,
    logo_url TEXT,
    kategori TEXT DEFAULT 'Umum',
    jam_buka TIME DEFAULT '07:00',
    jam_tutup TIME DEFAULT '15:00',
    status_aktif BOOLEAN DEFAULT true,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Menu Item
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    deskripsi TEXT,
    harga INT NOT NULL CHECK (harga >= 0),
    foto_url TEXT,
    kategori TEXT DEFAULT 'Makanan Utama',
    tersedia BOOLEAN DEFAULT true,
    waktu_siap_menit INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Pesanan Induk (Order)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_pesanan TEXT NOT NULL UNIQUE,
    nama_penerima TEXT NOT NULL,
    no_telepon TEXT NOT NULL,
    email TEXT NOT NULL,
    lokasi_ambil TEXT DEFAULT 'Ambil di Stan',
    catatan TEXT,
    subtotal INT NOT NULL,
    kode_unik INT NOT NULL,
    total_bayar INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'MENUNGGU_BAYAR', 
    bukti_bayar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    dikonfirmasi_pada TIMESTAMPTZ
);

-- 4. Tabel Detail Item Pesanan (Snapshot)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id),
    menu_item_id UUID,
    nama_snapshot TEXT NOT NULL,
    harga_snapshot INT NOT NULL,
    qty INT NOT NULL CHECK (qty > 0),
    catatan TEXT
);

-- 5. Tabel Status per Stan (StoreOrder)
CREATE TABLE IF NOT EXISTS store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DIPROSES',
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(order_id, store_id)
);

-- 6. Pengaturan Global (Settings)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Pengunjung anonim diizinkan membaca data toko dan menu yang aktif
CREATE POLICY "Publik dapat melihat toko" ON stores FOR SELECT USING (status_aktif = true);
CREATE POLICY "Publik dapat melihat menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Publik dapat membaca settings" ON settings FOR SELECT USING (true);

-- Semua mutasi order dan status dilakukan via Next.js API Routes dengan service_role key

