import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
  type ReactElement,
} from "react"
import { createBrowserRouter, useRouteError } from "react-router-dom"
import { AlertCircle, RefreshCw } from "lucide-react"

import { Loader } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/routes"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { PublicLayout } from "@/layouts/PublicLayout"
import { ProtectedRoute } from "@/routes/ProtectedRoute"

type LazyPage = LazyExoticComponent<ComponentType<any>>

// Helper to handle dynamic import chunk load failures during deployment updates
function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const pageHasBeenRefreshed = sessionStorage.getItem("ev_chunk_retry_refreshed") === "true"
    try {
      const component = await componentImport()
      sessionStorage.setItem("ev_chunk_retry_refreshed", "false")
      return component
    } catch (error: any) {
      const isChunkError =
        error?.name === "ChunkLoadError" ||
        error?.message?.includes("Failed to fetch dynamically imported module") ||
        error?.message?.includes("Importing a module script failed")

      if (isChunkError && !pageHasBeenRefreshed) {
        sessionStorage.setItem("ev_chunk_retry_refreshed", "true")
        window.location.reload()
        return new Promise(() => {}) // Keep promise pending while page reloads
      }
      throw error
    }
  })
}

const AnalyticsPage = lazyWithRetry(() => import("@/pages/analytics/AnalyticsPage"))
const ChatPage = lazyWithRetry(() => import("@/pages/chat/ChatPage"))
const DashboardPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardPage"))
const GithubPage = lazyWithRetry(() => import("@/pages/github/GithubPage"))
const LandingPage = lazyWithRetry(() => import("@/pages/auth/LandingPage"))
const LoginPage = lazyWithRetry(() => import("@/pages/auth/LoginPage"))
const NotFoundPage = lazyWithRetry(() => import("@/pages/NotFoundPage"))
const OnboardingPage = lazyWithRetry(() => import("@/pages/onboarding/OnboardingPage"))
const ProfilePage = lazyWithRetry(() => import("@/pages/profile/ProfilePage"))
const RegisterPage = lazyWithRetry(() => import("@/pages/auth/RegisterPage"))
const ResumePage = lazyWithRetry(() => import("@/pages/resume/ResumePage"))
const RoadmapPage = lazyWithRetry(() => import("@/pages/roadmap/RoadmapPage"))
const SettingsPage = lazyWithRetry(() => import("@/pages/settings/SettingsPage"))

function RouteFallback() {
  return (
    <div className="grid min-h-64 place-items-center">
      <Loader className="text-primary" label="Loading route" />
    </div>
  )
}

function RouteErrorBoundary() {
  const error: any = useRouteError()
  const isChunkError =
    error?.message?.includes("Failed to fetch dynamically imported module") ||
    error?.message?.includes("Importing a module script failed")

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 text-[#000000]">
      <div className="w-full max-w-md bg-white border border-black/10 rounded-[6px] p-6 shadow-xl space-y-4 text-center">
        <div className="w-10 h-10 bg-black rounded-[4px] flex items-center justify-center mx-auto mb-2">
          <AlertCircle className="size-5 text-white" />
        </div>
        <span className="label-mono text-[#526E7A] text-[10px]">EV AI SYSTEM // ROUTE ERROR</span>
        <h1 className="text-xl font-bold text-black tracking-tight">
          {isChunkError ? "New Update Available" : "Application Error"}
        </h1>
        <p className="text-xs text-[#526E7A] leading-relaxed">
          {isChunkError
            ? "A new version of EV AI was deployed. Please reload the page to load the latest components."
            : error?.message || "An unexpected error occurred while loading this page."}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-black hover:bg-[#1a1a1a] text-white font-mono text-xs py-2.5 rounded-[4px] flex items-center justify-center gap-2"
        >
          <RefreshCw className="size-3.5" />
          Reload Application
        </Button>
      </div>
    </div>
  )
}

function withSuspense(Component: LazyPage): ReactElement {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

function toChildPath(path: string) {
  return path.replace(/^\//, "")
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: withSuspense(LandingPage),
        index: true,
      },
      {
        element: withSuspense(LoginPage),
        path: toChildPath(PUBLIC_ROUTES.login),
      },
      {
        element: withSuspense(RegisterPage),
        path: toChildPath(PUBLIC_ROUTES.register),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <ProtectedLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            element: withSuspense(DashboardPage),
            path: toChildPath(PROTECTED_ROUTES.dashboard),
          },
          {
            element: withSuspense(OnboardingPage),
            path: toChildPath(PROTECTED_ROUTES.onboarding),
          },
          {
            element: withSuspense(ChatPage),
            path: toChildPath(PROTECTED_ROUTES.chat),
          },
          {
            element: withSuspense(RoadmapPage),
            path: toChildPath(PROTECTED_ROUTES.roadmap),
          },
          {
            element: withSuspense(ResumePage),
            path: toChildPath(PROTECTED_ROUTES.resume),
          },
          {
            element: withSuspense(GithubPage),
            path: toChildPath(PROTECTED_ROUTES.github),
          },
          {
            element: withSuspense(AnalyticsPage),
            path: toChildPath(PROTECTED_ROUTES.analytics),
          },
          {
            element: withSuspense(ProfilePage),
            path: toChildPath(PROTECTED_ROUTES.profile),
          },
          {
            element: withSuspense(SettingsPage),
            path: toChildPath(PROTECTED_ROUTES.settings),
          },
        ],
      },
    ],
  },
  {
    element: withSuspense(NotFoundPage),
    path: "*",
  },
])
