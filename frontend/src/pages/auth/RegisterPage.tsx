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
import { useGoogleLoginMutation, useGithubLoginMutation, useRegisterMutation } from "@/hooks/useAuth"

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const googleLoginMutation = useGoogleLoginMutation()
  const githubLoginMutation = useGithubLoginMutation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const passwordVal = watch("password") || ""
  const passwordStrength = Math.min(
    4,
    (passwordVal.length >= 6 ? 1 : 0) +
      (/[A-Z]/.test(passwordVal) ? 1 : 0) +
      (/[0-9]/.test(passwordVal) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(passwordVal) ? 1 : 0),
  )

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast.success("Account created! Starting onboarding...")
      navigate(PROTECTED_ROUTES.onboarding)
    } catch (err: any) {
      toast.error(err?.message || "Registration failed. Please try again.")
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  }

  const rightContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
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
        className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:max-w-[520px]"
      >
        <div className="w-full max-w-[400px] space-y-6">
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-1">
            <div className="flex items-center gap-2.5 mb-5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center cursor-pointer"
              >
                <span className="text-white font-mono text-[11px] font-bold tracking-widest">EV</span>
              </motion.div>
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-black">EV AI</span>
            </div>
            <h1 className="text-[32px] font-light tracking-tighter text-[#000000]">
              Create your account
            </h1>
            <p className="text-sm text-[#526E7A]">
              Start your AI-powered career evolution
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="label-mono text-[#000000] font-semibold text-xs block">FULL NAME</label>
              <Input {...register("name")} placeholder="Harsha Deva" aria-invalid={!!errors.name} className="h-11" />
              {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <label className="label-mono text-[#000000] font-semibold text-xs block">EMAIL ADDRESS</label>
              <Input {...register("email")} type="email" placeholder="alex@example.com" aria-invalid={!!errors.email} className="h-11" />
              {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <label className="label-mono text-[#000000] font-semibold text-xs block">PASSWORD</label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#526E7A] hover:text-black absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordVal && (
                <div className="flex gap-1 pt-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength
                          ? passwordStrength <= 2
                            ? "bg-[#F59E0B]"
                            : "bg-[#10B981]"
                          : "bg-black/10"
                      }`}
                    />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-xs text-[#EF4444] mt-1">{errors.password.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <label className="label-mono text-[#000000] font-semibold text-xs block">CONFIRM PASSWORD</label>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                className="h-11"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#EF4444] mt-1">{errors.confirmPassword.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                size="lg"
                className="w-full mt-2 min-h-[46px] shadow-md active:scale-[0.98] transition-transform"
              >
                {isSubmitting || registerMutation.isPending ? "Creating Account..." : "Get Started"}{" "}
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

          {/* OAuth */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoginMutation.isPending}
              className="min-h-[44px]"
            >
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleGithubSignIn}
              disabled={githubLoginMutation.isPending}
              className="min-h-[44px]"
            >
              GitHub
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-[#526E7A] text-center text-sm">
              Already have an account?{" "}
              <Link to={PUBLIC_ROUTES.login} className="text-[#000000] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: Black Panel */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rightContainerVariants}
        className="hidden lg:flex flex-1 bg-black items-center justify-center p-12 relative overflow-hidden select-none"
      >
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
          <motion.div
            variants={popVariants}
            whileHover={{ scale: 1.06, rotate: -2 }}
            className="w-16 h-16 bg-white rounded-[4px] flex items-center justify-center mx-auto mb-8 shadow-2xl cursor-pointer"
          >
            <span className="text-black font-mono text-[22px] font-bold tracking-widest">EV</span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-[36px] font-light tracking-tighter text-white leading-tight mb-3">
              Accelerate your<br />
              <span className="font-bold">Career Trajectory.</span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-[#A0A0A0] text-sm leading-relaxed font-light px-2">
              Custom milestone roadmaps, live GitHub intelligence, and ATS resume optimization in one platform.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
