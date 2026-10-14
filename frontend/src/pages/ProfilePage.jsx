import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest, parseApiResponse } from '../utils/api.js';

const emptyProfile = {
  name: '', email: '', phone: '',
  address: { street: '', city: '', province: '', postalCode: '' }
};

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [savedProfile, setSavedProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showAddressPrompt, setShowAddressPrompt] = useState(() => Boolean(location.state?.promptAddress));
  const activeTab = searchParams.get('view') === 'orders' ? 'orders' : 'profile';

  useEffect(() => {
    let active = true;
    setLoading(true);
    const endpoint = activeTab === 'orders' ? '/api/orders/mine' : '/api/profile';
    apiRequest(endpoint)
      .then(parseApiResponse)
      .then(result => {
        if (!active) return;
        if (activeTab === 'orders') setOrders(result.data || []);
        else {
          const loadedProfile = { ...emptyProfile, ...result.data, address: { ...emptyProfile.address, ...result.data.address } };
          setProfile(loadedProfile);
          setSavedProfile(loadedProfile);
        }
        setError('');
      })
      .catch(loadError => active && setError(loadError.message || 'Could not load your account.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [activeTab]);

  const updateAddress = event => {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, address: { ...current.address, [name]: value } }));
  };

  const saveProfile = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await apiRequest('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const result = await parseApiResponse(response);
      const saved = { ...emptyProfile, ...result.data, address: { ...emptyProfile.address, ...result.data.address } };
      setProfile(saved);
      setSavedProfile(saved);
      updateUser({ name: result.data.name, email: result.data.email, phone: result.data.phone });
      setNotice('Your profile was saved.');
    } catch (saveError) {
      setError(saveError.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const savePromptAddress = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await apiRequest('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const result = await parseApiResponse(response);
      const saved = { ...emptyProfile, ...result.data, address: { ...emptyProfile.address, ...result.data.address } };
      setProfile(saved);
      setSavedProfile(saved);
      updateUser({ name: result.data.name, email: result.data.email, phone: result.data.phone });
      setNotice('Your address was saved to your profile.');
      setShowAddressPrompt(false);
    } catch (saveError) {
      setError(saveError.message || 'Could not save your address.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] px-3 py-2.5 text-sm text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none';
  const hasProfileChanges = savedProfile && JSON.stringify(profile) !== JSON.stringify(savedProfile);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] px-4 py-10 text-black dark:text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#71717A]">My Account</p>
          <h1 className="mt-1 text-3xl font-bold">Your Profile & Orders</h1>
          <p className="mt-2 text-sm text-[#71717A]">Only you can view and update this account information.</p>
        </div>

        <div className="flex gap-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
          <button onClick={() => setSearchParams({})} className={`px-4 py-3 text-sm font-semibold ${activeTab === 'profile' ? 'border-b-2 border-black dark:border-white' : 'text-[#71717A]'}`}>Profile</button>
          <button onClick={() => setSearchParams({ view: 'orders' })} className={`px-4 py-3 text-sm font-semibold ${activeTab === 'orders' ? 'border-b-2 border-black dark:border-white' : 'text-[#71717A]'}`}>My Orders</button>
        </div>

        {error && <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
        {notice && <div role="status" className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">{notice}</div>}

        {loading ? <div className="py-16 text-center text-sm text-[#71717A]">Loading…</div> : activeTab === 'profile' ? (
          <form onSubmit={saveProfile} className="grid grid-cols-1 gap-5 rounded-2xl border border-[#E4E4E7] bg-white p-6 dark:border-[#27272A] dark:bg-[#121215] sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">Full name<input className={inputClass} name="name" value={profile.name} onChange={event => setProfile(current => ({ ...current, name: event.target.value }))} required minLength={2} autoComplete="name" /></label>
            <label className="flex flex-col gap-1.5 text-sm">Email<input className={inputClass} name="email" type="email" value={profile.email} onChange={event => setProfile(current => ({ ...current, email: event.target.value }))} required autoComplete="email" /></label>
            <label className="flex flex-col gap-1.5 text-sm">Phone (optional)<input className={inputClass} name="phone" type="tel" value={profile.phone} onChange={event => setProfile(current => ({ ...current, phone: event.target.value }))} autoComplete="tel" /></label>
            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">Street address<input className={inputClass} name="street" value={profile.address.street} onChange={updateAddress} autoComplete="street-address" /></label>
            <label className="flex flex-col gap-1.5 text-sm">City<input className={inputClass} name="city" value={profile.address.city} onChange={updateAddress} autoComplete="address-level2" /></label>
            <label className="flex flex-col gap-1.5 text-sm">Province<input className={inputClass} name="province" value={profile.address.province} onChange={updateAddress} autoComplete="address-level1" /></label>
            <label className="flex flex-col gap-1.5 text-sm">Postal code<input className={inputClass} name="postalCode" value={profile.address.postalCode} onChange={updateAddress} autoComplete="postal-code" /></label>
            {hasProfileChanges && <div className="flex justify-end sm:col-span-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black"><Icon>save</Icon>{saving ? 'Saving…' : 'Save'}</button></div>}
          </form>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-12 text-center dark:border-[#27272A] dark:bg-[#121215]">
            <Icon className="text-4xl text-[#71717A]">receipt_long</Icon>
            <h2 className="mt-3 text-xl font-bold">No orders yet</h2>
            <p className="mt-2 text-sm text-[#71717A]">Orders you place while signed in will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">{orders.map(order => (
            <article key={order.id} className="rounded-2xl border border-[#E4E4E7] bg-white p-5 dark:border-[#27272A] dark:bg-[#121215]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E4E7] pb-3 dark:border-[#27272A]">
                <div><h2 className="font-bold">Order {order.orderNumber}</h2><p className="text-xs text-[#71717A]">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                <span className="rounded bg-[#F4F4F5] px-2 py-1 text-xs dark:bg-[#18181B]">{order.orderStatus.replaceAll('_', ' ')}</span>
              </div>
              <div className="flex flex-col gap-2 py-3 text-sm">{order.items.map((item, index) => <div key={`${item.sku}-${index}`} className="flex justify-between gap-3"><span>{item.title} × {item.qty}</span><span>Rs. {(item.unitPricePKR * item.qty).toLocaleString()}</span></div>)}</div>
              <p className="text-right font-bold">Total: Rs. {Number(order.grossTotalPKR).toLocaleString()}</p>
            </article>
          ))}</div>
        )}
      </div>

      {showAddressPrompt && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
          <section
            aria-labelledby="address-prompt-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-[#E4E4E7] bg-white p-6 text-black shadow-2xl dark:border-[#27272A] dark:bg-[#121215] dark:text-white sm:p-8"
            role="dialog"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="rounded-full bg-[#F4F4F5] p-2 dark:bg-[#27272A]"><Icon className="text-xl">home</Icon></span>
              <div>
                <h2 id="address-prompt-title" className="text-xl font-bold">Add your accurate address</h2>
                <p className="mt-1 text-sm text-[#71717A]">Please add your delivery address to help us deliver your orders correctly. You can also do this later from your profile.</p>
              </div>
            </div>
            {error && <div role="alert" className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
            <form onSubmit={savePromptAddress} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">Street address *<input className={inputClass} name="street" value={profile.address.street} onChange={updateAddress} required autoComplete="street-address" placeholder="House, street, area" /></label>
              <label className="flex flex-col gap-1.5 text-sm">City *<input className={inputClass} name="city" value={profile.address.city} onChange={updateAddress} required autoComplete="address-level2" /></label>
              <label className="flex flex-col gap-1.5 text-sm">Province *<input className={inputClass} name="province" value={profile.address.province} onChange={updateAddress} required autoComplete="address-level1" /></label>
              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">Postal code (optional)<input className={inputClass} name="postalCode" value={profile.address.postalCode} onChange={updateAddress} autoComplete="postal-code" /></label>
              <div className="mt-2 flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowAddressPrompt(false)} className="rounded-lg border border-[#E4E4E7] px-4 py-2.5 text-sm font-semibold dark:border-[#27272A]">I’ll do this later</button>
                {hasProfileChanges && <button type="submit" disabled={saving} className="rounded-lg bg-black px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black">{saving ? 'Saving…' : 'Save'}</button>}
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}