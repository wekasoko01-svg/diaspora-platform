"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { Button, Spinner } from "@/components/ui"
import { Send, MessageCircle } from "lucide-react"

type Message = {
  id: string
  bookingId: string
  senderId: string
  content: string
  readAt: string | null
  createdAt: string
  sender: { id: string; fullName: string; role: string }
}

interface ChatWidgetProps {
  bookingId: string
  currentUserId: string
  token: string
  apiBase: string
}

export function ChatWidget({ bookingId, currentUserId, token, apiBase }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${apiBase}/messages/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setMessages(data.data)
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [bookingId, apiBase, token])

  useEffect(() => {
    const socket = io(apiBase, {
      auth: { token },
      transports: ["websocket", "polling"],
    })
    socketRef.current = socket

    socket.on("connect", () => {
      setConnected(true)
      socket.emit("join:booking", bookingId)
    })
    socket.on("disconnect", () => setConnected(false))
    socket.on("message:new", (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.emit("leave:booking", bookingId)
      socket.disconnect()
    }
  }, [bookingId, apiBase, token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = useCallback(() => {
    if (!input.trim() || !socketRef.current) return
    socketRef.current.emit("message:send", { bookingId, content: input.trim() })
    setInput("")
  }, [input, bookingId])

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="flex flex-col border rounded-xl bg-card">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30 rounded-t-xl">
        <MessageCircle className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">Messages</span>
        <span className={`ml-auto text-xs flex items-center gap-1 ${connected ? "text-success" : "text-destructive"}`}>
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-destructive"}`} />
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-80 p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"
              }`}>
                {!isMe && (
                  <p className="text-xs font-medium mb-1 opacity-70">{msg.sender.fullName}</p>
                )}
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 p-3 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Type your message..."
          className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button size="sm" onClick={send} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
