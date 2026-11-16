import { lazy, Suspense, useState, type ReactNode } from 'react'
import { Link, NavLink, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BedDouble, Bike, CalendarDays, Check, ChevronRight, Clock3, Compass, Copy, ExternalLink, LayoutDashboard, ListChecks, Map, MapPin, MountainSnow, PackageCheck, Printer, Route, ShieldAlert, Snowflake, Train } from 'lucide-react'
import { itinerary } from './App'
import { dayGuides } from './day-guides'
import DayPath from './DayPath'
import './planner.css'

const JourneyMap = lazy(() => import('./JourneyMap'))

function Layout({ children, current }: { children: ReactNode; current?: number }) {
  return <div className="planner">
    <aside className="planner-sidebar">
      <Link className="planner-brand" to="/"><span><MountainSnow size={23} /></span><div>NORTHBOUND<small>MUNSYARI · WINTER 2027</small></div></Link>
      <nav aria-label="Main navigation" className="planner-main-nav"><NavLink to="/" end><LayoutDashboard size={17} />Trip overview</NavLink><NavLink to="/route"><Map size={17} />Full route</NavLink></nav>
      <div className="sidebar-label">YOUR SIX DAYS<span>08—13 JAN</span></div>
      <nav aria-label="Journey days" className="planner-days">{itinerary.map((day, index) => <NavLink key={day.day} to={`/day/${day.day}`}><span className="sidebar-day-number">{day.day}</span><div><small>{day.date} · {index === 0 ? 'TRAIN' : index === 3 ? 'EXPLORE' : 'RIDE'}</small><strong>{day.title}</strong></div><ChevronRight size={14} /></NavLink>)}</nav>
      <div className="sidebar-bottom"><span><Snowflake size={17} />Winter road trip</span><p>Daylight riding. Flexible plans.</p><Link to="/day/03?view=prepare">Snow & road checks <ArrowRight size={13} /></Link></div>
    </aside>
    <div className="planner-workspace">
      <header className="planner-topbar"><div><span>Kumaon, Uttarakhand</span><ChevronRight size={13} /><strong>{current === undefined ? 'Trip planner' : `Day ${itinerary[current].day}`}</strong></div><span><CalendarDays size={15} />8–14 January 2027</span></header>
      <main className="planner-main">{children}</main>
      <footer className="planner-footer"><span>Timings and distances are estimates. Check local conditions before each leg.</span><a href="https://commons.wikimedia.org/wiki/File:Panchchuli_II.jpg" target="_blank" rel="noreferrer">Photo: Suresh Karia · CC BY-SA 4.0</a></footer>
    </div>
  </div>
}

function MapPlaceholder() { return <div className="planner-map-loading"><Compass size={24} /><span>Loading route map…</span></div> }

function Checklist({ index }: { index: number }) {
  const guide = dayGuides[index]
  const key = `northbound-day-${itinerary[index].day}-ready`
  const [checks, setChecks] = useState<number[]>(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((item): item is number => Number.isInteger(item) && item >= 0 && item < guide.essentials.length) : [] } catch { return [] }
  })
  const toggle = (item: number) => setChecks((old) => {
    const updated = old.includes(item) ? old.filter((entry) => entry !== item) : [...old, item]
    try { localStorage.setItem(key, JSON.stringify(updated)) } catch { /* Local storage is optional. */ }
    return updated
  })
  return <section className="planner-card planner-checklist"><div className="planner-card-heading"><h2><PackageCheck size={18} />Before you go</h2><span>{checks.length}/{guide.essentials.length}</span></div>{guide.essentials.map((item, i) => <button key={item} aria-pressed={checks.includes(i)} onClick={() => toggle(i)}><span>{checks.includes(i) && <Check size={14} />}</span>{item}</button>)}<small>Saved on this device.</small></section>
}

