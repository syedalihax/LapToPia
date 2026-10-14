import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const StoreSettingsContext = createContext(null);
const defaultSettings = {
  storeName: 'LAPTOPIA Hardwares',
  supportPhone: '+92 345 800 5566',
  whatsappPhone: '+92 345 800 5566',
  supportEmail: 'orders@laptopia.com.pk',
  warehouseAddress: 'Commercial Area, Phase 6, DHA, Karachi, Sindh',
  lahoreAddress: 'Suite 402, Precision Tech Tower, Main Boulevard, Gulberg III, Lahore',
};

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  const refreshSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      if (result.success && result.data) setSettings(current => ({ ...current, ...result.data }));
    } catch {
      // Keep the defaults if the store settings cannot be loaded.
    }
  }, []);

  useEffect(() => {
    refreshSettings();
    window.addEventListener('laptopia:settings-updated', refreshSettings);
    return () => window.removeEventListener('laptopia:settings-updated', refreshSettings);
  }, [refreshSettings]);

  const value = useMemo(() => ({ settings, refreshSettings }), [settings, refreshSettings]);
  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  return context.settings;
}
