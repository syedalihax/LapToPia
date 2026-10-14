import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon.jsx';
import { apiRequest } from '../../utils/api.js';

export default function AdminOverview({ onNavigateToTab, onOpenProductDrawer }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiRequest('/api/orders')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setOrders(d.data);
      });

    apiRequest('/api/products')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setProducts(d.data);
      });
  }, []);

  const collectedRevenue = orders
    .filter(order => order.orderStatus === 'DELIVERED')
    .reduce((sum, order) => sum + (Number(order.grossTotalPKR) || 0), 0);
  const lowStockProducts = products.filter(p => p.stockQuantity <= 3);

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Top Console Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09090B] border border-[#27272A] p-6 rounded-xl shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            <span>CONSOLE</span>
            <span>/</span>
            <span>OVERVIEW</span>
            <span>/</span>
            <span className="text-white font-bold">OPERATIONS</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-[24px] font-bold text-white tracking-tight uppercase">
            Mission Operations Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('orders')}
            className="px-4 py-2 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-white text-[12px] font-['Space_Grotesk'] font-bold uppercase rounded-lg transition-colors cursor-pointer"
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={onOpenProductDrawer}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-[12px] font-['Space_Grotesk'] font-bold uppercase rounded-lg transition-colors cursor-pointer"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717A] font-['Space_Grotesk'] text-[11px] font-bold uppercase">
            <span>Collected Revenue (PKR)</span>
            <Icon className="text-[18px]">payments</Icon>
          </div>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">
              Rs. {collectedRevenue.toLocaleString()}
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            Delivered orders only
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717A] font-['Space_Grotesk'] text-[11px] font-bold uppercase">
            <span>Total Orders Placed</span>
            <Icon className="text-[18px]">local_shipping</Icon>
          </div>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">
              {orders.length} Orders
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            Cash on Delivery nationwide
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717A] font-['Space_Grotesk'] text-[11px] font-bold uppercase">
            <span>Active Catalog SKUs</span>
            <Icon className="text-[18px]">inventory_2</Icon>
          </div>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">
              {products.length} Products
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            Available in the store
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717A] font-['Space_Grotesk'] text-[11px] font-bold uppercase">
            <span>Low Stock Items</span>
            <Icon className="text-[18px] text-yellow-500">warning</Icon>
          </div>
          <div className="my-2">
            <span className="font-['Space_Grotesk'] text-[26px] font-bold text-yellow-400">
              {lowStockProducts.length} Items
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
            Threshold ≤ 3 units on hand
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#09090B] border border-[#27272A] rounded-xl overflow-hidden shadow-lg flex flex-col">
        <div className="p-5 flex items-center justify-between border-b border-[#27272A]">
          <div className="flex items-center gap-3">
            <Icon className="text-white text-[20px]">shopping_bag</Icon>
            <h3 className="font-['Space_Grotesk'] text-[16px] font-bold text-white uppercase">
              Recent Customer Orders
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-[12px] font-['Space_Grotesk'] text-white hover:underline uppercase font-bold cursor-pointer"
          >
            View All Orders →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-[#71717A] font-['JetBrains_Mono'] text-[13px]">
            No customer orders placed yet. When a user checks out with COD, orders will display here with live status updates.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter'] text-[13px]">
              <thead className="bg-[#121215] text-[#71717A] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer Coordinates</th>
                  <th className="py-3 px-5">Hardware Units</th>
                  <th className="py-3 px-5">Total (PKR)</th>
                  <th className="py-3 px-5">Payment / Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] font-['JetBrains_Mono'] text-[12px] text-white">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="hover:bg-[#121215] transition-colors">
                    <td className="py-3.5 px-5 font-bold">{o.orderNumber}</td>
                    <td className="py-3.5 px-5">
                      <div className="text-white font-medium">{o.customer?.fullName}</div>
                      <div className="text-[#71717A] text-[11px]">{o.customer?.city} • {o.customer?.phone}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      {o.items?.map(it => `${it.title} (x${it.qty})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-5 font-bold font-['Space_Grotesk'] text-[14px]">
                      Rs. {Number(o.grossTotalPKR).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded bg-[#18181B] border border-[#3F3F46] text-white uppercase text-[10px] font-bold">
                        {o.orderStatus || 'PENDING_COD'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical Inventory Restock Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Icon className="text-yellow-500 text-[20px]">warning</Icon>
            <h3 className="font-['Space_Grotesk'] text-[15px] font-bold text-white uppercase">
              Critical Low Stock Thresholds ({lowStockProducts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className="bg-[#121215] border border-[#27272A] p-4 rounded-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[13px] font-bold text-white truncate max-w-[180px]">{p.title}</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">SKU: {p.sku}</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold px-2 py-0.5 rounded bg-[#18181B] border border-yellow-500 text-yellow-400">
                  {p.stockQuantity} Left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
