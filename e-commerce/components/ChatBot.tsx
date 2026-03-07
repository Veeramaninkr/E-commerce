"use client"
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, User, Bot, BotMessageSquare } from "lucide-react"
import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card"
import { ScrollShadow } from "@heroui/scroll-shadow"
import api from "@/store/api"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface Message {
    id: string
    text: string
    sender: "user" | "bot"
    timestamp: Date
}

export const ChatBot = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.login)
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const socketRef = useRef<WebSocket | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // WebSocket and History Initialization
    useEffect(() => {
        if (!isOpen || !isAuthenticated) return

        const connect = async () => {
            try {
                // 1. Get Token from backend (securely stored in cookie, but we need it for WS URL)
                const tokenRes = await api.get("/get-token")
                const token = tokenRes.data.token

                // 2. Fetch History
                const historyRes = await api.get("/chat/history")
                const history = historyRes.data.map((h: any) => ({
                    id: h._id,
                    text: h.message,
                    sender: h.is_admin ? "bot" : "user",
                    timestamp: new Date(h.timestamp)
                }))
                setMessages(history)

                // 3. Connect WebSocket
                const baseURL = api.defaults.baseURL?.replace("http", "ws") ||
                    (typeof window !== "undefined" ? `ws://${window.location.hostname}:8000` : "ws://localhost:8000")

                console.log("Connecting to WebSocket:", `${baseURL}/ws/${token}`)
                const ws = new WebSocket(`${baseURL}/ws/${token}`)

                ws.onopen = () => console.log("Chat WebSocket connected")

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            text: data.message,
                            sender: data.is_admin ? "bot" : "user",
                            timestamp: new Date(data.timestamp)
                        }
                    ])
                    if (data.is_admin) setIsTyping(false)
                }

                ws.onerror = (e) => console.error("WebSocket error:", e)
                ws.onclose = () => {
                    console.log("Chat WebSocket closed")
                    socketRef.current = null
                }

                socketRef.current = ws
            } catch (err) {
                console.error("Chat connect failed:", err)
            }
        }

        connect()
        return () => {
            socketRef.current?.close()
            socketRef.current = null
        }
    }, [isOpen, isAuthenticated])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = () => {
        if (!message.trim()) return

        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket not ready")
            return
        }

        socketRef.current.send(JSON.stringify({ message }))
        setMessage("")
        setIsTyping(true)
    }

    // Only render if authenticated
    if (!isAuthenticated) return null

    return (
        <div className="fixed bottom-10 right-10 z-[1001]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-6 w-[400px] h-[600px] shadow-2xl rounded-[32px] overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20"
                    >
                        <Card className="h-full border-none bg-transparent" shadow="none" radius="none">
                            <CardHeader className="p-6 bg-gray-900 flex justify-between items-center text-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <BotMessageSquare size={24} />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter">Support assistant</h3>
                                </div>
                                <Button isIconOnly variant="light" color="primary" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                                    <X size={20} />
                                </Button>
                            </CardHeader>

                            <CardBody className="p-0 overflow-hidden relative">
                                <ScrollShadow ref={scrollRef} className="h-full p-6 space-y-6 no-scrollbar overflow-y-auto">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-20">
                                            <Bot size={48} className="mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">How can we help you today?</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`p-4 rounded-[20px] text-xs font-bold leading-relaxed max-w-[85%] ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm"
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-50 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
                                                Assistant is responding...
                                            </div>
                                        </div>
                                    )}
                                </ScrollShadow>
                            </CardBody>

                            <CardFooter className="p-6 border-t border-gray-50">
                                <div className="flex gap-3 w-full items-center bg-gray-50 p-2 rounded-2xl border border-transparent focus-within:border-indigo-100 transition-all">
                                    <input
                                        placeholder="TYPE YOUR MESSAGE..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        className="flex-1 bg-transparent outline-none px-4 text-[10px] font-black uppercase tracking-tighter"
                                    />
                                    <Button isIconOnly variant="flat" color="primary" radius="lg" onClick={handleSend} className="h-10 w-10">
                                        <Send size={18} />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all ${isOpen ? "bg-gray-900 text-white" : "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    }`}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    )
}
