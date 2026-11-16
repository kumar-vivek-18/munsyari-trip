import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Bike,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CloudSnow,
  Compass,
  Fuel,
  MountainSnow,
  ShieldAlert,
  Snowflake,
  Sparkles,
  Sunrise,
  ThermometerSnowflake,
  Train,
  Route,
  X,
} from 'lucide-react'

const JourneyMap = lazy(() => import('./JourneyMap'))

type Day = {
  day: string
  date: string
  title: string
  route: string
  distance: string
  saddle: string
  stay: string
  theme: string
  summary: string
  stops: {
    time: string
    label: string
    note: string
    from?: string
    distance: string
    travel: string
    stay: string
    depart?: string
    visit?: 'Full visit' | 'Meal / rest' | 'Safety stop' | 'Overnight' | 'Optional visit'
    highlights: string[]
  }[]
  coords: { x: number; y: number }
  mode: 'rail' | 'bike' | 'local'
  note: string
  pacing?: string
}

const itinerary: Day[] = [
  {
    day: '01',
    date: '08 JAN',
    title: 'Night to the Hills',
    route: 'Old Delhi → Kathgodam',
    distance: '277 km',
    saddle: '7 hrs',
    stay: 'Night train',
    theme: 'The journey begins on the rails',
    summary: 'Board the Ranikhet Express at Old Delhi and sleep your way toward Kumaon. Keep warm layers accessible and expect possible winter-fog delays.',
    stops: [
      { time: '20:45', label: 'Old Delhi Station', note: 'Arrive early; confirm platform and coach.', distance: 'START', travel: 'Check-in', stay: '1 hr 20 min', highlights: ['Dinner packed', 'Water refill', 'Coach check'] },
      { time: '22:05', label: 'Ranikhet Express 15013', note: 'Settle in for the overnight run to Kumaon.', from: 'Old Delhi', distance: '≈277 km', travel: '≈7 hrs', stay: 'Overnight', highlights: ['Secure luggage', 'Keep thermals handy', 'Set an arrival alarm'] },
      { time: '≈05:05', label: 'Kathgodam Station', note: 'Fog may delay arrival—do not rush into darkness.', from: 'Old Delhi', distance: '≈277 km', travel: 'Overnight rail', stay: '≈1 hr 45 min', highlights: ['Station chai', 'Freshen up', 'Check visibility'] },
      { time: '07:00', label: 'Bike pickup', note: 'Inspect every contact point before loading luggage.', from: 'Kathgodam Station', distance: 'Local', travel: '10–15 min', stay: '≈1 hr', highlights: ['Tyres & brakes', 'Documents', 'Luggage balance'] },
    ],
    coords: { x: 8, y: 90 },
    mode: 'rail',
    note: 'Fog can delay the train—keep the first riding morning flexible.',
  },
  {
    day: '02',
    date: '09 JAN',
    title: 'Through Kumaon',
    route: 'Kathgodam → Bageshwar',
    distance: '160 km',
    saddle: '7 hrs',
    stay: 'Bageshwar',
    theme: 'Lakes, pines & river valleys',
    summary: 'Make Kainchi Dham the main visit, with a full two-hour window. Ride directly there from Kathgodam, then stop in Almora for lunch—not another sightseeing circuit.',
    stops: [
      { time: '07:00', label: 'Kathgodam', note: 'Breakfast, bike inspection and fuel before the 8 AM departure; wait if fog persists.', distance: 'START', travel: 'Preparation', stay: '1 hr', depart: '08:00', visit: 'Meal / rest', highlights: ['Warm breakfast', 'Full tank', 'Tyres & luggage'] },
      { time: '09:00', label: 'Kainchi Dham', note: 'Allow 1.5–2 hours for parking, walking, queues, darshan and a quiet visit. Two hours are reserved here; opening and queue conditions need a local check.', from: 'Kathgodam', distance: '≈35 km', travel: '≈1 hr', stay: '1.5–2 hrs', depart: '11:00', visit: 'Full visit', highlights: ['Neem Karoli Baba Ashram', 'Unhurried darshan', 'Parking & queue buffer'] },
      { time: '13:00', label: 'Almora', note: 'A seated lunch and stretch break. Skip Kasar Devi and market sightseeing on this transfer day.', from: 'Kainchi Dham', distance: '≈48 km', travel: '≈2 hrs', stay: '30 min', depart: '13:30', visit: 'Meal / rest', highlights: ['Lunch', 'Bal Mithai takeaway', 'Water refill'] },
      { time: '16:30–17:00', label: 'Bageshwar', note: 'Check in and rest first. Temple and Sangam visits are for the next morning, not a rushed dusk arrival.', from: 'Almora', distance: '≈70 km', travel: '≈3–3.5 hrs', stay: 'Overnight', visit: 'Overnight', highlights: ['Hotel check-in', 'Road-status call', 'Dinner & rest'] },
    ],
    coords: { x: 17, y: 83 },
    mode: 'bike',
    note: 'If fog or queues delay departure, drop optional stops or halt earlier—never recover time by riding after dark.',
    pacing: 'Kainchi gets 09:00–11:00. Bhimtal is saved for the return or a future visit; Kasar Devi is not scheduled. This is still a tight transfer day, with only a small daylight margin.',
  },
  {
    day: '03',
    date: '10 JAN',
    title: 'The Snow Gate',
    route: 'Bageshwar → Thal → Munsyari',
    distance: '115 km',
    saddle: '6 hrs',
    stay: 'Munsyari',
    theme: 'The decisive final climb',
    summary: 'Fill up at Thal, ask locals about the road, and continue through Ratapani only when the final stretch is clear of snow and ice.',
    stops: [
      { time: '07:00', label: 'Bageshwar', note: 'Allow 45–60 minutes for Baghnath Temple and the Sangam if open and accessible, then breakfast and checkout.', distance: 'START', travel: 'Local on foot', stay: '1.5 hrs', depart: '08:30', visit: 'Full visit', highlights: ['Baghnath Temple', 'Saryu–Gomti Sangam', 'Breakfast & road call'] },
      { time: '10:30', label: 'Thal', note: 'Reserve a full hour for fuel, a warm meal and local road advice. Ek Hathiya Deval is not included in this halt.', from: 'Bageshwar', distance: '≈62 km', travel: '≈2 hrs', stay: '1 hr', depart: '11:30', visit: 'Meal / rest', highlights: ['Fill the tank', 'Lunch / warm meal', 'Ask local drivers'] },
      { time: '12:45', label: 'Birthi Falls', note: 'Allow time for the viewpoint and tea. Skip the approach walk if steps or spray are icy; a full waterfall walk is not assumed.', from: 'Thal', distance: '≈29 km', travel: '≈1 hr 15 min', stay: '45 min', depart: '13:30', visit: 'Optional visit', highlights: ['Safe viewpoint', 'Hot tea', 'No icy steps'] },
      { time: '14:15', label: 'Ratapani', note: 'Safety assessment, not a sightseeing halt. Turn back if grip or local advice is unfavorable.', from: 'Birthi Falls', distance: '≈14 km', travel: '≈45 min', stay: '15 min', depart: '14:30', visit: 'Safety stop', highlights: ['Road inspection', 'Local vehicle check', 'Go / no-go call'] },
      { time: '15:15–15:30', label: 'Munsyari', note: 'Reserve an hour for check-in, warming up and unpacking. Keep any market walk close to the hotel.', from: 'Ratapani', distance: '≈17 km', travel: '≈45–60 min', stay: 'Overnight', visit: 'Overnight', highlights: ['Check-in & warm up', 'Panchachuli view', 'Early dinner'] },
    ],
    coords: { x: 41, y: 61 },
    mode: 'bike',
    note: 'The Ratapani road-status check is the day’s go/no-go decision.',
    pacing: 'Baghnath + Sangam: 45–60 min; Thal meal/fuel: 60 min; Birthi viewpoint: 45 min. Remove the Birthi visit first if running late.',
  },
  {
    day: '04',
    date: '11 JAN',
    title: 'High Country',
    route: 'Munsyari · Slow local day',
    distance: '≈60–70 km',
    saddle: 'Flexible',
    stay: 'Munsyari',
    theme: 'A day beneath Panchachuli',
    summary: 'Give Madkot, Nanda Devi Temple and the museum real visiting time. A full Khaliya Top trek is an alternative day plan—not another stop to squeeze into this circuit.',
    stops: [
      { time: '07:30', label: 'Munsyari breakfast', note: 'Enjoy the mountain light from near the hotel; no pre-dawn bike transfer.', distance: 'START', travel: 'Local on foot', stay: '1 hr', depart: '08:30', visit: 'Meal / rest', highlights: ['Panchachuli view', 'Kumaoni breakfast', 'Check local conditions'] },
      { time: '09:30', label: 'Madkot Hot Springs', note: 'Two hours for access, a relaxed visit and a meal. Confirm access and safe bathing conditions locally; carry a towel and dry layers.', from: 'Munsyari', distance: '≈22 km', travel: '≈1 hr', stay: '2 hrs', depart: '11:30', visit: 'Full visit', highlights: ['Thermal spring', 'Gori Ganga valley', 'Unhurried meal'] },
      { time: '12:30', label: 'Nanda Devi Temple', note: 'An hour for the temple, photographs and a quiet walk. Confirm visiting hours locally.', from: 'Madkot', distance: '≈22 km', travel: '≈1 hr', stay: '1 hr', depart: '13:30', visit: 'Full visit', highlights: ['Temple', 'Panchachuli backdrop', 'Village walk'] },
      { time: '13:45', label: 'Tribal Heritage Museum', note: 'Allow 75 minutes for the exhibits and stories, subject to opening hours. Leave the next hour as a tea/rest buffer.', from: 'Nanda Devi Temple', distance: '≈3 km', travel: '≈15 min', stay: '1 hr 15 min', depart: '15:00', visit: 'Full visit', highlights: ['Bhotiya heritage', 'Johar trade routes', 'Local crafts'] },
      { time: '16:00', label: 'Betulidhar', note: 'A 30-minute late-afternoon viewpoint stop, then return to the hotel by about 5 PM. Do not wait for sunset if it means riding back in darkness.', from: 'Museum / town', distance: '≈8 km', travel: '≈30 min after rest', stay: '30 min', depart: '16:30', visit: 'Optional visit', highlights: ['Afternoon panorama', 'Mountain photographs', 'Daylight return'] },
    ],
    coords: { x: 74, y: 25 },
    mode: 'local',
    note: 'Khaliya Top replaces this circuit: reserve most of the daylight day, confirm conditions and guide advice, and never promise the summit in icy weather.',
    pacing: 'Madkot: 2 hrs; temple: 1 hr; museum: 75 min. Khaliya is a separate choose-instead option, not a 2.5-hour sunrise add-on.',
  },
  {
    day: '05',
    date: '12 JAN',
    title: 'Turn South',
    route: 'Munsyari → Kausani',
    distance: '155 km',
    saddle: '7 hrs',
    stay: 'Kausani',
    theme: 'Long descent, early start',
    summary: 'Start after the sun reaches the road to reduce black-ice risk, then descend through Thal and Bageshwar. This is the longest riding day.',
    stops: [
      { time: '08:00', label: 'Munsyari', note: 'Breakfast and checkout before the target departure; leave only when road conditions allow.', distance: 'START', travel: 'Preparation', stay: '1 hr', depart: '09:00', visit: 'Meal / rest', highlights: ['Warm breakfast', 'Pack & check out', 'Ice-status check'] },
      { time: '12:00', label: 'Thal', note: 'Combine lunch, fuel and warming up in one proper halt.', from: 'Munsyari', distance: '≈68 km', travel: '≈3 hrs', stay: '1 hr', depart: '13:00', visit: 'Meal / rest', highlights: ['Seated lunch', 'Fuel', 'Warm-up break'] },
      { time: '14:45', label: 'Bageshwar', note: 'A rest stop only; the temple visit was allocated earlier in the trip.', from: 'Thal', distance: '≈48 km', travel: '≈1 hr 45 min', stay: '15 min', depart: '15:00', visit: 'Meal / rest', highlights: ['Water refill', 'Stretch', 'Check daylight margin'] },
      { time: '15:45', label: 'Baijnath', note: 'A proper temple visit needs 45–60 minutes. Default is to pass through; visit only if the route is running at least 30 minutes early.', from: 'Bageshwar', distance: '≈20 km', travel: '≈45 min', stay: '45–60 min if early', visit: 'Optional visit', highlights: ['Historic temple complex', 'Gomti riverside', 'Skip if behind schedule'] },
      { time: '16:30–17:00', label: 'Kausani', note: 'Arrival target assumes no Baijnath visit. Check in and rest; Anasakti Ashram is planned for the next morning.', from: 'Baijnath side', distance: '≈18 km', travel: '≈40 min', stay: 'Overnight', visit: 'Overnight', highlights: ['Hotel check-in', 'Nearby mountain view', 'Dinner & rest'] },
    ],
    coords: { x: 57, y: 53 },
    mode: 'bike',
    note: 'Start only after sunlight reaches the road and softens black-ice risk.',
    pacing: 'This is a transfer day, not a temple circuit. Reserve 60 minutes at Thal; Baijnath needs a real 45–60-minute visit and is omitted unless you are early.',
  },
  {
    day: '06',
    date: '13 JAN',
    title: 'Down to the Rails',
    route: 'Kausani → Kathgodam',
    distance: '120 km',
    saddle: '5 hrs',
    stay: 'Night train',
    theme: 'A calm final descent',
    summary: 'Give Kausani an early local visit, then descend via Almora. A second Kainchi visit gets a real two-hour window if the road day stays on time; do not add Bhimtal as well.',
    stops: [
      { time: '06:30', label: 'Kausani', note: 'Allow 45–60 minutes at the nearby viewpoint / Anasakti Ashram if open, then breakfast and checkout. No tea-estate detour.', distance: 'START', travel: 'Local on foot', stay: '1.5 hrs', depart: '08:00', visit: 'Full visit', highlights: ['Himalayan morning view', 'Anasakti Ashram if open', 'Breakfast & checkout'] },
      { time: '10:30', label: 'Almora', note: 'A half-hour meal break, not a Lala Bazaar shopping circuit. If fog delayed the start, omit the repeat Kainchi visit.', from: 'Kausani', distance: '≈55 km', travel: '≈2.5 hrs', stay: '30 min', depart: '11:00', visit: 'Meal / rest', highlights: ['Meal break', 'Bal Mithai takeaway', 'Stretch'] },
      { time: '12:45', label: 'Kainchi Dham', note: 'Optional repeat visit with a full two-hour allowance. If you arrive late or queues are long, skip this repeat—not the bike-return buffer. Bhimtal is an alternative 1-hour lake stop, never an additional visit.', from: 'Almora', distance: '≈48 km', travel: '≈1 hr 45 min', stay: '1.5–2 hrs', depart: '14:45', visit: 'Optional visit', highlights: ['Unhurried darshan', 'Parking & queues', 'Or Bhimtal instead'] },
      { time: '16:00', label: 'Kathgodam', note: 'Reserve about an hour for bike handover, deposit paperwork and repacking; use the remaining time for dinner and the station.', from: 'Kainchi Dham', distance: '≈35 km', travel: '≈1 hr 15 min', stay: '≈4 hrs', visit: 'Meal / rest', highlights: ['Bike return & deposit', 'Early dinner', 'Station by 19:45'] },
      { time: '20:35', label: 'Ranikhet Express', note: 'Board the overnight return with a comfortable buffer.', from: 'Kathgodam', distance: '≈277 km', travel: '≈7 hrs', stay: 'Overnight', highlights: ['Confirm coach', 'Secure luggage', 'Share trip photos'] },
      { time: 'EARLY 14 JAN', label: 'Old Delhi', note: 'Journey complete—avoid scheduling an early commitment.', from: 'Kathgodam', distance: '≈277 km', travel: 'Overnight rail', stay: 'Trip complete', highlights: ['Breakfast', 'Cab home', 'Rest day'] },
    ],
    coords: { x: 24, y: 79 },
    mode: 'bike',
    note: 'Protect the 4 PM bike-return target and keep a generous rail buffer.',
    pacing: 'Kausani local visit: 45–60 min plus breakfast. Return Kainchi: 12:45–14:45 only if on time. No rushed 30-minute temple visit; no stacked Bhimtal detour.',
  },
]

