import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { STORAGE_KEYS } from "@/constants/app"

interface SidebarContextValue {
  readonly isCollapsed: boolean
  readonly setIsCollapsed: (isCollapsed: boolean) => void
  readonly toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

function getInitialSidebarState() {
  if (typeof window === "undefined") {
    return false
  }

  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true"
}

export function SidebarProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(getInitialSidebarState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((currentValue) => !currentValue)
  }, [])

  const value = useMemo<SidebarContextValue>(
    () => ({
      isCollapsed,
      setIsCollapsed,
      toggleSidebar,
    }),
    [isCollapsed, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarProvider")
  }

  return context
}
