import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';

export default function RegisterPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const getStrength = (pass) => {
    if (!pass) return { label: 'EMPTY', color: 'bg-[#D4D4D8] dark:bg-[#27272A]', width: 'w-0' };
    if (pass.length < 6) return { label: 'WEAK', color: 'bg-red-500', width: 'w-1/3' };
    if (pass.length < 10) return { label: 'MEDIUM', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: 'STRONG', color: 'bg-black dark:bg-white', width: 'w-full' };
  };

  const strength = getStrength(formData.password);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    setRegisteredSuccess(true);
    setTimeout(() => {
      if (onNavigate) onNavigate('login');
    }, 1500);
  };

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] min-h-screen py-16 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[18px] font-bold text-black dark:text-white tracking-tight uppercase leading-none">
                LAPTOPIA
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#71717A] tracking-wider uppercase">
                Hardware Access
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="text-[12px] font-['Inter'] text-[#71717A] hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Storefront</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-8 rounded-2xl shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider font-semibold">
              NEW PROFILE PROVISIONING
            </span>
            <h1 className="font-['Space_Grotesk'] text-[24px] font-bold text-black dark:text-white tracking-tight">
              Create LAPTOPIA Account
            </h1>
            <p className="font-['Inter'] text-[13px] text-[#71717A]">
              Register to track nationwide COD shipments, save custom PC configurations, and manage hardware warranties.
            </p>
          </div>

          {registeredSuccess && (
            <div className="p-3 bg-black text-white dark:bg-white dark:text-black font-['Space_Grotesk'] font-bold rounded-lg text-[13px] text-center">
              Account Created Successfully! Redirecting to Sign In...
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Daniyal Tariq"
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="daniyal@example.pk"
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                Mobile Contact (+92 SMS OTP) *
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+92 300 1234567"
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['JetBrains_Mono'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                  Password *
                </label>
                <span className="font-['JetBrains_Mono'] text-[10px] text-black dark:text-white uppercase font-bold">
                  {strength.label}
                </span>
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              <div className="w-full bg-[#E4E4E7] dark:bg-[#27272A] h-1 rounded-full overflow-hidden mt-1">
                <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                  Confirm Password *
                </label>
                {formData.confirmPassword && (
                  <span className={`font-['JetBrains_Mono'] text-[10px] font-bold uppercase ${passwordsMatch ? 'text-black dark:text-white' : 'text-red-500'}`}>
                    {passwordsMatch ? 'MATCHED' : 'NO MATCH'}
                  </span>
                )}
              </div>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg px-4 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer mt-2"
            >
              CREATE ACCOUNT
            </button>
          </form>

          <div className="text-center font-['Inter'] text-[13px] text-[#71717A] border-t border-[#E4E4E7] dark:border-[#27272A] pt-4">
            <span>Already have an account? </span>
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="text-black dark:text-white font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
