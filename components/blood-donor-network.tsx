'use client'

import { useState, type FormEvent } from 'react'
import { Activity, Check, CheckCircle2, Clock3, Droplets, HeartPulse, MapPin, ShieldCheck, Users } from 'lucide-react'
import styles from './blood-donor-network.module.css'

type NetworkMode = 'patient' | 'donor' | 'hospital'
type RequestStatus = 'Open' | 'Donor Responded' | 'Partially Fulfilled' | 'Fulfilled' | 'Closed'
type NetworkRequest = {
  id: string
  group: string
  units: number
  hospital: string
  location: string
  urgency: string
  contact: string
  response: 'Awaiting response' | 'Interested' | 'Not available'
  received: number
  closed: boolean
}

const initialRequests: NetworkRequest[] = [
  { id: 'sample-1', group: 'O−', units: 2, hospital: 'City General Hospital', location: 'Downtown · North District', urgency: 'Urgent · Today', contact: 'Sample coordinator', response: 'Awaiting response', received: 0, closed: false },
  { id: 'sample-2', group: 'A+', units: 1, hospital: 'Northstar Medical Center', location: 'Harbor District', urgency: 'Within 24 hours', contact: 'Sample coordinator', response: 'Interested', received: 0, closed: false },
  { id: 'sample-3', group: 'B+', units: 3, hospital: 'Green Valley Hospital', location: 'West End', urgency: 'Routine · This week', contact: 'Sample coordinator', response: 'Interested', received: 1, closed: false },
  { id: 'sample-4', group: 'AB−', units: 1, hospital: 'St. Mary’s Medical Centre', location: 'Riverside', urgency: 'Today', contact: 'Sample coordinator', response: 'Interested', received: 1, closed: false },
  { id: 'sample-5', group: 'O+', units: 2, hospital: 'City General Hospital', location: 'Downtown · North District', urgency: 'Today', contact: 'Sample coordinator', response: 'Interested', received: 1, closed: false },
]

const donors = [
  { initials: 'AM', name: 'Alex M.', group: 'O−', area: 'North District', availability: 'Available today', tone: 'teal' },
  { initials: 'RK', name: 'Riya K.', group: 'A+', area: 'Harbor District', availability: 'Available this week', tone: 'blue' },
  { initials: 'JM', name: 'Jordan M.', group: 'B+', area: 'West End', availability: 'Availability unconfirmed', tone: 'amber' },
]

function statusFor(request: NetworkRequest): RequestStatus {
  if (request.closed) return 'Closed'
  if (request.received >= request.units) return 'Fulfilled'
  if (request.received > 0) return 'Partially Fulfilled'
  if (request.response === 'Interested') return 'Donor Responded'
  return 'Open'
}

