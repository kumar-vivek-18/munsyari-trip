import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, Check, CheckCheck, Clock3, Flag, ListChecks, MapPin, Route, ShieldAlert, X } from 'lucide-react'
import type { Day } from './App'
import { PlaceMapLink, PlaceVisual } from './PlaceVisual'
import { PlaceGallery } from './PlaceGallery'
import { getPlaceMedia } from './place-media'
import './day-path.css'

type SavedTasks = Record<string, boolean>

export default function DayPath({ day, compact = false }: { day: Day; compact?: boolean }) {
  const storageKey = `northbound-tasks-${day.day}${Number(day.day) >= 3 ? '-khaliya-v1' : ''}`
  const [selected, setSelected] = useState(0)
  const [tasks, setTasks] = useState<SavedTasks>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}')
      return saved && typeof saved === 'object' && !Array.isArray(saved)
        ? Object.fromEntries(Object.entries(saved).filter(([, value]) => value === true)) : {}
    } catch { return {} }
  })
  const dialog = useRef<HTMLDialogElement>(null)
  const scrollArea = useRef<HTMLDivElement>(null)
  const stop = day.stops[selected]
  const next = day.stops[selected + 1]
  const totalTasks = day.stops.reduce((total, item) => total + item.highlights.length, 0)
  const taskKey = (stopIndex: number, taskIndex: number) => `${day.stops[stopIndex].label}:${taskIndex}`
  const completed = day.stops.reduce((total, item, stopIndex) => total + item.highlights.filter((_, taskIndex) => tasks[taskKey(stopIndex, taskIndex)]).length, 0)
  const countDone = (index: number) => day.stops[index].highlights.filter((_, taskIndex) => tasks[taskKey(index, taskIndex)]).length

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(tasks)) } catch { /* Storage can be unavailable. */ }
  }, [storageKey, tasks])

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    let previousOverflow = ''
    const restore = () => { document.body.style.overflow = previousOverflow }
    const lock = () => {
      if (element.open) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden' }
      else restore()
    }
    const observer = new MutationObserver(lock)
    observer.observe(element, { attributes: true, attributeFilter: ['open'] })
    return () => { observer.disconnect(); if (element.open) restore() }
  }, [])

  const openStop = (index: number) => {
    setSelected(index)
    dialog.current?.showModal()
    scrollArea.current?.scrollTo({ top: 0, behavior: 'instant' })
  }
  const changeStop = (index: number) => {
    setSelected(index)
    scrollArea.current?.scrollTo({ top: 0, behavior: 'instant' })
  }
  const toggleTask = (taskIndex: number) => {
    const key = taskKey(selected, taskIndex)
    setTasks((current) => ({ ...current, [key]: !current[key] }))
  }

  return <div className={`day-path ${compact ? 'compact-path' : ''}`}>
    <div className="path-heading"><div><span>{compact ? 'IN TRAVEL ORDER' : 'YOUR DAY, IN ORDER'}</span><h3>{compact ? 'Your schedule' : 'One stop leads to the next.'}</h3><p>{compact ? 'Select a stop for tasks and details.' : 'Follow the line. Tap a stop to open its visit plan and checklist.'}</p></div><div className="path-completion"><CheckCheck size={18} /><strong>{completed}<small> / {totalTasks}</small></strong><span>CHECKED ON THIS DEVICE</span></div></div>
    {!compact && day.pacing && <div className="day-pacing"><Clock3 size={20} /><div><strong>MAKE TIME FOR THE PLACE</strong><p>{day.pacing}</p><small>Travel windows are estimates. Optional visits are not cumulative.</small></div></div>}
    <div className="path-layout">
      <div className="path-steps">
        <ol className="ordered-route" aria-label={`Day ${day.day} stops in travel order`}>
          {day.stops.map((item, index) => {
            const previous = day.stops[index - 1]
            const done = countDone(index)
            return <li key={item.label} className={selected === index ? 'selected' : ''}>
              {index > 0 && <div className="path-connection"><ArrowDown size={15} /><div><span>NEXT · {previous.label} → {item.label}</span><strong>{item.travel}<i />{item.distance}</strong></div></div>}
              <div className="path-stop-row"><span className={`path-step-marker ${done === item.highlights.length ? 'complete' : ''}`}>{done === item.highlights.length ? <Check size={17} /> : String(index + 1).padStart(2, '0')}</span>
                <motion.button className="path-stop" onClick={() => openStop(index)} aria-haspopup="dialog" aria-label={`Open stop ${index + 1}: ${item.label}`} whileHover={{ x: 4 }}>
                  <div className="path-stop-top"><time>{item.time}</time><span className={`path-visit ${item.visit === 'Optional visit' ? 'optional' : ''}`}>{item.visit || (index === 0 ? 'Journey starts' : 'Journey step')}</span></div>
                  <div className="stop-label-visual"><PlaceVisual label={item.label} thumbnail /><div><h4>{item.label}</h4><small>{getPlaceMedia(item.label).category}</small></div></div>{!compact && <p>{item.note}</p>}
                  <div className="path-stop-stats"><span><Clock3 size={13} />Stay <b>{item.stay}</b></span>{item.depart && <span>Leave by <b>{item.depart}</b></span>}</div>
                  <div className="path-stop-bottom"><span><ListChecks size={14} />{done}/{item.highlights.length} checked</span><strong>Open tasks & details <ArrowRight size={16} /></strong></div>
                </motion.button>
              </div>
            </li>
          })}
        </ol>
        <div className="path-finish"><span><Flag size={18} /></span><div><small>END OF THIS DAY’S PLAN</small><strong>{day.stay}</strong><p>{day.mode === 'rail' ? 'The next chapter continues with the first riding day.' : 'Rest, check tomorrow’s conditions, and prepare your essentials.'}</p></div></div>
      </div>
      {!compact && <aside className="path-companion" aria-label="Day route summary">
        <div className="path-companion-title"><Route size={21} /><span>DAY {day.day} · {day.date}</span></div><h3>{day.title}</h3><p>{day.summary}</p>
        <div className="path-summary-stats"><span>{day.distance}<small>PLANNED DISTANCE</small></span><span>{day.saddle}<small>TRAVEL ESTIMATE</small></span></div>
        <div className="path-mini-route">{day.stops.map((item, index) => <button key={item.label} onClick={() => openStop(index)} aria-label={`View tasks at ${item.label}`}><i className={selected === index ? 'current' : ''} /><span>{item.label}</span><small>{item.time}</small></button>)}</div>
        <div className="path-day-note"><ShieldAlert size={17} /><p>{day.note}</p></div>
        <div className="path-progress-track"><motion.i animate={{ width: `${completed / totalTasks * 100}%` }} /></div>
        <small className="path-storage-note">Checks track your preparation and visits, not road clearance. Saved locally.</small>
      </aside>}
    </div>

    <dialog ref={dialog} className="stop-dialog" aria-labelledby={`stop-dialog-title-${day.day}`} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}>
      <div className="stop-dialog-content">
        <header><span>DAY {day.day} / STOP {String(selected + 1).padStart(2, '0')} OF {day.stops.length}</span><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close stop details"><X size={20} /></button></header>
        <div className="stop-dialog-scroll" ref={scrollArea}>
          <div className="stop-photo-block"><PlaceGallery label={stop.label} /></div>
          <div className="stop-dialog-intro"><span><MapPin size={15} />{stop.visit || 'Journey step'}</span><h2 id={`stop-dialog-title-${day.day}`}>{stop.label}</h2><p>{stop.note}</p></div>
          <div className="stop-location-actions"><PlaceMapLink label={stop.label} /><span>Opens a place search · confirm locally</span></div>
          <div className="stop-dialog-timing"><div><span>ARRIVE / START</span><strong>{stop.time}</strong></div><div><span>TIME HERE</span><strong>{stop.stay}</strong></div><div><span>{stop.depart ? 'LEAVE BY' : 'DEPARTURE'}</span><strong>{stop.depart || (stop.stay === 'Overnight' ? 'Next morning' : 'See next step')}</strong></div></div>
          {selected > 0 && <div className="stop-incoming"><Route size={16} /><div><small>GETTING HERE</small><strong>{day.stops[selected - 1].label} → {stop.label}</strong><p>{stop.distance} · {stop.travel}</p></div></div>}
          <div className="stop-task-heading"><div><span>AT THIS STOP</span><h3>What to do here.</h3></div><b>{countDone(selected)}/{stop.highlights.length}</b></div>
          <p className="stop-task-help">Tap to check off a task or visit. Follow the stop notes for optional activities.</p>
          <div className="stop-task-list">{stop.highlights.map((task, taskIndex) => <button key={task} aria-pressed={!!tasks[taskKey(selected, taskIndex)]} onClick={() => toggleTask(taskIndex)}><span>{tasks[taskKey(selected, taskIndex)] && <Check size={16} />}</span><strong>{task}</strong><small>{tasks[taskKey(selected, taskIndex)] ? 'DONE' : 'TO DO'}</small></button>)}</div>
          <div className="stop-next-preview"><ArrowDown size={19} /><div><small>{next ? 'THEN, CONTINUE TO' : 'THIS CHAPTER ENDS HERE'}</small><h3>{next?.label || day.stay}</h3><p>{next ? `${next.distance} · ${next.travel} · target ${next.time}` : 'Review the next day’s guide and prepare before resting.'}</p>{next?.visit === 'Optional visit' && <span>Optional: only visit if the day is on time.</span>}</div></div>
          <p className="stop-dialog-caution"><ShieldAlert size={14} />{day.note}</p>
        </div>
        <footer><button disabled={selected === 0} onClick={() => changeStop(selected - 1)}><ArrowLeft size={15} />Previous</button><button className="stop-next-button" onClick={() => next ? changeStop(selected + 1) : dialog.current?.close()}>{next ? 'Next stop' : 'Back to the route'}<ArrowRight size={16} /></button></footer>
      </div>
    </dialog>
  </div>
}
