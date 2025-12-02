"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import SpotlightCard from "@/components/ui/spotlight-card"

interface Project {
  title: string
  description: string
  fullDescription: string
  tech: string[]
  features: string[]
  challenges: {
    title: string
    description: string
  }[]
  link?: string
  github?: string
  demo?: string
  year: string
  image: string
  gallery?: string[]
}

const projects: Project[] = [
  {
    "title": "EternalpEASE",
    "description": "EternalpEASE is a comprehensive web-based platform with AI that translates user inquiries into personalized visual theme recommendations, featuring integrated payments.",
    "fullDescription": "EternalpEASE is a comprehensive web-based platform designed to support Infinity Memorial Chapels and Funeral Services in providing a more organized, compassionate, and efficient funeral planning experience. The system integrates an AI-powered inquiry and theme recommendation assistant that understands user needs, offers guidance, and generates visual funeral theme concepts through DALL·E.",
    "tech": [
      "Laravel (Backend API & Orchestration)",
      "React (Frontend Interface)",
      "OpenAI API (GPT-4 & DALL-E 3)",
      "PayMongo (Payment Processing)",
      "Supabase (Database)"
    ],
    "features": [
      "AI-powered inquiry assistant using GPT models for funeral inquiries",
      "Context-aware conversational flow tailored to user needs",
      "Real-time funeral theme visualization powered by DALL·E",
      "Interactive web interface built with React for seamless user experience",
      "Secure PayMongo integration for purchasing premium themes and digital assets",
      "Integrated schedule and reminder automation for service coordination",
      "Laravel-based backend with synchronized state management for reliability",
      "Admin dashboard for managing services, monitoring user interactions, and viewing sales analytics",
      "Client information management for organized tracking of arrangements",
    ],
    "challenges": [
      {
        "title": "Strategic Token & Cost Optimization",
        "description": "Implementing aggressive token conservation strategies to manage OpenAI costs. This involves designing efficient system prompts, caching frequent responses, and programmatically deciding when to use cheaper models (GPT-3.5) versus expensive reasoning models (GPT-4) without degrading the user experience."
      },
      {
        "title": "Hybrid State Synchronization (Laravel & React)",
        "description": "Orchestrating seamless data flow between the Laravel backend and React frontend. The challenge lies in managing asynchronous API calls, ensuring type safety across the stack, and keeping the client-side UI in perfect sync with the server-side database, particularly during complex chat-and-generate sequences."
      },
      {
        "title": "Complex Payment Intent Integration",
        "description": "Architecting a robust payment flow using PayMongo's API. This requires handling the asynchronous 'Payment Intent' lifecycle—from creating intents and attaching payment methods to securely verifying webhooks—ensuring that premium features unlock immediately and reliably upon successful payment."
      }
    ],
    demo: "https://eternalpease.xyz",
    github: "#",
    year: "2025",
    image: "/images/project1/thumbnail.png",
    gallery: ["/images/project1/1.png", "/images/project1/2.png", "/images/project1/3.png", "/images/project1/4.png", "/images/project1/5.png"]
  },
  {
    title: "Workflow Automation Suite",
    description: "Custom automation workflows using N8N for streamlining business processes and integrating multiple services seamlessly.",
    fullDescription: "An automation platform built to streamline business processes by connecting multiple services and creating custom workflows without code.",
    tech: ["N8N", "Google Cloud", "Node.js", "API Integration"],
    features: [
      "Visual workflow builder with drag-and-drop interface",
      "Integration with 200+ services and APIs",
      "Automated task scheduling and triggers",
      "Real-time monitoring and error handling"
    ],
    challenges: [
      {
        title: "Complex API Integrations",
        description: "Managing authentication flows and rate limits across multiple third-party services while ensuring data consistency."
      },
      {
        title: "Workflow Error Recovery",
        description: "Implementing robust error handling and retry mechanisms to ensure workflows complete successfully even with partial failures."
      }
    ],
    demo: "#",
    github: "#",
    year: "2024",
    image: "PROJECT_2",
    gallery: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"]
  },
  {
    title: "E-Commerce Dashboard",
    description: "A comprehensive admin dashboard for managing products, orders, and analytics with real-time data synchronization.",
    fullDescription: "A full-featured admin dashboard for e-commerce businesses with real-time analytics, inventory management, and order processing capabilities.",
    tech: ["React", "Laravel", "PostgreSQL", "Chart.js"],
    features: [
      "Real-time sales analytics and reporting",
      "Inventory management with low-stock alerts",
      "Order processing and fulfillment tracking",
      "Customer insights and behavior analytics"
    ],
    challenges: [
      {
        title: "Real-Time Data Updates",
        description: "Implementing WebSocket connections for live dashboard updates while managing database query performance with large datasets."
      },
      {
        title: "Complex Data Relationships",
        description: "Designing efficient database schema and queries to handle complex relationships between products, orders, and customers."
      }
    ],
    demo: "#",
    github: "#",
    year: "2023",
    image: "PROJECT_3",
    gallery: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"]
  },
]

