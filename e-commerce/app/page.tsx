"use client";
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginRequest } from '@/store/login/action'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User } from 'lucide-react'
import { RootState } from '@/store/store'


function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.login);
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/client/home');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginRequest({ email, password }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center dark:bg-black justify-center p-6">
      <div className="w-full max-w-[440px]">
        {/* Logo or Branding Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 transition-transform hover:scale-105 duration-300">
            <User className="text-indigo-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Login</h1>
        </div>

        <div className="login-card bg-white w-full p-8 rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">!</div>
                {typeof error === 'string' ? error : 'Authentication failed. Please try again.'}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  suppressHydrationWarning
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suppressHydrationWarning
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium"
                />

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className={`w-full h-14 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-gray-200 transition-all duration-300 flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 dark:text-black  border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Lock size={12} />
                  </div>
                </>
              )}
            </button>
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-xs font-semibold">
                New here? <Link href="/admin/signup" className="text-blue-600 hover:underline transition-colors ml-1 font-black">Create Account</Link>
              </p>
            </div>
          </form>
        </div>


        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Secure connection encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;