import React from 'react';
import Logo from '../../components/Logo.jsx';

export default function AdminLayout({ activeTab = 'overview', onTabChange, onNavigate, onOpenNewProduct, children }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'products', label: 'Products & Inventory', icon: 'inventory_2' },
    { id: 'orders', label: 'Orders & Shipments', icon: 'local_shipping' },
    { id: 'customers', label: 'Customers', icon: 'group' },
    { id: 'categories', label: 'Categories & Brands', icon: 'category' },
    { id: 'settings', label: 'Storefront Settings', icon: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-[#131315] text-[#FAFAFA] flex">
      {/* Fixed Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#09090B] z-50 flex flex-col justify-between border-r border-[#27272A]">
        <div className="flex flex-col">
          {/* Logo & Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <Logo className="w-7 h-7" />
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[16px] font-bold text-white tracking-tight leading-none uppercase">
                  LAPTOPIA
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#71717A] uppercase tracking-wider mt-0.5">
                  Ops Console
                </span>
              </div>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.5 bg-[#18181B] border border-[#27272A] text-[#A1A1AA] rounded">
              v2.5
            </span>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-4">
            <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#71717A] tracking-wider block mb-2 px-2">
              Operations Menu
            </span>
            <nav className="flex flex-col gap-1">
              {menuItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-['Inter'] text-[13px] font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#18181B] text-white border-l-2 border-white font-semibold'
                        : 'text-[#A1A1AA] hover:bg-[#121215] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Switcher: Return to Storefront */}
        <div className="p-4 border-t border-[#27272A] bg-[#09090B] flex flex-col gap-3">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#121215] hover:bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A] font-['JetBrains_Mono'] text-[11px] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Live Storefront</span>
            </span>
            <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
          </button>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-[12px]">
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[12px] font-bold text-white leading-tight">Admin Lead</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] leading-tight">ops@laptopia.io</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        {/* Admin Top Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#09090B]/90 backdrop-blur-xl border-b border-[#27272A] z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] text-[#71717A]">
              <span>Admin</span>
              <span>/</span>
              <span className="text-white font-bold uppercase">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Solid cluster status tag - strictly NO pulsing dots */}
            <div className="px-3 py-1 bg-[#121215] border border-[#27272A] rounded font-['JetBrains_Mono'] text-[11px] text-[#A1A1AA]">
              Database Cluster: Connected
            </div>

            {/* Quick Add Product Trigger */}
            <button
              onClick={onOpenNewProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-black hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ New Product</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="pt-16 flex-1 bg-[#131315]">
          {children}
        </main>
      </div>
    </div>
  );
}
