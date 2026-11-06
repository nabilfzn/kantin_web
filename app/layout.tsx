import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kantin Darussalam — Pesan & Pickup Mandiri',
  description:
    'Sistem pemesanan makanan dan minuman kantin Pondok Pesantren Daarussa\'adah online tanpa antre, bayar via satu QRIS terpadu, dan pickup mandiri saat istirahat.',
  icons: {
    icon: '/logo-transparent.png',
    apple: '/logo-transparent.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#146B3E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-charm-surface text-charm-body antialiased">
        {children}
      </body>
    </html>
  );
}
