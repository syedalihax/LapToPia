import React from 'react';
import Icon from '../components/Icon.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function CartPage({ onNavigate }) {
  const { cartItems, removeFromCart, updateQty, clearCart, totalItems, grossTotalPKR } = useCart();
  const settings = useStoreSettings();

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-16 transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center">
          <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-12 max-w-lg w-full flex flex-col items-center shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-center text-[#71717A] mb-4">
              <Icon className="text-[32px]">production_quantity_limits</Icon>
            </div>
            <h2 className="font-['Space_Grotesk'] text-[24px] font-bold text-black dark:text-white uppercase tracking-tight">
              Your Cart is Currently Empty
            </h2>
            <p className="font-['Inter'] text-[13px] text-[#71717A] mt-2 mb-6 leading-relaxed">
              Your cart is empty. Browse laptops, PCs, servers, and mining machines to find a system.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('catalog')}
              className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-8 py-3.5 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Hardware Catalog</span>
              <Icon className="text-[16px]">arrow_forward</Icon>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] text-[#71717A]">
          <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-black dark:text-white font-medium">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E4E7] dark:border-[#27272A] pb-6">
          <div>
            <h1 className="font-['Space_Grotesk'] text-[30px] font-bold text-black dark:text-white tracking-tight">
              Shopping Cart <span className="font-['JetBrains_Mono'] text-[#71717A] text-[18px] font-normal">({totalItems} Items)</span>
            </h1>
            <p className="font-['Inter'] text-[13px] text-[#71717A] mt-1">
              Review your selected hardware inventory before proceeding to Cash on Delivery verification.
            </p>
          </div>
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-black dark:text-[#FAFAFA] bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] px-3 py-1.5 rounded-lg shadow-sm">
              <span>READY WHEN YOU ARE</span>
          </div>
        </div>

        {/* 2-Column Content Grid: 65% / 35% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items Table (8 of 12 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 px-6 py-3.5 bg-[#F4F4F5] dark:bg-[#18181B] border-b border-[#E4E4E7] dark:border-[#27272A] font-['Space_Grotesk'] text-[11px] text-[#71717A] uppercase tracking-wider">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Line Total</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-6 hover:bg-[#F4F4F5]/60 dark:hover:bg-[#18181B]/40 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Details */}
                      <div className="col-span-12 md:col-span-6 flex gap-4 items-start">
                        <div className="w-20 h-20 bg-[#F4F4F5] dark:bg-[#09090B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg p-2 flex items-center justify-center shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.2 bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-black dark:text-white font-['JetBrains_Mono'] text-[10px] rounded uppercase">
                              In Stock
                            </span>
                            <span className="text-[#71717A] font-['JetBrains_Mono'] text-[11px] truncate">
                              {item.sku}
                            </span>
                          </div>
                          <span className="font-['Space_Grotesk'] text-[15px] font-bold text-black dark:text-white truncate block">
                            {item.title}
                          </span>
                          {item.variant && item.variant !== 'Standard' && (
                            <span className="text-[11px] font-['JetBrains_Mono'] text-[#71717A]">
                              Config: {item.variant}
                            </span>
                          )}
                          <div className="mt-2">
                            <button
                              onClick={() => removeFromCart(item.productId, item.variant)}
                              className="inline-flex items-center gap-1 font-['Inter'] text-[12px] text-[#71717A] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                            >
                              <Icon className="text-[15px]">delete_outline</Icon>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-4 md:col-span-2 text-left md:text-right font-['Space_Grotesk'] font-bold text-[15px] text-black dark:text-white">
                        Rs. {Number(item.pricePKR).toLocaleString()}
                      </div>

                      {/* Stepper */}
                      <div className="col-span-4 md:col-span-2 flex flex-col items-center">
                        <div className="inline-flex items-center bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg p-1">
                          <button
                            onClick={() => updateQty(item.productId, item.variant, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-white dark:bg-[#121215] hover:bg-neutral-100 dark:hover:bg-[#27272A] text-black dark:text-white transition-colors cursor-pointer"
                          >
                            <Icon className="text-[14px]">remove</Icon>
                          </button>
                          <span className="w-8 text-center font-['JetBrains_Mono'] text-[12px] font-bold text-black dark:text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, item.variant, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-white dark:bg-[#121215] hover:bg-neutral-100 dark:hover:bg-[#27272A] text-black dark:text-white transition-colors cursor-pointer"
                          >
                            <Icon className="text-[14px]">add</Icon>
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="col-span-4 md:col-span-2 text-right font-['Space_Grotesk'] font-bold text-[16px] text-black dark:text-white">
                        Rs. {(Number(item.pricePKR) * Number(item.qty)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between px-2 pt-2">
              <button
                onClick={() => onNavigate && onNavigate('catalog')}
                className="inline-flex items-center gap-1 text-[13px] text-[#71717A] hover:text-black dark:hover:text-white transition-colors font-['Inter'] cursor-pointer"
              >
                <Icon className="text-[18px]">arrow_back</Icon>
                <span>Continue Shopping</span>
              </button>
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-1 text-[13px] text-[#71717A] hover:text-black dark:hover:text-white transition-colors font-['Inter'] cursor-pointer"
              >
                <Icon className="text-[16px]">remove_shopping_cart</Icon>
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (4 of 12 cols, sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-6 shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-4">
                <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-black dark:text-white">Order Summary</h2>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase">{totalItems} ITEMS</span>
              </div>

              {/* Financial Breakdown */}
              <div className="flex flex-col gap-3 font-['Inter'] text-[13px]">
                <div className="flex items-center justify-between text-[#71717A]">
                  <span>Subtotal</span>
                  <span className="font-['JetBrains_Mono'] text-black dark:text-white font-bold">
                    Rs. {grossTotalPKR.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-start justify-between text-[#71717A]">
                  <div className="flex flex-col">
                    <span>Nationwide Express Transit</span>
                    <span className="text-[11px] text-[#71717A]">Insured priority air cargo</span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-black dark:text-white font-bold uppercase">FREE</span>
                </div>
                <div className="flex items-center justify-between text-[#71717A]">
                  <span>Doorstep COD Fee</span>
                  <span className="font-['JetBrains_Mono'] text-black dark:text-white font-bold">Rs. 0</span>
                </div>
              </div>

              {/* Total Payable Box */}
              <div className="bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg p-4 flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">Total Payable</span>
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold text-black dark:text-white">
                    Rs. {grossTotalPKR.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] font-['JetBrains_Mono'] text-[#71717A]">
                  Inclusive of all federal customs & FBR tariffs.
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => onNavigate && onNavigate('checkout')}
                className="w-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 py-3.5 px-6 rounded-lg font-['Space_Grotesk'] text-[13px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Icon className="text-[18px]">lock</Icon>
                <span>Proceed to Checkout</span>
                <Icon className="text-[16px]">arrow_forward</Icon>
              </button>

              {/* Direct WhatsApp Verification */}
              <a
                href={`https://wa.me/${(settings.whatsappPhone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] py-2.5 px-4 rounded-lg font-['JetBrains_Mono'] text-[12px] text-center flex items-center justify-center gap-2 transition-colors"
              >
                <Icon className="text-[16px]">chat</Icon>
                <span>Instant Desk Verification via WhatsApp</span>
              </a>

              {/* Security terms */}
              <div className="bg-[#F4F4F5] dark:bg-[#18181B] p-3 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] flex items-start gap-2 text-[#71717A] text-[11px] font-['JetBrains_Mono']">
                <Icon className="text-[16px] text-black dark:text-white shrink-0 mt-0.5">verified_user</Icon>
                <p>Cash on Delivery: Inspect physical seals upon courier handover before paying cash.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
