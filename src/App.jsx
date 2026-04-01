import { useState, useEffect, useRef } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faEnvelope, faShieldAlt, faCode, faGlobe, faCogs, faSearch,
  faDharmachakra, faSkull, faUserSecret
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faFacebookF, faInstagram, faYoutube, faXTwitter, faSpotify, faDiscord, faPython, faReact, faDocker, faLinux } from '@fortawesome/free-brands-svg-icons'

function useTypewriter(roles) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = roles[index]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1))
        if (text === current) {
          setTimeout(() => setIsDeleting(true), 2500)
          return
        }
      } else {
        setText(current.substring(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setIndex((prev) => (prev + 1) % roles.length)
          return
        }
      }
    }, isDeleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, roles])

  return text
}

function useIntersectionObserver(selector) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(selector).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [section, setSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setProgress((scrollTop / scrollHeight) * 100)
      
      const sections = ['home', 'about', 'skills', 'terminal', 'about-me', 'contact']
      sections.forEach(sec => {
        const el = document.getElementById(sec)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setSection(sec)
          }
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { progress, section }
}

function useCounter(targets, trigger) {
  const [counts, setCounts] = useState(targets)

  useEffect(() => {
    if (!trigger) return
    const intervals = {}
    Object.keys(targets).forEach(key => {
      intervals[key] = setInterval(() => {
        setCounts(prev => {
          const increment = targets[key] / 60
          const newVal = Math.min(prev[key] + increment, targets[key])
          if (newVal >= targets[key]) clearInterval(intervals[key])
          return { ...prev, [key]: Math.floor(newVal) }
        })
      }, 25)
    })
    return () => Object.values(intervals).forEach(clearInterval)
  }, [trigger, targets])

  return counts
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * 0.6
    this.vy = (Math.random() - 0.5) * 0.6
    this.radius = Math.random() * 3 + 2
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(204, 51, 51, 0.8)'
    ctx.fill()
  }
}

function Particles() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const particles = []
    const CONNECTION_DISTANCE = 250
    
    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle(canvas))
    }
    
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(204, 51, 51, ${(1 - dist / CONNECTION_DISTANCE) * 0.3})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw(ctx) })
      drawLines()
      requestAnimationFrame(animate)
    }
    animate()
    
    return () => window.removeEventListener('resize', resize)
  }, [])
  
  return <canvas ref={canvasRef} className="particles-canvas" />
}

function GlitchEffects() {
  return (
    <div className="glitch-overlay">
      <div className="scanline"></div>
      <div className="noise"></div>
      <div className="glitch-flash"></div>
      <div className="glitch-line glitch-line-1"></div>
      <div className="glitch-line glitch-line-2"></div>
      <div className="glitch-line glitch-line-3"></div>
      <div className="glitch-line glitch-line-4"></div>
      <div className="glitch-bar glitch-bar-1"></div>
      <div className="glitch-bar glitch-bar-2"></div>
      <div className="glitch-bar glitch-bar-3"></div>
    </div>
  )
}

function SkillCard({ icon, title, percent, desc, tags }) {
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    if (visible && width < percent) {
      const timer = setTimeout(() => setWidth(w => Math.min(w + 1, percent)), 20)
      return () => clearTimeout(timer)
    }
  }, [visible, width, percent])
  
  return (
    <div className={`skill-card fade-in ${visible ? 'visible' : ''}`}>
      <div className="skill-icon"><FontAwesomeIcon icon={icon} /></div>
      <div className="skill-header">
        <h3>{title}</h3>
        <span className="skill-percent">{width}%</span>
      </div>
      <p>{desc}</p>
      <div className="skill-bar">
        <div className="skill-progress" style={{ width: visible ? `${percent}%` : '0%' }}></div>
      </div>
      <div className="skill-tags">
        {tags.map((tag, i) => <span className="skill-tag" key={i}>{tag}</span>)}
      </div>
    </div>
  )
}

