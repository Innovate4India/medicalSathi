'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity, Bell, CalendarDays, Check, ChevronDown, Clock3, Droplets, HeartPulse,
  Home, LifeBuoy, LogOut, MapPin, Menu, Settings, ShieldCheck, UserRound, Users,
  X,
} from 'lucide-react'
import { ThemeControl } from '@/components/theme-control'
import { BloodDonorNetwork } from '@/components/blood-donor-network'

type SampleRequest = {
  id: string
  group: string
  units: number
  hospital: string
  location: string
  distance: string
  urgency: string
  status: 'Open' | 'Responded' | 'Unavailable'
}

const initialRequests: SampleRequest[] = [
  { id: 'req-1', group: 'O−', units: 2, hospital: 'City General Hospital', location: 'Downtown, North District', distance: '2.4 km away', urgency: 'Needed today', status: 'Open' },
  { id: 'req-2', group: 'O−', units: 1, hospital: 'St. Mary’s Medical Centre', location: 'Riverside, Central District', distance: '4.1 km away', urgency: 'Within 24 hours', status: 'Open' },
  { id: 'req-3', group: 'O−', units: 3, hospital: 'Green Valley Hospital', location: 'West End, North District', distance: '6.8 km away', urgency: 'Needed tomorrow', status: 'Open' },
]

const donationHistory = [
  { hospital: 'City General Hospital', location: 'North District', date: '18 Sep 2025', units: '1 unit' },
  { hospital: 'Community Blood Centre', location: 'Central District', date: '04 May 2025', units: '1 unit' },
  { hospital: 'St. Mary’s Medical Centre', location: 'Riverside', date: '22 Dec 2024', units: '1 unit' },
]

const navigation = [
  { href: '#overview', label: 'Overview', icon: Home },
  { href: '#requests', label: 'Blood requests', icon: Droplets },
  { href: '#donor-blood-network', label: 'Request workflow', icon: Activity },
  { href: '#profile', label: 'Donor profile', icon: UserRound },
  { href: '#availability', label: 'Availability', icon: ShieldCheck },
  { href: '#history', label: 'Donation history', icon: CalendarDays },
]

