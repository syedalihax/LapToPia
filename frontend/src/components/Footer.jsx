import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function Footer({ onNavigate }) {
  const settings = useStoreSettings();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(result => { if (result.success && Array.isArray(result.data)) setCategories(result.data.filter(category => category.catalogMain)); })
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="w-full bg-[#F4F4F5] dark:bg-[#0E0E10] border-t border-[#E4E4E7] dark:border-[#27272A] text-[#09090B] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* 3 Pillars Banner */}
      <div className="bg-white dark:bg-[#121215] border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <Icon className="text-[32px] text-black dark:text-white">verified</Icon>
            <div>
              <h4 className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">100% Genuine Imported</h4>
              <p className="font-['Inter'] text-[13px] text-[#71717A]">Directly sourced with factory seals intact.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Icon className="text-[32px] text-black dark:text-white">published_with_changes</Icon>
            <div>
              <h4 className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">7-Day Replacement Policy</h4>
              <p className="font-['Inter'] text-[13px] text-[#71717A]">Doorstep inspection & hardware testing guarantee.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Icon className="text-[32px] text-black dark:text-white">shield_with_heart</Icon>
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
              {settings.storeName}
            </span>
          </div>
          <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-sm leading-relaxed">
            Laptops and complete systems for home, study, office, gaming, servers, and mining.
          </p>
          <div className="flex flex-col gap-1 font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            {settings.warehouseAddress && <span>{settings.warehouseAddress}</span>}
            <span>Support: {settings.supportEmail} | {settings.supportPhone}</span>
          </div>
        </div>

        {/* Catalog */}
        <div className="flex flex-col gap-2">
          <h5 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">
            Hardware Catalog
          </h5>
          <nav className="flex max-h-56 flex-col gap-1.5 overflow-y-auto font-['Inter'] text-[13px] text-[#71717A]">
            {categories.map(category => <button key={category.id || category.slug} onClick={() => onNavigate?.('catalog', { category: category.value || category.name })} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">{category.name}</button>)}
            {categories.length === 0 && <button onClick={() => onNavigate?.('catalog')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Browse all products</button>}
          </nav>
        </div>

        {/* Support & Policy */}
        <div className="flex flex-col gap-2">
          <h5 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">
            Support & Policy
          </h5>
          <nav className="flex flex-col gap-1.5 font-['Inter'] text-[13px] text-[#71717A]">
            <button onClick={() => onNavigate && onNavigate('support')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">Contact Us</button>
            <button onClick={() => onNavigate && onNavigate('about')} className="text-left hover:text-black dark:hover:text-white transition-colors cursor-pointer">About Us</button>
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
              href={`https://wa.me/${(settings.whatsappPhone || '').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-['Space_Grotesk'] text-[11px] font-bold uppercase rounded transition-colors"
            >
              <Icon className="text-[16px]">chat</Icon>
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
