import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Send, Paperclip, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: string
}

export default function ChatPage() {
  const location = useLocation()
  const { profile } = useProfile()
  const initialPromptFromState = (location.state as { initialPrompt?: string })?.initialPrompt

  const displayName = profile.nickname || profile.name || "Learner"
  const targetGoal = profile.primaryGoal || "Career Growth"
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "EV"

  const initialMessages: Message[] = initialPromptFromState
    ? [
        {
          id: "m-user-init",
          role: "user",
          content: initialPromptFromState,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        {
          id: "m-ai-init",
          role: "ai",
          content: `I'd be glad to assist you with that, ${displayName}! Based on your current focus on **${targetGoal}** (${profile.weeklyHours}h/week commitment), here is my analysis:\n\n1. **Core Concept Overview**\n   Understanding the underlying specifications and architecture.\n\n2. **Actionable Project Practice**\n   Building concrete code implementations to validate your knowledge.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]
    : [
        {
          id: "m1",
          role: "user",
          content: `Can you generate a learning roadmap for becoming a ${targetGoal}?`,
          timestamp: "10:30 AM",
        },
        {
          id: "m2",
          role: "ai",
          content: `Hello ${displayName}! Here is your personalized roadmap tailored for **${targetGoal}** based on your skill level (${profile.skillLevel || "Intermediate"}) and target velocity (${profile.weeklyHours}h/week):\n\n1. **Foundations & Core Specifications**\n   • Master core syntax and engineering patterns for ${profile.knownTechnologies[0] || profile.interests[0] || "your stack"}.\n\n2. **System Architecture & Production Engineering**\n   • Learn state management, caching, and API design.\n\n3. **Career Alignment & Portfolio**\n   • Align resume ATS metrics to target role criteria.`,
          timestamp: "10:31 AM",
        },
      ]

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Great question, ${displayName}! To accelerate your progress toward "${targetGoal}", I recommend focusing on hands-on project building. Would you like me to generate a detailed project specification?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto rounded-2xl bg-[#151922] border border-white/5 overflow-hidden">
      {/* Top Conversation Header */}
      <div className="flex h-14 items-center justify-between px-6 border-b border-white/5 bg-[#151922]">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#5B7CFA]" />
          <span className="text-sm font-semibold text-[#F5F7FA]">EV AI Workspace</span>
        </div>
        <span className="font-mono text-xs text-[#32D296]">ACTIVE</span>
      </div>

      {/* Centered Message Stream */}
      <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            {m.role === "ai" ? (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#5B7CFA] text-white text-xs font-bold">
                EV
              </div>
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#7B61FF] text-xs font-bold text-white">
                {userInitials}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-2xl space-y-1.5 rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[#5B7CFA] text-white"
                  : "bg-[#1C2230] text-[#F5F7FA] border border-white/5"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <span
                className={`block font-mono text-[0.65rem] ${
                  m.role === "user" ? "text-white/70 text-right" : "text-[#A7B0C0]"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#5B7CFA] text-white text-xs font-bold">
              EV
            </div>
            <div className="rounded-2xl bg-[#1C2230] border border-white/5 px-4 py-3 text-xs text-[#A7B0C0] flex items-center gap-2">
              <span className="font-mono">EV AI is generating response</span>
              <span className="flex gap-1">
                <span className="size-1.5 bg-[#5B7CFA] rounded-full animate-ping" />
                <span className="size-1.5 bg-[#7B61FF] rounded-full animate-ping delay-100" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-white/5 p-4 bg-[#151922]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-3 bg-[#0D0F14] border border-white/10 rounded-2xl px-4 py-2.5"
        >
          <button type="button" className="text-[#A7B0C0] hover:text-[#F5F7FA]">
            <Paperclip className="size-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask EV anything...`}
            className="w-full bg-transparent text-sm text-[#F5F7FA] outline-none placeholder:text-[#A7B0C0]/50"
          />
          <Button type="submit" size="icon-sm" className="bg-[#5B7CFA] text-white shrink-0">
            <Send className="size-3.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
