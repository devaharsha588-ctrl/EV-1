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
    <div className="flex min-h-screen bg-[#0D0F14] text-[#F5F7FA] items-center justify-center p-4 ambient-light">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#5B7CFA] text-sm font-bold text-white mx-auto">
            EV
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FA] tracking-tight">Welcome back</h1>
          <p className="text-xs text-[#A7B0C0]">Sign in to continue your career evolution</p>
        </div>

        <div className="clean-card p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FA]">Email</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="alex@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-[#FF6B6B]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#F5F7FA]">Password</label>
                <a href="#forgot" className="text-xs text-[#5B7CFA] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#A7B0C0] hover:text-[#F5F7FA] absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#FF6B6B]">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              size="lg"
              className="w-full"
            >
              {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign In"}{" "}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>

          <div className="relative text-center text-xs">
            <span className="bg-[#151922] text-[#A7B0C0] font-mono relative z-10 px-3">
              OR CONTINUE WITH
            </span>
            <div className="border-white/5 absolute inset-0 top-1/2 border-t" />
          </div>

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
        </div>

        <p className="text-[#A7B0C0] text-center text-xs">
          Don't have an account?{" "}
          <Link to={PUBLIC_ROUTES.register} className="text-[#5B7CFA] font-semibold hover:underline">
            Create free account
          </Link>
        </p>
      </div>
    </div>
  )
}