const packing = [
  { name: 'Keep accessible', items: ['Ticket / PNR and photo ID', 'Phone, wallet and medication', 'Warm jacket, gloves and water'] },
  { name: 'Overnight bag', items: ['Thermals and clean socks', 'Toothbrush, wipes and sanitizer', 'Power bank, cable and light meal'] },
  { name: 'Riding luggage', items: ['Windproof shell and insulating layer', 'Insulated gloves, helmet and clear visor', 'Waterproof cover, licence and rental details'] },
]

function Preparation({ index }: { index: number }) {
  const guide = dayGuides[index]
  const next = itinerary[index + 1]
  return <div className="preparation-grid">
    {index === 0 && <section className="planner-card train-summary"><div className="planner-card-heading"><h2><Train size={18} />Ranikhet Express · 15013</h2><a href="https://enquiry.indianrail.gov.in/" target="_blank" rel="noreferrer">Check live status <ExternalLink size={13} /></a></div><div className="train-summary-route"><div><small>OLD DELHI · 8 JAN</small><strong>22:05</strong></div><span><Train size={19} /><small>Overnight · ≈7 hrs</small></span><div><small>KATHGODAM · 9 JAN</small><strong>≈05:05</strong></div></div><p>Reach Old Delhi by 20:45. Reconfirm the supplied timings, platform and coach with IRCTC / NTES. Fog may delay arrival.</p></section>}
    <Checklist key={itinerary[index].day} index={index} />
    <section className="planner-card stay-summary"><div className="planner-card-heading"><h2><BedDouble size={18} />Tonight’s stay</h2></div><h3>{guide.night}</h3><p>{guide.stayAdvice}</p><small>Stay requirements, not a confirmed booking.</small></section>
    {index === 0 && <section className="planner-card packing-summary"><div className="planner-card-heading"><h2><ListChecks size={18} />Pack in three groups</h2></div><div>{packing.map((pack) => <article key={pack.name}><h3>{pack.name}</h3><ul>{pack.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>}
    <section className="planner-card tomorrow-summary"><div className="planner-card-heading"><h2><CalendarDays size={18} />{next ? 'Prepare for tomorrow' : 'Arrival · 14 January'}</h2></div><h3>{next ? next.title : 'Back in Delhi'}</h3><p>{next ? dayGuides[index + 1].essentials.slice(0, 2).join('. ') + '.' : 'Check live arrival status before arranging a cab. Keep Thursday morning flexible for fog delays.'}</p>{next && <Link to={`/day/${next.day}`}>Open day {next.day} <ArrowRight size={14} /></Link>}</section>
    <section className="planner-card conditions-summary"><div className="planner-card-heading"><h2><ShieldAlert size={18} />Road & weather</h2></div><p>{itinerary[index].note}</p>{(index === 2 || index === 4) && <p>If the Ratapani–Munsyari stretch is closed, use the Chaukori–Kausani–Binsar fallback. A 4×4 is an option only when local operators confirm safe access.</p>}</section>
  </div>
}

export function PlannerOverview() {
  return <Layout><section className="planner-welcome"><div><span className="planner-eyebrow">YOUR WINTER ESCAPE</span><h1>Munsyari, one day<br />at a time.</h1><p>Six days. Two night trains. A clear plan for every stop.</p><Link to="/day/01">Start with day 01 <ArrowRight size={16} /></Link></div><div className="welcome-location"><MapPin size={14} />Panchachuli · Kumaon Himalaya</div></section>
    <div className="overview-stats"><div><CalendarDays /><span><small>JOURNEY</small><strong>6 days</strong></span></div><div><Bike /><span><small>INTERCITY RIDING</small><strong>≈550 km</strong></span></div><div><Train /><span><small>TRAVEL</small><strong>2 night trains</strong></span></div><div><BedDouble /><span><small>HILL STAYS</small><strong>4 nights</strong></span></div></div>
    <section className="overview-days" id="plan"><div className="planner-section-heading"><div><h2>Your day-by-day plan</h2><p>Choose a day for its schedule, route and preparation.</p></div><Link to="/route">View full route <ArrowRight size={15} /></Link></div><div className="overview-day-grid">{itinerary.map((day, index) => <motion.div key={day.day} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}><Link to={`/day/${day.day}`} className="overview-day-card"><div className="overview-day-top"><span>DAY {day.day}<small>{dayGuides[index].weekday} · {day.date}</small></span><i>{index === 0 ? <Train size={20} /> : index === 3 ? <Compass size={20} /> : <Bike size={20} />}</i></div><h3>{day.title}</h3><p>{day.route}</p><div className="overview-day-meta"><span><Route size={13} />{day.distance}</span><span><Clock3 size={13} />{day.saddle}</span></div><div className="overview-day-bottom"><span>{day.stops.length} stops · {day.stay}</span><ArrowRight size={16} /></div></Link></motion.div>)}</div></section>
    <div className="overview-bottom"><section className="planner-card"><div className="planner-card-heading"><h2><Snowflake size={18} />The one critical checkpoint</h2></div><p>Check the Ratapani–Munsyari road at Bageshwar or Thal. If snow or ice closes the final stretch, switch to the lower-hill fallback.</p><Link to="/day/03?view=prepare">See road checks <ArrowRight size={14} /></Link></section><section className="planner-card"><div className="planner-card-heading"><h2><PackageCheck size={18} />Get ready before departure</h2></div><p>Train details, overnight packing and the first morning’s bike checks are together in Day 01 preparation.</p><Link to="/day/01?view=prepare">Open preparation <ArrowRight size={14} /></Link></section></div>
  </Layout>
}

export function PlannerDay() {
  const { dayId } = useParams()
  const index = itinerary.findIndex((day) => day.day === dayId)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [copyStatus, setCopyStatus] = useState('Copy plan')
  if (index < 0) return <Navigate to="/not-found" replace />
  const day = itinerary[index]
  const guide = dayGuides[index]
  const view = ['places', 'prepare'].includes(params.get('view') || '') ? params.get('view')! : 'schedule'
  const copy = async () => {
    const text = [`Day ${day.day} · ${day.date} 2027`, day.route, ...day.stops.map((stop) => `${stop.time} · ${stop.label}\n${stop.distance} · ${stop.travel} travel · stay ${stop.stay}${stop.depart ? ` · leave ${stop.depart}` : ''}\n${stop.note}\n${stop.highlights.join('; ')}`), day.note].join('\n\n')
    try { await navigator.clipboard.writeText(text); setCopyStatus('Copied') } catch { setCopyStatus('Copy unavailable') }
  }
  return <Layout current={index}><div className="planner-day-heading"><div><Link to="/#plan" className="planner-back"><ArrowLeft size={13} />All days</Link><span className="planner-eyebrow">DAY {day.day} / {guide.weekday}, {day.date} 2027</span><h1>{day.title}</h1><p>{day.route}</p></div><div className="planner-actions"><button onClick={copy}><Copy size={14} />{copyStatus}</button><button aria-label="Print day plan" onClick={() => window.print()}><Printer size={16} /></button></div></div>
    <div className="day-quick-facts"><span><Route size={15} /><b>{day.distance}</b> planned</span><span><Clock3 size={15} /><b>{day.saddle}</b> travel</span><span><MapPin size={15} /><b>{day.stops.length}</b> stops</span><span><BedDouble size={15} /><b>{day.stay}</b></span></div>
    <nav className="planner-tabs" aria-label="Day views">{[{ id: 'schedule', label: 'Schedule & map', icon: Route }, { id: 'places', label: 'Places to visit', icon: MapPin }, { id: 'prepare', label: index === 0 ? 'Train & preparation' : 'Stay & preparation', icon: PackageCheck }].map((tab) => <button key={tab.id} aria-current={view === tab.id ? 'page' : undefined} onClick={() => setParams(tab.id === 'schedule' ? {} : { view: tab.id }, { preventScrollReset: true })}><tab.icon size={16} />{tab.label}</button>)}</nav>
    <div className="planner-view" key={view}>
      {view === 'schedule' && <div className="schedule-workspace"><DayPath key={day.day} day={day} compact /><aside className="schedule-side"><section className="planner-card day-map-card"><div className="planner-card-heading"><h2><Map size={17} />Day {day.day} route</h2><Link to="/route">Full map <ExternalLink size={12} /></Link></div><Suspense fallback={<MapPlaceholder />}><JourneyMap key={day.day} activeDay={index} initialOverview={false} onDayChange={(value) => navigate(`/day/${itinerary[value].day}`)} /></Suspense></section><section className="planner-card schedule-note"><div className="planner-card-heading"><h2><Clock3 size={17} />Plan your time</h2></div><p>{day.pacing || 'Board at Old Delhi, rest overnight and collect the bikes only after daylight. Allow for fog delays.'}</p></section><div className="schedule-alert"><ShieldAlert size={17} /><p>{day.note}</p></div></aside></div>}
      {view === 'places' && <section className="planner-places"><div className="planner-section-heading"><div><h2>Worth stopping for</h2><p>Visit windows and useful context. Optional stops are not extra commitments.</p></div></div>{guide.highlights.map((place, i) => <article className="planner-card place-row" key={place.place}><span className="place-number">0{i + 1}</span><div><small>{place.tag}</small><h3>{place.place}</h3><span className="place-duration"><Clock3 size={13} />{place.time}</span><p>{place.detail}</p><div className="place-tip">{place.tip}</div></div></article>)}</section>}
      {view === 'prepare' && <Preparation key={day.day} index={index} />}
    </div>
    <div className="planner-day-pagination">{index > 0 ? <Link to={`/day/${itinerary[index - 1].day}`}><ArrowLeft size={15} />Day {itinerary[index - 1].day}</Link> : <Link to="/"><ArrowLeft size={15} />Overview</Link>}{index < 5 ? <Link className="next" to={`/day/${itinerary[index + 1].day}`}>Next: {itinerary[index + 1].title}<ArrowRight size={15} /></Link> : <Link className="next" to="/route">Complete journey<ArrowRight size={15} /></Link>}</div>
  </Layout>
}

export function PlannerRoute() {
  const [selected, setSelected] = useState<number | null>(null)
  return <Layout><div className="planner-day-heading"><div><span className="planner-eyebrow">DELHI → MUNSYARI → DELHI</span><h1>The complete route</h1><p>Select a day to focus its route. Open its plan for stops and tasks.</p></div></div><div className="atlas-workspace"><section className="planner-card atlas-map"><Suspense fallback={<MapPlaceholder />}><JourneyMap key={selected ?? 'full'} activeDay={selected ?? 0} initialOverview={selected === null} onDayChange={setSelected} /></Suspense></section><aside className="planner-card atlas-stages"><div className="planner-card-heading"><h2>Journey stages</h2><button onClick={() => setSelected(null)}>Show all</button></div>{itinerary.map((day, index) => <div className={selected === index ? 'selected' : ''} key={day.day}><button onClick={() => setSelected(index)} aria-pressed={selected === index}><span>{day.day}</span><div><small>{day.date}</small><strong>{day.route}</strong><p>{day.distance} · {day.saddle}</p></div></button><Link to={`/day/${day.day}`}>Open day plan <ArrowRight size={13} /></Link></div>)}</aside></div></Layout>
}

export function PlannerNotFound() { return <Layout><section className="planner-empty"><Compass size={42} /><span>404 · PAGE NOT FOUND</span><h1>Let’s get back to the trip.</h1><Link to="/">Trip overview <ArrowRight size={16} /></Link></section></Layout> }
