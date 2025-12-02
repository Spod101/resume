"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [mounted, setMounted] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const email = "claytondalet@gmail.com" 

  // Handle client-side mounting and time updates
  useEffect(() => {
    setMounted(true)
    
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      })
      setCurrentTime(time)
    }

    updateTime()
    const interval = setInterval(updateTime, 100)

    return () => clearInterval(interval)
  }, [])

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/clayton-dale",
      hoverColor: "#0A66C2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      url: "https://github.com/Spod101",
      hoverColor: "#8B5CF6",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: "Behance",
      url: "https://behance.net/yourprofile",
      hoverColor: "#1769FF",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM6.545 9.77c.54 0 .98-.12 1.31-.368.33-.247.5-.62.5-1.12 0-.27-.05-.51-.14-.71-.09-.2-.23-.37-.4-.5-.17-.13-.36-.22-.58-.27-.22-.05-.45-.08-.7-.08H3.24v3.05h3.305zm.21 5.29c.28 0 .54-.03.79-.09.25-.06.47-.16.66-.3.19-.13.34-.3.46-.52.12-.22.18-.48.18-.79 0-.64-.18-1.1-.54-1.37-.36-.27-.85-.4-1.47-.4H3.24v3.47h3.515zM16.92 17.5c.58.54 1.41.81 2.49.81.77 0 1.44-.19 1.99-.58.55-.39.89-.78 1.02-1.19h3.38c-.54 1.57-1.36 2.71-2.45 3.42-1.09.71-2.4 1.06-3.93 1.06-1.07 0-2.03-.17-2.88-.51-.85-.34-1.58-.83-2.18-1.46-.6-.63-1.06-1.39-1.39-2.28-.33-.89-.5-1.87-.5-2.95 0-1.04.17-2 .5-2.88.33-.88.8-1.64 1.4-2.29.6-.65 1.32-1.15 2.16-1.51.84-.36 1.78-.54 2.82-.54 1.15 0 2.16.22 3.02.67.87.44 1.58 1.04 2.14 1.79.56.75.97 1.62 1.22 2.6.25.98.33 2.03.24 3.14h-10.1c.06 1.18.45 2.08 1.03 2.73zm4.33-7.33c-.46-.49-1.17-.74-2.13-.74-.63 0-1.15.11-1.56.34-.41.23-.74.52-.97.87-.23.35-.4.73-.5 1.13-.1.4-.16.78-.18 1.13h6.44c-.14-.99-.56-1.73-1.1-2.73zM15.2 4h5.6v1.83H15.2V4z"/>
        </svg>
      )
    }
  ]

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <section 
      ref={containerRef}
      id="contact" 
      className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden py-24 md:py-32"
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        {/* Main Heading with Stagger Animation */}
        <motion.div
          style={{ y, opacity }}
          className="space-y-6 md:space-y-8 mb-12 md:mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.3em] text-white/60"
          >
            06 — GET IN TOUCH
          </motion.p>

          {/* Split text animation */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
          >
            Let's Create
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
          >
            Something Amazing
          </motion.h2>
        </motion.div>

        {/* Email with Click to Copy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 md:mb-16"
        >
          <motion.button
            onClick={handleCopyEmail}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-block"
          >
            <motion.div
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
              animate={copiedEmail ? { y: [0, -10, 0] } : {}}
            >
              {email}
              <motion.span
                className="absolute -right-8 top-1/2 -translate-y-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                animate={copiedEmail ? { scale: [1, 1.2, 1] } : {}}
              >
                {copiedEmail ? '✓' : '📋'}
              </motion.span>
            </motion.div>
            <motion.div
              className="h-0.5 bg-white mt-2"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.button>
          
          {copiedEmail && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-white/60 mt-4"
            >
              Email copied to clipboard!
            </motion.p>
          )}
        </motion.div>

        {/* Social Links with Icon Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-8 md:gap-12"
        >
          {socialLinks.map((social, index) => (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
            >
              <Link
                href={social.url}
                target="_blank"
                className="group block"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Icon with brand color on hover */}
                  <motion.div 
                    className="w-12 h-12 md:w-16 md:h-16"
                    initial={{ color: "rgba(255,255,255,0.8)" }}
                    whileHover={{ 
                      color: social.hoverColor,
                      filter: `drop-shadow(0 0 12px ${social.hoverColor})`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {social.icon}
                  </motion.div>
                  
                  {/* Animated circle background with brand color */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 1, opacity: 0, borderWidth: 2, borderColor: "rgba(255,255,255,0.2)" }}
                    whileHover={{ 
                      scale: 1.5, 
                      opacity: 1, 
                      borderColor: social.hoverColor,
                      boxShadow: `0 0 20px ${social.hoverColor}40`
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ borderStyle: "solid" }}
                  />
                  
                  {/* Label on hover with brand color */}
                  <span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: social.hoverColor }}
                  >
                    {social.name}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Playful CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 md:mt-20"
        >
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-sm md:text-base text-white/60 font-mono"
          >
            ✨ Open to exciting opportunities ✨
          </motion.p>
        </motion.div>
      </div>

      {/* Footer Section with Timezone and Credit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 border-t border-white/10 py-6"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-sm">
          {/* Timezone */}
          <motion.div
            className="font-mono"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {mounted ? `LOCAL TIME ${currentTime}` : 'LOCAL TIME --:--:--'}
          </motion.div>

          {/* Credit */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="font-mono"
          >
            © {new Date().getFullYear()}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

