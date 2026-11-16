import { useEffect, useMemo, useRef, useState } from 'react'
import L, { type LatLngBoundsExpression, type LatLngExpression } from 'leaflet'
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { Bike, Expand, Snowflake, TrainFront } from 'lucide-react'
import routeData from './route-data.json'

type JourneyMapProps = {
  activeDay: number
  onDayChange: (day: number) => void
}

type RouteKey = keyof typeof routeData

const routeMeta: { key: RouteKey; day: number; label: string; color: string; mode: 'rail' | 'bike' }[] = [
  { key: 'rail', day: 0, label: 'Delhi → Kathgodam', color: '#f3be55', mode: 'rail' },
  { key: 'day2', day: 1, label: 'Kathgodam → Bageshwar', color: '#7ed6a5', mode: 'bike' },
  { key: 'day3', day: 2, label: 'Bageshwar → Munsyari', color: '#ff6a47', mode: 'bike' },
  { key: 'day4', day: 3, label: 'Munsyari local', color: '#b69cff', mode: 'bike' },
  { key: 'day5', day: 4, label: 'Munsyari → Kausani', color: '#5db8ff', mode: 'bike' },
  { key: 'day6', day: 5, label: 'Kausani → Kathgodam + Delhi train', color: '#f2a4c5', mode: 'bike' },
]

const places: { name: string; pos: [number, number]; day: number; type?: string }[] = [
  { name: 'Old Delhi', pos: [28.6606, 77.2273], day: 0, type: 'rail' },
  { name: 'Kathgodam', pos: [29.2688, 79.5453], day: 1, type: 'hub' },
  { name: 'Bhimtal', pos: [29.3461, 79.5519], day: 1 },
  { name: 'Kainchi Dham', pos: [29.3919, 79.5123], day: 1 },
  { name: 'Almora', pos: [29.5892, 79.6467], day: 1 },
  { name: 'Bageshwar', pos: [29.8376, 79.7716], day: 1, type: 'night' },
  { name: 'Thal', pos: [29.8265, 80.1408], day: 2, type: 'fuel' },
  { name: 'Ratapani', pos: [30.0377, 80.184], day: 2, type: 'risk' },
  { name: 'Munsyari', pos: [30.0674, 80.2386], day: 2, type: 'night' },
  { name: 'Madkot', pos: [30.034, 80.151], day: 3 },
  { name: 'Kausani', pos: [29.8445, 79.6038], day: 4, type: 'night' },
]

const trainBack = [...routeData.rail].reverse() as [number, number][]

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
  useEffect(() => {
    if (!coordinates.length) return
    map.fitBounds(coordinates as LatLngBoundsExpression, { padding: [45, 45], maxZoom: overview ? 8 : 11, animate: true, duration: 1 })
  }, [coordinates, map, overview])
  return null
}

export default function JourneyMap({ activeDay, onDayChange }: JourneyMapProps) {
  const [overview, setOverview] = useState(true)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setOverview(false)
  }, [activeDay])

  const visibleRoutes = useMemo(() => overview ? routeMeta : routeMeta.filter((route) => route.day === activeDay), [activeDay, overview])
  const bounds = useMemo(() => {
    if (overview) return [...routeData.rail, ...routeData.day3] as [number, number][]
    const route = routeMeta.find((item) => item.day === activeDay)
    if (!route) return routeData.rail as [number, number][]
    const coords = routeData[route.key] as [number, number][]
    if (activeDay === 5) return [...coords, ...trainBack] as [number, number][]
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
        <MapContainer center={[29.55, 79.55]} zoom={8} zoomControl={false} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewport coordinates={bounds} overview={overview} />
          {visibleRoutes.map((route) => (
            <Polyline
              key={route.key}
              positions={routeData[route.key] as LatLngExpression[]}
              pathOptions={{ color: route.color, weight: overview ? 4 : 6, opacity: overview ? .76 : 1, dashArray: route.mode === 'rail' ? '7 9' : undefined, lineCap: 'round' }}
              eventHandlers={{ click: () => chooseDay(route.day) }}
            >
              <Tooltip sticky>{route.label} · Day {String(route.day + 1).padStart(2, '0')}</Tooltip>
            </Polyline>
          ))}
          {(overview || activeDay === 5) && <Polyline positions={trainBack} pathOptions={{ color: '#f3be55', weight: overview ? 4 : 6, opacity: .8, dashArray: '7 9' }} />}
          <Circle center={[30.0377, 80.184]} radius={7500} pathOptions={{ color: '#ff5a36', fillColor: '#ff5a36', fillOpacity: .12, dashArray: '4 6', weight: 2 }}>
            <Tooltip direction="top"><strong>Snow-risk zone</strong><br />Ratapani → Munsyari</Tooltip>
          </Circle>
          {places.filter((place) => overview || place.day === activeDay || (activeDay === 5 && place.name === 'Kathgodam')).map((place) => (
            <Marker key={place.name} position={place.pos} icon={markerIcon(place.day, place.type)} eventHandlers={{ click: () => chooseDay(place.day) }}>
              <Tooltip direction="top" offset={[0, -10]}>{place.name}</Tooltip>
            </Marker>
          ))}
        </MapContainer>
        <div className="map-route-card">
          <div className="map-route-icon">{routeMeta[activeDay].mode === 'rail' ? <TrainFront /> : <Bike />}</div>
          <div><small>{overview ? 'COMPLETE JOURNEY' : `DAY ${String(activeDay + 1).padStart(2, '0')}`}</small><strong>{overview ? 'Delhi → Munsyari → Delhi' : routeMeta[activeDay].label}</strong></div>
          {activeDay === 2 && !overview && <span className="map-snow-chip"><Snowflake size={12} /> SNOW CHECK</span>}
        </div>
        <div className="map-legend-new"><span><i className="rail" /> Rail</span><span><i className="ride" /> Bike route</span><span><i className="snow" /> Snow risk</span></div>
      </div>
      <div className="map-footnote"><span>Road geometry follows OpenStreetMap routing data. Rail line is indicative.</span><strong>CLICK A ROUTE OR DAY TO EXPLORE</strong></div>
    </div>
  )
}
