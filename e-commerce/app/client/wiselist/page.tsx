"use client"
import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
    fetchWishlistRequest,
    fetchCollectionsRequest,
    createCollectionRequest,
    removeFromWishlistRequest
} from '@/store/wishlist/action'
import { addToCart } from '@/store/order/action'
import {
    Heart,
    Plus,
    Trash2,
    ShoppingBag,
    Folder,
    ChevronRight,
    MoreHorizontal,
    Search,
    Filter,
    ArrowLeft,
    CheckCircle
} from 'lucide-react'
import { Card, CardBody, CardFooter } from "@heroui/card"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@heroui/skeleton"

export default function WiselistPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { wishlist, collections, loading, error } = useSelector((state: RootState) => state.wishlist);
    const { isAuthenticated } = useSelector((state: RootState) => state.login);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newCollectionName, setNewCollectionName] = useState("");
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [lastAdded, setLastAdded] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        dispatch(fetchWishlistRequest());
        dispatch(fetchCollectionsRequest());
    }, [dispatch, isAuthenticated, router]);

    const handleCreateCollection = () => {
        if (newCollectionName.trim()) {
            dispatch(createCollectionRequest(newCollectionName));
            setNewCollectionName("");
            onOpenChange();
        }
    };

    const handleRemove = (id: string) => {
        dispatch(removeFromWishlistRequest(id));
    };

    const handleAddToCart = (item: any) => {
        dispatch(addToCart({
            id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            image: item.product_image,
            quantity: 1
        }));
        setLastAdded(item.product_name);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = (item: any) => {
        handleAddToCart(item);
        router.push("/client/buy");
    }

    const filteredWishlist = selectedCollection
        ? wishlist.filter(item => item.collection_id === selectedCollection)
        : wishlist;

    const activeCollectionName = selectedCollection
        ? collections.find(c => c._id === selectedCollection)?.name || "Collection"
        : "All Items";

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <main className="container mx-auto px-6 pt-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Wiselist
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="flat"
                            color="primary"
                            radius="full"
                            onPress={onOpen}
                            startContent={<Plus size={18} />}
                            className="font-black text-[10px] uppercase tracking-widest px-6 h-12 shadow-lg shadow-indigo-100"
                        >
                            New Collection
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Collections */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-6 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-50">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 px-2">Collections</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedCollection(null)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-tight ${!selectedCollection ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag size={16} />
                                        <span>All Items</span>
                                    </div>
                                    <span className={`text-[10px] font-black ${!selectedCollection ? 'text-indigo-200' : 'text-gray-300'}`}>{wishlist.length}</span>
                                </button>

                                {collections.map((coll) => (
                                    <button
                                        key={coll._id}
                                        onClick={() => setSelectedCollection(coll._id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-tight ${selectedCollection === coll._id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Folder size={16} />
                                            <span className="truncate max-w-[120px]">{coll.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-black ${selectedCollection === coll._id ? 'text-indigo-200' : 'text-gray-300'}`}>
                                            {wishlist.filter(i => i.collection_id === coll._id).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Wiselist Grid */}
                    <div className="lg:col-span-9 space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{activeCollectionName}</h2>
                            <div className="flex gap-2 text-gray-400">
                                <Search size={18} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-[300px] bg-white rounded-[32px] animate-pulse" />
                                ))}
                            </div>
                        ) : filteredWishlist.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <AnimatePresence mode='popLayout'>
                                    {filteredWishlist.map((item) => (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card key={item._id} className="group h-[450px] rounded-[32px] border-none bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-3 cursor-pointer">
                                                <CardBody className="p-0 overflow-hidden relative">
                                                    <div className="absolute top-5 right-5 z-20 space-y-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleRemove(item._id); }}
                                                            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 duration-500"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                                                            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110 active:scale-95 duration-700"
                                                        >
                                                            <ShoppingBag size={20} />
                                                        </button>
                                                    </div>

                                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-1000">
                                                        <img
                                                            src={item.product_image || 'https://placehold.co/400x400/f8fafc/64748b?text=Product'}
                                                            className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-700"
                                                            alt={item.product_name}
                                                        />
                                                    </div>
                                                </CardBody>
                                                <CardFooter className="flex-col items-start gap-1 p-8 bg-white">
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Wiselist Item</span>
                                                    </div>
                                                    <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors truncate w-full uppercase">{item.product_name}</h3>
                                                    <div className="flex items-center justify-between w-full mt-4">
                                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">
                                                            ${parseFloat(item.product_price || 0).toLocaleString()}
                                                        </p>
                                                        <Button
                                                            size="sm"
                                                            color="primary"
                                                            radius="full"
                                                            onClick={(e) => { e.stopPropagation(); handleBuyNow(item); }}
                                                            className="font-black text-[12px] uppercase tracking-[0.2em] px-8 h-10 shadow-lg shadow-indigo-200 hover:scale-110 transition-transform active:scale-95"
                                                        >
                                                            Buy
                                                        </Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)]">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                    <Heart size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-gray-900 uppercase">Your Wiselist is Empty</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start adding items to your curated collections.</p>
                                </div>
                                <Button
                                    color="primary"
                                    radius="full"
                                    onPress={() => router.push('/')}
                                    className="font-black text-[10px] uppercase tracking-widest px-10 h-12"
                                >
                                    Explore Catalog
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create Collection Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" className="bg-white rounded-[40px]">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 uppercase font-black text-gray-900 tracking-tighter">Create New Collection</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Collection Name"
                                    placeholder="e.g. Summer Hits, Birthdays..."
                                    variant="bordered"
                                    radius="lg"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    className="font-bold tracking-tight"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} className="font-black uppercase tracking-widest text-[10px]">Close</Button>
                                <Button color="primary" onPress={handleCreateCollection} className="font-black uppercase tracking-widest text-[10px] px-8 rounded-full shadow-lg shadow-indigo-100">Create</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

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
                            <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[200px] text-left">{lastAdded} Added to Cart</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}