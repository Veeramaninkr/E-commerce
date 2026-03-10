"use client"
import React, { useState, useEffect, useRef } from "react"
import { Search, Send, User, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@heroui/button"
import api from "@/store/api"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollShadow } from "@heroui/scroll-shadow"

interface Message {
    id: string
    text: string
    sender: string
    receiver?: string
    is_admin: boolean
    timestamp: string
}

const AdminChat = () => {
    const [users, setUsers] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(true)
    const [isReady, setIsReady] = useState(false)
    const socketRef = useRef<WebSocket | null>(null)
    const selectedUserRef = useRef<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Update ref whenever selectedUser changes
    useEffect(() => {
        selectedUserRef.current = selectedUser
    }, [selectedUser])

    // WebSocket Persistence
    useEffect(() => {
        const connect = async () => {
            setLoading(true)
            try {
                // 1. Fetch users queue
                const usersRes = await api.get("/chat/users")
                setUsers(usersRes.data)

                // 2. Connect WebSocket
                let baseURL = api.defaults.baseURL?.replace("http", "ws") ||
                    (typeof window !== "undefined" ? `ws://${window.location.hostname}:8000` : "ws://localhost:8000")
                baseURL = baseURL.replace(/\/$/, "")

                console.log("Admin connecting to WebSocket:", `${baseURL}/ws/admin`)
                const ws = new WebSocket(`${baseURL}/ws/admin`)

                ws.onopen = () => {
                    console.log("Admin Chat connected")
                    setIsReady(true)
                    setLoading(false)
                }

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    const currentUser = selectedUserRef.current

                    // If the message is from/to the selected user, update UI
                    if (data.sender === currentUser || data.receiver === currentUser) {
                        setMessages((prev) => {
                            // Check if an identical message from the same sender in the last ~1000ms is already tracked
                            // This guards against duplicated websocket listeners in React Strict Mode locally
                            const isDuplicate = prev.some(
                                (m) => m.text === data.message &&
                                    m.sender === data.sender &&
                                    Math.abs(new Date(m.timestamp).getTime() - new Date(data.timestamp || new Date()).getTime()) < 1000
                            )

                            if (isDuplicate) return prev;

                            return [
                                ...prev,
                                {
                                    id: Date.now().toString() + Math.random().toString(),
                                    text: data.message,
                                    sender: data.sender,
                                    receiver: data.receiver,
                                    is_admin: data.is_admin,
                                    timestamp: data.timestamp || new Date().toISOString()
                                }
                            ]
                        })
                    }

                    // Update user list if it's a new sender (not broadcast from fellow admin)
                    if (!data.is_admin) {
                        setUsers((prev) => (prev.includes(data.sender) ? prev : [...prev, data.sender]))
                    }
                }

                ws.onerror = (e) => {
                    console.error("Admin WebSocket error connection failed.", e)
                }
                ws.onclose = (event) => {
                    console.log(`Admin Chat closed (Code: ${event.code})`)
                    socketRef.current = null
                    setIsReady(false)
                }

                socketRef.current = ws
            } catch (err) {
                console.error("Admin Chat setup failed:", err)
                setLoading(false)
            }
        }

        connect()
        return () => {
            socketRef.current?.close()
            socketRef.current = null
            setIsReady(false)
        }
    }, [])

    // Load History when user selected
    useEffect(() => {
        if (!selectedUser) {
            setMessages([])
            return
        }

        const fetchHistory = async () => {
            try {
                const res = await api.get(`/chat/history?email=${selectedUser}`)
                const history = res.data.map((h: any) => ({
                    id: h._id,
                    text: h.message,
                    sender: h.sender_email,
                    receiver: h.recipient_email,
                    is_admin: h.is_admin,
                    timestamp: h.timestamp
                }))
                setMessages(history)
            } catch (err) {
                console.error("Failed to fetch history:", err)
            }
        }
        fetchHistory()
    }, [selectedUser])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim() || !selectedUser) return

        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("Admin WebSocket not ready")
            return
        }

        socketRef.current.send(`${selectedUser}:${input}`)
        setInput("")
    }

    const filteredUsers = users.filter((u: string) => u.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="flex bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] h-[calc(130vh-200px)] overflow-hidden">
            {/* User List Side */}
            <div className="w-1/3 border-r border-gray-50 flex flex-col pt-8 bg-gray-50/10">
                <div className="px-8 pb-6 border-b border-gray-50 bg-white">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4 italic">Support Queue</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 duration-300" size={16} />
                        <input
                            placeholder="SEARCH USERS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar py-4">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin text-indigo-200" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-20 px-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">No active sessions</p>
                        </div>
                    ) : (
                        filteredUsers.map((email: string) => (
                            <button
                                key={email}
                                onClick={() => setSelectedUser(email)}
                                className={`w-full px-8 py-6 flex items-center gap-4 border-b border-gray-50 transition-all duration-300 text-left ${selectedUser === email ? 'bg-indigo-600' : 'hover:bg-gray-50'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedUser === email ? 'bg-white/20 text-white' : 'bg-gray-900 text-white'}`}>
                                    <User size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className={`text-xs font-black truncate uppercase tracking-tighter ${selectedUser === email ? 'text-white' : 'text-gray-900'}`}>{email}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area Side */}
            <div className="flex-1 flex flex-col h-100% bg-white">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="px-10 py-8 bg-white border-b border-gray-50 flex items-center justify-between shadow-sm relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[20px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{selectedUser}</h3>
                                    <div className="flex items-center gap-2 mt-2">                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Body */}
                        <ScrollShadow ref={scrollRef} className="flex-1 p-10 bg-[#f8f9fc] space-y-6 overflow-y-auto no-scrollbar">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] p-6 rounded-[28px] text-[11px] font-bold leading-relaxed shadow-sm ${msg.is_admin ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-indigo-500/5'
                                            }`}>                    
                                            {msg.text}
                                            <div className={`text-[8px] font-black uppercase tracking-widest mt-3 opacity-30 ${msg.is_admin ? 'text-white' : 'text-gray-900'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollShadow>

                        {/* Input Footer */}
                        <div className="px-10 py-10 bg-white border-t border-gray-50">
                            <div className="bg-gray-50 p-2 rounded-[28px] border border-gray-100 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all flex items-center gap-3">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={isReady ? "TYPE YOUR ASSISTANCE..." : "CONNECTING..."}
                                    disabled={!isReady}
                                    className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-900 placeholder:text-gray-300 disabled:opacity-50"
                                />
                                <Button
                                    onClick={handleSend}
                                    isIconOnly
                                    disabled={!isReady}
                                    isLoading={loading && !isReady}
                                    className="h-14 w-14 rounded-[22px] bg-gray-900 text-white shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {!loading && <Send size={20} />}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 bg-[#f8f9fc]">
                        <div className="w-32 h-32 rounded-[48px] border-4 border-dashed border-gray-300 flex items-center justify-center mb-10 rotate-12 bg-white">
                            <MessageSquare size={48} className="text-gray-300" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-400 tracking-tighter uppercase italic">Select Client Session</h2>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] mt-4">Initiate real-time assistance</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminChat
