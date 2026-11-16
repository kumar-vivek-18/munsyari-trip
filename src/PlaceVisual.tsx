import { useState } from 'react'
import { Bike, Building2, Camera, Droplets, ExternalLink, Fuel, Landmark, MapPin, MountainSnow, Train } from 'lucide-react'
import { getPlaceMedia, placeMapUrl, type PlaceKind, type PlaceMedia } from './place-media'
import './place-visual.css'

const icons = { temple: Landmark, town: Building2, rail: Train, water: Droplets, mountain: MountainSnow, fuel: Fuel, heritage: Landmark, bike: Bike }

function Photo({ place, thumbnail }: { place: PlaceMedia; thumbnail: boolean }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const Icon = icons[place.kind as PlaceKind]
  const photo = place.photo
  if (!photo || failed) return <div className={`place-illustration place-illustration-${place.kind}`}><Icon aria-hidden="true" size={thumbnail ? 24 : 44} />{!thumbnail && <><strong>{place.name}</strong><small>{place.category}</small></>}</div>
  return <div className={`place-photo ${loaded ? 'loaded' : ''}`}><img src={photo.src} alt={thumbnail ? '' : photo.alt} loading={thumbnail ? 'lazy' : 'eager'} decoding="async" width={900} height={600} style={{ objectPosition: photo.position || 'center' }} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />{!thumbnail && <span className="place-photo-caption"><Camera size={12} />{photo.caption}</span>}</div>
}

export function PlaceVisual({ label, thumbnail = false }: { label: string; thumbnail?: boolean }) {
  const place = getPlaceMedia(label)
  return <div className={thumbnail ? 'place-thumbnail' : 'place-visual'}><Photo key={place.photo?.src || place.name} place={place} thumbnail={thumbnail} /></div>
}

export function PlaceCredit({ label }: { label: string }) {
  const photo = getPlaceMedia(label).photo
  if (!photo) return null
  return <div className="place-photo-credit"><a href={photo.source} target="_blank" rel="noreferrer">Photo: {photo.author}</a><span>·</span><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a><span>· resized / cropped</span></div>
}

export function PlaceMapLink({ label }: { label: string }) {
  const place = getPlaceMedia(label)
  return <a className="place-map-link" href={placeMapUrl(place)} target="_blank" rel="noreferrer" aria-label={`View ${place.name} on Google Maps`}><MapPin size={14} />View on map<ExternalLink size={12} /></a>
}
