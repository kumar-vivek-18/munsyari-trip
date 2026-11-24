export type PlaceKind = 'temple' | 'town' | 'rail' | 'water' | 'mountain' | 'fuel' | 'heritage' | 'bike'
export type PlacePhoto = { src: string; alt: string; caption: string; author: string; source: string; license: string; licenseUrl: string; position?: string }
export type PlaceMedia = { name: string; kind: PlaceKind; category: string; mapQuery: string; photo?: PlacePhoto; gallery?: PlacePhoto[]; galleryNote?: string }

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`
const cc = (version = '4.0', shareAlike = true) => ({ license: `CC BY${shareAlike ? '-SA' : ''} ${version}`, licenseUrl: `https://creativecommons.org/licenses/by${shareAlike ? '-sa' : ''}/${version}/` })

const views: Record<string, PlacePhoto> = {
  delhiEntrance: { src: '/places/delhi-entrance.jpg', alt: 'Kashmere Gate side entrance of Delhi Junction railway station', caption: 'Delhi Junction · Kashmere Gate entrance', author: 'Ravi Dwivedi', source: commons('Delhi-Junction-entry.jpg'), ...cc() },
  kathgodamEntrance: { src: '/places/kathgodam-entrance.jpg', alt: 'Illuminated entrance of Kathgodam railway station at dusk', caption: 'Kathgodam station entrance · dusk reference', author: 'BlueSkyWalker', source: commons('Kathgodam railway station entrance at dusk.jpg'), ...cc() },
  kainchiTemple: { src: '/places/kainchi-river.jpg', alt: 'Orange temple towers at Kainchi Dham beside a forested hillside', caption: 'Kainchi Dham · temple towers', author: 'Nickk Bisht', source: commons('Kainchi Dhaam Neem Karoli Temple.jpg'), ...cc() },
  kainchiValley: { src: '/places/kainchi-valley.jpg', alt: 'Kainchi Dham temple and ashram complex in its wooded valley', caption: 'Kainchi Dham · ashram and valley', author: 'Lalit.bhandari86', source: commons('Kaichi dham.jpg'), ...cc() },
  almoraSweet: { src: '/places/almora-mithai.jpg', alt: 'Bal Mithai sweets covered with small white sugar balls', caption: 'Taste of Almora · Bal Mithai', author: 'vkumar', source: commons('Bal mithai.jpg'), ...cc('3.0', false) },
  bageshwarTown: { src: '/places/bageshwar-town.jpg', alt: 'Bageshwar town and river confluence viewed from above', caption: 'Bageshwar & Sangam · view from Chandika Temple', author: 'ArmouredCyborg', source: commons('Bageshwar view from Chandika Temple.jpg'), ...cc() },
  birthiRainbow: { src: '/places/birthi-rainbow.jpg', alt: 'Rainbow in the spray over rocks at the foot of Birthi Falls', caption: 'Birthi Falls · rainbow in the spray', author: 'Spandan chowdhury', source: commons('Rainbow at Birthi Falls.jpg'), ...cc() },
  munsyariTown: { src: '/places/munsyari-town.jpg', alt: 'Clouds over the wooded hills and buildings of Munsyari', caption: 'Munsyari hills · view from Milam Inn', author: 'Vipin Vasudeva', source: commons('Munsiyari from hotel milam inn - panoramio (1).jpg'), ...cc('3.0') },
  munsyariRoad: { src: '/places/munsyari-road.jpg', alt: 'A winding mountain road on the approach to Munsyari', caption: 'Road towards Munsyari · archival approach view', author: 'Vipin Vasudeva', source: commons('Road to munsiyari - panoramio (1).jpg'), ...cc('3.0') },
  nandaTemple: { src: '/places/nanda-temple.jpg', alt: 'White Nanda Devi Temple on a grassy ridge in Munsyari', caption: 'Nanda Devi Temple · ridge setting', author: 'Vipin Vasudeva', source: commons('Nanda devi tample, munsiyari - panoramio.jpg'), ...cc('3.0') },
  nandaFront: { src: '/places/nanda-front.jpg', alt: 'Entrance and white spire of Nanda Devi Temple in Munsyari', caption: 'Nanda Devi Temple · entrance', author: 'Vipin Vasudeva', source: commons('Nanda devi tample, munsiyari - panoramio (2).jpg'), ...cc('3.0') },
  nandaGrounds: { src: '/places/nanda-grounds.jpg', alt: 'Grassy temple grounds looking towards terraced hills near Munsyari', caption: 'Nanda Devi Temple · grounds and surrounding hills', author: 'Vipin Vasudeva', source: commons('Nanda devi tample, munsiyari - panoramio (3).jpg'), ...cc('3.0') },
  khaliyaPeaks: { src: '/places/khaliya-peaks.jpg', alt: 'Panchachuli peaks beyond the meadow in the Khaliya area', caption: 'Panchachuli from the Khaliya area · October view', author: 'त्रिलोक सिंह राणा', source: commons('Panchachuli from khalia tanti Trilok2.jpg'), ...cc('3.0') },
  khaliyaRidge: { src: '/places/khaliya-ridge.jpg', alt: 'A trekker on a grassy Khaliya ridge above layered Himalayan hills', caption: 'Khaliya ridge · October landscape', author: 'Shijoy M Mathew', source: commons('Khalia Peak, Munsiari Uttarakhand - India.jpg'), ...cc() },
  khaliyaPanorama: { src: '/places/khaliya-panorama.jpg', alt: 'Wide Himalayan panorama through trees on the trail towards Khaliya Top', caption: 'On the Khaliya trail · stitched mountain panorama', author: 'Alphahansraj', source: commons('Munsiyari Panchauli Panorama.jpg'), ...cc('3.0', false) },
}

