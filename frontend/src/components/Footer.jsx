import React from 'react';
import Logo from './Logo.jsx';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-[#F4F4F5] dark:bg-[#0E0E10] border-t border-[#E4E4E7] dark:border-[#27272A] text-[#09090B] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* 3 Pillars Banner */}
      <div className="bg-white dark:bg-[#121215] border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[32px] text-black dark:text-white">verified</span>
            <div>
              <h4 className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">100% Genuine Imported</h4>
              <p className="font-['Inter'] text-[13px] text-[#71717A]">Directly sourced with factory seals intact.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[32px] text-black dark:text-white">published_with_changes</span>
            <div>
              <h4 className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">7-Day Replacement Policy</h4>
              <p className="font-['Inter'] text-[13px] text-[#71717A]">Doorstep inspection & hardware testing guarantee.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[32px] text-black dark:text-white">shield_with_heart</span>
            <div>
              <h4 className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">Local Warranty Support</h4>
              <p className="font-['Inter'] text-[13px] text-[#71717A]">Official warranty claims handled directly in PK.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="font-['Space_Grotesk'] text-[22px] font-bold tracking-tight text-black dark:text-white uppercase">
              LAPTOPIA
            </span>
          </div>
          <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-sm leading-relaxed">
            Pakistan's premier technical retailer for enthusiast computing, boutique workstations, and enterprise hardware architectures.
          </p>
          <div className="flex flex-col gap-1 font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            <span>HQ: Sector 11-A, Commercial Tech Quarter, Karachi, PK</span>
            <span>Support: orders@laptops.pk | +92 300 0000000</span>
            <span className="text-black dark:text-white font-semibold">NTN: 7492810-4 | STRN: 3277876120193</span>
          </div>
        </div>

        {/* Catalog */}
        <div className="flex flex-col gap-2">
          <h5 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">
            Hardware Catalog
          </h5>
          <nav className="flex flex-col gap-1.5 font-['Inter'] text-[13px] text-[#71717A]">
            <button onClick={() => onNavigate && onNavigate('catalog', { category: 'Laptops' })} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">High-Performance Laptops</button>
            <button onClick={() => onNavigate && onNavigate('catalog', { category: 'Components & GPUs' })} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">GeForce RTX 40-Series</button>
            <button onClick={() => onNavigate && onNavigate('catalog', { category: 'Components & GPUs' })} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">AMD Ryzen Processors</button>
            <button onClick={() => onNavigate && onNavigate('catalog', { category: 'Monitors' })} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">OLED & High-Refresh Displays</button>
            <button onClick={() => onNavigate && onNavigate('catalog', { category: 'Sim Gear' })} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Sim Racing Wheelbases</button>
          </nav>
        </div>

        {/* Support & Policy */}
        <div className="flex flex-col gap-2">
          <h5 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">
            Support & Policy
          </h5>
          <nav className="flex flex-col gap-1.5 font-['Inter'] text-[13px] text-[#71717A]">
            <button onClick={() => onNavigate && onNavigate('support')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Contact Tech Desk</button>
            <button onClick={() => onNavigate && onNavigate('support')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Warranty & RMA Policy</button>
            <button onClick={() => onNavigate && onNavigate('support')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Express Shipping Nationwide</button>
            <button onClick={() => onNavigate && onNavigate('support')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Cash on Delivery Terms</button>
          </nav>
        </div>

        {/* Logistics & WhatsApp */}
        <div className="flex flex-col gap-3">
          <h5 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-widest text-black dark:text-white">
            Logistics Partners
          </h5>
          <div className="flex flex-wrap gap-1.5 font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            <span className="px-2 py-1 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded">TCS Express</span>
            <span className="px-2 py-1 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded">Leopards Cargo</span>
            <span className="px-2 py-1 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded">Trax</span>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-['Space_Grotesk'] text-[11px] font-bold uppercase rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp Hardware Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#E4E4E7] dark:border-[#27272A] py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
          <div>© 2025 LAPTOPIA Electronics Ltd. All rights reserved. Direct Importer & Hardware Integrator PK.</div>
          <div className="flex items-center gap-4">
            <span>TCS Express</span>
            <span>Leopards</span>
            <span className="text-black dark:text-white font-medium">Cash on Delivery Exclusive</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
