import { Component, type ErrorInfo, type ReactNode } from "react"

import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  readonly children: ReactNode
}

interface ErrorBoundaryState {
  readonly hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error", error, info)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="bg-background text-foreground grid min-h-svh place-items-center px-6 text-center">
          <div className="grid max-w-md gap-5">
            <div className="grid gap-2">
              <h1 className="text-2xl font-semibold">Something went wrong</h1>
              <p className="text-muted-foreground text-sm leading-6">
                The application shell is still intact, but this view needs to be
                reloaded.
              </p>
            </div>
            <Button className="justify-self-center" onClick={this.handleReload}>
              Reload
            </Button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
