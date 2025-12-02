'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TechMarquee as Scrolling } from '@/components/scrolling'
import { Projects } from '@/components/projects'
import { Services } from '@/components/services'
import { Contact } from '@/components/contact'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [hackText, setHackText] = useState('Clayton Dale')
  const [isHacking, setIsHacking] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isInContactSection, setIsInContactSection] = useState(false)

  useEffect(() => {
    startHackEffect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowScrollTop(window.scrollY > 500)
      
      // Check if in contact section
      const contactSection = document.querySelector('#contact')
      if (contactSection) {
        const contactSectionTop = contactSection.getBoundingClientRect().top
        setIsInContactSection(contactSectionTop <= 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const startHackEffect = () => {
    if (isHacking) return
    setIsHacking(true)
    
    const originalText = 'Clayton Dale'
    const chars = '01!@#$%^&*(){}[]<>?/\\|~`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let iterations = 0
    
    const interval = setInterval(() => {
      setHackText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iterations) {
              return originalText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      
      iterations += 0.15
      
      if (iterations >= originalText.length) {
        clearInterval(interval)
        setHackText(originalText)
        setIsHacking(false)
      }
    }, 60)
  }

  const resetText = () => {
    if (!isHacking) {
      setHackText('Clayton Dale')
    }
  }

  const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  const scrollProgress = Math.min(scrollY / heroHeight, 1)
  
  const imageScale = Math.max(0.65, 1 - (scrollProgress * 0.35))
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const imageTranslateY = 0
  const imageTranslateX = isMobile ? (-scrollProgress * 30) : 0
  
  const aboutMeProgress = Math.max(0, Math.min(1, (scrollY - heroHeight * 0.5) / (heroHeight * 0.3)))
  
  const navOpacity = scrollY > 100 ? 0.4 : 1
  const navTextColor = isInContactSection ? 'text-white' : 'text-foreground'
  
  const heroContentOpacity = Math.max(0, 1 - (scrollProgress * 2))

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.querySelector(sectionId)
    if (element) {
      const offset = 0 // No offset - exact positioning
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-white">
      <button
        onClick={scrollToTop}
        className={`fixed bottom-12 right-6 md:bottom-18 md:right-8 z-50 bg-black text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* Navigation */}
      <nav 
        className="fixed top-4 md:top-8 right-4 md:right-8 lg:right-16 flex flex-col items-end gap-1 md:gap-4 z-50 transition-all duration-500 pointer-events-auto"
        style={{ opacity: navOpacity }}
      >
        <Link 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
        >
          Home
          <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? 'bg-white' : 'bg-foreground'} transition-all duration-300 group-hover/link:w-full`}></span>
        </Link>
        <Link 
          href="#me" 
          onClick={(e) => handleNavClick(e, '#me')}
          className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
        >
          Me
          <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? 'bg-white' : 'bg-foreground'} transition-all duration-300 group-hover/link:w-full`}></span>
        </Link>
        <Link 
          href="#projects" 
          onClick={(e) => handleNavClick(e, '#projects')}
          className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
        >
          Projects
          <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? 'bg-white' : 'bg-foreground'} transition-all duration-300 group-hover/link:w-full`}></span>
        </Link>
        <Link 
          href="#skills" 
          onClick={(e) => handleNavClick(e, '#skills')}
          className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
        >
          Skills
          <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? 'bg-white' : 'bg-foreground'} transition-all duration-300 group-hover/link:w-full`}></span>
        </Link>
        <Link 
          href="#services" 
          onClick={(e) => handleNavClick(e, '#services')}
          className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
        >
          Services
          <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? 'bg-white' : 'bg-foreground'} transition-all duration-300 group-hover/link:w-full`}></span>
        </Link>
        <Link 
          href="#contact" 
          onClick={(e) => handleNavClick(e, '#contact')}
          className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
        >
          Contact
          <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? 'bg-white' : 'bg-foreground'} transition-all duration-300 group-hover/link:w-full`}></span>
        </Link>
      </nav>
      {/* Hero Section with sticky container */}
      <div id="home" className="relative" style={{ height: '150vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="grid lg:grid-cols-2 h-full">
            <div className="flex items-center justify-center p-6 md:p-8 lg:p-16 relative">
              <div 
                className="relative w-full max-w-lg aspect-3/4 transition-all duration-300 ease-out hover:scale-105 group px-4"
                style={{
                  transform: `scale(${imageScale}) translateX(${imageTranslateX}%)`,
                  transformOrigin: 'center center',
                }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Clayton"
                  fill
                  className="object-cover transition-all duration-700 group-hover:grayscale"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 md:p-8 lg:p-16 relative">
              <div 
                className="flex-1 flex flex-col justify-center transition-opacity duration-300 pt-24 md:pt-40 lg:pt-48"
                style={{ opacity: heroContentOpacity }}
              >
                <div className="overflow-hidden">
                  <h1 
                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-3 md:mb-6 cursor-pointer font-mono glitch-container group/name"
                    onMouseEnter={startHackEffect}
                    onMouseLeave={resetText}
                    style={{
                      transform: `translateY(${Math.min(scrollY * 0.3, 50)}px)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <span className="glitch-text" data-text={hackText}>{hackText}</span>
                  </h1>
                </div>
                
                <div 
                  className="space-y-1 md:space-y-2 mb-6 md:mb-12"
                  style={{
                    transform: `translateY(${Math.min(scrollY * 0.2, 30)}px)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <p className="text-base md:text-xl text-muted-foreground">
                    Web Developer
                  </p>
                </div>

                <a 
                  href="/resume.pdf" 
                  download 
                  className="space-y-3 md:space-y-4 group cursor-pointer block"
                  style={{
                    transform: `translateY(${Math.min(scrollY * 0.15, 20)}px)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <h2 className="text-xl md:text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110 origin-left">
                      My Resume
                    </h2>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-foreground md:w-6 md:h-6 transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                  <div className="h-1 w-20 md:w-32 bg-foreground transition-all duration-500 ease-out group-hover:w-32 md:group-hover:w-48"></div>
                </a>
              </div>
              
              <div id="me"></div>
              <div 
                className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16 transition-all duration-1000 ease-out"
                style={{
                  opacity: aboutMeProgress,
                  transform: `translateY(${(1 - aboutMeProgress) * 50}px) scale(${0.95 + aboutMeProgress * 0.05})`,
                  pointerEvents: aboutMeProgress > 0.5 ? 'auto' : 'none',
                }}
              >
                <div className="space-y-2 md:space-y-6">
                  <h2 
                    className="text-2xl sm:text-4xl md:text-5xl font-bold text-black leading-tight"
                    style={{
                      transform: `translateX(${(1 - aboutMeProgress) * -20}px)`,
                      transition: 'transform 0.5s ease-out'
                    }}
                  >
                    Clayton Dale Tambis
                  </h2>
                  <p 
                    className="text-base sm:text-xl md:text-2xl font-bold text-black tracking-wide"
                    style={{
                      transform: `translateX(${(1 - aboutMeProgress) * -15}px)`,
                      transition: 'transform 0.5s ease-out 0.1s'
                    }}
                  >
                    A Web Developer
                  </p>
                  <p 
                    className="text-xs md:text-base lg:text-lg text-gray-700 leading-relaxed"
                    style={{
                      transform: `translateX(${(1 - aboutMeProgress) * -10}px)`,
                      transition: 'transform 0.5s ease-out 0.2s'
                    }}
                  >
                    Skilled in designing and developing responsive websites and mobile apps and deeply interested in AI automation and generative AI, exploring how intelligent systems can enhance workflows and user experiences. Motivated to contribute to innovative, forward-thinking projects and grow within a dynamic development team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section id="projects">
        <Projects />
      </section>
      <section id="skills">
        <Scrolling />
      </section>
      <section id="services">
        <Services />
      </section>
      <Contact />
    </main>
  )
}
