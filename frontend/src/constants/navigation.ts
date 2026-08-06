import {
  BarChart3,
  FileText,
  GitBranch,
  Home,
  Map,
  Settings,
  UserRound,
} from "lucide-react"

import { PROTECTED_ROUTES } from "@/constants/routes"
import type { NavigationItem } from "@/types/navigation.types"

export const PROTECTED_NAVIGATION: readonly NavigationItem[] = [
  {
    end: true,
    icon: Home,
    label: "Home",
    path: PROTECTED_ROUTES.dashboard,
  },
  {
    icon: Map,
    label: "Roadmap",
    path: PROTECTED_ROUTES.roadmap,
  },
  {
    icon: FileText,
    label: "Resume",
    path: PROTECTED_ROUTES.resume,
  },
  {
    icon: GitBranch,
    label: "GitHub",
    path: PROTECTED_ROUTES.github,
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: PROTECTED_ROUTES.analytics,
  },
  {
    icon: UserRound,
    label: "Profile",
    path: PROTECTED_ROUTES.profile,
  },
  {
    icon: Settings,
    label: "Settings",
    path: PROTECTED_ROUTES.settings,
  },
] as const

const MOBILE_NAVIGATION_PATHS: readonly string[] = [
  PROTECTED_ROUTES.dashboard,
  PROTECTED_ROUTES.roadmap,
  PROTECTED_ROUTES.resume,
  PROTECTED_ROUTES.github,
  PROTECTED_ROUTES.settings,
]

export const MOBILE_NAVIGATION = PROTECTED_NAVIGATION.filter((item) =>
  MOBILE_NAVIGATION_PATHS.includes(item.path),
)
