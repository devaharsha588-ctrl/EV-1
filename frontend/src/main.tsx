import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "@/App"
import "@/styles/globals.css"

// Global listener for Vite chunk preload errors (occurs on new Vercel deployments)
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault()
  window.location.reload()
})

window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    (event.reason.name === "ChunkLoadError" ||
      event.reason.message?.includes("Failed to fetch dynamically imported module") ||
      event.reason.message?.includes("Importing a module script failed"))
  ) {
    event.preventDefault()
    window.location.reload()
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
