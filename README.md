# Northbound — Munsyari Winter Field Guide

A six-stage rail and bike trip planner for 8–14 January 2027, built with React, TypeScript, Vite, React Router, Framer Motion and Leaflet.

## Run locally

```sh
npm install
npm run dev
```

## Pages

- `/` — journey overview, six chapter links and winter guidance
- `/route` — complete route atlas with selectable journey legs
- `/day/01` — train preparation, overnight packing, boarding and arrival
- `/day/02` through `/day/06` — dedicated daily field guides with maps, mind maps, point-to-point schedules, visit durations, sights, overnight requirements and preparation for the next day

Checklists are saved in the current browser's local storage. Day plans can be copied or printed.

## Validation

```sh
npm run build
npx playwright install chromium
npm run test:e2e
```

## Hosting

This is a client-routed SPA with distinct page URLs. Serve `dist` after `npm run build`, and rewrite non-file routes to `/index.html` so direct links and refreshes work. Netlify (`public/_redirects`) and Vercel (`vercel.json`) rewrite configurations are included. For another host, configure its equivalent history fallback.

## Planning limits

Train times and road distances come from the proposed itinerary and are **not live or independently guaranteed**. Check railway schedules, winter road access, attraction hours and queues before travel. OSM road alignments may differ from planning-distance estimates. Rail and local sightseeing lines are indicative, not turn-by-turn directions. OpenStreetMap tiles need an internet connection; there is no live weather or road-closure feed. Hotels are described by stay requirements, not booked or recommended as confirmed availability.

The primary local day deliberately does not combine a full Khaliya Top trek with the Madkot / temple / museum circuit. Optional sightseeing is not cumulative, and no timetable overrides daylight or road conditions.

## Photo credit

Panchachuli image: [Suresh Karia, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Panchchuli_II.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Displayed with cropping and visual overlays. Maps © OpenStreetMap contributors.
