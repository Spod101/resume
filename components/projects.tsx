"use client"

import { motion } from "framer-motion"

const techItems = [
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "PYTHON",
  "SUPABASE",
  "N8N",
  "GOOGLE CLOUD",
  "OPENAI",
  "GEMINI",
  "LARAVEL",
  "NODE.JS",
  "GENERATIVE AI",
  "AI AUTOMATION",
]

const concepts = [
  "ARCHITECTURE",
  "SYSTEMS",
  "INTERFACES",
  "ALGORITHMS",
  "PROTOTYPING",
  "DESIGN",
  "PROJECT MANAGEMENT",
  "RESPONSIVE DESIGN",
  "ARTIFICIAL INTELLIGENCE",
  "AUTOMATION",
  "DATABASE MANAGEMENT",
  "UI/UX DESIGN",
]

function MarqueeRow({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const duplicatedItems = [...items, ...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className={`flex gap-8 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ width: "fit-content" }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="marquee-text font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight whitespace-nowrap cursor-default"
          >
            {item}
            <span className="marquee-dot mx-8 text-white/20">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function Projects() {
  return (
    <section className="relative py-24 overflow-hidden md:py-32">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-12 mb-16"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">03 — Projects</p>
      </motion.div>

    </section>
  )
}