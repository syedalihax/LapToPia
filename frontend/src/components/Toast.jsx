import React from 'react';
import Icon from './Icon.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Toast() {
  const { toast } = useCart();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className="bg-[#18181B] border border-[#3F3F46] text-[#FAFAFA] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center shrink-0">
          <Icon className="text-[16px] font-bold">check</Icon>
        </div>
        <div className="flex flex-col">
          <span className="font-['Space_Grotesk'] text-[14px] font-semibold tracking-wide">
            {toast.message}
          </span>
          <span className="text-[11px] text-[#71717A] font-['JetBrains_Mono']">
            Review items in your shopping bag
          </span>
        </div>
      </div>
    </div>
  );
}
