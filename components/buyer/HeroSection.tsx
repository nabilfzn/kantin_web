import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const handleScrollToStalls = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('stan-kantin');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#146B3E] via-[#105F36] to-[#0D512E] text-white shadow-sm">
        {/* Subtle decorative curved background wave matching reference */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 80% 90%, #34D399 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 gap-8">
          {/* Left Text & CTAs */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-6">
            <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-[42px] leading-[1.18] tracking-tight max-w-xl">
              Pesan Makanan Kantin Lebih Cepat & Rapi
            </h1>

            <p className="text-white/80 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
              Pesan makanan dan minuman favoritmu langsung dari kelas. Bayar via satu QRIS terpadu, dan ambil mandiri saat bel istirahat.
            </p>

            {/* Action Buttons matching Image 2 */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleScrollToStalls}
                className="bg-[#FCD820] hover:bg-[#EBC715] text-[#1C1917] text-xs sm:text-sm font-bold px-6 py-2.5 sm:py-3 rounded-full transition-colors shadow-xs"
              >
                Pesan Sekarang
              </button>

              <button
                type="button"
                onClick={handleScrollToStalls}
                className="border border-white/70 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 sm:py-3 rounded-full transition-colors"
              >
                Lihat Stan
              </button>
            </div>
          </div>

          {/* Right Noodle Bowl Image */}
          <div className="md:col-span-5 lg:col-span-4 flex items-center justify-center md:justify-end">
            <div className="relative w-52 h-44 sm:w-64 sm:h-52 drop-shadow-md">
              <Image
                src="/hero-noodle-cutout.png"
                alt="Semangkuk mie ayam hangat kantin"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
