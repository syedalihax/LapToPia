import React, { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function SupportPage({ onNavigate }) {
  const settings = useStoreSettings();
  const whatsappLink = `https://wa.me/${(settings.whatsappPhone || '').replace(/\D/g, '')}`;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    category: 'Order Status & COD Verification',
    message: ''
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  const faqs = [
    {
      q: "How does Cash on Delivery (COD) verification work across Pakistan?",
      a: "TCS and Leopards couriers verify parcel integrity at your doorstep. Cash is collected directly upon physical handover. Before dispatch, our team contacts you via phone call or WhatsApp to confirm delivery details."
    },
    {
      q: "What is covered under the 7-Day Replacement Policy?",
      a: "Factory defects, unboxing verification anomalies, hardware component failures, and thermal defects verified via benchmark logs are eligible for an immediate direct unit replacement or full store credit within 7 calendar days of courier receipt."
    },
    {
      q: "Can I schedule an in-person benchmark inspection?",
      a: "Yes. Clients may visit our Lahore facility (Suite 402, Precision Tech Tower, Gulberg III) or Karachi pickup center to inspect machines running Cinebench, 3DMark, or Blender benchmarks before finalized handover and payment."
    },
    {
      q: "How long does nationwide express transit take?",
      a: "Standard delivery spans 24 hours within Lahore and Islamabad/Rawalpindi, and 2 to 3 business days for Karachi, Peshawar, Quetta, Multan, Faisalabad, and other regions across Pakistan via priority air express consignments."
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] text-[#71717A]">
          <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-black dark:text-white font-medium">Contact Us & Support</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="font-['JetBrains_Mono'] text-[11px] text-black dark:text-[#FAFAFA] bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] px-3 py-1 rounded uppercase tracking-wider font-semibold w-max">
            CLIENT CONCIERGE & ENTERPRISE RMA
          </span>
          <h1 className="font-['Space_Grotesk'] text-[32px] sm:text-[42px] font-bold text-black dark:text-white uppercase tracking-tight">
            Contact {settings.storeName}
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#71717A] leading-relaxed">
            Direct technical assistance, order tracking verification, and warranty inquiries. Contact our team using the current phone, email, and facility details below.
          </p>
        </div>

        {/* 4 Contact Coordinate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Direct Helpline */}
          <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] flex items-center justify-center text-black dark:text-white mb-4">
                <Icon className="text-[20px]">call</Icon>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A] tracking-wider block mb-1">
                Direct Helpline
              </span>
              <a href={`tel:${settings.supportPhone}`} className="font-['Space_Grotesk'] text-[18px] font-bold text-black dark:text-white hover:underline block mb-1">
                {settings.supportPhone}
              </a>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] block">Call our support team</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] font-['Inter'] text-[12px] text-[#71717A]">
              Mon – Sat: 11:00 AM – 9:00 PM PKT
            </div>
          </div>

          {/* Card 2: Official Email */}
          <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] flex items-center justify-center text-black dark:text-white mb-4">
                <Icon className="text-[20px]">alternate_email</Icon>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A] tracking-wider block mb-1">
                Official Electronic Mail
              </span>
              <a href={`mailto:${settings.supportEmail}`} className="font-['Space_Grotesk'] text-[16px] font-bold text-black dark:text-white hover:underline block truncate mb-1">
                {settings.supportEmail}
              </a>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] block">Official support email</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] font-['Inter'] text-[12px] text-[#71717A]">
              Average response within 3 hours
            </div>
          </div>

          {/* Card 3: Tech Lab & Walk-in */}
          <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] flex items-center justify-center text-black dark:text-white mb-4">
                <Icon className="text-[20px]">storefront</Icon>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A] tracking-wider block mb-1">
                Tech Lab & Walk-in Counter
              </span>
              <p className="font-['Space_Grotesk'] text-[14px] font-bold text-black dark:text-white leading-tight mb-1">
                {settings.lahoreAddress || 'Lahore facility address not configured'}
              </p>
              <span className="font-['Inter'] text-[12px] text-[#71717A] block">Karachi: {settings.warehouseAddress || 'Address not configured'}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] font-['Inter'] text-[12px] text-[#71717A]">
              In-person benchmark bays open
            </div>
          </div>

          {/* Card 4: WhatsApp Concierge */}
          <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F4F4F5] dark:bg-[#18181B] flex items-center justify-center text-[#25D366] mb-4">
                <Icon className="text-[20px]">chat</Icon>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A] tracking-wider block mb-1">
                Direct WhatsApp Stream
              </span>
              <p className="font-['Space_Grotesk'] text-[18px] font-bold text-black dark:text-white block mb-1">
                {settings.whatsappPhone || 'WhatsApp number not configured'}
              </p>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] block">Fast Dispatch Tracking</span>
            </div>
            <div className="mt-4 pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black rounded font-['Space_Grotesk'] text-[11px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <Icon className="text-[16px]">arrow_outward</Icon>
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form & Schematic Map 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 sm:p-8 rounded-xl flex flex-col gap-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-black dark:text-white uppercase">
                  Direct Dispatch & Support Ticket
                </h2>
                <p className="font-['Inter'] text-[13px] text-[#71717A]">
                  Fill in the technical parameters of your request for direct routing.
                </p>
              </div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] bg-[#F4F4F5] dark:bg-[#18181B] px-2 py-1 rounded">
                ROUTER: PK-CENTRAL
              </span>
            </div>

            {ticketSubmitted ? (
              <div className="p-8 bg-[#F4F4F5] dark:bg-[#18181B] rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-center flex flex-col items-center gap-3">
                <Icon className="text-[42px] text-black dark:text-white">check_circle</Icon>
                <h3 className="font-['Space_Grotesk'] text-[20px] font-bold text-black dark:text-white">
                  Ticket Dispatched Successfully!
                </h3>
                <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
                  Reference #TKT-{Math.floor(1000 + Math.random() * 9000)} generated. Our hardware desk will verify your inquiry shortly via phone or WhatsApp.
                </p>
                <button
                  onClick={() => setTicketSubmitted(false)}
                  className="mt-2 px-5 py-2 bg-black text-white dark:bg-white dark:text-black font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded cursor-pointer"
                >
                  Submit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.pk"
                      required
                      className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                      Mobile Contact (PK Network) *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                      required
                      className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['JetBrains_Mono'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Inquiry Classification *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-3 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Order Status & COD Verification">Order Status & COD Verification (TCS / Leopards)</option>
                    <option value="Warranty & Replacement">Warranty & 7-Day Replacement Claim</option>
                    <option value="Custom Rig Assembly">Custom Rig Assembly & High-TGP Consultation</option>
                    <option value="General Hardware Inquiry">General Hardware Specification Question</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                    Technical Specification / Message *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide relevant order ID #LP-XXXXX or hardware specifications..."
                    required
                    className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg p-3 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto self-start px-8 py-3 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                >
                  <span>Submit Support Ticket</span>
                  <Icon className="text-[16px]">send</Icon>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Schematic Map & Operating Hours (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A] tracking-wider block">
                    HARDWARE FACILITY
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-[18px] font-bold text-black dark:text-white">
                    {settings.lahoreAddress || 'Lahore facility address not configured'}
                  </h3>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] bg-[#F4F4F5] dark:bg-[#18181B] px-2 py-1 rounded">
                  FACILITY ADDRESS
                </span>
              </div>

              {/* Schematic Vector Map Simulation */}
              <div className="relative w-full h-56 bg-[#F4F4F5] dark:bg-[#0E0E10] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full opacity-30 text-[#71717A]" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="1" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="currentColor" strokeWidth="2" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="currentColor" strokeWidth="1" />
                  <line x1="120" y1="0" x2="120" y2="250" stroke="currentColor" strokeWidth="2" />
                  <line x1="260" y1="0" x2="260" y2="250" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"></div>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-black dark:text-white bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] px-2 py-0.5 rounded shadow mt-1">
                    {settings.storeName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 font-['JetBrains_Mono'] text-[11px] text-[#71717A] pt-1">
                <div className="flex justify-between">
                  <span>Landmark:</span>
                  <span className="text-black dark:text-white">{settings.warehouseAddress || 'Not configured'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Walk-in Benchmarking:</span>
                  <span className="text-black dark:text-white">12:00 PM – 8:00 PM Daily</span>
                </div>
              </div>
            </div>

            {/* Nationwide Dispatch Protocol */}
            <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-6 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Icon className="text-[20px] text-black dark:text-white">verified</Icon>
                <h4 className="font-['Space_Grotesk'] text-[15px] font-bold text-black dark:text-white uppercase">
                  National Fulfillment Protocol (PK)
                </h4>
              </div>
              <p className="font-['Inter'] text-[13px] text-[#71717A] leading-relaxed">
                All Cash on Delivery consignments are packed with serialized anti-tamper security tape. Customers receive real-time TCS or Leopards tracking notifications immediately following telephone confirmation.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-['JetBrains_Mono'] text-[11px]">
                <div className="bg-[#F4F4F5] dark:bg-[#18181B] p-2.5 rounded border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[#71717A] block">Same-Day Cutoff:</span>
                  <span className="text-black dark:text-white font-bold">04:30 PM PKT</span>
                </div>
                <div className="bg-[#F4F4F5] dark:bg-[#18181B] p-2.5 rounded border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[#71717A] block">Transit Insurance:</span>
                  <span className="text-black dark:text-white font-bold">100% Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <div className="text-center">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-widest block mb-1">
              CLEAR OPERATIONAL TERMS
            </span>
            <h2 className="font-['Space_Grotesk'] text-[26px] font-bold text-black dark:text-white uppercase">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-black dark:text-white font-['Space_Grotesk'] text-[15px] font-bold hover:bg-[#F4F4F5] dark:hover:bg-[#18181B] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <Icon className="text-[18px] text-[#71717A]">{activeFaq === idx ? 'remove' : 'add'}</Icon>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 font-['Inter'] text-[13px] text-[#71717A] leading-relaxed border-t border-[#E4E4E7] dark:border-[#27272A] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
