"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { signupRequest } from '@/store/login/action'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User } from 'lucide-react'

function Signup() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, signupSuccess } = useSelector((state: any) => state.login || {});

    useEffect(() => {
        if (signupSuccess) {
            router.push("/client/home");
        }
    }, [signupSuccess, router]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = () => {
        if (!name || !email || !password) return;
        dispatch(signupRequest({ name, email, password }));
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-black flex items-center justify-center p-6 text-left">
            <div className="w-full max-w-[440px]">
                {/* Branding Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 transition-transform hover:scale-105 duration-300">
                        <User className="text-indigo-600 w-8 h-8" size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Registration</p>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Sign Up</h1>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white w-full p-8 rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-gray-100">
                    <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">!</div>
                                {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-bold"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-16 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl shadow-gray-200 transition-all duration-300 flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>Create Member Account</span>
                            )}
                        </button>

                        <div className="pt-6 border-t border-gray-50 text-center">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                Already a member? <Link href="/" className="text-indigo-600 hover:underline ml-1">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        Data secured with industry protocols
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
