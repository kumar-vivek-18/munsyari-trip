import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Bike,
  CalendarDays,
  Check,
  ChevronRight,
  CloudSnow,
  Compass,
  Fuel,
  MountainSnow,
  ShieldAlert,
  Snowflake,
  Sunrise,
  ThermometerSnowflake,
  Train,
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
  stops: { time: string; label: string; note: string }[]
  coords: { x: number; y: number }
  mode: 'rail' | 'bike' | 'local'
  note: string
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
      { time: '20:45', label: 'Old Delhi Station', note: 'Arrive early; platform and coach check' },
      { time: '22:05', label: 'Ranikhet Express 15013', note: 'Overnight train to Kathgodam' },
      { time: '05:05', label: 'Kathgodam', note: 'Expected arrival; wait for daylight' },
      { time: '07:00', label: 'Bike pickup', note: 'Tea, inspection and luggage setup' },
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
    summary: 'Wait for daylight, collect the bikes, and ease into the hills via Bhimtal, Kainchi Dham and Almora. Reach Bageshwar before dusk.',
    stops: [
      { time: '07:00', label: 'Kathgodam', note: 'Tea, bike check, wait for clear light' },
      { time: '10:00', label: 'Bhimtal / Kainchi', note: 'Easy first break' },
      { time: '13:00', label: 'Almora', note: 'Breakfast-lunch stop' },
      { time: '17:00', label: 'Bageshwar', note: 'Check in; confirm road status' },
    ],
    coords: { x: 17, y: 83 },
    mode: 'bike',
    note: 'No riding in darkness or morning fog. Reach Bageshwar by 5:30 PM.',
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
      { time: '08:30', label: 'Bageshwar', note: 'Leave in full daylight' },
      { time: '10:30', label: 'Thal', note: 'Last reliable fuel + local intel' },
      { time: '12:30', label: 'Ratapani', note: 'Proceed only on a clean road' },
      { time: '15:30', label: 'Munsyari', note: 'Check in before temperatures fall' },
    ],
    coords: { x: 41, y: 61 },
    mode: 'bike',
    note: 'The Ratapani road-status check is the day’s go/no-go decision.',
  },
  {
    day: '04',
    date: '11 JAN',
    title: 'High Country',
    route: 'Munsyari · Local circuit',
    distance: '~40 km',
    saddle: 'Flexible',
    stay: 'Munsyari',
    theme: 'A day beneath Panchachuli',
    summary: 'Keep the day flexible around trail and road conditions: Khaliya Top, Madkot hot springs, local heritage, and a Betulidhar sunset.',
    stops: [
      { time: 'SUNRISE', label: 'Khaliya Top', note: 'Only if the trail is not iced over' },
      { time: '11:00', label: 'Madkot', note: 'Hot springs' },
      { time: '14:30', label: 'Nanda Devi + Museum', note: 'Temple and Tribal Heritage Museum' },
      { time: '17:00', label: 'Betulidhar', note: 'Sunset, then back before dark' },
    ],
    coords: { x: 74, y: 25 },
    mode: 'local',
    note: 'Skip Khaliya Top if the trail is iced—conditions outrank the checklist.',
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
      { time: '09:00', label: 'Munsyari', note: 'Roll after sunlight reaches the road' },
      { time: '12:00', label: 'Thal', note: 'Fuel + warm drink' },
      { time: '14:30', label: 'Bageshwar', note: 'Lunch and final push' },
      { time: '17:00', label: 'Kausani', note: 'Check in before dark' },
    ],
    coords: { x: 57, y: 53 },
    mode: 'bike',
    note: 'Start only after sunlight reaches the road and softens black-ice risk.',
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
    summary: 'Start after the fog lifts, descend via Almora and Bhimtal, then return the bikes by 4 PM for a generous station buffer.',
    stops: [
      { time: '08:30', label: 'Kausani', note: 'Unhurried departure' },
      { time: '11:30', label: 'Almora', note: 'Warm break' },
      { time: '14:00', label: 'Kainchi / Bhimtal', note: 'Last hill stop' },
      { time: '16:00', label: 'Kathgodam', note: 'Return bikes; train at 8:35 PM' },
      { time: '20:35', label: 'Ranikhet Express', note: 'Overnight return to Old Delhi' },
    ],
    coords: { x: 24, y: 79 },
    mode: 'bike',
    note: 'Protect the 4 PM bike-return target and keep a generous rail buffer.',
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
  5: [{ x: 15, y: 17 }, { x: 85, y: 17 }, { x: 13, y: 78 }, { x: 50, y: 88 }, { x: 87, y: 78 }],
}

function DayMindMap({ day }: { day: Day }) {
  const [selectedStop, setSelectedStop] = useState(0)
  useEffect(() => setSelectedStop(0), [day.day])
  const positions = nodePositions[day.stops.length as keyof typeof nodePositions] ?? nodePositions[4]
  const modeIcon = day.mode === 'rail' ? <Train size={24} /> : day.mode === 'local' ? <Compass size={24} /> : <Bike size={24} />

  return (
    <AnimatePresence mode="wait">
      <motion.div className="mind-map" key={day.day} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .4 }}>
        <div className="mind-map-topline">
          <span>{day.theme}</span>
          <div><i /> TAP ANY NODE TO EXPLORE</div>
        </div>
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
                <time>{stop.time}</time>
                <strong>{stop.label}</strong>
                <small>{stop.note}</small>
                <i className="mind-node-pulse" />
              </motion.button>
            )
          })}
        </div>
        <div className="mind-inspector">
          <div><span>SELECTED STOP / {String(selectedStop + 1).padStart(2, '0')}</span><strong>{day.stops[selectedStop]?.label}</strong></div>
          <p>{day.stops[selectedStop]?.note}</p>
          <div className="mind-warning"><ShieldAlert size={16} /> {day.note}</div>
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
        <div><span>01</span><strong>590 km</strong><small>BIKE DISTANCE</small></div>
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
