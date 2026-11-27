'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, HeartPulse, LockKeyhole, ShieldCheck, Siren, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeControl } from '@/components/theme-control'

const roles = [
  { id: 'patient', title: 'Patient', detail: 'Find and coordinate care' },
  { id: 'doctor', title: 'Doctor', detail: 'Support your patients' },
  { id: 'hospital', title: 'Hospital', detail: 'Coordinate your care team' },
  { id: 'donor', title: 'Blood donor', detail: 'Help your community' },
]

export function AuthScreen({ mode }: { mode: 'login' | 'register' | 'roles' }) {
  const [selectedRole, setSelectedRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const isLogin = mode === 'login'
  const isRoles = mode === 'roles'

  return <main className="auth-page">
    <section className="auth-aside">
      <Link href="/" className="brand" aria-label="MedicalSathi home"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link>
      <div className="auth-aside-content">
        <div className="auth-welcome"><span className="auth-tagline">Your health, our priority.</span><h1>Your Healthcare Companion</h1><p>Always with you, for a healthier tomorrow.</p></div>
        <div className="auth-illustration-wrap"><Image className="auth-illustration" src="/medical-sathi-auth-illustration.png" alt="A doctor speaking with a patient in a welcoming clinic" fill priority sizes="(max-width: 760px) 100vw, 52vw" /><span className="auth-floating-heart"><HeartPulse /></span></div>
      </div>
      <div className="auth-features"><span><ShieldCheck />Secure &amp; Private</span><span><Siren />Emergency Support</span><span><UsersRound />Trusted by Thousands</span></div>
    </section>

    <section className="auth-main">
      <div className="auth-mobile-top"><Link href="/" className="brand"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link><ThemeControl /></div>
      <div className="auth-card">
        <div className="auth-card-top"><span className="auth-card-mark"><HeartPulse /></span><ThemeControl /></div>
        {!isRoles && <nav className="auth-tabs" aria-label="Account access"><Link href="/login" className={isLogin ? 'active' : ''} aria-current={isLogin ? 'page' : undefined}>Login</Link><Link href="/register" className={!isLogin ? 'active' : ''} aria-current={!isLogin ? 'page' : undefined}>Register</Link></nav>}
        <div className="auth-heading"><span className="auth-kicker">{isRoles ? 'ONE LAST STEP' : isLogin ? 'WELCOME TO MEDICALSATHI' : 'JOIN MEDICALSATHI'}</span><h2>{isRoles ? 'Choose your role' : isLogin ? 'Welcome Back' : 'Create your account'}</h2><p>{isRoles ? 'Choose how you would like to continue.' : isLogin ? 'Sign in to continue to your care space.' : 'Your healthcare journey starts here.'}</p></div>
        {isRoles ? <div className="role-choice-list" role="radiogroup" aria-label="Choose your role">{roles.map((role) => <button type="button" className={`role-choice ${selectedRole === role.id ? 'selected' : ''}`} key={role.id} onClick={() => setSelectedRole(role.id)} role="radio" aria-checked={selectedRole === role.id}><span className="role-radio" /><span><strong>{role.title}</strong><small>{role.detail}</small></span><ArrowRight /></button>)}<Button nativeButton={false} className="auth-submit" size="lg" disabled={!selectedRole} render={<Link href={selectedRole ? `/dashboard/${selectedRole}` : '/role-selection'} />}>Continue <ArrowRight data-icon="inline-end" /></Button><p className="demo-note">Sample experience only — no account or personal data is created.</p></div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
          {!isLogin && <label>Full name<input name="name" autoComplete="name" placeholder="Your full name" required /></label>}
          {!isLogin && <label>Email Address <span className="optional-label">(Optional)</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>}
          <label>Phone Number<span className="phone-field"><span className="phone-prefix" aria-label="India country code">🇮🇳 <span>+91</span></span><input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Enter your phone number" required /></span></label>
          <label>Password<span className="password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Enter your password" minLength={8} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button></span></label>
          {isLogin && <div className="form-extras"><label className="check-label"><input type="checkbox" /> Remember Me</label><a href="#forgot-password">Forgot Password?</a></div>}
          <Button type="submit" className="auth-submit" size="lg">{isLogin ? 'Login' : 'Create Account'} <ArrowRight data-icon="inline-end" /></Button>
          {submitted && <p className="demo-note" role="status">This frontend demo does not create accounts or send your information.</p>}
          <p className="auth-switch">{isLogin ? 'New to MedicalSathi? ' : 'Already have an account? '}<Link href={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Login'}</Link></p>
        </form>}
        <div className="auth-privacy"><LockKeyhole /><span>Your information is protected with care.</span></div>
      </div>
      <div className="auth-bottom">Made with care <span>·</span> Your health, our priority.</div>
    </section>
  </main>
}
