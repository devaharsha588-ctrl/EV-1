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
import { Card } from "@/components/ui/card"
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

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0D0F14] text-[#F5F7FA] ambient-light">
      <Card className="w-full max-w-md space-y-6 p-8 bg-[#151922]">
        <div className="text-center space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#5B7CFA] font-bold text-white mx-auto text-sm">
            EV
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FA]">Create your account</h1>
          <p className="text-xs text-[#A7B0C0]">Start your AI-powered career evolution</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F7FA]">Full Name</label>
            <Input {...register("name")} placeholder="Alex Johnson" aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-[#FF6B6B]">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F7FA]">Email</label>
            <Input {...register("email")} type="email" placeholder="alex@example.com" aria-invalid={!!errors.email} />
            {errors.email && <p className="text-xs text-[#FF6B6B]">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F7FA]">Password</label>
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
            {passwordVal && (
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= passwordStrength
                        ? passwordStrength <= 2
                          ? "bg-[#F6C453]"
                          : "bg-[#32D296]"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            )}
            {errors.password && <p className="text-xs text-[#FF6B6B]">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F7FA]">Confirm Password</label>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-[#FF6B6B]">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            size="lg"
            className="w-full"
          >
            {isSubmitting || registerMutation.isPending ? "Creating Account..." : "Get Started"} <ArrowRight className="ml-2 size-4" />
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

        <p className="text-[#A7B0C0] text-center text-xs">
          Already have an account?{" "}
          <Link to={PUBLIC_ROUTES.login} className="text-[#5B7CFA] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
