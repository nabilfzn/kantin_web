# 🍱 Kantin Sekolah Online

Aplikasi pemesanan makanan dan minuman kantin sekolah modern dengan konsep **Food Court Hub** & **Pickup Mandiri**.

Dibangun menggunakan **Next.js 15 (App Router, TypeScript)**, **Tailwind CSS**, dan mengadopsi prinsip desain **Charm** dari `web.zip` yang bersih, ramah siswa, dan higienis dari AI-slop.

---

## 🌟 Fitur Utama

- **Food Court Hub**: Menampilkan stan kantin aktif dengan status buka/tutup dan jam operasional.
- **Katalog & Detail Menu**: Melihat menu tiap stan, deskripsi hidangan, porsi pengerjaan, dan catatan khusus (cth: jangan pedas, kuah dipisah).
- **Keranjang Belanja Multi-Stan**: Memesan menu dari stan berbeda sekaligus dalam satu keranjang belanja.
- **Form Konfirmasi Pemesan**: Input nama penerima, nomor WhatsApp/telepon, email, serta nomor meja atau kelas.
- **Satu QRIS Bersama**: Pembayaran QRIS statis dengan kode unik 1–99 rupiah untuk verifikasi otomatis pencocokan mutasi kasir.
- **Pelacakan Status Langsung (Live Tracker)**: Polling otomatis status pesanan:
  `Menunggu Konfirmasi` ➔ `Dibayar` ➔ `Diproses di Dapur` ➔ `Siap Diambil di Stan` ➔ `Selesai`.
- **Dashboard Kasir (`/admin`)**: Verifikasi pembayaran mutasi QRIS 1-klik, pengelolaan stan, dan ekspor CSV rekap transaksi.
- **Dapur Stan KDS (`/seller/[token]`)**: Tampilan Kitchen Display System dengan notifikasi suara lonceng pesanan baru, tombol 1-klik pengerjaan dapur, dan sakelar stok menu (*Tersedia / Habis*).

---

## 🛠️ Cara Menjalankan

### 1. Instalasi Dependensi
```bash
pnpm install
```

### 2. Jalankan Server Dev
```bash
pnpm dev
```
Buka browser pada alamat:
- **Etalase Pembeli**: [http://localhost:3000](http://localhost:3000)
- **Dashboard Kasir**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Dapur Stan Penjual (Contoh Mie Pak Kumis)**: [http://localhost:3000/seller/token-pak-kumis-771](http://localhost:3000/seller/token-pak-kumis-771)

### 3. Build Produksi
```bash
pnpm build
pnpm start
```

---

## 🗄️ Integrasi Supabase (Opsional untuk Production)

Skrip SQL lengkap untuk membuat tabel, relasi, Row Level Security (RLS), dan bucket storage telah disediakan di:
`supabase/schema.sql`

Untuk menghubungkan ke project Supabase:
1. Buka SQL Editor di dashboard Supabase Anda, lalu salin dan jalankan isi file `supabase/schema.sql`.
2. Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
Secara default tanpa file `.env.local`, aplikasi otomatis berjalan dalam **Dual-Mode** dengan data mock in-memory yang sudah terisi stan realistis dan pesanan aktif siap demo.

