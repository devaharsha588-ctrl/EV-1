import { Navigate, Outlet, useLocation } from "react-router-dom"

import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/routes"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { Loader } from "@/components/ui/loader"

export function ProtectedRoute() {
  const { authGuardEnabled, isAuthenticated, isLoading } = useAuth()
  const { isOnboardingCompleted, isLoading: isProfileLoading } = useProfile()
  const location = useLocation()

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090B]">
        <Loader className="text-[#5B7CFA]" label="Authenticating session..." />
      </div>
    )
  }

  if (authGuardEnabled && !isAuthenticated) {
    return <Navigate replace to={PUBLIC_ROUTES.login} state={{ from: location }} />
  }

  if (isAuthenticated && !isOnboardingCompleted && location.pathname !== PROTECTED_ROUTES.onboarding) {
    return <Navigate replace to={PROTECTED_ROUTES.onboarding} />
  }

  return <Outlet />
}

