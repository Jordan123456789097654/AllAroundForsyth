"use client";

// ============================================================================
// All Around Forsyth — Broadcast Presentation Tour Engine
// Coded by Jordan Daniels & DJ Reddish for FBLA Competition 2026
//
// Features:
// - Glassmorphic Lower-Third Chapter Banners with SVG Countdown Ring
// - Live Synchronized Voiceover Teleprompter (Jordan [J] & DJ [DJ])
// - Retake / Repeat Chapter Key ('R') for seamless recording mistakes
// - Concentric Neon Sonar Click Waves & Luminous Cursor Motion Trail
// - Cinematic Feature Zoom / Push-in on spotlighted elements
// - Live Typing Keystroke Indicator with blinking neon caret
// - Golden Confetti / Sparkle Particle Bursts on action events
// - 16:9 Video Framing Crop Guide ('F' key) for OBS / Loom / Screen Studio
// - Subtle Web Audio Synthesizer Chimes ('M' to mute)
// - Quick-Jump Chapter Dropdown & Pause/Resume Timeline Scrubber
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type El = HTMLElement | null | undefined;

export interface Panel {
  title: string;
  items: string[];
  note?: string;
  badge?: string;
  pos?: "top-right" | "bottom-right";
}

interface Ctx {
  until(sec: number): Promise<void>;
  wait(sec: number): Promise<void>;
  find(get: () => El, maxSec?: number): Promise<HTMLElement | null>;
  hover(el: El): Promise<void>;
  click(el: El): Promise<void>;
  type(el: El, text: string, cps?: number): Promise<void>;
  clear(el: El): void;
  pick(el: El, index: number): Promise<void>;
  scrollToEl(el: El, where?: "center" | "top"): Promise<void>;
  scrollTop(): Promise<void>;
  spot(el: El): void;
  unspot(): void;
  endCard(on: boolean): void;
  panel(p: Panel | null): void;
  live(get: (() => Panel | null) | null): void;
  sparkle(x?: number, y?: number): void;
}

interface Step {
  path: string;
  secs: number;
  title: string;
  text: string;
  badge: string;
  speaker: "Jordan" | "DJ" | "Both";
  script: string;
  scroll?: false | { from?: number; to?: number };
  spotTitle?: boolean;
  run?: (c: Ctx) => Promise<void>;
  cleanup?: () => void | Promise<void>;
}

// ---------- DOM Query Helpers ----------
const visible = (e: HTMLElement) => e.getClientRects().length > 0;
const qa = (sel: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(sel)).filter(
    (e) => !e.closest("[data-tour-ui]") && visible(e)
  );
const qs = (sel: string) => qa(sel)[0] ?? null;

const under = (label: string) => {
  const span = qa("#crowd-meter span").find((e) =>
    (e.textContent || "").includes(label)
  );
  return span?.parentElement?.querySelector("h4")?.textContent?.trim() || "";
};

const cardNames = () =>
  qa("main .group h3")
    .map((e) => (e.textContent || "").trim())
    .filter(Boolean);

function byText(sel: string, text: string, exact = false): HTMLElement | null {
  const t = text.toLowerCase();
  return (
    qa(sel).find((e) => {
      const s = (e.textContent || "").trim().toLowerCase();
      return exact ? s === t : s.includes(t);
    }) ?? null
  );
}

function setNativeValue(
  el: HTMLElement,
  v: string,
  evt: "input" | "change" = "input"
) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : el instanceof HTMLSelectElement
      ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, v);
  el.dispatchEvent(new Event(evt, { bubbles: true }));
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ---------- Cleanup Helpers ----------
function closePalette() {
  byText("button", "ESC", true)?.click();
}

function resetTheme() {
  const root = document.documentElement;
  if (root.classList.contains("dark")) byText("button.tool-btn", "Light")?.click();
  if (root.lang === "es") byText("button.tool-btn", "English")?.click();
}

async function resetA11y() {
  const root = document.documentElement;
  const dirty =
    root.classList.contains("high-contrast") ||
    root.classList.contains("font-dyslexic") ||
    /text-scale-(large|xlarge)/.test(root.className);
  if (!dirty) return;
  const toggle = () =>
    qs('button[aria-label="Toggle Accessibility Toolbar"]')?.click();
  const wasOpen = !!byText("button", "Reset Defaults");
  if (!wasOpen) {
    toggle();
    await sleep(150);
  }
  byText("button", "Reset Defaults")?.click();
  await sleep(100);
  toggle();
}

const a11yRow = (label: string) =>
  byText("span", label)?.closest("div.flex")?.querySelector<HTMLElement>("button");

// ---------- Web Audio Synthesizer (Optional Chimes) ----------
let audioCtx: AudioContext | null = null;
function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playSound(type: "chime" | "click" | "success") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(620, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "chime") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {}
}

