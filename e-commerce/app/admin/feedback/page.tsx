"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchFeedbackRequest } from '@/store/feedback/action';
import {
    MessageSquare,
    User,
    Mail,
    Tag,
    Hash,
    AlertCircle,
    Loader2,
    Search,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AdminFeedbackPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { feedbacks, loading, error } = useSelector((state: any) => state.feedback);
    const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.login);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            dispatch(fetchFeedbackRequest());
        }
    }, [dispatch, isAuthenticated, user]);

    const isLoading = loading && (!feedbacks || feedbacks.length === 0);

    const filteredFeedbacks = (feedbacks || []).filter((f: any) =>
        f.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        f.complaint?.toLowerCase().includes(search.toLowerCase()) ||
        f.user_email?.toLowerCase().includes(search.toLowerCase()) ||
        f.order_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-700 min-h-screen bg-[#fafafa] p-4 md:p-12">
            {isLoading ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Feedback Archives...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <button
                                onClick={() => router.back()}
                                className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors duration-300 font-bold uppercase tracking-widest text-[10px]"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                                Go Back
                            </button>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Customer Feedback</h1>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Reviewing {filteredFeedbacks.length} submitted complaints</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="text-gray-400 group-focus-within:text-gray-900 transition-colors duration-300" size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="SEARCH COMPLAINTS..."
                                    className="w-full md:w-96 h-14 pl-14 pr-6 bg-white border border-gray-100 rounded-2xl focus:border-gray-900 outline-none transition-all shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] text-xs font-black tracking-widest uppercase placeholder:text-gray-300"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-700 rounded-[28px] shadow-sm flex items-center gap-4 animate-in slide-in-from-top-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle size={20} className="text-red-600" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    {/* Feedback Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredFeedbacks.length === 0 ? (
                                <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-sm opacity-60">
                                    <MessageSquare size={64} className="text-gray-200 mb-6" />
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Complaints Detected</h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 px-12 text-center">Your customer base is either perfectly satisfied or your search filters are too restrictive.</p>
                                </div>
                            ) : (
                                filteredFeedbacks.map((feedback: any, index: number) => (
                                    <motion.div
                                        key={feedback.id || feedback._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-white rounded-[32px] border border-gray-100 p-8 hover:border-indigo-200 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className="relative z-10">
                                            {/* Header Section */}
                                            <div className="flex flex-col gap-4">
                                                <div className="space-y-3">
                                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-tight line-clamp-2">
                                                        {feedback.product_name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl w-fit">
                                                        <Hash size={10} className="text-gray-400" />
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">ORDER ID: {feedback.order_id?.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Complaint Content */}
                                            <div className="mt-8 p-6 bg-gray-50/50 rounded-[24px] border border-gray-50 group-hover:bg-white group-hover:border-indigo-50 transition-all duration-500 min-h-[100px]">
                                                <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
                                                    "{feedback.complaint}"
                                                </p>
                                            </div>

                                            {/* User Info */}
                                            <div className="pt-6 border-t border-gray-50 mt-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                        <User size={14} />
                                                    </div>
                                                    <p className="text-xs font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                        {feedback.user_email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminFeedbackPage;