export function DonorDashboard() {
  const [available, setAvailable] = useState(true)
  const [notifications, setNotifications] = useState({ nearby: true, urgent: true, reminders: false })
  const [requests, setRequests] = useState(initialRequests)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const respondedCount = requests.filter((request) => request.status === 'Responded').length

  function updateRequest(id: string, status: SampleRequest['status']) {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request))
  }

  return (
    <div className="dashboard-shell donor-dashboard">
      <aside className="dash-sidebar donor-sidebar">
        <Link href="/" className="brand" aria-label="MedicalSathi home">
          <span className="brand-mark"><HeartPulse /></span><span>Medical<span className="brand-accent">Sathi</span></span>
        </Link>
        <div className="dash-workspace"><span className="workspace-icon"><Droplets /></span><span><strong>Blood donor space</strong><small>Sample workspace</small></span><ChevronDown className="workspace-chevron" /></div>
        <span className="dash-label">WORKSPACE</span>
        <nav className="dash-nav" aria-label="Donor dashboard navigation">
          {navigation.map(({ href, label, icon: Icon }, index) => <a className={index === 0 ? 'active' : ''} href={href} key={href} onClick={() => setMobileNavOpen(false)}><Icon />{label}</a>)}
        </nav>
        <div className="sidebar-bottom"><nav className="dash-nav" aria-label="Account navigation"><a href="#support"><LifeBuoy />Help &amp; support</a><a href="#settings"><Settings />Settings</a><Link href="/login"><LogOut />Sign out</Link></nav></div>
      </aside>

      <div className="dash-main donor-main">
        <header className="dash-topbar donor-topbar">
          <button className="donor-menu-toggle" type="button" aria-label="Toggle dashboard navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}>{mobileNavOpen ? <X /> : <Menu />}</button>
          <div className="breadcrumb"><Link href="/">MedicalSathi</Link> / <strong>Blood donor space</strong></div>
          <div className="dash-user"><ThemeControl /><span className="donor-notification-indicator" aria-label="Sample notifications"><Bell /><i /></span><span className="user-avatar">JD</span><span className="donor-header-name">Jordan D.</span><ChevronDown /></div>
        </header>
        {mobileNavOpen && <nav className="donor-mobile-nav" aria-label="Mobile donor navigation">{navigation.map(({ href, label, icon: Icon }) => <a href={href} key={href} onClick={() => setMobileNavOpen(false)}><Icon />{label}</a>)}<a href="#support" onClick={() => setMobileNavOpen(false)}><LifeBuoy />Help &amp; support</a><a href="#settings" onClick={() => setMobileNavOpen(false)}><Settings />Settings</a></nav>}

        <main className="donor-content">
          <section className="donor-heading" id="overview">
            <div><div className="donor-kicker"><span /> YOUR COMMUNITY, YOUR IMPACT</div><h1>Welcome back, Jordan</h1><p>Here’s a look at how you can help in your community today.</p></div>
            <span className="donor-sample-label">SAMPLE DATA · UI DEMO</span>
          </section>

          <section className="donor-profile-banner" aria-label="Donor summary">
            <div className="donor-profile-main"><div className="donor-avatar-large">JD</div><div><span className="donor-caption">REGISTERED DONOR</span><h2>Jordan Davis</h2><p><MapPin /> North District, Springfield</p></div></div>
            <div className="donor-banner-detail"><span className="donor-blood-mark"><Droplets /></span><span><small>Blood group</small><strong>O negative</strong></span></div>
            <div className="donor-banner-detail"><span className={`donor-status-dot ${available ? '' : 'is-off'}`} /><span><small>Availability</small><strong>{available ? 'Available to help' : 'Not available'}</strong></span></div>
            <a className="donor-inline-link" href="#profile">View profile <ChevronDown /></a>
          </section>

          <section className="donor-metric-grid" aria-label="Donor overview metrics">
            <article className="donor-metric-card"><span className="donor-metric-icon teal"><Droplets /></span><span><small>Nearby requests</small><strong>{requests.filter((request) => request.status === 'Open').length}</strong><em>Sample requests near you</em></span></article>
            <article className="donor-metric-card"><span className="donor-metric-icon green"><HeartPulse /></span><span><small>Donations given</small><strong>3</strong><em>Sample donation history</em></span></article>
            <article className="donor-metric-card"><span className="donor-metric-icon blue"><Users /></span><span><small>Interest sent</small><strong>{respondedCount}</strong><em>Sample UI responses</em></span></article>
            <article className="donor-metric-card"><span className="donor-metric-icon amber"><Clock3 /></span><span><small>Last donation</small><strong>Sep 2025</strong><em>Sample profile detail</em></span></article>
          </section>

          <div className="donor-overview-grid">
            <section className="donor-panel donor-request-preview" aria-labelledby="nearby-heading">
              <div className="donor-panel-heading"><div><span className="donor-section-kicker">NEARBY OPPORTUNITIES</span><h2 id="nearby-heading">Requests near you</h2></div><a href="#requests">View all <ChevronDown /></a></div>
              {requests.slice(0, 2).map((request) => <RequestRow key={request.id} request={request} onInterested={() => updateRequest(request.id, 'Responded')} />)}
              <p className="donor-demo-note"><ShieldCheck /> Sample requests only. No real donor or hospital notifications are sent.</p>
            </section>
            <section className="donor-panel donor-activity-panel" aria-labelledby="activity-heading">
              <div className="donor-panel-heading"><div><span className="donor-section-kicker">YOUR RECENT ACTIVITY</span><h2 id="activity-heading">Community activity</h2></div></div>
              <ActivityItem icon={Droplets} title="A nearby request was posted" detail="City General Hospital · 2.4 km away" time="Today, 9:15 AM" />
              <ActivityItem icon={Check} title="Your donor profile is complete" detail="Your details help coordinate sample requests." time="Yesterday" />
              <ActivityItem icon={HeartPulse} title="Thank you for giving" detail="Your latest sample donation was recorded." time="18 Sep 2025" />
              <p className="donor-demo-note"><Activity /> Activity shown is sample data for this UI demo.</p>
            </section>
          </div>

          <section className="donor-panel donor-requests-section" id="requests" aria-labelledby="requests-heading">
            <div className="donor-panel-heading"><div><span className="donor-section-kicker">COMMUNITY NEEDS</span><h2 id="requests-heading">Blood requests</h2><p>Sample requests from hospitals in your area.</p></div><span className="donor-count-pill">{requests.length} sample requests</span></div>
            <div className="donor-request-list">{requests.map((request) => <RequestCard key={request.id} request={request} onInterested={() => updateRequest(request.id, 'Responded')} onUnavailable={() => updateRequest(request.id, 'Unavailable')} />)}</div>
            <p className="donor-demo-note"><ShieldCheck /> These are fictional examples. Actions only update this screen and do not contact a hospital.</p>
          </section>

          <BloodDonorNetwork mode="donor" />

          <div className="donor-lower-grid">
            <section className="donor-panel donor-profile-section" id="profile" aria-labelledby="profile-heading">
              <div className="donor-panel-heading"><div><span className="donor-section-kicker">YOUR DETAILS</span><h2 id="profile-heading">Donor profile</h2><p>Keep your sample contact details up to date.</p></div><span className="donor-edit-badge">Sample profile</span></div>
              <form className="donor-form" onSubmit={(event) => event.preventDefault()}>
                <label>Full name<input name="name" defaultValue="Jordan Davis" autoComplete="name" /></label>
                <label>Phone number<input name="phone" defaultValue="+1 (555) 014-2580" autoComplete="tel" type="tel" /></label>
                <label className="donor-form-wide">Email address <span className="donor-optional">Optional</span><input name="email" defaultValue="jordan.davis@example.test" autoComplete="email" type="email" /></label>
                <label>Blood group<select name="blood-group" defaultValue="O-"><option value="O-">O negative (O−)</option><option value="O+">O positive (O+)</option><option value="A-">A negative (A−)</option><option value="A+">A positive (A+)</option><option value="B-">B negative (B−)</option><option value="B+">B positive (B+)</option><option value="AB-">AB negative (AB−)</option><option value="AB+">AB positive (AB+)</option></select></label>
                <label>Location<input name="location" defaultValue="North District, Springfield" autoComplete="address-level2" /></label>
                <label className="donor-form-wide">Last donation date<input name="last-donation" defaultValue="2025-09-18" type="date" /></label>
                <div className="donor-form-actions"><span><ShieldCheck /> Sample details stay in this demo.</span><button type="submit" className="donor-primary-button">Save profile</button></div>
              </form>
            </section>

            <section className="donor-panel donor-availability-section" id="availability" aria-labelledby="availability-heading">
              <div className="donor-panel-heading"><div><span className="donor-section-kicker">SET YOUR PREFERENCE</span><h2 id="availability-heading">Availability</h2><p>Choose whether you’re open to sample requests.</p></div></div>
              <div className={`donor-availability-card ${available ? 'is-available' : ''}`}>
                <span className="donor-availability-symbol"><HeartPulse /></span><span className="donor-availability-copy"><strong>{available ? 'Available to donate' : 'Not available right now'}</strong><small>{available ? 'You’re shown as available in this sample dashboard.' : 'Your sample profile is marked unavailable.'}</small></span>
                <button type="button" className={`donor-switch ${available ? 'is-on' : ''}`} role="switch" aria-checked={available} aria-label="Set donor availability" onClick={() => setAvailable((value) => !value)}><span /></button>
              </div>
              <div className="donor-preferences-heading"><strong>Notification preferences</strong><small>Local UI preferences only</small></div>
              <PreferenceRow title="Nearby blood requests" detail="Sample updates for your area" checked={notifications.nearby} onChange={() => setNotifications((current) => ({ ...current, nearby: !current.nearby }))} />
              <PreferenceRow title="Urgent requests" detail="When a nearby request is marked urgent" checked={notifications.urgent} onChange={() => setNotifications((current) => ({ ...current, urgent: !current.urgent }))} />
              <PreferenceRow title="Donation reminders" detail="A gentle reminder to review your profile" checked={notifications.reminders} onChange={() => setNotifications((current) => ({ ...current, reminders: !current.reminders }))} />
              <p className="donor-demo-note"><Bell /> Preference controls are visual only. No notifications are sent.</p>
            </section>
          </div>

          <section className="donor-panel donor-history-section" id="history" aria-labelledby="history-heading">
            <div className="donor-panel-heading"><div><span className="donor-section-kicker">YOUR GENEROSITY</span><h2 id="history-heading">Donation history</h2><p>A record of previous sample donations.</p></div><span className="donor-history-total">3 sample donations</span></div>
            <div className="donor-history-list">{donationHistory.map((item) => <article className="donor-history-item" key={item.date}><span className="donor-history-icon"><Droplets /></span><span className="donor-history-copy"><strong>{item.hospital}</strong><small><MapPin /> {item.location}</small></span><span className="donor-history-units">{item.units}</span><time>{item.date}</time><span className="donor-history-thanks"><HeartPulse /> Thank you</span></article>)}</div>
            <p className="donor-demo-note"><Activity /> Donation records above are fictional sample data.</p>
          </section>
          <section className="donor-panel donor-utility-panel" id="support" aria-labelledby="donor-support-heading">
            <div className="donor-panel-heading"><div><span className="donor-section-kicker">DONOR GUIDE</span><h2 id="donor-support-heading">Help &amp; support</h2><p>Useful information for this sample donor dashboard.</p></div><LifeBuoy aria-hidden="true" /></div>
            <div className="donor-utility-grid"><article><h3>Responding to a request</h3><p>Review the sample blood group, location and timing before choosing an on-screen response. A response in this demo does not contact a hospital or reserve a donation.</p></article><article><h3>Questions about donating?</h3><p>This demonstration has no live support team. Contact a licensed blood donation center or your healthcare provider through their official channels for eligibility and donation guidance. For urgent emergencies, contact local emergency services.</p></article></div>
          </section>
          <section className="donor-panel donor-utility-panel" id="settings" aria-labelledby="donor-settings-heading">
            <div className="donor-panel-heading"><div><span className="donor-section-kicker">YOUR PREFERENCES</span><h2 id="donor-settings-heading">Settings</h2><p>Adjust display preferences for this dashboard.</p></div><Settings aria-hidden="true" /></div>
            <div className="donor-utility-setting"><span><strong>Color theme</strong><small>Choose light, dark or follow your device preference.</small></span><ThemeControl /></div>
            <p className="donor-demo-note"><ShieldCheck /> Theme preference is stored locally in this browser. Settings are for this UI demo only.</p>
          </section>
          <footer className="donor-footer"><HeartPulse /> MedicalSathi <span>Care moves forward, together.</span></footer>
        </main>
      </div>
    </div>
  )
}

