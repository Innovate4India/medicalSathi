'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity, BadgeCheck, Bell, Building2, Check, CheckCircle2, ChevronDown, Clock3,
  Droplets, FileCheck2, HeartPulse, Hospital, LayoutDashboard, LifeBuoy, LogOut,
  MapPin, Menu, Search, ShieldAlert, ShieldCheck, Stethoscope, UserRound, Users, X,
} from 'lucide-react'
import { ThemeControl } from '@/components/theme-control'

type AdminSection = 'overview' | 'users' | 'verification' | 'requests' | 'audit' | 'profile'
type UserRole = 'Patient' | 'Doctor' | 'Hospital' | 'Donor'
type UserStatus = 'Active' | 'Pending' | 'Inactive'
type RequestStatus = 'Active' | 'Fulfilled' | 'Closed'
type VerificationStatus = 'Pending' | 'Approved' | 'Rejected'

type DirectoryUser = {
  id: string
  name: string
  role: UserRole
  detail: string
  contact: string
  joined: string
  status: UserStatus
  initials: string
}

type VerificationItem = {
  id: string
  name: string
  role: 'Doctor' | 'Hospital'
  detail: string
  registration: string
  submitted: string
  initials: string
}

const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'User management', icon: Users },
  { id: 'verification', label: 'Verifications', icon: BadgeCheck },
  { id: 'requests', label: 'Blood requests', icon: Droplets },
  { id: 'audit', label: 'Audit logs', icon: Activity },
  { id: 'profile', label: 'Admin profile', icon: UserRound },
]

const users: DirectoryUser[] = [
  { id: 'MS-PT-2048', name: 'Sample patient A', role: 'Patient', detail: 'O positive · North District', contact: 'patient.a@example.test', joined: 'Oct 26, 2026', status: 'Active', initials: 'PA' },
  { id: 'MS-PT-3196', name: 'Sample patient B', role: 'Patient', detail: 'A negative · Riverside', contact: 'patient.b@example.test', joined: 'Oct 24, 2026', status: 'Active', initials: 'PB' },
  { id: 'MS-PT-4721', name: 'Sample patient C', role: 'Patient', detail: 'B positive · West End', contact: 'patient.c@example.test', joined: 'Oct 22, 2026', status: 'Pending', initials: 'PC' },
  { id: 'MS-DR-1014', name: 'Dr. Morgan Lee', role: 'Doctor', detail: 'Internal Medicine · Northstar Clinic', contact: 'morgan.lee@example.test', joined: 'Oct 20, 2026', status: 'Active', initials: 'ML' },
  { id: 'MS-DR-2087', name: 'Dr. Avery Patel', role: 'Doctor', detail: 'Emergency Medicine · City General', contact: 'avery.patel@example.test', joined: 'Oct 18, 2026', status: 'Pending', initials: 'AP' },
  { id: 'MS-HS-2048', name: 'Northstar Medical Center', role: 'Hospital', detail: 'North District · 14 providers', contact: 'care@northstar.example.test', joined: 'Oct 14, 2026', status: 'Active', initials: 'NM' },
  { id: 'MS-HS-3196', name: 'Riverside Health Clinic', role: 'Hospital', detail: 'Riverside · 8 providers', contact: 'hello@riverside.example.test', joined: 'Oct 12, 2026', status: 'Pending', initials: 'RH' },
  { id: 'MS-DN-2580', name: 'Jordan Davis', role: 'Donor', detail: 'O negative · North District', contact: 'jordan.davis@example.test', joined: 'Oct 10, 2026', status: 'Active', initials: 'JD' },
  { id: 'MS-DN-1142', name: 'Casey Rivera', role: 'Donor', detail: 'A positive · Central District', contact: 'casey.rivera@example.test', joined: 'Oct 08, 2026', status: 'Inactive', initials: 'CR' },
]

const verificationQueue: VerificationItem[] = [
  { id: 'ver-1', name: 'Dr. Avery Patel', role: 'Doctor', detail: 'Emergency Medicine · City General Hospital', registration: 'DEMO-MED-1014', submitted: 'Today, 9:24 AM', initials: 'AP' },
  { id: 'ver-2', name: 'Riverside Health Clinic', role: 'Hospital', detail: 'Riverside · Organization registration', registration: 'DEMO-HSP-3196', submitted: 'Yesterday, 3:45 PM', initials: 'RH' },
  { id: 'ver-3', name: 'Dr. Taylor Brooks', role: 'Doctor', detail: 'Family Medicine · North District', registration: 'DEMO-MED-4420', submitted: 'Oct 25, 2026', initials: 'TB' },
]