// ---------- Chapter Definitions with Badges & Teleprompter Lines ----------
const STEPS: Step[] = [
  {
    path: "/",
    secs: 26,
    title: "Welcome to All Around Forsyth",
    text: "Live Cumming weather, Lake Lanier elevation & outdoor trail AQI",
    badge: "USGS & OPEN-METEO APIS",
    speaker: "Both",
    script: "Hi everyone, we're Jordan Daniels and DJ Reddish, and this is All Around Forsyth — a centralized community guide for Forsyth County, Georgia.",
    scroll: { from: 4 },
    run: async (c) => {
      await c.until(8);
      await c.hover(byText("a,button", "Explore Live Interactive Map"));
    },
  },
  {
    path: "/",
    secs: 16,
    title: "Instant Directory Search",
    text: "Press Cmd/Ctrl + K to search every park, department & local business",
    badge: "GLOBAL CMD+K PALETTE",
    speaker: "Jordan",
    script: "Residents can press Command K from any page to instantly search across 10 county parks, local businesses, and municipal departments.",
    scroll: false,
    spotTitle: false,
    run: async (c) => {
      await c.until(2);
      const open = await c.find(
        () => qs('button[title^="Search directory"]') || byText("button", "Quick Search"),
        3
      );
      await c.click(open);
      const input = await c.find(
        () => qs('input[placeholder^="Search parks, businesses"]'),
        3
      );
      await c.wait(0.5);
      await c.type(input, "Sheriff", 9);
      await c.wait(2.5);
      c.clear(input);
      await c.wait(0.4);
      await c.type(input, "Park", 9);
      await c.wait(2.5);
      await c.click(byText("button", "ESC", true));
    },
    cleanup: closePalette,
  },
  {
    path: "/",
    secs: 22,
    title: "Best Time to Visit",
    text: "Interactive crowd meter estimating peak rush vs. quiet hours",
    badge: "VISITOR CROWD METER",
    speaker: "DJ",
    script: "Our crowd meter analyzes weekend and weekday visit patterns for Halcyon, Sawnee Mountain, and Central Park so families can beat the rush.",
    scroll: false,
    spotTitle: false,
    run: async (c) => {
      await c.until(1.5);
      c.live(() => ({
        title: "Best Time to Visit",
        items: [
          `Quiet Window: ${under("Best Quiet Window") || "Early Morning"}`,
          `Rush Window: ${under("Peak Rush Window") || "Afternoon Peak"}`,
        ],
        note: "Updates live based on day and landmark selected",
        badge: "LIVE PREDICTION",
        pos: "bottom-right",
      }));
      await c.scrollToEl(qs("#crowd-meter"), "top");
      await c.wait(0.6);
      await c.click(byText("button", "Saturday"));
      await c.wait(2);
      await c.click(byText("button", "Sunday"));
      await c.wait(1.5);
      await c.click(byText("button", "Mon - Thu"));
      await c.wait(1);
      await c.click(qa("#crowd-meter .grid button")[1]);
      await c.wait(1.8);
      await c.click(qa("#crowd-meter .grid button")[2]);
    },
  },
  {
    path: "/",
    secs: 14,
    title: "Dark Mode & Español",
    text: "Eye-comfort night viewing and bilingual accessibility for our community",
    badge: "BILINGUAL & THEMES",
    speaker: "Jordan",
    script: "With a single click in the bottom toolbar, users can switch into dark mode for night reading, or toggle Spanish for bilingual household access.",
    scroll: false,
    spotTitle: false,
    run: async (c) => {
      await c.until(1.5);
      c.panel({
        title: "Adaptive Theme Engine",
        items: [
          "Instant system dark mode inversion",
          "Spanish localization across headings & labels",
          "Persistent preference saved to localStorage",
        ],
        badge: "ACCESSIBILITY",
      });
      await c.click(byText("button.tool-btn", "Dark"));
      await c.until(5.5);
      await c.click(byText("button.tool-btn", "Español"));
      await c.until(9.5);
      await c.click(byText("button.tool-btn", "English"));
      await c.wait(0.8);
      await c.click(byText("button.tool-btn", "Light"));
      c.panel(null);
    },
    cleanup: resetTheme,
  },
  {
    path: "/map",
    secs: 32,
    title: "Live Interactive County Map",
    text: "Satellite, terrain and street views of Forsyth landmarks with GPS pins",
    badge: "LEAFLET + MAPBOX TILES",
    speaker: "DJ",
    script: "Our interactive county map pins every park, municipal building, and business. Users can toggle satellite imagery and filter by category.",
    scroll: false,
    run: async (c) => {
      await c.until(4);
      await c.click(byText("button", "Parks ("));
      await c.wait(1);
      await c.click(byText("button", "🌲"));
      await c.until(10.5);
      const sat = byText("button", "Satellite");
      await c.click(sat);
      await c.until(14.5);
      await c.click(byText("button", "Terrain"));
      await c.until(17);
      await c.click(sat?.parentElement?.firstElementChild as El);
      await c.wait(0.8);
      await c.click(byText("button", "Businesses ("));
      await c.wait(1);
      await c.click(byText("button", "🏆"));
      await c.until(25);
      await c.click(byText("button", "Landmarks ("));
      await c.wait(1.2);
      await c.click(byText("button", "All Pins"));
      await c.wait(1);
      await c.click(byText("button", "Reset County View"));
    },
  },
  {
    path: "/parks",
    secs: 24,
    title: "Parks & Recreation Directory",
    text: "Search 960+ acres across 10 parks with live amenity filtering",
    badge: "COUNTY PARKS DEPT DATA",
    speaker: "Jordan",
    script: "Over 960 acres of parks are cataloged with official acreage, contact numbers, and amenity tags like dog parks, boat ramps, and paved trails.",
    scroll: { from: 15, to: 22 },
    run: async (c) => {
      await c.until(3.5);
      c.live(() => {
        const names = cardNames();
        return {
          title: "Filtered Results",
          items: names.length ? names.slice(0, 6) : ["Searching..."],
          note: `${names.length} county parks currently matching`,
          badge: "REAL-TIME FILTER",
        };
      });
      const search = await c.find(() => qs('input[placeholder^="Search parks"]'), 3);
      await c.type(search, "trail", 8);
      await c.wait(2.4);
      c.clear(search);
      await c.wait(0.4);
      await c.click(byText("button", "Playground"));
      await c.wait(2.4);
      await c.click(byText("button", "All Parks"));
    },
  },
  {
    path: "/top-10",
    secs: 28,
    title: "Verified Community Businesses",
    text: "Locally owned dining, entertainment and retail across Cumming",
    badge: "SMALL BUSINESS DIRECTORY",
    speaker: "DJ",
    script: "Instead of an arbitrary top ten list, this section celebrates local small businesses that make Forsyth unique, complete with verified addresses.",
    scroll: { from: 22, to: 26.5 },
    run: async (c) => {
      await c.until(3.5);
      c.live(() => {
        const typed = (
          (qs('input[placeholder^="e.g. Tam"]') as HTMLInputElement | null)?.value || ""
        ).trim();
        const names = cardNames();
        return {
          title: "Community Roster",
          items: [...(typed ? [`+ Nominated: ${typed}`] : []), ...names].slice(0, 7),
          note: typed ? "Instant live reactivity" : `${names.length} verified listings`,
          badge: "LOCAL ECONOMY",
        };
      });
      await c.click(byText("button", "Dining"));
      await c.wait(1.6);
      await c.click(byText("button", "Town Centers"));
      await c.wait(1.6);
      await c.click(byText("button", "Entertainment"));
      await c.wait(1.6);
      await c.click(byText("button", "All Community"));
      await c.wait(1);
      await c.click(byText("button", "Nominate a Local Business"));
      const name = await c.find(() => qs('input[placeholder^="e.g. Tam"]'), 3);
      await c.wait(0.4);
      await c.type(name, "Tam's Backstage", 14);
      await c.wait(1.6);
      await c.click(byText("button", "Cancel", true));
    },
  },
  {
    path: "/submit-business",
    secs: 20,
    title: "Business Self-Submission Portal",
    text: "Instant directory publishing with automated validation and local storage",
    badge: "INSTANT AUTO-APPROVAL",
    speaker: "Jordan",
    script: "Any local business owner can register their own establishment. Our system validates the submission and publishes it immediately.",
    scroll: { from: 15, to: 19 },
    run: async (c) => {
      await c.until(3.5);
      c.live(() => {
        const field = (label: string, sel: string) => {
          const v = (
            (qs(sel) as HTMLInputElement | HTMLTextAreaElement | null)?.value || ""
          ).trim();
          const shown = v.length > 30 ? v.slice(0, 30) + "…" : v;
          return { done: !!v, text: `${label}: ${shown || "—"}` };
        };
        const rows = [
          field("Business", 'input[placeholder^="e.g. Cherry"]'),
          field("Location", 'input[placeholder^="e.g. 6365"]'),
          field("Phone", 'input[placeholder^="e.g. (770)"]'),
          field("About", "main textarea"),
        ];
        return {
          title: "Submission Status",
          items: rows.map((r) => `${r.done ? "✓" : "○"} ${r.text}`),
          note: "Real-time client validation with instant directory publishing",
          badge: "FORM STATE",
        };
      });
      await c.type(
        await c.find(() => qs('input[placeholder^="e.g. Cherry Street"]'), 3),
        "Sample Coffee Co.",
        20
      );
      await c.wait(0.3);
      await c.type(
        qs('input[placeholder^="e.g. 6365"]'),
        "123 Main St, Cumming, GA 30040",
        24
      );
      await c.wait(0.3);
      await c.pick(qs("main select"), 1);
      await c.type(qs('input[placeholder^="e.g. (770)"]'), "(770) 555-0199", 18);
      await c.wait(0.3);
      await c.type(
        qs("main textarea"),
        "Locally roasted coffee and fresh pastries.",
        26
      );
    },
  },
  {
    path: "/events",
    secs: 30,
    title: "Forsyth Community Calendar",
    text: "Festivals, farmers markets and fairgrounds gatherings with submission modal",
    badge: "COMMUNITY CALENDAR",
    speaker: "DJ",
    script: "Whether it's the Cumming Country Fair, 5K races, or weekly farmers markets, residents and visitors always know what is happening this weekend.",
    scroll: false,
    run: async (c) => {
      await c.until(3.5);
      await c.click(byText("button", "Farmers Markets"));
      await c.wait(1.4);
      await c.click(byText("button", "Concerts & Music"));
      await c.wait(1.4);
      await c.click(byText("button", "All Upcoming"));
      await c.wait(1.2);
      await c.click(byText("button", "Submit Community Event"));
      const title = await c.find(() => qs('input[placeholder^="e.g. Vickery"]'), 3);
      c.live(() => {
        const val = (sel: string) =>
          ((qs(sel) as HTMLInputElement | null)?.value || "").trim();
        const name = val('input[placeholder^="e.g. Vickery"]');
        const when = val('input[placeholder^="e.g. October"]');
        const where = val('input[placeholder^="e.g. Cumming Fairgrounds"]');
        const mine = name ? [[name, when, where].filter(Boolean).join(" · ")] : [];
        const names = cardNames();
        return {
          title: "Calendar Preview",
          items: [...mine, ...names].slice(0, 6),
          note: name ? "Inserted at top of timeline" : "Type to preview",
          badge: "MODAL DIALOG",
        };
      });
      await c.wait(0.4);
      await c.type(title, "Vickery Village Fall 5K", 18);
      await c.wait(0.4);
      await c.type(qs('input[placeholder^="e.g. October"]'), "October 24, 2026", 20);
      await c.wait(0.4);
      await c.type(
        qs('input[placeholder^="e.g. Cumming Fairgrounds"]'),
        "Vickery Village",
        18
      );
      await c.wait(1.6);
      await c.click(qs("div.fixed.inset-0 button.absolute"));
    },
  },
  {
    path: "/civic",
    secs: 26,
    title: "Civic Leadership & Government",
    text: "Sheriff Freeman, Commission Chair and Board of Commissioners roster",
    badge: "CIVIC GOVERNANCE",
    speaker: "Jordan",
    script: "To encourage civic engagement, we built a dedicated leadership directory featuring Sheriff Ron Freeman, the County Commission, and department heads.",
    scroll: false,
    run: async (c) => {
      await c.until(2);
      const search = await c.find(
        () => qs('input[placeholder^="Search departments"]'),
        3
      );
      await c.type(search, "Sheriff", 9);
      await c.wait(2.2);
      c.clear(search);
      await c.wait(0.4);
      await c.click(byText("main button", "Safety", true));
      await c.wait(2.2);
      await c.click(byText("main button", "Courts", true));
      await c.wait(2);
      await c.click(byText("main button", "All", true));
    },
  },
  {
    path: "/emergency",
    secs: 18,
    title: "Emergency & Public Safety",
    text: "One-touch 911, non-emergency dispatch, poison control and utility hotlines",
    badge: "911 / PUBLIC SAFETY",
    speaker: "DJ",
    script: "In an emergency, seconds matter. Important public safety numbers, non-emergency dispatch, and hospital contacts are centralized in one click.",
    scroll: false,
    run: async (c) => {
      await c.until(1.5);
      await c.click(byText("button", "Medical", true));
      await c.wait(2.2);
      await c.click(byText("button", "Utility", true));
      await c.wait(2);
      await c.click(byText("button", "All", true));
    },
  },
  {
    path: "/history",
    secs: 24,
    title: "Forsyth County Heritage & Poole's Mill",
    text: "1832 county timeline & interactive 1901 Town lattice-truss architectural diagram",
    badge: "INTERACTIVE ARCHITECTURE",
    speaker: "Jordan",
    script: "We dive deep into local history with an 1832 timeline and an interactive diagram of the historic 1901 Poole's Mill Covered Bridge over Settendown Creek.",
    scroll: { from: 2, to: 9 },
    run: async (c) => {
      await c.until(10);
      const pins = () => qa("main button.absolute.rounded-full");
      const first = await c.find(() => pins()[0], 3);
      await c.scrollToEl(first?.parentElement, "center");
      await c.click(pins()[1]);
      await c.until(14);
      await c.click(pins()[2]);
      await c.until(17.5);
      await c.click(pins()[3]);
      await c.until(20);
      await c.click(byText("button", "Real Photo"));
      await c.until(22.5);
      await c.click(byText("button", "Blueprint"));
    },
  },
  {
    path: "/sources",
    secs: 10,
    title: "Official Sources & Photo Credits",
    text: "Complete attribution for county data, USGS streams, NOAA weather & photography",
    badge: "FBLA COPYRIGHT & CREDITS",
    speaker: "DJ",
    script: "Academic and competitive integrity matters to us. Every single data feed, API, and photograph is thoroughly attributed on our Sources page.",
    spotTitle: false,
    run: async (c) => {
      await c.until(1);
      c.spot(qs("main h3"));
      await c.until(4);
      c.unspot();
    },
  },
  {
    path: "/favorites",
    secs: 16,
    title: "Personalized Place Favorites",
    text: "Save parks and local businesses on your own device without an account",
    badge: "LOCALSTORAGE PERSISTENCE",
    speaker: "Jordan",
    script: "Visitors can star any park or local business to save their personal favorites, stored privately on their device without requiring accounts.",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      const add = 'button[aria-label^="Add to favorites"]';
      await c.click(await c.find(() => qs(add), 3));
      c.sparkle();
      await c.wait(0.5);
      await c.click(qs(add));
      c.sparkle();
      await c.wait(0.5);
      const adds = qa(add);
      await c.click(adds[adds.length - 1]);
      c.sparkle();
      await c.wait(0.8);
      await c.scrollTop();
      c.spot(qs("#saved-h")?.parentElement);
      await c.wait(3.5);
      c.unspot();
    },
  },
  {
    path: "/trip-planner",
    secs: 20,
    title: "Day Itinerary Trip Planner",
    text: "Build a customized Forsyth day schedule with time slots and print it out",
    badge: "PRINTABLE ITINERARY",
    speaker: "DJ",
    script: "Our Trip Planner lets families assemble a personalized day in Forsyth County, automatically assigning 2-hour stops with a one-click printable schedule.",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      c.live(() => {
        const stops = qa("main ol > li");
        const rows = stops.slice(0, 5).map((li) => {
          const time = li.querySelector("span")?.textContent?.trim() || "";
          const name = li.querySelector("strong")?.textContent?.trim() || "";
          return `${time} · ${name}`;
        });
        return {
          title: "Customized Itinerary",
          items: rows.length ? rows : ["No stops selected"],
          note: `${stops.length} stops generated with 2-hour scheduling`,
          badge: "DAY PLANNER",
          pos: "bottom-right",
        };
      });
      await c.pick(await c.find(() => qs("main select"), 3), 3);
      const boxes = qa('main input[type="checkbox"]');
      const picks = Array.from(
        new Set([0, 3, 10, 12].filter((n) => n < boxes.length))
      );
      for (const n of picks) {
        await c.click(boxes[n]);
        c.sparkle();
        await c.wait(0.5);
      }
      await c.wait(0.5);
      c.spot(qs("main ol"));
      await c.wait(3);
      c.unspot();
      await c.hover(byText("button", "Print my plan"));
    },
  },
  {
    path: "/accessibility",
    secs: 24,
    title: "Accessibility & WCAG 2.1 AA",
    text: "High-contrast mode, OpenDyslexic font, text resizing & reading guide bar",
    badge: "ADA / WCAG 2.1 COMPLIANT",
    speaker: "Both",
    script: "We engineered All Around Forsyth to be accessible for everyone — featuring high contrast, dyslexia font, text scaling up to 125%, and screen reader landmarks.",
    scroll: { from: 20, to: 23 },
    run: async (c) => {
      await c.until(3);
      c.panel({
        title: "Accessibility Toolbar",
        items: [
          "High contrast black/yellow themes",
          "Text scale at 112% and 125%",
          "OpenDyslexic typography option",
          "Reading guide tracking bar",
          "Automatic reduced-motion support",
        ],
        badge: "WCAG 2.1 AA",
      });
      await c.click(qs('button[aria-label="Toggle Accessibility Toolbar"]'));
      await c.wait(0.6);
      await c.click(a11yRow("High Contrast"));
      await c.wait(1.8);
      await c.click(byText("button", "Large (112%)"));
      await c.wait(1.6);
      await c.click(byText("button", "XL (125%)"));
      await c.wait(1.8);
      await c.click(a11yRow("Dyslexi"));
      await c.wait(2);
      await c.click(byText("button", "Reset Defaults"));
      await c.wait(0.6);
      await c.click(qs('button[aria-label="Toggle Accessibility Toolbar"]'));
      c.panel(null);
    },
    cleanup: resetA11y,
  },
  {
    path: "/copyright",
    secs: 10,
    title: "Copyright & Student Authorship",
    text: "Built and designed exclusively by Jordan Daniels & DJ Reddish",
    badge: "INTELLECTUAL PROPERTY",
    speaker: "Jordan",
    script: "This project is the original work of Jordan Daniels and DJ Reddish. All custom code, designs, and branding are protected by copyright.",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      c.endCard(true);
    },
  },
  {
    path: "/judge",
    secs: 22,
    title: "Judges Portal & Rubric Matrix",
    text: "Interactive scorecard mapping competition requirements directly to code",
    badge: "FBLA RUBRIC AUDIT",
    speaker: "DJ",
    script: "To make evaluation effortless for our judges, our dedicated Judge Portal maps every single FBLA rubric standard directly to our implementation. Thank you!",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      await c.click(byText("button", "Rubric Scorecard"));
      await c.wait(2.5);
      await c.click(byText("button", "4-Minute Presentation"));
      await c.wait(2.5);
      await c.click(byText("button", "Design"));
    },
  },
];

