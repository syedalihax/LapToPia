import React, { useState, useEffect } from 'react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setCustomers(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      <div>
        <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
          CUSTOMER DIRECTORY // METRO CLUSTERS
        </span>
        <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
          Customer Accounts & Lifetime Value
        </h1>
        <p className="font-['Inter'] text-[13px] text-[#71717A]">
          Registered customer accounts, Pakistani geographic distribution, and accumulated order volume.
        </p>
      </div>

      {/* Regional Stack Bar (Solid, strictly NO pulsing dots) */}
      <div className="bg-[#09090B] border border-[#27272A] p-6 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-['Space_Grotesk'] text-[14px] font-bold text-white uppercase">
            Regional Buyer Distribution
          </span>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">PAKISTAN METRO HUBS</span>
        </div>

        <div className="w-full h-3 bg-[#18181B] rounded-full overflow-hidden flex">
          <div className="bg-white h-full" style={{ width: '48%' }} title="Karachi 48%"></div>
          <div className="bg-[#A1A1AA] h-full" style={{ width: '32%' }} title="Lahore 32%"></div>
          <div className="bg-[#71717A] h-full" style={{ width: '14%' }} title="Islamabad 14%"></div>
          <div className="bg-[#3F3F46] h-full" style={{ width: '6%' }} title="Other 6%"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-['JetBrains_Mono'] text-[12px]">
          <div className="bg-[#121215] p-3 rounded border border-[#27272A]">
            <span className="text-[#71717A] block">Karachi Hub:</span>
            <span className="text-white font-bold text-[14px]">48% (Sindh)</span>
          </div>
          <div className="bg-[#121215] p-3 rounded border border-[#27272A]">
            <span className="text-[#71717A] block">Lahore Hub:</span>
            <span className="text-white font-bold text-[14px]">32% (Punjab)</span>
          </div>
          <div className="bg-[#121215] p-3 rounded border border-[#27272A]">
            <span className="text-[#71717A] block">Islamabad / RWP:</span>
            <span className="text-white font-bold text-[14px]">14% (ICT)</span>
          </div>
          <div className="bg-[#121215] p-3 rounded border border-[#27272A]">
            <span className="text-[#71717A] block">Other Cities:</span>
            <span className="text-white font-bold text-[14px]">6% (Overland)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#09090B] border border-[#27272A] rounded-xl overflow-hidden shadow-xl flex flex-col">
        {loading ? (
          <div className="p-16 text-center text-[#71717A] font-['JetBrains_Mono'] text-[13px]">
            Loading customer repository...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter'] text-[13px]">
              <thead className="bg-[#121215] text-[#71717A] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Customer Profile</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Orders</th>
                  <th className="py-3 px-5 text-right">Total Spent (PKR)</th>
                  <th className="py-3 px-5">Account Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] font-['JetBrains_Mono'] text-[12px] text-white">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-[#121215] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="text-white font-medium">{c.name}</div>
                      <div className="text-[#71717A] text-[11px]">{c.email} • {c.phone}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="text-white">{c.city}, {c.province}</div>
                      <div className="text-[#71717A] text-[11px] max-w-xs truncate">{c.address}</div>
                    </td>
                    <td className="py-3.5 px-5 font-bold">{c.ordersCount || 0} orders</td>
                    <td className="py-3.5 px-5 text-right font-['Space_Grotesk'] font-bold text-[14px]">
                      Rs. {Number(c.totalSpentPKR || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded bg-[#18181B] border border-[#3F3F46] text-white text-[10px] font-bold uppercase">
                        {c.tier || 'RETAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
