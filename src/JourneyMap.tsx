import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import L, { type LatLngBoundsExpression, type LatLngExpression } from 'leaflet'
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { Bike, Expand, Footprints, Snowflake, TrainFront } from 'lucide-react'
import storedRoutes from './route-data.json'

const routeData = {
  ...storedRoutes,
  // Schematic town → temple → trailhead → Khaliya area, not a GPS track.
  // The operator must confirm the overnight shelter's actual position.
  day4: [[30.0674, 80.2386], [30.0677, 80.2579], [30.0674, 80.2386], [30.0592, 80.2211], [30.0638, 80.2108]],
  day5: [...storedRoutes.day3].reverse(),
  day6: [...storedRoutes.day2].reverse(),
}

type JourneyMapProps = {
  activeDay: number
  onDayChange: (day: number) => void
  initialOverview?: boolean
}

type RouteKey = keyof typeof routeData

const routeMeta: { key: RouteKey; day: number; label: string; color: string; mode: 'rail' | 'bike' | 'trek' }[] = [
  { key: 'rail', day: 0, label: 'Delhi → Kathgodam', color: '#f3be55', mode: 'rail' },
  { key: 'day2', day: 1, label: 'Kathgodam → Bageshwar', color: '#7ed6a5', mode: 'bike' },
  { key: 'day3', day: 2, label: 'Bageshwar → Munsyari', color: '#ff6a47', mode: 'bike' },
  { key: 'day4', day: 3, label: 'Munsyari → Khaliya · transfer + trek', color: '#b69cff', mode: 'trek' },
  { key: 'day5', day: 4, label: 'Khaliya → Munsyari → Bageshwar', color: '#5db8ff', mode: 'bike' },
  { key: 'day6', day: 5, label: 'Bageshwar → Kathgodam + Delhi train', color: '#f2a4c5', mode: 'bike' },
]

const places: { name: string; pos: [number, number]; day: number; days?: number[]; type?: string; detail?: string }[] = [
  { name: 'Old Delhi', pos: [28.6606, 77.2273], day: 0, days: [0, 5], type: 'rail' },
  { name: 'Kathgodam', pos: [29.2688, 79.5453], day: 1, days: [0, 1, 5], type: 'hub' },
  { name: 'Kainchi Dham', pos: [29.3919, 79.5123], day: 1, days: [1, 5], type: 'sight', detail: 'Day 02: 1.5–2 hours · Day 06: pass through' },
  { name: 'Almora', pos: [29.5892, 79.6467], day: 1, days: [1, 5], detail: 'Meal stop; market visit not allocated' },
  { name: 'Bageshwar', pos: [29.8376, 79.7716], day: 1, days: [1, 2, 4, 5], type: 'night', detail: 'Nights 01 + 04 · Baghnath Temple' },
  { name: 'Thal', pos: [29.8265, 80.1408], day: 2, days: [2, 4], type: 'fuel', detail: 'Last reliable fuel' },
  { name: 'Birthi Falls', pos: [30.003, 80.174], day: 2, type: 'sight', detail: 'Short waterfall stop' },
  { name: 'Ratapani', pos: [30.0377, 80.184], day: 2, days: [2, 4], type: 'risk', detail: 'Critical snow checkpoint' },
  { name: 'Munsyari', pos: [30.0674, 80.2386], day: 2, days: [2, 3, 4], type: 'night', detail: 'Night 02 · bike and luggage storage during trek' },
  { name: 'Nanda Devi Temple', pos: [30.0677, 80.2579], day: 3, type: 'sight', detail: 'Day 04 · 07:45–08:30 before the trek' },
  { name: 'Balati Bend / Khaliya Dwar', pos: [30.0592, 80.2211], day: 3, days: [3, 4], type: 'sight', detail: 'Trailhead · transfer from / to Munsyari' },
  { name: 'Khaliya Top area', pos: [30.0638, 80.2108], day: 3, days: [3, 4], type: 'night', detail: 'Night 03 · area marker only; confirm shelter location' },
]

const trainBack = [...routeData.rail].reverse() as [number, number][]
const trekReturn: [number, number][] = [[30.0638, 80.2108], [30.0592, 80.2211], [30.0674, 80.2386]]

