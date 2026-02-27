"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { signupRequest } from '@/store/login/action'
import { useRouter } from 'next/navigation'

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold dark:text-orange-500 text-center mb-6">SIGNUP</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <label htmlFor="name" className=' h-10 text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Name</label> <br />
                <input
                    className="border border-gray-300 h-10 p-2 rounded-lg w-full mb-4"
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                /> <br />

                <label htmlFor="email" className=' h-10 text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Email</label> <br />
                <input
                    className="border border-gray-300 h-10 p-2 rounded-lg w-full mb-4"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> <br />
                <label htmlFor="password" className=' h-10 text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Password</label> <br />
                <input
                    className="border border-gray-300 h-10 p-2 rounded-lg w-full mb-6"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />

                <label htmlFor="password" className=' h-10 text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1'> Confirm Password</label> <br />
                <input
                    className="border border-gray-300 h-10 p-2 rounded-lg w-full mb-6"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />

                <button
                    className={`w-full h-14 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-gray-200 transition-all duration-300 flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Signup'}
                </button> <br />

                <p className="text-center mt-4">
                    Already have an account? <Link href="/" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
