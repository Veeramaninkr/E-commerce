"use client"
import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { createOrderRequest } from '@/store/order/action'
import { CheckCircle, MapPin, Phone, User as UserIcon, Wallet, Ship, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function BuyPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.login);
    const { items: cartItems, loading: orderLoading, error: orderError } = useSelector((state: RootState) => state.order);

    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_number: '',
        address: '',
        pincode: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                user_name: user.name || '',
                user_email: user.email || ''
            }));
        }
    }, [user]);

    const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);

    useEffect(() => {
        if (!orderLoading && !orderError && orderComplete && checkoutLoading) {
            setCheckoutLoading(false);
        }
    }, [orderLoading, orderError, orderComplete, checkoutLoading]);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        if (!formData.user_email || !formData.user_email.includes('@')) {
            alert("Please provide a valid member email address.");
            return;
        }

        if (!formData.user_name || !formData.user_number || !formData.address) {
            alert("Please fill in all mandatory delivery information.");
            return;
        }


        setCheckoutLoading(true);

        const payload = {
            user_name: formData.user_name,
            user_email: formData.user_email,
            user_number: formData.user_number,
            address: formData.address,
            pincode: formData.pincode,
            items: cartItems.map((item: any) => ({
                product_id: item.id || item._id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity || 1),
                image_url: item.image || item.image_url
            })),
            total_amount: totalAmount,
            status: 'Pending'
        };

        dispatch(createOrderRequest(payload));
        // We will detect completion via state changes 
        // For now, let's keep it simple and assume success for UI transitions
        // but wait for loading to finish
    };

    // Use a separate effect to handle order completion navigation/state
    useEffect(() => {
        if (checkoutLoading && !orderLoading && !orderError && cartItems.length === 0) {
            setOrderComplete(true);
            setCheckoutLoading(false);
        }
    }, [checkoutLoading, orderLoading, orderError, cartItems]);

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-[#fafafa]">
                <Navbar />
                <main className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-[48px] shadow-2xl shadow-indigo-100 flex flex-col items-center text-center space-y-8 max-w-md border border-indigo-50"
                    >
                        <div className="w-24 h-24 rounded-[32px] bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-100">
                            <CheckCircle size={48} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Order Confirmed</h2>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Your transaction was successful. Reference: #EXP-{Math.floor(Math.random() * 100000)}</p>
                        </div>
                        <Button
                            as={Link}
                            href="/client/home"
                            color="primary"
                            radius="full"
                            className="w-full h-16 bg-gray-900 text-white font-bold uppercase tracking-[0.3em] text-xs rounded-3xl shadow-2xl transition-all duration-500 mt-6 "
                        >
                            Return to Store
                        </Button>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <main className="container mx-auto px-6 py-10 max-w-6xl">
                <div className="flex items-center gap-4 mb-10 group">
                    <Link href="/client/home" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-gray-900 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="text-left font-black">
                        <p className="text-[10px] text-indigo-500 uppercase tracking-[0.4em]">Checkout Stage</p>
                        <h1 className="text-3xl text-gray-900 tracking-tighter uppercase leading-none">Finalize Purchase</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex items-center gap-3 mb-8 text-left">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Delivery Information</h3>
                            </div>

                            {orderError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center font-black">!</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-left">
                                        Transaction Failure: <br />
                                        <span className="text-gray-500 font-bold lowercase">{typeof orderError === 'string' ? orderError : JSON.stringify(orderError)}</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleCheckout} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Name</label>
                                        <Input
                                            variant="flat"
                                            placeholder="FULL NAME"
                                            required
                                            value={formData.user_name}
                                            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                            classNames={{ input: "font-bold", inputWrapper: "bg-gray-50 border-none h-14 rounded-2xl" }}
                                            startContent={<UserIcon size={16} className="text-gray-400" />}
                                        />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                        <Input
                                            variant="flat"
                                            placeholder="+1 (555) 000-0000"
                                            required
                                            value={formData.user_number}
                                            onChange={(e) => setFormData({ ...formData, user_number: e.target.value })}
                                            classNames={{ input: "font-bold", inputWrapper: "bg-gray-50 border-none h-14 rounded-2xl" }}
                                            startContent={<Phone size={16} className="text-gray-400" />}
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Email Address</label>
                                        <Input
                                            variant="flat"
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            required
                                            value={formData.user_email}
                                            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                                            classNames={{ input: "font-bold", inputWrapper: "bg-gray-50 border-none h-14 rounded-2xl" }}
                                            startContent={<UserIcon size={16} className="text-gray-400" />}
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                                        <Input
                                            variant="flat"
                                            placeholder="STREET, BUILDING, APARTMENT"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            classNames={{ input: "font-bold", inputWrapper: "bg-gray-50 border-none h-14 rounded-2xl" }}
                                            startContent={<MapPin size={16} className="text-gray-400" />}
                                        />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Pincode</label>
                                        <Input
                                            variant="flat"
                                            placeholder="000000"
                                            required
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            classNames={{ input: "font-bold", inputWrapper: "bg-gray-50 border-none h-14 rounded-2xl" }}
                                        />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Protocol</label>
                                        <div className="h-14 bg-indigo-50 rounded-2xl flex items-center px-4 border border-indigo-100">
                                            <Wallet size={16} className="text-indigo-600 mr-3" />
                                            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Cash On Payment</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={checkoutLoading || cartItems.length === 0}
                                    className={`w-full h-16 bg-gray-900 text-white font-bold uppercase tracking-[0.3em] text-xs rounded-3xl shadow-2xl transition-all duration-500 mt-6 ${checkoutLoading ? 'opacity-70' : 'hover:bg-black hover:scale-[1.02]'}`}
                                    startContent={checkoutLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Ship size={18} />}
                                >
                                    {checkoutLoading ? 'Processing Authorization...' : 'Confirm Order'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-900 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-100/50 flex flex-col min-h-[500px]">
                            <div className="mb-10 text-left">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Items Summary</p>
                                <h3 className="text-2xl font-black tracking-tighter uppercase">Your Selections</h3>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2 mb-8 max-h-[400px]">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 opacity-30 gap-4">
                                        <ShoppingBag size={48} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Empty Portfolio</p>
                                    </div>
                                ) : (
                                    cartItems.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center group">
                                            <div className="w-20 h-20 rounded-2xl bg-white/5 p-3 border border-white/10 shrink-0 group-hover:bg-white/10 transition-colors">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain filter brightness-125" />
                                            </div>
                                            <div className="min-w-0 flex-1 text-left">
                                                <p className="text-xs font-black text-white truncate uppercase tracking-tight">{item.name}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">${item.price} x {item.quantity}</p>
                                                    <p className="text-xs font-black text-white">${(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronized Total</span>
                                    <span className="text-3xl font-black tracking-tighter">${totalAmount.toLocaleString()}</span>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default BuyPage