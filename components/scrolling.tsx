"use client"

import { motion } from "framer-motion"

const techItems = [
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "JAVASCRIPT",
  "NODE.JS",
  "NEST.JS",
  "EXPRESS.JS",
  "LARAVEL",
  "INERTIA.JS",
  "PHP",
  "CODEIGNITER",
  "PYTHON",
  "SUPABASE",
  "POSTGRESQL",
  "MYSQL",
  "MONGODB",
  "FIREBASE",
  "AWS",
  "DOCKER",
  "N8N",
  "OPENAI",
  "GEMINI",
]

const concepts = [
  "AI AGENTS",
  "PROMPT ENGINEERING",
  "LOCAL LLMS",
  "AI AUTOMATION",
  "SYSTEM ARCHITECTURE",
  "SCALABILITY",
  "COMPONENT LIBRARIES",
  "PERFORMANCE OPTIMIZATION",
  "RESPONSIVE DESIGN",
  "MOBILE-FIRST",
  "DATABASE DESIGN",
  "ROLE-BASED ACCESS",
  "API INTEGRATION",
  "QA & TESTING",
  "TEST PLANNING",
  "UI/UX DESIGN",
  "PROTOTYPING",
  "PROJECT MANAGEMENT",
  "MENTORSHIP",
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

export function TechMarquee() {
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
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">04 — TECHNICAL SKILLS</p>
      </motion.div>

      {/* Marquee Rows */}
      <div className="space-y-4">
        <MarqueeRow items={techItems} direction="left" />
        <MarqueeRow items={concepts} direction="right" />
      </div>
    </section>
  )
}