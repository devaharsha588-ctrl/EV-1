import { FileQuestion } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { PROTECTED_ROUTES } from "@/constants/routes"

export default function NotFoundPage() {
  return (
    <main className="bg-background text-foreground grid min-h-svh place-items-center px-6">
      <EmptyState
        action={
          <Button asChild>
            <Link to={PROTECTED_ROUTES.dashboard}>Go to dashboard</Link>
          </Button>
        }
        description="The page you requested does not exist."
        icon={FileQuestion}
        title="Page not found"
      />
    </main>
  )
}
