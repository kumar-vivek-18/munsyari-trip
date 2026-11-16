import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Link, NavLink, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, BedDouble, Bike, Check, CheckCheck, ChevronRight, Clock3, Compass, Copy, ExternalLink, MapPin, MountainSnow, PackageCheck, Printer, Route, ShieldAlert, Sparkles, Sunrise, Train } from 'lucide-react'
import { itinerary } from './App'
import DayPath from './DayPath'
import { dayGuides } from './day-guides'

const JourneyMap = lazy(() => import('./JourneyMap'))

export function PageHeader() {
  return <header className="trip-header">
    <Link className="brand" to="/"><span className="brand-mark"><MountainSnow size={21} /></span><span>NORTHBOUND<small>THE WINTER FIELD GUIDE</small></span></Link>
    <nav aria-label="Main navigation"><NavLink to="/" end>Overview</NavLink><NavLink to="/route">Route atlas</NavLink><Link to="/day/01">Day guides <ArrowRight size={13} /></Link></nav>
    <span className="header-date">08—14 JAN 2027</span>
  </header>
}

export function PageFooter() {
  return <footer className="trip-footer"><Link to="/" className="footer-mark"><MountainSnow /><span>NORTHBOUND<small>SIX DAYS. A THOUSAND LITTLE MOMENTS.</small></span></Link><p>Travel windows are estimates. Conditions always come first.</p><Link to="/route">FULL JOURNEY <ArrowRight size={14} /></Link><small className="photo-credit">Panchachuli photograph: <a href="https://commons.wikimedia.org/wiki/File:Panchchuli_II.jpg">Suresh Karia</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · cropped with overlay</small></footer>
}

function MapLoading() {
  return <div className="map-loading"><span><Compass size={18} /></span><strong>Unfolding the route…</strong></div>
}

function useSavedChecks(day: string) {
  const key = `northbound-day-${day}-ready`
  const [items, setItems] = useState<number[]>(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) || '[]')
      return Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number') : []
    } catch { return [] }
  })
  const toggle = (index: number) => setItems((current) => {
    const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* Private browsing may disable storage. */ }
    return next
  })
  return { items, toggle }
}

function Readiness({ dayIndex }: { dayIndex: number }) {
  const guide = dayGuides[dayIndex]
  const day = itinerary[dayIndex]
  const { items, toggle } = useSavedChecks(day.day)
  return <div className="readiness-panel">
    <div className="readiness-heading"><PackageCheck size={22} /><div><small>BEFORE YOU GO</small><h3>Your day {day.day} checklist.</h3></div><b>{items.length}/{guide.essentials.length}</b></div>
    <div className="readiness-progress"><motion.i animate={{ width: `${items.length / guide.essentials.length * 100}%` }} /></div>
    {guide.essentials.map((item, index) => <button key={item} aria-pressed={items.includes(index)} onClick={() => toggle(index)} className={items.includes(index) ? 'done' : ''}><span>{items.includes(index) && <Check size={14} />}</span>{item}</button>)}
    <p><CheckCheck size={13} /> Saved on this device. A checklist is not a road-clearance signal.</p>
  </div>
}

