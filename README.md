# 🔥 Aura Inspector

A viral, Gen Z, completely unscientific aura-scanning experience. The Official Aura Inspection Bureau uses your camera, a 10-second fake "scan" sequence, and a weighted random number generator to certify your aura score (1–1000), rank, metrics, tags, and verdict — then lets you download a shareable certificate.

Everything runs **entirely client-side**. No backend, no database, no auth, no data ever leaves the browser.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Browser Camera API (`getUserMedia`)
- `html2canvas` for certificate image export
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Build for production

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. No environment variables needed — it just works on the free tier.

Or with the CLI:

```bash
npm i -g vercel
vercel
```

## Project structure

```
app/
  layout.tsx          Root layout: nav, ember background, page transitions
  page.tsx             Landing page (hero + privacy notice)
  about/page.tsx        About / creator page
  inspect/page.tsx      Camera → scan sequence → results flow
  globals.css           Design tokens, atmosphere effects, glass panels
components/
  NavBar.tsx
  EmberField.tsx        Floating embers + smoke background
  ScannerFrame.tsx       Reusable HUD corner-bracket wrapper
  ScannerOverlay.tsx     Face box, radar sweep, scanning laser
  LiveMetrics.tsx        Animated metric bars during scanning
  RadarChart.tsx         SVG radar chart for final metrics
  Certificate.tsx        Off-screen certificate layout (captured via html2canvas)
  RareEventOverlay.tsx   "Aura God" / "The Chosen One" cinematic overlays
  PageTransition.tsx     Framer Motion route transition wrapper
lib/
  aura-engine.ts          All scoring logic: ranks, metrics, tags, verdicts, rare events
```

## Notes on the camera

The camera feed is only used to render a live scanner overlay on top of a video preview — no frame is ever captured, analyzed, or stored. The result is 100% randomly generated in `lib/aura-engine.ts`, independent of anything the camera sees.
