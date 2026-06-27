'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaRegEnvelope, FaLock, FaRegUser } from 'react-icons/fa';
import { Button, Spinner } from '@heroui/react'; 

const RegisterPage = () => {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      toast.success('Account created successfully!');
      router.push('/login'); 
      router.refresh();
      
    } catch (err) {
      toast.error('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">
      
      {/* Background Radial Gradient matching your brand color */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#35858E]/10 rounded-full blur-[120px] opacity-80 pointer-events-none -z-10"></div>

      {/* Header Section (Outside the Card) */}
      <div className="w-full max-w-2xl text-center mb-8 z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight  uppercase leading-tight">
          <span className="text-[#35858E]">JOIN THE FUTURE</span><br />
          WITH TICKETGHOR
        </h1>
        <p className="mt-4 text-lg  font-medium">
          Create your account and unlock seamless experiences
        </p>
      </div>

      {/* Register Card Container */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border  p-8 z-10">
        
        {/* Form Section */}
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          
          {/* Full Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold  ml-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4  pointer-events-none">
                <FaRegUser size={16} />
              </div>
              <input
                id="name"
                type="text"
                required
                autoFocus
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border  rounded-full text-sm transition-all duration-200 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E]"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold  ml-1" htmlFor="email">
              Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4  pointer-events-none">
                <FaRegEnvelope size={16} />
              </div>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border rounded-full text-sm  transition-all duration-200 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold  ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4  pointer-events-none">
                <FaLock size={16} />
              </div>
              <input
                id="password"
                type={isVisible ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-transparent border  rounded-full text-sm  transition-all duration-200 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E]"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                aria-label="Toggle password visibility"
                className="absolute right-4 focus:outline-none transition-colors"
              >
                {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <p className="text-xs ml-2 mt-1">Must be at least 6 characters.</p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 py-4 bg-gradient-to-r from-[#42a2ac] to-[#35858E] hover:from-[#35858E] hover:to-[#28666d] text-white font-bold rounded-full shadow-lg shadow-[#35858E]/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? <Spinner size="sm" color="current" /> : null}
            {isLoading ? 'Creating Account...' : 'Sign Up Now'}
          </Button>
        </form>

        {/* Footer Link Inside Card */}
        <div className="mt-8 text-center">
          <p className="text-sm  font-medium">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-bold text-[#35858E] hover:text-[#28666d] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Copyright Footer (Outside Card) */}
      <div className="mt-10 text-center z-10">
        <p className="text-sm  font-medium">
          Copyright © {new Date().getFullYear()} TicketGhor. All Rights Reserved.
        </p>
      </div>

    </div>
  );
};

export default RegisterPage;