import { Outlet } from "react-router-dom"

export function PublicLayout() {
  return (
    <main className="bg-background text-foreground min-h-svh">
      <Outlet />
    </main>
  )
}