const bloodRequests: { id: string; patient: string; group: string; units: number; hospital: string; location: string; created: string; status: RequestStatus }[] = [
  { id: 'BR-9024', patient: 'Sample patient A', group: 'O−', units: 2, hospital: 'City General Hospital', location: 'North District', created: 'Today, 9:18 AM', status: 'Active' },
  { id: 'BR-9019', patient: 'Sample patient B', group: 'A+', units: 1, hospital: 'Northstar Medical Center', location: 'Riverside', created: 'Today, 8:42 AM', status: 'Active' },
  { id: 'BR-8991', patient: 'Sample patient C', group: 'B+', units: 3, hospital: 'Green Valley Hospital', location: 'West End', created: 'Oct 26, 2026', status: 'Fulfilled' },
  { id: 'BR-8943', patient: 'Sample patient D', group: 'AB−', units: 1, hospital: 'St. Mary’s Medical Centre', location: 'Central District', created: 'Oct 24, 2026', status: 'Closed' },
  { id: 'BR-8921', patient: 'Sample patient E', group: 'O+', units: 2, hospital: 'Community Blood Centre', location: 'North District', created: 'Oct 22, 2026', status: 'Fulfilled' },
]

const auditEvents = [
  { time: 'Today, 9:42:18 AM', actor: 'Admin · Sam Anderson', role: 'Administrator', action: 'Reviewed pending doctor verification', target: 'DEMO-MED-1014', result: 'Review pending', tone: 'amber' },
  { time: 'Today, 9:18:04 AM', actor: 'Northstar care team', role: 'Hospital', action: 'Created a sample blood request', target: 'Request BR-9024 · O− · 2 units', result: 'Recorded', tone: 'teal' },
  { time: 'Today, 8:54:33 AM', actor: 'Dr. Morgan Lee', role: 'Doctor', action: 'Viewed sample patient emergency profile', target: 'Patient MS-PT-2048', result: 'Access ended', tone: 'blue' },
  { time: 'Yesterday, 4:11:52 PM', actor: 'Jordan Davis', role: 'Donor', action: 'Updated sample donation availability', target: 'Donor profile MS-DN-2580', result: 'Updated', tone: 'green' },
  { time: 'Yesterday, 3:45:10 PM', actor: 'Riverside Health Clinic', role: 'Hospital', action: 'Submitted organization verification details', target: 'DEMO-HSP-3196', result: 'Review pending', tone: 'amber' },
  { time: 'Oct 26, 2026 · 11:06 AM', actor: 'Sample patient A', role: 'Patient', action: 'Viewed account access history', target: 'Patient MS-PT-2048', result: 'Viewed', tone: 'blue' },
]

const sectionContent: Record<AdminSection, { title: string; description: string }> = {
  overview: { title: 'Good morning, Sam', description: 'A clear view of platform activity and community needs.' },
  users: { title: 'User management', description: 'Browse sample patient, doctor, hospital and donor profiles.' },
  verification: { title: 'Doctor & hospital verification', description: 'Review sample submissions in this frontend-only queue.' },
  requests: { title: 'Blood request monitoring', description: 'Review active, fulfilled and closed sample requests.' },
  audit: { title: 'Audit logs', description: 'Sample security and access activity across the platform.' },
  profile: { title: 'Admin profile', description: 'Administrator account details for this sample workspace.' },
}

