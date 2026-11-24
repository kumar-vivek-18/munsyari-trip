# Northbound — Munsyari Winter Field Guide

A six-stage rail and bike trip planner for 8–14 January 2027, built with React, TypeScript, Vite, React Router, Framer Motion and Leaflet.

## Run locally

```sh
npm install
npm run dev
```

## Pages

- `/` — compact trip dashboard with six day cards and key trip facts
- `/route` — complete route atlas with selectable journey legs
- `/day/01` — train preparation, overnight packing, boarding and arrival
- `/day/02` through `/day/06` — daily field guides with maps, ordered stop-by-stop routes, visit durations, sights, overnight requirements and preparation for the next day

Each stop opens an accessible task dialog (bottom sheet on mobile) with timing, incoming and next legs, and a per-stop checklist. Previous/next controls follow travel order. Checklists are saved in the current browser's local storage. Day plans can be copied or printed.

Day pages use three views: **Schedule & map**, **Places to visit**, and **Preparation**. The active view is shareable via `?view=places` or `?view=prepare`. Persistent navigation keeps every day one click away; the schedule and map appear side by side on desktop and stack on mobile.

## Validation

```sh
npm run build
npx playwright install chromium
npm run test:e2e
```

## Hosting

This is a client-routed SPA with distinct page URLs. Serve `dist` after `npm run build`, and rewrite non-file routes to `/index.html` so direct links and refreshes work. Netlify (`public/_redirects`) and Vercel (`vercel.json`) rewrite configurations are included. For another host, configure its equivalent history fallback.

## Planning limits

Train times and road distances come from the proposed itinerary and are **not live or independently guaranteed**. Check railway schedules, winter road access, attraction hours and queues before travel. OSM road alignments may differ from planning-distance estimates. Rail and trek / trailhead-transfer lines are schematic, not GPS tracks or turn-by-turn directions. OpenStreetMap tiles need an internet connection; there is no live weather or road-closure feed. Hotels and trek shelters are described by stay requirements, not booked or recommended as confirmed availability.

Day 04 (11 January) begins with **Nanda Devi Temple, 07:45–08:30**, followed by the **Khaliya Top overnight trek** from Balati Bend at 09:30. Leave bikes and main bags in Munsyari, visit the temple by local transfer, walk to Khaliya and spend the night at a confirmed lodge or supported camp in the area. The exact shelter may be below the summit and must be confirmed for January operation. Madkot and the museum are omitted. Day 05 starts with a daylight descent and morning return to Munsyari, then a conditional ride to **Bageshwar**. Kausani / Baijnath are removed; Day 06 returns via Almora to Kathgodam for the existing 13 January train. Kainchi Dham retains its full Day 02 visit.

Allow roughly 6 km and 4–5 hours for the ascent, plus any walk to the shelter; the following morning’s descent is provisionally 4–6 km / 2–3 hours depending on that shelter. Snow may require longer. The Day 05 road leg needs a rested, clear-road departure from Munsyari by about 11:30; otherwise halt earlier and revise return arrangements. Trek access, meals, sleeping equipment, guide, transfers and shelter location need confirmation before departure. No timetable overrides daylight or conditions.

Trek reference: [Uttarakhand Tourism — Khaliya Top](https://uttarakhandtourism.gov.in/public/blogs/khaliya-top) describes the roughly 6 km Balati Bend approach and winter guide requirements; [Outlook Traveller’s Munsiyari guide](https://www.outlooktraveller.com/destinations/india/ot-itinerary-a-weekend-guide-to-munsiyari-in-uttarakhand) gives the approximately 9 km trailhead transfer and 3,500 m summit. The map uses rounded place-reference coordinates for Khaliya Dwar and the Khaliya area, not a surveyed trail or specific overnight camp.

## Photo credit

Panchachuli image: [Suresh Karia, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Panchchuli_II.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Displayed with cropping and visual overlays. Maps © OpenStreetMap contributors.

Destination photos are bundled in `public/places`, with complete attribution in [`public/places/CREDITS.md`](public/places/CREDITS.md). The UI includes per-photo source and license links. Photos are historical reference views, not live conditions. Stops without a verified photo use category illustrations, and train steps use rail icons. Each stop and place guide offers a Google Maps place-search link.
