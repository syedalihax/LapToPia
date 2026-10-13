import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetailPage({ productId, onNavigate }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProduct(data.data);
          if (Array.isArray(data.data.variants) && data.data.variants.length > 0) {
            setSelectedVariant(data.data.variants[0]);
          }
          fetch(`/api/products?category=${encodeURIComponent(data.data.category || '')}`)
            .then(r => r.json())
            .then(relData => {
              if (relData.success && Array.isArray(relData.data)) {
                setRelatedProducts(relData.data.filter(p => p.id !== data.data.id).slice(0, 4));
              }
            });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center text-[#71717A] font-['JetBrains_Mono']">
        Loading hardware specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex flex-col items-center justify-center gap-4 text-black dark:text-white">
        <h2 className="font-['Space_Grotesk'] text-[24px] font-bold">Product Not Found</h2>
        <button
          onClick={() => onNavigate && onNavigate('catalog')}
          className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-['Space_Grotesk'] text-[12px] uppercase font-bold rounded cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'];

  const currentPrice = selectedVariant?.pricePKR ? selectedVariant.pricePKR : product.pricePKR;

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    if (onNavigate) {
      onNavigate('checkout');
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] text-[#71717A] overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate && onNavigate('catalog')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Catalog
          </button>
          <span>/</span>
          <span className="text-black dark:text-white font-medium">{product.title}</span>
        </nav>

        {/* HERO SECTION: MEDIA (7 cols) + PURCHASE (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Media Stage */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-[16/10] bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl flex items-center justify-center overflow-hidden p-6 shadow-md">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* 1 to 5 Image Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[4/3] bg-white dark:bg-[#121215] rounded-lg p-2 flex items-center justify-center transition-all cursor-pointer border ${
                      activeImageIndex === idx ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-[#E4E4E7] dark:border-[#27272A] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Purchase Panel */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                {product.brand || 'ARCHITECT GRADE'} • SKU: {product.sku}
              </span>
              <h1 className="font-['Space_Grotesk'] text-[28px] sm:text-[34px] font-bold text-black dark:text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-black dark:text-white">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-black dark:text-white">5.0</span>
                <span className="font-['Inter'] text-[12px] text-[#71717A]">(Verified Owner Reviews)</span>
              </div>
            </div>

            {/* Price & Stock Container */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-5 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="flex items-baseline justify-between">
                <span className="font-['Space_Grotesk'] text-[32px] font-bold text-black dark:text-white">
                  Rs. {Number(currentPrice).toLocaleString()}
                </span>
                <span className="bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] px-2.5 py-1 rounded font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
                  TAX INCLUSIVE
                </span>
              </div>

              {/* Stock status - Clean solid badge, NO pulsing dots */}
              <div className="flex items-center gap-2 pt-1 font-['JetBrains_Mono'] text-[11px]">
                <span className="px-2.5 py-1 rounded bg-[#F4F4F5] dark:bg-[#18181B] border border-[#D4D4D8] dark:border-[#3F3F46] text-black dark:text-white font-bold uppercase">
                  {product.stockQuantity > 0 ? `IN STOCK (${product.stockQuantity} UNITS READY FOR DISPATCH)` : 'OUT OF STOCK'}
                </span>
              </div>
            </div>

            {/* Variants Selector */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A] tracking-wider">
                  Configuration Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                        selectedVariant?.name === v.name
                          ? 'bg-[#F4F4F5] dark:bg-[#18181B] border-black dark:border-white text-black dark:text-white'
                          : 'bg-white dark:bg-[#121215] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-black dark:hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="font-['JetBrains_Mono'] text-[12px] font-bold text-black dark:text-white">{v.name}</div>
                      <div className="font-['Inter'] text-[11px] text-[#71717A] mt-0.5">Rs. {Number(v.pricePKR).toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart / Buy Now CTAs */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="w-12 text-center font-['JetBrains_Mono'] text-[13px] font-bold text-black dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stockQuantity || 1, q + 1))}
                    className="w-9 h-9 rounded bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  disabled={product.stockQuantity <= 0}
                  onClick={() => addToCart(product, quantity, selectedVariant)}
                  className={`flex-1 py-3.5 px-4 rounded-lg font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    product.stockQuantity > 0
                      ? 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md'
                      : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] cursor-not-allowed border border-[#E4E4E7] dark:border-[#27272A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>{product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Buy Now with Cash on Delivery (COD) */}
              {product.stockQuantity > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] border border-[#D4D4D8] dark:border-[#3F3F46] text-black dark:text-white font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>Buy Now with Cash on Delivery (COD)</span>
                </button>
              )}
            </div>

            {/* 3 Clean Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-2.5 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-black dark:text-white">verified</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] font-medium leading-tight">
                  100% Factory Sealed
                </span>
              </div>
              <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-2.5 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-black dark:text-white">local_shipping</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] font-medium leading-tight">
                  Insured TCS Air Courier
                </span>
              </div>
              <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-2.5 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-black dark:text-white">verified_user</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] font-medium leading-tight">
                  7-Day Replacement
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION: Overview / Specs / Shipping */}
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center gap-6 border-b border-[#E4E4E7] dark:border-[#27272A] overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`font-['Space_Grotesk'] text-[14px] font-bold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview' ? 'text-black dark:text-white border-black dark:border-white' : 'text-[#71717A] border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`font-['Space_Grotesk'] text-[14px] font-bold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'specs' ? 'text-black dark:text-white border-black dark:border-white' : 'text-[#71717A] border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`font-['Space_Grotesk'] text-[14px] font-bold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'shipping' ? 'text-black dark:text-white border-black dark:border-white' : 'text-[#71717A] border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              Shipping & Doorstep COD Policy
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <h3 className="font-['Space_Grotesk'] text-[18px] text-black dark:text-white font-bold">
                Flagship Performance Architecture
              </h3>
              <p className="font-['Inter'] text-[14px] text-[#71717A] leading-relaxed max-w-4xl">
                Engineered for elite power users, engineers, and esports competitors. Every system imported through LAPTOPIA PK undergoes strict bench testing, thermal verification, and serial certification before dispatch.
              </p>
              {Array.isArray(product.specs) && product.specs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {product.specs.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg">
                      <span className="material-symbols-outlined text-[18px] text-black dark:text-white">check_circle</span>
                      <span className="font-['JetBrains_Mono'] text-[12px] text-black dark:text-white">
                        {typeof s === 'string' ? s : `${s.label}: ${s.value}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] font-['JetBrains_Mono'] text-[12px]">
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3.5 px-6 bg-[#F4F4F5] dark:bg-[#0E0E10]">
                  <span className="text-[#71717A]">Product Title</span>
                  <span className="sm:col-span-2 text-black dark:text-white font-bold">{product.title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3.5 px-6">
                  <span className="text-[#71717A]">Category</span>
                  <span className="sm:col-span-2 text-black dark:text-white">{product.category}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3.5 px-6 bg-[#F4F4F5] dark:bg-[#0E0E10]">
                  <span className="text-[#71717A]">SKU Reference</span>
                  <span className="sm:col-span-2 text-black dark:text-white">{product.sku}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3.5 px-6">
                  <span className="text-[#71717A]">MSRP Price (PKR)</span>
                  <span className="sm:col-span-2 text-black dark:text-white font-bold">Rs. {Number(product.pricePKR).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3.5 px-6 bg-[#F4F4F5] dark:bg-[#0E0E10]">
                  <span className="text-[#71717A]">Allocable Stock</span>
                  <span className="sm:col-span-2 text-black dark:text-white">{product.stockQuantity} units available</span>
                </div>
                {Array.isArray(product.specs) && product.specs.map((s, idx) => (
                  <div key={idx} className={`grid grid-cols-1 sm:grid-cols-3 py-3.5 px-6 ${idx % 2 === 0 ? '' : 'bg-[#F4F4F5] dark:bg-[#0E0E10]'}`}>
                    <span className="text-[#71717A]">{typeof s === 'string' ? `Spec 0${idx + 1}` : s.label}</span>
                    <span className="sm:col-span-2 text-black dark:text-white">{typeof s === 'string' ? s : s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'shipping' && (
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-black dark:text-white font-['Space_Grotesk'] text-[16px] font-bold">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  <span>Delivery Timelines Across Pakistan</span>
                </div>
                <p className="font-['Inter'] text-[13px] text-[#71717A] leading-relaxed">
                  Karachi, Lahore & Islamabad orders are dispatched via priority air cargo within <strong>1–2 business days</strong>. All other regional cities take <strong>2–3 business days</strong> via express insured couriers (TCS / Leopards).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-black dark:text-white font-['Space_Grotesk'] text-[16px] font-bold">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                  <span>Cash on Delivery (COD) Doorstep Terms</span>
                </div>
                <p className="font-['Inter'] text-[13px] text-[#71717A] leading-relaxed">
                  Every parcel is sealed with anti-tamper security tape. Customers are encouraged to verify exterior seal integrity before handing over payment to the delivery rider.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 flex flex-col gap-6">
            <h2 className="font-['Space_Grotesk'] text-[22px] font-bold text-black dark:text-white uppercase tracking-tight">
              Related Hardware Gear
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate && onNavigate('product-detail', { id: rel.id })}
                  className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-[#3F3F46] rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-full h-44 bg-[#F4F4F5] dark:bg-[#18181B] rounded-lg p-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={Array.isArray(rel.images) && rel.images[0] ? rel.images[0] : ''}
                      alt={rel.title}
                      className="w-full h-full object-contain hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-3">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase">{rel.category}</span>
                    <h4 className="font-['Space_Grotesk'] text-[14px] font-bold text-black dark:text-white line-clamp-1">{rel.title}</h4>
                    <span className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white mt-1">
                      Rs. {Number(rel.pricePKR).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
