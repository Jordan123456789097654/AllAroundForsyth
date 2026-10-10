# All Around Forsyth

FBLA Website Design 2026 - Forsyth County, GA directory. Built by Jordan Daniels & DJ Reddish.

## Run locally
    npm install
    npm run dev

## Deploy (Vercel)
1. Push this repo to GitHub.
2. Go to vercel.com > Add New Project > import the repo (Next.js is auto-detected).
3. Add env var DISCORD_WEBHOOK_URL (see .env.example) for bug reports.
4. Deploy.

Note: GitHub Pages can't run the bug report API route, so use Vercel/Netlify.

## Presentation tour (for the screen recording)
Start it from Admin > "Start Presentation Tour", or open any page with `?tour=1`
(`?tour=clean` hides every overlay). A 3-2-1 countdown gives you time to hit record.

| Key | Action |
| --- | --- |
| Space | pause / resume |
| Left / Right | previous / next chapter |
| H | hide / show overlays (clean recording) |
| Esc | stop (everything the tour changed is put back) |

Moving the mouse shows a small control bar for 2 seconds. Chapter lengths, order and scripted
clicks live in the `STEPS` list at the top of `app/components/DemoTour.tsx`.
