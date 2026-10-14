import React from 'react';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function InvoiceModal({ order, onClose }) {
  const settings = useStoreSettings();
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="invoice-modal-overlay" className="fixed inset-0 z-[80] bg-[#09090B]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="invoice-modal-panel bg-[#121215] border border-[#3F3F46] w-full max-w-3xl max-h-[96vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Controls */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#27272A] px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 font-['JetBrains_Mono'] text-[10px] text-[#A1A1AA] sm:text-xs">
            <Icon className="text-[16px]">receipt_long</Icon>
            <span className="truncate">OFFICIAL TRANSACTION RECEIPT</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-2 bg-white text-black hover:bg-neutral-200 rounded font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
            >
              <Icon className="text-[16px]">print</Icon>
              <span className="hidden sm:inline">Print / Save PDF</span><span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-white rounded hover:bg-[#18181B] transition-colors"
            >
              <Icon className="text-[20px]">close</Icon>
            </button>
          </div>
        </div>

        {/* Printable Section */}
        <div id="printable-invoice" className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-4 bg-[#09090B] p-4 text-[#FAFAFA] sm:gap-6 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4 sm:pb-6">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[20px] font-bold tracking-tight text-white leading-none">
                  {settings.storeName}
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] tracking-widest uppercase mt-0.5">
                  Hardware Lab PK • Tax Invoice
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:text-right font-['JetBrains_Mono'] text-[12px]">
              <span className="text-white font-bold text-[14px]">{order.orderNumber}</span>
              <span className="text-[#71717A]">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                <span className="text-[#71717A]">{settings.supportPhone}</span>
            </div>
          </div>

          {/* Customer & Logistics Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-['JetBrains_Mono'] text-[11px] sm:text-[12px]">
            <div className="bg-[#121215] p-3 rounded border border-[#27272A]">
              <span className="text-[#71717A] text-[10px] uppercase block mb-1">Delivered To:</span>
              <div className="font-bold text-white text-[13px]">{order.customer?.fullName}</div>
              <div className="text-[#A1A1AA] mt-0.5">{order.customer?.streetAddress}</div>
              <div className="text-[#A1A1AA]">{order.customer?.area ? `${order.customer.area}, ` : ''}{order.customer?.city}, {order.customer?.province}</div>
              <div className="text-white font-bold mt-1">Contact: {order.customer?.phone}</div>
            </div>

            <div className="bg-[#121215] p-3 rounded border border-[#27272A]">
              <span className="text-[#71717A] text-[10px] uppercase block mb-1">Settlement & Logistics:</span>
              <div className="flex justify-between py-0.5">
                <span className="text-[#71717A]">Payment Mode:</span>
                <span className="text-white font-bold">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#71717A]">Fulfillment:</span>
                <span className="text-white">TCS Insured Express</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#71717A]">Status:</span>
                <span className="px-1.5 py-0.2 bg-[#27272A] text-white rounded text-[10px] uppercase font-bold">
                  {order.orderStatus || 'PENDING_COD'}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="invoice-items-table hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[520px] text-left font-['Inter'] text-[13px]">
              <thead>
                <tr className="bg-[#18181B] text-[#71717A] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] font-['JetBrains_Mono'] text-[12px]">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-[#71717A] text-[11px]">{item.sku}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-white">{item.qty}</td>
                    <td className="py-3 px-3 text-right text-[#A1A1AA]">
                      Rs. {Number(item.pricePKR || item.unitPricePKR).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-white font-bold">
                      Rs. {(Number(item.pricePKR || item.unitPricePKR) * Number(item.qty)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="invoice-items-mobile flex flex-col gap-2 sm:hidden">
            {order.items?.map((item, idx) => {
              const unitPrice = Number(item.pricePKR || item.unitPricePKR);
              return (
                <article key={idx} className="rounded-lg border border-[#27272A] bg-[#121215] p-3">
                  <div className="break-words text-sm font-semibold text-white">{item.title}</div>
                  {item.sku && <div className="mt-0.5 text-[10px] text-[#A1A1AA]">SKU: {item.sku}</div>}
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-[#A1A1AA]">
                    <span>Qty <strong className="block text-white">{item.qty}</strong></span>
                    <span>Each <strong className="block text-white">Rs. {unitPrice.toLocaleString()}</strong></span>
                    <span className="text-right">Total <strong className="block text-white">Rs. {(unitPrice * Number(item.qty)).toLocaleString()}</strong></span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Financial Summary */}
          <div className="flex flex-col items-end gap-1 font-['JetBrains_Mono'] text-[12px] pt-3 border-t border-[#27272A]">
            <div className="flex w-full max-w-xs justify-between gap-4 text-[#A1A1AA]">
              <span>Hardware Subtotal:</span>
              <span className="text-white">Rs. {Number(order.grossTotalPKR).toLocaleString()}</span>
            </div>
            <div className="flex w-full max-w-xs justify-between gap-4 text-[#A1A1AA]">
              <span>Nationwide Freight:</span>
              <span className="text-white font-bold uppercase">FREE</span>
            </div>
            <div className="flex w-full max-w-xs justify-between gap-4 text-[#A1A1AA]">
              <span>COD Handling Fee:</span>
              <span className="text-white">Rs. 0</span>
            </div>
            <div className="flex w-full max-w-xs justify-between gap-4 pt-2 border-t border-[#3F3F46] font-['Space_Grotesk'] text-[16px] font-bold text-white">
              <span>Total Payable:</span>
              <span>Rs. {Number(order.grossTotalPKR).toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="bg-[#121215] p-3 rounded text-[11px] text-[#71717A] font-['JetBrains_Mono'] leading-relaxed border border-[#27272A]">
            <p><strong>Inspection Guarantee:</strong> Verify physical security tape and serial numbers at your doorstep before handing over cash to the courier representative. Handover inquiry hotline: {settings.supportPhone}.</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="invoice-modal-actions flex shrink-0 items-center justify-end gap-3 border-t border-[#27272A] px-4 py-3 sm:px-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded bg-[#18181B] hover:bg-[#27272A] text-white font-['Space_Grotesk'] text-[11px] sm:text-[13px] uppercase font-bold transition-colors"
          >
            Close Receipt
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-['Space_Grotesk'] text-[11px] sm:text-[13px] uppercase font-bold transition-colors flex items-center gap-1.5"
          >
            <Icon className="text-[16px]">print</Icon>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
