import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  FileText,
  GitFork,
  Lock,
  Mic,
  Zap,
  ChevronDown,
  Send,
  Sparkles,
  HelpCircle,
  Code2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import { sendChatMessage } from "@/services/chat.service"

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="size-4 fill-current text-[#38BDF8]" viewBox="0 0 24 24" {...props}>
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
    icon: (props: React.SVGProps<SVGSVGElement>) => <BookOpen className="size-4 text-[#A78BFA] stroke-[2px]" {...props} />,
  },
  {
    label: "Improve my resume",
    prompt: "Analyze and optimize my resume for ATS scoring and impact",
    icon: (props: React.SVGProps<SVGSVGElement>) => <FileText className="size-4 text-[#A78BFA] stroke-[2px]" {...props} />,
  },
  {
    label: "Plan my roadmap",
    prompt: "Create a step-by-step career milestone roadmap for my target role",
    icon: (props: React.SVGProps<SVGSVGElement>) => <GitFork className="size-4 text-[#F59E0B] stroke-[2px]" {...props} />,
  },
  {
    label: "Analyze my GitHub",
    prompt: "Analyze my GitHub repositories, code patterns, and contribution velocity",
    icon: GithubIcon,
  },
  {
    label: "Generate interview questions",
    prompt: "Generate technical mock interview questions for my target role",
    icon: (props: React.SVGProps<SVGSVGElement>) => <HelpCircle className="size-4 text-[#34D399] stroke-[2px]" {...props} />,
  },
  {
    label: "Help me learn AI",
    prompt: "Guide me through learning practical AI development and modern LLMs",
    icon: (props: React.SVGProps<SVGSVGElement>) => <Code2 className="size-4 text-[#38BDF8] stroke-[2px]" {...props} />,
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
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

    // Call backend chat API
    try {
      await sendChatMessage("home-session", content, "user")
    } catch {
      // Backend handles fallback gracefully
    }

    // AI response simulation using profile context
    setTimeout(async () => {
      const targetGoal = profile.primaryGoal || "Software Engineering"
      let aiResponseContent = ""

      if (content.toLowerCase().includes("resume")) {
        aiResponseContent = `Here is your **Resume Analysis & Optimization Guide** for **${displayName}**:\n\n1. **Quantified Metrics**: Ensure your achievement bullets contain clear numbers (e.g. "Improved page speed by 40%").\n2. **Target Keywords**: Align technical skills directly with your goal as a **${targetGoal}**.\n3. **ATS Format**: Use single-column standard sections for optimal scanner compatibility.`
      } else if (content.toLowerCase().includes("roadmap")) {
        aiResponseContent = `Here is your customized **Learning Roadmap** for **${targetGoal}**:\n\n1. **Phase 1: Core Fundamentals**\n   • Master core specifications, data structures, and state logic.\n\n2. **Phase 2: Production Engineering**\n   • Build full-stack applications with modern APIs and automated testing.\n\n3. **Phase 3: Career Deployment**\n   • Deploy production projects, pin top GitHub repositories, and prepare interview responses.`
      } else if (content.toLowerCase().includes("github")) {
        aiResponseContent = `Here is your **GitHub Intelligence Insights** for **${displayName}**:\n\n• **Repository Structure**: Ensure your pinned projects feature clean README docs and deployment links.\n• **Commit Consistency**: Maintain a steady commit frequency to demonstrate active development.\n• **Tech Diversity**: Showcase projects leveraging modern frameworks.`
      } else {
        aiResponseContent = `I am ready to empower your journey, **${displayName}**! Based on your target goal of **${targetGoal}** (${profile.weeklyHours}h/week commitment), here is what I recommend:\n\n1. **Daily Focus**: Focus on hands-on project implementations.\n2. **Skill Verification**: Test your concepts with mock interview challenges.\n\nHow else can I assist your learning today?`
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)

      try {
        await sendChatMessage("home-session", aiResponseContent, "ai")
      } catch {
        // Ignore fallback errors
      }
    }, 1200)
  }

  const handleChipClick = (prompt: string) => {
    handlePromptSubmit(prompt)
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 flex flex-col items-center min-h-[calc(100vh-5rem)] relative stars-bg">
      {/* ── 1. Hero Greeting Section ────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="w-full max-w-[700px] flex flex-col items-center mx-auto text-center mt-4 mb-6"
      >
        {/* Diamond Sparkle Icon */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="mb-8 relative flex items-center justify-center"
        >
          <div className="size-16 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#4F46E5] to-[#34D399] opacity-35 blur-xl absolute inset-0" />
          <motion.svg
            animate={{ opacity: [0.85, 1, 0.85], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <defs>
              <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
            <path
              d="M 18 0 Q 18 18 36 18 Q 18 18 18 36 Q 18 18 0 18 Q 18 18 18 0 Z"
              fill="url(#sparkleGrad)"
            />
          </motion.svg>
        </motion.div>

        {/* Greeting Headline */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="text-[42px] sm:text-[50px] font-semibold tracking-tight text-[#F8FAFC] mb-2 leading-tight"
        >
          {greeting},{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#34D399] bg-clip-text text-transparent">
            {displayName}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="text-[17px] text-[#94A3B8] mb-8 font-normal"
        >
          How can I empower your learning journey today?
        </motion.p>
      </motion.div>

      {/* ── 2. Active Conversational Workspace ────────────────────────── */}
      {messages.length > 0 && (
        <div className="w-full max-w-3xl space-y-5 mb-8 flex-1 scrollbar-thin overflow-y-auto max-h-[450px] p-2">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {m.role === "ai" ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-bold shadow-md">
                  EV
                </div>
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#312E81] text-xs font-bold text-white shadow-md">
                  {userInitials}
                </div>
              )}

              <div
                className={`max-w-2xl space-y-1.5 rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#5B7CFA] text-white shadow-soft"
                    : "bg-[#18181B] text-[#F8FAFC] border border-white/10 shadow-lg"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <span
                  className={`block font-mono text-[0.65rem] ${
                    m.role === "user" ? "text-white/70 text-right" : "text-[#94A3B8]"
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-bold">
                EV
              </div>
              <div className="rounded-2xl bg-[#18181B] border border-white/10 px-4 py-3 text-xs text-[#94A3B8] flex items-center gap-2">
                <Sparkles className="size-3.5 text-[#34D399] animate-spin" />
                <span className="font-mono">EV AI is generating response...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ── 3. Primary Center AI Input Bar ────────────────────────── */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => {
          e.preventDefault()
          handlePromptSubmit()
        }}
        className="w-full max-w-[700px] h-[64px] exact-pill-input flex items-center gap-3.5 px-6 mb-6 text-left shadow-2xl"
      >
        {/* Sparkle Icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
          <path
            d="M 9 0 Q 9 9 18 9 Q 9 9 9 18 Q 9 9 0 9 Q 9 9 9 0 Z"
            fill="url(#sparkleGrad)"
          />
        </svg>

        {/* Text Input */}
        <input
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="What would you like to achieve today?"
          className="flex-1 bg-transparent text-[16px] text-[#F8FAFC] placeholder:text-[#64748B] outline-none border-none"
        />

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Smart Pill Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] rounded-full px-3.5 py-1.5 text-[14px] text-[#F8FAFC] font-medium cursor-pointer transition-colors">
            <Zap className="size-4 text-[#F8FAFC] fill-current" />
            <span>Smart</span>
            <ChevronDown className="size-3.5 text-[#F8FAFC]" />
          </div>

          {/* Mic Button */}
          <button
            type="button"
            className="size-[40px] rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[#F8FAFC] flex items-center justify-center transition-colors"
            title="Voice input"
          >
            <Mic className="size-4 stroke-[2px]" />
          </button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!promptText.trim() || isTyping}
            size="icon"
            className="size-[40px] rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition-opacity"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </motion.form>

      {/* ── 4. Quick Action Chips Row ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-center gap-[12px] w-full max-w-[700px] mb-8"
      >
        {QUICK_ACTIONS.map((chip) => {
          const Icon = chip.icon
          return (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.prompt)}
              className="exact-suggestion-pill flex items-center gap-2.5 cursor-pointer hover:border-white/20 transition-all"
            >
              <Icon />
              <span>{chip.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* ── 5. Footer Microcopy ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 text-[13px] text-[#64748B] font-normal mt-auto pb-4"
      >
        <Lock className="size-3.5 stroke-[2px]" />
        <span>Your data is private and secure</span>
      </motion.div>
    </div>
  )
}
