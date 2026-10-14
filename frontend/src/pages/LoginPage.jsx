import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';

export default function LoginPage({ onNavigate }) {
  const { login, logout } = useAuth();
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    setErrorMsg('');
    setLoginSuccess(false);

    try {
      const user = await login({ email: identifier.trim(), password });
      const requestedPath = location.state?.from?.pathname;
      if (requestedPath?.startsWith('/admin') && user.role !== 'admin') {
        logout();
        setErrorMsg('This account does not have administrator permission.');
        return;
      }

      setLoginSuccess(true);
      const destination = requestedPath || (user.role === 'admin' ? '/admin' : '/');
      routerNavigate(destination, { replace: true });
    } catch (error) {
      setErrorMsg(error.message || 'Unable to sign in. Please try again.');
    }
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
            <Icon className="text-[16px]">arrow_back</Icon>
            <span>Storefront</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] p-8 rounded-2xl shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider font-semibold">
              HARDWARE ACCOUNT ACCESS
            </span>
            <h1 className="font-['Space_Grotesk'] text-[24px] font-bold text-black dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="font-['Inter'] text-[13px] text-[#71717A]">
              Manage configured orders, track nationwide COD dispatch, and access warranty repair tickets.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-100 dark:bg-[#93000A]/30 border border-red-300 dark:border-[#93000A] rounded-lg text-red-700 dark:text-white font-['Inter'] text-[12px] flex items-center gap-2">
              <Icon className="text-[16px] text-red-500">report_problem</Icon>
              <span>{errorMsg}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 bg-black text-white dark:bg-white dark:text-black font-['Space_Grotesk'] font-bold rounded-lg text-[13px] text-center">
              Authentication Verified! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                Email Address *
              </label>
              <div className="relative flex items-center bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg">
                <Icon className="text-[#71717A] text-[18px] ml-3 shrink-0">badge</Icon>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="name@domain.pk"
                  required
                  className="w-full bg-transparent px-3 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#71717A]">
                  Password *
                </label>
                <a href="#forgot" className="font-['Inter'] text-[11px] text-[#71717A] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg">
                <Icon className="text-[#71717A] text-[18px] ml-3 shrink-0">lock</Icon>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-transparent px-3 py-2.5 font-['Inter'] text-[13px] text-black dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-3 text-[#71717A] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <Icon className="text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</Icon>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer mt-2"
            >
              Sign In to Account
            </button>
          </form>

          <div className="text-center font-['Inter'] text-[13px] text-[#71717A] border-t border-[#E4E4E7] dark:border-[#27272A] pt-4">
            <span>New to LAPTOPIA? </span>
            <button
              onClick={() => onNavigate && onNavigate('register')}
              className="text-black dark:text-white font-bold hover:underline cursor-pointer"
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
