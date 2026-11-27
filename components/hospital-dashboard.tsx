'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, BadgeCheck, Bell, Building2, CalendarDays,
  Check, CheckCircle2, ChevronRight, Clock3, Droplets, FileCheck2, FileText, HeartPulse,
  Hospital, LogOut, MapPin, Menu, Plus, ShieldCheck, Stethoscope, Upload, Users, X,
} from 'lucide-react'
import { ThemeControl } from '@/components/theme-control'
import { BloodDonorNetwork } from '@/components/blood-donor-network'

type Doctor = { name: string; specialty: string; registration: string; status: 'Verified' | 'Pending'; initials: string }
type BloodRequest = { patient: string; group: string; units: number; location: string; date: string; status: 'Active' | 'Fulfilled' | 'Review' }
type HospitalSection = 'overview' | 'profile' | 'doctors' | 'blood' | 'verification'

const initialDoctors: Doctor[] = [
  { name: 'Dr. Avery Patel', specialty: 'Emergency Medicine', registration: 'DEMO-MED-1014', status: 'Verified', initials: 'AP' },
  { name: 'Dr. Sofia Nguyen', specialty: 'Cardiology', registration: 'DEMO-MED-2087', status: 'Verified', initials: 'SN' },
  { name: 'Dr. Ethan Brooks', specialty: 'Internal Medicine', registration: 'DEMO-MED-3152', status: 'Pending', initials: 'EB' },
  { name: 'Dr. Maya Chen', specialty: 'Pediatrics', registration: 'DEMO-MED-4266', status: 'Verified', initials: 'MC' },
]

const initialRequests: BloodRequest[] = [
  { patient: 'Sample patient A', group: 'O−', units: 2, location: 'Northstar Medical Center · Emergency', date: 'Today, 9:18 AM', status: 'Active' },
  { patient: 'Sample patient B', group: 'A+', units: 1, location: 'Northstar Medical Center · Ward 3', date: 'Today, 8:42 AM', status: 'Active' },
  { patient: 'Sample patient C', group: 'B+', units: 3, location: 'Northstar Medical Center · Surgery', date: 'Yesterday, 4:20 PM', status: 'Fulfilled' },
]

const navItems: { id: HospitalSection; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'profile', label: 'Hospital profile', icon: Building2 },
  { id: 'doctors', label: 'Doctor management', icon: Stethoscope },
  { id: 'blood', label: 'Blood requests', icon: Droplets },
  { id: 'verification', label: 'Verification', icon: ShieldCheck },
]

const sectionCopy: Record<HospitalSection, { title: string; description: string }> = {
  overview: { title: 'Good morning, Northstar team', description: 'A clear view of your hospital, care teams and community needs.' },
  profile: { title: 'Hospital profile', description: 'Manage your organization details and public contact information.' },
  doctors: { title: 'Doctor management', description: 'Review provider profiles, specialties and verification status.' },
  blood: { title: 'Blood requests', description: 'Coordinate sample requests with clear status and location details.' },
  verification: { title: 'Hospital verification', description: 'Review registration details and the sample document submission flow.' },
}

