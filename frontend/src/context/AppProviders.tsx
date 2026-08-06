import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { Toaster } from "sonner"

import { AuthProvider } from "@/context/AuthContext"
import { SidebarProvider } from "@/context/SidebarContext"
import { ThemeProvider } from "@/context/ThemeContext"

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
    },
    queries: {
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

export function AppProviders({ children }: { readonly children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
        <Toaster closeButton position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
