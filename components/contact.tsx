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
      url: "https://linkedin.com/in/yourprofile",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      url: "https://github.com/yourprofile",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      url: "https://twitter.com/yourprofile",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
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
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-16 md:h-16 text-white/80 group-hover:text-white transition-colors">
                    {social.icon}
                  </div>
                  
                  {/* Animated circle background */}
                  <motion.div
                    className="absolute inset-0 border-2 border-white/20 rounded-full"
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Label on hover */}
                  <motion.span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity"
                  >
                    {social.name}
                  </motion.span>
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

