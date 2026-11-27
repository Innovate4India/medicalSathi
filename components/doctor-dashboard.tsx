'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, BadgeCheck, Bell, CalendarDays, Check, CheckCircle2, ChevronRight, ClipboardList, Clock3, FilePlus2, FileText, HeartPulse, KeyRound, LockKeyhole, Menu, Plus, QrCode, ScanLine, ShieldAlert, ShieldCheck, Stethoscope, UserRound, Users, X } from 'lucide-react'
import { ThemeControl } from '@/components/theme-control'

type MedicalRecord = { id: number; patient: string; category: string; date: string; doctor: string; hospital: string; summary: string }
type DemoAccessState = 'idle' | 'scanned' | 'pending' | 'granted' | 'denied'

const accessStateCopy: Record<DemoAccessState, { title: string; detail: string }> = {
  idle: { title: 'Awaiting sample scan', detail: 'No patient access has been requested.' },
  scanned: { title: 'QR scanned · demo', detail: 'Sample identity preview only; access has not been requested.' },
  pending: { title: 'Access pending · demo', detail: 'Choose a simulated approval or denial below.' },
  granted: { title: 'Access granted · demo', detail: 'Sample emergency summary is visible for this session.' },
  denied: { title: 'Access denied · demo', detail: 'Sample access was denied; no summary is revealed.' },
}

const patients = [
  { initials: 'AP', name: 'Sample patient A', id: 'MS-DEMO-2048', age: '36', blood: 'O+', condition: 'Seasonal allergies', status: 'Consent active' },
  { initials: 'JR', name: 'Sample patient B', id: 'MS-DEMO-3196', age: '52', blood: 'A−', condition: 'No conditions listed', status: 'Consent active' },
  { initials: 'SK', name: 'Sample patient C', id: 'MS-DEMO-4721', age: '28', blood: 'B+', condition: 'Sample asthma history', status: 'Consent needed' },
]

const navItems = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'profile', label: 'Doctor profile', icon: Stethoscope },
  { id: 'scanner', label: 'Patient QR scanner', icon: QrCode },
  { id: 'records', label: 'Patient records', icon: FileText },
  { id: 'history', label: 'Access history', icon: Clock3 },
]

const activities = [
  { icon: FileText, title: 'Sample record reviewed', detail: 'Sample patient A · Sample Family Clinic', time: '9:42 AM', tone: 'teal' },
  { icon: ShieldCheck, title: 'Time-limited access approved', detail: 'Sample patient B · Sample Medical Center', time: 'Yesterday', tone: 'blue' },
  { icon: CalendarDays, title: 'Care coordination visit', detail: 'Sample patient C · Sample Community Health', time: 'Oct 24', tone: 'violet' },
]

const initialRecords: MedicalRecord[] = [
  { id: 1, patient: 'Sample patient A', category: 'Lab report', date: 'Oct 26, 2026', doctor: 'Dr. Morgan Lee', hospital: 'Sample Family Clinic', summary: 'Routine sample blood panel reviewed. No real results.' },
  { id: 2, patient: 'Sample patient A', category: 'Imaging report', date: 'Oct 21, 2026', doctor: 'Dr. Morgan Lee', hospital: 'Sample Family Clinic', summary: 'Fictional chest imaging summary for this UI demo.' },
  { id: 3, patient: 'Sample patient B', category: 'Prescription', date: 'Oct 25, 2026', doctor: 'Dr. Morgan Lee', hospital: 'Sample Medical Center', summary: 'Sample medication review; no treatment guidance.' },
  { id: 4, patient: 'Sample patient B', category: 'Medical history', date: 'Oct 23, 2026', doctor: 'Dr. Riley Chen', hospital: 'Sample Medical Center', summary: 'Fictional medical history excerpt for interface preview.' },
  { id: 5, patient: 'Sample patient C', category: 'Diagnosis', date: 'Oct 22, 2026', doctor: 'Dr. Morgan Lee', hospital: 'Sample Community Health', summary: 'Illustrative diagnosis note; no real patient details.' },
]

