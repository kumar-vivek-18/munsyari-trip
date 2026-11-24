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
    night: 'Munsyari · night 02', stayAdvice: 'Choose a warm room with hot water. Arrange secure bike parking and main-luggage storage for the Khaliya overnight trek, plus trailhead transfers on 11 and 12 January. Meet the guide tonight and confirm the exact overnight shelter, meals and winter equipment.',
    essentials: ['Call a local hotel / tourist office', 'Check the next 48–72 hours of weather', 'Fill up in Thal', 'Turn back at snow or ice; no deadline is worth it'],
    highlights: [
      { place: 'Baghnath & Sangam', tag: 'MORNING CULTURE', time: '45–60 min within 07:00–08:30', detail: 'Begin with Baghnath Temple and the river confluence if open and accessible, leaving time for breakfast and checkout.', tip: 'A local walk is fine in early light; bike departure still waits for safe visibility.' },
      { place: 'Birthi Falls', tag: 'ON THE WAY', time: '12:45–13:30 · optional', detail: 'A mountain waterfall stop with a short viewpoint visit and tea. January spray and shaded steps can become slippery or frozen.', tip: 'This is the first sightseeing stop to drop if the route is running late.' },
      { place: 'Ratapani snow gate', tag: 'GO / NO-GO', time: '14:15–14:30 · safety check', detail: 'The final approach is the most snow-sensitive stretch. An open road earlier in the day does not guarantee safe grip at a shaded bend.', tip: 'If closed, pivot to Chaukori / Kausani / Binsar. A taxi is only an option when local operators confirm safe access.' },
    ],
  },
  {
    color: '#c2afff', weekday: 'MONDAY', focus: 'Walk to Khaliya. Spend the night in the mountains.',
    route: ['Munsyari', 'Nanda Devi Temple', 'Balati Bend', 'Khaliya Top', 'Khaliya overnight stay'],
    night: 'Khaliya Top area · night 03 · 11 Jan', stayAdvice: 'Book an operating lodge or guide-supported winter camp in the Khaliya area. Confirm its exact location: accommodation may be below the summit, not on the exposed top. Ask about winter-rated bedding or sleeping bags, insulated mats, dinner, breakfast, drinking water and toilets. Leave bikes and main luggage in Munsyari. If no suitable stay is operating, remain in town.',
    essentials: ['Confirm local guide, trail access and January overnight shelter', 'Confirm temple hours, transfers via Nanda Devi, bike and bag storage', 'Pack boots, poles, guide-advised traction, layers and dry socks', 'Carry headlamp, water, food, power bank and confirmed sleeping kit'],
    highlights: [
      { place: 'Nanda Devi Temple', tag: 'BEFORE THE TREK', time: '07:45–08:30 · 45 min', detail: 'Begin with darshan, a short temple-ground walk and the Panchachuli backdrop. The temple is a short transfer from Munsyari, followed by the drive to Balati Bend.', tip: 'Confirm opening time the evening before. If closed, take a brief exterior visit where permitted; keep the 09:30 trek start.' },
      { place: 'Balati Bend trailhead', tag: 'START ON FOOT', time: '09:15 briefing · 09:30 trek start', detail: 'Khaliya Dwar / Balati Bend is the start of the walking route. Continue here by the arranged vehicle after the temple visit; bikes and main bags stay at the hotel in Munsyari.', tip: 'Confirm trail entry, guide arrangements and next morning’s pickup before starting.' },
      { place: 'Khaliya Top', tag: 'THE MAIN TREK', time: '≈6 km uphill · 4–5 hrs with breaks', detail: 'Climb through forest to open meadows and the roughly 3,500 m viewpoint. In clear weather the panorama includes Panchachuli, Nanda Kot, Rajrambha and surrounding Himalayan peaks.', tip: 'Reserve 30 minutes for the view. January snow can slow the climb; the guide sets the turnaround time. Zero Point is not included.' },
      { place: 'Khaliya overnight stay', tag: 'NIGHT IN THE MOUNTAINS', time: '11 Jan afternoon → 12 Jan morning', detail: 'Reach the confirmed Khaliya-area shelter before dusk. Change into dry layers, have dinner and enjoy the evening from close to the stay. The final walk from the viewpoint depends on the booked location.', tip: 'Confirm January operation and sleeping equipment in advance. Next morning is for breakfast and descent, with a 07:30 daylight start.' },
    ],
  },
  {
    color: '#80c8ff', weekday: 'TUESDAY', focus: 'Back to Munsyari in the morning. Down to Bageshwar by evening.',
    route: ['Khaliya overnight stay', 'Balati Bend', 'Munsyari', 'Thal', 'Bageshwar'],
    night: 'Bageshwar · night 04', stayAdvice: 'Reserve an easy-access stay with bike parking, dinner and an early breakfast. Tell the host you are descending from Khaliya first. Arrival is conditional on a timely descent and clear roads; if delayed, halt earlier and revise the next day’s return arrangements.',
    essentials: ['Confirm 07:30 daylight descent and trailhead pickup', 'Check return-road conditions and fatigue before collecting bikes', 'Target Munsyari departure by 11:30; combine lunch and fuel in Thal', 'Reconfirm Bageshwar stay, bike handover and 13 Jan train'],
    highlights: [
      { place: 'Khaliya morning', tag: 'FIRST LIGHT & DESCENT', time: '06:45 breakfast · 07:30–10:30 descent', detail: 'Enjoy the view near the overnight shelter, then walk down to Balati Bend. Allow roughly 2–3 hours for 4–6 km, depending on the stay location and footing.', tip: 'No extra summit outing. Allow more time if snow or ice slows the descent.' },
      { place: 'Munsyari bike collection', tag: 'BACK IN TOWN', time: '10:00–11:00 return · leave by 11:30 target', detail: 'Transfer back from the trailhead, retrieve stored bags and bikes, eat and change into riding gear. Assess fatigue and road conditions before setting off.', tip: 'Bageshwar is still about five hours of riding away. A late descent means revising the return, not riding after dark.' },
      { place: 'Bageshwar', tag: 'FINAL HILL NIGHT', time: '16:45–17:00 · clear-condition target', detail: 'Ride through Thal with a combined lunch and fuel stop, then settle in for dinner and rest. The shorter return stage replaces the Kausani detour.', tip: 'Arrange breakfast for the 08:00 departure to Kathgodam; sightseeing is already covered on the outward journey.' },
    ],
  },
  {
    color: '#f2a4c5', weekday: 'WEDNESDAY', focus: 'One last mountain morning. Then back to the rails.',
    route: ['Bageshwar', 'Almora', 'Kathgodam', 'Overnight rail', 'Old Delhi · 14 Jan'],
    night: 'Return train · Delhi early 14 Jan', stayAdvice: 'Keep a clean overnight layer outside the riding luggage. Return bikes by the 4 PM target, settle the deposit and aim to reach the station by 7:45 PM.',
    essentials: ['Verify the return train schedule', 'Confirm bike-return time and deposit process', 'Leave Bageshwar by 08:00 if roads and visibility allow', 'Keep Thursday morning free for fog delays'],
    highlights: [
      { place: 'Bageshwar departure', tag: 'EARLY ROAD START', time: '07:00 breakfast · 08:00 departure', detail: 'Breakfast, checkout and one last bike check before the direct return through Almora. This day starts in Bageshwar after the Khaliya descent day.', tip: 'Wait for safe visibility and grip; contact the rental shop if conditions delay the handover.' },
      { place: 'Almora', tag: 'LUNCH & REST', time: '11:00–11:30 arrival · 45 min stop', detail: 'Take a seated lunch and water break, then continue through the Kainchi corridor. The full temple visit is on Day 02; no repeat darshan or Bhimtal detour is scheduled.', tip: 'Protect the 16:00 bike-return target and reach the station by 19:45.' },
      { place: 'Kathgodam handover', tag: 'HOMEWARD', time: '16:00 bikes · 20:35 train plan', detail: 'Reserve around an hour for return checks and paperwork, then dinner, repacking and a calm station transfer.', tip: 'Photograph the bike condition at handover and verify the deposit settlement.' },
    ],
  },
]