function Lightbox({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 sm:p-3 rounded-full bg-white/10 active:bg-white/30 hover:bg-white/20 text-white transition-all touch-manipulation"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-6 sm:h-6">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-6xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image}
          alt="Full screen view"
          width={1200}
          height={800}
          className="w-full h-full object-contain"
        />
      </motion.div>
    </motion.div>
  )
}

function StackedCardsGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName !== 'BUTTON' && !target.closest('button')) {
      setLightboxImage(images[currentIndex])
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage()
    }

    if (touchStart - touchEnd < -50) {
      prevImage()
    }
  }

  return (
    <>
      <div className="relative w-full aspect-[16/9] mb-6 sm:mb-8">
        <div 
          className="relative w-full h-full" 
          onClick={openLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((image, index) => {
            const offset = (index - currentIndex + images.length) % images.length
            if (offset > 2) return null

            return (
              <motion.div
                key={index}
                className="absolute inset-0 cursor-pointer touch-none"
                initial={false}
                animate={{
                  scale: 1 - offset * 0.05,
                  y: offset * 12,
                  x: offset * 8,
                  opacity: offset === 0 ? 1 : 0.5,
                  zIndex: 10 - offset,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white/20 bg-neutral-800">
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <button
          onClick={prevImage}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/60 active:bg-black/80 hover:bg-black/70 text-white transition-all backdrop-blur-sm touch-manipulation"
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-6 sm:h-6">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/60 active:bg-black/80 hover:bg-black/70 text-white transition-all backdrop-blur-sm touch-manipulation"
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-6 sm:h-6">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

function ProjectModal({ project, open, onOpenChange }: { 
  project: Project; 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-transparent border-none p-0 gap-0 overflow-hidden w-[95vw] sm:w-full"
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 sm:p-2.5 rounded-full bg-white/10 active:bg-white/30 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/20 touch-manipulation"
          aria-label="Close modal"
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-5 sm:h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">
          <SpotlightCard 
            className="w-full !p-4 sm:!p-6 md:!p-8"
            spotlightColor="rgba(255, 255, 255, 0.15)"
          >
          <div className="space-y-6 sm:space-y-8">
            {project.gallery && project.gallery.length > 0 && (
              <StackedCardsGallery images={project.gallery} />
            )}

            <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-white/10">
              <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                {project.title}
              </DialogTitle>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-1 h-4 sm:h-5 bg-white/80"></div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">Technology Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i}
                    className="font-mono text-xs px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 text-white/90 rounded active:bg-white/20 hover:bg-white/15 hover:border-white/30 transition-all touch-manipulation"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-4 sm:p-6 rounded-lg border border-white/10">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 flex items-center gap-2 text-white">
                <span className="text-xl sm:text-2xl">+</span> Key Features
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                    <span className="text-white mt-0.5 flex-shrink-0 text-base sm:text-lg font-bold">+</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 sm:h-5 bg-white/80"></div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Challenges & Learnings</h3>
              </div>
              <div className="space-y-4 sm:space-y-6 pl-3 sm:pl-4">
                {project.challenges.map((challenge, i) => (
                  <div key={i} className="space-y-2 border-l-2 border-white/20 pl-3 sm:pl-4 active:border-white/40 hover:border-white/40 transition-colors">
                    <h4 className="font-bold text-white text-sm sm:text-base">{challenge.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10">
              {project.demo && (
                <a
                  href={project.demo}
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-semibold active:bg-white/80 hover:bg-white/90 transition-all rounded touch-manipulation text-sm sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-5 sm:h-5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white font-semibold active:bg-white/20 hover:bg-white/10 transition-all rounded touch-manipulation text-sm sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </a>
              )}
            </div>
          </div>
        </SpotlightCard>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProjectCard({ 
  project, 
  index, 
  onHover,
  onLeave,
  onInteractiveHover,
  onInteractiveLeave,
  onClick
}: { 
  project: Project; 
  index: number;
  onHover: (image: string, x: number, y: number) => void;
  onLeave: () => void;
  onInteractiveHover: () => void;
  onInteractiveLeave: () => void;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const handleMouseMove = (e: React.MouseEvent) => {
    onHover(project.image, e.clientX, e.clientY)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClick()
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="group"
      onMouseMove={handleMouseMove}
      onMouseLeave={onLeave}
    >
      <button onClick={handleClick} className="block w-full text-left">
        <div className="border-t border-foreground/10 py-8 md:py-12 transition-all duration-500 hover:bg-foreground/[0.02]">
          <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
            <div className="col-span-2 md:col-span-1">
              <span className="font-mono text-xs md:text-sm text-muted-foreground">
                {project.year}
              </span>
            </div>

            <div className="col-span-10 md:col-span-11 space-y-3 md:space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 
                  className="interactive-content text-2xl md:text-4xl lg:text-5xl font-bold text-foreground transition-all duration-300 group-hover:translate-x-2"
                  onMouseEnter={onInteractiveHover}
                  onMouseLeave={onInteractiveLeave}
                >
                  {project.title}
                </h3>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-foreground opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-1 hidden md:block"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>

              <p 
                className="interactive-content text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl leading-relaxed"
                onMouseEnter={onInteractiveHover}
                onMouseLeave={onInteractiveLeave}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i}
                    className="interactive-content font-mono text-xs md:text-sm px-3 py-1 border border-foreground/10 text-foreground/60 transition-all duration-300 hover:border-foreground/30 hover:text-foreground"
                    onMouseEnter={onInteractiveHover}
                    onMouseLeave={onInteractiveLeave}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [isOverInteractive, setIsOverInteractive] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const titleY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  const handleProjectHover = (image: string, x: number, y: number) => {
    setHoveredImage(image)
    setCursorX(x)
    setCursorY(y)
  }

  const handleProjectLeave = () => {
    setHoveredImage(null)
    setIsOverInteractive(false)
  }

  const handleInteractiveHover = () => {
    setIsOverInteractive(true)
  }

  const handleInteractiveLeave = () => {
    setIsOverInteractive(false)
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <section ref={containerRef} className="projects-section relative py-16 md:py-24 overflow-hidden">
      <motion.div
        className="hidden lg:block fixed pointer-events-none z-50"
        style={{ 
          left: cursorX,
          top: cursorY,
          x: isOverInteractive ? -140 : -180,
          y: -200
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ 
          opacity: hoveredImage ? (isOverInteractive ? 0.3 : 1) : 0,
          scale: hoveredImage ? (isOverInteractive ? 0.65 : 1) : 0.8,
          rotate: hoveredImage ? 0 : -5
        }}
        transition={{ 
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {hoveredImage && (
          <div className={`relative w-[360px] h-[400px] border-2 overflow-hidden shadow-2xl transition-all duration-300 ${
            isOverInteractive 
              ? 'glassmorphism border-white/40' 
              : 'border-foreground/20 bg-white'
          }`}>
            <Image
              src={hoveredImage}
              alt="Project preview"
              fill
              className={`object-cover transition-opacity duration-300 ${
                isOverInteractive ? 'opacity-40' : 'opacity-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {isOverInteractive && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="px-6 md:px-12 lg:px-16 mb-8 md:mb-16"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4 md:mb-6">
          03 — PROJECTS
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
          Selected Work
        </h2>
      </motion.div>

      <div className="px-6 md:px-12 lg:px-16">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
            index={index}
            onHover={handleProjectHover}
            onLeave={handleProjectLeave}
            onInteractiveHover={handleInteractiveHover}
            onInteractiveLeave={handleInteractiveLeave}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </div>

      <div className="px-6 md:px-12 lg:px-16">
        <div className="border-t border-foreground/10 mt-8 md:mt-12"></div>
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </section>
  )
}
