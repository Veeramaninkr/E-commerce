"use client"
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, User, Bot, Sparkles, Smile, Paperclip, BotMessageSquare } from "lucide-react"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card"
import { ScrollShadow } from "@heroui/scroll-shadow"

interface Message {
    id: string
    text: string
    sender: "user" | "bot"
    timestamp: Date
}

export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ])
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {``
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = () => {
        if (!message.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            text: message,
            sender: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMsg])
        setMessage("")
        setIsTyping(true)

        // Mock bot response
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Nanri",
                sender: "bot",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="fixed bottom-10 right-10 z-[1001]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-6 w-[400px] h-[600px] shadow-[0_24px_80px_-15px_rgba(0,0,0,0.15)] rounded-[32px] overflow-hidden border border-white/20 backdrop-blur-2xl bg-white/90"
                    >
                        <Card className="h-full border-none bg-transparent" radius="none" shadow="none">
                            <CardHeader className="p-6 bg-gray-900 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                        <BotMessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black uppercase tracking-tighter text-lg leading-tight">Assistant</h3>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="p-0 flex-col overflow-hidden relative">
                                <ScrollShadow
                                    ref={scrollRef}
                                    className="h-full p-6 space-y-6 no-scrollbar overflow-y-auto"
                                    hideScrollBar
                                >
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                                                    }`}>
                                                    {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                                                </div>
                                                <div className={`p-4 rounded-[20px] text-xs font-bold leading-relaxed ${msg.sender === "user"
                                                    ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20"
                                                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm"
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </ScrollShadow>

                            </CardBody>

                            <CardFooter className="p-6 border-t border-gray-50 flex flex-col gap-4">
                                <div className="flex gap-3 w-full items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <input
                                        type="text"
                                        placeholder="TYPE YOUR MESSAGE..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        className="flex-1 bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-gray-900 placeholder:text-gray-300"
                                    />
                                    <Button
                                        isIconOnly
                                        color="primary"
                                        radius="lg"
                                        className="h-10 w-10 shadow-lg shadow-indigo-200"
                                        onClick={handleSend}
                                    >
                                        <Send size={18} />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? "bg-gray-900 text-white rotate-90" : "bg-indigo-600 text-white"
                    }`}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    )
}
