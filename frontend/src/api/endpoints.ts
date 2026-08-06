export const API_ENDPOINTS = {
  analytics: {
    overview: "/analytics/overview",
  },
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    session: "/auth/session",
  },
  chat: {
    threads: "/chat/threads",
  },
  dashboard: {
    summary: "/dashboard/summary",
  },
  github: {
    analysis: "/github/analysis",
  },
  profile: {
    current: "/profile",
  },
  resume: {
    workspace: "/resume/workspace",
  },
  roadmap: {
    current: "/roadmap",
  },
} as const