const roleOptions: Array<'All roles' | UserRole> = ['All roles', 'Patient', 'Doctor', 'Hospital', 'Donor']
const userStatusOptions: Array<'All statuses' | UserStatus> = ['All statuses', 'Active', 'Pending', 'Inactive']
const requestStatusOptions: Array<'All statuses' | RequestStatus> = ['All statuses', 'Active', 'Fulfilled', 'Closed']

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<(typeof roleOptions)[number]>('All roles')
  const [userStatusFilter, setUserStatusFilter] = useState<(typeof userStatusOptions)[number]>('All statuses')
  const [requestStatusFilter, setRequestStatusFilter] = useState<(typeof requestStatusOptions)[number]>('All statuses')
  const [verificationStatuses, setVerificationStatuses] = useState<Record<string, VerificationStatus>>({})
  const [notice, setNotice] = useState('')
  const section = sectionContent[activeSection]

  const filteredUsers = useMemo(() => users.filter((user) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch = !query || `${user.name} ${user.id} ${user.contact} ${user.detail}`.toLowerCase().includes(query)
    return matchesSearch && (roleFilter === 'All roles' || user.role === roleFilter) && (userStatusFilter === 'All statuses' || user.status === userStatusFilter)
  }), [searchQuery, roleFilter, userStatusFilter])

  const filteredRequests = useMemo(() => bloodRequests.filter((request) => requestStatusFilter === 'All statuses' || request.status === requestStatusFilter), [requestStatusFilter])
  const pendingVerifications = verificationQueue.filter((item) => (verificationStatuses[item.id] ?? 'Pending') === 'Pending').length

  function navigate(sectionId: AdminSection) {
    setActiveSection(sectionId)
    setMobileNavOpen(false)
    setNotice('')
  }

  function reviewVerification(item: VerificationItem, status: Exclude<VerificationStatus, 'Pending'>) {
    setVerificationStatuses((current) => ({ ...current, [item.id]: status }))
    setNotice(`${item.name} marked ${status.toLowerCase()} in this demo only.`)
  }

  return (
    <div className="dashboard-shell admin-dashboard">
      <aside className="dash-sidebar admin-sidebar">
        <Link href="/" className="brand" aria-label="MedicalSathi home"><span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span></Link>
        <div className="dash-workspace"><span className="workspace-icon"><ShieldCheck /></span><span><strong>Admin workspace</strong><small>Sample workspace</small></span><ChevronDown className="workspace-chevron" /></div>
        <span className="dash-label">PLATFORM</span>
        <nav className="dash-nav" aria-label="Admin dashboard navigation">
          {navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={activeSection === id ? 'page' : undefined} className={activeSection === id ? 'active' : ''} onClick={() => navigate(id)}><Icon />{label}{id === 'verification' && pendingVerifications > 0 && <span className="admin-nav-count">{pendingVerifications}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><nav className="dash-nav" aria-label="Admin support navigation"><a href="#support"><LifeBuoy />Help &amp; support</a><a href="#settings"><ShieldCheck />Privacy &amp; security</a><Link href="/login"><LogOut />Sign out</Link></nav></div>
      </aside>

      <div className="dash-main admin-main">
        <header className="dash-topbar admin-topbar">
          <button type="button" className="admin-menu-toggle" aria-label="Toggle admin navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}>{mobileNavOpen ? <X /> : <Menu />}</button>
          <div className="breadcrumb"><Link href="/">MedicalSathi</Link> / <strong>Admin workspace</strong></div>
          <div className="dash-user"><ThemeControl /><span className="admin-notification-icon" aria-label="Sample notification indicator"><Bell /><i /></span><span className="user-avatar">SA</span><span className="admin-header-name">Sam Anderson</span><ChevronDown /></div>
        </header>
        {mobileNavOpen && <nav className="admin-mobile-nav" aria-label="Mobile admin navigation">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={activeSection === id ? 'page' : undefined} className={activeSection === id ? 'active' : ''} onClick={() => navigate(id)}><Icon />{label}{id === 'verification' && pendingVerifications > 0 && <span>{pendingVerifications}</span>}</button>)}</nav>}

        <main className="admin-content">
          <div className="admin-heading"><div><span className="admin-kicker"><span /> PLATFORM OPERATIONS · SAMPLE DATA</span><h1>{section.title}</h1><p>{section.description}</p></div><span className="admin-sample-label">SAMPLE DATA · UI DEMO</span></div>
          {notice && <p className="admin-notice" role="status"><CheckCircle2 />{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X /></button></p>}
          {activeSection === 'overview' && <Overview onNavigate={navigate} verificationStatuses={verificationStatuses} pendingVerifications={pendingVerifications} />}
          {activeSection === 'users' && <UserManagement query={searchQuery} onQueryChange={setSearchQuery} roleFilter={roleFilter} onRoleFilterChange={setRoleFilter} statusFilter={userStatusFilter} onStatusFilterChange={setUserStatusFilter} filteredUsers={filteredUsers} />}
          {activeSection === 'verification' && <VerificationQueue statuses={verificationStatuses} onReview={reviewVerification} />}
          {activeSection === 'requests' && <BloodRequestMonitor statusFilter={requestStatusFilter} onStatusFilterChange={setRequestStatusFilter} filteredRequests={filteredRequests} />}
          {activeSection === 'audit' && <AuditLog />}
          {activeSection === 'profile' && <AdminProfile />}
          <footer className="admin-footer"><ShieldAlert /> Demo interface only. Sample admin actions do not affect real accounts, verification, requests or audit records.</footer>
        </main>
      </div>
    </div>
  )
}

