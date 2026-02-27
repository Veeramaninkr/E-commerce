"use client";
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Loader2, Package, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequest, removeRequest } from '@/store/addpro/action';
import { RootState } from '@/store/store';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { updateRequest } from '@/store/addpro/action';


const View = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const { product, loading, error } = useSelector((state: RootState) => state.addPro);
    const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.login);
    const [search, setSearch] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    // Fetch products on component mount
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: '',
        offer: ''
    });

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
        dispatch(getRequest("")); // Pass empty string to get all products
    }, [dispatch]);

    if (loading && (!product || product.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Scanning Inventory Archives...</p>
                </div>
            </div>
        );
    }
    const handleEditClick = (product: any) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image: product.image,
            offer: product.offer
        });
    };
    const handleEdit = (p: any) => {
        console.log("Edit product:", p);
        setSelectedProduct(p);
        setIsEditModalOpen(true);
    };
    const handleUpdate = (p: any) => {
        console.log("Update product:", p);
        dispatch(updateRequest(p));
        setIsEditModalOpen(false);
    };
    const handleDelete = (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        dispatch(removeRequest(id));
    };

    // Filter products based on search
    const products = Array.isArray(product) ? product : [];
    const filteredProducts = products.filter((p: any) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-700 min-h-screen bg-[#fafafa] p-4 md:p-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Inventory Management</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Collections</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Manage your catalog of {filteredProducts.length} items</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-gray-900 transition-colors duration-300" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH COLLECTIONS..."
                            className="w-full md:w-96 h-14 pl-14 pr-6 bg-white border border-gray-100 rounded-2xl focus:border-gray-900 outline-none transition-all shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] text-xs font-black tracking-widest uppercase placeholder:text-gray-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-red-600">!</span>
                    </div>
                    <p className="text-sm font-semibold">{typeof error === 'string' ? error : 'An error occurred while fetching products.'}</p>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Item Preview</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Price Unit</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Availability</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Promotion</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Settings</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6">
                                            <div className="h-10 bg-gray-50 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Package size={64} className="text-gray-300" />
                                            <p className="text-gray-500 font-medium">No products found in the database.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p: any) => (
                                    <tr key={p.id || p._id} className="hover:bg-gray-50/50 transition-all duration-300 group border-b border-gray-50 last:border-0">
                                        <td className="px-8 py-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                                                {p.image ? (
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <Package className="text-gray-200" size={24} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-gray-900 tracking-tight uppercase">{p.name}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">REF: {(p.id || p._id || '').slice(-8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="inline-flex px-3 py-1 rounded-full bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:bg-gray-100 transition-colors">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-black text-gray-900 tracking-tighter">
                                                ${parseFloat(p.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${p.stock > 10 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                                    <span className={`text-xs font-black tracking-tight ${p.stock > 10 ? 'text-gray-900' : 'text-orange-600'}`}>
                                                        {p.stock} UNITS
                                                    </span>
                                                </div>
                                                <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${p.stock > 10 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                                                        style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            {p.offer ? (
                                                <div className="inline-flex px-3 py-1 rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                                                    {p.offer} OFF
                                                </div>
                                            ) : (
                                                <span className="text-gray-200 text-xs font-black">—</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                <button
                                                    onClick={() => handleEditClick(p)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id || p._id)}
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

                {/* Footer / Pagination Placeholder */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-medium">
                            Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> products
                        </p>
                    </div>
                )}
            </div>
            <AnimatePresence>
                {isEditModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
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
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Modify Product</h2>
                                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">Entry ID: {selectedProduct?._id || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:scale-110 active:scale-95 rounded-2xl transition-all shadow-sm"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>


                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedProduct); }} className="flex-1 overflow-y-auto p-10 space-y-12">
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        Core Specifications
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black uppercase tracking-tight text-sm placeholder:text-gray-200"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Group</label>
                                                <input
                                                    type="text"
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] text-gray-400 font-bold text-xs uppercase tracking-widest outline-none transition-all"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Price ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        Inventory & Assets
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Thumbnail Source URL</label>
                                            <textarea
                                                required
                                                rows={2}
                                                className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-medium text-xs leading-relaxed resize-none"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Count</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Promo Offer</label>
                                                <input
                                                    type="text"
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm uppercase placeholder:text-gray-200"
                                                    placeholder="EX: 20%"
                                                    value={formData.offer}
                                                    onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>


                                <div className="pt-8 border-t border-gray-100 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
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
            </AnimatePresence>
        </div>
    );
};

export default View;
