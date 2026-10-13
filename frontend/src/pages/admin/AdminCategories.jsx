import React, { useState, useEffect } from 'react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/categories/brands').then(r => r.json())
    ])
      .then(([catData, brandData]) => {
        if (catData.success && Array.isArray(catData.data)) setCategories(catData.data);
        if (brandData.success && Array.isArray(brandData.data)) setBrands(brandData.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      <div>
        <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
          TAXONOMY & HARDWARE BRANDS // DIRECT OEM
        </span>
        <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
          Categories & Brand Partners
        </h1>
        <p className="font-['Inter'] text-[13px] text-[#71717A]">
          Manage product hierarchy nodes, subcategory clusters, and authorized global brand import partners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Categories Hierarchy (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-white uppercase">
              Active Category Taxonomies ({categories.length})
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#18181B] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[20px]">{cat.icon || 'category'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-['Space_Grotesk'] text-[16px] font-bold text-white">{cat.name}</span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">/{cat.slug}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#18181B] border border-[#3F3F46] font-['JetBrains_Mono'] text-[10px] text-white uppercase font-bold">
                    ACTIVE
                  </span>
                </div>

                {/* Subcategories */}
                {Array.isArray(cat.subcategories) && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-[#27272A]">
                    {cat.subcategories.map((sub, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#121215] border border-[#27272A] rounded font-['JetBrains_Mono'] text-[11px] text-[#A1A1AA]">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Brands (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-white uppercase">
            Authorized Hardware Brands ({brands.length})
          </h2>

          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-5 flex flex-col gap-3">
            {brands.map(brand => (
              <div key={brand.id} className="bg-[#121215] border border-[#27272A] p-3 rounded-lg flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[14px] font-bold text-white">{brand.name}</span>
                <span className="font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded bg-[#18181B] border border-[#3F3F46] text-white uppercase font-bold">
                  {brand.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
