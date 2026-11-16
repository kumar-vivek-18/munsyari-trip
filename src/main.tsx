import React from 'react'
import ReactDOM from 'react-dom/client'
import TripRouter from './TripRouter'
import './styles.css'
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TripRouter />
  </React.StrictMode>,
)
