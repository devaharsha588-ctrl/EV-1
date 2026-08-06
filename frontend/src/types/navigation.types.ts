import type { LucideIcon } from "lucide-react"

export interface NavigationItem {
  readonly end?: boolean
  readonly icon: LucideIcon
  readonly label: string
  readonly path: string
}