function TrainBriefing() {
  const packs = [
    { title: 'On your person', items: ['Booked ticket / PNR + photo ID', 'Phone, wallet and emergency contacts', 'Essential medication', 'Warm jacket for the station'] },
    { title: 'Small overnight bag', items: ['Thermal layer, socks and gloves', 'Water and a light packed meal', 'Toothbrush, wipes and hand sanitizer', 'Charged power bank and cable'] },
    { title: 'Main riding luggage', items: ['Windproof shell + insulating layers', 'Insulated gloves and clear visor', 'Waterproof luggage cover / dry bags', 'Rental confirmation and licence'] },
  ]
  return <section className="train-briefing" id="train-prep">
    <div className="detail-section-title"><span>THE NIGHT-TRAIN BRIEFING</span><h2>Pack once.<br />Board without the scramble.</h2><p>Everything you need on the train stays separate from everything strapped to the bike tomorrow.</p></div>
    <div className="train-ticket"><div className="ticket-number"><Train /><small>OUTBOUND / FRI 08 JAN</small><strong>15013</strong><span>Ranikhet Express</span></div><div className="ticket-station"><small>OLD DELHI · DLI</small><strong>22:05</strong><span>8 January 2027</span></div><div className="ticket-line"><i /><Train size={19} /><i /><small>OVERNIGHT · ≈7 HRS</small></div><div className="ticket-station"><small>KATHGODAM · KGM</small><strong>≈05:05</strong><span>9 January · planned arrival</span></div><a href="https://enquiry.indianrail.gov.in/" target="_blank" rel="noreferrer">Check NTES <ExternalLink size={12} /></a></div>
    <p className="schedule-caveat"><ShieldAlert size={15} /> These are the supplied trip timings, not verified live schedules. Reconfirm the service, date, arrival time and platform with IRCTC / NTES. Winter fog can delay arrival.</p>
    <div className="packing-cards">{packs.map((pack, index) => <motion.article key={pack.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .09 }}><span>0{index + 1} / PACKING ZONE</span><h3>{pack.title}</h3>{pack.items.map((item) => <p key={item}><Check size={13} />{item}</p>)}</motion.article>)}</div>
    <div className="boarding-grid"><article><span>20:45—22:05</span><h3>At the station</h3><p>Arrive early, verify the departure board, locate your coach and eat before boarding. Do not rely on an assumed platform number.</p></article><article><span>ON BOARD</span><h3>Sleep, don’t unpack.</h3><p>Secure luggage, keep valuables close, charge devices safely and set an arrival alarm. Share your PNR and rental contact with your group.</p></article><article><span>AFTER ARRIVAL</span><h3>Tea before throttle.</h3><p>Freshen up, eat, inspect the bikes and wait for clear daylight. If the train runs late, simplify Day 02 rather than rushing the hills.</p></article></div>
  </section>
}

