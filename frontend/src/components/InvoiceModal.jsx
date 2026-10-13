import React from 'react';
import Logo from './Logo.jsx';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090B]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-[#3F3F46] max-w-2xl w-full rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] text-[#71717A]">
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>OFFICIAL TRANSACTION RECEIPT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 rounded font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-white rounded hover:bg-[#18181B] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Section */}
        <div id="printable-invoice" className="flex flex-col gap-6 bg-[#09090B] p-6 rounded-lg border border-[#27272A] text-[#FAFAFA]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[20px] font-bold tracking-tight text-white leading-none">
                  LAPTOPIA
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] tracking-widest uppercase mt-0.5">
                  Hardware Lab PK • Tax Invoice
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:text-right font-['JetBrains_Mono'] text-[12px]">
              <span className="text-white font-bold text-[14px]">{order.orderNumber}</span>
              <span className="text-[#71717A]">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
              <span className="text-[#71717A]">NTN: 7492810-4 | STRN: 3277876120193</span>
            </div>
          </div>

          {/* Customer & Logistics Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-['JetBrains_Mono'] text-[12px]">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter'] text-[13px]">
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

          {/* Financial Summary */}
          <div className="flex flex-col items-end gap-1 font-['JetBrains_Mono'] text-[12px] pt-3 border-t border-[#27272A]">
            <div className="flex justify-between w-64 text-[#71717A]">
              <span>Hardware Subtotal:</span>
              <span className="text-white">Rs. {Number(order.grossTotalPKR).toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-64 text-[#71717A]">
              <span>Nationwide Freight:</span>
              <span className="text-white font-bold uppercase">FREE</span>
            </div>
            <div className="flex justify-between w-64 text-[#71717A]">
              <span>COD Handling Fee:</span>
              <span className="text-white">Rs. 0</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-[#3F3F46] font-['Space_Grotesk'] text-[16px] font-bold text-white">
              <span>Total Payable:</span>
              <span>Rs. {Number(order.grossTotalPKR).toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="bg-[#121215] p-3 rounded text-[11px] text-[#71717A] font-['JetBrains_Mono'] leading-relaxed border border-[#27272A]">
            <p><strong>Inspection Guarantee:</strong> Verify physical security tape and serial numbers at your doorstep before handing over cash to the courier representative. Handover inquiry hotline: +92 300 0000000.</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded bg-[#18181B] hover:bg-[#27272A] text-white font-['Space_Grotesk'] text-[13px] uppercase font-bold transition-colors"
          >
            Close Receipt
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-['Space_Grotesk'] text-[13px] uppercase font-bold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
