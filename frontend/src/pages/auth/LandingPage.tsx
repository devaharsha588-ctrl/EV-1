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
import { ParticleField } from "@/components/ui/particle-field"

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
    <div className="relative min-h-screen bg-[#0D0F14] text-[#F5F7FA] overflow-x-hidden ambient-light">
      <ParticleField count={30} />

      {/* ── 1. Header ──────────────────────────────────────────────────────────── */}
      <nav className="glass-surface sticky top-0 z-nav border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#5B7CFA] text-xs font-bold text-white">
              EV
            </div>
            <span className="text-base font-semibold text-[#F5F7FA]">Empower & Evolve</span>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to={PUBLIC_ROUTES.login}>Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={PUBLIC_ROUTES.register}>
                Get Started <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#151922] px-4 py-1.5 text-xs font-mono text-[#5B7CFA]">
            <Sparkles className="size-3.5" />
            <span>Empower. Learn. Evolve.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F5F7FA] leading-tight">
            Your AI-First Personalized <br />
            <span className="text-[#5B7CFA]">Career Companion</span>
          </h1>

          <div className="h-10 text-lg font-mono text-[#A7B0C0] flex items-center justify-center">
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

          <p className="mx-auto max-w-xl text-[#A7B0C0] text-sm leading-relaxed sm:text-base">
            EV is a distraction-free AI workspace that constructs custom milestone roadmaps, audits resume ATS impact, and accelerates your learning velocity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link to={PUBLIC_ROUTES.register}>
                Start Free Workspace <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Explore AI System</a>
            </Button>
          </div>
        </div>

        <a href="#features" className="text-[#A7B0C0] hover:text-[#F5F7FA] mt-16 transition-colors">
          <ChevronDown className="size-6 animate-bounce" />
        </a>
      </section>

      {/* ── 3. Features Section ────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-[#5B7CFA]">AI CAPABILITIES</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#F5F7FA]">Purpose-Built for Calm Career Growth</h2>
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
                transition={{ delay: idx * 0.06 }}
                className="clean-card p-6 space-y-3"
              >
                <div className="inline-flex p-3 rounded-xl bg-[#1C2230] text-[#5B7CFA]">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F5F7FA]">{feature.title}</h3>
                <p className="text-[#A7B0C0] text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── 4. How It Works ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#151922] py-24">
        <div className="mx-auto max-w-6xl px-6 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-[#32D296]">3-STEP WORKFLOW</span>
            <h2 className="text-3xl font-bold tracking-tight text-[#F5F7FA]">How EV Personalizes Your Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="clean-card p-6 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-3xl font-extrabold text-[#5B7CFA]">{step.number}</span>
                    <div className="p-2.5 rounded-xl bg-[#1C2230] text-[#5B7CFA]">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#F5F7FA]">{step.title}</h3>
                  <p className="text-[#A7B0C0] text-xs leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-[#F5F7FA]">Validated by Professionals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="clean-card p-6 space-y-3">
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#F5F7FA] leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="size-8 rounded-full bg-[#5B7CFA] flex items-center justify-center font-bold text-white text-xs">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F7FA]">{item.name}</p>
                  <p className="text-[0.7rem] text-[#A7B0C0]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#0B0D12] py-8 px-6 text-xs text-[#A7B0C0]">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-[#5B7CFA] font-bold text-white text-[0.65rem]">
              EV
            </div>
            <span className="font-semibold text-[#F5F7FA]">Empower & Evolve</span>
          </div>
          <p>© {new Date().getFullYear()} EV AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
