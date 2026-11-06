PRD: Kantin Sekolah Online
Versi: 1.1 (draft) · Tanggal: 6 November 2026 · Penulis: Repesta · Status: Draft untuk review
1. Ringkasan
Kantin Sekolah Online adalah website pemesanan makanan dan minuman untuk lingkungan sekolah dengan konsep dine-in ordering seperti Mie Gacoan: pengguna langsung melihat daftar toko, memilih menu, mengatur porsi di keranjang, mengisi data penerima, lalu membayar lewat satu QRIS untuk semua toko. Versi 1 adalah demo pribadi yang dibuat tanpa fitur login atau registrasi dan seluruh teknologinya gratis: database di Supabase dan frontend di Vercel, sehingga bisa langsung dijalankan online tanpa biaya. Tujuannya mengurangi antrean di kantin, mempercepat penyajian, dan memudahkan pencatatan penjualan bagi pemilik toko.
2. Latar Belakang dan Masalah
• Jam istirahat singkat, sedangkan antrean di kantin panjang sehingga siswa sering tidak sempat membeli makan.
• Pemesanan manual (lisan atau catatan kertas) rawan salah dengar, salah hitung, dan sulit direkap.
• Pembayaran tunai menyulitkan kembalian dan pencatatan keuangan.
• Pemilik toko tidak punya data menu terlaris dan jam ramai.
3. Tujuan dan Metrik Keberhasilan
Tujuan
Metrik
Target (3 bulan pertama)
Mengurangi antrean
Rata-rata waktu dari pesan sampai pesanan siap
≤ 10 menit
Adopsi
Persentase transaksi kantin lewat sistem
≥ 40%
Kemudahan
Waktu dari buka web sampai bayar
≤ 2 menit
Keandalan
Pesanan berbayar yang tercatat benar
≥ 99%
Kepuasan penjual
Toko yang aktif memakai dashboard
≥ 80% toko terdaftar
4. Bukan Tujuan (Non-Goals) Versi 1
• Login, registrasi, atau akun pengguna dalam bentuk apa pun (pembeli, penjual, maupun admin).
• Layanan berbayar apa pun: payment gateway, QRIS dinamis dengan verifikasi otomatis, hosting atau database berbayar.
• Pengantaran ke kelas atau ke luar sekolah (versi 1: pesanan diambil sendiri di toko).
• Refund pembayaran.
• Pembagian dana otomatis ke toko (versi 1 cukup rekap manual).
• Sistem poin, voucher, atau loyalty.
• Aplikasi mobile native (cukup web responsif/PWA).
• Pembayaran selain QRIS (tunai, transfer bank, e-wallet langsung).
5. Pengguna dan Persona
Persona
Deskripsi
Kebutuhan utama
Pembeli (siswa, guru, staf)
Memesan dari HP saat di kelas atau di kantin
Cepat, jelas harganya, tanpa login atau daftar akun
Penjual (pemilik toko)
Mengelola menu dan menyiapkan pesanan yang sudah dibayar; masuk lewat tautan rahasia toko
Melihat pesanan masuk, mengatur stok, mengubah status pesanan
Admin/kasir
Pemegang QRIS tunggal dan pengelola platform; masuk lewat kunci admin rahasia
Mengonfirmasi pembayaran, mendaftarkan toko, memantau transaksi dan rekap
6. Alur Pengguna Utama (Pembeli)
1. Membuka website dan langsung melihat daftar toko terdaftar (nama, foto/ikon, jenis jualan, status buka/tutup).
2. Memilih toko dan melihat daftar menu (foto, nama, harga, status tersedia/habis).
3. Menambah menu ke keranjang dan mengatur jumlah porsi (+/−). Keranjang boleh berisi menu dari beberapa toko.
4. Membuka keranjang, memeriksa ringkasan dan total harga.
5. Mengisi form pemesan: nama penerima, no. telepon/WhatsApp, kelas atau nomor meja (opsional), catatan.
6. Melihat QRIS beserta nomor pesanan dan total bayar (total pesanan + kode unik), lalu membayar dengan nominal persis lewat aplikasi pembayaran.
7. Menekan Saya sudah bayar (boleh melampirkan bukti). Admin/kasir mencocokkan nominal di mutasi dan mengonfirmasi; pesanan baru diteruskan ke tiap toko. Pembeli memantau status dan mengambil pesanan sendiri di toko saat statusnya Siap.
7. User Stories
Pembeli
• Sebagai pembeli, saya ingin melihat semua toko di halaman awal agar bisa memilih tempat makan dengan cepat.
• Sebagai pembeli, saya ingin memilih menu dan jumlah porsi seperti keranjang belanja biasa.
• Sebagai pembeli, saya ingin mengisi nama, no. telepon, dan lokasi agar pesanan sampai ke orang dan tempat yang benar.
• Sebagai pembeli, saya ingin membayar lewat QRIS agar tidak perlu uang tunai.
• Sebagai pembeli, saya ingin melihat status pesanan agar tahu kapan harus mengambil.
Penjual
• Sebagai penjual, saya ingin membuka dashboard toko lewat tautan rahasia tanpa login atau daftar akun.
• Sebagai penjual, saya ingin melihat pesanan yang sudah dibayar beserta notifikasi suara, tanpa terganggu pesanan yang belum dibayar.
• Sebagai penjual, saya ingin menandai menu habis agar tidak ada pesanan yang tidak bisa dipenuhi.
• Sebagai penjual, saya ingin mengubah status pesanan menjadi siap atau selesai.
• Sebagai penjual, saya ingin melihat rekap penjualan harian.
Admin
• Sebagai admin/kasir, saya ingin mengunggah QRIS tunggal dan mengonfirmasi pembayaran dengan mencocokkan nominal berkode unik.
• Sebagai admin, saya ingin mendaftarkan toko dan membuat tautan akses rahasia untuk penjual.
• Sebagai admin, saya ingin melihat seluruh transaksi dan rekap per toko untuk membagi dana ke toko.
8. Kebutuhan Fungsional
8.1 Katalog Toko dan Menu (P0)
• FR-1: Halaman awal menampilkan seluruh toko aktif beserta status buka/tutup.
• FR-2: Halaman toko menampilkan menu berisi nama, harga, deskripsi singkat, foto, dan status ketersediaan.
• FR-3: Menu yang habis tetap tampil tetapi tidak bisa ditambahkan ke keranjang.
• FR-4: Toko yang tutup tidak menerima pesanan baru.
8.2 Keranjang (P0)
• FR-5: Pengguna dapat menambah, mengurangi, dan menghapus item; total dihitung otomatis.
• FR-6: Keranjang tersimpan di perangkat (tetap ada saat halaman dimuat ulang).
• FR-7: Jika harga atau ketersediaan berubah, sistem menampilkan peringatan sebelum checkout.
• FR-8: Keranjang boleh berisi menu dari beberapa toko; pembayaran tetap satu kali lewat satu QRIS, dan setelah dikonfirmasi pesanan dipecah per toko.
8.3 Checkout (P0)
• FR-9: Form wajib: nama penerima dan no. telepon. Opsional: kelas/nomor meja dan catatan. Pesanan diambil sendiri di toko.
• FR-10: Validasi format no. telepon Indonesia dan batas panjang tiap kolom.
• FR-11: Tidak ada login atau registrasi; data pemesan hanya diingat di perangkat (localStorage) untuk pesanan berikutnya.
8.4 Pembayaran QRIS Statis (P0)
• FR-12: Halaman pembayaran menampilkan satu QRIS milik kantin/sekolah (gambar yang diunggah admin ke Supabase Storage), nomor pesanan, dan total bayar = total pesanan + kode unik 1–99 rupiah (contoh Rp25.037). Kode unik tidak dipakai ulang selama ada pesanan lain yang menunggu.
• FR-13: Pembeli menekan "Saya sudah bayar" dan boleh melampirkan tangkapan layar bukti bayar; status menjadi Menunggu Konfirmasi.
• FR-14: Admin/kasir mencocokkan total bayar (termasuk kode unik) di aplikasi atau mutasi, lalu menekan "Konfirmasi Pembayaran".
• FR-15: Hanya pesanan terkonfirmasi yang diteruskan ke dashboard penjual. Pesanan yang tidak dikonfirmasi dalam 15 menit ditandai Kedaluwarsa; admin tetap bisa mengonfirmasinya bila dana ternyata sudah masuk.
8.5 Status Pesanan (P0)
• FR-16: Setiap pesanan punya nomor unik yang mudah dibaca (contoh: K-1042).
• FR-17: Status pembayaran: Menunggu Bayar → Menunggu Konfirmasi → Dibayar (atau Kedaluwarsa/Dibatalkan). Setelah Dibayar, tiap toko punya status sendiri: Diproses → Siap Diambil → Selesai, dan pembeli melihat status per toko.
• FR-18: Halaman status memperbarui diri otomatis tiap 5–10 detik (polling), dibuka lewat nomor pesanan atau tautan yang tersimpan di perangkat pembeli.
8.6 Dashboard Penjual (P0)
• FR-19: Dashboard penjual dibuka lewat tautan rahasia per toko (token acak panjang), tanpa login; token divalidasi di server dan hanya membuka data tokonya sendiri.
• FR-20: Daftar pesanan yang sudah dibayar untuk tokonya memperbarui otomatis tiap beberapa detik, dengan notifikasi suara/visual untuk pesanan baru.
• FR-21: Mengubah status pesanan (Diproses → Siap → Selesai) dan menandai menu habis/tersedia.
• FR-22: CRUD menu (nama, harga, foto, kategori, ketersediaan).
8.7 Dashboard Admin/Kasir (P0)
• FR-23: Admin/kasir masuk lewat kunci admin rahasia (environment variable di Vercel), tanpa login; unggah QRIS tunggal, CRUD toko, buat atau ganti tautan rahasia penjual.
• FR-24: Daftar pesanan Menunggu Konfirmasi beserta total bayar berkode unik, diurutkan menurut waktu, dengan tombol "Konfirmasi Pembayaran".
• FR-25 (P1): Rekap transaksi harian/mingguan per toko, ekspor CSV, untuk pembagian dana manual; pembatalan pesanan bermasalah (tanpa refund).
8.8 Pengembangan Lanjutan (P2)
• Penjadwalan pesanan (pre-order untuk istirahat berikutnya).
• Notifikasi WhatsApp saat pesanan siap.
• Ulasan dan rating menu.
• Analitik menu terlaris dan jam ramai.
• Mode PWA agar bisa dipasang di layar utama HP.
9. Aturan Bisnis
• Harga ditentukan penjual; sistem hanya menjumlahkan. Satu-satunya tambahan adalah kode unik 1–99 rupiah pada total bayar untuk pencocokan mutasi.
• Tidak ada refund. Stok divalidasi sebelum QR ditampilkan agar pesanan yang dibayar dapat dipenuhi, dan pembeli tidak dapat membatalkan pesanan yang sudah dibayar.
• Jam operasional toko diatur penjual; pesanan hanya diterima saat toko buka.
• Pesanan diambil sendiri di toko; pesanan siap yang tidak diambil lebih dari batas waktu tertentu ditandai selesai oleh penjual.
10. Model Data (Garis Besar)
Entitas
Atribut utama
Store
id, nama, deskripsi, logo, jam buka/tutup, status aktif, token_hash
MenuItem
id, store_id, nama, harga, foto, kategori, tersedia
Order
id, nomor_pesanan, nama, telepon, kelas (opsional), catatan, total, kode_unik, total_bayar, status, dibuat_pada
OrderItem
id, order_id, store_id, menu_item_id, nama (snapshot), harga (snapshot), qty
StoreOrder
id, order_id, store_id, status (Diproses/Siap/Selesai)
Payment
id, order_id, metode (QRIS), jumlah, bukti_url (opsional), status, dikonfirmasi_pada
Setting
key, value (mis. qris_url untuk QRIS tunggal)
Catatan: nama dan harga menu disalin (snapshot) ke OrderItem agar riwayat tidak berubah saat menu diedit.
11. Kebutuhan Non-Fungsional
• Biaya: seluruh layanan memakai paket gratis; tidak ada kewajiban memasang kartu kredit.
• Skala awal: sampai 10 toko dengan 5–6 menu per toko (sekitar 60 menu), jauh di bawah kuota gratis.
• Performa: halaman awal dimuat < 2 detik di jaringan 4G; gambar menu dikompres.
• Responsif: mobile-first (mayoritas pengguna dari HP), tetap nyaman di desktop.
• Keandalan: konfirmasi pembayaran idempoten (menekan dua kali tidak membuat data ganda); kode unik tidak bentrok antar pesanan yang menunggu.
• Keamanan: HTTPS dari Vercel; semua tulis dan baca data sensitif lewat API server dengan kunci service role Supabase yang hanya ada di environment variable Vercel; Row Level Security aktif sehingga pengunjung anonim hanya bisa membaca toko dan menu; token penjual disimpan sebagai hash; validasi input di server.
• Privasi: data pemesan (nama, telepon) hanya dipakai untuk pesanan dan dihapus berkala; tidak menyimpan data kartu atau rekening.
• Aksesibilitas: kontras warna memadai, tombol cukup besar untuk sentuhan, mendukung mode gelap.
• Ketersediaan: karena ini demo pribadi, tidak ada target SLA; proyek Supabase yang terjeda dipulihkan manual lewat dashboard.
12. Arsitektur dan Teknologi (Semua Gratis)
• Frontend dan API: Next.js (TypeScript) + Tailwind di Vercel Hobby (gratis, sesuai untuk demo pribadi non-komersial); API routes berperan sebagai backend.
• Database dan file: Supabase Free (PostgreSQL 500 MB; Storage 1 GB untuk foto menu, QRIS, dan bukti bayar).
• Pembaruan data: polling 5–10 detik dari klien ke API route; Realtime tidak dipakai di versi 1 karena tanpa login dan skala satu sekolah sudah cukup dengan polling.
• Pembayaran: satu QRIS statis (gambar) untuk semua toko, nominal diberi kode unik, dikonfirmasi manual oleh admin/kasir; tanpa payment gateway.
• Akses penjual/admin: tautan rahasia per toko dan kunci admin di environment variable, bukan sistem akun.
• Biaya total: Rp0, memakai domain bawaan *.vercel.app. Angka kuota dan syarat paket ada di bagian Sumber.
13. Alur Pembayaran (Teknis)
1. Klien mengirim keranjang dan data pemesan ke API route di Vercel.
2. Server memvalidasi harga dan ketersediaan dari Supabase (bukan dari klien), membuat Order berstatus Menunggu Bayar dengan kode unik yang belum dipakai pesanan lain, lalu mengembalikan nomor pesanan, total bayar, dan QRIS tunggal.
3. Pembeli membayar total bayar persis, menekan "Saya sudah bayar" (boleh unggah bukti), dan status menjadi Menunggu Konfirmasi.
4. Admin/kasir melihat pesanan di dashboard, mencocokkan total bayar di mutasi, lalu menekan "Konfirmasi Pembayaran"; status menjadi Dibayar dan server membuat StoreOrder per toko berstatus Diproses.
5. Dashboard tiap penjual (polling) menampilkan pesanan tokonya; penjual menandai Siap Diambil lalu Selesai.
6. Pesanan yang tidak dikonfirmasi dalam 15 menit dihitung Kedaluwarsa oleh server saat data dibaca, sehingga tidak butuh cron berbayar.
14. Kasus Tepi
• Pembeli menekan "Saya sudah bayar" tanpa membayar: tidak berdampak ke penjual karena pesanan baru diteruskan setelah admin melihat dana masuk, dan pesanan kedaluwarsa dengan sendirinya.
• Pembayaran berhasil tetapi koneksi pembeli putus: status tetap bisa dilacak lewat nomor pesanan.
• Menu habis saat pembeli sudah di halaman pembayaran: validasi ulang stok sebelum menampilkan QR.
• Pembeli membayar setelah pesanan kedaluwarsa: admin tetap bisa mengonfirmasi karena dana sudah masuk, sehingga tidak perlu refund.
• Nominal yang dibayar tidak sesuai (kurang, lebih, atau kode unik tertukar): tidak dikonfirmasi otomatis, ditangani manual oleh admin di luar sistem.
• Toko tutup di tengah proses checkout: tolak dengan pesan yang jelas.
• Keranjang berisi beberapa toko: satu pembayaran, tiap toko hanya menerima bagiannya dan bisa siap pada waktu berbeda.