export const placeMedia: Record<string, PlaceMedia> = {
  delhi: { name: 'Old Delhi Station', kind: 'rail', category: 'Railway station', mapQuery: 'Delhi Junction railway station Old Delhi', photo: { src: '/places/delhi.jpg', alt: 'Exterior of Delhi Junction railway station', caption: 'Old Delhi / Delhi Junction station', author: 'Ravi Dwivedi', source: commons('Delhi Junction railway station building.jpg'), ...cc() } },
  train: { name: 'Ranikhet Express', kind: 'rail', category: 'Overnight train', mapQuery: 'Kathgodam railway station' },
  kathgodam: { name: 'Kathgodam', kind: 'rail', category: 'Gateway to Kumaon', mapQuery: 'Kathgodam railway station Uttarakhand', photo: { src: '/places/kathgodam.jpg', alt: 'Kathgodam railway station in Uttarakhand', caption: 'Kathgodam railway station', author: 'Ravi Dwivedi', source: commons('Kathgodam Railway Station, Uttarakhand, India.jpg'), ...cc() } },
  kainchi: { name: 'Kainchi Dham', kind: 'temple', category: 'Temple & ashram', mapQuery: 'Kainchi Dham Neem Karoli Baba Ashram Uttarakhand', photo: { src: '/places/kainchi.jpg', alt: 'Kainchi Dham temple beside the river and forested hillside', caption: 'Kainchi Dham, Nainital district', author: 'Manvikesarwani09', source: commons('Kainchi Dham Nainital.jpg'), ...cc('4.0', false), position: 'center 77%' } },
  almora: { name: 'Almora', kind: 'town', category: 'Hill town & food stop', mapQuery: 'Almora Uttarakhand', photo: { src: '/places/almora.jpg', alt: 'Almora hillside town surrounded by green hills', caption: 'Almora and the surrounding hills', author: 'Travelling Slacker', source: commons('1 Almora Uttarakhand India.jpg'), ...cc('2.0', false) } },
  bageshwar: { name: 'Bageshwar', kind: 'temple', category: 'Temple & river confluence', mapQuery: 'Bagnath Temple Bageshwar Uttarakhand', photo: { src: '/places/bageshwar.jpg', alt: 'Bagnath Temple in Bageshwar at night', caption: 'Bagnath Temple, Bageshwar · archival night view', author: 'Harshit.S.R', source: commons('Bagnath Temple, Bageshwar.jpg'), ...cc() } },
  thal: { name: 'Thal', kind: 'fuel', category: 'Fuel, food & road check', mapQuery: 'Thal Pithoragarh Uttarakhand' },
  birthi: { name: 'Birthi Falls', kind: 'water', category: 'Waterfall viewpoint', mapQuery: 'Birthi Falls Uttarakhand', photo: { src: '/places/birthi.jpg', alt: 'Birthi waterfall cascading down a rocky hillside', caption: 'Birthi Falls · conditions vary by season', author: 'Deeps2200', source: commons('Birthi fall.jpg'), ...cc(), position: 'center 48%' } },
  ratapani: { name: 'Ratapani', kind: 'mountain', category: 'Snow-sensitive road checkpoint', mapQuery: 'Ratapani Munsyari Uttarakhand' },
  munsyari: { name: 'Munsyari', kind: 'mountain', category: 'Panchachuli mountain views', mapQuery: 'Munsyari Uttarakhand', photo: { src: '/munsyari-hero.jpg', alt: 'Panchachuli mountain peaks seen from near Munsyari', caption: 'Panchachuli from near Munsyari · reference landscape', author: 'Suresh Karia', source: commons('Panchchuli II.jpg'), ...cc(), position: 'center 58%' } },
  khaliya: { name: 'Khaliya Top', kind: 'mountain', category: 'Himalayan trek · ≈3,500 m', mapQuery: 'Khaliya Top Munsyari Uttarakhand', photo: views.khaliyaPeaks, gallery: [views.khaliyaRidge, views.khaliyaPanorama], galleryNote: 'Khaliya-area reference views. January snow and visibility can be very different.' },
  khaliyaStay: { name: 'Khaliya overnight stay', kind: 'mountain', category: 'Mountain overnight · confirm exact shelter', mapQuery: 'Khaliya Top accommodation Munsyari Uttarakhand', photo: views.khaliyaPeaks, gallery: [views.khaliyaPanorama], galleryNote: 'Surrounding landscape only. These photos do not depict your booked lodge or camp.' },
  balati: { name: 'Balati Bend trailhead', kind: 'mountain', category: 'Khaliya Dwar · trek start / finish', mapQuery: 'Khaliya Dwar Balati Bend Munsyari Uttarakhand', photo: views.khaliyaPanorama, gallery: [views.khaliyaPeaks], galleryNote: 'Views along the onward Khaliya trek, not the trailhead gate or pickup point.' },
  madkot: { name: 'Madkot Hot Springs', kind: 'water', category: 'Hot springs & river valley', mapQuery: 'Madkot Hot Springs Uttarakhand' },
  nanda: { name: 'Nanda Devi Temple', kind: 'temple', category: 'Temple & mountain panorama', mapQuery: 'Nanda Devi Temple Danadhar Munsyari Uttarakhand', photo: views.nandaTemple, gallery: [views.nandaFront, views.nandaGrounds] },
  museum: { name: 'Tribal Heritage Museum', kind: 'heritage', category: 'Johar Valley culture', mapQuery: 'Tribal Heritage Museum Munsyari Uttarakhand' },
  betulidhar: { name: 'Betulidhar', kind: 'mountain', category: 'Afternoon mountain viewpoint', mapQuery: 'Betulidhar Munsyari Uttarakhand' },
  baijnath: { name: 'Baijnath Temple', kind: 'temple', category: 'Historic stone temples', mapQuery: 'Baijnath Temple Bageshwar Uttarakhand', photo: { src: '/places/baijnath.jpg', alt: 'Historic stone temples at Baijnath in Uttarakhand', caption: 'Baijnath temple complex, Uttarakhand', author: 'Yann', source: commons('Temples of Baijnath, Uttarakhand, India.jpg'), ...cc() } },
  kausani: { name: 'Kausani', kind: 'mountain', category: 'Himalayan ridge panorama', mapQuery: 'Kausani Uttarakhand', photo: { src: '/places/kausani.jpg', alt: 'Panoramic view of the Himalayas from Kausani', caption: 'Himalayan panorama from Kausani', author: 'Gaurav Agrawal', source: commons('Panoramic view of the Himalayas from Kausani, Uttarakhand.jpg'), ...cc('2.0', false) } },
  bike: { name: 'Bike pickup', kind: 'bike', category: 'Rental & equipment check', mapQuery: 'Motorcycle rental Kathgodam Uttarakhand' },
}

