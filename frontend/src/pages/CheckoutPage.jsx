import React, { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useCart } from '../context/CartContext.jsx';
import InvoiceModal from '../components/InvoiceModal.jsx';
import { apiRequest, parseApiResponse } from '../utils/api.js';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function CheckoutPage({ onNavigate }) {
  const { cartItems, grossTotalPKR, clearCart } = useCart();
  const settings = useStoreSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    province: 'Punjab',
    city: 'Lahore',
    area: '',
    postalCode: '',
    streetAddress: '',
    landmark: ''
  });

  const [courier, setCourier] = useState('TCS_EXPRESS');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    apiRequest('/api/profile')
      .then(parseApiResponse)
      .then(({ data }) => setFormData(current => ({
        ...current,
        fullName: data.name || current.fullName,
        email: data.email || current.email,
        phone: data.phone || current.phone,
        province: data.address?.province || current.province,
        city: data.address?.city || current.city,
        postalCode: data.address?.postalCode || current.postalCode,
        streetAddress: data.address?.street || current.streetAddress
      })))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter receiver full name');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter a valid Pakistani mobile number');
      return;
    }
    if (!formData.streetAddress.trim()) {
      setErrorMessage('Please provide your complete street/house address');
      return;
    }
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cartItems,
          grossTotalPKR,
          courier
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setPlacedOrder(result.data);
        clearCart();
      } else {
        setErrorMessage(result.error || 'Failed to place order');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-16 transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-8 rounded-2xl shadow-xl flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <Icon className="text-[36px] font-bold">check</Icon>
            </div>

            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-black dark:text-[#FAFAFA] bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] px-3 py-1 rounded uppercase tracking-wider font-bold">
                DISPATCH RESERVATION AUTHORIZED
              </span>
              <h1 className="font-['Space_Grotesk'] text-[28px] sm:text-[34px] font-bold text-black dark:text-white mt-2 uppercase">
                Order Placed Successfully!
              </h1>
              <p className="font-['JetBrains_Mono'] text-[14px] text-black dark:text-white font-bold mt-1">
                ORDER ID: {placedOrder.orderNumber}
              </p>
              <p className="font-['Inter'] text-[14px] text-[#71717A] mt-2 max-w-md mx-auto leading-relaxed">
                Your hardware package is locked in our distribution inventory. Payment of{' '}
                <strong className="text-black dark:text-white">Rs. {Number(placedOrder.grossTotalPKR).toLocaleString()}</strong> will be collected in cash at your doorstep.
              </p>
            </div>

            <div className="w-full bg-[#F4F4F5] dark:bg-[#09090B] p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] font-['JetBrains_Mono'] text-[12px] flex flex-col gap-2 text-left">
              <div className="flex justify-between text-[#71717A]">
                <span>Recipient:</span>
                <span className="text-black dark:text-white font-bold">{placedOrder.customer?.fullName}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Contact Phone:</span>
                <span className="text-black dark:text-white">{placedOrder.customer?.phone}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Destination:</span>
                <span className="text-black dark:text-white">{placedOrder.customer?.city}, {placedOrder.customer?.province}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Courier Dispatch:</span>
                <span className="text-black dark:text-white font-bold">TCS Air Priority Insured</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Estimated Transit:</span>
                <span className="text-black dark:text-white font-bold">24–48 Hours</span>
              </div>
            </div>

            {/* Actions: Download Invoice & WhatsApp Link */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full sm:flex-1 py-3 px-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Icon className="text-[18px]">receipt_long</Icon>
                <span>Download / Print Invoice</span>
              </button>

              <a
                href={`https://wa.me/${(settings.whatsappPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Salam ${settings.storeName}! Maine order place kiya hai ${placedOrder.orderNumber}. Barah-e-karam dispatch confirm karein.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Icon className="text-[18px]">chat</Icon>
                <span>Track on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="text-[#71717A] hover:text-black dark:hover:text-white font-['Space_Grotesk'] text-[12px] uppercase font-bold underline transition-colors cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>

        {/* Invoice Modal for downloading/printing */}
        {showInvoiceModal && (
          <InvoiceModal
            order={placedOrder}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6">
        {/* Progress Pipeline */}
        <div className="w-full bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-widest">
            <span className="text-[#71717A]">01 CART</span>
            <span className="text-[#D4D4D8] dark:text-[#3F3F46]">/</span>
            <span className="text-black dark:text-white">02 CHECKOUT & DISPATCH</span>
            <span className="text-[#D4D4D8] dark:text-[#3F3F46]">/</span>
            <span className="text-[#71717A]">03 CONFIRMATION</span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('cart')}
            className="text-[#71717A] hover:text-black dark:hover:text-white text-[12px] font-['Inter'] flex items-center gap-1 cursor-pointer"
          >
            <Icon className="text-[16px]">arrow_back</Icon>
            <span>Return to Cart</span>
          </button>
        </div>

        {errorMessage && (
          <div className="bg-[#93000A]/20 border border-[#93000A] p-4 rounded-lg text-red-600 dark:text-red-400 font-['Inter'] text-[13px] flex items-center gap-3">
            <Icon className="text-[20px]">error</Icon>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Shipping Coordinates (7 cols) */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 flex flex-col gap-6">
            {/* Section 1: Customer Profile */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">SECTION_01</span>
                  <h2 className="font-['Space_Grotesk'] text-[16px] font-bold uppercase text-black dark:text-white">Contact Coordinates</h2>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase">REQUIRED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Receiver Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter recipient's full legal name"
                    required
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Email Address (For Invoice)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.pk"
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Pakistani Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 3XX XXXXXXX"
                    required
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['JetBrains_Mono'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pakistan Delivery Address */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">SECTION_02</span>
                  <h2 className="font-['Space_Grotesk'] text-[16px] font-bold uppercase text-black dark:text-white">Destination Address</h2>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase">PAKISTAN LOGISTICS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Province / Territory *
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-3 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="ICT">Islamabad Capital Territory</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Major City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-3 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Area / Sector / Phase *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. DHA Phase 6, Gulberg III, F-7/2"
                    required
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 54000"
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['JetBrains_Mono'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Complete Street Address & Premise Details *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="Building name, Floor, Apartment or House number"
                    required
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Delivery Instructions / Prominent Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Opposite Main Roundabout / Call before delivery"
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white placeholder:text-[#71717A] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Fulfillment Courier */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">SECTION_03</span>
                  <h2 className="font-['Space_Grotesk'] text-[16px] font-bold uppercase text-black dark:text-white">Fulfillment Channel</h2>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase">2–3 BUSINESS DAYS</span>
              </div>

              <div className="bg-[#F4F4F5] dark:bg-[#18181B] border border-black dark:border-white p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Space_Grotesk'] text-[14px] font-bold text-black dark:text-white uppercase">
                      Tracked Courier (Nationwide Express Air)
                    </span>
                    <span className="font-['Inter'] text-[12px] text-[#71717A]">
                      TCS / Leopards Insured Delivery. High-value tamper-evident hardware packing included.
                    </span>
                  </div>
                </div>
                <span className="font-['Space_Grotesk'] text-[12px] font-bold text-black dark:text-white uppercase">FREE</span>
              </div>
            </div>

            {/* Section 4: Cash on Delivery Payment Mode */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">SECTION_04</span>
                  <h2 className="font-['Space_Grotesk'] text-[16px] font-bold uppercase text-black dark:text-white">Payment Protocol</h2>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase">DOORSTEP SETTLEMENT</span>
              </div>

              <div className="bg-[#F4F4F5] dark:bg-[#18181B] border border-black dark:border-white p-4 rounded-xl flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-black dark:bg-white flex items-center justify-center mt-1 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-['Space_Grotesk'] text-[15px] font-bold text-black dark:text-white uppercase">
                      Cash on Delivery (COD)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black text-white dark:bg-[#27272A] font-['JetBrains_Mono'] text-[10px] uppercase font-bold">
                      ZERO SURCHARGE
                    </span>
                  </div>
                  <p className="font-['Inter'] text-[13px] text-[#71717A] leading-relaxed">
                    Pay in cash directly to the courier rider upon package arrival at your doorstep. Physical parcel inspection allowed before handing over payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Master Place Order Submit */}
            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className={`w-full py-4 px-6 rounded-xl font-['Space_Grotesk'] text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                submitting || cartItems.length === 0
                  ? 'bg-[#F4F4F5] dark:bg-[#18181B] text-[#71717A] cursor-not-allowed border border-[#E4E4E7] dark:border-[#27272A]'
                  : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
              }`}
            >
              <Icon className="text-[20px]">lock</Icon>
              <span>{submitting ? 'RESERVING INVENTORY...' : 'PLACE ORDER (CASH ON DELIVERY)'}</span>
            </button>
          </form>

          {/* Right Column: Order Manifest Ledger (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
                <h3 className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white uppercase">Order Manifest</h3>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">{cartItems.length} UNITS</span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="bg-[#F4F4F5] dark:bg-[#18181B] p-3 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] flex items-center gap-3">
                    <div className="w-14 h-14 bg-white dark:bg-[#09090B] rounded p-1 flex items-center justify-center shrink-0 border border-[#E4E4E7] dark:border-[#27272A]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-black dark:text-white truncate">{item.title}</span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Qty: {item.qty} • SKU: {item.sku}</span>
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-black dark:text-white mt-0.5">
                        Rs. {(item.pricePKR * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="bg-[#F4F4F5] dark:bg-[#18181B] p-4 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] flex flex-col gap-2 font-['Inter'] text-[13px]">
                <div className="flex justify-between text-[#71717A]">
                  <span>Subtotal</span>
                  <span className="font-['JetBrains_Mono'] text-black dark:text-white font-bold">Rs. {grossTotalPKR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#71717A]">
                  <span>Insured Express Shipping</span>
                  <span className="font-['JetBrains_Mono'] text-black dark:text-white font-bold uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-[#71717A]">
                  <span>Cash Collection Fee (COD)</span>
                  <span className="font-['JetBrains_Mono'] text-black dark:text-white">Rs. 0</span>
                </div>
                <div className="h-px bg-[#E4E4E7] dark:bg-[#27272A] my-1"></div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white">Total Payable</span>
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold text-black dark:text-white">
                    Rs. {grossTotalPKR.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-2 pt-1 font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
                <div className="flex items-center gap-2">
                  <Icon className="text-[16px] text-black dark:text-white">verified</Icon>
                  <span>100% Factory Sealed & Genuine Imports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="text-[16px] text-black dark:text-white">published_with_changes</Icon>
                  <span>7-Day Replacement Inspection Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