export function BloodDonorNetwork({ mode }: { mode: NetworkMode }) {
  const [requests, setRequests] = useState(initialRequests)
  const [notice, setNotice] = useState('')
  const [confirmedUnits, setConfirmedUnits] = useState<Record<string, number>>({})

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const newRequest: NetworkRequest = {
      id: `local-${Date.now()}`,
      group: String(values.get('group')),
      units: Number(values.get('units')),
      hospital: String(values.get('hospital')).trim(),
      location: String(values.get('location')).trim(),
      urgency: String(values.get('urgency')),
      contact: String(values.get('contact')).trim(),
      response: 'Awaiting response',
      received: 0,
      closed: false,
    }
    setRequests((current) => [newRequest, ...current])
    setNotice('Sample request added to this page for demonstration. Nothing was sent or saved.')
    event.currentTarget.reset()
  }

  function updateResponse(id: string, response: NetworkRequest['response']) {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, response } : request))
    setNotice(`Sample response updated to “${response}”. No one was contacted.`)
  }

  function confirmReceived(id: string) {
    const units = confirmedUnits[id] ?? 0
    if (units < 0) return
    setRequests((current) => current.map((request) => request.id === id
      ? { ...request, received: units, closed: units >= request.units }
      : request))
    const request = requests.find((item) => item.id === id)
    setNotice(units >= (request?.units ?? Infinity)
      ? 'Demo confirmation complete: the required units are marked received and this request is now Closed.'
      : 'Demo confirmation updated for this session. The request remains open for remaining units.')
  }

  const heading = mode === 'patient' ? 'Request blood support' : mode === 'donor' ? 'Donor request management' : 'Review donor responses'

  return (
    <section id={`${mode}-blood-network`} className={styles.network} aria-labelledby={`${mode}-blood-network-title`}>
      <header className={styles.heading}>
        <div>
          <span className={styles.kicker}><Droplets aria-hidden="true" /> BLOOD DONOR NETWORK · SIMULATED</span>
          <h2 id={`${mode}-blood-network-title`}>{heading}</h2>
          <p>Sample-only coordination embedded in the MedicalSathi dashboard. No real matches, messages or confirmations.</p>
        </div>
        <span className={styles.demoBadge}><ShieldCheck aria-hidden="true" /> Demo only</span>
      </header>

      {notice && <p className={styles.notice} role="status"><CheckCircle2 aria-hidden="true" />{notice}</p>}

      {mode === 'patient' && <>
        <div className={styles.columns}>
          <form className={`${styles.card} ${styles.requestForm}`} onSubmit={submitRequest}>
            <div className={styles.cardHeading}><div><span className={styles.eyebrow}>PATIENT REQUEST</span><h3>Tell us what is needed</h3></div><span className={styles.icon}><HeartPulse aria-hidden="true" /></span></div>
            <div className={styles.formGrid}>
              <label>Blood group<select name="group" required defaultValue="O+"><option>O+</option><option>O−</option><option>A+</option><option>A−</option><option>B+</option><option>B−</option><option>AB+</option><option>AB−</option></select></label>
              <label>Required units<input name="units" type="number" min="1" max="20" required defaultValue="2" /></label>
              <label>Hospital<input name="hospital" required placeholder="Hospital name" /></label>
              <label>Location<input name="location" required placeholder="Area or district" /></label>
              <label>Urgency<select name="urgency" defaultValue="Within 24 hours"><option>Urgent · Today</option><option>Within 24 hours</option><option>Routine · This week</option></select></label>
              <label>Contact details<input name="contact" required placeholder="Phone or email" /></label>
            </div>
            <div className={styles.formFooter}><span><ShieldCheck aria-hidden="true" /> Use sample details only.</span><button className={styles.primaryButton} type="submit"><Droplets aria-hidden="true" /> Add demo request</button></div>
          </form>
          <section className={`${styles.card} ${styles.matchCard}`} aria-labelledby="donor-match-heading">
            <div className={styles.cardHeading}><div><span className={styles.eyebrow}>NEARBY COMMUNITY</span><h3 id="donor-match-heading">Potential donor matches</h3></div><span className={styles.icon}><Users aria-hidden="true" /></span></div>
            <p className={styles.simulated}><Activity aria-hidden="true" /> Matching is simulated. Locations and availability are illustrative only.</p>
            <div className={styles.donorList}>{donors.map((donor) => <article className={styles.donor} key={donor.initials}><span className={`${styles.avatar} ${styles[donor.tone]}`}>{donor.initials}</span><span className={styles.donorCopy}><strong>{donor.name}<small>{donor.group}</small></strong><span><MapPin aria-hidden="true" /> Approx. {donor.area}</span></span><span className={styles.availability}>{donor.availability}</span></article>)}</div>
          </section>
        </div>
        <RequestTracker requests={requests} />
      </>}

      {mode === 'donor' && <>
        <section className={styles.card} aria-labelledby="incoming-requests-title">
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>SAMPLE REQUESTS NEARBY</span><h3 id="incoming-requests-title">Review incoming requests</h3></div><span className={styles.icon}><MapPin aria-hidden="true" /></span></div>
          <p className={styles.simulated}><Activity aria-hidden="true" /> Sample requests only. Responses update this demo screen and do not notify a patient or hospital.</p>
          <div className={styles.requestList}>{requests.slice(0, 3).map((request) => <article className={styles.requestRow} key={request.id}>
              <span className={styles.bloodGroup}>{request.group}</span><span className={styles.requestCopy}><strong>{request.hospital}</strong><small>{request.units} {request.units === 1 ? 'unit' : 'units'} · {request.location}</small><small>{request.urgency} · Tracking: {statusFor(request)}</small><small>Donor response: {request.response}</small></span>
            <div className={styles.actions}><button className={styles.secondaryButton} type="button" onClick={() => updateResponse(request.id, 'Not available')} disabled={request.response !== 'Awaiting response'}>{request.response === 'Not available' ? 'Marked unavailable' : 'Not available'}</button><button className={styles.primaryButton} type="button" onClick={() => updateResponse(request.id, 'Interested')} disabled={request.response !== 'Awaiting response'}><Check aria-hidden="true" /> Interested</button></div>
          </article>)}</div>
        </section>
        <RequestTracker requests={requests} />
      </>}

      {mode === 'hospital' && <>
        <section className={styles.card} aria-labelledby="hospital-confirm-title">
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>HOSPITAL CONFIRMATION</span><h3 id="hospital-confirm-title">Review donor responses</h3></div><span className={styles.icon}><CheckCircle2 aria-hidden="true" /></span></div>
          <p className={styles.simulated}><Activity aria-hidden="true" /> Confirm only a sample count here. This interface does not record a real-world donation.</p>
          <div className={styles.requestList}>{requests.filter((request) => request.response === 'Interested').map((request) => {
            const status = statusFor(request)
            return <article className={styles.confirmRow} key={request.id}>
              <span className={styles.bloodGroup}>{request.group}</span><span className={styles.requestCopy}><strong>{request.hospital}</strong><small>Donor response: Interested · {request.units} {request.units === 1 ? 'unit' : 'units'} requested</small><small>{request.received} of {request.units} {request.units === 1 ? 'unit' : 'units'} confirmed received · {status}</small></span>
              <div className={styles.confirmControl}><label htmlFor={`units-${request.id}`}>Total received</label><div><input id={`units-${request.id}`} type="number" min="0" max={request.units} value={confirmedUnits[request.id] ?? request.received} onChange={(event) => setConfirmedUnits((current) => ({ ...current, [request.id]: Number(event.target.value) }))} /><span>of {request.units} units</span><button className={styles.primaryButton} type="button" onClick={() => confirmReceived(request.id)}><Check aria-hidden="true" /> Confirm</button></div></div>
            </article>
          })}</div>
        </section>
        <section className={`${styles.card} ${styles.closure}`} aria-labelledby="closure-title">
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>AUTOMATIC CLOSURE PREVIEW</span><h3 id="closure-title">Complete the sample request</h3></div><span className={styles.icon}><CheckCircle2 aria-hidden="true" /></span></div>
          <div className={styles.closureBody}><div><strong>City General Hospital · O+</strong><p>Required: 2 units · Confirmed received: {requests.find((request) => request.id === 'sample-5')?.received ?? 0} units</p></div><span className={`${styles.status} ${statusFor(requests.find((request) => request.id === 'sample-5') ?? initialRequests[4]) === 'Closed' ? styles.closed : styles.partial}`}>{statusFor(requests.find((request) => request.id === 'sample-5') ?? initialRequests[4])}</span></div>
          <p className={styles.closureNote}>Confirming the full required quantity automatically changes this demo request to Closed.</p>
        </section>
        <RequestTracker requests={requests} />
      </>}
      <p className={styles.disclaimer}><ShieldCheck aria-hidden="true" /> Frontend demonstration only. No API, database, real donor matching, notifications or donation confirmation is connected.</p>
    </section>
  )
}

function RequestTracker({ requests }: { requests: NetworkRequest[] }) {
  return <section className={styles.card} aria-labelledby="request-tracker-title">
    <div className={styles.cardHeading}><div><span className={styles.eyebrow}>REQUEST TRACKING</span><h3 id="request-tracker-title">Sample request statuses</h3></div><span className={styles.icon}><Clock3 aria-hidden="true" /></span></div>
    <div className={styles.tracker}>
      {requests.slice(0, 5).map((request) => {
        const status = statusFor(request)
        return <article className={styles.trackerRow} key={request.id}>
          <span className={styles.bloodGroup}>{request.group}</span><span className={styles.trackerCopy}><strong>{request.hospital}</strong><small>{request.units} {request.units === 1 ? 'unit' : 'units'} required · {request.received} confirmed received</small></span><span className={`${styles.status} ${status === 'Closed' || status === 'Fulfilled' ? styles.closed : status === 'Partially Fulfilled' ? styles.partial : status === 'Donor Responded' ? styles.responded : ''}`}>{status}</span>
        </article>
      })}
    </div>
  </section>
}
