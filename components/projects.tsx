"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import SpotlightCard from "@/components/ui/spotlight-card"
import { AnimatePresence } from "framer-motion"

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
    title: "AI Chatbot Platform",
    description: "An intelligent conversational AI platform built with Next.js and OpenAI API, featuring context-aware responses and user memory.",
    fullDescription: "A platform designed for businesses to deploy intelligent chatbots with context-aware conversations, user memory, and seamless integration with existing systems.",
    tech: ["Next.js", "OpenAI", "TypeScript", "Supabase"],
    features: [
      "Context-aware AI responses using GPT-4",
      "Persistent user conversation memory",
      "Real-time chat with WebSocket integration",
      "Multi-language support for global reach"
    ],
    challenges: [
      {
        title: "Token Management & Cost Optimization",
        description: "Implementing efficient token counting and context window management to optimize API costs while maintaining conversation quality."
      },
      {
        title: "Real-Time State Synchronization",
        description: "Managing real-time updates across multiple chat sessions while handling edge cases like network interruptions and reconnections."
      }
    ],
    demo: "#",
    github: "#",
    year: "2024",
    image: "PROJECT_1",
    gallery: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"]
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
  {
    title: "AI Image Generator",
    description: "Creative image generation tool leveraging generative AI models to transform text prompts into unique visual content.",
    fullDescription: "A creative platform that uses generative AI to transform text descriptions into stunning visual artwork, powered by state-of-the-art AI models.",
    tech: ["Python", "Gemini AI", "Next.js", "TailwindCSS"],
    features: [
      "Text-to-image generation with multiple styles",
      "Image editing and refinement tools",
      "Batch processing for multiple generations",
      "Gallery system for saving and sharing creations"
    ],
    challenges: [
      {
        title: "AI Model Integration",
        description: "Optimizing API calls to Gemini AI while implementing caching strategies to reduce costs and improve response times."
      },
      {
        title: "Image Processing Pipeline",
        description: "Building an efficient image processing pipeline to handle generation, storage, and delivery of high-resolution images at scale."
      }
    ],
    demo: "#",
    github: "#",
    year: "2023",
    image: "PROJECT_4",
    gallery: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"]
  }
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
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON') {
      setLightboxImage(images[currentIndex])
    }
  }

  return (
    <>
      <div className="relative w-full h-[300px] md:h-[400px] mb-8">
        <div className="relative w-full h-full" onClick={openLightbox}>
          {/* Stacked cards effect - show 3 cards */}
          {images.map((image, index) => {
            const offset = (index - currentIndex + images.length) % images.length
            if (offset > 2) return null

            return (
              <motion.div
                key={index}
                className="absolute inset-0 cursor-pointer"
                initial={false}
                animate={{
                  scale: 1 - offset * 0.05,
                  y: offset * 15,
                  x: offset * 10,
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

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Lightbox */}
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
        className="max-w-4xl max-h-[90vh] bg-transparent border-none p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/20"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Scrollable Container with Custom Scrollbar */}
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          <SpotlightCard 
            className="w-full"
            spotlightColor="rgba(255, 255, 255, 0.15)"
          >
          <div className="space-y-8">
            {/* Stacked Cards Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <StackedCardsGallery images={project.gallery} />
            )}

            {/* Header */}
            <div className="space-y-4 pb-6 border-b border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {project.title}
              </h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-white/80"></div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Technology Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i}
                    className="font-mono text-xs px-4 py-2 bg-white/10 border border-white/20 text-white/90 rounded hover:bg-white/15 hover:border-white/30 transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
                <span className="text-2xl">+</span> Key Features
              </h3>
              <ul className="space-y-4">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-white mt-0.5 flex-shrink-0 text-lg font-bold">+</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges & Learnings */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-white/80"></div>
                <h3 className="text-xl font-bold text-white">Challenges & Learnings</h3>
              </div>
              <div className="space-y-6 pl-4">
                {project.challenges.map((challenge, i) => (
                  <div key={i} className="space-y-2 border-l-2 border-white/20 pl-4 hover:border-white/40 transition-colors">
                    <h4 className="font-bold text-white text-base">{challenge.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold hover:bg-white/90 transition-all rounded"
                  target="_blank"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View Demo
                </Link>
              )}
              {project.github && (
                <Link
                  href={project.github}
                  className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all rounded"
                  target="_blank"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </Link>
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
            {/* Year */}
            <div className="col-span-2 md:col-span-1">
              <span className="font-mono text-xs md:text-sm text-muted-foreground">
                {project.year}
              </span>
            </div>

            {/* Content */}
            <div className="col-span-10 md:col-span-11 space-y-3 md:space-y-4">
              {/* Title */}
              <div className="flex items-start justify-between gap-4">
                <h3 
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground transition-all duration-300 group-hover:translate-x-2 interactive-content"
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

              {/* Description */}
              <p 
                className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl leading-relaxed interactive-content"
                onMouseEnter={onInteractiveHover}
                onMouseLeave={onInteractiveLeave}
              >
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i}
                    className="font-mono text-xs md:text-sm px-3 py-1 border border-foreground/10 text-foreground/60 transition-all duration-300 hover:border-foreground/30 hover:text-foreground interactive-content"
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

  // Get color based on project identifier
  const getPlaceholderColor = (identifier: string) => {
    const colors = {
      'PROJECT_1': 'from-blue-500 to-purple-500',
      'PROJECT_2': 'from-green-500 to-teal-500',
      'PROJECT_3': 'from-orange-500 to-red-500',
      'PROJECT_4': 'from-pink-500 to-rose-500',
    }
    return colors[identifier as keyof typeof colors] || 'from-gray-500 to-gray-700'
  }

  return (
    <section ref={containerRef} className="projects-section relative py-16 md:py-24 overflow-hidden">
      {/* Floating Image Preview - Desktop Only */}
      <motion.div
        className="hidden lg:block fixed pointer-events-none z-50"
        style={{ 
          left: cursorX,
          top: cursorY,
          x: isOverInteractive ? -140 : -180, // Offset more when over interactive (half of 360px)
          y: -200 // Center vertically (half of 400px height)
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ 
          opacity: hoveredImage ? 1 : 0,
          scale: hoveredImage ? (isOverInteractive ? 0.65 : 1) : 0.8,
          rotate: hoveredImage ? 0 : -5
        }}
        transition={{ 
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1] // Custom easing for smooth effect
        }}
      >
        {hoveredImage && (
          <div className={`relative w-[360px] h-[400px] border-2 overflow-hidden shadow-2xl transition-all duration-300 ${
            isOverInteractive 
              ? 'glassmorphism border-white/40' 
              : 'border-foreground/20 bg-white'
          }`}>
            {/* Distinct placeholder with gradient and identifier */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderColor(hoveredImage)} flex items-center justify-center transition-all duration-300 ${
              isOverInteractive ? 'opacity-40' : 'opacity-100'
            }`}>
              <div className="text-center text-white">
                <div className="text-8xl font-bold mb-4">{hoveredImage.split('_')[1]}</div>
                <div className="text-2xl font-mono tracking-widest opacity-80">{hoveredImage}</div>
                <div className="mt-8 text-sm opacity-60">Replace with actual image</div>
              </div>
            </div>
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Glassmorphism overlay - only visible when over interactive elements */}
            {isOverInteractive && (
              <div className="absolute inset-0 glass-overlay" />
            )}
          </div>
        )}
      </motion.div>

      {/* Section Header */}
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

      {/* Projects List */}
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

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      {/* Bottom Border */}
      <div className="px-6 md:px-12 lg:px-16">
        <div className="border-t border-foreground/10 mt-8 md:mt-12"></div>
      </div>
    </section>
  )
}