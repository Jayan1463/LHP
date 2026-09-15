import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const BuildingScene = lazy(() => import('./BuildingScene'))

const Arrow = () => <span aria-hidden="true">↗</span>

const serviceCategories = [
  ['01', 'Residential', 'Houses, villas, duplex homes and apartments built for generations.', ['Residential Construction', 'Villa Construction', 'Apartment Construction', 'Turnkey Construction']],
  ['02', 'Commercial', 'Functional commercial spaces delivered with disciplined engineering.', ['Commercial Construction', 'Offices', 'Shops', 'Commercial Buildings']],
  ['03', 'Renovation', 'Thoughtful upgrades that improve existing spaces without compromise.', ['Renovation & Remodeling', 'Repairs', 'Extensions', 'Waterproofing']],
  ['04', 'Interior', 'Complete interiors designed around everyday comfort and efficient use.', ['Interior Design', 'Modular Kitchen', 'False Ceiling', 'Tile & Flooring', 'Painting Works']],
  ['05', 'Exterior', 'Durable outdoor spaces that complete and protect every property.', ['Exterior Design', 'Compound Walls', 'Landscaping', 'Plumbing & Electrical']],
  ['06', 'Engineering', 'Clear technical guidance from feasibility through final approval.', ['Building Plan Approval', 'Construction Estimation', 'Construction Consultation', 'Optional 3D Design']],
]

const processSteps = ['Free Consultation', 'Site Visit', 'Planning & Cost Estimation', 'Optional 3D Design', 'Project Agreement', 'Construction Begins', 'Quality Inspection', 'Project Handover']

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="LHP Constructions home">
        <img className="brand-logo" src="/lhp-logo.png" alt="LHP Constructions — Lovely Housing Property" />
      </a>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu"><i/><i/></button>
      <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
        <a href="#about">About</a><a href="#services">Services</a><a href="#process">Process</a><a href="#contact" className="nav-cta">Free consultation <Arrow /></a>
      </nav>
    </header>
  )
}

