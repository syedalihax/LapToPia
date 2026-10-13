import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function HomePage({ onNavigate }) {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setFeaturedProducts(data.data);
        }
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const heroSlides = [
    {
      title: "NEXT-GEN HARDWARE ARCHITECTURE.",
      tag: "PXN RACING × ROG ALLIANCE",
      desc: "Equipped with NVIDIA GeForce RTX 4090, Intel Core 14th Gen & AMD Ryzen 7000 Series. Direct factory import with nationwide local warranty coverage across Pakistan.",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=80",
      cta: "EXPLORE FLAGSHIP RIGS"
    },
    {
      title: "CUSTOM HARDLINE LIQUID COOLING.",
      tag: "ARCHITECT GRADE LAB PK",
      desc: "Every bespoke build undergoes 48-hour synthetic stress benchmarking, thermal acoustic tuning, and laser-guided hard-tubing routing.",
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1600&q=80",
      cta: "BOOK A BUILD CONSULTATION"
    }
  ];

  const categories = [
    {
      id: 1,
      num: "01 // PORTABLE COMPUTE",
      title: "High-Performance Laptops",
      desc: "ROG Strix, Lenovo Legion Pro, Razer Blade 16, Apple Silicon M3 Max.",
      filter: "Laptops",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      num: "02 // GRAPHICS ACCELERATION",
      title: "Graphics Cards & GPUs",
      desc: "NVIDIA RTX 4080 Super, RTX 4090 24GB, AMD Radeon RX 7900 XTX.",
      filter: "Components & GPUs",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      num: "03 // WORKSTATION & RIGS",
      title: "Custom Gaming Rigs",
      desc: "Hand-assembled, thermal benchmarked, custom water-cooled builds.",
      filter: "Custom Rigs",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      num: "04 // SIMULATION LAB",
      title: "Sim Racing & Pro Gear",
      desc: "PXN, Moza, Fanatec Direct Drive bases, load cell brake systems.",
      filter: "Sim Gear",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      num: "05 // ULTRA-HIGH REFRESH",
      title: "OLED & Curved Monitors",
      desc: "240Hz+ QD-OLED, Samsung Odyssey Neo G9, LG UltraGear 4K panels.",
      filter: "Monitors",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      num: "06 // ENTERPRISE STACK",
      title: "Enterprise & Storage",
      desc: "10GbE MikroTik routing, Synology NAS, Gen5 enterprise NVMe.",
      filter: "Enterprise",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* Hero Hardware Showcase Carousel */}
      <section className="relative w-full overflow-hidden bg-transparent">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6">
          <div className="relative w-full min-h-[500px] lg:min-h-[580px] rounded-2xl bg-[#09090B] text-white border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden flex flex-col justify-end shadow-xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
              style={{ backgroundImage: `url('${heroSlides[currentHeroSlide].image}')` }}
            />
            {/* Dark Scrim Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/60 to-transparent" />

            {/* Hardware Identity Watermark */}
            <div className="absolute top-6 right-6 hidden md:flex items-center gap-3 bg-[#18181B]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#3F3F46]">
              <span className="material-symbols-outlined text-[20px] text-white">memory</span>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                  ARCHITECT GRADE
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#A1A1AA]">SERIES // 2025</span>
              </div>
            </div>

            {/* Arrow Controls */}
            <button
              onClick={() => setCurrentHeroSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
              className="absolute top-1/2 -translate-y-1/2 left-4 z-20 w-10 h-10 rounded-full bg-[#18181B]/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors border border-[#3F3F46] cursor-pointer"
              title="Previous"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentHeroSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
              className="absolute top-1/2 -translate-y-1/2 right-4 z-20 w-10 h-10 rounded-full bg-[#18181B]/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors border border-[#3F3F46] cursor-pointer"
              title="Next"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>

            {/* Content Overlay */}
            <div className="relative z-10 p-6 md:p-12 max-w-3xl flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#18181B] border border-[#3F3F46] px-3 py-1 rounded font-['JetBrains_Mono'] text-[12px] text-white font-medium">
                  <span className="material-symbols-outlined text-[14px] text-[#25D366]">verified</span>
                  {heroSlides[currentHeroSlide].tag}
                </span>
                <span className="bg-[#18181B] border border-[#3F3F46] px-3 py-1 rounded font-['JetBrains_Mono'] text-[12px] text-[#A1A1AA] uppercase">
                  Factory Sealed PK Import
                </span>
              </div>

              <h1 className="font-['Space_Grotesk'] text-[32px] sm:text-[46px] lg:text-[56px] text-white uppercase tracking-tight font-bold leading-none">
                {heroSlides[currentHeroSlide].title}
              </h1>

              <p className="font-['Inter'] text-[14px] sm:text-[16px] text-[#D4D4D8] max-w-2xl leading-relaxed">
                {heroSlides[currentHeroSlide].desc}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate && onNavigate('catalog')}
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 transition-all px-6 py-3 rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  <span>{heroSlides[currentHeroSlide].cta}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('catalog', { category: 'Components & GPUs' })}
                  className="inline-flex items-center gap-2 bg-[#18181B] hover:bg-[#27272A] border border-[#3F3F46] text-white transition-all px-6 py-3 rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>CUSTOM PC BUILDER</span>
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2 pt-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentHeroSlide === idx ? 'w-8 bg-white' : 'w-2 bg-[#71717A]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Quick Ribbon */}
      <section className="w-full bg-[#F4F4F5] dark:bg-[#121215] border-y border-[#E4E4E7] dark:border-[#27272A] py-4 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-black dark:text-white text-[28px]">speed</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-black dark:text-white uppercase">24H DISPATCH</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Express air courier across PK</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-black dark:text-white text-[28px]">lock</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-black dark:text-white uppercase">GENUINE SEALS</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Unopened global stock</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-black dark:text-white text-[28px]">domain_verification</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-black dark:text-white uppercase">LOCAL WARRANTY</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Direct service center support</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#25D366] text-[28px]">forum</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-black dark:text-white uppercase">WHATSAPP SUPPORT</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Instant hardware guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Grid (6 Premium Tiles) */}
      <section className="w-full py-16 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-widest block mb-1">
                CATALOG HIERARCHY
              </span>
              <h2 className="font-['Space_Grotesk'] text-[28px] sm:text-[32px] text-black dark:text-white font-bold uppercase tracking-tight">
                ENGINEERED CATEGORIES
              </h2>
            </div>
            <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
              Precision selection filtered by enterprise validation, thermal thresholds, and authentic serial verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate && onNavigate('catalog', { category: cat.filter })}
                className="group relative h-72 rounded-xl bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden flex flex-col justify-end p-6 text-left transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="relative z-10 flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#D4D4D8] uppercase tracking-wider">
                    {cat.num}
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-[20px] text-white font-bold group-hover:text-neutral-200 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="font-['Inter'] text-[12px] text-[#D4D4D8] line-clamp-1">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-1 font-['Space_Grotesk'] text-[11px] font-bold uppercase text-white pt-2">
                    <span>EXPLORE PRODUCTS</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Catalog Drops Section */}
      <section className="w-full py-16 bg-[#F4F4F5] dark:bg-[#121215] border-y border-[#E4E4E7] dark:border-[#27272A] transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-widest block mb-1">
                VERIFIED FACTORY SHIPMENTS
              </span>
              <h2 className="font-['Space_Grotesk'] text-[28px] sm:text-[32px] text-black dark:text-white font-bold uppercase tracking-tight">
                HARDWARE CATALOG & INVENTORY
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#09090B] p-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] overflow-x-auto shadow-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded font-['Space_Grotesk'] text-[11px] uppercase font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-[#71717A] hover:text-black dark:hover:text-white'
                }`}
              >
                All Products ({featuredProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('Laptops')}
                className={`px-4 py-2 rounded font-['Space_Grotesk'] text-[11px] uppercase font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'Laptops' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-[#71717A] hover:text-black dark:hover:text-white'
                }`}
              >
                Laptops
              </button>
              <button
                onClick={() => setActiveTab('Components & GPUs')}
                className={`px-4 py-2 rounded font-['Space_Grotesk'] text-[11px] uppercase font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'Components & GPUs' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-[#71717A] hover:text-black dark:hover:text-white'
                }`}
              >
                GPUs & Hardware
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          {featuredProducts.length === 0 ? (
            <div className="p-12 rounded-xl bg-white dark:bg-[#09090B] border border-[#E4E4E7] dark:border-[#27272A] text-center flex flex-col items-center justify-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-[36px] text-[#71717A]">inventory_2</span>
              <h3 className="font-['Space_Grotesk'] text-[18px] text-black dark:text-white font-bold">
                Catalog Ready For Hardware Entry
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
                As per your specification, zero placeholder items were loaded. You can list your genuine inventory items in the Admin Console and they will appear live here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(activeTab === 'all'
                ? featuredProducts
                : featuredProducts.filter(p => p.category?.toLowerCase() === activeTab.toLowerCase())
              ).map(product => (
                <div
                  key={product.id}
                  className="group rounded-xl bg-white dark:bg-[#09090B] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-[#3F3F46] p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col gap-3">
                    {/* Media Preview */}
                    <div
                      onClick={() => onNavigate && onNavigate('product-detail', { id: product.id })}
                      className="relative w-full h-52 rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] overflow-hidden flex items-center justify-center p-4 cursor-pointer"
                    >
                      <img
                        src={Array.isArray(product.images) && product.images[0] ? product.images[0] : ''}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold uppercase bg-black text-white dark:bg-white dark:text-black">
                        {product.stockQuantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
                      <span className="uppercase">{product.brand || product.category}</span>
                      <span className="text-black dark:text-white font-bold">Stock: {product.stockQuantity}</span>
                    </div>

                    <h3
                      onClick={() => onNavigate && onNavigate('product-detail', { id: product.id })}
                      className="font-['Space_Grotesk'] text-[16px] text-black dark:text-white font-bold line-clamp-1 hover:underline cursor-pointer"
                    >
                      {product.title}
                    </h3>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1 font-['JetBrains_Mono'] text-[10px] text-[#71717A]">
                      {product.specs?.slice(0, 3).map((spec, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded">
                          {spec.value || spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A] mt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-['Space_Grotesk'] text-[18px] text-black dark:text-white font-bold">
                        Rs. {Number(product.pricePKR).toLocaleString()}
                      </span>
                    </div>

                    <button
                      disabled={product.stockQuantity <= 0}
                      onClick={() => addToCart(product, 1)}
                      className={`w-full py-2.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        product.stockQuantity > 0
                          ? 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
                          : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] cursor-not-allowed border border-[#E4E4E7] dark:border-[#27272A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      <span>{product.stockQuantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GPU Benchmark Telemetry Lab */}
      <section className="w-full py-16 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-widest block mb-1">
                TELEMETRY BENCHMARK LAB
              </span>
              <h2 className="font-['Space_Grotesk'] text-[28px] sm:text-[32px] text-black dark:text-white font-bold uppercase tracking-tight">
                FLAGSHIP MOBILE GPU PERFORMANCE
              </h2>
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
              Test Config: 4K Ultra Render / Blender Cycle Engine
            </span>
          </div>

          <div className="w-full bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-x-auto shadow-md">
            <table className="w-full text-left font-['JetBrains_Mono'] text-[13px]">
              <thead className="bg-[#F4F4F5] dark:bg-[#0E0E10] text-[#71717A] uppercase text-[11px]">
                <tr>
                  <th className="py-4 px-6">GPU Architecture</th>
                  <th className="py-4 px-6">TGP Envelope</th>
                  <th className="py-4 px-6">VRAM Buffer</th>
                  <th className="py-4 px-6">Cyberpunk 4K RT</th>
                  <th className="py-4 px-6">Blender Render</th>
                  <th className="py-4 px-6 text-right">In-Stock Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-black dark:text-white">
                <tr className="hover:bg-[#F4F4F5] dark:hover:bg-[#18181B] transition-colors">
                  <td className="py-4 px-6 font-bold">NVIDIA GeForce RTX 4090 Mobile</td>
                  <td className="py-4 px-6 text-[#71717A]">175W Max TGP</td>
                  <td className="py-4 px-6 text-[#71717A]">16GB GDDR6X</td>
                  <td className="py-4 px-6 font-bold">94 FPS</td>
                  <td className="py-4 px-6 font-bold">8,210 pts</td>
                  <td className="py-4 px-6 text-right font-['Space_Grotesk'] font-bold text-[16px]">Rs. 890,000+</td>
                </tr>
                <tr className="hover:bg-[#F4F4F5] dark:hover:bg-[#18181B] transition-colors">
                  <td className="py-4 px-6 font-bold">NVIDIA GeForce RTX 4080 Mobile</td>
                  <td className="py-4 px-6 text-[#71717A]">175W Max TGP</td>
                  <td className="py-4 px-6 text-[#71717A]">12GB GDDR6</td>
                  <td className="py-4 px-6 font-bold">78 FPS</td>
                  <td className="py-4 px-6 font-bold">6,840 pts</td>
                  <td className="py-4 px-6 text-right font-['Space_Grotesk'] font-bold text-[16px]">Rs. 680,000+</td>
                </tr>
                <tr className="hover:bg-[#F4F4F5] dark:hover:bg-[#18181B] transition-colors">
                  <td className="py-4 px-6 font-bold">NVIDIA GeForce RTX 4070 Mobile</td>
                  <td className="py-4 px-6 text-[#71717A]">140W Max TGP</td>
                  <td className="py-4 px-6 text-[#71717A]">8GB GDDR6</td>
                  <td className="py-4 px-6 font-bold">56 FPS</td>
                  <td className="py-4 px-6 font-bold">4,910 pts</td>
                  <td className="py-4 px-6 text-right font-['Space_Grotesk'] font-bold text-[16px]">Rs. 445,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Community Battlestations PK */}
      <section className="w-full py-16 bg-[#F4F4F5] dark:bg-[#121215] border-t border-[#E4E4E7] dark:border-[#27272A] transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
          <div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-widest block mb-1">
              #LAPTOPIABUILDS PK
            </span>
            <h2 className="font-['Space_Grotesk'] text-[28px] sm:text-[32px] text-black dark:text-white font-bold uppercase tracking-tight">
              COMMUNITY BATTLESTATIONS
            </h2>
            <p className="font-['Inter'] text-[13px] text-[#71717A] mt-1">
              Verified enthusiast setups delivered to power users in Karachi, Lahore, and Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-80 rounded-xl overflow-hidden bg-black border border-[#E4E4E7] dark:border-[#27272A] p-6 flex flex-col justify-end relative shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#25D366] font-bold uppercase block mb-1">
                  DHA PHASE 8 // KARACHI
                </span>
                <h4 className="font-['Space_Grotesk'] text-[18px] text-white font-bold">Triple-Screen Sim Racing Cell</h4>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#D4D4D8]">PXN Direct Drive Base • RTX 4090 Rig</span>
              </div>
            </div>

            <div className="h-80 rounded-xl overflow-hidden bg-black border border-[#E4E4E7] dark:border-[#27272A] p-6 flex flex-col justify-end relative shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#25D366] font-bold uppercase block mb-1">
                  GULBERG // LAHORE
                </span>
                <h4 className="font-['Space_Grotesk'] text-[18px] text-white font-bold">Stealth Black Unreal Lab</h4>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#D4D4D8]">ROG SCAR 18 • 64GB DDR5 Workstation</span>
              </div>
            </div>

            <div className="h-80 rounded-xl overflow-hidden bg-black border border-[#E4E4E7] dark:border-[#27272A] p-6 flex flex-col justify-end relative shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#25D366] font-bold uppercase block mb-1">
                  SECTOR F-7 // ISLAMABAD
                </span>
                <h4 className="font-['Space_Grotesk'] text-[18px] text-white font-bold">The Dual-OLED Architect Studio</h4>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#D4D4D8]">RTX 4090 • Ryzen 9 7950X • 128GB DDR5</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
