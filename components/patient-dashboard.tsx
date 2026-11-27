'use client'

import { useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeControl } from '@/components/theme-control'
import {
  Activity, AlertCircle, ArrowRight, Bell, Check, CheckCircle2, ChevronDown,
  Clock3, Download, FileHeart, FilePlus2, FileText, HeartPulse, HelpCircle,
  LockKeyhole, LogOut, Mail, MapPin, Menu, Phone, Plus, Printer, QrCode, Search, ShieldCheck, UserRound, X,
} from 'lucide-react'

type RecordCategory = 'Prescription' | 'Lab report' | 'Diagnosis' | 'Medical history' | 'Imaging report'
type RecordItem = { title: string; category: RecordCategory; date: string; provider: string; doctor: string; hospital: string; detail: string }
type RecordYearFilter = 'All dates' | '2026' | '2025' | '2024'
type UploadStatus = 'idle' | 'selected' | 'complete' | 'too-large'

const recordCategories: RecordCategory[] = ['Prescription', 'Lab report', 'Diagnosis', 'Medical history', 'Imaging report']
const maximumUploadSize = 10 * 1024 * 1024

const initialRecords: RecordItem[] = [
  { title: 'Medication prescription', category: 'Prescription', date: 'Jul 06, 2026', provider: 'Sample Family Clinic', doctor: 'Dr. Morgan Lee', hospital: 'Sample Family Clinic', detail: 'Sample prescription: daily multivitamin and inhaler as needed. This demo does not provide medication advice.' },
  { title: 'Complete blood count', category: 'Lab report', date: 'Sep 29, 2026', provider: 'Sample Diagnostics', doctor: 'Dr. Riley Chen', hospital: 'Sample Diagnostics', detail: 'Illustrative complete blood count report. No real laboratory values are included.' },
  { title: 'Seasonal allergy diagnosis', category: 'Diagnosis', date: 'Aug 12, 2026', provider: 'Sample Family Clinic', doctor: 'Dr. Morgan Lee', hospital: 'Sample Family Clinic', detail: 'Sample diagnosis for seasonal allergies, included for interface demonstration only.' },
  { title: 'Annual wellness visit', category: 'Medical history', date: 'Oct 18, 2026', provider: 'Sample Family Clinic', doctor: 'Dr. Morgan Lee', hospital: 'Sample Family Clinic', detail: 'Routine wellness visit summary. Sample data for demonstration only.' },
  { title: 'Asthma history', category: 'Medical history', date: 'Mar 04, 2025', provider: 'Sample Community Health', doctor: 'Dr. Sam Lee', hospital: 'Sample Community Health', detail: 'Fictional medical history note for mild asthma. No real patient history is shown.' },
  { title: 'Chest X-ray report', category: 'Imaging report', date: 'Apr 18, 2025', provider: 'Sample Medical Center', doctor: 'Dr. Riley Chen', hospital: 'Sample Medical Center', detail: 'Sample imaging report summary. No image or diagnostic interpretation is included.' },
  { title: 'Vaccination record', category: 'Medical history', date: 'Aug 12, 2024', provider: 'Sample Community Health', doctor: 'Dr. Sam Lee', hospital: 'Sample Community Health', detail: 'Example immunization entry for interface preview.' },
]

const accessHistory = [
  { name: 'Dr. Morgan Lee', specialty: 'Primary care', hospital: 'Sample Family Clinic', purpose: 'Continuity of care', time: 'Today, 9:42 AM', status: 'Viewed', initials: 'ML' },
  { name: 'Care coordination team', specialty: 'Care team', hospital: 'Sample Community Health', purpose: 'Care coordination', time: 'Yesterday, 2:15 PM', status: 'Viewed', initials: 'CT' },
  { name: 'Dr. Riley Chen', specialty: 'Cardiology', hospital: 'Sample Medical Center', purpose: 'Consultation', time: 'Oct 21, 11:08 AM', status: 'Access ended', initials: 'RC' },
]