function App() {
  const progress = useRef(0)
  const scrollLabelRef = useRef()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let frame
    const chapters = [...document.querySelectorAll('.chapter')]
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
      document.documentElement.style.setProperty('--scroll', progress.current)
      if (scrollLabelRef.current) scrollLabelRef.current.textContent = String(Math.round(progress.current * 100)).padStart(2, '0')
      const chapterFrames = chapters.map((section) => ({ section, rect: section.getBoundingClientRect() }))
      chapterFrames.forEach(({ section, rect }) => {
        const local = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
        section.style.setProperty('--local', local)
        section.style.setProperty('--circle-y', `${local * 100}px`)
        section.style.setProperty('--circle-scale', 0.65 + local * 0.55)
        section.style.setProperty('--parallax-y', `${(rect.top + rect.height / 2 - window.innerHeight / 2) * -0.028}px`)
      })
      frame = null
    }
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view')
    }), { threshold: 0.16 })
    document.querySelectorAll('.chapter, .service-list article, .stat-grid article, .process-grid li, .reason-grid div').forEach((node) => observer.observe(node))
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    const timer = setTimeout(() => setLoaded(true), 450)
    return () => { window.removeEventListener('scroll', requestUpdate); window.removeEventListener('resize', requestUpdate); observer.disconnect(); if (frame) cancelAnimationFrame(frame); clearTimeout(timer) }
  }, [])

  return (
    <div id="top" className={loaded ? 'app loaded' : 'app'}>
      <div className="loader"><span>V</span><i /></div>
      <Suspense fallback={<div className="canvas-fallback" aria-hidden="true" />}>
        <BuildingScene progress={progress} />
      </Suspense>
      <div className="grain" />
      <Header />
      <aside className="build-progress" aria-hidden="true"><span ref={scrollLabelRef}>00</span><div><i /></div><small>BUILD PROGRESS</small></aside>
      <a className="whatsapp-float" href="https://wa.me/917539905757?text=Hello%20LHP%20Constructions%2C%20I%20would%20like%20to%20enquire%20about%20a%20construction%20project." target="_blank" rel="noreferrer" aria-label="Chat with LHP Constructions on WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a12.7 12.7 0 0 0-11 19.1L3.4 28.5l6.6-1.7A12.8 12.8 0 1 0 16 3Zm0 22.9c-2 0-3.8-.5-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.2 10.2 0 1 1 16 25.9Zm5.6-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-2-.9-3.4-2.7-3.8-3.4-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.2-.2-.5-.3-.8-.4Z"/></svg>
        <span><small>Chat on WhatsApp</small>+91 75399 05757</span>
      </a>

      <main>
        <section className="hero chapter">
          <div className="eyebrow" data-parallax=".2"><i/> Lovely Housing Property</div>
          <h1 data-parallax=".55">WE BUILD<br/><em>DREAMS.</em></h1>
          <p data-parallax=".25">Building dreams with quality and trust. From first consultation to final handover, LHP transforms your vision into a durable place to call your own.</p>
          <a href="#about" className="scroll-cue"><span>Scroll to construct</span><i>↓</i></a>
          <div className="hero-index">01 <span>/</span> 05</div>
        </section>

        <section id="about" className="story chapter align-right">
          <div className="panel reveal-card">
            <div className="eyebrow"><i/> About LHP Constructions</div>
            <h2 data-parallax=".28">QUALITY YOU<br/>CAN <em>TRUST.</em></h2>
            <p>LHP Constructions is a professional residential and commercial construction company focused on quality workmanship, transparent pricing, timely delivery and complete customer satisfaction. We combine innovative design with durable construction to turn every client’s vision into reality.</p>
            <a className="text-link" href="#services">Explore our services <Arrow /></a>
          </div>
          <div className="side-note">QUALITY / TRUST / TRANSPARENCY</div>
        </section>

        <section id="projects" className="metrics chapter">
          <div className="metrics-title"><span>Our company highlights</span><h2 data-parallax=".22">EXPERIENCE<br/>THAT <em>SHOWS.</em></h2></div>
          <div className="stat-grid">
            <article><strong>100<sup>+</sup></strong><span>Happy customers</span></article>
            <article><strong>50<sup>+</sup></strong><span>Projects completed</span></article>
            <article><strong>8<sup>+</sup></strong><span>Years of experience</span></article>
            <article><strong>20<sup>+</sup></strong><span>Expert team members</span></article>
          </div>
        </section>

        <section id="services" className="services chapter">
          <div className="services-head"><div className="eyebrow"><i/> Complete construction solutions</div><h2 data-parallax=".18">EVERY SERVICE.<br/><em>ONE TEAM.</em></h2></div>
          <div className="service-list">
            {serviceCategories.map(([n, title, body, items]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><small>{items.join(' · ')}</small></div><p>{body}</p><Arrow /></article>)}
          </div>
        </section>

        <section id="process" className="process chapter">
          <div className="process-copy"><div className="eyebrow"><i/> Simple and transparent</div><h2 data-parallax=".2">FROM SITE VISIT<br/>TO <em>HANDOVER.</em></h2><p>One accountable process, with quality checks and clear communication at every stage.</p></div>
          <ol className="process-grid">{processSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}</ol>
        </section>

        <section className="reasons chapter">
          <div><div className="eyebrow"><i/> Why choose LHP</div><h2 data-parallax=".2">BUILT AROUND<br/><em>YOUR TRUST.</em></h2></div>
          <div className="reason-grid">{['Experienced Engineers', 'Skilled Construction Workers', 'Premium Quality Materials', 'Affordable Pricing', 'Transparent Quotations', 'Free Site Visit', 'On-Time Project Delivery', 'Modern Architectural Designs', 'After Project Support', 'Safety Standards'].map((item, index) => <div key={item}><span>0{index + 1}</span>{item}</div>)}</div>
        </section>

        <section className="manifesto chapter">
          <p>Villas · Duplex houses · Apartments · Commercial buildings · Interiors · Renovations</p>
          <h2 data-parallax=".3">YOUR VISION.<br/>OUR CRAFT.<br/><em>BUILT TO LAST.</em></h2>
          <div className="offer-row"><span>Free site visit</span><span>Free construction estimation</span><span>First consultation free</span></div>
        </section>

        <section id="contact" className="contact chapter">
          <div className="contact-copy"><div className="eyebrow"><i/> Free consultation and estimate</div><h2>LET’S BUILD<br/><em>TOGETHER.</em></h2><p>Get help with cost estimation, construction timelines, plan approval, turnkey projects and service availability across Tamil Nadu.</p><div className="support-list"><a href="https://wa.me/917539905757?text=Hello%20LHP%20Constructions%2C%20I%20would%20like%20a%20free%20consultation." target="_blank" rel="noreferrer">WhatsApp chat</a><a href="tel:+917539905757">Call +91 75399 05757</a><span>Email support</span><span>Online enquiry</span></div></div>
          <form className="enquiry-form" onSubmit={(event) => event.preventDefault()}><label>Your name<input required name="name" placeholder="Enter your name" /></label><label>Phone number<input required name="phone" inputMode="tel" placeholder="Enter your phone number" /></label><label>Project type<select name="project"><option>Residential construction</option><option>Villa construction</option><option>Commercial construction</option><option>Renovation</option><option>Interior design</option><option>Plan approval / estimation</option></select></label><label>Tell us about your project<textarea name="message" rows="3" placeholder="Location, size and requirements" /></label><button type="submit">Request free consultation <Arrow /></button></form>
          <footer><div className="brand footer-brand"><img className="brand-logo" src="/lhp-logo.png" alt="LHP Constructions" /></div><p>© 2026 LHP Constructions</p><div><a href="#services">Services</a><a href="#process">Our process</a><a href="#top">Back to top ↑</a></div></footer>
        </section>
      </main>
    </div>
  )
}

export default App