export function DoctorDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [qrEntry, setQrEntry] = useState('')
  const [identified, setIdentified] = useState<(typeof patients)[number] | null>(null)
  const [accessState, setAccessState] = useState<DemoAccessState>('idle')
  const [records, setRecords] = useState(initialRecords)
  const [editing, setEditing] = useState<MedicalRecord | 'new' | null>(null)
  const [notice, setNotice] = useState('')

  function identifyPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = patients.find((patient) => patient.id.toLowerCase() === qrEntry.trim().toLowerCase())
    setIdentified(result ?? null)
    setAccessState(result ? 'scanned' : 'idle')
  }

  function simulateSuccessfulScan() {
    const samplePatient = patients[0]
    setQrEntry(samplePatient.id)
    setIdentified(samplePatient)
    setAccessState('scanned')
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const currentEditing = editing
    if (currentEditing === null || !identified || accessState !== 'granted') return
    const form = new FormData(event.currentTarget)
    const record: MedicalRecord = {
      id: typeof currentEditing === 'object' ? currentEditing.id : Date.now(),
      patient: identified.name,
      category: String(form.get('category')),
      date: typeof currentEditing === 'object' ? currentEditing.date : 'Just now',
      doctor: 'Dr. Morgan Lee',
      hospital: 'Sample Family Clinic',
      summary: String(form.get('summary')),
    }
    setRecords((current) => typeof currentEditing === 'object' ? current.map((item) => item.id === currentEditing.id ? record : item) : [record, ...current])
    setEditing(null)
    setNotice('Sample record updated for this session only.')
  }

  const canViewPatientRecords = Boolean(identified && accessState === 'granted')
  const selectedPatientRecords = canViewPatientRecords && identified ? records.filter((record) => record.patient === identified.name) : []
  const doctorRecordsStatus = identified ? accessStateCopy[accessState] : { title: 'Demo authorization required', detail: 'Scan a sample QR and follow the demo access flow before viewing sample records.' }

  return (
    <div className="dashboard-shell doctor-dashboard">
      <aside className="dash-sidebar doctor-sidebar">
        <Link href="/" className="brand"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link>
        <div className="dash-workspace"><span className="workspace-icon"><Stethoscope /></span><span><strong>Doctor space</strong><small>Sample workspace</small></span></div>
        <span className="dash-label">CARE WORKSPACE</span>
        <nav className="dash-nav" aria-label="Doctor dashboard navigation">
          {navItems.map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={() => { setActiveSection(id); setMobileNav(false) }}><Icon />{label}</a>)}
        </nav>
        <div className="sidebar-bottom"><nav className="dash-nav"><a href="#access-note"><ShieldCheck />Privacy & consent</a><Link href="/login"><UserRound />Sign out</Link></nav></div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar doctor-topbar">
          <div className="breadcrumb"><Link href="/">MedicalSathi</Link> / <strong>Doctor space</strong></div>
          <button className="doctor-mobile-trigger" aria-label="Toggle doctor navigation" aria-expanded={mobileNav} onClick={() => setMobileNav((open) => !open)}><Menu /></button>
          <div className="doctor-top-actions"><ThemeControl /><button aria-label="Notifications" className="notification-button"><Bell /></button><Image src="/sample-doctor-avatar.png" alt="Portrait of sample doctor Dr. Morgan Lee" width={32} height={32} className="doctor-header-avatar" /><span className="doctor-header-name">Dr. Morgan Lee</span></div>
        </header>
        {mobileNav && <nav className="doctor-mobile-nav" aria-label="Doctor dashboard navigation">{navItems.map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`} onClick={() => { setActiveSection(id); setMobileNav(false) }}><Icon />{label}</a>)}</nav>}

        <main className="doctor-content">
          <div className="doctor-heading" id="overview"><div><span className="doctor-kicker"><span className="doctor-online-dot" /> CARE WORKSPACE · SAMPLE DATA</span><h1>Good morning, Dr. Morgan</h1><p>Your care overview, patient access and coordination activity.</p></div><button className="doctor-primary-button" onClick={() => { setActiveSection('scanner'); document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' }) }}><QrCode /> Scan patient QR</button></div>

          <section className="doctor-profile-banner" aria-label="Doctor profile summary"><div className="doctor-profile-main"><Image src="/sample-doctor-avatar.png" alt="Portrait of sample doctor Dr. Morgan Lee" width={46} height={46} className="doctor-avatar-large" /><div><span className="doctor-section-kicker">YOUR DOCTOR PROFILE</span><h2>Dr. Morgan Lee <BadgeCheck className="doctor-verified-icon" aria-label="Verified" /></h2><p>Internal Medicine <span>·</span> Sample Family Clinic</p></div></div><div className="doctor-profile-meta"><span><small>Registration</small><strong>DEMO-MED-2048</strong></span><span className="doctor-verification"><CheckCircle2 /> Verified profile <em>Sample</em></span></div><a href="#profile" className="doctor-inline-link">View profile <ChevronRight /></a></section>

          <section className="doctor-metric-grid" aria-label="Doctor dashboard overview metrics"><article className="doctor-metric-card"><span className="doctor-metric-icon teal"><Users /></span><span><small>Patients accessed</small><strong>24</strong><em>Sample patient records</em></span><ArrowDownRight className="doctor-metric-trend" /></article><article className="doctor-metric-card"><span className="doctor-metric-icon amber"><AlertTriangle /></span><span><small>Emergency cases</small><strong>03</strong><em>Recent sample cases</em></span><ArrowRight className="doctor-metric-trend" /></article><article className="doctor-metric-card"><span className="doctor-metric-icon blue"><FileText /></span><span><small>Records reviewed</small><strong>18</strong><em>This month · sample</em></span><ArrowRight className="doctor-metric-trend" /></article><article className="doctor-metric-card"><span className="doctor-metric-icon violet"><Clock3 /></span><span><small>Active access grants</small><strong>06</strong><em>Consent-controlled</em></span><ArrowRight className="doctor-metric-trend" /></article></section>

          <div className="doctor-overview-grid"><section className="doctor-panel doctor-emergency-panel"><div className="doctor-panel-heading"><div><span className="doctor-section-kicker">PRIORITY REVIEW</span><h2>Recent emergency cases</h2></div><span className="doctor-sample-badge">SAMPLE</span></div><div className="doctor-emergency-list"><article className="doctor-emergency-row"><span className="doctor-emergency-avatar">AP</span><span className="doctor-row-person"><strong>Sample patient A</strong><small>MS-DEMO-2048 · Sample Family Clinic</small></span><span className="doctor-emergency-level high"><i />Review</span><span className="doctor-row-time">Today, 9:42 AM</span></article><article className="doctor-emergency-row"><span className="doctor-emergency-avatar">JR</span><span className="doctor-row-person"><strong>Sample patient B</strong><small>MS-DEMO-3196 · Sample Medical Center</small></span><span className="doctor-emergency-level resolved"><Check />Resolved</span><span className="doctor-row-time">Yesterday</span></article><article className="doctor-emergency-row"><span className="doctor-emergency-avatar">SK</span><span className="doctor-row-person"><strong>Sample patient C</strong><small>MS-DEMO-4721 · Sample Community Health</small></span><span className="doctor-emergency-level review"><i />Follow-up</span><span className="doctor-row-time">Oct 24, 2026</span></article></div></section>
            <section className="doctor-panel doctor-activity-panel"><div className="doctor-panel-heading"><div><span className="doctor-section-kicker">LATEST UPDATES</span><h2>Recent activity</h2></div><Activity /></div><div className="doctor-activity-list">{activities.map(({ icon: Icon, title, detail, time, tone }) => <article className="doctor-activity-item" key={title}><span className={`doctor-activity-icon ${tone}`}><Icon /></span><span><strong>{title}</strong><small>{detail}</small><em>{time}</em></span></article>)}</div></section></div>

          <section className="doctor-panel doctor-profile-details" id="profile"><div className="doctor-panel-heading"><div><span className="doctor-section-kicker">PROFESSIONAL DETAILS</span><h2>Doctor profile</h2></div><span className="doctor-verification"><CheckCircle2 /> Verified <em>Sample status</em></span></div><div className="doctor-details-grid"><div><small>Full name</small><strong>Dr. Morgan Lee</strong></div><div><small>Contact email</small><strong>morgan.lee@example.test</strong></div><div><small>Contact phone</small><strong>+1 (555) 010-2048</strong></div><div><small>Medical registration</small><strong>DEMO-MED-2048</strong></div><div><small>Specialization</small><strong>Internal Medicine</strong></div><div><small>Hospital affiliation</small><strong>Sample Family Clinic</strong></div></div><p className="doctor-data-note"><ShieldCheck /> Fictional profile details shown for demonstration. No real provider or patient data is used.</p></section>

          <section className="doctor-scanner-layout" id="scanner"><div className="doctor-panel doctor-scanner-panel"><div className="doctor-panel-heading"><div><span className="doctor-section-kicker">SECURE PATIENT LOOKUP</span><h2>Patient QR scanner</h2></div><span className="doctor-scanner-status"><span /> Demo mode</span></div><div className="doctor-camera-frame"><span className="doctor-camera-chip"><ScanLine /> CAMERA PREVIEW</span><span className="doctor-scan-corner top-left" /><span className="doctor-scan-corner top-right" /><span className="doctor-scan-corner bottom-left" /><span className="doctor-scan-corner bottom-right" /><span className="doctor-scan-line" /><span className="doctor-camera-center"><QrCode /><small>Camera preview only</small></span></div><p className="doctor-camera-caption"><LockKeyhole /> This interface does not request camera access. QR codes contain no medical information.</p><form className="doctor-lookup-form" onSubmit={identifyPatient}><label htmlFor="patient-qr-entry">Enter sample patient ID</label><div><input id="patient-qr-entry" value={qrEntry} onChange={(event) => setQrEntry(event.target.value)} placeholder="e.g. MS-DEMO-2048" /><button className="doctor-primary-button" type="submit"><ScanLine /> Identify</button></div><small>Use a sample ID: MS-DEMO-2048, MS-DEMO-3196, or MS-DEMO-4721.</small><div className="doctor-scan-demo-actions"><button type="button" className="doctor-secondary-button" onClick={simulateSuccessfulScan}><QrCode /> Simulate successful scan</button><span>No camera or QR decoding is used.</span></div></form></div>
            <div className="doctor-panel doctor-identification-panel"><span className="doctor-section-kicker">IDENTIFICATION RESULT</span>{identified ? <><div className="doctor-identified-heading"><span className="doctor-emergency-avatar">{identified.initials}</span><span><strong>{identified.name}</strong><small>{identified.id} · Age {identified.age} <em>sample</em></small></span></div>{accessState === 'denied' ? <div className="doctor-access-denied-summary"><ShieldAlert /><span><strong>Sample emergency summary hidden</strong><small>Demo access was denied. No sample medical details are displayed in this state.</small></span></div> : <div className="doctor-identified-facts"><div><small>Blood group</small><strong>{identified.blood} <em>Sample</em></strong></div><div><small>Known allergies</small><strong>Seasonal pollen <em>Sample</em></strong></div><div><small>Current medication</small><strong>None listed <em>Sample</em></strong></div><div><small>Health conditions</small><strong>{identified.condition}</strong></div><div><small>Emergency contact</small><strong>Sample contact · +1 (555) 010-0199</strong></div></div>}<div className={`doctor-access-state ${accessState}`} role="status">{accessState === 'granted' ? <CheckCircle2 /> : accessState === 'denied' ? <X /> : accessState === 'pending' ? <Clock3 /> : accessState === 'scanned' ? <ScanLine /> : <KeyRound />}<span><strong>{accessStateCopy[accessState].title}</strong><em>{accessStateCopy[accessState].detail}</em></span></div><div className="doctor-access-actions">{accessState === 'scanned' && <button type="button" className="doctor-primary-button doctor-authorize-button" onClick={() => setAccessState('pending')}><KeyRound /> Request demo access</button>}{accessState === 'pending' && <><button type="button" className="doctor-primary-button doctor-authorize-button" onClick={() => setAccessState('granted')}><Check /> Simulate approval</button><button type="button" className="doctor-secondary-button doctor-deny-button" onClick={() => setAccessState('denied')}><X /> Simulate denial</button></>}{(accessState === 'granted' || accessState === 'denied') && <button type="button" className="doctor-secondary-button doctor-reset-access" onClick={() => setAccessState('scanned')}>Reset demo status</button>}</div></> : <div className="doctor-identification-empty"><span><UserRound /></span><strong>No patient identified</strong><p>Enter a sample patient ID to preview a fictional emergency summary and access consent flow.</p></div>}</div></section>

          <section className="doctor-panel doctor-records-panel" id="records">
            <div className="doctor-panel-heading"><div><span className="doctor-section-kicker">CONSENTED CARE INFORMATION · SAMPLE</span><h2>Patient medical records</h2><p>Sample records are shown only after this demo flow grants access.</p></div>{canViewPatientRecords && <button type="button" className="doctor-primary-button" onClick={() => setEditing('new')}><Plus /> Add sample record</button>}</div>
            <div className={`doctor-record-access-banner ${canViewPatientRecords ? 'granted' : identified ? accessState : 'locked'}`} role="status">{canViewPatientRecords ? <CheckCircle2 /> : <LockKeyhole />}<span><strong>{doctorRecordsStatus.title}</strong><small>{doctorRecordsStatus.detail}</small></span></div>
            {notice && <p className="doctor-notice" role="status"><CheckCircle2 />{notice}</p>}
            {canViewPatientRecords ? selectedPatientRecords.length > 0 ? <div className="doctor-record-list">{selectedPatientRecords.map((record) => <article className="doctor-record-row" key={record.id}><span className="doctor-record-icon"><ClipboardList /></span><span className="doctor-row-person"><strong>{record.category}</strong><small>{record.summary}</small><small>{record.doctor} · {record.hospital}</small></span><span className="doctor-record-date">{record.date}</span><span className="doctor-record-access"><LockKeyhole /> Authorized sample</span><button type="button" className="doctor-edit-button" aria-label={`Update ${record.category} for ${record.patient}`} onClick={() => setEditing(record)}>Update</button></article>)}</div> : <div className="doctor-record-empty" role="status"><FileText /><strong>No sample records available</strong><span>There are no sample medical records for this patient yet.</span></div> : <div className="doctor-record-locked-state"><span><LockKeyhole /></span><strong>Sample records are hidden</strong><p>Identify a sample patient, then simulate an approval in the QR scanner. The record list stays hidden while access is idle, pending, or denied.</p><button type="button" className="doctor-secondary-button" onClick={() => { setActiveSection('scanner'); document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' }) }}><QrCode /> Open patient QR scanner</button></div>}
            <p className="doctor-data-note"><LockKeyhole /> Sample records and authorization states exist only in this page session. No real patient data is accessed.</p>
          </section>

          <section className="doctor-panel doctor-history-panel" id="history"><div className="doctor-panel-heading"><div><span className="doctor-section-kicker">ACCOUNTABILITY & AUDIT</span><h2>Access history</h2></div><span className="doctor-history-total">04 sample events</span></div><div className="doctor-history-table-wrap"><table className="doctor-history-table"><thead><tr><th>Patient</th><th>Access date & time</th><th>Hospital</th><th>Access status</th></tr></thead><tbody><tr><td><span className="doctor-history-person"><span>AP</span><strong>Sample patient A<small>MS-DEMO-2048</small></strong></span></td><td>Today, 10:14 AM</td><td>Sample Family Clinic</td><td><span className="doctor-history-status scanned"><ScanLine /> QR scanned · demo</span></td></tr><tr><td><span className="doctor-history-person"><span>AP</span><strong>Sample patient A<small>MS-DEMO-2048</small></strong></span></td><td>Oct 26, 2026 · 9:42 AM</td><td>Sample Family Clinic</td><td><span className="doctor-history-status granted"><CheckCircle2 /> Authorized</span></td></tr><tr><td><span className="doctor-history-person"><span>JR</span><strong>Sample patient B<small>MS-DEMO-3196</small></strong></span></td><td>Oct 25, 2026 · 2:15 PM</td><td>Sample Medical Center</td><td><span className="doctor-history-status granted"><CheckCircle2 /> Viewed</span></td></tr><tr><td><span className="doctor-history-person"><span>SK</span><strong>Sample patient C<small>MS-DEMO-4721</small></strong></span></td><td>Oct 24, 2026 · 11:08 AM</td><td>Sample Community Health</td><td><span className="doctor-history-status ended"><Clock3 /> Ended</span></td></tr></tbody></table></div><p className="doctor-data-note" id="access-note"><ShieldAlert /> Sample access events for interface preview only. Live access must be governed by patient consent and a verified backend.</p></section>

          <p className="doctor-disclaimer"><ShieldCheck /> MedicalSathi doctor workspace · Demonstration only. All people, contact details and medical information shown are fictional sample data.</p>
        </main>
      </div>

      {editing && <div className="doctor-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null) }}><section className="doctor-dialog" role="dialog" aria-modal="true" aria-labelledby="doctor-record-dialog-title"><div className="doctor-dialog-heading"><div><span className="doctor-section-kicker">SAMPLE DATA · UI DEMO</span><h2 id="doctor-record-dialog-title">{editing === 'new' ? 'Add patient record' : 'Update patient record'}</h2></div><button className="doctor-dialog-close" onClick={() => setEditing(null)} aria-label="Close dialog"><X /></button></div><form className="doctor-record-form" onSubmit={saveRecord}><label>Patient<input name="patient" value={identified?.name ?? ''} readOnly /></label><label>Record type<select name="category" defaultValue={editing === 'new' ? 'Medical history' : editing.category}><option>Prescription</option><option>Lab report</option><option>Diagnosis</option><option>Medical history</option><option>Imaging report</option></select></label><label>Summary<textarea name="summary" required maxLength={240} defaultValue={editing === 'new' ? '' : editing.summary} placeholder="Enter a fictional sample note" /></label><p><LockKeyhole /> Demo only. Do not enter real patient information.</p><div className="doctor-dialog-actions"><button type="button" className="doctor-secondary-button" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="doctor-primary-button"><FilePlus2 /> Save sample record</button></div></form></section></div>}
    </div>
  )
}
