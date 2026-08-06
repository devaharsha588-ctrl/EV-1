import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { toast } from "sonner"

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

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Left: Form Panel */}
      <div className="flex flex-1 items-center justify-center p-8 lg:max-w-[520px]">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center">
                <span className="text-white font-mono text-[11px] font-bold tracking-widest">EV</span>
              </div>
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase">EV AI</span>
            </div>
            <h1 className="text-[28px] font-light tracking-tighter text-[#000000]">Welcome back</h1>
            <p className="text-sm text-[#526E7A]">Sign in to continue your career evolution</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="label-mono">EMAIL ADDRESS</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="alex@example.com"
                aria-invalid={!!errors.email}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-xs text-[#EF4444] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="label-mono">PASSWORD</label>
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
                  className="pr-10 mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#526E7A] hover:text-black absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#EF4444] mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              size="lg"
              className="w-full mt-2"
            >
              {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative text-center">
            <div className="absolute inset-0 top-1/2 border-t border-black/[0.08]" />
            <span className="bg-[#F5F5F5] relative z-10 px-3 label-mono text-[#526E7A]">
              OR CONTINUE WITH
            </span>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoginMutation.isPending}
            >
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleGithubSignIn}
              disabled={githubLoginMutation.isPending}
            >
              GitHub
            </Button>
          </div>

          <p className="text-[#526E7A] text-center text-sm">
            Don't have an account?{" "}
            <Link to={PUBLIC_ROUTES.register} className="text-[#000000] font-semibold hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Black Panel */}
      <div className="hidden lg:flex flex-1 bg-black items-center justify-center p-12 relative overflow-hidden">
        {/* Schematic Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-white rounded-[4px] flex items-center justify-center mx-auto mb-8">
            <span className="text-black font-mono text-[20px] font-bold tracking-widest">EV</span>
          </div>
          <h2 className="text-[32px] font-light tracking-tighter text-white mb-3">
            Empower.<br />
            <span className="font-bold">Evolve.</span>
          </h2>
          <p className="text-[#A0A0A0] text-sm leading-relaxed font-light">
            AI-powered career navigation for the next generation of engineers and developers.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10 border border-white/10 rounded-[4px] p-5">
            {[
              { value: "12K+", label: "USERS" },
              { value: "94%", label: "PLACEMENT" },
              { value: "4.9★", label: "RATING" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-mono text-[22px] font-bold text-white">{s.value}</p>
                <p className="label-mono text-[#526E7A] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
