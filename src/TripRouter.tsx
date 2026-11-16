import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import App from './App'
import { DayPage, NotFound, RouteEffects, RoutePage } from './TripPages'
import './pages.css'

function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  return <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -10 }} transition={{ duration: reduced ? 0 : .23 }}><RouteEffects /><Routes location={location}><Route path="/" element={<App />} /><Route path="/route" element={<RoutePage />} /><Route path="/day/:dayId" element={<DayPage />} /><Route path="*" element={<NotFound />} /></Routes></motion.div></AnimatePresence>
}

export default function TripRouter() {
  return <BrowserRouter><MotionConfig reducedMotion="user"><AnimatedRoutes /></MotionConfig></BrowserRouter>
}
