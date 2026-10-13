import React, { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'LAPTOPIA Hardware Lab PK',
    baseCurrency: 'PKR',
    supportPhone: '+92 300 0000000',
    supportEmail: 'orders@laptops.pk',
    warehouseAddress: 'Commercial Area, Phase 6, DHA, Karachi, Sindh',
    maxCodLimitPKR: 500000,
    otpVerificationEnabled: true,
    maintenanceMode: false
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) setSettings(prev => ({ ...prev, ...d.data }));
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const d = await res.json();
      if (d.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {saveSuccess && (
        <div className="p-4 bg-white text-black font-['Space_Grotesk'] font-bold rounded-lg flex items-center justify-between shadow-xl">
          <span>Settings saved and synchronized with database cluster!</span>
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
            GLOBAL CONFIGURATION // STOREFRONT & COD POLICIES
          </span>
          <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
            Storefront Settings
          </h1>
          <p className="font-['Inter'] text-[13px] text-[#71717A]">
            Configure Pakistan commerce rules, Cash on Delivery limits, support contact endpoints, and warehouse logistics.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Commerce & Currency */}
        <div className="bg-[#09090B] border border-[#27272A] p-6 rounded-xl flex flex-col gap-4">
          <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-white uppercase border-b border-[#27272A] pb-3">
            Commerce & National Currency
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
              Storefront Brand Name
            </label>
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 text-[13px] text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
              Base Currency (Strict PKR)
            </label>
            <input
              type="text"
              name="baseCurrency"
              value={settings.baseCurrency}
              disabled
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 text-[13px] text-[#71717A] cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
              Maximum Cash on Delivery (COD) Order Threshold (PKR)
            </label>
            <input
              type="number"
              name="maxCodLimitPKR"
              value={settings.maxCodLimitPKR}
              onChange={handleChange}
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['JetBrains_Mono'] text-[13px] text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Card 2: Contact & Fulfillment */}
        <div className="bg-[#09090B] border border-[#27272A] p-6 rounded-xl flex flex-col gap-4">
          <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-white uppercase border-b border-[#27272A] pb-3">
            Contact Support & Warehouse Endpoints
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
              Official WhatsApp & Support Phone
            </label>
            <input
              type="text"
              name="supportPhone"
              value={settings.supportPhone}
              onChange={handleChange}
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['JetBrains_Mono'] text-[13px] text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
              Official Operations Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 text-[13px] text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
              Physical Warehouse HQ Address (Karachi)
            </label>
            <input
              type="text"
              name="warehouseAddress"
              value={settings.warehouseAddress}
              onChange={handleChange}
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 text-[13px] text-white focus:outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
