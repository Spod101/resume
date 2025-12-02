"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import CardSwap, { Card } from "@/components/ui/card-swap"

const services = [
  {
    title: "Web Development",
    description: "Building modern, responsive websites and web applications using cutting-edge technologies.",
    features: [
      "Full-stack development",
      "Responsive design",
      "Performance optimization",
    ]
  },
  {
    title: "AI Integration",
    description: "Implementing intelligent systems and automation using the latest AI technologies.",
    features: [
      "OpenAI & Gemini AI integration",
      "Workflow automation",
      "Intelligent chatbots",
    ]
  },
  {
    title: "UI/UX Design",
    description: "Creating beautiful, intuitive user interfaces that enhance user experience.",
    features: [
      "Modern, minimal design",
      "User-centered approach",
      "Prototyping & wireframing",
      "Interactive animations"
    ]
  }
]

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const titleY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section ref={containerRef} className="relative min-h-screen py-24 md:py-32 pb-48 md:pb-64 lg:pb-80 bg-white overflow-hidden">
      {/* Section Header */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="px-8 md:px-12 mb-12 md:mb-16"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
          05 — SERVICES
        </p>
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-20 lg:gap-32 xl:gap-40 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-12 lg:space-y-16">
            <div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                What I Offer
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Specialized in creating modern web experiences with a focus on clean design, 
                performance, and cutting-edge technology.
              </p>
            </div>

            {/* Services List */}
            <div className="space-y-10">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="border-l-2 border-foreground/20 pl-6 py-2 hover:border-foreground transition-all duration-300">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 group-hover:translate-x-2 transition-transform duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Card Stack */}
          <div className="relative h-[500px] md:h-[600px] lg:h-[650px]">
            <CardSwap
              width={450}
              height={550}
              cardDistance={60}
              verticalDistance={70}
              delay={4000}
              pauseOnHover={true}
              skewAmount={5}
              easing="elastic"
            >
              {services.map((service, index) => (
                <Card key={index}>
                  <div className="w-full h-full p-8 md:p-10 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-7xl md:text-8xl font-bold mb-5 opacity-20">
                        0{index + 1}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-5">
                        {service.title}
                      </h3>
                      <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div>
                      <div className="h-px w-full bg-white/20 mb-6"></div>
                      <ul className="space-y-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  )
}

