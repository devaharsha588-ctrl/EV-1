import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const rightContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const popVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Left: Form Panel */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:max-w-[520px]"
      >
        <div className="w-full max-w-[400px] space-y-7">

          {/* Brand Header */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center shadow-md cursor-pointer"
              >
                <span className="text-white font-mono text-[11px] font-bold tracking-widest">EV</span>
              </motion.div>
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-black">EV AI</span>
            </div>

            <h1 className="text-[32px] font-light tracking-tighter text-[#000000] leading-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[#526E7A]">
              Sign in to continue your career evolution
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={itemVariants} className="space-y-1">
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

            <motion.div variants={itemVariants} className="space-y-1">
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

            <motion.div variants={itemVariants}>
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
          <motion.div variants={itemVariants} className="relative text-center">
            <div className="absolute inset-0 top-1/2 border-t border-black/[0.08]" />
            <span className="bg-[#F5F5F5] relative z-10 px-3 label-mono text-[#526E7A]">
              OR CONTINUE WITH
            </span>
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
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
          <motion.div variants={itemVariants}>
            <p className="text-[#526E7A] text-center text-sm">
              Don't have an account?{" "}
              <Link to={PUBLIC_ROUTES.register} className="text-[#000000] font-semibold hover:underline">
                Create free account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: Black Panel with Animated Text Elements */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rightContainerVariants}
        className="hidden lg:flex flex-1 bg-black items-center justify-center p-12 relative overflow-hidden select-none"
      >
        {/* Schematic Grid Background with Subtle Zoom */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.06 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center max-w-sm">

          {/* White EV Logo Badge */}
          <motion.div
            variants={popVariants}
            whileHover={{ scale: 1.06, rotate: -2 }}
            className="w-16 h-16 bg-white rounded-[4px] flex items-center justify-center mx-auto mb-8 shadow-2xl cursor-pointer"
          >
            <span className="text-black font-mono text-[22px] font-bold tracking-widest">EV</span>
          </motion.div>

          {/* Headline Text Animations */}
          <motion.div variants={itemVariants} className="space-y-1 mb-4">
            <h2 className="text-[38px] font-light tracking-tighter text-white leading-tight">
              Empower.
            </h2>
            <h2 className="text-[38px] font-bold tracking-tighter text-white leading-tight">
              Evolve.
            </h2>
          </motion.div>

          {/* Paragraph Text Animation */}
          <motion.div variants={itemVariants}>
            <p className="text-[#A0A0A0] text-sm leading-relaxed font-light px-2">
              AI-powered career navigation for the next generation of engineers and developers.
            </p>
          </motion.div>

          {/* Stats Box with Staggered Items */}
          <motion.div
            variants={popVariants}
            className="grid grid-cols-3 gap-4 mt-10 border border-white/10 rounded-[4px] p-5 bg-white/[0.02] backdrop-blur-sm shadow-xl"
          >
            {[
              { value: "12K+", label: "USERS" },
              { value: "94%", label: "PLACEMENT" },
              { value: "4.9★", label: "RATING" },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="text-center cursor-default"
              >
                <p className="font-mono text-[22px] font-bold text-white tracking-tight">
                  {s.value}
                </p>
                <p className="label-mono text-[#526E7A] mt-1.5 text-[9px] tracking-[0.14em]">
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
