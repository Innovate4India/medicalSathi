import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Activity, HeartPulse, ShieldCheck, Stethoscope, Droplets, Hospital, LockKeyhole, CircleCheck, Clock3, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeControl } from '@/components/theme-control'

const features = [
  { icon: ShieldCheck, title: 'Privacy by design', text: 'Share only the information needed to coordinate care, with clear consent at every step.' },
  { icon: HeartPulse, title: 'Care, connected', text: 'Bring patients, clinicians and care teams into one coordinated experience.' },
  { icon: Droplets, title: 'Community response', text: 'Help connect eligible blood donors with nearby requests when it matters.' },
]

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="MedicalSathi home"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link>
        <nav className="main-nav" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#features">Our platform</a><a href="#emergency">Emergency care</a></nav>
        <div className="header-actions"><ThemeControl /><Link className="login-link" href="/login">Log in</Link><Button nativeButton={false} render={<Link href="/role-selection" />}>Get started <ArrowRight data-icon="inline-end" /></Button></div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> CARE, CONNECTED WHEN IT COUNTS</div>
          <h1>Better connected.<br /><span>Here for each other.</span></h1>
          <p className="hero-description">A thoughtful way to bring patients, doctors, hospitals and blood donors together — with privacy and people at the heart of every connection.</p>
          <div className="hero-actions"><Button nativeButton={false} size="lg" render={<Link href="/role-selection" />}>Explore MedicalSathi <ArrowRight data-icon="inline-end" /></Button><Link className="text-action" href="#how-it-works">See how it works <ArrowUpRight /></Link></div>
          <div className="trust-note"><div className="trust-icons"><span><ShieldCheck /></span><span><LockKeyhole /></span></div><span>Designed with privacy in mind<br /><strong>Your information stays yours</strong></span></div>
        </div>
        <div className="hero-visual" aria-label="Illustration of connected healthcare support">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="hero-center"><HeartPulse /></div>
          <div className="connect-line line-a" /><div className="connect-line line-b" /><div className="connect-line line-c" />
          <div className="float-card float-patient"><span className="float-icon patient-icon"><UsersRound /></span><span><strong>Patients</strong><small>At the center of care</small></span><i className="status-dot" /></div>
          <div className="float-card float-doctor"><span className="float-icon doctor-icon"><Stethoscope /></span><span><strong>Care teams</strong><small>Working together</small></span><i className="status-dot" /></div>
          <div className="float-card float-community"><span className="float-icon community-icon"><Droplets /></span><span><strong>Community</strong><small>Ready to lend a hand</small></span><i className="status-dot" /></div>
          <div className="visual-caption"><CircleCheck /> One caring network, many ways to help</div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Platform principles"><div><ShieldCheck /><span>Privacy comes first</span></div><div><Clock3 /><span>Support when it matters</span></div><div><UsersRound /><span>Built around people</span></div><div><Hospital /><span>Made for care teams</span></div></section>

      <section className="section-block features-section" id="features"><div className="section-intro"><div className="eyebrow">A MORE CONNECTED WAY TO CARE</div><h2>Support that brings<br /><span>people closer to care.</span></h2><p>MedicalSathi is a privacy-preserving gateway built to make care coordination feel clearer, more human and more connected.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, text }, index) => <article className="feature-card" key={title}><div className={`feature-icon feature-icon-${index}`}><Icon /></div><h3>{title}</h3><p>{text}</p><a href="#how-it-works">Learn more <ArrowRight /></a></article>)}</div></section>

      <section className="how-section" id="how-it-works"><div className="how-heading"><div className="eyebrow">SIMPLE BY DESIGN</div><h2>Help starts with<br /><span>a simple connection.</span></h2><p>Every role has a place. Every connection is made with care.</p></div><div className="steps-grid"><article><span className="step-number">01</span><div className="step-icon"><UsersRound /></div><h3>Choose your place</h3><p>Join as a patient, doctor, hospital or blood donor.</p></article><article><span className="step-number">02</span><div className="step-icon"><ShieldCheck /></div><h3>Share with purpose</h3><p>Decide what information you want to share and with whom.</p></article><article><span className="step-number">03</span><div className="step-icon"><HeartPulse /></div><h3>Move forward together</h3><p>Coordinate next steps with the people supporting your care.</p></article></div></section>

      <section className="emergency-section" id="emergency"><div className="emergency-icon"><Activity /></div><div><div className="eyebrow">WHEN EVERY MOMENT MATTERS</div><h2>Find your next step in an emergency.</h2><p>MedicalSathi can help you connect with participating care providers and community support. If someone is in immediate danger, contact your local emergency services.</p></div><Button nativeButton={false} variant="outline" size="lg" render={<Link href="/role-selection" />}>Explore emergency support <ArrowRight data-icon="inline-end" /></Button></section>

      <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link><p>Care moves forward, together.</p><div className="footer-links"><Link href="/login">Log in</Link><Link href="/register">Create account</Link><a href="#features">About</a></div><span className="copyright">© 2026 MedicalSathi. A sample interface for demonstration.</span></footer>
    </main>
  )
}
