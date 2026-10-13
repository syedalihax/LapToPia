import React, { useState } from 'react';
import Logo from './Logo.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar({ currentPath = 'home', onNavigate }) {
  const { totalItems } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('catalog', { search: searchQuery });
    }
  };

  const navLinks = [
    { label: 'Store', path: 'catalog' },
    { label: 'Laptops', path: 'catalog', filter: 'Laptops' },
    { label: 'Components & GPUs', path: 'catalog', filter: 'Components & GPUs' },
    { label: 'Support', path: 'support' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-xl border-b border-[#E4E4E7] dark:border-[#27272A] shadow-sm transition-colors duration-200">
      {/* Single Unified Sleek Navigation Bar (Second lower navbar removed) */}
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
        >
          <Logo className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-[20px] font-bold text-[#09090B] dark:text-white tracking-tight uppercase leading-none">
              LAPTOPIA
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#71717A] mt-0.5">
              Hardware Lab PK
            </span>
          </div>
        </button>

        {/* Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item, idx) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={idx}
                onClick={() => onNavigate && onNavigate(item.path, item.filter ? { category: item.filter } : {})}
                className={`font-['Space_Grotesk'] text-[13px] uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-0.5'
                    : 'text-[#71717A] hover:text-black dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#71717A] text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gaming laptops, RTX GPUs, processors..."
              className="w-full h-10 pl-10 pr-20 bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg text-black dark:text-white font-['Inter'] text-[13px] placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-2.5 py-1 bg-white dark:bg-[#18181B] hover:bg-neutral-100 dark:hover:bg-[#27272A] text-[11px] font-['Space_Grotesk'] font-bold uppercase rounded text-black dark:text-white border border-[#D4D4D8] dark:border-[#3F3F46] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* User Controls Cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Direct Support */}
          <div className="hidden xl:flex flex-col text-right font-['JetBrains_Mono'] text-[11px] leading-tight mr-2">
            <span className="text-[#71717A]">Support PK:</span>
            <span className="text-black dark:text-white font-bold">+92 300 0000000</span>
          </div>

          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-white text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme mode"
          >
            <span className="material-symbols-outlined text-[19px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* User Account */}
          <button
            onClick={() => onNavigate && onNavigate('login')}
            className="w-9 h-9 rounded-lg bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-white text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Account"
          >
            <span className="material-symbols-outlined text-[19px]">person</span>
          </button>

          {/* Cart Bag */}
          <button
            onClick={() => onNavigate && onNavigate('cart')}
            className="relative flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#09090B] dark:bg-[#121215] border border-black dark:border-[#27272A] text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-white text-black font-['JetBrains_Mono'] text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
