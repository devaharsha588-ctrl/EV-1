import { useEffect, useState } from "react"

export function CursorGlow({ className = "" }: { className?: string }) {
  const [position, setPosition] = useState({ x: -500, y: -500 })

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("pointermove", handlePointerMove)
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 ${className}`}
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.08), transparent 75%)`,
      }}
      aria-hidden="true"
    />
  )
}