export function HospitalDashboard() {
  const [activeSection, setActiveSection] = useState<HospitalSection>('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [doctors, setDoctors] = useState(initialDoctors)
  const [requests, setRequests] = useState(initialRequests)
  const [dialog, setDialog] = useState<'profile' | 'doctor' | 'request' | null>(null)
  const [notice, setNotice] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [profile, setProfile] = useState({ name: 'Northstar Medical Center', registration: 'DEMO-HSP-2048', address: '1280 Harbor Avenue, Sample City, CA 90000', phone: '+1 (555) 010-4400', email: 'care@northstar.example.test' })

  function submitDoctor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const name = String(values.get('name')).trim()
    const specialty = String(values.get('specialty'))
    const registration = String(values.get('registration')).trim()
    if (!name || !registration) return
    setDoctors((current) => [{ name, specialty, registration, status: 'Pending', initials: name.split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase() }, ...current])
    setDialog(null)
    setNotice('Sample provider added for this session and marked pending verification.')
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const patient = String(values.get('patient')).trim() || 'Sample patient'
    const group = String(values.get('group'))
    const units = Number(values.get('units'))
    const location = String(values.get('location')).trim() || 'Northstar Medical Center'
    if (!Number.isInteger(units) || units < 1 || units > 20) return
    setRequests((current) => [{ patient, group, units, location, date: 'Just now', status: 'Active' }, ...current])
    setDialog(null)
    setNotice('Sample blood request created for this session only.')
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setProfile({ name: String(values.get('name')), registration: String(values.get('registration')), address: String(values.get('address')), phone: String(values.get('phone')), email: String(values.get('email')) })
    setDialog(null)
    setNotice('Sample hospital profile updated for this session only.')
  }

  const activeRequests = requests.filter((request) => request.status === 'Active').length
  const copy = sectionCopy[activeSection]

  return (
    <div className="dashboard-shell hospital-dashboard">
      <aside className="dash-sidebar hospital-sidebar">
        <Link href="/" className="brand"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link>
        <div className="dash-workspace"><span className="workspace-icon"><Hospital /></span><span><strong>Hospital space</strong><small>Sample workspace</small></span></div>
        <span className="dash-label">CARE ORGANIZATION</span>
        <nav className="dash-nav" aria-label="Hospital dashboard navigation">
          {navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={activeSection === id ? 'page' : undefined} className={activeSection === id ? 'active' : ''} onClick={() => { setActiveSection(id); setMobileNav(false) }}><Icon />{label}</button>)}
        </nav>
        <div className="sidebar-bottom"><nav className="dash-nav"><button type="button" aria-current={activeSection === 'verification' ? 'page' : undefined} onClick={() => { setActiveSection('verification'); setMobileNav(false) }}><ShieldCheck />Privacy & verification</button><Link href="/login"><LogOut />Sign out</Link></nav></div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar hospital-topbar">
          <div className="breadcrumb"><Link href="/">MedicalSathi</Link> / <strong>Hospital space</strong></div>
          <button type="button" className="hospital-mobile-trigger" aria-label="Toggle hospital navigation" aria-expanded={mobileNav} onClick={() => setMobileNav((current) => !current)}><Menu /></button>
          <div className="hospital-top-actions"><ThemeControl /><button type="button" aria-label="Notifications" className="notification-button"><Bell /></button><span className="hospital-header-avatar"><Building2 /></span><span className="hospital-header-name">Northstar team</span></div>
        </header>
        {mobileNav && <nav className="hospital-mobile-nav" aria-label="Hospital dashboard navigation">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={activeSection === id ? 'active' : ''} onClick={() => { setActiveSection(id); setMobileNav(false) }}><Icon />{label}</button>)}</nav>}

        <main className="hospital-content">
          <div className="hospital-heading"><div><span className="hospital-kicker"><span /> HOSPITAL WORKSPACE · SAMPLE DATA</span><h1>{copy.title}</h1><p>{copy.description}</p></div><span className="hospital-sample-label">SAMPLE DATA · UI DEMO</span></div>
          {notice && <p className="hospital-notice" role="status"><CheckCircle2 />{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X /></button></p>}

          {activeSection === 'overview' && <>
            <section className="hospital-profile-banner" aria-label="Hospital profile summary"><div className="hospital-profile-main"><span className="hospital-logo"><Building2 /></span><div><span className="hospital-section-kicker">HOSPITAL PROFILE</span><h2>{profile.name} <BadgeCheck aria-label="Verified" /></h2><p><MapPin /> {profile.address}</p></div></div><div className="hospital-profile-status"><small>Registration</small><strong>{profile.registration}</strong><span><CheckCircle2 /> Verified <em>Sample status</em></span></div><button type="button" className="hospital-outline-button" onClick={() => setDialog('profile')}>Edit profile <ChevronRight /></button></section>
            <section className="hospital-metric-grid" aria-label="Hospital overview metrics"><article className="hospital-metric-card"><span className="hospital-metric-icon teal"><Users /></span><span><small>Registered doctors</small><strong>{doctors.length.toString().padStart(2, '0')}</strong><em>{doctors.filter((doctor) => doctor.status === 'Verified').length} verified · sample</em></span><ArrowDownRight /></article><article className="hospital-metric-card"><span className="hospital-metric-icon amber"><AlertTriangle /></span><span><small>Emergency cases</small><strong>08</strong><em>03 need review · sample</em></span><ArrowRight /></article><article className="hospital-metric-card"><span className="hospital-metric-icon red"><Droplets /></span><span><small>Active blood requests</small><strong>{activeRequests.toString().padStart(2, '0')}</strong><em>Across 2 blood groups</em></span><ArrowRight /></article><article className="hospital-metric-card"><span className="hospital-metric-icon blue"><FileCheck2 /></span><span><small>Verification status</small><strong>Verified</strong><em>Sample organization</em></span><CheckCircle2 /></article></section>
            <div className="hospital-overview-grid"><section className="hospital-panel"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">CARE OPERATIONS</span><h2>Emergency cases overview</h2></div><span className="hospital-sample-chip">SAMPLE</span></div><div className="hospital-emergency-list"><article><span className="hospital-case-icon urgent"><AlertTriangle /></span><span><strong>Sample patient A</strong><small>Emergency department · O− blood requested</small></span><span className="hospital-status review">Needs review</span><time>9:18 AM</time></article><article><span className="hospital-case-icon"><Activity /></span><span><strong>Sample patient B</strong><small>Ward 3 · Care team notified</small></span><span className="hospital-status active">In progress</span><time>8:42 AM</time></article><article><span className="hospital-case-icon"><Check /></span><span><strong>Sample patient C</strong><small>Surgery · Request fulfilled</small></span><span className="hospital-status fulfilled">Resolved</span><time>Yesterday</time></article></div></section><section className="hospital-panel hospital-activity-panel"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">LATEST UPDATES</span><h2>Recent activities</h2></div><Activity /></div><div className="hospital-activity-list"><article><span className="hospital-activity-icon teal"><Stethoscope /></span><span><strong>Doctor profile added</strong><small>Dr. Ethan Brooks · Sample provider</small><em>Today, 9:05 AM</em></span></article><article><span className="hospital-activity-icon amber"><Droplets /></span><span><strong>Blood request created</strong><small>O− · 2 units · Emergency</small><em>Today, 9:18 AM</em></span></article><article><span className="hospital-activity-icon blue"><FileText /></span><span><strong>Verification reviewed</strong><small>Sample hospital documents</small><em>Yesterday</em></span></article></div></section></div>
            <section className="hospital-panel hospital-requests-preview"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">COMMUNITY NEEDS</span><h2>Active blood requests</h2></div><button type="button" className="hospital-primary-button" onClick={() => { setActiveSection('blood'); setDialog('request') }}><Plus /> Create request</button></div><RequestList requests={requests.slice(0, 3)} /></section>
          </>}

          {activeSection === 'profile' && <section className="hospital-panel hospital-page-panel"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">ORGANIZATION DETAILS</span><h2>Hospital profile</h2></div><button type="button" className="hospital-primary-button" onClick={() => setDialog('profile')}>Edit profile</button></div><div className="hospital-profile-identity"><span className="hospital-logo large"><Building2 /></span><span><strong>{profile.name}</strong><small>Hospital registration · {profile.registration}</small></span><span className="hospital-verification-badge"><CheckCircle2 /> Verified <em>Sample</em></span></div><div className="hospital-details-grid"><Detail label="Hospital name" value={profile.name} /><Detail label="Registration number" value={profile.registration} /><Detail label="Address" value={profile.address} /><Detail label="Contact phone" value={profile.phone} /><Detail label="Contact email" value={profile.email} /><Detail label="Verification" value="Verified · sample organization" /></div><p className="hospital-data-note"><ShieldCheck /> Fictional organization details for UI demonstration. Updates stay in this browser session only.</p></section>}

          {activeSection === 'doctors' && <section className="hospital-panel hospital-page-panel"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">PROVIDER DIRECTORY</span><h2>Doctor management</h2></div><button type="button" className="hospital-primary-button" onClick={() => setDialog('doctor')}><Plus /> Add doctor</button></div><p className="hospital-page-intro">Review provider profiles and verification status. All listed clinicians are fictional sample data.</p><div className="hospital-doctor-list">{doctors.map((doctor) => <article key={doctor.registration}><span className="hospital-doctor-avatar">{doctor.initials}</span><span className="hospital-doctor-copy"><strong>{doctor.name}</strong><small>{doctor.specialty}</small><em>Registration · {doctor.registration}</em></span><span className={`hospital-verification-badge ${doctor.status === 'Pending' ? 'pending' : ''}`}>{doctor.status === 'Pending' ? <Clock3 /> : <CheckCircle2 />}{doctor.status}<em>Sample</em></span><button type="button" className="hospital-row-action" aria-label={`View ${doctor.name} profile`} onClick={() => setNotice(`${doctor.name} · ${doctor.specialty} · ${doctor.registration} · ${doctor.status} (sample profile)`)}>View profile <ArrowRight /></button></article>)}</div></section>}

          {activeSection === 'blood' && <section className="hospital-panel hospital-page-panel"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">BLOOD BANK COORDINATION</span><h2>Blood requests</h2></div><button type="button" className="hospital-primary-button" onClick={() => setDialog('request')}><Plus /> Create request</button></div><div className="hospital-request-summary"><span><Droplets /><strong>{activeRequests}</strong><small>Active sample requests</small></span><span><Users /><strong>3</strong><small>Groups requested</small></span><span><CheckCircle2 /><strong>1</strong><small>Fulfilled this week</small></span></div><h3 className="hospital-subheading">Request history</h3><RequestList requests={requests} /><p className="hospital-data-note"><ShieldCheck /> UI demonstration only. No request is sent or shared with a blood bank.</p><div className="hospital-blood-network"><BloodDonorNetwork mode="hospital" /></div></section>}

          {activeSection === 'verification' && <section className="hospital-panel hospital-page-panel"><div className="hospital-panel-heading"><div><span className="hospital-section-kicker">ORGANIZATION TRUST</span><h2>Hospital verification</h2></div><span className="hospital-verification-badge"><CheckCircle2 /> Verified <em>Sample status</em></span></div><div className="hospital-verification-banner"><span className="hospital-verification-mark"><ShieldCheck /></span><div><strong>Sample organization verified</strong><p>This is an illustrative status only. No documents or credentials have been validated.</p></div><span className="hospital-sample-chip">DEMO</span></div><div className="hospital-details-grid verification-details"><Detail label="Registered organization" value={profile.name} /><Detail label="Registration number" value={profile.registration} /><Detail label="Registered address" value={profile.address} /><Detail label="Contact email" value={profile.email} /></div><div className="hospital-upload-box"><span className="hospital-upload-icon"><Upload /></span><div><strong>Registration documents</strong><p>Choose a sample file to preview the document upload interface. Nothing is sent or stored.</p>{documentName && <span className="hospital-upload-selected"><FileCheck2 /> {documentName} · selected for this session</span>}</div><label className="hospital-outline-button" htmlFor="hospital-document-upload"><Upload /> Choose file<input id="hospital-document-upload" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => setDocumentName(event.currentTarget.files?.[0]?.name ?? '')} /></label></div><p className="hospital-data-note" id="privacy"><ShieldCheck /> For this frontend demo, verification and document selection are local UI states. No real verification or upload occurs.</p></section>}

          <p className="hospital-disclaimer"><ShieldCheck /> MedicalSathi hospital workspace · Demonstration only. All organization, provider and patient details are fictional sample data.</p>
        </main>
      </div>

      {dialog && <div className="hospital-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}><section className="hospital-dialog" role="dialog" aria-modal="true" aria-labelledby="hospital-dialog-title"><div className="hospital-dialog-heading"><div><span className="hospital-section-kicker">SAMPLE DATA · UI DEMO</span><h2 id="hospital-dialog-title">{dialog === 'profile' ? 'Edit hospital profile' : dialog === 'doctor' ? 'Add doctor profile' : 'Create blood request'}</h2></div><button type="button" className="hospital-dialog-close" onClick={() => setDialog(null)} aria-label="Close dialog"><X /></button></div>
        {dialog === 'profile' && <form className="hospital-form" onSubmit={submitProfile}><label>Hospital name<input name="name" required defaultValue={profile.name} /></label><label>Registration number<input name="registration" required defaultValue={profile.registration} /></label><label>Address<input name="address" required defaultValue={profile.address} /></label><label>Phone number<input name="phone" type="tel" required defaultValue={profile.phone} /></label><label>Contact email<input name="email" type="email" required defaultValue={profile.email} /></label><p><ShieldCheck /> Profile edits are saved for this session only.</p><div className="hospital-dialog-actions"><button type="button" className="hospital-secondary-button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="hospital-primary-button"><Check /> Save sample profile</button></div></form>}
        {dialog === 'doctor' && <form className="hospital-form" onSubmit={submitDoctor}><label>Doctor name<input name="name" required placeholder="e.g. Dr. Taylor James" /></label><label>Specialization<select name="specialty" defaultValue="Internal Medicine"><option>Internal Medicine</option><option>Emergency Medicine</option><option>Cardiology</option><option>Pediatrics</option><option>Family Medicine</option><option>Orthopedics</option></select></label><label>Medical registration number<input name="registration" required placeholder="e.g. DEMO-MED-5001" /></label><p><ShieldCheck /> Added doctors appear as sample profiles and require verification.</p><div className="hospital-dialog-actions"><button type="button" className="hospital-secondary-button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="hospital-primary-button"><Plus /> Add sample doctor</button></div></form>}
        {dialog === 'request' && <form className="hospital-form" onSubmit={submitRequest}><label>Sample patient reference<input name="patient" placeholder="e.g. Sample patient D" /></label><div className="hospital-form-row"><label>Blood group<select name="group" defaultValue="O−"><option>O−</option><option>O+</option><option>A−</option><option>A+</option><option>B−</option><option>B+</option><option>AB−</option><option>AB+</option></select></label><label>Required units<input name="units" type="number" min="1" max="20" required defaultValue="1" /></label></div><label>Hospital location<input name="location" required defaultValue="Northstar Medical Center · Emergency" /></label><p><ShieldCheck /> Demo only. This request is not shared with a blood bank.</p><div className="hospital-dialog-actions"><button type="button" className="hospital-secondary-button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="hospital-primary-button"><Droplets /> Create sample request</button></div></form>}
      </section></div>}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="hospital-detail"><small>{label}</small><strong>{value}</strong></div>
}

function RequestList({ requests }: { requests: BloodRequest[] }) {
  return <div className="hospital-request-list">{requests.map((request, index) => <article key={`${request.patient}-${request.group}-${request.date}-${index}`}><span className="hospital-request-blood">{request.group}</span><span className="hospital-request-copy"><strong>{request.patient}</strong><small>{request.location}</small></span><span className="hospital-request-units">{request.units} {request.units === 1 ? 'unit' : 'units'}</span><time>{request.date}</time><span className={`hospital-status ${request.status.toLowerCase()}`}>{request.status}</span></article>)}</div>
}
