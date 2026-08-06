import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, ArrowRight, Activity } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGoogleLoginMutation, useGithubLoginMutation, useLoginMutation } from "@/hooks/useAuth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const googleLoginMutation = useGoogleLoginMutation()
  const githubLoginMutation = useGithubLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(data)
      toast.success("Welcome back! Redirecting...")
      navigate(PROTECTED_ROUTES.dashboard)
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials. Please check your email and password.")
    }
  }

  const handleGoogleSignIn = async () => {
    toast.info("Connecting to Google Sign-In...")
    await googleLoginMutation.mutateAsync()
  }

  const handleGithubSignIn = async () => {
    toast.info("Connecting to GitHub Sign-In...")
    await githubLoginMutation.mutateAsync()
  }

  // Stagger animation variants for left panel
  const leftContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  }

  const textFadeUpVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
  }

  // Right panel rich animation variants
  const rightContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const textRevealVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6 },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const statsBoxVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 25 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.55 },
    },
  }

  const statItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Left: Form Panel */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={leftContainerVariants}
        className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:max-w-[520px]"
      >
        <div className="w-full max-w-[400px] space-y-6">

          {/* Brand Header */}
          <motion.div variants={textFadeUpVariants} className="space-y-1">
            <div className="flex items-center gap-2.5 mb-5">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center shadow-md cursor-pointer"
              >
                <span className="text-white font-mono text-[11px] font-bold tracking-widest">EV</span>
              </motion.div>
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-black">EV AI</span>
            </div>

            <motion.div variants={textFadeUpVariants}>
              <h1 className="text-[32px] font-light tracking-tighter text-[#000000] leading-tight">
                Welcome back
              </h1>
            </motion.div>

            <motion.div variants={textFadeUpVariants}>
              <p className="text-sm text-[#526E7A]">
                Sign in to continue your career evolution
              </p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={textFadeUpVariants} className="space-y-1">
              <label className="label-mono text-[#000000] font-semibold text-xs block">EMAIL ADDRESS</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="alex@example.com"
                aria-invalid={!!errors.email}
                className="mt-1 h-11 transition-all focus:ring-2 focus:ring-[#3B82F6]"
              />
              {errors.email && (
                <p className="text-xs text-[#EF4444] mt-1 font-medium">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={textFadeUpVariants} className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="label-mono text-[#000000] font-semibold text-xs">PASSWORD</label>
                <a href="#forgot" className="text-xs text-[#3B82F6] hover:underline font-mono">
                  FORGOT?
                </a>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="pr-10 mt-1 h-11 transition-all focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#526E7A] hover:text-black absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#EF4444] mt-1 font-medium">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.div variants={textFadeUpVariants}>
              <Button
                type="submit"
                disabled={isSubmitting || loginMutation.isPending}
                size="lg"
                className="w-full mt-2 min-h-[46px] text-sm font-semibold shadow-md active:scale-[0.98] transition-transform"
              >
                {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={textFadeUpVariants} className="relative text-center">
            <div className="absolute inset-0 top-1/2 border-t border-black/[0.08]" />
            <span className="bg-[#F5F5F5] relative z-10 px-3 label-mono text-[#526E7A]">
              OR CONTINUE WITH
            </span>
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div variants={textFadeUpVariants} className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoginMutation.isPending}
              className="min-h-[44px] hover:border-black/30 transition-colors"
            >
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleGithubSignIn}
              disabled={githubLoginMutation.isPending}
              className="min-h-[44px] hover:border-black/30 transition-colors"
            >
              GitHub
            </Button>
          </motion.div>

          {/* Register Link */}
          <motion.div variants={textFadeUpVariants}>
            <p className="text-[#526E7A] text-center text-sm">
              Don't have an account?{" "}
              <Link to={PUBLIC_ROUTES.register} className="text-[#000000] font-semibold hover:underline">
                Create free account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: Black Side Panel with Ultra-Rich Animated Visuals */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rightContainerVariants}
        className="hidden lg:flex flex-1 bg-black items-center justify-center p-12 relative overflow-hidden select-none"
      >
        {/* Animated Background Laser Grid with Continuous Scanning Pulse */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: [1.15, 1, 1.02, 1], opacity: [0, 0.08, 0.06] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Ambient Glowing Halo Behind Logo */}
        <div className="absolute size-72 rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />

        <div className="relative z-10 text-center max-w-sm space-y-7">

          {/* White EV Logo Badge with Continuous Float & Pulse Glow */}
          <motion.div
            variants={badgeVariants}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.12, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-white rounded-[4px] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,255,255,0.25)] cursor-pointer relative group"
          >
            <span className="text-black font-mono text-[22px] font-bold tracking-widest group-hover:scale-110 transition-transform">EV</span>
            <span className="absolute -top-1 -right-1 size-3 bg-[#3B82F6] rounded-full border-2 border-black animate-ping" />
            <span className="absolute -top-1 -right-1 size-3 bg-[#3B82F6] rounded-full border-2 border-black" />
          </motion.div>

          {/* System Status Pill */}
          <motion.div variants={textRevealVariants} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 backdrop-blur-md">
            <Activity className="size-3 text-[#10B981] animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-[#A0A0A0] tracking-[0.18em] uppercase">EV AI CORE // ONLINE</span>
          </motion.div>

          {/* Headline 1: Empower */}
          <motion.div variants={textRevealVariants}>
            <h2 className="text-[44px] font-extralight tracking-tighter text-white leading-none">
              Empower.
            </h2>
          </motion.div>

          {/* Headline 2: Evolve (with Glowing Blue Gradient Text) */}
          <motion.div variants={textRevealVariants}>
            <h2 className="text-[44px] font-bold tracking-tighter leading-none bg-gradient-to-r from-white via-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Evolve.
            </h2>
          </motion.div>

          {/* Paragraph Description with Blur-Unveil */}
          <motion.div variants={textRevealVariants}>
            <p className="text-[#A0A0A0] text-sm leading-relaxed font-normal px-2">
              AI-powered career navigation & milestone trajectory for engineers.
            </p>
          </motion.div>

          {/* Interactive Stats Box with Glowing Sheen & Staggered Pop-in */}
          <motion.div
            variants={statsBoxVariants}
            className="grid grid-cols-3 gap-3 border border-white/15 rounded-[4px] p-5 bg-white/[0.03] backdrop-blur-md shadow-2xl hover:border-[#3B82F6]/50 transition-colors group"
          >
            {[
              { value: "12K+", label: "USERS", color: "#FFFFFF" },
              { value: "94%", label: "PLACEMENT", color: "#3B82F6" },
              { value: "4.9★", label: "RATING", color: "#10B981" },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={statItemVariants}
                whileHover={{ y: -4, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="text-center cursor-default p-1"
              >
                <p className="font-mono text-[22px] font-bold tracking-tight" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="label-mono text-[#A0A0A0] mt-1 text-[9px] tracking-[0.16em] uppercase">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}
