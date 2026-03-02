"use client"
import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { getRequest } from '@/store/addpro/action'
import { createOrderRequest, addToCart } from '@/store/order/action'
import { RootState } from '@/store/store'
import { ShoppingBag, Star, ArrowRight, Heart, CheckCircle, X, CreditCard, Ship, MapPin, Phone, User as UserIcon, Mail, MessageSquare, Send, Globe } from 'lucide-react'
import { Card, CardBody, CardFooter } from "@heroui/card"
import { Button } from "@heroui/button"
import { Skeleton } from "@heroui/skeleton"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal"
import { Input, Textarea } from "@heroui/input"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import BuyPage from '../buy/page'


function Page() {
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state: RootState) => state.addPro);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.login);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    const router = useRouter();

    const [showToast, setShowToast] = useState(false);
    const [lastAdded, setLastAdded] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    // Checkout Form State
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_number: '',
        address: '',
        pincode: ''
    });

    useEffect(() => {
        dispatch(getRequest(""));
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                user_name: user.name || '',
                user_email: user.email || ''
            }));
        }
    }, [user]);

    const products = Array.isArray(product) ? product : [];

    const handleAddToCart = (p: any) => {
        dispatch(addToCart(p));
        setLastAdded(p.name);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };
    const [buyitem, setBuyItem] = useState<any[]>([]);


    const handleBuyNow = (p: any) => {
        dispatch(addToCart(p));
        router.push("/client/buy");
    }


    const total = buyitem.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    const payload = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_number: formData.user_number,
        address: formData.address,
        pincode: formData.pincode,
        items: buyitem.map((item: any) => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image
        })),
        total_amount: total,
        status: 'Pending'
    };


    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <main className="container mx-auto px-6 pt-10 pb-20">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full rounded-[40px] overflow-hidden mb-20 bg-gray-900 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
                    <img
                        src="https://i.pinimg.com/736x/b3/be/86/b3be86af376edbb6f61043c80e3df3ab.jpg"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                        alt="Summer Collection"
                    />
                    <div className="absolute top-1/2 left-16 -translate-y-1/2 z-20 max-w-xl space-y-6 text-white text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter leading-none uppercase">
                            Welcome to <br />
                            <span className="text-indigo-400">My Page.</span>
                        </h1>
                        <p className="text-gray-300 font-medium text-lg max-w-md uppercase tracking-wider">
                            This is almost almost completed ... viraivil varum...
                        </p>
                        <Button color="primary" size="lg" radius="full" className="px-10 h-16 font-black uppercase tracking-widest text-xs group" endContent={<ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}>
                            Explore Now
                        </Button>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Curated Inventory</p>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Featured Collections</h2>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl mb-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center font-black">!</div>
                        <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Failed to synchronize catalog. {typeof error === 'string' ? error : ''}</p>
                    </div>
                )}

                {/* Product Grid */}
                <div id='product' className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading && products.length === 0 ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="h-[420px] rounded-[32px] overflow-hidden" shadow="sm">
                                <CardBody className="p-0">
                                    <Skeleton className="h-[280px] w-full" />
                                </CardBody>
                                <CardFooter className="flex-col items-start gap-4 p-6">
                                    <Skeleton className="h-4 w-3/4 rounded-full" />
                                    <Skeleton className="h-4 w-1/2 rounded-full" />
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        products.map((p: any) => (
                            <Card key={p.id || p._id} className="group h-[450px] rounded-[32px] border-none bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-3 cursor-pointer">
                                <CardBody className="p-0 overflow-hidden relative">
                                    <div className="absolute top-5 right-5 z-20 space-y-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110 active:scale-95">
                                            <Heart size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                                            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110 active:scale-95 duration-700"
                                        >
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>

                                    {p.offer && (
                                        <div className="absolute top-5 left-5 z-20 px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-lg shadow-lg uppercase tracking-widest">
                                            {p.offer} OFF
                                        </div>
                                    )}

                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-1000">
                                        {p.image_url || p.image ? (
                                            <img
                                                src={p.image_url || p.image}
                                                alt={p.name}
                                                className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f8fafc/64748b?text=Image+Unavailable';
                                                }}
                                            />
                                        ) : (
                                            <ShoppingBag className="text-gray-200" size={64} />
                                        )}
                                    </div>
                                </CardBody>
                                <CardFooter className="flex-col items-start gap-1 p-8 bg-white">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{p.category}</span>

                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors truncate w-full uppercase">{p.name}</h3>
                                    <div className="flex items-center justify-between w-full mt-4">
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">
                                            ${parseFloat(p.price || 0).toLocaleString()}
                                        </p>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            radius="full"
                                            onClick={(e) => { e.stopPropagation(); handleBuyNow(p); }}
                                            className="font-black text-[12px] uppercase tracking-[0.2em] px-8 h-10 shadow-lg shadow-indigo-200 hover:scale-110 transition-transform active:scale-95"
                                        >
                                            Buy
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {!loading && products.length === 0 && (
                    <div className="py-20 flex flex-col items-center gap-6 opacity-30">
                        <ShoppingBag size={80} className="text-gray-400" />
                        <p className="text-gray-900 font-bold uppercase tracking-[0.2em] text-sm">Synchronizing Digital Inventory...</p>
                    </div>
                )}
                {/* About Section */}
                <section id="about" className="py-24 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-indigo-500/5 rounded-[48px] blur-2xl group-hover:bg-indigo-500/10 transition-all duration-700" />
                            <div className="relative h-[600px] w-full rounded-[40px] overflow-hidden shadow-2xl">
                                <img
                                    src="https://i.pinimg.com/1200x/de/d5/3f/ded53f0f51047a7686808d3eb4b4e143.jpg"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt="Our Craft"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Est. 2024</p>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">Define Your Style.</h3>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Vision</p>
                                <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">Crafting Digital <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Excellence</span></h2>
                            </div>

                            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
                                We believe that shopping is more than just a transaction; it's an experience of discovery and self-expression. Our curated collection brings together the pinnacle of design and contemporary aesthetics.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                    <p className="text-3xl font-black text-indigo-600 mb-1">15k+</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Clients</p>
                                </div>
                                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                    <p className="text-3xl font-black text-indigo-600 mb-1">99%</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Satisfaction</p>
                                </div>
                            </div>

                            <Button color="primary" variant="ghost" radius="full" size="lg" className="h-16 px-10 font-black uppercase tracking-widest text-xs border-2">
                                Learn Our Story
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-24">
                    <div className="bg-gray-900 rounded-[60px] p-8 md:p-20 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-1000" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Get in Touch</p>
                                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Let's start <br />something great</h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Email Inquiry</p>
                                            <p className="text-white font-bold tracking-tight">hello@mypage.design</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Voice Support</p>
                                            <p className="text-white font-bold tracking-tight">+91 123 456 7890</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                            <Globe size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Office Location</p>
                                            <p className="text-white font-bold tracking-tight">Creative Plaza, Floor 12, Digital City</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Your Identity</label>
                                        <Input
                                            placeholder="NAME"
                                            variant="flat"
                                            radius="lg"
                                            className="dark"
                                            classNames={{
                                                input: "font-black tracking-widest placeholder:text-gray-600",
                                                inputWrapper: "h-14 bg-white/5 border-white/10 hover:bg-white/10"
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Digital Address</label>
                                        <Input
                                            placeholder="EMAIL"
                                            variant="flat"
                                            radius="lg"
                                            className="dark"
                                            classNames={{
                                                input: "font-black tracking-widest placeholder:text-gray-600",
                                                inputWrapper: "h-14 bg-white/5 border-white/10 hover:bg-white/10"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Your Message</label>
                                    <Textarea
                                        placeholder="HOW CAN WE HELP YOU?"
                                        variant="flat"
                                        radius="lg"
                                        minRows={4}
                                        className="dark"
                                        classNames={{
                                            input: "font-black tracking-widest placeholder:text-gray-600",
                                            inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10"
                                        }}
                                    />
                                </div>

                                <Button color="primary" size="lg" radius="full" className="w-full h-16 font-black uppercase tracking-[0.2em] text-xs group" endContent={<Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />}>
                                    Send Transmission
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Premium Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 bg-gray-900 text-white rounded-[24px] shadow-2xl flex items-center gap-4 min-w-[320px] border border-white/10 backdrop-blur-xl"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                            <CheckCircle size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-[10px] uppercase tracking-widest opacity-60 text-left">Success</span>
                            <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[200px] text-left">{lastAdded} Added</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Checkout Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside" className="bg-white rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="p-0 flex flex-col md:flex-row min-h-[640px]">
                                {/* Summary Side */}
                                <div className="w-full md:w-[40%] bg-gray-50 p-10 flex flex-col">
                                    <div className="mb-10 text-left font-black">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Cart Summary</p>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Your Selection</h3>
                                    </div>

                                    <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2 mb-8">
                                        {buyitem.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-gray-100 shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <p className="text-xs font-black text-gray-900 truncate uppercase">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${item.price} x {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                                            <span className="text-sm font-black text-gray-900">${buyitem.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping</span>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Complimentary</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-6">
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total Pay</span>
                                            <span className="text-2xl font-black text-gray-900 tracking-tighter">${buyitem.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>


                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page;