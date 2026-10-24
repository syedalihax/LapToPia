import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon.jsx';
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

  const inStock = product.stockQuantity > 0;

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-4 sm:py-8 pb-28 md:pb-8 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12 flex flex-col gap-5 sm:gap-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex min-w-0 items-center gap-2 font-['JetBrains_Mono'] text-[11px] sm:text-[12px] text-[#71717A]">
          <button onClick={() => onNavigate && onNavigate('home')} className="shrink-0 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <span className="shrink-0">/</span>
          <button onClick={() => onNavigate && onNavigate('catalog')} className="shrink-0 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Catalog
          </button>
          <span className="shrink-0">/</span>
          <span className="min-w-0 truncate text-black dark:text-white font-medium">{product.title}</span>
        </nav>

        {/* HERO SECTION: MEDIA + PURCHASE — stacks on phone, 2-col from tablet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
          {/* Left Media Stage */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-3">
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[16/10] bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden p-3 sm:p-6 shadow-md">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 snap-x">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`snap-start h-16 w-16 sm:h-20 sm:w-20 shrink-0 bg-white dark:bg-[#121215] rounded-lg p-1.5 flex items-center justify-center transition-all cursor-pointer border ${
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
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-['Space_Grotesk'] text-[10px] sm:text-[11px] uppercase tracking-wider text-[#71717A] font-bold truncate">
                {product.brand || product.category} • SKU: {product.sku}
              </span>
              <h1 className="font-['Space_Grotesk'] text-[22px] sm:text-[28px] lg:text-[34px] font-bold text-black dark:text-white tracking-tight leading-tight break-words">
                {product.title}
              </h1>
              {product.description && <p className="mt-2 text-sm leading-relaxed text-[#71717A]">{product.description}</p>}
            </div>

            {/* Price & Stock Container */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-4 sm:p-5 rounded-xl flex flex-col gap-3 shadow-sm">
              <span className="font-['Space_Grotesk'] text-[26px] sm:text-[32px] font-bold text-black dark:text-white break-words">
                Rs. {Number(currentPrice).toLocaleString()}
              </span>
              <div className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono'] text-[11px]">
                <span className="px-2.5 py-1 rounded bg-[#F4F4F5] dark:bg-[#18181B] border border-[#D4D4D8] dark:border-[#3F3F46] text-black dark:text-white font-bold uppercase">
                  {inStock ? (
                    <>
                      <span className="sm:hidden">In stock · {product.stockQuantity}</span>
                      <span className="hidden sm:inline">In stock ({product.stockQuantity} units ready for dispatch)</span>
                    </>
                  ) : 'Out of stock'}
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
                      className={`p-3 text-left rounded-lg border transition-all cursor-pointer min-w-0 ${
                        selectedVariant?.name === v.name
                          ? 'bg-[#F4F4F5] dark:bg-[#18181B] border-black dark:border-white text-black dark:text-white'
                          : 'bg-white dark:bg-[#121215] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-black dark:hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="font-['JetBrains_Mono'] text-[12px] font-bold text-black dark:text-white break-words">{v.name}</div>
                      <div className="font-['Inter'] text-[11px] text-[#71717A] mt-0.5">Rs. {Number(v.pricePKR).toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 sm:w-9 sm:h-9 rounded bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Icon className="text-[16px]">remove</Icon>
                  </button>
                  <span className="w-12 text-center font-['JetBrains_Mono'] text-[13px] font-bold text-black dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stockQuantity || 1, q + 1))}
                    className="w-10 h-10 sm:w-9 sm:h-9 rounded bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-black dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Icon className="text-[16px]">add</Icon>
                  </button>
                </div>

                <button
                  disabled={!inStock}
                  onClick={() => addToCart(product, quantity, selectedVariant)}
                  className={`hidden md:flex flex-1 py-3.5 px-4 rounded-lg font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider items-center justify-center gap-2 transition-all cursor-pointer ${
                    inStock
                      ? 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md'
                      : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] cursor-not-allowed border border-[#E4E4E7] dark:border-[#27272A]'
                  }`}
                >
                  <Icon className="text-[18px]">shopping_bag</Icon>
                  <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>

              {inStock && (
                <button
                  onClick={handleBuyNow}
                  className="hidden md:flex w-full bg-[#F4F4F5] dark:bg-[#18181B] hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] border border-[#D4D4D8] dark:border-[#3F3F46] text-black dark:text-white font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Icon className="text-[18px]">payments</Icon>
                  <span>Buy Now with Cash on Delivery (COD)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="mt-4 sm:mt-8 flex flex-col gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 border-b border-[#E4E4E7] dark:border-[#27272A] overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`shrink-0 font-['Space_Grotesk'] text-[13px] sm:text-[14px] font-bold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview' ? 'text-black dark:text-white border-black dark:border-white' : 'text-[#71717A] border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="sm:hidden">Overview</span>
              <span className="hidden sm:inline">Overview & Features</span>
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`shrink-0 font-['Space_Grotesk'] text-[13px] sm:text-[14px] font-bold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'specs' ? 'text-black dark:text-white border-black dark:border-white' : 'text-[#71717A] border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="sm:hidden">Specs</span>
              <span className="hidden sm:inline">Technical Specifications</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`shrink-0 font-['Space_Grotesk'] text-[13px] sm:text-[14px] font-bold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'shipping' ? 'text-black dark:text-white border-black dark:border-white' : 'text-[#71717A] border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="sm:hidden">Shipping</span>
              <span className="hidden sm:inline">Shipping & Doorstep COD Policy</span>
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 sm:p-8 flex flex-col gap-6 shadow-sm">
              <h3 className="font-['Space_Grotesk'] text-[18px] text-black dark:text-white font-bold">
                Product Details
              </h3>
              <p className="font-['Inter'] text-[14px] text-[#71717A] leading-relaxed max-w-4xl">
                {product.title} is listed under {product.category}. Check the specifications, price, and stock details before ordering.
              </p>
              {Array.isArray(product.specs) && product.specs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {product.specs.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg">
                      <Icon className="text-[18px] text-black dark:text-white">check_circle</Icon>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3 px-4 sm:py-3.5 sm:px-6 bg-[#F4F4F5] dark:bg-[#0E0E10]">
                  <span className="text-[#71717A]">Product Title</span>
                  <span className="sm:col-span-2 text-black dark:text-white font-bold break-words">{product.title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3 px-4 sm:py-3.5 sm:px-6">
                  <span className="text-[#71717A]">Category</span>
                  <span className="sm:col-span-2 text-black dark:text-white">{product.category}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3 px-4 sm:py-3.5 sm:px-6 bg-[#F4F4F5] dark:bg-[#0E0E10]">
                  <span className="text-[#71717A]">SKU Reference</span>
                  <span className="sm:col-span-2 text-black dark:text-white break-all">{product.sku}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3 px-4 sm:py-3.5 sm:px-6">
                  <span className="text-[#71717A]">Price (PKR)</span>
                  <span className="sm:col-span-2 text-black dark:text-white font-bold">Rs. {Number(product.pricePKR).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 py-3 px-4 sm:py-3.5 sm:px-6 bg-[#F4F4F5] dark:bg-[#0E0E10]">
                  <span className="text-[#71717A]">Stock</span>
                  <span className="sm:col-span-2 text-black dark:text-white">{product.stockQuantity} units available</span>
                </div>
                {Array.isArray(product.specs) && product.specs.map((s, idx) => (
                  <div key={idx} className={`grid grid-cols-1 sm:grid-cols-3 py-3 px-4 sm:py-3.5 sm:px-6 ${idx % 2 === 0 ? '' : 'bg-[#F4F4F5] dark:bg-[#0E0E10]'}`}>
                    <span className="text-[#71717A]">{typeof s === 'string' ? `Spec 0${idx + 1}` : s.label}</span>
                    <span className="sm:col-span-2 text-black dark:text-white break-words">{typeof s === 'string' ? s : s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'shipping' && (
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-black dark:text-white font-['Space_Grotesk'] text-[16px] font-bold">
                  <Icon className="text-[22px]">local_shipping</Icon>
                  <span>Delivery Timelines Across Pakistan</span>
                </div>
                <p className="font-['Inter'] text-[13px] text-[#71717A] leading-relaxed">
                  Karachi, Lahore & Islamabad orders are dispatched via priority air cargo within <strong>1–2 business days</strong>. All other regional cities take <strong>2–3 business days</strong> via express insured couriers (TCS / Leopards).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-black dark:text-white font-['Space_Grotesk'] text-[16px] font-bold">
                  <Icon className="text-[22px]">payments</Icon>
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
          <div className="mt-8 sm:mt-12 flex flex-col gap-4 sm:gap-6">
            <h2 className="font-['Space_Grotesk'] text-[18px] sm:text-[22px] font-bold text-black dark:text-white uppercase tracking-tight">
              Related Hardware Gear
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate && onNavigate('product-detail', { id: rel.id })}
                  className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] hover:border-black dark:hover:border-[#3F3F46] rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-full h-28 sm:h-44 bg-[#F4F4F5] dark:bg-[#18181B] rounded-lg p-2 sm:p-3 flex items-center justify-center overflow-hidden">
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

      {/* Mobile purchase bar — always reachable while scrolling the product page */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4E4E7] dark:border-[#27272A] bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-xl px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-['Space_Grotesk'] text-[15px] font-bold text-black dark:text-white truncate">
              Rs. {Number(currentPrice).toLocaleString()}
            </p>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] truncate">{inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}</p>
          </div>
          <button
            disabled={!inStock}
            onClick={() => addToCart(product, quantity, selectedVariant)}
            className={`shrink-0 px-3 py-3 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ${
              inStock
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] cursor-not-allowed'
            }`}
          >
            <Icon className="text-[16px]">shopping_bag</Icon>
            <span>{inStock ? 'Cart' : 'Sold out'}</span>
          </button>
          {inStock && (
            <button
              onClick={handleBuyNow}
              className="shrink-0 px-3 py-3 rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] border border-[#D4D4D8] dark:border-[#3F3F46] text-black dark:text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Icon className="text-[16px]">payments</Icon>
              <span>Buy COD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