function Overview({ onNavigate, verificationStatuses, pendingVerifications }: { onNavigate: (section: AdminSection) => void; verificationStatuses: Record<string, VerificationStatus>; pendingVerifications: number }) {
  const stats = [
    { label: 'Total patients', value: '1,284', detail: 'Sample registered accounts', icon: UserRound, tone: 'teal' },
    { label: 'Doctors', value: '92', detail: 'Sample provider accounts', icon: Stethoscope, tone: 'blue' },
    { label: 'Hospitals', value: '18', detail: 'Sample organizations', icon: Hospital, tone: 'violet' },
    { label: 'Registered donors', value: '356', detail: 'Sample donor accounts', icon: Droplets, tone: 'rose' },
    { label: 'Active blood requests', value: '24', detail: 'Sample open requests', icon: Activity, tone: 'amber' },
  ]
  return <>
    <section className="admin-stat-grid" aria-label="Sample platform statistics">{stats.map(({ label, value, detail, icon: Icon, tone }) => <article className="admin-stat-card" key={label}><span className={`admin-stat-icon ${tone}`}><Icon /></span><span className="admin-stat-copy"><small>{label}</small><strong>{value}</strong><em>{detail}</em></span></article>)}</section>
    <div className="admin-overview-grid">
      <section className="admin-panel admin-queue-preview"><PanelHeading kicker="REQUIRES REVIEW" title="Verification queue" action="Review all" onAction={() => onNavigate('verification')} /><div className="admin-queue-summary"><span className="admin-queue-mark"><BadgeCheck /></span><span><strong>{pendingVerifications} pending submissions</strong><small>Sample doctors and hospitals awaiting review</small></span><button type="button" onClick={() => onNavigate('verification')} aria-label="Open verification queue"><ChevronDown /></button></div>{verificationQueue.slice(0, 3).map((item) => { const status = verificationStatuses[item.id] ?? 'Pending'; return <div className="admin-mini-verify" key={item.id}><span className="admin-list-avatar">{item.initials}</span><span><strong>{item.name}</strong><small>{item.role} · {item.registration}</small></span><StatusBadge status={status} /></div> })}</section>
      <section className="admin-panel admin-audit-preview"><PanelHeading kicker="PLATFORM SECURITY" title="Recent audit activity" action="View logs" onAction={() => onNavigate('audit')} />{auditEvents.slice(0, 4).map((event) => <div className="admin-mini-audit" key={event.time}><span className={`admin-audit-mark ${event.tone}`}><Activity /></span><span><strong>{event.action}</strong><small>{event.actor} · {event.time}</small></span></div>)}</section>
    </div>
    <section className="admin-panel admin-request-preview"><PanelHeading kicker="COMMUNITY RESPONSE" title="Blood request monitoring" action="View requests" onAction={() => onNavigate('requests')} /><RequestTable requests={bloodRequests.slice(0, 4)} compact /></section>
  </>
}

