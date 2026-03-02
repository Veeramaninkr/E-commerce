"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getUsersRequest, updateUserRoleRequest } from '@/store/login/action'
import { Search, User, Shield, Mail, Trash2, ShieldCheck, ShieldAlert, Edit, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function Users() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { users, loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.login);
    const router = useRouter();

    // State for role update
    const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newRole, setNewRole] = useState('');

    // Authentication Guard
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.replace('/');
            } else if (user?.role !== 'admin') {
                router.replace('/client/home');
            }
        }
    }, [isAuthenticated, user, loading, router]);

    useEffect(() => {
        dispatch(getUsersRequest());
    }, [dispatch]);

    // Deduplicate users by ID
    const uniqueUsers = React.useMemo(() => {
        const userMap = new Map();
        (users || []).forEach((u: any) => {
            const id = u.id || u._id;
            if (id) userMap.set(id, u);
        });
        return Array.from(userMap.values());
    }, [users]);

    if (loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Fetching User Directory...</p>
            </div>
        );
    }


    const filteredUsers = uniqueUsers.filter((u: any) => {
        if (!u) return false;
        const searchLower = (search || '').toLowerCase();
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const role = (u.role || '').toLowerCase();
        return name.includes(searchLower) || email.includes(searchLower) || role.includes(searchLower);
    });

    const handleDelete = (id: string) => {
        if (!window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) return;
        // dispatch(removeUserRequest(id)); // To be implemented if needed
        console.log("Delete user:", id);
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setIsEditBannerOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser && newRole) {
            dispatch(updateUserRoleRequest({ userId: selectedUser.id || selectedUser._id, role: newRole }));
            setIsEditBannerOpen(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 min-h-screen bg-[#fafafa] p-4 md:p-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">User List</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Managing {uniqueUsers.length} registered members</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="FIND USERS..."
                            className="w-full md:w-96 h-14 pl-14 pr-6 bg-white border border-gray-100 rounded-2xl focus:border-indigo-600 outline-none transition-all shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] text-xs font-black tracking-widest uppercase placeholder:text-gray-300 focus:ring-4 focus:ring-indigo-50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-700 rounded-[24px] shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="text-red-600" size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-0.5">System Error</p>
                        <p className="text-sm font-bold opacity-80">{typeof error === 'string' ? error : 'An error occurred while fetching users.'}</p>
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Name</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Role</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Access ID</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {loading && users.length === 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-8">
                                            <div className="h-12 bg-gray-50 rounded-2xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-40">
                                            <div className="p-8 bg-gray-50 rounded-full">
                                                <User size={64} className="text-gray-300" />
                                            </div>
                                            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No users matching search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u: any, index: number) => {
                                    if (!u) return null;
                                    const userId = u.id || u._id || 'no-id';
                                    return (
                                        <tr key={`${userId}-${index}`} className="hover:bg-gray-50/30 transition-all duration-300 group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                                                        <User size={24} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-gray-900 tracking-tight uppercase">{u.name || 'Anonymous User'}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Identifier: {String(userId).slice(-8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                        <Mail size={14} />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600 lowercase tracking-wide">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 group-hover:px-6 shadow-sm mr-auto ml-auto
                                                ${u.role === 'admin'
                                                        ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                                                        : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                                    {u.role === 'admin' ? <ShieldCheck size={14} strokeWidth={3} /> : <User size={14} strokeWidth={3} />}
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{u.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <code className="text-[10px] bg-gray-50 px-3 py-1.5 rounded-lg text-gray-400 font-mono select-all">
                                                    {String(userId).toUpperCase()}
                                                </code>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(u)}
                                                        className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 border border-transparent hover:border-indigo-100 shadow-sm"
                                                    >
                                                        <Edit size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && filteredUsers.length > 0 && (
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-medium">
                        Showing <span className="text-gray-900 font-bold">{filteredUsers.length}</span> users
                    </p>
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
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Authorization Console</p>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Update Privileges</h2>
                                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">User: {selectedUser?.name || 'Unknown'}</p>
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
                                        Account Details
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Registration Email</label>
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] outline-none text-gray-400 font-bold text-xs uppercase tracking-widest"
                                                value={selectedUser?.email || ''}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Level (Role)</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[20px] focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black uppercase tracking-tight appearance-none text-xs"
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-gray-400">
                                                    <ChevronRight size={16} className="rotate-90" />
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
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 h-14 bg-gray-900 hover:bg-black text-white px-10 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
                                    >
                                        Update Role
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Users;