export const queryKeys = {
  analytics: {
    overview: () => ["analytics", "overview"] as const,
  },
  auth: {
    session: () => ["auth", "session"] as const,
  },
  chat: {
    threads: () => ["chat", "threads"] as const,
    messages: (threadId: string) => ["chat", "messages", threadId] as const,
  },
  dashboard: {
    summary: () => ["dashboard", "summary"] as const,
  },
  github: {
    analysis: () => ["github", "analysis"] as const,
  },
  notifications: {
    all: () => ["notifications", "all"] as const,
  },
  profile: {
    current: () => ["profile", "current"] as const,
  },
  resume: {
    workspace: () => ["resume", "workspace"] as const,
  },
  roadmap: {
    current: () => ["roadmap", "current"] as const,
  },
  settings: {
    user: () => ["settings", "user"] as const,
  },
  tasks: {
    all: () => ["tasks", "all"] as const,
  },
} as const
