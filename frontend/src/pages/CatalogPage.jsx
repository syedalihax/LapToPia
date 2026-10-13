import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function CatalogPage({ initialCategory = '', initialSearch = '', onNavigate }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchFacet, setSearchFacet] = useState(initialSearch || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [pricePreset, setPricePreset] = useState('all');

  useEffect(() => {
    setLoading(true);
    let url = '/api/products';
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedBrand && selectedBrand !== 'all') params.append('brand', selectedBrand);
    if (searchFacet) params.append('search', searchFacet);
    if (inStockOnly) params.append('status', 'ACTIVE');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          let list = [...data.data];
          if (sortBy === 'price-low') list.sort((a, b) => a.pricePKR - b.pricePKR);
          if (sortBy === 'price-high') list.sort((a, b) => b.pricePKR - a.pricePKR);
          if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          if (pricePreset === 'under-100k') list = list.filter(p => p.pricePKR < 100000);
          if (pricePreset === '100k-300k') list = list.filter(p => p.pricePKR >= 100000 && p.pricePKR <= 300000);
          if (pricePreset === '300k-600k') list = list.filter(p => p.pricePKR >= 300000 && p.pricePKR <= 600000);
          if (pricePreset === '600k-plus') list = list.filter(p => p.pricePKR > 600000);

          setProducts(list);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedBrand, searchFacet, inStockOnly, sortBy, pricePreset]);

  const categoriesList = [
    { label: 'All Products', value: 'all' },
    { label: 'High-Performance Laptops', value: 'Laptops' },
    { label: 'Graphics Cards & GPUs', value: 'Components & GPUs' },
    { label: 'Custom Gaming Rigs', value: 'Custom Rigs' },
    { label: 'OLED & Curved Monitors', value: 'Monitors' },
    { label: 'Sim Racing & Pro Gear', value: 'Sim Gear' },
    { label: 'Enterprise & Storage', value: 'Enterprise' }
  ];

  const brandsList = [
    'ASUS ROG', 'MSI Gaming', 'Lenovo Legion', 'Razer', 'NVIDIA', 'Samsung', 'PXN Sim'
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* 1. Breadcrumb & Telemetry Metadata */}
      <section className="w-full bg-[#F4F4F5] dark:bg-[#0E0E10] border-b border-[#E4E4E7] dark:border-[#27272A] py-2.5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-y-2 font-['JetBrains_Mono'] text-[12px] text-[#71717A]">
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">Catalog</span>
            <span>/</span>
            <span>All Hardware Systems</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] text-black dark:text-white shadow-sm">
              <span className="font-bold">{products.length} Products Listed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Page Header & Quick Filter Pills */}
      <section className="w-full bg-transparent border-b border-[#E4E4E7] dark:border-[#27272A] py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-3xl">
              <span className="font-['JetBrains_Mono'] text-[11px] text-black dark:text-[#FAFAFA] bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] px-2.5 py-0.5 rounded uppercase tracking-widest font-semibold w-max">
                AUTHENTIC CHANNEL ALLOCATION
              </span>
              <h1 className="font-['Space_Grotesk'] text-[32px] md:text-[40px] text-black dark:text-white font-bold uppercase tracking-tight leading-none">
                SHOP ALL HARDWARE
              </h1>
              <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-2xl leading-relaxed">
                Direct factory sealed & certified authentic computing hardware. Verified inventory dispatched from Karachi & Lahore distribution hubs with official local replacement warranty.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-3 rounded-lg shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px] text-black dark:text-white">support_agent</span>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] uppercase text-[#71717A] tracking-wider font-bold">
                  DIRECT SYSTEM QUOTE
                </span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-black dark:text-white">
                  +92 300 0000000
                </span>
              </div>
            </div>
          </div>

          {/* Horizontal Quick Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-[#E4E4E7] dark:border-[#27272A] pt-4">
            {categoriesList.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded font-['JetBrains_Mono'] text-[12px] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:text-black dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 2-Column Main Catalog Architecture */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* LEFT SIDEBAR FILTERS (Sticky Facet Panel) */}
        <aside className="lg:col-span-3 w-full flex flex-col gap-6 sticky top-24 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-5 shadow-sm">
          {/* Search within facet */}
          <div className="flex flex-col gap-2">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
              Filter By Keyword
            </span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#71717A] text-[16px]">
                filter_list
              </span>
              <input
                type="text"
                value={searchFacet}
                onChange={e => setSearchFacet(e.target.value)}
                placeholder="Filter specs, models..."
                className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded pl-8 pr-3 py-1.5 text-[12px] font-['JetBrains_Mono'] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#27272A]"></div>

          {/* Stock Availability */}
          <div className="flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
              Inventory Status
            </span>
            <label className="flex items-center gap-2.5 cursor-pointer font-['Inter'] text-[13px] text-[#71717A] hover:text-black dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-[#F4F4F5] dark:bg-[#18181B] border border-[#D4D4D8] dark:border-[#3F3F46] accent-black dark:accent-white cursor-pointer"
              />
              <span>In Stock Only (Ready for Dispatch)</span>
            </label>
          </div>

          <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#27272A]"></div>

          {/* Price Range Presets */}
          <div className="flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
              Price Range (PKR)
            </span>
            <div className="grid grid-cols-2 gap-1.5 font-['JetBrains_Mono'] text-[11px]">
              {[
                { label: 'All Prices', val: 'all' },
                { label: 'Under 100k', val: 'under-100k' },
                { label: '100k - 300k', val: '100k-300k' },
                { label: '300k - 600k', val: '300k-600k' },
                { label: '600k+', val: '600k-plus' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPricePreset(p.val)}
                  className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                    pricePreset === p.val
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-black dark:border-white'
                      : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] hover:text-black dark:hover:text-white border-[#E4E4E7] dark:border-[#27272A]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#27272A]"></div>

          {/* Brand Filter */}
          <div className="flex flex-col gap-3">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
              Brand Channel
            </span>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`text-left text-[12px] font-['JetBrains_Mono'] py-1 px-2 rounded transition-colors cursor-pointer ${
                  selectedBrand === 'all' ? 'bg-black text-white dark:bg-[#27272A] font-bold' : 'text-[#71717A] hover:text-black dark:hover:text-white'
                }`}
              >
                All Brands
              </button>
              {brandsList.map((brand, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedBrand(brand)}
                  className={`text-left text-[12px] font-['JetBrains_Mono'] py-1 px-2 rounded transition-colors cursor-pointer ${
                    selectedBrand === brand ? 'bg-black text-white dark:bg-[#27272A] font-bold' : 'text-[#71717A] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#27272A]"></div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSearchFacet('');
              setInStockOnly(false);
              setPricePreset('all');
            }}
            className="w-full py-2 rounded bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] border border-[#E4E4E7] dark:border-[#27272A] text-black dark:text-[#FAFAFA] font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </aside>

        {/* MAIN CATALOG VIEWPORT */}
        <main className="lg:col-span-9 w-full flex flex-col gap-6">
          {/* Top Controls Toolbar */}
          <div className="w-full bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <span className="font-['JetBrains_Mono'] text-[12px] text-[#71717A]">
              Showing <span className="text-black dark:text-white font-bold">{products.length}</span> units in catalog
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">Sort:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded text-black dark:text-white font-['JetBrains_Mono'] text-[12px] py-1.5 px-3 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Direct Shipments</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-[#E4E4E7] dark:border-[#27272A] rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 cursor-pointer ${viewMode === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A]'}`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A]'}`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-[18px]">view_agenda</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {loading ? (
            <div className="p-16 text-center text-[#71717A] font-['JetBrains_Mono'] text-[13px]">
              Loading hardware inventory...
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl text-center flex flex-col items-center justify-center gap-4 shadow-sm">
              <span className="material-symbols-outlined text-[42px] text-[#71717A]">search_off</span>
              <h3 className="font-['Space_Grotesk'] text-[20px] text-black dark:text-white font-bold">
                No Matching Products Found
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
                No products match this filter query. You can add new products via the secret Admin Console or reset the active filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSearchFacet('');
                  setPricePreset('all');
                }}
                className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-['Space_Grotesk'] text-[11px] font-bold uppercase rounded cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
              {products.map(product => (
                <div
                  key={product.id}
                  className={`group bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-[#3F3F46] rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-all ${
                    viewMode === 'grid' ? 'flex-col justify-between' : 'flex-row items-center p-4 gap-6'
                  }`}
                >
                  <div className={viewMode === 'grid' ? 'flex flex-col' : 'flex items-center gap-6 flex-1'}>
                    {/* Media Container */}
                    <div
                      onClick={() => onNavigate && onNavigate('product-detail', { id: product.id })}
                      className={`relative bg-[#F4F4F5] dark:bg-[#18181B] flex items-center justify-center p-4 cursor-pointer overflow-hidden ${
                        viewMode === 'grid' ? 'w-full h-56' : 'w-36 h-36 rounded-lg shrink-0'
                      }`}
                    >
                      <img
                        src={Array.isArray(product.images) && product.images[0] ? product.images[0] : ''}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold uppercase bg-black text-white dark:bg-white dark:text-black">
                        {product.stockQuantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex flex-col gap-2.5 flex-1">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase tracking-wider">
                        {product.brand || product.category} • SKU: {product.sku}
                      </span>
                      <h3
                        onClick={() => onNavigate && onNavigate('product-detail', { id: product.id })}
                        className="font-['Space_Grotesk'] text-[16px] text-black dark:text-white font-bold line-clamp-1 hover:underline cursor-pointer"
                      >
                        {product.title}
                      </h3>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-1 font-['JetBrains_Mono'] text-[10px] text-[#71717A]">
                        {product.specs?.slice(0, 4).map((spec, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded">
                            {spec.value || spec}
                          </span>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="pt-1 flex items-baseline justify-between">
                        <span className="font-['Space_Grotesk'] text-[18px] text-black dark:text-white font-bold">
                          Rs. {Number(product.pricePKR).toLocaleString()}
                        </span>
                        <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={viewMode === 'grid' ? 'p-4 pt-0' : 'shrink-0'}>
                    <button
                      disabled={product.stockQuantity <= 0}
                      onClick={() => addToCart(product, 1)}
                      className={`w-full py-2.5 px-4 rounded font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        product.stockQuantity > 0
                          ? 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
                          : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] cursor-not-allowed border border-[#E4E4E7] dark:border-[#27272A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      <span>{product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
