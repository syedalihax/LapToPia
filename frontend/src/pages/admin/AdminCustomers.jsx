import React, { useRef, useState, useEffect } from 'react';
import Icon from '../../components/Icon.jsx';
import { apiRequest, parseApiResponse } from '../../utils/api.js';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [error, setError] = useState('');
  const customerRequestId = useRef(0);

  useEffect(() => {
    apiRequest('/api/customers')
      .then(parseApiResponse)
      .then(result => setCustomers(Array.isArray(result.data) ? result.data : []))
      .catch(loadError => setError(loadError.message || 'Unable to load customers.'))
      .finally(() => setLoading(false));
  }, []);

  const openCustomer = async customer => {
    const requestId = ++customerRequestId.current;
    setSelectedCustomer(null);
    setCustomerLoading(true);
    setError('');
    try {
      const result = await parseApiResponse(await apiRequest(`/api/customers/${customer.id}`));
      if (customerRequestId.current === requestId) setSelectedCustomer(result.data);
    } catch (loadError) {
      if (customerRequestId.current === requestId) setError(loadError.message || 'Unable to load customer details.');
    } finally {
      if (customerRequestId.current === requestId) setCustomerLoading(false);
    }
  };

  const closeCustomer = () => {
    customerRequestId.current += 1;
    setSelectedCustomer(null);
    setCustomerLoading(false);
  };

  const cityCounts = customers.reduce((counts, customer) => {
    const city = customer.city || 'Unknown';
    counts[city] = (counts[city] || 0) + 1;
    return counts;
  }, {});
  const cityDistribution = Object.entries(cityCounts).sort((left, right) => right[1] - left[1]).slice(0, 4);

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      <div>
        <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
          CUSTOMER DIRECTORY // METRO CLUSTERS
        </span>
          <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
          Customer Accounts & Order Revenue
        </h1>
        <p className="font-['Inter'] text-[13px] text-[#71717A]">
          Registered customer accounts, Pakistani geographic distribution, and accumulated order volume.
        </p>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-200">{error}</div>}

      {/* Live customer city distribution */}
      <div className="bg-[#09090B] border border-[#27272A] p-6 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-['Space_Grotesk'] text-[14px] font-bold text-white uppercase">
            Customer City Distribution
          </span>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">BASED ON CUSTOMER RECORDS</span>
        </div>

        <div className="w-full h-3 bg-[#18181B] rounded-full overflow-hidden flex">
          {cityDistribution.map(([city, count], index) => <div key={city} className={['bg-white', 'bg-[#A1A1AA]', 'bg-[#71717A]', 'bg-[#52525B]'][index]} style={{ width: `${(count / Math.max(1, customers.length)) * 100}%` }} title={`${city}: ${count}`} />)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-['JetBrains_Mono'] text-[12px]">
          {cityDistribution.map(([city, count]) => <div key={city} className="bg-[#121215] p-3 rounded border border-[#27272A]"><span className="text-[#A1A1AA] block">{city}</span><span className="text-white font-bold text-[14px]">{count} customer{count === 1 ? '' : 's'}</span></div>)}
          {customers.length === 0 && <p className="col-span-full text-sm text-[#A1A1AA]">No customer location data yet.</p>}
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
                  <th className="py-3 px-5">Customer Profile (select for details)</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Orders</th>
                  <th className="py-3 px-5 text-right">Collected Revenue (PKR)</th>
                  <th className="py-3 px-5 text-right">Total Order Value (PKR)</th>
                  <th className="py-3 px-5">Account Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] font-['JetBrains_Mono'] text-[12px] text-white">
                {customers.map(c => (
                  <tr key={c.id} onClick={() => openCustomer(c)} className="cursor-pointer hover:bg-[#121215] transition-colors" tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') openCustomer(c); }}>
                    <td className="py-3.5 px-5">
                      <div className="text-white font-medium">{c.name}</div>
                      <div className="text-[#71717A] text-[11px]">{c.email} • {c.phone}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="text-white">{c.city}, {c.province}</div>
                      <div className="text-[#71717A] text-[11px] max-w-xs truncate">{c.address}</div>
                    </td>
                    <td className="py-3.5 px-5 font-bold">{c.orderCount || 0} orders</td>
                    <td className="py-3.5 px-5 text-right font-['Space_Grotesk'] font-bold text-[14px]">
                      Rs. {Number(c.totalSpentPKR || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-right font-['Space_Grotesk'] font-bold text-[14px]">
                      Rs. {Number(c.totalOrderValuePKR || 0).toLocaleString()}
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

      {(customerLoading || selectedCustomer) && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/70 backdrop-blur-sm" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeCustomer(); }}>
          <section role="dialog" aria-modal="true" aria-label="Customer order details" className="h-full w-full max-w-3xl overflow-y-auto border-l border-[#3F3F46] bg-[#09090B] p-5 text-white shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Customer order history</p><h2 className="mt-1 text-2xl font-bold">{selectedCustomer?.name || 'Loading customer…'}</h2></div>
              <button onClick={closeCustomer} aria-label="Close customer details" className="rounded-lg border border-[#52525B] p-2 text-[#D4D4D8] hover:bg-[#27272A]"><Icon>close</Icon></button>
            </div>
            {customerLoading ? <div className="py-16 text-center text-[#D4D4D8]">Loading customer and order history…</div> : selectedCustomer && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#3F3F46] bg-[#121215] p-4 text-sm sm:grid-cols-2">
                  <p><span className="text-[#A1A1AA]">Email:</span> {selectedCustomer.email || '—'}</p><p><span className="text-[#A1A1AA]">Phone:</span> {selectedCustomer.phone || '—'}</p>
                  <p><span className="text-[#A1A1AA]">Location:</span> {selectedCustomer.city || '—'}, {selectedCustomer.province || '—'}</p><p><span className="text-[#A1A1AA]">Address:</span> {selectedCustomer.address || '—'}</p>
                  <p className="sm:col-span-2"><span className="text-[#A1A1AA]">Last order:</span> {selectedCustomer.lastOrderAt ? new Date(selectedCustomer.lastOrderAt).toLocaleString() : 'No orders recorded'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Metric label="All orders" value={selectedCustomer.orderCount} />
                  <Metric label="Delivered" value={selectedCustomer.orderCounts?.DELIVERED || 0} />
                  <Metric label="Pending" value={selectedCustomer.orderCounts?.PENDING_COD || 0} />
                  <Metric label="Shipping" value={selectedCustomer.orderCounts?.IN_TRANSIT || 0} />
                  <Metric label="Cancelled" value={selectedCustomer.orderCounts?.CANCELLED || 0} />
                  <Metric label="Returned" value={selectedCustomer.orderCounts?.RETURNED || 0} />
                  <Metric label="Collected revenue" value={`Rs. ${Number(selectedCustomer.deliveredRevenuePKR || 0).toLocaleString()}`} />
                  <Metric label="Total order value (all statuses)" value={`Rs. ${Number(selectedCustomer.totalOrderValuePKR || 0).toLocaleString()}`} />
                  <Metric label="Open/booked value" value={`Rs. ${Number(selectedCustomer.bookedOrderValuePKR || 0).toLocaleString()}`} />
                </div>
                <div className="overflow-x-auto rounded-xl border border-[#3F3F46]">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-[#18181B] text-xs uppercase text-[#D4D4D8]"><tr><th className="p-3">Order</th><th className="p-3">Date</th><th className="p-3">Items</th><th className="p-3">Status</th><th className="p-3 text-right">Total</th></tr></thead>
                    <tbody className="divide-y divide-[#3F3F46]">{selectedCustomer.orders?.map(order => <tr key={order.id}><td className="p-3 font-semibold">{order.orderNumber}</td><td className="p-3 text-[#D4D4D8]">{new Date(order.createdAt).toLocaleDateString()}</td><td className="max-w-xs truncate p-3 text-[#D4D4D8]">{order.items?.map(item => `${item.title} × ${item.qty}`).join(', ')}</td><td className="p-3">{order.orderStatus}</td><td className="p-3 text-right font-bold">Rs. {Number(order.grossTotalPKR || 0).toLocaleString()}</td></tr>)}</tbody>
                  </table>
                  {!selectedCustomer.orders?.length && <p className="p-6 text-center text-[#D4D4D8]">No orders found for this customer.</p>}
                </div>
                <p className="text-xs text-[#A1A1AA]">Collected revenue counts DELIVERED orders only; cancelled and returned orders are excluded. Open/booked value excludes cancelled and returned orders.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-xl border border-[#3F3F46] bg-[#121215] p-4"><span className="block text-xs text-[#A1A1AA]">{label}</span><strong className="mt-1 block break-words text-lg">{value}</strong></div>;
}
