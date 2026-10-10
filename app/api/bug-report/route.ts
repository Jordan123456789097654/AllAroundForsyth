// -------------------------------------------------------------
// All Around Forsyth - Bug Report API
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Receives bug reports and forwards them to a Discord webhook.
// Set DISCORD_WEBHOOK_URL in .env.local (kept server-side, never exposed to the browser).
// -------------------------------------------------------------

import { NextResponse } from "next/server";

// tiny in-memory rate limit: 5 reports per IP per 10 minutes
const hits = new Map<string, number[]>();

function clip(value: unknown, max: number): string {
  return String(value ?? "unknown").slice(0, max) || "unknown";
}

export async function POST(request: Request) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Bug reporting is not configured yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) {
    return NextResponse.json({ error: "Too many reports. Please try again later." }, { status: 429 });
  }
  recent.push(now);
  hits.set(ip, recent);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // honeypot field: bots fill it in, people don't
  if (body.website) return NextResponse.json({ ok: true });

  const description = clip(body.description, 1500);
  if (description.trim().length < 5) {
    return NextResponse.json({ error: "Please describe the bug." }, { status: 400 });
  }

  const payload = {
    username: "All Around Forsyth Bugs",
    embeds: [
      {
        title: `🐛 ${clip(body.category, 40)} bug report`,
        description,
        color: 0xe29578,
        fields: [
          { name: "Page", value: clip(body.page, 300) },
          { name: "Device", value: clip(body.deviceType, 40), inline: true },
          { name: "Screen / Viewport", value: `${clip(body.screen, 30)} / ${clip(body.viewport, 30)}`, inline: true },
          { name: "Browser", value: clip(body.userAgent, 400) },
          { name: "Platform", value: clip(body.platform, 60), inline: true },
          { name: "Language", value: clip(body.language, 20), inline: true },
          { name: "Timezone", value: clip(body.timezone, 60), inline: true },
          { name: "Reduced motion", value: clip(body.reducedMotion, 10), inline: true },
          { name: "Contact", value: clip(body.contact || "none given", 120), inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not deliver report." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