function CounterStats() {
  const [started, setStarted] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    const el = document.querySelector('.cmd-card')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])
  
  const counts = useCounter({ vuln: 200, sys: 50, rate: 98, years: 5 }, started)
  
  return (
    <div className="cmd-stats">
      <div className="cmd-stat">
        <div className="cmd-stat-label">Vulnerabilities Found</div>
        <div className="cmd-stat-value"><span>{counts.vuln}</span></div>
      </div>
      <div className="cmd-stat">
        <div className="cmd-stat-label">Systems Tested</div>
        <div className="cmd-stat-value"><span>{counts.sys}</span></div>
      </div>
      <div className="cmd-stat">
        <div className="cmd-stat-label">Success Rate</div>
        <div className="cmd-stat-value"><span>{counts.rate}</span>%</div>
      </div>
      <div className="cmd-stat">
        <div className="cmd-stat-label">Years Active</div>
        <div className="cmd-stat-value"><span>{counts.years}</span></div>
      </div>
    </div>
  )
}

function App() {
  const roles = ['Ethical Hacker', 'Software Engineer', 'Web Developer']
  const typedText = useTypewriter(roles)
  const { progress, section } = useScrollProgress()
  useIntersectionObserver('.fade-in')

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const skills = [
    { icon: faUserSecret, title: 'Penetration Testing', percent: 95, desc: 'Identifying vulnerabilities before the bad guys do through comprehensive security assessments.', tags: ['Kali Linux', 'Burp Suite', 'Metasploit'] },
    { icon: faCode, title: 'Software Engineering', percent: 90, desc: 'Building robust, scalable applications with clean architecture and modern practices.', tags: ['Python', 'JavaScript', 'Node.js'] },
    { icon: faGlobe, title: 'Web Development', percent: 88, desc: 'Crafting engaging, responsive web experiences with cutting-edge technologies.', tags: ['React', 'Vue.js', 'Next.js'] },
    { icon: faShieldAlt, title: 'Security Auditing', percent: 92, desc: 'Comprehensive code reviews and infrastructure audits to harden your assets.', tags: ['OWASP', 'SAST/DAST'] },
    { icon: faCogs, title: 'DevSecOps', percent: 85, desc: 'Integrating security into CI/CD pipelines for faster, safer delivery.', tags: ['Docker', 'K8s', 'GitHub Actions'] },
    { icon: faSearch, title: 'Research & Analysis', percent: 80, desc: 'Continuous threat intelligence and vulnerability research.', tags: ['OSINT', 'Forensics'] },
  ]

  const tools = [
    { icon: faLinux, name: 'Kali Linux' },
    { icon: faShieldAlt, name: 'Burp Suite' },
    { icon: faSkull, name: 'Metasploit' },
    { icon: faSearch, name: 'Nmap' },
    { icon: faPython, name: 'Python' },
    { icon: faReact, name: 'React' },
    { icon: faDocker, name: 'Docker' },
    { icon: faDharmachakra, name: 'Kubernetes' },
  ]

  const socialLinks = [
    { icon: faEnvelope, href: 'mailto:menhoudjbdaltyf@gmail.com', name: 'Email' },
    { icon: faGithub, href: 'https://github.com/menhoudj', name: 'GitHub' },
    { icon: faFacebookF, href: 'https://facebook.com/MenhoudjAbdelatif', name: 'Facebook' },
    { icon: faInstagram, href: 'https://instagram.com/abdelatif7984/', name: 'Instagram' },
    { icon: faYoutube, href: 'https://www.youtube.com/@abdelatifmenhoudj', name: 'YouTube' },
    { icon: faXTwitter, href: 'https://x.com/Menhoudj1337561', name: 'X' },
    { icon: faSpotify, href: 'https://open.spotify.com/user/31z2hksrdbgfjtkscn33filivnoa', name: 'Spotify' },
    { icon: faDiscord, href: 'https://discord.com/users/1475143565138198590', name: 'Discord' },
  ]

  return (
    <div className="app">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="gradient-bg"></div>
      <div className="grid-pattern"></div>
      <Particles />
      <GlitchEffects />
      
      <nav className="nav">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>
          M<span>.</span>A
        </a>
        <ul className="nav-links">
          {['home', 'about', 'skills', 'terminal', 'about-me', 'contact'].map(sec => (
            <li key={sec}>
              <a 
                href={`#${sec}`}
                className={section === sec ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo(sec) }}
              >
                {sec === 'about-me' ? 'My Story' : sec.charAt(0).toUpperCase() + sec.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">Available for Projects</div>
              <h1 className="hero-title">
                <span className="name">Menhoudj</span>
                <span className="highlight">Abdelatif</span>
              </h1>
              <div className="hero-typing">
                <span className="icon">⚡</span>
                <span className="prompt">$ </span>
                <span className="text">{typedText}</span>
                <span className="cursor">█</span>
              </div>
              <p className="hero-subtitle">
                I break your systems so the wrong people can't.<br />
                Building secure solutions with a hacker's mindset.
              </p>
              <div className="hero-buttons">
                <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>
                  Let's Talk →
                </a>
                <a href="#skills" className="btn-secondary" onClick={(e) => { e.preventDefault(); scrollTo('skills') }}>
                  View Skills
                </a>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-image-wrapper">
                <img src="/menhoudjprofilefoto.gif" alt="Menhoudj Abdelatif" className="hero-image" />
                <div className="hero-image-border"></div>
                <div className="hero-float-badge top-right">
                  <span className="float-icon">🎯</span>
                  <div className="float-text">
                    <strong>50+</strong>
                    <span>Pen Tests</span>
                  </div>
                </div>
                <div className="hero-float-badge bottom-left">
                  <span className="float-icon">🛡️</span>
                  <div className="float-text">
                    <strong>5+</strong>
                    <span>Years Exp.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-container fade-in">
              <img src="/menhoudjprofilefoto.gif" alt="Menhoudj" className="about-image" />
              <div className="about-decoration"></div>
            </div>
            <div className="about-content fade-in">
              <div className="section-label">About Me</div>
              <h2>Breaking & <span>Building</span> Securely</h2>
              <p>I'm a passionate ethical hacker and full-stack software engineer who thrives on breaking things to understand them, then building them back stronger and more secure.</p>
              <p>With expertise spanning penetration testing, secure development, and modern web technologies, I help organizations identify vulnerabilities and build resilient digital solutions.</p>
              <p>Every line of code I write is crafted with security in mind, every system I test is approached with curiosity and a hacker's mindset.</p>
              <div className="about-stats">
                <div className="about-stat">
                  <div className="about-stat-number">100+</div>
                  <div className="about-stat-label">Projects</div>
                </div>
                <div className="about-stat">
                  <div className="about-stat-number">200+</div>
                  <div className="about-stat-label">Vulns Found</div>
                </div>
                <div className="about-stat">
                  <div className="about-stat-number">50+</div>
                  <div className="about-stat-label">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="skills">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">Expertise</div>
            <h2 className="section-title">What I Do</h2>
            <p className="section-subtitle">Combining security expertise with modern development to deliver robust solutions.</p>
          </div>
          <div className="skills-grid">
            {skills.map((skill, i) => <SkillCard key={i} {...skill} />)}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {[{ num: '50', label: 'Pen Tests' }, { num: '100', label: 'Projects' }, { num: '200', label: 'Vulns Found' }, { num: '5', label: 'Years Exp.' }].map((stat, i) => (
              <div className="stat-item fade-in" key={i}>
                <div className="stat-number">{stat.num}<span>+</span></div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="terminal" className="command-center-section">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">Arsenal</div>
            <h2 className="section-title">Command Center</h2>
            <p className="section-subtitle">Tools and technologies in my security arsenal.</p>
          </div>
          <div className="cmd-grid">
            <div className="cmd-card fade-in">
              <div className="cmd-header">
                <div className="cmd-icon">🎯</div>
                <div>
                  <div className="cmd-title">System Status</div>
                  <div className="cmd-subtitle">Real-time monitoring</div>
                </div>
              </div>
              <CounterStats />
              <div className="cmd-divider"></div>
              <div className="cmd-activity">
                {[{ text: 'Last Pen Test: ', value: '2 hours ago' }, { text: 'System: ', value: 'Fully Secure' }, { text: 'Status: ', value: 'Available' }].map((log, i) => (
                  <div className="cmd-log" key={i}>
                    <div className="cmd-log-dot"></div>
                    <div className="cmd-log-text">{log.text}<span>{log.value}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cmd-card fade-in">
              <div className="cmd-header">
                <div className="cmd-icon">⚡</div>
                <div>
                  <div className="cmd-title">Tools Arsenal</div>
                  <div className="cmd-subtitle">Technologies & frameworks</div>
                </div>
              </div>
              <div className="cmd-tools">
                {tools.map((tool, i) => (
                  <div className="cmd-tool" key={i}>
                    <div className="cmd-tool-icon"><FontAwesomeIcon icon={tool.icon} /></div>
                    <div className="cmd-tool-name">{tool.name}</div>
                  </div>
                ))}
              </div>
              <div className="cmd-badge">
                <span>Access Granted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about-me" className="about-me">
        <div className="container">
          <div className="about-me-grid">
            <div className="cube-container fade-in">
              <div>
                <div className="cube-wrapper">
                  <div className="cube-face front"><FontAwesomeIcon icon={faDocker} /></div>
                  <div className="cube-face back"><FontAwesomeIcon icon={faPython} /></div>
                  <div className="cube-face right"><FontAwesomeIcon icon={faShieldAlt} /></div>
                  <div className="cube-face left"><FontAwesomeIcon icon={faReact} /></div>
                  <div className="cube-face top"><FontAwesomeIcon icon={faLinux} /></div>
                  <div className="cube-face bottom"><FontAwesomeIcon icon={faCode} /></div>
                </div>
                <div className="cube-info">
                  <strong>My Stack</strong>
                  <span>Technologies I work with</span>
                </div>
              </div>
            </div>
            <div className="about-me-content fade-in">
              <div className="section-label">My Story</div>
              <h2>Self-Taught <span>Hacker</span></h2>
              <p>I started my journey in cybersecurity at the age of 14, driven by curiosity and a passion for understanding how systems work — and how they can be broken.</p>
              <p>Through self learning, countless hours of practice, and real-world experience, I developed skills in penetration testing, software development, and web security. Today, at 16 years old, I continue to grow and help others secure their digital presence.</p>
              <div className="about-highlights">
                {[{ num: '14', label: 'Started Learning' }, { num: '16', label: 'Years Old' }, { num: '100%', label: 'Self-Taught' }, { num: '2+', label: 'Years Experience' }].map((item, i) => (
                  <div className="highlight-item" key={i}>
                    <div className="highlight-number">{item.num}</div>
                    <div className="highlight-label">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="about-me-buttons">
                <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Hire Me →</a>
                <a href="#skills" className="btn-secondary" onClick={(e) => { e.preventDefault(); scrollTo('skills') }}>View Skills</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content fade-in">
            <div className="section-label">Get In Touch</div>
            <h2>Ready to Collaborate?</h2>
            <p>Whether you need a security audit, a web application, or both — let's talk.</p>
            <div className="contact-links">
              {socialLinks.map((link, i) => (
                <a href={link.href} className="contact-card" target="_blank" rel="noopener noreferrer" key={i}>
                  <div className="contact-card-icon"><FontAwesomeIcon icon={link.icon} /></div>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>M.A — 2026 — All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App