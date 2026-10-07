# LydsEvents

A responsive wedding and event coordination website built with React, TypeScript,
and Vite. Includes an animated gallery, the three planning tiers at $500/week,
FAQs, mobile navigation, and a Google Forms consultation integration.

## Develop

Use the existing checkout at `/workspace/Lydia-s-website`. Cloud tasks already
have an isolated workspace; do not create a worktree unless explicitly requested.
Node 24 is specified in `.nvmrc` (Node 22+ supported).

```sh
cd /workspace/Lydia-s-website
npm ci
npm run dev -- --port 5173 --strictPort
```

Open the development server through your development environment's supported
access method. Stop it with Ctrl+C. The site does not need a database or secrets.

```sh
npm test           # Data validation and mocked Google Forms script tests
npm run test:e2e   # Browser tests; includes a mocked Google Forms embed
npm run build     # TypeScript checks and production output in dist/
npm run preview -- --port 4173 --strictPort
```

Browser tests use `/usr/bin/chromium` when available. Otherwise, install the
Playwright browser with `npx playwright install chromium`, or set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible Chromium executable.
The test runner starts the website on ports 5173 and 5174. Leave port 5174 free.

## Connect the consultation form

### Create the consultation Google Form

Follow [the Google Form setup instructions](docs/google-form-setup.md). Run
[`scripts/create-consultation-form.gs`](scripts/create-consultation-form.gs) in
Google Apps Script while signed in to the account that should own the responses.
It creates all seven requested questions and can be rerun without duplicating them.

Copy `.env.example` to `.env.local` and set `VITE_GOOGLE_FORM_URL` to the public
respondent URL ending in `viewform`. Restart the development server, or rebuild
for production. No Google password, token, or private credential belongs here.

Until configured, the consultation section honestly offers a local text download
of the visitor's notes. It does **not** send, persist on a server, or pretend to
submit a request. The live embed replaces that worksheet after configuration.
The selected planning tier is not automatically submitted; the live form asks
visitors to mention it in their support answer. Actual Google submission must be
tested in the form owner's account; automated tests use a local fixture only.

## The real portfolio

Eight original photographs have been imported from the owner's Google Slides
presentation into `public/images/portfolio/`. The hero is the engagement-party
arch. Gallery captions, event themes, and guest counts come from the presentation.
The original presentation also opens in an on-demand viewer with a direct link.

Photo captions and image positions are in `src/content.ts`. The gallery crossfades,
supports arrows, keyboard and swipe controls, and respects reduced-motion settings.

## Open a preview without installing anything

Run `npm run preview:download` to create `artifacts/LydsEvents-preview.html`.
Download and open that single file in a browser. JavaScript, styles, fonts, and
portfolio photographs are embedded, so it needs no development server. Google
Forms and the presentation viewer still require Internet access when opened.
This file is a preview, not a published website.

## Publish the website

This is a static site. Set the hosting build command to `npm run build` and the
output directory to `dist`. Set the public `VITE_GOOGLE_FORM_URL` in the host's
build environment before building. `npm run preview` is for local build checks,
not a production server.

The included `.github/workflows/deploy-pages.yml` publishes `main` using GitHub
Pages. In repository Settings → Pages, select **GitHub Actions** as the source.
Set the public form link as repository variable `VITE_GOOGLE_FORM_URL` when ready;
then rerun **Publish LydsEvents** or push a change. A live deployment is only
confirmed after the Pages API or workflow reports success and the site responds.

Cloud environment publication is separate from deploying the website. Review and
save the cloud configuration draft, then publish the prepared development
environment if you want future tasks to restore it.