function markerIcon(day: number, type?: string) {
  const color = type === 'risk' ? '#ff5a36' : routeMeta[day]?.color ?? '#fff'
  return L.divIcon({
    className: 'journey-div-icon',
    html: `<span style="--marker:${color}" class="journey-marker ${type || ''}"><i></i></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function MapViewport({ coordinates, overview }: { coordinates: [number, number][]; overview: boolean }) {
  const map = useMap()
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (!coordinates.length) return
    map.fitBounds(coordinates as LatLngBoundsExpression, { padding: [45, 45], maxZoom: overview ? 8 : 11, animate: !reduceMotion, duration: 1 })
  }, [coordinates, map, overview, reduceMotion])
  return null
}

export default function JourneyMap({ activeDay, onDayChange, initialOverview = true }: JourneyMapProps) {
  const [overview, setOverview] = useState(initialOverview)
  const [previousDay, setPreviousDay] = useState(activeDay)
  if (previousDay !== activeDay) {
    setPreviousDay(activeDay)
    setOverview(false)
  }

  const visibleRoutes = useMemo(() => overview ? routeMeta : routeMeta.filter((route) => route.day === activeDay), [activeDay, overview])
  const bounds = useMemo(() => {
    if (overview) return [...routeData.rail, ...routeData.day3, ...routeData.day4] as [number, number][]
    const route = routeMeta.find((item) => item.day === activeDay)
    if (!route) return routeData.rail as [number, number][]
    const coords = routeData[route.key] as [number, number][]
    if (activeDay === 5) return [...coords, ...trainBack] as [number, number][]
    if (activeDay === 4) return [...trekReturn, ...coords] as [number, number][]
    return coords
  }, [activeDay, overview])

  const chooseDay = (day: number) => {
    onDayChange(day)
    setOverview(false)
  }

  return (
    <div className="real-map-shell">
      <div className="real-map-toolbar">
        <div className="map-view-switch">
          <button className={overview ? 'active' : ''} onClick={() => setOverview(true)}><Expand size={14} /> Full journey</button>
          {routeMeta.map((route) => <button key={route.day} className={!overview && activeDay === route.day ? 'active' : ''} onClick={() => chooseDay(route.day)}>{String(route.day + 1).padStart(2, '0')}</button>)}
        </div>
        <div className="live-map-label"><span /> OPENSTREETMAP · INTERACTIVE</div>
      </div>
      <div className="real-map-frame">
        <MapContainer center={[29.55, 79.55]} zoom={8} zoomControl scrollWheelZoom={false} className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewport coordinates={bounds} overview={overview} />
          {visibleRoutes.map((route) => (
            <Polyline
              key={route.key}
              positions={routeData[route.key] as LatLngExpression[]}
              pathOptions={{ color: route.color, weight: overview ? 4 : 6, opacity: overview ? .76 : 1, dashArray: route.mode === 'rail' ? '7 9' : route.mode === 'trek' ? '3 8' : undefined, lineCap: 'round' }}
              eventHandlers={{ click: () => chooseDay(route.day) }}
            >
              <Tooltip sticky>{route.label} · Day {String(route.day + 1).padStart(2, '0')}</Tooltip>
            </Polyline>
          ))}
          {!overview && <Polyline positions={routeData[routeMeta[activeDay].key] as LatLngExpression[]} interactive={false} pathOptions={{ className: 'journey-route-flow', color: '#ffffff', weight: 2, opacity: .55, dashArray: '4 18' }} />}
          {(overview || activeDay === 4) && <Polyline positions={trekReturn} pathOptions={{ color: routeMeta[4].color, weight: 4, dashArray: '3 8' }} eventHandlers={{ click: () => chooseDay(4) }}><Tooltip sticky>Day 05 · morning descent + transfer · schematic</Tooltip></Polyline>}
          {(overview || activeDay === 5) && <Polyline positions={trainBack} pathOptions={{ color: '#f3be55', weight: overview ? 4 : 6, opacity: .8, dashArray: '7 9' }} />}
          <Circle center={[30.0377, 80.184]} radius={7500} pathOptions={{ color: '#ff5a36', fillColor: '#ff5a36', fillOpacity: .12, dashArray: '4 6', weight: 2 }}>
            <Tooltip direction="top"><strong>Snow-risk zone</strong><br />Ratapani → Munsyari</Tooltip>
          </Circle>
          {places.filter((place) => overview || (place.days || [place.day]).includes(activeDay)).map((place) => (
            <Marker key={place.name} position={place.pos} icon={markerIcon(place.day, place.type)} eventHandlers={{ click: () => chooseDay((place.days || [place.day]).includes(activeDay) && !overview ? activeDay : place.day) }}>
              <Tooltip direction="top" offset={[0, -10]}><strong>{place.name}</strong>{place.detail && <><br />{place.detail}</>}</Tooltip>
            </Marker>
          ))}
        </MapContainer>
        <div className="map-route-card">
          <div className="map-route-icon">{routeMeta[activeDay].mode === 'rail' ? <TrainFront /> : routeMeta[activeDay].mode === 'trek' ? <Footprints /> : <Bike />}</div>
          <div><small>{overview ? 'COMPLETE JOURNEY' : `DAY ${String(activeDay + 1).padStart(2, '0')}`}</small><strong>{overview ? 'Delhi → Munsyari → Delhi' : routeMeta[activeDay].label}</strong></div>
          {activeDay === 2 && !overview && <span className="map-snow-chip"><Snowflake size={12} /> SNOW CHECK</span>}
        </div>
        <div className="map-legend-new"><span><i className="rail" /> Rail</span><span><i className="ride" /> Bike route</span><span><Footprints size={12} /> Trek / transfer</span><span><i className="snow" /> Snow risk</span></div>
      </div>
      <div className="map-footnote"><span>OSM road alignments; rail and dashed trek / transfer lines are schematic. Khaliya marker is an area reference, not a booked camp or GPS trail. Not live access or turn-by-turn navigation.</span><strong>CLICK A ROUTE OR DAY TO EXPLORE</strong></div>
    </div>
  )
}
