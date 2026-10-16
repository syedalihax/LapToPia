import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function HomePage({ onNavigate }) {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryRecords, setCategoryRecords] = useState([]);
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

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setCategoryRecords(data.data);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const heroSlides = [
    {
      title: "LAPTOPS. PCS. SERVERS. MINERS.",
      tag: "SYSTEMS FOR EVERY NEED",
      desc: "Find complete systems for gaming, study, office work, everyday use, server workloads, and mining.",
      image: "https://res.cloudinary.com/ypejtyc0/image/upload/v1792154607/hero-1.jpg",
      cta: "SHOP ALL SYSTEMS"
    },
    {
      title: "CHOOSE THE SYSTEM THAT FITS.",
      tag: "GAMING • STUDENT • OFFICE • EVERYDAY",
      desc: "Browse laptops and desktop PCs, or explore servers and dedicated mining machines.",
      image: "https://res.cloudinary.com/ypejtyc0/image/upload/v1792154780/hero-2.jpg",
      cta: "BROWSE CATEGORIES"
    }
  ];

  // One distinct, specific image per real category (used only when the
  // category itself has no image saved in the admin panel yet).
  const categoryImageByKey = {
    'laptops': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
    'desktop pcs': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
    'pc': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
    'graphics cards (gpu)': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'processors (cpu)': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'ram & memory': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80',
    'ssd, hdd & storage': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80',
    'monitors & displays': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
    'servers & workstations': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    'servers': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    'miner machines & mining hardware': 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1000&q=80',
    'miner machines': 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1000&q=80',
    'computer accessories & peripherals': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
  };
  const fallbackCategoryImage = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80';

  const defaultCategories = [
    {
      id: 1,
      num: "01 // LAPTOPS",
      title: "Laptops",
      desc: "Gaming, student, office, and everyday laptops.",
      filter: "Laptops",
      image: categoryImageByKey['laptops']
    },
    {
      id: 2,
      num: "02 // DESKTOP PCS",
      title: "PC",
      desc: "Desktop systems for gaming, study, office, and everyday use.",
      filter: "PC",
      image: categoryImageByKey['pc']
    },
    {
      id: 3,
      num: "03 // SERVERS",
      title: "Servers",
      desc: "Systems for business, storage, and server workloads.",
      filter: "Servers",
      image: categoryImageByKey['servers']
    },
    {
      id: 4,
      num: "04 // MINING SYSTEMS",
      title: "Miner Machines",
      desc: "Dedicated machines for cryptocurrency mining workloads.",
      filter: "Miner Machines",
      image: categoryImageByKey['miner machines']
    }
  ];
  const visibleCategoryRecords = categoryRecords.some(category => category.catalogMain)
    ? categoryRecords.filter(category => category.catalogMain)
    : categoryRecords;
  const categories = visibleCategoryRecords.length
    ? visibleCategoryRecords.map((category, index) => {
      const key = (category.value || category.name || '').toLowerCase();
      // Priority: 1) image saved on the category itself (admin panel)
      // 2) a specific image matched by this category's own name/value
      // 3) a generic fallback — never another category's image, and
      // never cycled/reused across categories.
      const resolvedImage = category.image || categoryImageByKey[key] || fallbackCategoryImage;
      return {
        id: category.id,
        num: `${String(index + 1).padStart(2, '0')} // ${category.name.toUpperCase()}`,
        title: category.name,
        filter: category.value || category.name,
        image: resolvedImage,
        desc: category.subcategories?.map(subcategory => typeof subcategory === 'string' ? subcategory : subcategory.name).join(' · ') || `Browse ${category.name} in the LAPTOPIA catalog.`,
      };
    })
    : defaultCategories;

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
            <div className="absolute inset-0 bg-linear-to-t from-[#09090B] via-[#09090B]/0 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#09090B] via-[#09090B]/50 to-transparent" />

            {/* Hardware Identity Watermark */}
            <div className="absolute top-6 right-6 hidden md:flex items-center gap-3 bg-[#18181B]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#3F3F46]">
              <Icon className="text-[20px] text-white">memory</Icon>
              <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                  COMPLETE SYSTEMS
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#A1A1AA]">SHOP LAPTOPIA</span>
              </div>
            </div>

            {/* Arrow Controls */}
            <button
              onClick={() => setCurrentHeroSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
              className="absolute top-1/2 -translate-y-1/2 left-4 z-20 w-10 h-10 rounded-full bg-[#18181B]/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors border border-[#3F3F46] cursor-pointer"
              title="Previous"
            >
              <Icon className="text-[20px]">chevron_left</Icon>
            </button>
            <button
              onClick={() => setCurrentHeroSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
              className="absolute top-1/2 -translate-y-1/2 right-4 z-20 w-10 h-10 rounded-full bg-[#18181B]/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors border border-[#3F3F46] cursor-pointer"
              title="Next"
            >
              <Icon className="text-[20px]">chevron_right</Icon>
            </button>

            {/* Content Overlay */}
            <div className="relative z-10 p-6 md:p-12 max-w-3xl flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#18181B] border border-[#3F3F46] px-3 py-1 rounded font-['JetBrains_Mono'] text-[12px] text-white font-medium">
                  <Icon className="text-[14px] text-[#25D366]">computer</Icon>
                  {heroSlides[currentHeroSlide].tag}
                </span>
                <span className="bg-[#18181B] border border-[#3F3F46] px-3 py-1 rounded font-['JetBrains_Mono'] text-[12px] text-[#A1A1AA] uppercase">
                  Laptops · PCs · Servers · Miners
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
                  <Icon className="text-[16px]">arrow_forward</Icon>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('catalog', { category: 'PC' })}
                  className="inline-flex items-center gap-2 bg-[#18181B] hover:bg-[#27272A] border border-[#3F3F46] text-white transition-all px-6 py-3 rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  <Icon className="text-[16px]">tune</Icon>
                  <span>SHOP PCS</span>
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

      {/* System Category Grid */}
      <section className="w-full py-16 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-widest block mb-1">
                SHOP BY SYSTEM TYPE
              </span>
              <h2 className="font-['Space_Grotesk'] text-[28px] sm:text-[32px] text-black dark:text-white font-bold uppercase tracking-tight">
                LAPTOPS, PCS & MORE
              </h2>
            </div>
            <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
              Shop laptops and PCs for gaming, study, office, and everyday use, plus servers and mining machines.
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
                    <Icon className="text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</Icon>
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
                LAPTOPIA STORE
              </span>
              <h2 className="font-['Space_Grotesk'] text-[28px] sm:text-[32px] text-black dark:text-white font-bold uppercase tracking-tight">
                AVAILABLE SYSTEMS
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
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.filter)}
                  className={`px-4 py-2 rounded font-['Space_Grotesk'] text-[11px] uppercase font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === category.filter ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-[#71717A] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {featuredProducts.length === 0 ? (
            <div className="p-12 rounded-xl bg-white dark:bg-[#09090B] border border-[#E4E4E7] dark:border-[#27272A] text-center flex flex-col items-center justify-center gap-3 shadow-sm">
              <Icon className="text-[36px] text-[#71717A]">inventory_2</Icon>
              <h3 className="font-['Space_Grotesk'] text-[18px] text-black dark:text-white font-bold">
                No systems listed yet
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
                Products added to the store will appear here.
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
                      <Icon className="text-[16px]">add_shopping_cart</Icon>
                      <span>{product.stockQuantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
