export type Highlight = { place: string; tag: string; time: string; detail: string; tip: string }
export type DayGuide = { color: string; weekday: string; focus: string; route: string[]; night: string; stayAdvice: string; essentials: string[]; highlights: Highlight[] }

export const dayGuides: DayGuide[] = [
  {
    color: '#f3be55', weekday: 'FRIDAY', focus: 'Leave the city. Wake up at the foothills.',
    route: ['Old Delhi', 'Overnight rail', 'Kathgodam', 'Bike pickup'],
    night: 'Reserved train berth', stayAdvice: 'Keep your ticket and ID accessible. Pack a small overnight bag separately from bike luggage so you do not unpack everything on the train.',
    essentials: ['Reconfirm train schedule and platform', 'Carry photo ID and booked ticket', 'Keep warm layers outside your main bag', 'Confirm bike pickup with the rental shop'],
    highlights: [
      { place: 'Old Delhi departure', tag: 'CITY TO MOUNTAIN', time: 'Arrive by 20:45', detail: 'The trip starts before the train moves: dinner, platform checks and a relaxed boarding buffer make the next morning easier.', tip: 'Do not squeeze in a Chandni Chowk outing with loaded luggage and a departure deadline.' },
      { place: 'The night run', tag: 'SLOW TRAVEL', time: '22:05 departure plan', detail: 'The Ranikhet Express connects the city to Kumaon. Keep the first riding day flexible if winter fog slows the service.', tip: 'Timings are the trip plan, not a live railway feed. Verify with IRCTC / NTES.' },
      { place: 'Kathgodam chai', tag: 'FIRST LIGHT', time: 'Wait until daylight', detail: 'Use an early arrival for tea, breakfast and a thorough rental inspection—not for getting onto an unfamiliar mountain road in darkness.', tip: 'Confirm helmet, brakes, tyre tread, documents and emergency contact numbers.' },
    ],
  },
  {
    color: '#a9e5c4', weekday: 'SATURDAY', focus: 'A real temple visit. An unrushed mountain arrival.',
    route: ['Kathgodam', 'Kainchi Dham', 'Almora', 'Bageshwar'],
    night: 'Bageshwar · night 01', stayAdvice: 'Choose a stay with secure bike parking, reliable hot water and dinner on site or nearby. Ask the host to help check the Thal–Munsyari road before departure.',
    essentials: ['Fuel before departure', 'Reserve two hours for Kainchi', 'Avoid extra Bhimtal / Kasar Devi detours', 'Call ahead about road status and your arrival'],
    highlights: [
      { place: 'Kainchi Dham', tag: 'THE MAIN VISIT', time: '09:00–11:00 · 1.5–2 hrs', detail: 'Neem Karoli Baba’s ashram deserves time for parking, walking, queues and quiet darshan. This is the day’s principal sightseeing stop.', tip: 'Check opening arrangements locally. Keep temple etiquette and photography restrictions in mind.' },
      { place: 'Almora', tag: 'TASTE KUMAON', time: '13:00–13:30 · meal stop', detail: 'Stop for a seated meal and a stretch. Bal Mithai is a classic local sweet to pick up without turning the halt into a shopping circuit.', tip: 'Lala Bazaar and Kasar Devi are famous, but not allocated as full visits on this transfer day.' },
      { place: 'Bageshwar', tag: 'RIVERS & REST', time: '16:30–17:00 · arrive', detail: 'The town sits around the Saryu–Gomti confluence. Check in first; the Baghnath Temple and Sangam visit belong to tomorrow morning.', tip: 'Do not make up a late train arrival by extending the riding day past sunset.' },
    ],
  },
  {
    color: '#ff9479', weekday: 'SUNDAY', focus: 'The road is the decision. The peaks are the reward.',
    route: ['Bageshwar', 'Thal', 'Birthi Falls', 'Ratapani', 'Munsyari'],
    night: 'Munsyari · night 02', stayAdvice: 'Ask specifically about room warmth, extra blankets, hot water and safe parking. Confirm road access before paying for a non-refundable stay; nights can fall below freezing.',
    essentials: ['Call a local hotel / tourist office', 'Check the next 48–72 hours of weather', 'Fill up in Thal', 'Turn back at snow or ice; no deadline is worth it'],
    highlights: [
      { place: 'Baghnath & Sangam', tag: 'MORNING CULTURE', time: '45–60 min within 07:00–08:30', detail: 'Begin with Baghnath Temple and the river confluence if open and accessible, leaving time for breakfast and checkout.', tip: 'A local walk is fine in early light; bike departure still waits for safe visibility.' },
      { place: 'Birthi Falls', tag: 'ON THE WAY', time: '12:45–13:30 · optional', detail: 'A mountain waterfall stop with a short viewpoint visit and tea. January spray and shaded steps can become slippery or frozen.', tip: 'This is the first sightseeing stop to drop if the route is running late.' },
      { place: 'Ratapani snow gate', tag: 'GO / NO-GO', time: '14:15–14:30 · safety check', detail: 'The final approach is the most snow-sensitive stretch. An open road earlier in the day does not guarantee safe grip at a shaded bend.', tip: 'If closed, pivot to Chaukori / Kausani / Binsar. A taxi is only an option when local operators confirm safe access.' },
    ],
  },
  {
    color: '#c2afff', weekday: 'MONDAY', focus: 'Stay a little longer beneath Panchachuli.',
    route: ['Munsyari', 'Madkot', 'Nanda Devi Temple', 'Tribal Museum', 'Betulidhar', 'Munsyari'],
    night: 'Munsyari · night 03', stayAdvice: 'Keep the same room for the second night. Leave large luggage behind, carry dry layers for Madkot and ask the host about local access and museum opening hours.',
    essentials: ['Confirm hot spring access locally', 'Pack towel and dry layers', 'Check temple and museum hours', 'Return before dark; Khaliya replaces this circuit'],
    highlights: [
      { place: 'Madkot Hot Springs', tag: 'SLOW MORNING', time: '09:30–11:30 · 2 hrs', detail: 'Give the thermal spring visit and Gori Ganga valley a relaxed window. Access, water conditions and safe bathing need local confirmation.', tip: 'Take dry clothes, protect your phone and be careful on wet riverside rocks.' },
      { place: 'Temple & living heritage', tag: 'CULTURE', time: 'Temple 1 hr · museum 75 min', detail: 'Pair the Nanda Devi Temple mountain backdrop with the Tribal Heritage Museum’s stories of Johar Valley life and historic trade.', tip: 'Opening hours are not guaranteed. Keep a warm lunch or tea break as the fallback.' },
      { place: 'Betulidhar or Khaliya?', tag: 'CHOOSE YOUR PACE', time: 'Viewpoint 30 min · trek is an alternative day', detail: 'The planned day ends with an afternoon panorama at Betulidhar. A full Khaliya Top trek needs a separate daylight plan and appropriate conditions.', tip: 'Do not combine the full trek with Madkot and the museum. Never wait for sunset if the ride back will be dark.' },
    ],
  },
  {
    color: '#80c8ff', weekday: 'TUESDAY', focus: 'Protect your daylight on the long way down.',
    route: ['Munsyari', 'Thal', 'Bageshwar', 'Baijnath side', 'Kausani'],
    night: 'Kausani · night 04', stayAdvice: 'Prioritize easy road access and parking over a remote viewpoint property. Arrange dinner and ask whether the morning viewpoint or Anasakti Ashram is accessible on foot.',
    essentials: ['Check shaded road sections before leaving', 'Combine lunch and fuel in Thal', 'Skip Baijnath unless clearly ahead', 'Halt earlier if snow or traffic consumes daylight'],
    highlights: [
      { place: 'Panchachuli farewell', tag: 'BEFORE THE RIDE', time: 'During breakfast / checkout', detail: 'Take in the mountain light close to your stay, then pack for the descent. The road needs time to warm; the schedule cannot override ice.', tip: 'No extra sunrise bike excursion before the longest transfer.' },
      { place: 'Baijnath Temple', tag: 'OPTIONAL, NOT RUSHED', time: '45–60 min only if early', detail: 'The historic stone temple complex near the Gomti is worth a proper visit. The default arrival schedule assumes passing through without that visit.', tip: 'Do not interpret the route waypoint as an included stop. Keep the daylight margin first.' },
      { place: 'Kausani ridge', tag: 'ARRIVAL & REST', time: '16:30–17:00 · target arrival', detail: 'End at a comfortable stay and take any nearby view on foot. Anasakti Ashram and the morning mountain view are assigned to the next day.', tip: 'Tea estates are a separate detour, not a mandatory evening add-on.' },
    ],
  },
  {
    color: '#f2a4c5', weekday: 'WEDNESDAY', focus: 'One last mountain morning. Then back to the rails.',
    route: ['Kausani', 'Almora', 'Kainchi Dham (optional)', 'Kathgodam', 'Overnight rail', 'Old Delhi · 14 Jan'],
    night: 'Return train · Delhi early 14 Jan', stayAdvice: 'Keep a clean overnight layer outside the riding luggage. Return bikes by the 4 PM target, settle the deposit and aim to reach the station by 7:45 PM.',
    essentials: ['Verify the return train schedule', 'Confirm bike-return time and deposit process', 'Skip repeat Kainchi if behind schedule', 'Keep Thursday morning free for fog delays'],
    highlights: [
      { place: 'Kausani morning', tag: 'ONE LAST VIEW', time: '45–60 min + breakfast', detail: 'Enjoy the nearby Himalayan viewpoint and Anasakti Ashram if open. Breakfast and checkout share the morning window before an 8 AM target departure.', tip: 'If fog persists, wait. Drop later sightseeing rather than riding blind.' },
      { place: 'Kainchi, with time', tag: 'OPTIONAL REVISIT', time: '12:45–14:45 · 1.5–2 hrs', detail: 'A repeat temple visit still needs proper time for parking, queues and darshan. Bhimtal can be an alternative lake break—not another stop on top.', tip: 'If you reach late or queues grow, skip this repeat to protect bike return and rail buffers.' },
      { place: 'Kathgodam handover', tag: 'HOMEWARD', time: '16:00 bikes · 20:35 train plan', detail: 'Reserve around an hour for return checks and paperwork, then dinner, repacking and a calm station transfer.', tip: 'Photograph the bike condition at handover and verify the deposit settlement.' },
    ],
  },
]
