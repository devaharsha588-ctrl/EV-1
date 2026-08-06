import { motion } from "framer-motion"

import { PageHeader } from "@/components/common/PageHeader"

interface PlaceholderPageProps {
  readonly title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid min-h-[calc(100svh-10rem)] content-center gap-8 py-12"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <PageHeader description="Coming soon." title={title} />
    </motion.section>
  )
}
