import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { RouteEffects } from './TripPages'
import { PlannerDay, PlannerNotFound, PlannerOverview, PlannerRoute } from './Planner'

function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  return <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .12 }}><RouteEffects /><Routes location={location}><Route path="/" element={<PlannerOverview />} /><Route path="/route" element={<PlannerRoute />} /><Route path="/day/:dayId" element={<PlannerDay />} /><Route path="*" element={<PlannerNotFound />} /></Routes></motion.div></AnimatePresence>
}

export default function TripRouter() {
  return <BrowserRouter><MotionConfig reducedMotion="user"><AnimatedRoutes /></MotionConfig></BrowserRouter>
}
