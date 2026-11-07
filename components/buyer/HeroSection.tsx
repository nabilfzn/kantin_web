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
        {/* Mobile View (< 640px): Taller vertical aspect ratio for phone screens */}
        <div className="block sm:hidden relative w-full aspect-[600/280]">
          <Image
            src="/hero-complete-mobile.svg"
            alt="Pesan Makanan Kantin Lebih Cepat & Rapi"
            fill
            className="object-cover w-full h-full select-none"
            priority
          />

          {/* Single Focused Action Button for Mobile */}
          <div className="absolute left-[5.5%] top-[50%] z-10">
            <button
              type="button"
              onClick={handleScrollToStalls}
              className="bg-[#FCD820] hover:bg-[#EBC715] active:scale-[0.98] text-[#1C1917] text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all shadow-xs"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>

        {/* Desktop / Tablet View (>= 640px): Wide landscape banner */}
        <div className="hidden sm:block relative w-full aspect-[1200/356]">
          <Image
            src="/hero-complete-no-button.svg"
            alt="Pesan Makanan Kantin Lebih Cepat & Rapi"
            fill
            className="object-cover w-full h-full select-none"
            priority
          />

          {/* Single Focused Action Button for Desktop */}
          <div className="absolute left-[6%] top-[64%] z-10">
            <button
              type="button"
              onClick={handleScrollToStalls}
              className="bg-[#FCD820] hover:bg-[#EBC715] active:scale-[0.98] text-[#1C1917] text-xs md:text-sm font-bold px-5 py-2.5 md:px-6 md:py-2.5 rounded-full transition-all shadow-xs"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
