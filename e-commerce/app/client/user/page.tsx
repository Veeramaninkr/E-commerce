"use client";
import React from 'react';
import { Navbar } from '@/components/navbar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logoutRequest } from '@/store/login/action';
import { User, Mail, Phone, MapPin, Edit2, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from "@heroui/button";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardBody } from "@heroui/card";

function Page() {
    const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.login);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Verifying Session...</p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        dispatch(logoutRequest());
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <main className="container mx-auto px-6 pt-10 pb-20">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors duration-300 font-bold uppercase tracking-widest text-[10px] mb-4"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            Go Back
                        </button>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Account</h1>
                        {user?.name && (
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Logged in as {user.name}</p>
                        )}
                    </div>
                </div>

                {/* Profile Card */}
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white rounded-[40px] shadow-2xl border-none overflow-hidden">
                        <CardBody className="p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Profile Info */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-lg">
                                            <User size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{user?.name || 'N/A'}</h3>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Customer</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                                            <Mail className="text-indigo-500" size={24} />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                                <p className="text-base font-bold text-gray-900 uppercase tracking-widest">{user?.email || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                                            <Phone className="text-indigo-500" size={24} />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                                <p className="text-base font-bold text-gray-900 uppercase tracking-widest">{user?.phone || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {user?.address && (
                                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                                                <MapPin className="text-indigo-500 mt-0.5" size={24} />
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Address</p>
                                                    <p className="text-base font-bold text-gray-900 uppercase tracking-widest">{user.address}</p>
                                                    {user.pincode && (
                                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{user.pincode}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-6">
                                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                                        <h4 className="text-lg font-black text-indigo-900 uppercase tracking-tighter mb-4">Account Actions</h4>
                                        <div className="space-y-3">
                                            <Button
                                                fullWidth
                                                variant="light"
                                                size="lg"
                                                radius="full"
                                                className="h-14 font-black uppercase tracking-widest text-sm bg-white hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-all"
                                                startContent={<Edit2 size={20} />}
                                            >
                                                Edit Profile
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="light"
                                                size="lg"
                                                radius="full"
                                                className="h-14 font-black uppercase tracking-widest text-sm bg-white hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-all"
                                                startContent={<Edit2 size={20} />}
                                            >
                                                Change Password
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="light"
                                                size="lg"
                                                radius="full"
                                                className="h-14 font-black uppercase tracking-widest text-sm bg-white hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-all"
                                                startContent={<LogOut size={20} />}
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-4">Security</h4>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Your account is secured with industry-standard encryption.</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default Page;