export function DayPage() {
  const { dayId } = useParams()
  const index = itinerary.findIndex((day) => day.day === dayId)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  if (index < 0) return <Navigate to="/not-found" replace />
  const day = itinerary[index]
  const guide = dayGuides[index]
  const next = itinerary[index + 1]
  const copyPlan = async () => {
    const text = [`DAY ${day.day} · ${day.date} 2027 · ${day.title}`, day.route, day.summary, ...day.stops.map((stop) => `${stop.time} · ${stop.label}\nFrom: ${stop.from || 'Start'} · ${stop.distance} · travel ${stop.travel}\nStay: ${stop.stay}${stop.depart ? ` · leave by ${stop.depart}` : ''}\n${stop.note}\nDo: ${stop.highlights.join(', ')}`), `Safety: ${day.note}`, 'All timings and distances are planning estimates.'].join('\n\n')
    try { await navigator.clipboard.writeText(text); setCopied(true) } catch { setCopied(false) }
  }

  return <main className="day-page" style={{ '--day-color': guide.color } as CSSProperties}>
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <PageHeader />
    <section className={`day-hero day-scene-${day.day}`}>
      <div className="day-hero-photo" /><div className="day-hero-topography" /><div className="day-hero-orbit" />
      <div className="day-hero-content"><Link to="/#plan" className="day-back"><ArrowLeft size={14} /> ALL SIX CHAPTERS</Link>
        <div className="day-eyebrow"><span>{guide.weekday} / {day.date} 2027</span><i /><span>{day.mode === 'rail' ? 'OVERNIGHT RAIL' : day.mode === 'local' ? 'LOCAL EXPLORATION' : 'MOUNTAIN ROAD'}</span></div>
        <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.16, 1, .3, 1] }}>{day.title}<em>{guide.focus}</em></motion.h1>
        <div className="day-hero-lower"><p>{day.summary}</p><div><a href="#day-plan">Open the day plan <ArrowDown size={15} /></a><button onClick={copyPlan}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Plan copied' : 'Copy day plan'}</button><button onClick={() => window.print()} aria-label="Print this day"><Printer size={15} /></button></div></div>
      </div><span className="day-hero-number" aria-hidden="true">{day.day}</span>
    </section>
    <div className="day-stats-bar"><div><Route /><span>PLANNED DISTANCE<strong>{day.distance}</strong></span></div><div><Clock3 /><span>TRAVEL ESTIMATE<strong>{day.saddle}</strong></span></div><div><MapPin /><span>WAYPOINTS<strong>{day.stops.length} stops</strong></span></div><div><BedDouble /><span>OVERNIGHT<strong>{day.stay}</strong></span></div></div>
    <nav className="chapter-rail" aria-label="Journey days">{itinerary.map((item) => <NavLink key={item.day} to={`/day/${item.day}`}><span>{item.day}</span><div><small>{item.date}</small><strong>{item.title}</strong></div><ChevronRight size={14} /></NavLink>)}</nav>
    <nav className="day-local-nav" aria-label="Day sections"><span>IN THIS CHAPTER</span><a href="#day-plan">Step-by-step plan</a><a href="#day-map">Route map</a><a href="#day-highlights">Famous places</a>{index === 0 && <a href="#train-prep">Train & packing</a>}<a href="#day-night">Stay & next day</a></nav>

    <section className="day-overview detail-section" id="day-plan"><div className="detail-section-title"><span>01 / THE PLAN OF THE DAY</span><h2>Every stop.<br /><em>Enough time for it.</em></h2><p>{day.pacing || 'From platform arrival to bike pickup, keep the overnight essentials accessible and the next morning flexible.'}</p></div>
      <div className="day-route-ribbon">{guide.route.map((point, routeIndex) => <span key={point}><i>{String(routeIndex + 1).padStart(2, '0')}</i>{point}{routeIndex < guide.route.length - 1 && <ArrowRight size={14} />}</span>)}</div>
      <DayPath key={day.day} day={day} />
    </section>

    {index === 0 && <div className="detail-section train-section-wrap"><TrainBriefing /></div>}

    <section className="day-map-section detail-section" id="day-map"><div className="detail-section-title horizontal"><div><span>02 / THE GEOGRAPHY</span><h2>The whole route.<br /><em>Not just the destination.</em></h2></div><p>Pan, zoom and select waypoints. Road lines are planning alignments; rail and the local circuit are indicative. Use current local advice and navigation before riding.</p></div><Suspense fallback={<MapLoading />}><JourneyMap key={day.day} activeDay={index} initialOverview={false} onDayChange={(dayIndex) => navigate(`/day/${itinerary[dayIndex].day}`)} /></Suspense></section>

    <section className="day-highlights detail-section" id="day-highlights"><div className="detail-section-title"><span>03 / MORE THAN A PIN ON THE MAP</span><h2>The places.<br /><em>The little reasons to stop.</em></h2><p>Famous sights, local flavor and practical context—clearly separated from activities that actually fit into this day.</p></div><div className="destination-grid">{guide.highlights.map((highlight, hIndex) => <motion.article key={highlight.place} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: .5, delay: hIndex * .08 }}><div className={`destination-art destination-art-${hIndex}`}><span>0{hIndex + 1}</span><MountainSnow /><small>{highlight.tag}</small><div className="destination-sun" /><div className="destination-mountain" /></div><div className="destination-copy"><span><Clock3 size={13} />{highlight.time}</span><h3>{highlight.place}</h3><p>{highlight.detail}</p><div><Sparkles size={14} /><p>{highlight.tip}</p></div></div></motion.article>)}</div></section>

    <section className="night-section detail-section" id="day-night"><div className="night-layout"><div><div className="detail-section-title"><span>04 / LAND WELL. LEAVE READY.</span><h2>Tonight, settle in.<br /><em>Tomorrow, be ready.</em></h2></div><div className="overnight-note"><BedDouble /><div><small>YOUR OVERNIGHT BASE</small><h3>{guide.night}</h3><p>{guide.stayAdvice}</p><span>Stay requirements only—not a confirmed hotel or reservation.</span></div></div><div className="next-morning"><Sunrise /><div><small>{next ? 'BEFORE SLEEP / PREPARE FOR TOMORROW' : 'ARRIVAL MORNING / THU 14 JAN'}</small><h3>{next ? `Next: ${next.title}` : 'Back in Delhi. Keep it slow.'}</h3><p>{next ? dayGuides[index + 1].essentials.slice(0, 2).join('. ') + '.' : 'Check live arrival status, arrange your cab after the train is close, and avoid an important early-morning commitment.'}</p>{next && <Link to={`/day/${next.day}`}>Preview day {next.day} <ArrowRight size={14} /></Link>}</div></div></div><Readiness key={day.day} dayIndex={index} /></div><div className="day-safety-strip"><ShieldAlert /><div><strong>THE NON-NEGOTIABLE</strong><p>{day.note}</p></div></div></section>

    <div className="chapter-pagination">{index > 0 ? <Link to={`/day/${itinerary[index - 1].day}`}><ArrowLeft /><div><small>PREVIOUS CHAPTER / {itinerary[index - 1].day}</small><strong>{itinerary[index - 1].title}</strong></div></Link> : <Link to="/"><ArrowLeft /><div><small>THE BIG PICTURE</small><strong>Journey overview</strong></div></Link>}{next ? <Link className="next" to={`/day/${next.day}`}><div><small>NEXT CHAPTER / {next.day}</small><strong>{next.title}</strong></div><ArrowRight /></Link> : <Link className="next" to="/route"><div><small>FULL CIRCLE</small><strong>The complete route</strong></div><ArrowRight /></Link>}</div>
    <PageFooter />
  </main>
}

