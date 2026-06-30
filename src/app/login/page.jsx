'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaRegEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { Spinner } from '@heroui/react'; 

const LoginPage = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // ── Email Login Handler ──
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Failed to login. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      toast.success('Welcome back!');
      router.push('/');
      router.refresh();
      
    } catch (err) {
      toast.error('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  // ── Google Login Handler ──
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/', 
      });

      if (error) {
        toast.error(error.message || 'Failed to initialize Google authentication.');
        setIsGoogleLoading(false);
      }
    } catch (err) {
      toast.error('An unexpected error occurred during Google sign-in.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">
      
      {/* Background Radial Gradient matching your brand color */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#35858E]/10 rounded-full blur-[120px] opacity-80 pointer-events-none -z-10"></div>

      {/* Header Section (Outside the Card) */}
      <div className="w-full max-w-2xl text-center mb-8 z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 uppercase leading-tight">
          <span className="text-[#35858E]">LET'S CONNECT</span><br />
          WITH TICKETGHOR
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-600">
          Seamlessly Enhance The Future Through Our Sphere Technology
        </p>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-neutral-100 p-8 z-10">
        
        {/* Tabs */}
        <div className="flex items-center justify-between gap-2 mb-8 bg-transparent">
          <button type="button" className="flex-1 py-3 px-4 bg-[#35858E]/10 text-[#35858E] border border-[#35858E]/30 rounded-full font-semibold text-sm transition-all text-center">
            Email account
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1 text-slate-700" htmlFor="email">
              Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <FaRegEnvelope size={16} />
              </div>
              <input
                id="email"
                type="email"
                required
                autoFocus
                placeholder="Enter your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border border-gray-200 text-slate-900 rounded-full text-sm transition-all duration-200 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1 text-slate-700" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <FaLock size={16} />
              </div>
              <input
                id="password"
                type={isVisible ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-transparent border border-gray-200 text-slate-900 rounded-full text-sm transition-all duration-200 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E]"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                aria-label="Toggle password visibility"
                className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            
            {/* Forgot Password Link */}
            <div className="flex justify-end mt-1 mr-2">
              <Link 
                href="/forgot-password" 
                className="text-xs font-bold text-slate-500 hover:text-[#35858E] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 py-4 bg-gradient-to-r from-[#42a2ac] to-[#35858E] hover:from-[#35858E] hover:to-[#28666d] text-white font-bold rounded-full shadow-lg shadow-[#35858E]/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner size="sm" color="current" /> : null}
            {isLoading ? 'Signing In...' : 'Sign In Now'}
          </button>
        </form>

        {/* ── Visual Section Divider ── */}
        <div className="relative flex py-4 items-center text-gray-400 my-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-wider text-gray-400 select-none">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* ── Google Integration Button ── */}
        <button
          type="button"
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleLogin}
          className="w-full py-3.5 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 font-bold rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Spinner size="sm" className="text-[#35858E]" />
          ) : (
            <FaGoogle className="text-rose-500" size={16} />
          )}
          <span>Google</span>
        </button>

        {/* Footer Link Inside Card */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Don't have access yet?{' '}
            <Link 
              href="/register" 
              className="font-bold text-[#35858E] hover:text-[#28666d] transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;