function RequestRow({ request, onInterested }: { request: SampleRequest; onInterested: () => void }) {
  return <article className="donor-request-row"><span className="donor-request-blood">{request.group}</span><span className="donor-request-row-copy"><strong>{request.hospital}</strong><small>{request.units} {request.units === 1 ? 'unit' : 'units'} needed · {request.distance}</small></span><button type="button" className="donor-row-action" onClick={onInterested}>{request.status === 'Responded' ? <><Check /> Interested</> : <>Interested <ChevronDown /></>}</button></article>
}

function RequestCard({ request, onInterested, onUnavailable }: { request: SampleRequest; onInterested: () => void; onUnavailable: () => void }) {
  const isResponded = request.status === 'Responded'
  const isUnavailable = request.status === 'Unavailable'
  return <article className="donor-request-card">
    <div className="donor-request-card-top"><span className="donor-request-blood donor-request-blood-large"><Droplets />{request.group}</span><span className={`donor-request-status ${isResponded ? 'is-responded' : isUnavailable ? 'is-unavailable' : ''}`}><span />{request.status}</span></div>
    <h3>{request.hospital}</h3>
    <div className="donor-request-facts"><span><Droplets />{request.units} {request.units === 1 ? 'unit' : 'units'} needed</span><span><MapPin />{request.location}</span><span><Activity />{request.urgency}</span></div>
    <div className="donor-request-card-bottom"><span className="donor-distance"><MapPin />{request.distance}</span><div className="donor-request-actions"><button type="button" className="donor-secondary-button" onClick={onUnavailable} disabled={isUnavailable}>{isUnavailable ? <><X /> Not available</> : 'Not available'}</button><button type="button" className="donor-primary-button" onClick={onInterested} disabled={isResponded || isUnavailable}>{isResponded ? <><Check /> Interested</> : 'Interested'}</button></div></div>
  </article>
}

function ActivityItem({ icon: Icon, title, detail, time }: { icon: typeof Activity; title: string; detail: string; time: string }) {
  return <article className="donor-activity-item"><span className="donor-activity-icon"><Icon /></span><span className="donor-activity-copy"><strong>{title}</strong><small>{detail}</small><time>{time}</time></span></article>
}

function PreferenceRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: () => void }) {
  return <label className="donor-preference-row"><span><strong>{title}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={onChange} /><span className="donor-preference-check" aria-hidden="true">{checked ? <Check /> : null}</span></label>
}
