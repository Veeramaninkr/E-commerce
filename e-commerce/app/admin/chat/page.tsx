"use client"
import React, { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import api from "@/store/api"

interface ChatMessage {
    _id: string
    sender: string
    receiver: string
    message: string
    timestamp: string
    sender_name?: string
    sender_email?: string
}

export default function AdminChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [groupedChats, setGroupedChats] = useState<{ [clientId: string]: ChatMessage[] }>({})
    const [selectedClient, setSelectedClient] = useState<string | null>(null)
    const [replyText, setReplyText] = useState("")
    const [ws, setWs] = useState<WebSocket | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Grab user from Redux store which is populated by AdminDashboard anyway
    const { user, isAuthenticated } = useSelector((state: any) => state.login)

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // Check role - support both "admin" and potentially "ADMIN"
        const role = user.role || user.Role;
        if (role?.toLowerCase() !== "admin") {
            console.log("Not an admin, role is:", role);
            return;
        }

        // Fetch past chats
        api.get("/chats")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setMessages(res.data)
                }
            })
            .catch(err => console.error("Error fetching chats:", err))

        const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
        const wsUrl = hostname === "127.0.0.1" ? "ws://127.0.0.1:8000" : "ws://localhost:8000";

        // Prioritize _id (mongo format) over id
        const adminId = user._id || user.id || "admin"
        console.log("Connecting Admin WebSocket with ID:", adminId);

        const socket = new WebSocket(`${wsUrl}/ws/${adminId}`)

        socket.onopen = () => console.log("Admin WebSocket connected");
        socket.onerror = (err) => console.error("Admin WebSocket error:", err);

        socket.onmessage = (event) => {
            console.log("Admin received message:", event.data);
            try {
                const data = JSON.parse(event.data)

                if (data.is_admin_sending) {
                    const newMsg: ChatMessage = {
                        _id: `admin-broadcast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        sender: "admin",
                        receiver: data.client_id,
                        message: data.message,
                        timestamp: new Date().toISOString(),
                        sender_name: data.username,
                        sender_email: data.useremail
                    }
                    setMessages(prev => [...prev, newMsg])
                } else if (data.client_id) {
                    // It's a client-sent message
                    const newMsg: ChatMessage = {
                        _id: `client-msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        sender: data.client_id,
                        receiver: "admin",
                        message: data.message,
                        timestamp: new Date().toISOString(),
                        sender_name: data.username,
                        sender_email: data.useremail
                    }
                    setMessages(prev => [...prev, newMsg])
                }
            } catch (e) {
                // Fallback for non-JSON or malformed messages
                if (typeof event.data === "string" && event.data.includes(":")) {
                    const [clientId, ...rest] = event.data.split(":");
                    const msg = rest.join(":");
                    const newMsg: ChatMessage = {
                        _id: `fallback-${Date.now()}`,
                        sender: clientId,
                        receiver: "admin",
                        message: msg,
                        timestamp: new Date().toISOString()
                    }
                    setMessages(prev => [...prev, newMsg])
                }
            }
        }

        setWs(socket)

        return () => {
            console.log("Closing Admin WebSocket");
            socket.close();
        }

    }, [isAuthenticated, user])


    useEffect(() => {
        // Group messages by client. 
        // A message belongs to a client if either sender or receiver is that client.
        // We know "admin" and "bot" are NOT the client.
        const grouped: { [key: string]: ChatMessage[] } = {}
        messages.forEach(msg => {
            let client = "";

            if (msg.sender !== "admin" && msg.sender !== "bot") {
                client = msg.sender;
            } else if (msg.receiver !== "admin" && msg.receiver !== "bot") {
                client = msg.receiver;
            }

            if (client) {
                if (!grouped[client]) grouped[client] = []
                grouped[client].push(msg)
            }
        })
        setGroupedChats(grouped)
    }, [messages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [groupedChats, selectedClient])

    const handleSend = () => {
        if (!replyText.trim() || !selectedClient || !ws) return

        // Admin format to send to client: "clientId:message"
        ws.send(`${selectedClient}:${replyText}`)
        setReplyText("")
    }

    const clients = Object.keys(groupedChats)

    return (
        <div className="flex h-[85vh] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-100 font-sans mt-4">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-50/50 border-r border-gray-100 flex flex-col">
                <div className="p-6 bg-white border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-sm font-black text-gray-900 tracking-widest uppercase mb-1">Live Communications</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Client Sessions</p>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {clients.length === 0 ? (
                        <div className="p-10 text-gray-400 text-xs font-black uppercase tracking-widest text-center">No active chats</div>
                    ) : (
                        clients.map(client => {
                            const clientMsgs = groupedChats[client];
                            const lastMessage = clientMsgs[clientMsgs.length - 1];
                            const isSelected = selectedClient === client;

                            // Find any message that has metadata for this client
                            const metadata = clientMsgs.find(m => m.sender === client && m.sender_name);
                            const displayName = metadata?.sender_name || client;
                            const displayEmail = metadata?.sender_email || "No Email";

                            return (
                                <div
                                    key={client}
                                    onClick={() => setSelectedClient(client)}
                                    className={`p-6 border-b border-gray-100 cursor-pointer transition-all duration-300 relative group
                                        ${isSelected ? "bg-white" : "hover:bg-white/60"}
                                    `}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-lg"></div>}
                                    <div className="flex flex-col gap-1">
                                        <h3 className={`text-xs font-black tracking-tight truncate ${isSelected ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-500'}`}>
                                            {displayName}
                                        </h3>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{displayEmail}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-wide truncate mt-1 ${isSelected ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {lastMessage?.message || "..."}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white relative">
                {selectedClient ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0 z-10">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Currently Assisting</h2>
                                <p className="text-sm font-black text-indigo-600 tracking-tight leading-normal">
                                    {groupedChats[selectedClient]?.find(m => m.sender === selectedClient && m.sender_name)?.sender_name || selectedClient}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                    {groupedChats[selectedClient]?.find(m => m.sender === selectedClient && m.sender_email)?.sender_email || "Private Client"}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                            {groupedChats[selectedClient]?.map(msg => {
                                const isAdminMsg = msg.sender === "bot" || msg.sender === "admin";
                                return (
                                    <div key={msg._id} className={`flex ${isAdminMsg ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] relative group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`p-5 rounded-[24px] text-xs font-bold leading-relaxed shadow-sm whitespace-pre-wrap
                                                ${isAdminMsg
                                                    ? "bg-indigo-600 text-white rounded-br-sm"
                                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"}
                                            `}>
                                                {msg.message}
                                            </div>
                                            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] mt-2 font-black uppercase tracking-widest text-gray-400 absolute ${isAdminMsg ? "right-2" : "left-2"}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Chat Input */}
                        <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0 z-10">
                            <div className="flex gap-4 p-2 bg-gray-50 border border-gray-100 rounded-[20px] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    className="flex-1 bg-transparent border-none outline-none px-4 text-xs font-black uppercase tracking-widest text-gray-900 placeholder:text-gray-300"
                                    placeholder="TYPE YOUR MESSAGE..."
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!replyText.trim()}
                                    className="bg-indigo-600 disabled:opacity-50 text-white px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all active:scale-95"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                        <div className="w-24 h-24 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                            <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Awaiting Selection</p>
                    </div>
                )}
            </div>
        </div>
    )
}