// Additional views share the same location record across schedule and guide aliases.
placeMedia.delhi.gallery = [views.delhiEntrance]
placeMedia.kathgodam.gallery = [views.kathgodamEntrance]
placeMedia.kainchi.gallery = [views.kainchiTemple, views.kainchiValley]
placeMedia.almora.gallery = [views.almoraSweet]
placeMedia.bageshwar.gallery = [views.bageshwarTown]
placeMedia.birthi.gallery = [views.birthiRainbow]
placeMedia.munsyari.gallery = [views.munsyariTown, views.munsyariRoad]

const aliases: Record<string, string> = {
  'Old Delhi Station': 'delhi', 'Old Delhi': 'delhi', 'Old Delhi departure': 'delhi',
  'Ranikhet Express 15013': 'train', 'Ranikhet Express': 'train', 'The night run': 'train',
  'Kathgodam Station': 'kathgodam', Kathgodam: 'kathgodam', 'Kathgodam chai': 'kathgodam', 'Kathgodam handover': 'kathgodam',
  'Bike pickup': 'bike', 'Kainchi Dham': 'kainchi', 'Kainchi, with time': 'kainchi', Almora: 'almora',
  Bageshwar: 'bageshwar', 'Baghnath & Sangam': 'bageshwar', Thal: 'thal', 'Birthi Falls': 'birthi',
  Ratapani: 'ratapani', 'Ratapani snow gate': 'ratapani', Munsyari: 'munsyari', 'Munsyari breakfast': 'munsyari', 'Panchachuli farewell': 'munsyari',
  'Munsyari trek briefing': 'munsyari', 'Munsyari bike collection': 'munsyari', 'Bageshwar departure': 'bageshwar',
  'Khaliya Top': 'khaliya', 'Khaliya overnight stay': 'khaliyaStay', 'Khaliya morning': 'khaliyaStay',
  'Balati Bend trailhead': 'balati', 'Balati Bend return': 'balati',
  'Madkot Hot Springs': 'madkot', 'Nanda Devi Temple': 'nanda', 'Temple & living heritage': 'nanda', 'Tribal Heritage Museum': 'museum',
  Betulidhar: 'betulidhar', 'Betulidhar or Khaliya?': 'betulidhar', Baijnath: 'baijnath', 'Baijnath Temple': 'baijnath',
  Kausani: 'kausani', 'Kausani ridge': 'kausani', 'Kausani morning': 'kausani',
}

export function getPlaceMedia(label: string): PlaceMedia {
  const place = placeMedia[aliases[label]]
  if (label === 'Ranikhet Express 15013') return { ...placeMedia.train, mapQuery: placeMedia.delhi.mapQuery }
  return place || { name: label, kind: 'town', category: 'Trip stop', mapQuery: `${label} Uttarakhand` }
}

export function placeMapUrl(place: PlaceMedia) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`
}

export function getPlacePhotos(place: PlaceMedia): PlacePhoto[] {
  return [...(place.photo ? [place.photo] : []), ...(place.gallery || [])]
}
