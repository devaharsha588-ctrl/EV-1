import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  FileText,
  GitFork,
  Send,
  Sparkles,
  HelpCircle,
  Code2,
  Lock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import { sendChatMessage } from "@/services/chat.service"

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="size-4 fill-current" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: string
}

const QUICK_ACTIONS = [
  {
    label: "Explain a concept",
    prompt: "Explain core software engineering concepts simply",
    icon: BookOpen,
  },
  {
    label: "Improve my resume",
    prompt: "Analyze and optimize my resume for ATS scoring and impact",
    icon: FileText,
  },
  {
    label: "Plan my roadmap",
    prompt: "Create a step-by-step career milestone roadmap for my target role",
    icon: GitFork,
  },
  {
    label: "Analyze my GitHub",
    prompt: "Analyze my GitHub repositories, code patterns, and contribution velocity",
    icon: GithubIcon,
  },
  {
    label: "Mock interview",
    prompt: "Generate technical mock interview questions for my target role",
    icon: HelpCircle,
  },
  {
    label: "Learn AI dev",
    prompt: "Guide me through learning practical AI development and modern LLMs",
    icon: Code2,
  },
]

export default function DashboardPage() {
  const { profile } = useProfile()
  const [greeting, setGreeting] = useState("Good evening")
  const [promptText, setPromptText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const displayName = profile?.nickname || profile?.name || "Learner"
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "EV"

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handlePromptSubmit = async (promptToSubmit?: string) => {
    const content = (promptToSubmit || promptText).trim()
    if (!content || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setPromptText("")
    setIsTyping(true)

    try {
      const response = await sendChatMessage(content)
      if (response?.aiMessage) {
        setMessages((prev) => [...prev, response.aiMessage])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: `I'd be glad to assist with "${content}", ${displayName}! Let's focus on building actionable projects for ${profile.primaryGoal || "Career Growth"}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `I'm EV AI. Query received: "${content}". Your personalization context has been updated.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center min-h-[calc(100vh-64px)]">

      {/* ── Hero Greeting ──────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
        }}
        className="w-full flex flex-col items-center text-center mt-6 mb-10"
      >
        {/* EV AI Mark */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="mb-6"
        >
          <div className="w-12 h-12 bg-black rounded-[4px] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-mono text-[13px] font-bold tracking-widest">EV</span>
          </div>
          <span className="label-mono text-[#526E7A] tracking-[0.2em]">AI CAREER NAVIGATOR</span>
        </motion.div>

        {/* Greeting Headline */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-[36px] sm:text-[44px] font-light tracking-tighter text-[#000000] mb-2 leading-tight"
        >
          {greeting},{" "}
          <span className="font-semibold">{displayName}</span>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-[15px] text-[#526E7A] mb-0 font-normal"
        >
          How can I empower your learning journey today?
        </motion.p>
      </motion.div>

      {/* ── Conversation Messages ───────────────────────── */}
      {messages.length > 0 && (
        <div className="w-full space-y-4 mb-8 overflow-y-auto max-h-[420px] scrollbar-thin p-1">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {m.role === "ai" ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-black text-white text-[10px] font-mono font-bold">
                  EV
                </div>
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#3B82F6] text-white text-[10px] font-mono font-bold">
                  {userInitials}
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-2xl rounded-[4px] px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-black text-white"
                    : "bg-white border border-black/[0.07] text-[#000000]"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <span className={`block font-mono text-[9px] mt-1.5 tracking-wider ${
                  m.role === "user" ? "text-white/50 text-right" : "text-[#526E7A]"
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-[4px] bg-black text-white text-[10px] font-mono font-bold">
                EV
              </div>
              <div className="rounded-[4px] bg-white border border-black/[0.07] px-4 py-3 text-xs text-[#526E7A] flex items-center gap-2">
                <Sparkles className="size-3 text-[#3B82F6] animate-spin" />
                <span className="font-mono tracking-wider">GENERATING RESPONSE...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ── AI Input Bar ────────────────────────────────── */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => {
          e.preventDefault()
          handlePromptSubmit()
        }}
        className="w-full bg-white border border-black/[0.09] rounded-[4px] flex items-center gap-3 px-5 py-3 mb-5 shadow-float"
      >
        {/* EV Mark */}
        <div className="w-6 h-6 bg-black rounded-[3px] flex items-center justify-center shrink-0">
          <span className="text-white font-mono text-[8px] font-bold">EV</span>
        </div>

        {/* Input */}
        <input
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="What would you like to achieve today?"
          className="flex-1 bg-transparent text-[15px] text-[#000000] placeholder:text-[#A0A0A0] outline-none border-none"
        />

        {/* Send */}
        <Button
          type="submit"
          disabled={!promptText.trim() || isTyping}
          size="icon"
          className="size-9 rounded-[4px] bg-black hover:bg-[#1a1a1a] text-white disabled:opacity-30"
        >
          <Send className="size-3.5" />
        </Button>
      </motion.form>

      {/* ── Quick Action Chips ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-center gap-2 w-full mb-10"
      >
        {QUICK_ACTIONS.map((chip) => {
          const Icon = chip.icon
          return (
            <button
              key={chip.label}
              onClick={() => handlePromptSubmit(chip.prompt)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.08] rounded-[4px] text-[13px] text-[#526E7A] hover:text-black hover:border-black/20 hover:bg-[#F8F8F8] transition-all duration-150 cursor-pointer"
            >
              <Icon className="size-3.5" />
              <span>{chip.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* ── Footer ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 mt-auto pb-6"
      >
        <Lock className="size-3 text-[#A0A0A0]" />
        <span className="label-mono text-[#A0A0A0]">YOUR DATA IS PRIVATE AND SECURE</span>
      </motion.div>
    </div>
  )
}