export function RoutePage() {
  const [activeDay, setActiveDay] = useState(0)
  const [showFull, setShowFull] = useState(true)
  const selectDay = (index: number) => { setActiveDay(index); setShowFull(false) }
  return <main className="atlas-page"><PageHeader /><section className="atlas-heading detail-section"><span className="section-number">THE ROUTE ATLAS / 08—14 JAN 2027</span><h1>From city lights<br />to <em>snow lines.</em></h1><p>The complete Delhi → Kathgodam → Munsyari → Delhi journey. Explore a day on the map, then open its field guide for the timings, activities and practical details.</p><div className="atlas-summary"><span><Train size={16} />2 overnight trains</span><span><Bike size={16} />5 days in Kumaon</span><span><SnowflakeIcon />1 critical snow gate</span></div></section><section className="atlas-body detail-section"><Suspense fallback={<MapLoading />}><JourneyMap key={`${activeDay}-${showFull}`} activeDay={activeDay} initialOverview={showFull} onDayChange={selectDay} /></Suspense><div className="atlas-day-list">{itinerary.map((day, index) => <div key={day.day} className={index === activeDay ? 'selected' : ''}><button onClick={() => selectDay(index)} aria-pressed={index === activeDay}><span>{day.day}</span><div><small>{day.date}</small><strong>{day.route}</strong><p>{day.distance} · {day.saddle} travel · {day.stay}</p></div><MapPin size={17} /></button><Link to={`/day/${day.day}`}>OPEN DAY GUIDE <ArrowRight size={13} /></Link></div>)}</div><p className="atlas-disclaimer">Planning estimates are carried over from your itinerary; route-provider distances can differ, especially in mountain terrain. Recheck each leg locally. This map does not certify that a road is open, safe or snow-free.</p></section><PageFooter /></main>
}

function SnowflakeIcon() { return <MountainSnow size={16} /> }

export function NotFound() {
  return <main className="not-found"><PageHeader /><section><Compass size={50} /><span>OFF THE PLANNED ROUTE / 404</span><h1>Let’s get you<br />back on the road.</h1><Link to="/">Journey overview <ArrowRight size={17} /></Link></section><PageFooter /></main>
}

export function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const day = itinerary.find((item) => pathname === `/day/${item.day}`)
    document.title = day ? `Day ${day.day} · ${day.title} — Northbound` : pathname === '/route' ? 'Route Atlas — Northbound' : 'Munsyari — The Winter Run'
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}