const checklist = [
  ['Thermal base + mid layer', 'Warmth'],
  ['Windproof riding shell', 'Weather'],
  ['Insulated waterproof gloves', 'Hands'],
  ['Clear visor / anti-fog insert', 'Vision'],
  ['Tyre tread + brake inspection', 'Bike'],
  ['Offline maps + power bank', 'Navigation'],
]

const nodePositions = {
  3: [{ x: 17, y: 20 }, { x: 84, y: 50 }, { x: 17, y: 80 }],
  4: [{ x: 16, y: 20 }, { x: 84, y: 20 }, { x: 16, y: 80 }, { x: 84, y: 80 }],
  5: [{ x: 15, y: 17 }, { x: 85, y: 17 }, { x: 13, y: 76 }, { x: 50, y: 84 }, { x: 87, y: 76 }],
  6: [{ x: 14, y: 16 }, { x: 50, y: 15 }, { x: 86, y: 16 }, { x: 14, y: 82 }, { x: 50, y: 84 }, { x: 86, y: 82 }],
}

function DayMindMap({ day }: { day: Day }) {
  const [selectedStop, setSelectedStop] = useState(0)
  useEffect(() => setSelectedStop(0), [day.day])
  const positions = nodePositions[day.stops.length as keyof typeof nodePositions] ?? nodePositions[4]
  const modeIcon = day.mode === 'rail' ? <Train size={24} /> : day.mode === 'local' ? <Compass size={24} /> : <Bike size={24} />
  const selected = day.stops[selectedStop]

  return (
    <AnimatePresence mode="wait">
      <motion.div className="mind-map" key={day.day} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .4 }}>
        <div className="mind-map-topline">
          <span>{day.theme}</span>
          <div><i /> TAP ANY NODE TO EXPLORE</div>
        </div>
        {day.pacing && <div className="day-pacing"><Clock3 size={20} /><div><strong>TIME TO ACTUALLY BE THERE</strong><p>{day.pacing}</p><small>Planning windows, not guarantees. Verify opening hours, queues and winter road conditions locally.</small></div></div>}
        <div className="mind-canvas">
          <svg className="mind-connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {day.stops.map((_, index) => {
              const pos = positions[index]
              return <motion.path key={index} d={`M 50 50 Q ${(50 + pos.x) / 2} ${pos.y < 50 ? pos.y + 12 : pos.y - 12} ${pos.x} ${pos.y}`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .7, delay: index * .1 }} />
            })}
          </svg>
          <motion.div className="mind-center" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: .15 }}>
            <div className="mind-mode">{modeIcon}<span>{day.mode}</span></div>
            <small>DAY {day.day} · {day.date}</small>
            <h3>{day.title}</h3>
            <p>{day.route}</p>
            <div className="mind-center-stats"><span>{day.distance}<small>DISTANCE</small></span><span>{day.saddle}<small>TRAVEL</small></span><span>{day.stay}<small>NIGHT</small></span></div>
          </motion.div>
          {day.stops.map((stop, index) => {
            const pos = positions[index]
            return (
              <motion.button
                key={`${stop.time}-${stop.label}`}
                className={`mind-node ${selectedStop === index ? 'active' : ''}`}
                style={{ '--x': `${pos.x}%`, '--y': `${pos.y}%`, '--delay': `${index * .08}s` } as CSSProperties}
                initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: .2 + index * .1 }}
                onClick={() => setSelectedStop(index)}
              >
                <span className="mind-node-index">{String(index + 1).padStart(2, '0')}</span>
                {stop.visit && <span className={`visit-type ${stop.visit === 'Optional visit' ? 'optional' : ''}`}>{stop.visit}</span>}
                <time>{stop.time}</time>
                <strong>{stop.label}</strong>
                <div className="mind-node-meta"><span>{stop.distance}</span><span>{stop.travel}</span></div>
                <small>Stay: {stop.stay}</small>
                {stop.depart && <small className="node-depart">Leave by {stop.depart}</small>}
                <i className="mind-node-pulse" />
              </motion.button>
            )
          })}
        </div>
        <div className="mind-inspector">
          <div className="inspector-place"><span>SELECTED STOP / {String(selectedStop + 1).padStart(2, '0')}</span><strong>{selected?.label}</strong><p>{selected?.note}</p></div>
          <div className="inspector-leg"><span>INCOMING LEG</span><strong>{selected?.from ? `${selected.from} → ${selected.label}` : 'Day starting point'}</strong><div><b><Route size={13} /> {selected?.distance}</b><b><Clock3 size={13} /> {selected?.travel}</b><b>HALT · {selected?.stay}</b>{selected?.depart && <b>LEAVE BY · {selected.depart}</b>}</div></div>
          <div className="inspector-highlights"><span><Sparkles size={12} /> DO NOT MISS</span><div>{selected?.highlights.map((highlight) => <b key={highlight}>{highlight}</b>)}</div></div>
          <div className="mind-warning"><ShieldAlert size={16} /> {day.note}</div>
        </div>
        <div className="roadbook">
          <div className="roadbook-heading"><div><span>DETAILED DAY ROADBOOK</span><strong>Point-to-point plan</strong></div><p>{day.stops.length} STOPS · OPTIONAL VISITS ARE NOT CUMULATIVE</p></div>
          <div className="roadbook-grid">
            {day.stops.map((stop, index) => (
              <motion.button key={`${stop.label}-roadbook`} className={selectedStop === index ? 'active' : ''} onClick={() => setSelectedStop(index)} whileHover={{ y: -3 }}>
                <div className="roadbook-card-top"><span>{String(index + 1).padStart(2, '0')}</span><time>{stop.time}</time></div>
                {stop.visit && <span className={`visit-type ${stop.visit === 'Optional visit' ? 'optional' : ''}`}>{stop.visit}</span>}
                <h4>{stop.label}</h4>
                <div className="roadbook-leg"><small>{stop.from ? `FROM ${stop.from}` : 'DAY START'}</small><div><b>{stop.distance}</b><i /><b>{stop.travel}</b></div></div>
                <p>{stop.note}</p>
                <div className="roadbook-stay"><Clock3 size={13} /><span>Planned halt</span><strong>{stop.stay}</strong></div>
                {stop.depart && <div className="roadbook-depart"><ArrowRight size={13} /><span>Next-leg departure</span><strong>{stop.depart}</strong></div>}
                <div className="roadbook-do"><span>DO HERE</span>{stop.highlights.map((highlight) => <i key={highlight}><Check size={11} />{highlight}</i>)}</div>
              </motion.button>
            ))}
          </div>
          <p className="roadbook-disclaimer">Distances and driving times are approximate. Arrival windows depend on the previous halt and road conditions; longer visits require dropping optional stops, not riding faster or after dark.</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [activeDay, setActiveDay] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [checked, setChecked] = useState<number[]>([0, 1, 4])
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 130])
  const active = itinerary[activeDay]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <nav className="nav">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Back to top">
          <span className="brand-mark"><MountainSnow size={21} /></span>
          <span>NORTHBOUND<small>WINTER RUN / 06</small></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollTo('route')}>Route</button>
          <button onClick={() => scrollTo('plan')}>Itinerary</button>
          <button onClick={() => scrollTo('snow')}>Snow protocol</button>
          <button className="nav-cta" onClick={() => scrollTo('kit')}>Pack smart <ArrowRight size={15} /></button>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <span><i /><i /></span>}
        </button>
      </nav>

      <section className="hero" id="top">
        <motion.div className="hero-image" style={{ y: heroY }} />
        <div className="hero-grain" />
        <div className="hero-content">
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}>
            <span className="signal"><i /></span> 8–14 January 2027 · Kumaon Himalaya
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .25, ease: [0.16, 1, 0.3, 1] }}>
            The winter<br /><span>run to Munsyari.</span>
          </motion.h1>
          <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }}>
            <div className="hero-intro">
              <p>Six stages from the Old Delhi night train to the high Himalayan road. One snow-sensitive climb. Every move built around daylight.</p>
              <button onClick={() => scrollTo('route')}>Explore the route <ArrowDown size={16} /></button>
            </div>
            <div className="weather-card">
              <div><Snowflake size={17} /><span>SNOW WINDOW</span><strong>Ratapani → Munsyari</strong></div>
              <div className="temp"><small>EXPECTED</small><strong>9°</strong><span>/ −5°C</span></div>
            </div>
          </motion.div>
        </div>
        <div className="hero-index"><span>30.067° N</span><span>80.238° E</span></div>
      </section>

      <section className="fact-strip">
        <div><span>01</span><strong>≈550 km</strong><small>INTERCITY RIDING</small></div>
        <div><span>02</span><strong>6 days</strong><small>06 JOURNEY STAGES</small></div>
        <div><span>03</span><strong>2,200 m</strong><small>TOP ELEVATION</small></div>
        <div className="risk-fact"><span>04</span><strong>17 km</strong><small>SNOW-RISK ZONE</small></div>
      </section>

      <section className="route-section section" id="route">
        <div className="section-heading">
          <div><span className="section-number">01 / ROUTE</span><h2>Follow the<br />mountain rhythm.</h2></div>
          <p>Explore the complete journey from Old Delhi to Munsyari and back. Select any rail or bike leg to isolate that day on the live map.</p>
        </div>
        <Suspense fallback={<div className="map-loading"><span><Compass size={18} /></span><strong>Loading the complete journey map…</strong></div>}>
          <JourneyMap activeDay={activeDay} onDayChange={setActiveDay} />
        </Suspense>
      </section>

      <section className="itinerary-section section" id="plan">
        <div className="section-heading compact">
          <div><span className="section-number light">02 / ITINERARY</span><h2>Six stages.<br />One connected story.</h2></div>
          <div className="day-progress"><span>DAY {active.day}</span><div><motion.i animate={{ width: `${((activeDay + 1) / itinerary.length) * 100}%` }} /></div><small>06</small></div>
        </div>
        <div className="day-tabs">
          {itinerary.map((item, index) => (
            <button key={item.day} className={index === activeDay ? 'active' : ''} onClick={() => setActiveDay(index)}>
              <span>{item.day}</span><small>{item.date}</small>
            </button>
          ))}
        </div>
        <DayMindMap day={active} />
      </section>

      <section className="snow-section section" id="snow">
        <div className="snow-heading">
          <div className="snow-icon"><Snowflake /></div>
          <span className="section-number">03 / THE DECISION</span>
          <h2>Respect the<br /><em>last seventeen.</em></h2>
          <p>Ratapani to Munsyari is the variable. Snow may be absent—or the road may close overnight. Make the decision with local information, not optimism.</p>
        </div>
        <div className="decision-grid">
          <motion.div className="decision-card go" whileHover={{ y: -7 }}>
            <div className="decision-title"><span><Check size={17} /> ROAD OPEN</span><strong>GO</strong></div>
            <h3>Ride in the clean window.</h3>
            <ul>
              <li>Leave Thal only after sunrise</li>
              <li>Ask locals about shaded ice patches</li>
              <li>Turn around if grip becomes uncertain</li>
            </ul>
            <div className="decision-meta"><Sunrise size={17} /> Ideal roll-out: 7:30–8:00 AM</div>
          </motion.div>
          <motion.div className="decision-card no-go" whileHover={{ y: -7 }}>
            <div className="decision-title"><span><X size={17} /> ROAD CLOSED</span><strong>NO-GO</strong></div>
            <h3>Don’t negotiate with ice.</h3>
            <ul>
              <li>Do not push through on rental bikes</li>
              <li>Pivot to Chaukori, Kausani & Binsar</li>
              <li>Use a 4×4 if heavy snow is forecast</li>
            </ul>
            <div className="decision-meta"><ShieldAlert size={17} /> The fallback is part of the plan</div>
          </motion.div>
        </div>
        <div className="callout-row">
          <div><span>01</span><strong>CALL AHEAD</strong><p>Hotel or tourist office at Bageshwar / Thal.</p></div>
          <ChevronRight />
          <div><span>02</span><strong>CHECK FORECAST</strong><p>Review the next 48–72 hours, not just today.</p></div>
          <ChevronRight />
          <div><span>03</span><strong>MAKE THE CALL</strong><p>Before unpacking, fueling or committing uphill.</p></div>
        </div>
      </section>

      <section className="fallback-section section">
        <div className="fallback-copy">
          <span className="section-number">PLAN B / STILL BEAUTIFUL</span>
          <h2>Snowed out?<br />Loop the lower hills.</h2>
          <p>The backup route trades the high pass for cedar forests, ridge sunsets and less exposed roads. It isn’t a consolation prize.</p>
          <div className="fallback-route">
            <span>THAL</span><ArrowRight /><span>CHAUKORI</span><ArrowRight /><span>KAUSANI</span><ArrowRight /><span>BINSAR</span>
          </div>
        </div>
        <div className="fallback-art">
          <div className="sun-disc" />
          <svg viewBox="0 0 700 450" preserveAspectRatio="none"><path d="M0 390 L110 230 L190 320 L310 135 L390 275 L500 165 L700 385 V450 H0Z" /><path d="M0 420 L160 310 L275 390 L430 250 L565 345 L700 285 V450 H0Z" /></svg>
          <div className="fallback-label"><small>LOWER ALTITUDE LOOP</small><strong>~280 km</strong><span>2–3 DAYS</span></div>
        </div>
      </section>

      <section className="kit-section section" id="kit">
        <div className="section-heading">
          <div><span className="section-number">04 / WINTER KIT</span><h2>Cold-ready.<br />Road-ready.</h2></div>
          <p>January riding is mostly about managing windchill, visibility and grip. Tap to build your pre-departure check.</p>
        </div>
        <div className="kit-layout">
          <div className="checklist">
            {checklist.map(([label, category], index) => {
              const isChecked = checked.includes(index)
              return <button key={label} onClick={() => setChecked((items) => isChecked ? items.filter((x) => x !== index) : [...items, index])} className={isChecked ? 'checked' : ''}>
                <span className="check-box">{isChecked && <Check size={15} />}</span><strong>{label}</strong><small>{category}</small>
              </button>
            })}
            <div className="check-progress"><span>{checked.length} / {checklist.length} ready</span><div><motion.i animate={{ width: `${(checked.length / checklist.length) * 100}%` }} /></div></div>
          </div>
          <div className="rules-grid">
            <div className="rule-card"><ThermometerSnowflake /><span>01</span><h3>Layer, don’t bulk.</h3><p>Thermal base, insulating mid-layer, then a windproof shell.</p></div>
            <div className="rule-card"><Bike /><span>02</span><h3>Inspect the contact.</h3><p>Tell the rental shop it’s a January run. Demand healthy tyres and brakes.</p></div>
            <div className="rule-card"><CloudSnow /><span>03</span><h3>Never chase dusk.</h3><p>No fog, no night riding. Sunset is around 5:30 PM in January.</p></div>
            <div className="rule-card"><Fuel /><span>04</span><h3>Top up in Thal.</h3><p>Fuel whenever you can and carry a practical range buffer.</p></div>
          </div>
        </div>
      </section>

      <section className="rail-note">
        <div className="rail-icon"><Train /></div>
        <div><span className="section-number light">RAIL NOTES</span><h2>Book the ends.<br />Keep the middle flexible.</h2></div>
        <div className="rail-copy"><p>Ranikhet Express 15013 departs Old Delhi at 10:05 PM on Fri 8 Jan. The return leaves Kathgodam at 8:35 PM on Wed 13 Jan and reaches Delhi early Thu 14 Jan.</p><span><CalendarDays size={16} /> Winter fog can delay either service</span></div>
      </section>

      <footer>
        <div className="footer-mark"><MountainSnow /><span>NORTHBOUND<small>MUNSYARI / WINTER 06</small></span></div>
        <p>Built for the road. Flexible for the mountain. · Hero: Suresh Karia / <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></p>
        <button onClick={() => scrollTo('top')}>BACK TO TOP <ArrowRight size={14} /></button>
      </footer>
    </main>
  )
}

export default App
