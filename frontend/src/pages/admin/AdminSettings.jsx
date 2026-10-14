import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon.jsx';
import { apiRequest } from '../../utils/api.js';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'LAPTOPIA Hardware Lab PK',
    baseCurrency: 'PKR',
    supportPhone: '+92 345 800 5566',
    whatsappPhone: '+92 345 800 5566',
    supportEmail: 'orders@laptopia.com.pk',
    warehouseAddress: 'Commercial Area, Phase 6, DHA, Karachi, Sindh',
    lahoreAddress: 'Suite 402, Precision Tech Tower, Main Boulevard, Gulberg III, Lahore',
    currencySymbol: 'Rs.',
    maxCodLimitPKR: 500000,
    otpVerificationEnabled: true,
    maintenanceMode: false
  });
  const [savedSettings, setSavedSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    apiRequest('/api/settings')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) {
          setSettings(prev => ({ ...prev, ...d.data }));
          setSavedSettings(d.data);
        }
        else setLoadError(d.error || 'Unable to load store settings.');
      })
      .catch(error => setLoadError(error.message || 'Unable to load store settings.'));
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
    setSaveError('');
    try {
      const res = await apiRequest('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Unable to save store settings.');
      if (d.success) {
        setSettings(prev => ({ ...prev, ...d.data }));
        setSavedSettings(d.data);
        window.dispatchEvent(new Event('laptopia:settings-updated'));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setSaveError(err.message || 'Unable to save store settings.');
    } finally {
      setSaving(false);
    }
  };

  const editableSettings = values => Object.fromEntries(
    Object.entries(values)
      .filter(([key]) => !['id', '_id', 'createdAt', 'updatedAt', '__v'].includes(key))
      .sort(([left], [right]) => left.localeCompare(right))
  );
  const hasChanges = savedSettings && JSON.stringify(editableSettings(settings)) !== JSON.stringify(editableSettings(savedSettings));

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {saveError && <div role="alert" className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-200">{saveError}</div>}
      {loadError && <div role="alert" className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-200">{loadError}</div>}
      {saveSuccess && (
        <div className="p-4 bg-white text-black font-['Space_Grotesk'] font-bold rounded-lg flex items-center justify-between shadow-xl">
          <span>Settings saved.</span>
          <Icon className="text-[20px]">check_circle</Icon>
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

          {hasChanges && <button
            type="submit"
            form="store-settings-form"
            disabled={saving}
            className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>}
      </div>

      <form id="store-settings-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              Customer Call / Support Phone
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
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">WhatsApp Number</label>
            <input type="tel" name="whatsappPhone" value={settings.whatsappPhone || ''} onChange={handleChange} placeholder="+92 300 1234567" className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['JetBrains_Mono'] text-[13px] text-white focus:outline-none" />
            <span className="text-xs text-[#A1A1AA]">Use international format, e.g. +92 300 1234567.</span>
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
            <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">Lahore Facility Address</label>
            <input type="text" name="lahoreAddress" value={settings.lahoreAddress || ''} onChange={handleChange} className="bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 text-[13px] text-white focus:outline-none" />
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
