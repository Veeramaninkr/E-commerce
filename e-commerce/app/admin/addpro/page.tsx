"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { addRequest, uploadImageRequest } from '@/store/addpro/action';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ArrowRight, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';

const AddProduct = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { loading, error, addSuccess, uploading, uploadedImageUrl } = useSelector((state: RootState) => state.addPro);
    const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.login);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [rating, setRating] = useState("");
    const [discount, setDiscount] = useState("");


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
        if (addSuccess) {
            setName("");
            setPrice("");
            setDescription("");
            setImage("");
            setCategory("");
            setStock("");
            setRating("");
            setDiscount("");
        }
    }, [addSuccess]);

    useEffect(() => {
        if (uploadedImageUrl) {
            setImage(uploadedImageUrl);
        }
    }, [uploadedImageUrl]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert("Only PNG, JPG, WEBP, and GIF formats are allowed.");
            return;
        }

        dispatch(uploadImageRequest(file));
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    const handleAddProduct = () => {
        if (!name || !price || !category) {
            alert("Please fill in all required fields (Name, Price, Category)");
            return;
        }

        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert("Price must be a valid number greater than 0");
            return;
        }

        const payload = {
            name,
            price: priceValue,
            description,
            image_url: image,
            category,
            stock: parseInt(stock) || 0,
            offer: discount
        };
        dispatch(addRequest(payload))
    }

    return (
        <div className="animate-in fade-in duration-700 min-h-screen bg-[#fafafa] p-4 md:p-1">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">New Product</h1>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Register a new asset to the catalog</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-12 p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0 font-black text-red-600 shadow-sm transition-transform hover:rotate-12">!</div>
                        <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{typeof error === 'string' ? error : 'Failed to synchronize with registry.'}</p>
                    </div>
                )}

                {addSuccess && (
                    <div className="mb-12 p-6 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-3xl shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 font-black text-emerald-600 shadow-sm transition-transform hover:scale-110"><CheckCircle size={18} /></div>
                        <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Product Successfully Registered</p>
                    </div>
                )}

                <div className="bg-white rounded-[40px] border border-gray-100 p-10 md:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.03)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative">
                        {/* Basic Info Section */}


                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Product Title *</label>
                            <input
                                type="text"
                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm uppercase tracking-tight placeholder:text-gray-200"
                                placeholder="E.G. TITANIUM LEATHER BACKPACK"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 ">Unit Price (INR) *</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    className="w-full h-16 pl-12 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Category Group *</label>
                            <input
                                type="text"
                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black uppercase tracking-widest text-xs placeholder:text-gray-200"
                                placeholder="E.G. ACCESSORIES"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Usage Summary</label>
                            <textarea
                                className="w-full min-h-[160px] p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-medium leading-relaxed placeholder:text-gray-200 resize-none text-xs"
                                placeholder="Register core features and technical specifications..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>


                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Product Visual *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="relative group/upload h-48 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center transition-all hover:border-indigo-500 hover:bg-white cursor-pointer overflow-hidden">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleImageUpload}
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            disabled={uploading}
                                        />
                                        {uploading ? (
                                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : image ? (
                                            <img src={image} alt="Preview" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 opacity-30 group-hover/upload:opacity-100 transition-opacity">
                                                <Upload size={32} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Post PNG/JPG</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">Max size 5MB. PNG, JPG, JPEG, WEBP</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 opacity-50">Or Manual Source URL</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">
                                            <ImageIcon size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full h-16 pl-16 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-medium text-xs placeholder:text-gray-200"
                                            placeholder="HTTPS://DOMAIN.COM/IMAGE.JPG"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                        />
                                    </div>
                                    {image && (
                                        <button
                                            onClick={() => setImage("")}
                                            className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline ml-1"
                                        >
                                            Reset Asset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Stock Reservoir</label>
                            <input
                                type="number"
                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-sm"
                                placeholder="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Promotional Tag</label>
                            <input
                                type="text"
                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gray-900 outline-none transition-all text-emerald-600 font-black text-sm uppercase placeholder:text-gray-200"
                                placeholder="E.G. 15% OFF"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2 mt-12 pb-4">
                            <button
                                onClick={handleAddProduct}
                                disabled={loading}
                                className={`w-full h-20 bg-gray-900 hover:bg-black text-white font-black rounded-3xl shadow-2xl shadow-gray-200 transition-all duration-500 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Authorize Deployment</span>
                                        <div className="w-8 h-8 bg-white/10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-45">
                                            <ArrowRight size={16} className="text-white" />
                                        </div>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
