import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function Navbar({ currentPath = 'home', onNavigate }) {
  const { totalItems } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const settings = useStoreSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchContainerRef = useRef(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(result => { if (result.success && Array.isArray(result.data)) setCategories(result.data.filter(category => category.catalogMain)); })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Search could not be completed.');
        setSearchResults(Array.isArray(result.data) ? result.data.slice(0, 6) : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSearchResults([]);
          setSearchError('Product search is temporarily unavailable.');
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    const closeSearchOnOutsideClick = event => {
      if (!searchContainerRef.current?.contains(event.target)) setSearchOpen(false);
    };
    document.addEventListener('pointerdown', closeSearchOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeSearchOnOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('catalog', { search: searchQuery });
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'All Products', path: 'catalog' },
    { label: 'Contact Us', path: 'support' },
    { label: 'About Us', path: 'about' },
  ];

  return (
    <header
      style={{ backgroundColor: isDark ? 'rgba(9, 9, 11, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-[#E4E4E7] dark:border-[#27272A] shadow-sm transition-[border-color] duration-200"
    >
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
              {settings.storeName}
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#71717A] mt-0.5">
              Hardwares
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
          <div className="relative">
            <button type="button" onClick={() => setCategoryMenuOpen(open => !open)} aria-expanded={categoryMenuOpen} className="font-['Space_Grotesk'] text-[13px] uppercase tracking-wider font-bold text-[#71717A] transition-colors hover:text-black dark:hover:text-white">
              Categories
            </button>
            {categoryMenuOpen && (
              <div className="absolute left-0 top-9 z-50 max-h-[70vh] min-w-64 overflow-y-auto rounded-xl border border-[#E4E4E7] bg-white p-2 shadow-xl dark:border-[#27272A] dark:bg-[#121215]">
                {categories.map(category => (
                  <button key={category.id || category.slug} type="button" onClick={() => { setCategoryMenuOpen(false); onNavigate?.('catalog', { category: category.value || category.name }); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-black hover:bg-[#F4F4F5] dark:text-white dark:hover:bg-[#18181B]">
                    {category.name}
                  </button>
                ))}
                {categories.length === 0 && <span className="block px-3 py-2 text-xs text-[#71717A]">Categories are unavailable.</span>}
              </div>
            )}
          </div>
        </nav>

        {/* Search Bar */}
        <form ref={searchContainerRef} onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Icon className="absolute left-3.5 text-[#71717A] text-[18px] pointer-events-none">search</Icon>
            <input
              type="text"
              value={searchQuery}
              onChange={event => {
                const value = event.target.value;
                setSearchQuery(value);
                setSearchOpen(true);
                setSearchLoading(Boolean(value.trim()));
                setSearchError('');
                if (!value.trim()) setSearchResults([]);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={event => { if (event.key === 'Escape') setSearchOpen(false); }}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-20 bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg text-black dark:text-white font-['Inter'] text-[13px] placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-2.5 py-1 bg-white dark:bg-[#18181B] hover:bg-neutral-100 dark:hover:bg-[#27272A] text-[11px] font-['Space_Grotesk'] font-bold uppercase rounded text-black dark:text-white border border-[#D4D4D8] dark:border-[#3F3F46] transition-colors"
            >
              Search
            </button>
          </div>
          {searchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-[#D4D4D8] bg-white p-2 shadow-2xl dark:border-[#52525B] dark:bg-[#18181B]" role="listbox" aria-label="Product search suggestions">
              {searchLoading ? (
                <p className="px-3 py-3 text-sm text-[#52525B] dark:text-[#D4D4D8]">Searching products…</p>
              ) : searchError ? (
                <p className="px-3 py-3 text-sm text-red-700 dark:text-red-300">{searchError}</p>
              ) : searchResults.length ? searchResults.map(product => (
                <button key={product.id} type="button" role="option" aria-selected="false" onClick={() => { setSearchOpen(false); setSearchQuery(''); onNavigate?.('product-detail', { id: product.id }); }} className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-black hover:bg-[#F4F4F5] focus:bg-[#F4F4F5] focus:outline-none dark:text-white dark:hover:bg-[#27272A] dark:focus:bg-[#27272A]">
                  <img src={product.images?.[0] || ''} alt="" className="h-12 w-14 shrink-0 rounded border border-[#E4E4E7] bg-[#F4F4F5] object-contain dark:border-[#3F3F46] dark:bg-[#09090B]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{product.title}</span>
                    <span className="block truncate text-xs text-[#52525B] dark:text-[#D4D4D8]">{product.brand} · {product.category}</span>
                    <span className="block text-xs font-semibold">Rs. {Number(product.pricePKR).toLocaleString()} · {product.stockQuantity > 0 ? 'In stock' : 'Out of stock'}</span>
                  </span>
                  <Icon className="text-lg text-[#52525B] dark:text-[#D4D4D8]">arrow_forward</Icon>
                </button>
              )) : (
                <button type="button" role="option" aria-selected="false" onClick={() => { setSearchOpen(false); onNavigate?.('catalog', { search: searchQuery.trim() }); }} className="w-full rounded-lg px-3 py-3 text-left text-sm text-[#52525B] hover:bg-[#F4F4F5] dark:text-[#D4D4D8] dark:hover:bg-[#27272A]">
                  No matching products. Click to view search results.
                </button>
              )}
            </div>
          )}
        </form>

        {/* User Controls Cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Direct Support */}
          <div className="hidden xl:flex flex-col text-right font-['JetBrains_Mono'] text-[11px] leading-tight mr-2">
            <span className="text-[#71717A]">Support PK:</span>
            <span className="text-black dark:text-white font-bold">{settings.supportPhone}</span>
          </div>

          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-white text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme mode"
          >
            <Icon className="text-[19px]">{isDark ? 'light_mode' : 'dark_mode'}</Icon>
          </button>

          {/* Account menu */}
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(open => !open)}
              className="w-9 h-9 rounded-lg bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-white text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Account"
              aria-label="Account menu"
              aria-expanded={accountMenuOpen}
            >
              <Icon className="text-[19px]">person</Icon>
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 top-11 z-50 min-w-44 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] p-1.5 shadow-xl">
                {user ? (
                  <>
                    <button onClick={() => { setAccountMenuOpen(false); onNavigate?.('profile'); }} className="w-full rounded px-3 py-2 text-left text-sm text-black dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]">Profile</button>
                    <button onClick={() => { setAccountMenuOpen(false); onNavigate?.('profile', { view: 'orders' }); }} className="w-full rounded px-3 py-2 text-left text-sm text-black dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]">My Orders</button>
                    {user.role === 'admin' && <button onClick={() => { setAccountMenuOpen(false); onNavigate?.('admin'); }} className="w-full rounded px-3 py-2 text-left text-sm font-semibold text-black hover:bg-[#F4F4F5] dark:text-white dark:hover:bg-[#18181B]">Admin Console</button>}
                    <button onClick={() => { setAccountMenuOpen(false); logout(); }} className="w-full rounded px-3 py-2 text-left text-sm text-black dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]">Log out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setAccountMenuOpen(false); onNavigate?.('login'); }} className="w-full rounded px-3 py-2 text-left text-sm text-black dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]">Log in</button>
                    <button onClick={() => { setAccountMenuOpen(false); onNavigate?.('register'); }} className="w-full rounded px-3 py-2 text-left text-sm text-black dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]">Create account</button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Bag */}
          <button
            onClick={() => onNavigate && onNavigate('cart')}
            className="relative flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#09090B] dark:bg-[#121215] border border-black dark:border-[#27272A] text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <Icon className="text-[20px]">shopping_bag</Icon>
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-white text-black font-['JetBrains_Mono'] text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