const TOTAL = STEPS.reduce((a, s) => a + s.secs, 0);
const OFFSETS = STEPS.map((_, i) =>
  STEPS.slice(0, i).reduce((a, s) => a + s.secs, 0)
);
const mins = Math.floor(TOTAL / 60);
const rest = String(TOTAL % 60).padStart(2, "0");
export const TOUR_LENGTH = `${mins}:${rest}`;

const FAV_KEY = "aaf_favorites";
const ABORT = new Error("tour-step-ended");

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Phase = "idle" | "count" | "run";

export default function DemoTour() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(3);
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState(true);
  const [teleprompter, setTeleprompter] = useState(true);
  const [frameGuide, setFrameGuide] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [barOn, setBarOn] = useState(false);
  const [endCard, setEndCard] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepClock, setStepClock] = useState(0);
  const [typingPreview, setTypingPreview] = useState<string | null>(null);

  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const ctl = useRef<{
    jump: (d: number) => void;
    restartCurrent: () => void;
    togglePause: () => void;
    goTo: (index: number) => void;
  } | null>(null);

  const begin = useCallback((clean: boolean) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setHud(!clean);
    setCount(3);
    setPhase((p) => (p === "idle" ? "count" : p));
  }, []);

  // Admin page button trigger
  useEffect(() => {
    const onStart = () => begin(false);
    window.addEventListener("aaf-start-tour", onStart);
    return () => window.removeEventListener("aaf-start-tour", onStart);
  }, [begin]);

  // URL query parameter (?tour=1 or ?tour=clean)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tour");
    if (!q) return;
    const t = setTimeout(() => begin(q === "clean"), 500);
    return () => clearTimeout(t);
  }, [begin]);

  // 3-2-1 Countdown before start
  useEffect(() => {
    if (phase !== "count") return;
    if (soundEnabled) playSound("click");
    const t = setTimeout(() => {
      if (count <= 1) {
        if (soundEnabled) playSound("chime");
        setPhase("run");
      } else {
        setCount(count - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, count, soundEnabled]);

  // Keyboard Shortcuts:
  // Space = Pause/Resume
  // Left/Right = Prev/Next Chapter
  // R = Retake / Restart Chapter
  // T = Toggle Teleprompter
  // F = Toggle 16:9 Frame Guide
  // H = Hide/Show Overlays
  // M = Toggle Sound Chimes
  // Esc = Stop
  useEffect(() => {
    if (phase === "idle") return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        setPhase("idle");
        return;
      }
      if (phase !== "run") return;
      if (e.key === " ") {
        e.preventDefault();
        ctl.current?.togglePause();
      } else if (e.key === "ArrowRight") {
        ctl.current?.jump(1);
      } else if (e.key === "ArrowLeft") {
        ctl.current?.jump(-1);
      } else if (e.key === "r" || e.key === "R") {
        ctl.current?.restartCurrent();
      } else if (e.key === "t" || e.key === "T") {
        setTeleprompter((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        setFrameGuide((prev) => !prev);
      } else if (e.key === "h" || e.key === "H") {
        setHud((prev) => !prev);
      } else if (e.key === "m" || e.key === "M") {
        setSoundEnabled((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // Controls revealed when moving the mouse
  useEffect(() => {
    if (phase !== "run") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function onMove() {
      setBarOn(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setBarOn(false), 2400);
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (timer) clearTimeout(timer);
      setBarOn(false);
    };
  }, [phase]);

  // ============================================================================
  // TOUR AUTOMATION ENGINE
  // ============================================================================
  useEffect(() => {
    if (phase !== "run") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smooth = (): ScrollBehavior =>
      reduce ? ("instant" as ScrollBehavior) : "smooth";

    let savedFavs: string | null = null;
    try {
      savedFavs = localStorage.getItem(FAV_KEY);
    } catch {}

    interface Waiter {
      at: number;
      res: () => void;
      rej: (e: unknown) => void;
    }
    let waiters: Waiter[] = [];
    let idx = -1;
    let clock = 0;
    let last = performance.now();
    let token = 0;
    let isPaused = false;
    let raf = 0;
    let spotEl: HTMLElement | null = null;
    let liveGet: (() => Panel | null) | null = null;
    let lastLive = "";
    let cx = -1;
    let cy = -1;
    const scr = { init: false, start: 0, last: 0 };

    // Spotlight pulsing ring
    const pulse =
      !reduce && spotRef.current?.animate
        ? spotRef.current.animate(
            [{ outlineOffset: "3px" }, { outlineOffset: "9px" }],
            {
              duration: 900,
              iterations: Infinity,
              direction: "alternate",
              easing: "ease-in-out",
            }
          )
        : null;

    // ----- Cursor & Motion Trail -----
    function moveCursor(x: number, y: number, ms: number) {
      const el = cursorRef.current;
      if (!el) return;
      if (cx < 0) {
        cx = window.innerWidth * 0.55;
        cy = window.innerHeight * 0.85;
        el.style.transition = "none";
        el.style.transform = `translate(${cx}px, ${cy}px)`;
        void el.offsetWidth;
      }

      // Spawn trail particle
      if (!reduce && Math.hypot(x - cx, y - cy) > 25) {
        const dot = document.createElement("div");
        dot.setAttribute("data-tour-ui", "");
        Object.assign(dot.style, {
          position: "fixed",
          left: `${(cx + x) / 2}px`,
          top: `${(cy + y) / 2}px`,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#2A8C82",
          boxShadow: "0 0 10px #2A8C82",
          pointerEvents: "none",
          opacity: "0.7",
          zIndex: "89",
          transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
        });
        document.body.appendChild(dot);
        requestAnimationFrame(() => {
          dot.style.transform = "scale(0.2)";
          dot.style.opacity = "0";
        });
        setTimeout(() => dot.remove(), 400);
      }

      el.style.opacity = "1";
      el.style.transition = reduce
        ? "none"
        : `transform ${ms}ms cubic-bezier(.45,0,.2,1), opacity .3s`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      cx = x;
      cy = y;
    }

    // ----- Concentric Neon Click Waves -----
    function ripple(x: number, y: number) {
      if (soundEnabled) playSound("click");

      // Outer Coral Wave
      const outer = document.createElement("div");
      outer.setAttribute("data-tour-ui", "");
      Object.assign(outer.style, {
        position: "fixed",
        left: x - 28 + "px",
        top: y - 28 + "px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        border: "2.5px solid rgba(226,149,120,.95)",
        background:
          "radial-gradient(circle, rgba(226,149,120,.35) 0%, rgba(226,149,120,.05) 75%)",
        boxShadow: "0 0 16px rgba(226,149,120,.55)",
        pointerEvents: "none",
        zIndex: "86",
      });
      document.body.appendChild(outer);

      // Inner Teal Wave
      const inner = document.createElement("div");
      inner.setAttribute("data-tour-ui", "");
      Object.assign(inner.style, {
        position: "fixed",
        left: x - 18 + "px",
        top: y - 18 + "px",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "2px solid rgba(42,140,130,.9)",
        boxShadow: "0 0 12px rgba(42,140,130,.7)",
        pointerEvents: "none",
        zIndex: "87",
      });
      document.body.appendChild(inner);

      if (reduce) {
        setTimeout(() => {
          outer.remove();
          inner.remove();
        }, 300);
        return;
      }

      outer.animate(
        [
          { transform: "scale(.3)", opacity: 1 },
          { transform: "scale(1.5)", opacity: 0.7, offset: 0.5 },
          { transform: "scale(2.2)", opacity: 0 },
        ],
        { duration: 750, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = () => outer.remove();

      inner.animate(
        [
          { transform: "scale(.2)", opacity: 1 },
          { transform: "scale(1.7)", opacity: 0 },
        ],
        { duration: 600, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = () => inner.remove();

      cursorRef.current?.firstElementChild?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(.82)", offset: 0.35 },
          { transform: "scale(1.06)", offset: 0.7 },
          { transform: "scale(1)" },
        ],
        { duration: 260, easing: "ease-out" }
      );
    }

    // ----- Gold Sparkle Particle Burst -----
    function triggerSparkle(x?: number, y?: number) {
      if (soundEnabled) playSound("success");
      const targetX = x ?? cx;
      const targetY = y ?? cy;
      const count = 12;
      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.setAttribute("data-tour-ui", "");
        const color = i % 2 === 0 ? "#FBBF24" : "#E29578";
        Object.assign(p.style, {
          position: "fixed",
          left: `${targetX}px`,
          top: `${targetY}px`,
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
          pointerEvents: "none",
          zIndex: "92",
        });
        document.body.appendChild(p);

        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5);
        const dist = 35 + Math.random() * 45;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 15;

        p.animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            {
              transform: `translate(${dx}px, ${dy}px) scale(0)`,
              opacity: 0,
            },
          ],
          { duration: 600 + Math.random() * 200, easing: "cubic-bezier(0,0,.2,1)" }
        ).onfinish = () => p.remove();
      }
    }

    const aim = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.min(window.innerWidth - 20, r.left + Math.min(r.width * 0.55, 160)),
        y: r.top + Math.min(r.height * 0.5, 40),
      };
    };

    // ----- Chapter Automation Context -----
    function makeCtx(t: number): Ctx {
      const until = (at: number) =>
        new Promise<void>((res, rej) => {
          if (t !== token) return rej(ABORT);
          if (clock >= at) return res();
          waiters.push({ at, res, rej });
        });
      const wait = (sec: number) => until(clock + sec);

      async function reveal(el: HTMLElement) {
        const r = el.getBoundingClientRect();
        const top = 90;
        const bottom = window.innerHeight - 40;
        if (r.top >= top && r.bottom <= bottom) return;
        if (r.height > bottom - top && r.top < bottom && r.bottom > top) return;
        const y =
          window.scrollY + r.top - window.innerHeight / 2 + r.height / 2;
        window.scrollTo({ top: Math.max(0, y), behavior: smooth() });
        await wait(0.9);
      }

      async function glide(el: HTMLElement) {
        const p = aim(el);
        const dist = Math.hypot(p.x - (cx < 0 ? p.x : cx), p.y - (cy < 0 ? p.y : cy));
        const dur = Math.min(1100, 450 + dist / 2);
        moveCursor(p.x, p.y, dur);
        await wait(dur / 1000 + 0.1);
        return p;
      }

      const c: Ctx = {
        until,
        wait,
        async find(get, maxSec = 4) {
          for (let i = 0; i < maxSec * 10; i++) {
            const e = get();
            if (e) return e;
            await wait(0.1);
          }
          return null;
        },
        async hover(el) {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          await glide(el);
        },
        async click(el) {
          if (!el || !el.isConnected) return;
          await reveal(el);
          const p = await glide(el);
          ripple(p.x, p.y);
          if (el.matches('input:not([type="checkbox"]),textarea,select')) el.focus();
          el.click();
          await wait(0.25);
        },
        async type(el, text, cps = 14) {
          if (!el) return;
          await c.click(el);
          setTypingPreview(text);
          for (let i = 1; i <= text.length; i++) {
            setNativeValue(el, text.slice(0, i));
            await wait((1 / cps) * (0.6 + Math.random() * 0.8));
          }
          await wait(0.4);
          setTypingPreview(null);
        },
        clear(el) {
          if (el) setNativeValue(el, "");
        },
        async pick(el, index) {
          if (!el) return;
          await c.click(el);
          const sel = el as HTMLSelectElement;
          const opt = sel.options?.[index];
          if (opt) setNativeValue(el, opt.value, "change");
          await wait(0.6);
        },
        async scrollToEl(el, where = "center") {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const y =
            where === "top"
              ? window.scrollY + r.top - 96
              : window.scrollY + r.top - window.innerHeight / 2 + r.height / 2;
          window.scrollTo({ top: Math.max(0, y), behavior: smooth() });
          await wait(1.1);
        },
        async scrollTop() {
          window.scrollTo({ top: 0, behavior: smooth() });
          await wait(1);
        },
        spot(el) {
          if (t === token) {
            if (spotEl) {
              spotEl.style.transition = "";
              spotEl.style.transform = "";
            }
            spotEl = el ?? null;
            // Cinematic feature zoom push-in
            if (spotEl && !reduce) {
              spotEl.style.transition = "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)";
              spotEl.style.transform = "scale(1.035)";
            }
          }
        },
        unspot() {
          if (t === token) {
            if (spotEl) {
              spotEl.style.transition = "transform 0.4s ease-out";
              spotEl.style.transform = "";
            }
            spotEl = null;
          }
        },
        endCard(on) {
          if (t === token) setEndCard(on);
        },
        panel(p) {
          if (t !== token) return;
          liveGet = null;
          lastLive = "";
          setPanel(p);
        },
        live(get) {
          if (t === token) liveGet = get;
        },
        sparkle: triggerSparkle,
      };
      return c;
    }

    async function runStep(i: number, t: number) {
      const s = STEPS[i];
      const c = makeCtx(t);
      try {
        if (s.spotTitle !== false) {
          await c.until(0.8);
          c.spot(qs("main h1"));
          await c.until(3.2);
          c.unspot();
        }
        await s.run?.(c);
      } catch (e) {
        if (e !== ABORT) console.warn("[tour] step script problem:", e);
      }
    }

    function go(i: number) {
      if (idx >= 0) {
        try {
          if (spotEl) {
            spotEl.style.transform = "";
            spotEl.style.transition = "";
          }
          Promise.resolve(STEPS[idx].cleanup?.()).catch(() => {});
        } catch {}
      }
      token++;
      waiters.forEach((w) => w.rej(ABORT));
      waiters = [];
      spotEl = null;
      liveGet = null;
      lastLive = "";
      setPanel(null);
      setEndCard(false);
      setTypingPreview(null);
      const prevPath = idx >= 0 ? STEPS[idx].path : null;
      idx = i;
      clock = 0;
      scr.init = false;
      isPaused = false;
      setPaused(false);
      setActiveStep(i);
      setStepClock(0);

      if (soundEnabled) playSound("chime");

      router.push(STEPS[i].path);
      window.scrollTo({
        top: 0,
        behavior:
          prevPath === STEPS[i].path && !reduce
            ? "smooth"
            : ("instant" as ScrollBehavior),
      });
      void runStep(i, token);
    }

    ctl.current = {
      jump: (d) => {
        const n = idx + d;
        if (n >= STEPS.length) setPhase("idle");
        else go(Math.max(0, n));
      },
      restartCurrent: () => {
        go(idx);
      },
      togglePause: () => {
        isPaused = !isPaused;
        setPaused(isPaused);
        if (!isPaused) {
          last = performance.now();
          scr.last = window.scrollY;
        }
      },
      goTo: (index) => {
        go(Math.max(0, Math.min(STEPS.length - 1, index)));
      },
    };

    function frame(now: number) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!isPaused) {
        clock += dt;
        setStepClock(clock);
      }
      const s = STEPS[idx];

      if (progressRef.current) {
        progressRef.current.style.width =
          Math.min(100, ((OFFSETS[idx] + clock) / TOTAL) * 100) + "%";
      }

      // Resolve step timers
      if (waiters.length) {
        const due = waiters.filter((w) => w.at <= clock);
        if (due.length) {
          waiters = waiters.filter((w) => w.at > clock);
          due.forEach((w) => w.res());
        }
      }

      // Auto-scroll
      if (!isPaused && !reduce && s.scroll !== false) {
        const from = s.scroll?.from ?? 3;
        const to = s.scroll?.to ?? s.secs * 0.92;
        if (clock >= from) {
          const max =
            document.documentElement.scrollHeight - window.innerHeight;
          if (max > 0) {
            if (!scr.init) {
              scr.init = true;
              scr.start = window.scrollY;
              scr.last = scr.start;
            }
            const p = Math.min(1, Math.max(0, (clock - from) / Math.max(0.1, to - from)));
            const target = scr.start + (max - scr.start) * ease(p);
            scr.last += (target - scr.last) * 0.12;
            window.scrollTo({ top: scr.last, behavior: "instant" as ScrollBehavior });
          }
        }
      }

      if (liveGet) {
        const v = liveGet();
        const key = JSON.stringify(v);
        if (key !== lastLive) {
          lastLive = key;
          setPanel(v);
        }
      }

      // Spotlight follower
      const d = spotRef.current;
      if (d) {
        if (spotEl && spotEl.isConnected) {
          const r = spotEl.getBoundingClientRect();
          d.style.opacity = "1";
          d.style.left = r.left - 8 + "px";
          d.style.top = r.top - 8 + "px";
          d.style.width = r.width + 16 + "px";
          d.style.height = r.height + 16 + "px";
        } else {
          d.style.opacity = "0";
        }
      }

      if (clock >= s.secs) {
        if (idx + 1 >= STEPS.length) {
          setPhase("idle");
          return;
        }
        go(idx + 1);
      }
      raf = requestAnimationFrame(frame);
    }

    go(0);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      token++;
      waiters.forEach((w) => w.rej(ABORT));
      waiters = [];
      ctl.current = null;
      pulse?.cancel();
      try {
        if (spotEl) {
          spotEl.style.transform = "";
          spotEl.style.transition = "";
        }
        Promise.resolve(STEPS[idx]?.cleanup?.()).catch(() => {});
      } catch {}
      try {
        if (savedFavs === null) localStorage.removeItem(FAV_KEY);
        else localStorage.setItem(FAV_KEY, savedFavs);
      } catch {}
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (spotRef.current) spotRef.current.style.opacity = "0";
      setEndCard(false);
      setPanel(null);
      setPaused(false);
      setTypingPreview(null);
      window.scrollTo({ top: 0 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, soundEnabled]);

  const running = phase === "run";
  const curStep = STEPS[activeStep] || STEPS[0];
  const stepTimeRemaining = Math.max(0, Math.ceil(curStep.secs - stepClock));
  const stepProgressFraction = Math.min(1, Math.max(0, stepClock / curStep.secs));

  // SVG circular countdown progress math
  const ringRadius = 14;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference * (1 - stepProgressFraction);

  const btn =
    "px-2.5 py-1 rounded-full hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white transition-all text-xs font-semibold flex items-center gap-1 active:scale-95";

  return (
    <>
      {/* 16:9 Frame Crop Guide Overlay ('F' hotkey) */}
      {frameGuide && (
        <div
          data-tour-ui
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center border-4 border-amber-400/80 bg-black/35 backdrop-blur-[1px]"
        >
          <div className="relative w-full max-w-[1920px] aspect-video border-2 border-dashed border-amber-300 shadow-2xl flex items-start justify-between p-4">
            <span className="bg-amber-500 text-black font-extrabold text-[11px] px-2.5 py-1 rounded-md tracking-wider">
              16:9 1080P RECORDING SAFE AREA
            </span>
            <span className="bg-black/70 text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded">
              Press F to toggle
            </span>
          </div>
        </div>
      )}

      {/* Simulated Presentation Cursor */}
      <div
        ref={cursorRef}
        data-tour-ui
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 90,
          pointerEvents: "none",
          opacity: 0,
          willChange: "transform",
        }}
      >
        <svg
          width="28"
          height="40"
          viewBox="3 2 18 26"
          style={{
            display: "block",
            overflow: "visible",
            transformOrigin: "0 0",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,.45))",
          }}
        >
          <defs>
            <linearGradient id="aaf-cursor-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#e2efe9" />
            </linearGradient>
          </defs>
          <path
            d="M3 2 L3 23 L8.5 18 L12.5 27 L16 25.4 L12 16.6 L19.5 16.6 Z"
            fill="url(#aaf-cursor-fill)"
            stroke="#0A1815"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>

        {/* Live Keystroke Badge near Cursor */}
        {typingPreview && (
          <div className="absolute left-6 top-4 bg-slate-900/90 text-teal-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-teal-500/40 shadow-xl whitespace-nowrap animate-pulse flex items-center gap-1.5">
            <span>⌨</span>
            <span>{typingPreview}</span>
            <span className="inline-block w-1.5 h-3 bg-teal-400 animate-ping" />
          </div>
        )}
      </div>

      {/* Focus Spotlight & Darkened Vignette */}
      <div
        ref={spotRef}
        data-tour-ui
        aria-hidden="true"
        style={{
          position: "fixed",
          zIndex: 75,
          pointerEvents: "none",
          opacity: 0,
          borderRadius: 20,
          outline: "3px solid #E29578",
          outlineOffset: 5,
          boxShadow:
            "0 0 0 9999px rgba(6, 17, 14, 0.48), 0 0 24px rgba(226, 149, 120, 0.6)",
          transition: "opacity .35s, left .2s ease-out, top .2s ease-out, width .2s ease-out, height .2s ease-out",
        }}
      />

      {/* 3-2-1 Recording Slate Countdown */}
      {phase === "count" && (
        <div
          data-tour-ui
          role="status"
          className="fixed inset-0 z-[95] bg-[#0A1815]/90 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#2A8C82]/20 border border-[#2A8C82]/50 text-[#E29578] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            ● Screen Recording Slate
          </div>
          <h2 className="text-3xl font-black text-white">All Around Forsyth Tour</h2>
          <p className="text-9xl font-black my-5 text-[#E29578] drop-shadow-[0_0_35px_rgba(226,149,120,0.6)]">
            {count}
          </p>
          <p className="text-sm text-slate-300 font-medium">
            Start your screen recorder now. Audio chime will sound on 0.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-6 text-xs text-slate-400">
            <span className="bg-white/10 px-2.5 py-1 rounded-md">Space: Pause</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md">← / →: Chapters</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md">R: Retake Page</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md">T: Teleprompter</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md">F: 16:9 Frame</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md">H: Hide HUD</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md">Esc: Exit</span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* HUD OVERLAYS (Visible during run when hud is enabled) */}
      {/* ==================================================================== */}
      {running && hud && (
        <>
          {/* Top Master Progress Bar */}
          <div
            data-tour-ui
            className="fixed top-0 left-0 right-0 h-1.5 z-[70] bg-black/40 backdrop-blur-sm"
          >
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-[#2A8C82] via-[#E29578] to-amber-300 transition-all duration-100"
              style={{ width: "0%" }}
            />
          </div>

          {/* Top Master Control Bar */}
          <div
            data-tour-ui
            className={
              "fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-1.5 bg-[#0F2420]/95 backdrop-blur-xl border border-white/20 text-white rounded-full px-3 py-1.5 shadow-2xl transition-all duration-300 " +
              (barOn || paused ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none")
            }
          >
            <button
              className={btn}
              onClick={() => ctl.current?.jump(-1)}
              title="Previous Chapter (Left Arrow)"
            >
              ⏮
            </button>
            <button
              className={btn}
              onClick={() => ctl.current?.restartCurrent()}
              title="Repeat / Retake This Chapter (R key)"
            >
              ↺ Retake (R)
            </button>
            <button
              className={
                btn +
                (paused
                  ? " bg-amber-400 text-slate-900 hover:bg-amber-300"
                  : " bg-white/15")
              }
              onClick={() => ctl.current?.togglePause()}
              title="Pause / Resume (Spacebar)"
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button
              className={btn}
              onClick={() => ctl.current?.jump(1)}
              title="Next Chapter (Right Arrow)"
            >
              ⏭
            </button>

            <span className="h-4 w-px bg-white/20 mx-1" />

            {/* Quick Chapter Selector Dropdown */}
            <select
              value={activeStep}
              onChange={(e) => ctl.current?.goTo(Number(e.target.value))}
              className="bg-black/40 text-white text-[11px] font-bold rounded-lg px-2 py-1 border border-white/10 outline-none cursor-pointer"
            >
              {STEPS.map((s, i) => (
                <option key={i} value={i} className="bg-slate-900 text-white">
                  {i + 1}. {s.title.slice(0, 22)}...
                </option>
              ))}
            </select>

            <button
              className={btn + (teleprompter ? " text-teal-300" : " opacity-60")}
              onClick={() => setTeleprompter(!teleprompter)}
              title="Toggle Script Teleprompter (T)"
            >
              🎙 Script
            </button>
            <button
              className={btn + (frameGuide ? " text-amber-300" : " opacity-60")}
              onClick={() => setFrameGuide(!frameGuide)}
              title="Toggle 16:9 Crop Border (F)"
            >
              📐 16:9
            </button>
            <button
              className={btn + (soundEnabled ? " text-emerald-300" : " opacity-40")}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle Audio Cues (M)"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <button
              className={btn}
              onClick={() => setHud(false)}
              title="Hide Overlays for Clean Screen Capture (H)"
            >
              👁 Hide (H)
            </button>
            <button
              className={btn + " text-red-300 hover:bg-red-500/20"}
              onClick={() => setPhase("idle")}
              title="Exit Tour (Esc)"
            >
              ✕
            </button>
          </div>

          {/* ================================================================ */}
          {/* LOWER-THIRD BROADCAST CHAPTER CARD & TELEPROMPTER */}
          {/* ================================================================ */}
          <div
            data-tour-ui
            className="fixed bottom-6 left-6 z-[70] flex flex-col gap-2.5 max-w-lg w-[calc(100vw-3rem)] pointer-events-none"
          >
            {/* Live Teleprompter Script Card (Toggleable with T) */}
            {teleprompter && (
              <div className="bg-[#0A1815]/95 backdrop-blur-xl border border-teal-500/30 text-white p-3.5 rounded-2xl shadow-2xl aaf-panel-in flex flex-col gap-1.5 pointer-events-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border " +
                        (curStep.speaker === "Jordan"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : curStep.speaker === "DJ"
                          ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
                          : "bg-teal-500/20 text-teal-300 border-teal-500/40")
                      }
                    >
                      Speaking: {curStep.speaker}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      Press &apos;T&apos; to hide
                    </span>
                  </div>
                  <span className="text-[10px] text-[#E29578] font-bold">
                    {stepTimeRemaining}s left
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                  &ldquo;{curStep.script}&rdquo;
                </p>
              </div>
            )}

            {/* Main Broadcast Lower-Third Banner */}
            <div className="relative overflow-hidden bg-[#0d231f]/95 backdrop-blur-xl border border-white/20 text-white p-4.5 rounded-2xl shadow-2xl aaf-panel-in flex items-start justify-between gap-4 pointer-events-auto">
              {/* Top Gradient Wipe Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A8C82] via-[#E29578] to-teal-300" />

              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E29578]">
                    CHAPTER {activeStep + 1} OF {STEPS.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-teal-300 border border-teal-400/20">
                    {curStep.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
                  {curStep.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-medium">
                  {curStep.text}
                </p>
              </div>

              {/* Glassmorphic Circular Countdown Ring */}
              <div className="relative shrink-0 flex items-center justify-center w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r={ringRadius}
                    className="stroke-white/15"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* Animated Progress Ring */}
                  <circle
                    cx="18"
                    cy="18"
                    r={ringRadius}
                    className="stroke-[#E29578] transition-all duration-100"
                    strokeWidth="3"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute font-mono text-xs font-black text-white">
                  {stepTimeRemaining}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* FLOATING INSPECTION PANEL (Feature Showcase / Live List) */}
      {/* ==================================================================== */}
      {running && hud && panel && (
        <div
          data-tour-ui
          className={`fixed right-6 ${
            panel.pos === "bottom-right" ? "bottom-24" : "top-20"
          } z-[70] w-80 max-w-[calc(100vw-2rem)] bg-[#0d231f]/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/20 p-4.5 aaf-panel-in`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] tracking-wider uppercase text-teal-300 font-extrabold">
                {panel.title}
              </p>
            </div>
            {panel.badge && (
              <span className="text-[9px] font-mono uppercase bg-[#2A8C82]/30 text-[#E29578] px-1.5 py-0.5 rounded border border-[#2A8C82]/50 font-bold">
                {panel.badge}
              </span>
            )}
          </div>
          <ul className="space-y-1.5">
            {panel.items.map((it, i) => (
              <li
                key={i + it}
                className="text-xs font-semibold flex items-start gap-2 aaf-item-in text-slate-200"
              >
                <span className="text-[#E29578] mt-0.5 shrink-0">●</span>
                <span className="break-words leading-tight">{it}</span>
              </li>
            ))}
          </ul>
          {panel.note && (
            <p className="mt-3 pt-2 border-t border-white/10 text-[11px] text-slate-400 font-medium">
              ℹ {panel.note}
            </p>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* CLOSING CREDITS CARD */}
      {/* ==================================================================== */}
      <div
        data-tour-ui
        aria-hidden={!endCard}
        className={
          "fixed inset-0 z-[85] bg-[#0A1815] text-white flex flex-col items-center justify-center text-center p-8 transition-opacity duration-700 " +
          (endCard ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/aaf.png"
          alt="All Around Forsyth"
          className="w-52 max-w-[65vw] h-auto drop-shadow-[0_0_35px_rgba(42,140,130,0.5)] mb-4"
        />
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Thank you for exploring!
        </h2>
        <p className="text-lg sm:text-xl text-teal-300 font-bold mt-2">
          All Around Forsyth · FBLA Website Design 2026
        </p>
        <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-2.5 rounded-full mt-4 text-sm font-extrabold text-[#E29578]">
          <span>Jordan Daniels</span>
          <span>•</span>
          <span>DJ Reddish</span>
        </div>
        <p className="text-xs text-slate-400 mt-4 max-w-md">
          Forsyth County, Georgia Community Directory. Verified data, WCAG 2.1 AA accessible, and custom built.
        </p>
      </div>
    </>
  );
}
