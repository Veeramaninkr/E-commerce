"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import AddProduct from '../addpro/page';
import { LayoutDashboard, PlusCircle, List, LogOut, ShieldUser, PrinterCheck, Users as UsersIcon, MessageSquare } from 'lucide-react';
import { logoutRequest, getMeRequest, getUsersRequest } from '@/store/login/action';
import { fetchOrdersRequest } from '@/store/order/action';
import View from '../view/page';
import Orders from '../orders/page';
import Users from '../users/page';
import Feedback from '../feedback/page';



const AdminDashboard = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, user, loading, users } = useSelector((state: any) => state.login);
    const { orders } = useSelector((state: any) => state.order);
    type TabId = 'overview' | 'add' | 'view' | 'orders' | 'users' | 'feedback';
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // Authentication Guard
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.replace('/');
            }
            else if (user?.role === 'user') {
                router.replace('/client/home');
            }
        }
    }, [isAuthenticated, loading, router]);

    const handleLogout = () => {
        console.log("Logout button clicked");
        dispatch(logoutRequest());
    };

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(getMeRequest());
        }
        dispatch(fetchOrdersRequest());
        dispatch(getUsersRequest());
    }, [dispatch, isAuthenticated]);

    const navigationItems: { id: TabId, label: string, icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: ShieldUser },
        { id: 'view', label: 'Collections', icon: List },
        { id: 'orders', label: 'Order Hub', icon: PrinterCheck },
        { id: 'add', label: 'New Product', icon: PlusCircle },
        { id: 'users', label: 'Users', icon: UsersIcon },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#fafafa] font-sans">
            {(loading && !isAuthenticated) ? (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Verifying session...</p>
                    </div>
                </div>
            ) : !isAuthenticated ? (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <p className="text-gray-500 font-medium">Redirecting to login...</p>
                </div>
            ) : (
                <>
                    {/* Sidebar */}
                    <aside
                        onMouseEnter={() => !isLocked && setSidebarOpen(true)}
                        onMouseLeave={() => !isLocked && setSidebarOpen(false)}
                        className={`${isSidebarOpen ? 'w-[320px]' : 'w-27'} bg-white border-r border-gray-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col z-40 relative shadow-[20px_0_60px_-15px_rgba(0,0,0,0.02)]`}
                    >
                        {/* Logo Section */}
                        <div className="h-28 flex items-center px-10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-[22px] flex items-center justify-center text-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] bg-gray-900">
                                    <LayoutDashboard size={26} strokeWidth={2.5} />
                                </div>
                                {isSidebarOpen && (
                                    <span className="font-black text-2xl text-gray-900 tracking-tighter leading-none">E-Commerce.</span>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-6 py-12 space-y-2">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon;
                                const isCurrentlyActive = activeTab === item.id;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full group relative flex items-center gap-4 px-5 py-4.5 rounded-2xl transition-all duration-500 ${isCurrentlyActive
                                            ? 'bg-gray-900 text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]'
                                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center transition-all duration-500 ${isCurrentlyActive ? 'text-white' : 'group-hover:scale-110'}`}>
                                            <Icon size={22} strokeWidth={isCurrentlyActive ? 2.5 : 2} />
                                        </div>
                                        {isSidebarOpen && (
                                            <span className={`text-sm font-black tracking-tight uppercase transition-all duration-500 ${isCurrentlyActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                                {item.label}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* User Section & Logout */}
                        <div className="p-8 border-t w-full border-gray-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-4.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-500 group"
                            >
                                <LogOut size={20} strokeWidth={2.5} />
                                {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest">Logout</span>}
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col overflow-hidden">

                        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#fafafa]">
                            <div >
                                <div className="max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-500">
                                    {activeTab === 'overview' && (
                                        <div className="space-y-16">
                                            <div className="flex flex-col gap-2">
                                                <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">Console Overview</h2>
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Welcome Admin page.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                {[
                                                    {
                                                        label: 'Net Revenue',
                                                        value: `$${(orders?.reduce((acc: number, order: any) => acc + (parseFloat(order.total_amount) || 0), 0) / 1000).toFixed(1)}k`,
                                                        change: orders?.length > 0 ? '+0.2%' : '+0.0%',
                                                        icon: LayoutDashboard,
                                                        color: 'text-indigo-600'
                                                    },
                                                    {
                                                        label: 'Activated Orders',
                                                        value: (orders?.length || 0).toString(),
                                                        change: orders?.length > 0 ? '+0.2%' : '+0.0%',
                                                        icon: PrinterCheck,
                                                        color: 'text-emerald-600'
                                                    },
                                                    {
                                                        label: 'Unique Visitors',
                                                        value: (users?.length || 0).toString(),
                                                        change: users?.length > 0 ? '+0.5%' : '+0.0%',
                                                        icon: ShieldUser,
                                                        color: 'text-blue-600'
                                                    }
                                                ].map((stat, i) => (
                                                    <div key={i} className="group cursor-default">
                                                        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.07)] hover:-translate-y-3 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50/50 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                                                            <div className="flex items-center justify-between mb-10 relative z-10">
                                                                <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color} group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 group-hover:rotate-6`}>
                                                                    <stat.icon size={28} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-xl uppercase tracking-widest">{stat.change}</span>
                                                            </div>
                                                            <div className="relative z-10">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{stat.label}</p>
                                                                <p className="text-5xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'view' && <View />}
                                    {activeTab === 'add' && <AddProduct />}
                                    {activeTab === 'orders' && <Orders />}
                                    {activeTab === 'users' && <Users />}
                                    {activeTab === 'feedback' && <Feedback />}
                                </div>
                            </div>
                        </div>
                    </main>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