const navItems = [
  { label: 'My profile', href: '#profile', icon: UserRound },
  { label: 'Medical records', href: '#records', icon: FileText },
  { label: 'Emergency QR', href: '#emergency-qr', icon: QrCode },
  { label: 'Access history', href: '#access-history', icon: Clock3 },
]

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="patient-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="patient-modal" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title">
        <div className="patient-modal-heading"><div><span className="patient-eyebrow">SAMPLE DATA · UI DEMO</span><h2 id="patient-modal-title">{title}</h2></div><button className="patient-icon-button" onClick={onClose} aria-label="Close dialog"><X /></button></div>
        {children}
      </section>
    </div>
  )
}

export function PatientDashboard() {
  const [activeNav, setActiveNav] = useState('#profile')
  const [modal, setModal] = useState<'profile' | 'record' | null>(null)
  const [records, setRecords] = useState(initialRecords)
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profile, setProfile] = useState({ name: 'Sample Patient', email: 'patient@example.test', phone: '+1 (555) 010-2048', emergency: 'Sample contact · +1 (555) 010-0199' })
  const [recordTitle, setRecordTitle] = useState('')
  const [recordCategory, setRecordCategory] = useState<RecordCategory>('Medical history')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [recordSearch, setRecordSearch] = useState('')
  const [recordCategoryFilter, setRecordCategoryFilter] = useState<RecordCategory | 'All categories'>('All categories')
  const [recordDateFilter, setRecordDateFilter] = useState<RecordYearFilter>('All dates')
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [selectedRecordFile, setSelectedRecordFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const activePage = activeNav.slice(1)
  const pageContent: Record<string, { title: string; description: string }> = {
    profile: { title: 'My profile', description: 'Review your details and keep your care information up to date.' },
    records: { title: 'Medical records', description: 'Browse your history, care notes and sample documents.' },
    'emergency-qr': { title: 'Emergency QR card', description: 'A clearly labelled demo card and guidance for emergency access.' },
    'access-history': { title: 'Access history', description: 'See when sample care team members accessed your information.' },
  }
  const normalizedRecordSearch = recordSearch.trim().toLowerCase()
  const filteredRecords = records.filter((record) => {
    const matchesSearch = !normalizedRecordSearch || `${record.title} ${record.category} ${record.doctor} ${record.hospital} ${record.detail}`.toLowerCase().includes(normalizedRecordSearch)
    const matchesCategory = recordCategoryFilter === 'All categories' || record.category === recordCategoryFilter
    const matchesDate = recordDateFilter === 'All dates' || record.date.includes(recordDateFilter)
    return matchesSearch && matchesCategory && matchesDate
  })
  const groupedRecords = recordCategories.map((category) => ({ category, items: filteredRecords.filter((record) => record.category === category) })).filter((group) => group.items.length > 0)

  function selectPage(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    setActiveNav(href)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!recordTitle.trim()) return
    const newRecord: RecordItem = { title: recordTitle.trim(), category: recordCategory, date: 'Just now', provider: 'Sample patient entry', doctor: 'Sample care team', hospital: 'Sample patient entry', detail: 'A locally added demonstration record. No information is sent or saved to a server.' }
    setRecords((current) => [newRecord, ...current])
    setRecordTitle('')
    setModal(null)
  }

  function selectRecordFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null
    setSelectedRecordFile(file)
    setUploadStatus(!file ? 'idle' : file.size > maximumUploadSize ? 'too-large' : 'selected')
  }

  function clearRecordFile() {
    setSelectedRecordFile(null)
    setUploadStatus('idle')
  }

  function downloadQrCard() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><rect width="480" height="320" rx="24" fill="#f4faf9"/><rect x="24" y="24" width="432" height="272" rx="18" fill="white" stroke="#dcebea"/><rect x="48" y="54" width="76" height="76" rx="18" fill="#e8f5f5"/><path d="M67 92h38M86 73v38" stroke="#087f8c" stroke-width="7" stroke-linecap="round"/><text x="146" y="82" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#102b46">MedicalSathi</text><text x="146" y="108" font-family="Arial,sans-serif" font-size="13" fill="#718295">Emergency profile card · DEMO ONLY</text><rect x="48" y="158" width="384" height="76" rx="12" fill="#f6f9fa"/><text x="70" y="190" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#087f8c">SAMPLE QR PREVIEW</text><text x="70" y="215" font-family="Arial,sans-serif" font-size="12" fill="#718295">Not scannable · contains no patient data</text></svg>`
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'medicalsathi-demo-emergency-card.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dashboard-shell patient-dashboard">
      <aside className="dash-sidebar">
        <Link href="/" className="brand"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link>
        <div className="dash-workspace"><span className="workspace-icon"><UserRound /></span><span><strong>Patient space</strong><small>Sample workspace</small></span><ChevronDown className="workspace-chevron" /></div>
        <span className="dash-label">YOUR HEALTH</span>
        <nav className="dash-nav patient-nav" aria-label="Patient dashboard navigation">
          {navItems.map(({ label, href, icon: Icon }) => <a key={href} href={href} aria-current={activeNav === href ? 'page' : undefined} className={activeNav === href ? 'active' : ''} onClick={(event) => selectPage(event, href)}><Icon />{label}</a>)}
        </nav>
        <div className="sidebar-bottom"><nav className="dash-nav"><a href="#help"><HelpCircle />Help & support</a><a href="#settings"><ShieldCheck />Privacy settings</a><Link href="/login"><LogOut />Sign out</Link></nav></div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar patient-topbar">
          <div className="breadcrumb"><Link href="/">MedicalSathi</Link> / <strong>Patient space</strong></div>
          <label className="patient-search"><Search aria-hidden="true" /><span className="sr-only">Search medical records</span><input aria-label="Search medical records" placeholder="Search records..." value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} /></label>
          <button className="patient-mobile-menu" aria-label="Toggle patient navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><Menu /></button>
          <div className="dash-user"><ThemeControl /><button aria-label="Notifications" className="notification-button"><Bell /></button><Image src="/sample-patient-avatar.png" alt="" width={32} height={32} className="patient-header-avatar" /><span>{profile.name}</span><ChevronDown /></div>
        </header>
        {mobileMenuOpen && <nav className="patient-mobile-nav" aria-label="Patient dashboard navigation">{navItems.map(({ label, href, icon: Icon }) => <a key={href} href={href} aria-current={activeNav === href ? 'page' : undefined} className={activeNav === href ? 'active' : ''} onClick={(event) => selectPage(event, href)}><Icon />{label}</a>)}<a href="#help" onClick={() => setMobileMenuOpen(false)}><HelpCircle />Help &amp; support</a><a href="#settings" onClick={() => setMobileMenuOpen(false)}><ShieldCheck />Privacy settings</a></nav>}

        <main className="patient-content" data-page={activePage}>
          <div className="patient-heading-row"><div><span className="patient-eyebrow"><span className="patient-live-dot" /> YOUR CARE, IN ONE PLACE</span><h1>{pageContent[activePage]?.title ?? pageContent.profile.title}</h1><p>{pageContent[activePage]?.description ?? pageContent.profile.description}</p></div><span className="sample-label">SAMPLE DATA · UI DEMO</span></div>

          <div className="patient-section-grid patient-profile-grid">
            <section className="patient-panel patient-profile-panel" id="profile">
              <div className="patient-panel-heading"><div><span className="patient-eyebrow">YOUR DETAILS</span><h2>Patient profile</h2></div><button className="patient-text-button" onClick={() => setModal('profile')}>Edit profile <ArrowRight /></button></div>
              <div className="patient-profile-identity"><Image src="/sample-patient-avatar.png" alt="Portrait of sample patient" width={64} height={64} className="patient-profile-photo" /><span><strong>{profile.name}</strong><small>Patient ID · MS-DEMO-2048</small></span><span className="patient-profile-verified"><ShieldCheck /> Profile details are sample data</span></div>
              <div className="patient-profile-fields">
                <div><span>Full name</span><strong>{profile.name}</strong></div>
                <div><span>Email address</span><strong><Mail /> {profile.email}</strong></div><div><span>Phone number</span><strong><Phone /> {profile.phone}</strong></div>
                <div><span>Date of birth</span><strong>January 1, 1990 <em>Sample</em></strong></div><div><span>Gender</span><strong>Not specified <em>Sample</em></strong></div>
                <div><span>Blood group</span><strong><span className="patient-blood-dot" /> O positive <em>Sample</em></strong></div><div><span>Emergency contact</span><strong>{profile.emergency}</strong></div>
                <div className="patient-profile-address"><span>Home address</span><strong><MapPin /> 123 Example Street, Sample City, CA 90000 <em>Sample</em></strong></div>
              </div>
              {profileSaved && <p className="patient-save-note"><Check /> Sample profile changes updated for this session.</p>}
            </section>
          </div>

          <div className="patient-section-grid patient-lower-grid">
            <section className="patient-panel patient-records-panel" id="records">
              <div className="patient-panel-heading"><div><span className="patient-eyebrow">HEALTH INFORMATION · SAMPLE RECORDS</span><h2>Medical records</h2><p>Browse fictional records by category or date.</p></div><div className="patient-record-heading-actions"><button type="button" className="patient-text-button" aria-pressed={recordsLoading} onClick={() => setRecordsLoading((loading) => !loading)}>{recordsLoading ? 'Show sample records' : 'Preview loading state'}</button><button type="button" className="patient-primary-button" onClick={() => setModal('record')}><Plus /> Add record</button></div></div>
              <div className="patient-record-filters"><label className="patient-record-search"><Search aria-hidden="true" /><span className="sr-only">Search sample records</span><input aria-label="Search sample records" value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} placeholder="Search title, doctor, hospital…" /></label><label>Category<select aria-label="Filter records by category" value={recordCategoryFilter} onChange={(event) => setRecordCategoryFilter(event.target.value as RecordCategory | 'All categories')}><option>All categories</option>{recordCategories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Date<select aria-label="Filter records by date" value={recordDateFilter} onChange={(event) => setRecordDateFilter(event.target.value as RecordYearFilter)}><option>All dates</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option></select></label><span className="patient-record-count">{filteredRecords.length} of {records.length} sample records</span></div>
              <div className="patient-record-groups">
                {recordsLoading ? <div className="patient-record-loading" role="status" aria-live="polite"><span className="patient-record-loading-label"><Activity /> Loading sample medical records…</span><span /><span /><span /><span className="sr-only">Loading records preview.</span></div> : groupedRecords.length > 0 ? groupedRecords.map(({ category, items }) => <section className="patient-record-group" key={category}><div className="patient-record-group-heading"><h3>{category}</h3><span>{items.length} {items.length === 1 ? 'record' : 'records'}</span></div><div className="patient-record-list">{items.map((record, index) => <article className="patient-record-row" key={`${category}-${record.title}`}><span className={`patient-record-icon record-${index % 3}`}><FileText /></span><span className="patient-record-copy"><strong>{record.title}</strong><small><UserRound /> {record.doctor} <span>·</span> {record.hospital}</small></span><span className="patient-record-date">{record.date}</span><button type="button" className="patient-view-button" onClick={() => setSelectedRecord(record)}>Details <ArrowRight /></button></article>)}</div></section>) : <div className="patient-record-empty" role="status"><span><FileHeart /></span><strong>No sample records found</strong><p>{records.length === 0 ? 'There are no sample records yet.' : 'Try changing your search term or record filters.'}</p><button type="button" className="patient-text-button" onClick={() => { setRecordSearch(''); setRecordCategoryFilter('All categories'); setRecordDateFilter('All dates') }}>Clear search and filters</button></div>}
              </div>
              <section className="patient-record-upload" aria-labelledby="patient-upload-heading"><div className="patient-record-upload-copy"><span className="patient-eyebrow">DEMO-ONLY FILE SELECTION</span><h3 id="patient-upload-heading">Upload a sample record</h3><p>Choose a PDF or image to preview the upload flow. Files remain on this page and are never sent or stored.</p><small>Supported: PDF, JPG, PNG, WEBP · Maximum 10 MB</small></div><div className="patient-record-upload-controls"><input id="patient-record-file" className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onClick={(event) => { event.currentTarget.value = '' }} onChange={selectRecordFile} /><label className="patient-outline-button" htmlFor="patient-record-file"><FilePlus2 /> Choose file</label><button type="button" className="patient-primary-button" disabled={!selectedRecordFile || uploadStatus === 'too-large'} onClick={() => setUploadStatus('complete')}>Simulate upload</button></div>{selectedRecordFile && <div className="patient-selected-file" role="status"><span className="patient-record-icon"><FileText /></span><span><strong>{selectedRecordFile.name}</strong><small>{(selectedRecordFile.size / 1024).toFixed(0)} KB · Selected locally for demo</small></span><button type="button" className="patient-icon-button" aria-label="Remove selected file" onClick={clearRecordFile}><X /></button></div>}{uploadStatus === 'selected' && <p className="patient-upload-status" role="status"><Check /> File selected for preview. No upload has occurred.</p>}{uploadStatus === 'complete' && <p className="patient-upload-status complete" role="status"><CheckCircle2 /> Demo upload complete. The file was not sent or saved.</p>}{uploadStatus === 'too-large' && <p className="patient-upload-status error" role="alert"><AlertCircle /> This sample file is larger than 10 MB. Select a smaller file to preview the demo.</p>}</section>
              <div className="patient-record-disclosure"><LockKeyhole /> All records, dates and providers above are fictional sample data. Do not select real medical documents.</div>
            </section>

            <section className="patient-panel patient-qr-panel" id="emergency-qr">
              <div className="patient-panel-heading"><div><span className="patient-eyebrow">EMERGENCY PREPAREDNESS</span><h2>Emergency QR</h2></div><span className="patient-ready-badge"><Check /> Ready</span></div>
              <div className="patient-qr-content"><div className="patient-qr-preview" role="img" aria-label="Sample emergency QR preview, non-scannable"><div className="patient-qr-center"><HeartPulse /><span>SAMPLE</span></div><span className="qr-corner qr-top-left" /><span className="qr-corner qr-top-right" /><span className="qr-corner qr-bottom-left" /><span className="patient-qr-watermark">NON-SCANNABLE</span></div><div className="patient-qr-info"><strong>Sample emergency QR preview</strong><p>This is a visual placeholder only. It is not a real or scannable QR code and contains no patient data.</p><div className="patient-qr-actions"><button type="button" className="patient-outline-button" onClick={downloadQrCard}><Download /> Download QR · Demo</button><button type="button" className="patient-outline-button" onClick={() => window.print()}><Printer /> Print QR · Demo</button></div></div></div>
              <div className="patient-qr-summary" aria-label="Sample patient emergency summary"><div className="patient-qr-summary-heading"><div><span className="patient-eyebrow">SAMPLE DATA · EMERGENCY PREVIEW</span><h3>Emergency medical summary</h3></div><span className="patient-summary-demo-badge">DEMO ONLY</span></div><div className="patient-qr-summary-grid"><div><small>Patient</small><strong>{profile.name}</strong></div><div><small>Blood group</small><strong>O positive <em>Sample</em></strong></div><div><small>Allergies</small><strong>Seasonal pollen</strong></div><div><small>Current medications</small><strong>Daily multivitamin · inhaler as needed</strong></div><div><small>Known conditions</small><strong>Mild asthma · seasonal allergies</strong></div><div><small>Emergency contact</small><strong>{profile.emergency}</strong></div></div></div>
              <div className="patient-qr-privacy"><LockKeyhole /><p><strong>Privacy notice</strong> This demo QR contains no patient information. Sensitive medical records should never be stored directly inside a QR code.</p></div><div className="patient-qr-instructions"><ShieldCheck /><p><strong>How to use</strong> In a live service, share a secure, time-limited link with emergency responders. This sample is non-scannable and cannot reveal medical information.</p></div>
            </section>
          </div>

          <section className="patient-panel patient-access-panel" id="access-history">
            <div className="patient-panel-heading"><div><span className="patient-eyebrow">PRIVACY & TRANSPARENCY</span><h2>Recent access history</h2></div><button className="patient-text-button" onClick={() => setActiveNav('#access-history')}>View access log <ArrowRight /></button></div>
            <div className="patient-access-list">{accessHistory.map((entry) => <article className="patient-access-row" key={entry.name}><span className="patient-access-avatar">{entry.initials}</span><span className="patient-access-person"><strong>{entry.name}</strong><small>{entry.hospital} <span>·</span> {entry.purpose}</small></span><span className="patient-access-time"><Clock3 /> {entry.time}</span><span className={`patient-access-status ${entry.status === 'Viewed' ? 'viewed' : ''}`}>{entry.status === 'Viewed' ? <CheckCircle2 /> : <Clock3 />}{entry.status}</span></article>)}</div>
          </section>
          <section className="patient-panel dashboard-utility-panel" id="help" aria-labelledby="patient-help-heading">
            <div className="patient-panel-heading"><div><span className="patient-eyebrow">PATIENT GUIDE</span><h2 id="patient-help-heading">Help &amp; support</h2><p>Quick guidance for using this sample patient dashboard.</p></div><HelpCircle aria-hidden="true" /></div>
            <div className="dashboard-utility-grid"><article><h3>Using your dashboard</h3><p>Use the navigation to review your sample profile, records, emergency card and access history. You can search and filter the example records.</p></article><article><h3>Need care or account help?</h3><p>This demonstration has no live support team. For care questions, contact your healthcare provider using the contact details they have given you. For urgent emergencies, contact your local emergency services.</p></article></div>
          </section>
          <section className="patient-panel dashboard-utility-panel" id="settings" aria-labelledby="patient-settings-heading">
            <div className="patient-panel-heading"><div><span className="patient-eyebrow">YOUR PREFERENCES</span><h2 id="patient-settings-heading">Privacy &amp; display settings</h2><p>Choose how MedicalSathi appears on this device.</p></div><ShieldCheck aria-hidden="true" /></div>
            <div className="dashboard-utility-setting"><span><strong>Color theme</strong><small>Choose light, dark or follow your device preference.</small></span><ThemeControl /></div>
            <p className="dashboard-utility-note">Theme preference is stored locally in this browser. This demo does not change or save health information.</p>
          </section>
          <p className="patient-demo-disclaimer"><ShieldCheck /> Demonstration interface only. All names, contact details, dates, providers and health details shown are fictional sample data.</p>
        </main>
      </div>

      {modal === 'profile' && <Modal title="Edit sample profile" onClose={() => setModal(null)}><form className="patient-modal-form" onSubmit={(event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); setProfile({ name: String(formData.get('name') || ''), email: String(formData.get('email') || ''), phone: String(formData.get('phone') || ''), emergency: String(formData.get('emergency') || '') }); setProfileSaved(true); setModal(null) }}><label>Full name<input name="name" required defaultValue={profile.name} /></label><div className="patient-form-pair"><label>Email address<input name="email" type="email" defaultValue={profile.email} /></label><label>Phone number<input name="phone" type="tel" defaultValue={profile.phone} /></label></div><label>Emergency contact<input name="emergency" defaultValue={profile.emergency} /></label><p className="patient-form-hint"><LockKeyhole /> Changes are a local demo only and are not sent to a server.</p><div className="patient-modal-actions"><button type="button" className="patient-outline-button" onClick={() => setModal(null)}>Cancel</button><button className="patient-primary-button" type="submit"><Check /> Save sample changes</button></div></form></Modal>}
      {modal === 'record' && <Modal title="Add a sample record" onClose={() => setModal(null)}><form className="patient-modal-form" onSubmit={addRecord}><label>Record title<input required value={recordTitle} onChange={(event) => setRecordTitle(event.target.value)} placeholder="e.g. Follow-up visit" /></label><label>Record type<select value={recordCategory} onChange={(event) => setRecordCategory(event.target.value as RecordCategory)}>{recordCategories.map((category) => <option key={category}>{category}</option>)}</select></label><p className="patient-form-hint"><LockKeyhole /> This is a temporary front-end demo. Do not enter real health information.</p><div className="patient-modal-actions"><button type="button" className="patient-outline-button" onClick={() => setModal(null)}>Cancel</button><button className="patient-primary-button" type="submit"><FilePlus2 /> Add sample record</button></div></form></Modal>}
      {selectedRecord && <Modal title={selectedRecord.title} onClose={() => setSelectedRecord(null)}><div className="patient-record-detail"><span className="patient-detail-type">{selectedRecord.category}</span><p>{selectedRecord.detail}</p><dl><div><dt>Category</dt><dd>{selectedRecord.category}</dd></div><div><dt>Date</dt><dd>{selectedRecord.date}</dd></div><div><dt>Doctor</dt><dd>{selectedRecord.doctor}</dd></div><div><dt>Hospital</dt><dd>{selectedRecord.hospital}</dd></div></dl><p className="patient-form-hint"><LockKeyhole /> Example record only. No actual patient data is displayed.</p></div></Modal>}
    </div>
  )
}