function UserManagement({ query, onQueryChange, roleFilter, onRoleFilterChange, statusFilter, onStatusFilterChange, filteredUsers }: { query: string; onQueryChange: (value: string) => void; roleFilter: (typeof roleOptions)[number]; onRoleFilterChange: (value: (typeof roleOptions)[number]) => void; statusFilter: (typeof userStatusOptions)[number]; onStatusFilterChange: (value: (typeof userStatusOptions)[number]) => void; filteredUsers: DirectoryUser[] }) {
  return <section className="admin-panel admin-directory-panel"><div className="admin-panel-heading"><div><span className="admin-section-kicker">PLATFORM DIRECTORY</span><h2>Registered users</h2><p>Search and filter fictional profile summaries.</p></div><span className="admin-result-count">{filteredUsers.length} sample users</span></div>
    <div className="admin-filter-row"><label className="admin-search"><Search /><span className="sr-only">Search users</span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search name, ID, email or location" /></label><label className="admin-select-label"><span>Role</span><select value={roleFilter} onChange={(event) => onRoleFilterChange(event.target.value as (typeof roleOptions)[number])}>{roleOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label className="admin-select-label"><span>Status</span><select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value as (typeof userStatusOptions)[number])}>{userStatusOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div>
    {filteredUsers.length > 0 ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Profile</th><th>Role</th><th>Contact</th><th>Joined</th><th>Status</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><span className="admin-user-cell"><span className="admin-list-avatar">{user.initials}</span><span><strong>{user.name}</strong><small>{user.id} · {user.detail}</small></span></span></td><td><RoleBadge role={user.role} /></td><td>{user.contact}</td><td>{user.joined}</td><td><StatusBadge status={user.status} /></td></tr>)}</tbody></table></div> : <div className="admin-empty-state"><Search /><strong>No sample profiles match</strong><span>Try a different name, role or status filter.</span></div>}
    <p className="admin-demo-note"><ShieldCheck /> Directory content and filters are demo-only; no user accounts are changed.</p>
  </section>
}

function VerificationQueue({ statuses, onReview }: { statuses: Record<string, VerificationStatus>; onReview: (item: VerificationItem, status: Exclude<VerificationStatus, 'Pending'>) => void }) {
  return <section className="admin-panel admin-verification-panel"><div className="admin-panel-heading"><div><span className="admin-section-kicker">IDENTITY & ORGANIZATION REVIEW</span><h2>Pending verification submissions</h2><p>Review the sample registration information shown on each card.</p></div><span className="admin-result-count">{verificationQueue.filter((item) => (statuses[item.id] ?? 'Pending') === 'Pending').length} pending</span></div>
    <div className="admin-verification-list">{verificationQueue.map((item) => { const status = statuses[item.id] ?? 'Pending'; return <article className="admin-verification-card" key={item.id}><div className="admin-verification-person"><span className="admin-verification-avatar">{item.initials}</span><span><span className="admin-section-kicker">{item.role} SUBMISSION</span><h3>{item.name}</h3><p>{item.detail}</p></span><StatusBadge status={status} /></div><div className="admin-verification-details"><span><small>Registration reference</small><strong>{item.registration}</strong></span><span><small>Submitted</small><strong><Clock3 /> {item.submitted}</strong></span><span><small>Sample document</small><strong><FileCheck2 /> {item.role === 'Doctor' ? 'Medical registration' : 'Organization certificate'}</strong></span></div><div className="admin-verification-actions"><span><ShieldCheck /> Review actions only change this demo state.</span><div><button type="button" className="admin-reject-button" disabled={status !== 'Pending'} onClick={() => onReview(item, 'Rejected')}><X /> Reject</button><button type="button" className="admin-approve-button" disabled={status !== 'Pending'} onClick={() => onReview(item, 'Approved')}><Check /> Approve</button></div></div></article> })}</div>
    <p className="admin-demo-note"><ShieldAlert /> These fictional profiles and review actions are not connected to real identity documents or accounts.</p>
  </section>
}

function BloodRequestMonitor({ statusFilter, onStatusFilterChange, filteredRequests }: { statusFilter: (typeof requestStatusOptions)[number]; onStatusFilterChange: (value: (typeof requestStatusOptions)[number]) => void; filteredRequests: typeof bloodRequests }) {
  const statusCounts = requestStatusOptions.slice(1).map((status) => ({ status, count: bloodRequests.filter((request) => request.status === status).length }))
  return <section className="admin-panel admin-requests-panel"><div className="admin-panel-heading"><div><span className="admin-section-kicker">COMMUNITY NEEDS</span><h2>Blood request monitoring</h2><p>Sample request status, hospital and patient reference.</p></div><label className="admin-select-label"><span>Request status</span><select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value as (typeof requestStatusOptions)[number])}>{requestStatusOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div>
    <div className="admin-request-counts">{statusCounts.map(({ status, count }) => <div key={status}><span className={`admin-request-count-icon ${status.toLowerCase()}`}><Droplets /></span><span><small>{status} requests</small><strong>{count.toString().padStart(2, '0')}</strong></span></div>)}</div><RequestTable requests={filteredRequests} /><p className="admin-demo-note"><Activity /> Sample monitoring view only; this dashboard does not create, fulfill or close real requests.</p>
  </section>
}

