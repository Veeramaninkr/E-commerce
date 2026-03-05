"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { fetchOrdersRequest, updateOrderRequest, deleteOrderRequest } from '@/store/order/action';
import {
    Package,
    User,
    Mail,
    Phone,
    MapPin,
    Hash,
    Edit2,
    Trash2,
    X,
    CheckCircle,
    Clock,
    Truck,
    ChevronRight,
    Search,
    CircleOff,
    Eye,
} from 'lucide-react';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { orders, loading, error, meta } = useSelector((state: RootState) => state.order);
    const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.login);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
    const [isViewBannerOpen, setIsViewBannerOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Form State
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_number: '',
        address: '',
        pincode: '',
        status: ''
    });
    // Debounce search to avoid too many API calls
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            dispatch(fetchOrdersRequest(1, limit, {
                search: value || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            }));
            setPage(1); // Reset to page 1 on search
        }, 500),
        [limit, statusFilter, dispatch]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    // Authentication Guard
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.replace('/');
            } else if (user?.role !== 'admin') {
                router.replace('/client/home');
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    useEffect(() => {
        // Initial load and filter/pagination changes
        // This effect runs for initial fetch, page changes, and status filter updates
        dispatch(fetchOrdersRequest(page, limit, {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: search || undefined
        }));
    }, [dispatch, page, limit, statusFilter]);

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Synchronizing Logistics Hub...</p>
                </div>
            </div>
        );
    }

    const handleEditClick = (order: any) => {
        setSelectedOrder(order);
        setFormData({
            user_name: order.user_name,
            user_email: order.user_email,
            user_number: order.user_number,
            address: order.address,
            pincode: order.pincode,
            status: order.status
        });
        setIsEditBannerOpen(true);
    };

    const handleViewClick = (order: any) => {
        setSelectedOrder(order);
        setIsViewBannerOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOrder) {
            dispatch(updateOrderRequest(selectedOrder.id || selectedOrder._id, formData));
            setIsEditBannerOpen(false);
        }
    };

    const handleDelete = (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            dispatch(deleteOrderRequest(orderId));
        }
    };

    // Since the API now handles filtering, we can use the orders from state directly.
    // We keep the variable name to avoid changing the JSX.
    const filteredOrders = orders;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            case 'cancelled': return <Trash2 size={16} />;
            default: return <Package size={16} />;
        }
    };

    return (
        <div className="animate-in fade-in duration-700 min-h-screen bg-[#fafafa] p-4 md:p-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Order Hub</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Tracking {filteredOrders.length} active shipments</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            className="h-14 px-6 bg-white border border-gray-100 rounded-2xl focus:border-gray-900 outline-none transition-all shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] text-xs font-black tracking-widest uppercase appearance-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">ALL STATUS</option>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            <ChevronRight size={14} className="rotate-90" />
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-gray-900 transition-colors duration-300" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH SHIPMENTS..."
                            className="w-full md:w-96 h-14 pl-14 pr-6 bg-white border border-gray-100 rounded-2xl focus:border-gray-900 outline-none transition-all shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] text-xs font-black tracking-widest uppercase placeholder:text-gray-300"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>


            {/* Error Message */}
            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 font-bold text-red-600">!</div>
                    <p className="text-sm font-semibold">{error}</p>
                </div>
            )}

            {/* Orders Table Container */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Package Cargo</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Route Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Net Total</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Settings</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {loading && orders.length === 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8">
                                            <div className="h-4 bg-gray-50 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <CircleOff size={64} className="text-gray-400" />
                                            <p className="text-gray-900 font-bold uppercase tracking-widest text-sm">No results found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order: any) => (

                                    <tr key={order.id || order._id} className="hover:bg-gray-50/50 transition-all duration-300 group border-b border-gray-50 last:border-0">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-gray-200 group-hover:scale-105 transition-transform duration-500">
                                                    {order.user_name?.[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0 gap-1">
                                                    <span className="text-sm font-black text-gray-900 tracking-tight uppercase">{order.user_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <span className="text-[9px] bg-gray-50 border border-gray-100 text-gray-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">x{item.quantity}</span>
                                                        <span className="text-xs text-gray-600 font-bold uppercase tracking-tight truncate max-w-[140px]">{item.name}</span>
                                                    </div>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <span className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1">+{order.items.length - 2} Additional Entries</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <Mail size={12} className="text-gray-300" />
                                                    {order.user_email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-900 font-black uppercase tracking-tighter">
                                                    <MapPin size={12} className="text-indigo-500" />
                                                    <span className="truncate max-w-[180px]">{order.address}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-black text-gray-900 tracking-tighter">
                                                ${parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${getStatusColor(order.status)}`}>
                                                <span className="opacity-60">{getStatusIcon(order.status)}</span>
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                <button
                                                    onClick={() => handleViewClick(order)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Eye size={16} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(order)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id || order._id)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))

                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {meta && meta.total_pages > 1 && (
                <div className="mt-8 flex items-center justify-between bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Page {meta.current_page} of {meta.total_pages} — {meta.total_items} Total Items
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="h-10 px-4 bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= meta.total_pages}
                            onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))}
                            className="h-10 px-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Banner / Sidebar */}
            <AnimatePresence>
                {isEditBannerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditBannerOpen(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-40"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Editor Console</p>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Modify Shipment</h2>
                                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">Order Ticket: {selectedOrder?.id || selectedOrder?._id || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditBannerOpen(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:scale-110 active:scale-95 rounded-2xl transition-all shadow-sm"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>


                            <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-10 space-y-12">
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        Customer Identity
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Usage Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black uppercase tracking-tight text-sm"
                                                value={formData.user_name}
                                                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Registry Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] text-gray-400 font-bold text-xs uppercase tracking-widest outline-none transition-all"
                                                    value={formData.user_email}
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Dial</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm"
                                                    value={formData.user_number}
                                                    onChange={(e) => setFormData({ ...formData, user_number: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        Logistics Routing
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination Address</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-medium text-xs leading-relaxed resize-none"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Zip / Pincode</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm uppercase"
                                                    value={formData.pincode}
                                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Dispatch State</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black uppercase tracking-tight appearance-none text-xs"
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-gray-400">
                                                        <ChevronRight size={16} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>


                                <div className="pt-8 border-t border-gray-100 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditBannerOpen(false)}
                                        className="flex-1 h-14 border border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-50 transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 h-14 bg-gray-900 hover:bg-black text-white px-10 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}

                {/* View Banner / Sidebar */}
                {isViewBannerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsViewBannerOpen(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-40"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Logistics Intel</p>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Shipment Analytics</h2>
                                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">Order Ticket: {selectedOrder?.id || selectedOrder?._id || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => setIsViewBannerOpen(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:scale-110 active:scale-95 rounded-2xl transition-all shadow-sm"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                {/* Order Status Section */}
                                <section>
                                    <div className={`p-6 rounded-[24px] border flex items-center justify-between ${getStatusColor(selectedOrder?.status || '')}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur flex items-center justify-center">
                                                {getStatusIcon(selectedOrder?.status || '')}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Deployment State</p>
                                                <p className="text-lg font-black uppercase tracking-tight">{selectedOrder?.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Customer Section */}
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        Consignee Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-gray-50 rounded-[20px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{selectedOrder?.user_name}</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-[20px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                                            <p className="text-sm font-black text-gray-900 tracking-tight">{selectedOrder?.user_number}</p>
                                        </div>
                                        <div className="col-span-2 p-6 bg-gray-50 rounded-[20px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registry Email</p>
                                            <p className="text-sm font-bold text-gray-600 lowercase">{selectedOrder?.user_email}</p>
                                        </div>
                                        <div className="col-span-2 p-6 bg-gray-50 rounded-[20px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                                            <p className="text-sm font-bold text-gray-600 leading-relaxed uppercase tracking-tight">{selectedOrder?.address}, {selectedOrder?.pincode}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Items Section */}
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        Cargo Inventory
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedOrder?.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex flex-col gap-3 p-5 bg-white border border-gray-100 rounded-[28px] hover:border-gray-300 transition-all duration-300">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-black text-gray-900 tracking-tight uppercase truncate leading-none">{item.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-none">ID: {item.product_id?.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-400 px-2.5 py-1 rounded-xl font-black uppercase tracking-widest leading-none">x{item.quantity}</span>
                                                        <span className="text-base font-black text-gray-900 tracking-tighter leading-none">${(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Summary Section */}
                                <section className="pt-8 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Synchronized Total</span>
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter">${parseFloat(selectedOrder?.total_amount || 0).toLocaleString()}</span>
                                    </div>
                                </section>
                            </div>

                            <div className="p-10 bg-gray-50/50 border-t border-gray-100">
                                <button
                                    onClick={() => setIsViewBannerOpen(false)}
                                    className="w-full h-16 bg-gray-900 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all"
                                >
                                    Dismiss Record
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrdersPage;
