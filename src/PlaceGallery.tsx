import { useLayoutEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Camera, Expand, ExternalLink, X } from 'lucide-react'
import { getPlaceMedia, getPlacePhotos, type PlaceMedia, type PlacePhoto } from './place-media'
import { Photo, PhotoCredit, PlaceVisual } from './PlaceVisual'
import './place-gallery.css'

function PhotoStrip({ place, photos, selected, onSelect }: { place: PlaceMedia; photos: PlacePhoto[]; selected: number; onSelect: (index: number) => void }) {
  return <div className="gallery-thumbnails" role="group" aria-label={`${place.name} photo thumbnails`}>
    {photos.map((photo, index) => <button key={photo.src} type="button" aria-label={`Show photo ${index + 1}: ${photo.caption}`} aria-pressed={selected === index} onClick={() => onSelect(index)}><Photo place={place} photo={photo} thumbnail /></button>)}
  </div>
}

function GalleryViewer({ place, photos, initial, onClose }: { place: PlaceMedia; photos: PlacePhoto[]; initial: number; onClose: (index: number) => void }) {
  const [selected, setSelected] = useState(initial)
  const dialog = useRef<HTMLDialogElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const photo = photos[selected]
  const move = (direction: number) => setSelected((index) => (index + direction + photos.length) % photos.length)

  useLayoutEffect(() => {
    const element = dialog.current!
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  const keyboard = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    if (event.key === 'Home') setSelected(0)
    else if (event.key === 'End') setSelected(photos.length - 1)
    else move(event.key === 'ArrowLeft' ? -1 : 1)
  }
  const swipe = (event: TouchEvent) => {
    const start = touch.current
    const end = event.changedTouches[0]
    touch.current = null
    if (start && end && Math.abs(end.clientX - start.x) > 50 && Math.abs(end.clientY - start.y) < 60) move(end.clientX < start.x ? 1 : -1)
  }

  return createPortal(<dialog ref={dialog} className="gallery-viewer" aria-label={`${place.name} photo gallery`} onKeyDown={keyboard} onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(selected) }} onClick={(event) => { if (event.target === event.currentTarget) onClose(selected) }}>
    <div className="gallery-viewer-content">
      <header className="gallery-viewer-header"><div><small>EXPLORE THE PLACE</small><h2>{place.name}</h2></div><button type="button" aria-label="Close photo gallery" onClick={() => onClose(selected)}><X size={22} /></button></header>
      <div className="gallery-viewer-stage" onTouchStart={(event) => { const point = event.touches[0]; touch.current = event.touches.length === 1 ? { x: point.clientX, y: point.clientY } : null }} onTouchEnd={swipe} onTouchCancel={() => { touch.current = null }}>
        <Photo key={photo.src} place={place} photo={photo} expanded />
        {photos.length > 1 && <><button type="button" className="gallery-arrow previous" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft size={21} /></button><button type="button" className="gallery-arrow next" aria-label="Next photo" onClick={() => move(1)}><ArrowRight size={21} /></button></>}
      </div>
      <div className="gallery-viewer-details"><div className="gallery-caption" aria-live="polite"><span>{selected + 1} / {photos.length}</span><p>{photo.caption}</p></div><PhotoCredit photo={photo} />{photos.length > 1 && <PhotoStrip place={place} photos={photos} selected={selected} onSelect={setSelected} />}<p className="gallery-reference">{place.galleryNote || 'Reference photos · seasons and conditions vary.'}{photos.length > 1 && ' Swipe or use ← → to explore.'}</p></div>
    </div>
  </dialog>, document.body)
}

function Gallery({ label, place }: { label: string; place: PlaceMedia }) {
  const photos = getPlacePhotos(place)
  const [selected, setSelected] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const photo = photos[selected]
  const move = (direction: number) => setSelected((index) => (index + direction + photos.length) % photos.length)

  if (!photo) return <div className="place-gallery gallery-empty"><PlaceVisual label={label} />{place.name !== 'Ranikhet Express' && <div className="gallery-empty-copy"><p>Local photos are not available yet.</p><a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place.mapQuery)}`} target="_blank" rel="noreferrer"><Camera size={14} />Browse place photos<ExternalLink size={12} /></a></div>}</div>

  return <section className="place-gallery" aria-label={`${place.name} photos`}>
    <div className="gallery-preview"><button type="button" className="gallery-open" aria-label={`Open ${place.name} photo gallery`} onClick={() => setExpanded(true)}><Photo key={photo.src} place={place} photo={photo} /><span className="gallery-expand"><Expand size={13} />View larger</span></button></div>
    <div className="gallery-toolbar"><span aria-live="polite"><Camera size={13} />{selected + 1} / {photos.length}</span>{photos.length > 1 && <div><button type="button" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft size={16} /></button><button type="button" aria-label="Next photo" onClick={() => move(1)}><ArrowRight size={16} /></button></div>}</div>
    {photos.length > 1 && <PhotoStrip place={place} photos={photos} selected={selected} onSelect={setSelected} />}
    <PhotoCredit photo={photo} />
    {place.galleryNote && <p className="gallery-reference">{place.galleryNote}</p>}
    {expanded && <GalleryViewer place={place} photos={photos} initial={selected} onClose={(index) => { setSelected(index); setExpanded(false) }} />}
  </section>
}

export function PlaceGallery({ label }: { label: string }) {
  return <Gallery key={label} label={label} place={getPlaceMedia(label)} />
}