function RequestTable({ requests, compact = false }: { requests: typeof bloodRequests; compact?: boolean }) {
  return <div className="admin-table-wrap"><table className={`admin-table admin-request-table ${compact ? 'is-compact' : ''}`}><thead><tr><th>Request</th><th>Blood group</th><th>Units</th><th>Hospital & location</th><th>Updated</th><th>Status</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><td><span className="admin-request-id">{request.id}</span><small>{request.patient}</small></td><td><span className="admin-blood-group"><Droplets />{request.group}</span></td><td>{request.units} {request.units === 1 ? 'unit' : 'units'}</td><td><span className="admin-hospital-cell"><strong>{request.hospital}</strong><small><MapPin /> {request.location}</small></span></td><td>{request.created}</td><td><StatusBadge status={request.status} /></td></tr>)}</tbody></table></div>
}

function AuditLog() {
  return <section className="admin-panel admin-audit-panel"><div className="admin-panel-heading"><div><span className="admin-section-kicker">SECURITY & ACCOUNTABILITY</span><h2>Audit activity</h2><p>Illustrative events with timestamps, roles and action details.</p></div><span className="admin-result-count">{auditEvents.length} sample events</span></div><div className="admin-table-wrap"><table className="admin-table admin-audit-table"><thead><tr><th>Timestamp</th><th>Actor / role</th><th>Action</th><th>Target</th><th>Result</th></tr></thead><tbody>{auditEvents.map((event) => <tr key={event.time}><td><span className="admin-audit-time"><Clock3 />{event.time}</span></td><td><span className="admin-audit-actor"><strong>{event.actor}</strong><RoleBadge role={event.role as UserRole | 'Administrator'} /></span></td><td>{event.action}</td><td>{event.target}</td><td><StatusBadge status={event.result as 'Active' | 'Pending' | 'Inactive' | 'Recorded' | 'Review pending' | 'Access ended' | 'Updated' | 'Viewed'} /></td></tr>)}</tbody></table></div><p className="admin-demo-note"><ShieldCheck /> Audit events are fabricated examples, not actual access or security records.</p></section>
}

function AdminProfile() {
  return <section className="admin-panel admin-profile-panel"><div className="admin-panel-heading"><div><span className="admin-section-kicker">ACCOUNT SETTINGS</span><h2>Administrator profile</h2><p>Basic profile details for the current sample administrator.</p></div><span className="admin-profile-state"><CheckCircle2 /> Workspace admin</span></div><div className="admin-profile-banner"><span className="admin-profile-avatar">SA</span><span><small>ADMINISTRATOR</small><strong>Sam Anderson</strong><em>MedicalSathi Platform Operations</em></span><BadgeCheck /></div><div className="admin-profile-details"><ProfileDetail label="Full name" value="Sam Anderson" /><ProfileDetail label="Work email" value="sam.anderson@example.test" /><ProfileDetail label="Phone number" value="+1 (555) 010-8820" /><ProfileDetail label="Role" value="Platform Administrator" /><ProfileDetail label="Access level" value="Operations · Sample" /><ProfileDetail label="Account status" value="Active · Demo profile" /></div><p className="admin-demo-note"><ShieldAlert /> Profile data is fictional and is not linked to a real administrator account.</p></section>
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return <div className="admin-profile-detail"><small>{label}</small><strong>{value}</strong></div>
}

function PanelHeading({ kicker, title, action, onAction }: { kicker: string; title: string; action: string; onAction: () => void }) {
  return <div className="admin-panel-heading"><div><span className="admin-section-kicker">{kicker}</span><h2>{title}</h2></div><button type="button" className="admin-text-action" onClick={onAction}>{action}<ChevronDown /></button></div>
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`admin-status-badge ${tone}`}><i />{status}</span>
}

function RoleBadge({ role }: { role: UserRole | 'Administrator' }) {
  const tone = role.toLowerCase()
  return <span className={`admin-role-badge ${tone}`}>{role}</span>
}
