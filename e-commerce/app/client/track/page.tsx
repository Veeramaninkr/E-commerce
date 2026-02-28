"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchOrdersRequest, updateOrderRequest } from '@/store/order/action';
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
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orders, loading, error } = useSelector((state: any) => state.order);
  const { user, isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.login);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewBannerOpen, setIsViewBannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchOrdersRequest());
  }, [dispatch]);

  // Redirect if not authenticated after loading user info
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  if ((loading && orders.length === 0) || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Synchronizing Shipments...</p>
        </div>
      </div>
    );
  }

  const handleViewClick = (order: any) => {
    setSelectedOrder(order);
    setIsViewBannerOpen(true);
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO CANCEL THIS SHIPMENT?")) {
      dispatch(updateOrderRequest(orderId, { status: 'cancelled' }));
    }
  };

  const userOrders = orders.filter((order: any) =>
    order.user_email?.toLowerCase() === user?.email?.toLowerCase()
  );

  const filteredOrders = userOrders.filter((order: any) =>
    (order.id || order._id)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items?.some((item: any) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 font-bold text-red-600">!</div>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

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
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Client Portal</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Orders</h1>
            {user?.name && (
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Logged in as {user.name}</p>
            )}
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Tracking {filteredOrders.length} shipments for {user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-gray-900 transition-colors duration-300" size={18} />
            </div>
            <input
              type="text"
              placeholder="SEARCH SHIPMENTS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-12 pr-4 py-3 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-300 placeholder:font-bold placeholder:tracking-widest uppercase transition-all duration-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm"
            >
              <div className="p-8 bg-gray-50 rounded-[32px] mb-8 border border-gray-100/50">
                <CircleOff size={48} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">No Shipments Located</h3>
              <p className="text-sm text-gray-400 font-bold mb-8 uppercase tracking-widest max-w-xs text-center">
                We couldn't find any active shipments registered to <span className="text-indigo-500">{user?.email}</span>
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all duration-300 shadow-xl uppercase tracking-widest text-[10px]"
                >
                  Clear Search Filter
                </button>
              )}
            </motion.div>
          ) : (
            filteredOrders.map((order: any, index: number) => (
              <motion.div
                key={order.id || order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                    <div className={`p-3 rounded-xl ${getStatusColor(order.status)} border`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Shipment #{order.id || order._id}</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{order.items?.length} items</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none">
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewClick(order)}
                      className="p-3 bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {(order.status?.toLowerCase() === 'pending' || order.status?.toLowerCase() === 'shipped') && (
                      <button
                        onClick={() => handleCancelOrder(order.id || order._id)}
                        className="p-3 bg-white text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm"
                        title="Cancel Shipment"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Recipient</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{order.user_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{order.user_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{order.user_number}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Address</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Hash className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Pincode</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{order.pincode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Order Date</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="text-gray-400" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Total</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">₹{order.total_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto">
                      {order.items?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm min-w-[200px]"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="text-gray-400" size={24} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tight line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.quantity} x ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {isViewBannerOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${getStatusColor(selectedOrder.status)} border`}>
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Shipment #{selectedOrder.id || selectedOrder._id}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{selectedOrder.items?.length} items</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewBannerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Customer</p>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{selectedOrder.user_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Email</p>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{selectedOrder.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{selectedOrder.user_number}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Address</p>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{selectedOrder.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Pincode</p>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{selectedOrder.pincode}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${getStatusColor(selectedOrder.status)} border`}>
                      {getStatusIcon(selectedOrder.status)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Status</p>
                      <p className={`text-sm font-bold uppercase tracking-tight ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Order Date</p>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Items ({selectedOrder.items?.length})</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors duration-300">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-gray-400" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-tight line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.quantity} x ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsViewBannerOpen(false)}
                  className="px-6 py-3 bg-white text-gray-100 border border-gray-200 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 font-bold uppercase text-xs"
                >
                  Close
                </button>
                {(selectedOrder.status?.toLowerCase() === 'pending' || selectedOrder.status?.toLowerCase() === 'shipped') && (
                  <button
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id || selectedOrder._id);
                      setIsViewBannerOpen(false);
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-bold uppercase text-xs shadow-lg shadow-red-200"
                  >
                    Cancel Shipment
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage