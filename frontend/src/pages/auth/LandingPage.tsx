import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Map,
  FileText,
  GitBranch,
  BarChart3,
  MessageCircle,
  ChevronDown,
  Star,
  ArrowRight,
  Cpu,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react"

import { PUBLIC_ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"

const SUBTITLES = [
  "Builds your personalized career roadmap",
  "Optimizes your resume for ATS algorithms",
  "Analyzes your GitHub code & contributions",
  "Accelerates your technical skill velocity",
]

const FEATURES = [
  {
    icon: Cpu,
    title: "AI Career Intelligence",
    description: "Personalized career guidance powered by models tuned on career trajectories.",
  },
  {
    icon: Map,
    title: "Dynamic Milestones",
    description: "Adaptive step-by-step learning paths that continuously evolve with your progress.",
  },
  {
    icon: FileText,
    title: "ATS Resume Builder",
    description: "Quantified achievement scoring and real-time AI impact suggestions.",
  },
  {
    icon: GitBranch,
    title: "GitHub Analytics",
    description: "Deep codebase evaluation, commit velocity tracking, and language breakdown metrics.",
  },
  {
    icon: BarChart3,
    title: "Velocity Analytics",
    description: "Track career health score growth, module completions, and daily learning momentum.",
  },
  {
    icon: MessageCircle,
    title: "24/7 AI Career Mentor",
    description: "Instant conversational advice for technical architecture, interview prep, and strategy.",
  },
]

const STEPS = [
  {
    number: "01",
    title: "Define Your Target Role",
    description: "Select your desired title, current skills, and preferred learning velocity.",
    icon: Brain,
  },
  {
    number: "02",
    title: "EV Generates Your System",
    description: "Our AI constructs a custom milestone roadmap, resume score audit, and daily actions.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Execute & Evolve",
    description: "Complete milestones, track real-time analytics, and land your ideal role.",
    icon: TrendingUp,
  },
]

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Frontend Architect",
    quote: "EV completely transformed how I approach my career. The AI roadmap saved me 6 months of aimless learning.",
    stars: 5,
    avatar: "SK",
  },
  {
    name: "Marcus T.",
    role: "Data Engineer",
    quote: "My resume ATS score jumped from 61 to 89 in two weeks. The AI action suggestions were phenomenal.",
    stars: 5,
    avatar: "MT",
  },
  {
    name: "Priya M.",
    role: "Product Manager",
    quote: "The GitHub analytics and career health gauge gave me complete confidence going into interviews.",
    stars: 5,
    avatar: "PM",
  },
]

export default function LandingPage() {
  const [subtitleIndex, setSubtitleIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] text-[#000000] overflow-x-hidden">

      {/* ── 1. Header ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-nav bg-white border-b border-black/[0.08] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-black rounded-[3px] flex items-center justify-center">
              <span className="text-white font-mono text-[11px] font-bold tracking-widest">EV</span>
            </div>
            <span className="font-mono text-sm font-bold tracking-[0.14em] uppercase text-black">EV AI</span>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="min-h-[44px]">
              <Link to={PUBLIC_ROUTES.login}>Sign In</Link>
            </Button>
            <Button asChild size="sm" className="min-h-[44px]">
              <Link to={PUBLIC_ROUTES.register}>
                Get Started <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-[3px] border border-black/[0.08] bg-white px-4 py-1.5 label-mono text-[#526E7A] shadow-sm">
            <Sparkles className="size-3.5 text-[#3B82F6]" />
            <span>EMPOWER. LEARN. EVOLVE.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tighter text-[#000000] leading-tight">
            Your AI-First Personalized <br />
            <span className="font-semibold text-black">Career Navigator</span>
          </h1>

          <div className="h-10 text-base font-mono text-[#526E7A] flex items-center justify-center font-semibold">
            <AnimatePresence mode="wait">
              <motion.p
                key={subtitleIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {SUBTITLES[subtitleIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mx-auto max-w-xl text-[#526E7A] text-sm leading-relaxed sm:text-base">
            EV is a minimalist engineering-grade workspace that constructs custom milestone roadmaps, audits resume ATS impact, and accelerates your learning velocity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="min-h-[48px] px-8 text-base">
              <Link to={PUBLIC_ROUTES.register}>
                Start Free Workspace <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[48px]">
              <a href="#features">Explore AI System</a>
            </Button>
          </div>
        </motion.div>

        <a href="#features" className="text-[#526E7A] hover:text-black mt-16 transition-colors" aria-label="Scroll down">
          <ChevronDown className="size-6 animate-bounce" />
        </a>
      </section>

      {/* ── 3. Features Section ────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="label-mono text-[#3B82F6] font-bold">AI CAPABILITIES</span>
          <h2 className="text-3xl font-light tracking-tighter text-[#000000]">Engineered for Systematic Career Growth</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="clean-card p-6 space-y-3 bg-white border border-black/[0.08] rounded-[4px]"
              >
                <div className="inline-flex p-3 rounded-[3px] bg-[#F5F5F5] text-black border border-black/[0.06]">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold text-[#000000]">{feature.title}</h3>
                <p className="text-[#526E7A] text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── 4. How It Works ────────────────────────────────────────────────────── */}
      <section className="border-y border-black/[0.08] bg-white py-24">
        <div className="mx-auto max-w-6xl px-6 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="label-mono text-[#10B981] font-bold">3-STEP WORKFLOW</span>
            <h2 className="text-3xl font-light tracking-tighter text-[#000000]">How EV Personalizes Your Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="clean-card p-6 space-y-3 relative bg-[#F5F5F5] border border-black/[0.08] rounded-[4px]">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-3xl font-bold text-[#000000]">{step.number}</span>
                    <div className="p-2.5 rounded-[3px] bg-black text-white">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#000000]">{step.title}</h3>
                  <p className="text-[#526E7A] text-xs leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="label-mono text-[#526E7A]">TESTIMONIALS</span>
          <h2 className="text-3xl font-light tracking-tighter text-[#000000]">Validated by Engineers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="clean-card p-6 space-y-3 bg-white border border-black/[0.08] rounded-[4px]">
              <div className="flex gap-1 text-black">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#333333] leading-relaxed font-medium">"{item.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-black/[0.06]">
                <div className="size-8 rounded-[3px] bg-black flex items-center justify-center font-mono font-bold text-white text-xs">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#000000]">{item.name}</p>
                  <p className="label-mono text-[#526E7A] text-[9px]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.08] bg-black py-8 px-6 text-xs text-white">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-[2px] bg-white font-mono font-bold text-black text-[0.65rem]">
              EV
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-white">EV AI SYSTEM</span>
          </div>
          <p className="label-mono text-[#A0A0A0]">© {new Date().getFullYear()} EV AI INC. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}
