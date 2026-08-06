import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
  type ReactElement,
} from "react"
import { createBrowserRouter } from "react-router-dom"

import { Loader } from "@/components/ui/loader"
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/routes"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { PublicLayout } from "@/layouts/PublicLayout"
import { ProtectedRoute } from "@/routes/ProtectedRoute"

type LazyPage = LazyExoticComponent<ComponentType>

const AnalyticsPage = lazy(() => import("@/pages/analytics/AnalyticsPage"))
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"))
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"))
const GithubPage = lazy(() => import("@/pages/github/GithubPage"))
const LandingPage = lazy(() => import("@/pages/auth/LandingPage"))
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const OnboardingPage = lazy(() => import("@/pages/onboarding/OnboardingPage"))
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"))
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"))
const ResumePage = lazy(() => import("@/pages/resume/ResumePage"))
const RoadmapPage = lazy(() => import("@/pages/roadmap/RoadmapPage"))
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"))

function RouteFallback() {
  return (
    <div className="grid min-h-64 place-items-center">
      <Loader className="text-primary" label="Loading route" />
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
    children: [
      {
        element: <ProtectedLayout />,
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
