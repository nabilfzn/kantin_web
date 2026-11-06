'use client';

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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-6">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-charm-border/60 bg-[#006438]">
        {/* Vector SVG Hero Banner without buttons */}
        <div className="relative w-full aspect-[1200/356]">
          <Image
            src="/hero-complete-no-button.svg"
            alt="Pesan Makanan Kantin Lebih Cepat & Rapi"
            fill
            className="object-contain sm:object-cover w-full h-full select-none"
            priority
          />

          {/* Interactive Action Buttons placed in the designated empty space */}
          <div className="absolute left-[6%] top-[63%] sm:top-[65%] flex items-center gap-2 sm:gap-3 z-10">
            <button
              type="button"
              onClick={handleScrollToStalls}
              className="bg-[#FCD820] hover:bg-[#EBC715] text-[#1C1917] text-[11px] sm:text-xs md:text-sm font-bold px-3.5 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-2.5 rounded-full transition-colors shadow-xs"
            >
              Pesan Sekarang
            </button>

            <button
              type="button"
              onClick={handleScrollToStalls}
              className="border border-white/80 hover:bg-white/10 text-white text-[11px] sm:text-xs md:text-sm font-semibold px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-2.5 rounded-full transition-colors"
            >
              Lihat Stan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
