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
