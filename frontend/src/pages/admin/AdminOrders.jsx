import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon.jsx';
import InvoiceModal from '../../components/InvoiceModal.jsx';
import { apiRequest } from '../../utils/api.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusError, setStatusError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    apiRequest('/api/orders')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setOrders(d.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setStatusError('');
    try {
      const res = await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
      } else {
        setStatusError(data.error || 'Could not update this order status.');
      }
    } catch (err) {
      setStatusError(err.message || 'Could not update this order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = orders.filter(o => o.orderStatus === 'DELIVERED').reduce((sum, o) => sum + (Number(o.grossTotalPKR) || 0), 0);
  const inTransitCount = orders.filter(o => o.orderStatus === 'IN_TRANSIT').length;
  const pendingCount = orders.filter(o => o.orderStatus === 'PENDING_COD').length;

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
            FULFILLMENT REGISTRY // CASH ON DELIVERY ESCROW
          </span>
          <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
            Orders & Shipments Console
          </h1>
          <p className="font-['Inter'] text-[13px] text-[#71717A]">
            Real-time customer delivery dispatches, courier handover status, and live Order Status Changer.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-[#121215] hover:bg-[#18181B] border border-[#27272A] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Icon className="text-[16px]">sync</Icon>
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#71717A] uppercase">Total Orders</span>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">{orders.length} Units</span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Nationwide deliveries</span>
        </div>

        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#71717A] uppercase">Collected Revenue</span>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">
              Rs. {totalRevenue.toLocaleString()}
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Delivered orders only</span>
        </div>

        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#71717A] uppercase">Pending COD Dispatch</span>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">{pendingCount} Orders</span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">Awaiting rider handover</span>
        </div>

        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#71717A] uppercase">In Transit (TCS / Leopards)</span>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">{inTransitCount} Air Cargo</span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">In flight or road express</span>
        </div>
      </div>

      {/* Orders Table */}
      {statusError && <div role="alert" className="rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">{statusError}</div>}
      <div className="bg-[#09090B] border border-[#27272A] rounded-xl overflow-hidden shadow-xl flex flex-col">
        {loading ? (
          <div className="p-16 text-center text-[#71717A] font-['JetBrains_Mono'] text-[13px]">
            Loading transaction orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <Icon className="text-[42px] text-[#71717A]">local_shipping</Icon>
            <h3 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">No Orders Placed Yet</h3>
            <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
              When customers checkout with Cash on Delivery on the storefront, their order manifest will appear here with live status modification controls.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter'] text-[13px]">
              <thead className="bg-[#121215] text-[#71717A] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer Profile</th>
                  <th className="py-3 px-5">Destination Address</th>
                  <th className="py-3 px-5">Hardware Items</th>
                  <th className="py-3 px-5 text-right">Total (PKR)</th>
                  <th className="py-3 px-5">Live Order Status Changer</th>
                  <th className="py-3 px-5 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] font-['JetBrains_Mono'] text-[12px] text-white">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-[#121215] transition-colors">
                    <td className="py-3.5 px-5 font-bold">{order.orderNumber}</td>
                    <td className="py-3.5 px-5">
                      <div className="text-white font-medium">{order.customer?.fullName}</div>
                      <div className="text-[#71717A] text-[11px]">{order.customer?.phone}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="text-white">{order.customer?.city}, {order.customer?.province}</div>
                      <div className="text-[#71717A] text-[11px] max-w-xs truncate">{order.customer?.streetAddress}</div>
                    </td>
                    <td className="py-3.5 px-5 max-w-xs truncate">
                      {order.items?.map(it => `${it.title} (x${it.qty})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-5 text-right font-['Space_Grotesk'] text-[14px] font-bold">
                      Rs. {Number(order.grossTotalPKR).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5">
                      {/* Live Status Changer Dropdown */}
                      <select
                        value={order.orderStatus || 'PENDING_COD'}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`bg-[#18181B] border rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase cursor-pointer focus:outline-none transition-colors ${
                          order.orderStatus === 'DELIVERED'
                            ? 'border-green-500 text-green-400'
                            : order.orderStatus === 'IN_TRANSIT'
                            ? 'border-yellow-500 text-yellow-400'
                            : order.orderStatus === 'CANCELLED'
                            ? 'border-red-500 text-red-400'
                            : order.orderStatus === 'RETURNED'
                            ? 'border-purple-500 text-purple-300'
                            : 'border-[#3F3F46] text-white'
                        }`}
                      >
                        <option value="PENDING_COD">Pending COD</option>
                        <option value="IN_TRANSIT">In Transit (TCS)</option>
                        <option value="DELIVERED">Delivered & Collected</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RETURNED">Returned</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="p-1.5 rounded hover:bg-[#18181B] text-white transition-colors cursor-pointer"
                        title="Print / View Invoice"
                      >
                        <Icon className="text-[18px]">receipt_long</Icon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal Preview */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
}
