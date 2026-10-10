"use client";

// Presentation tour - built for screen recording + voiceover.
//
// Start it from the Admin page ("Start Presentation Tour") or by visiting any page with
//   ?tour=1      -> tour with the on-screen chapter cards + progress bar
//   ?tour=clean  -> tour with NO overlays (just the site, cursor and highlights)
//
// While it runs:
//   Space  pause / resume      Left / Right  previous / next chapter
//   H      hide / show overlays (clean recording)      Esc  stop
// Moving the mouse also reveals a small control bar for 2 seconds.
//
// How it works: every chapter is a page + a duration + an optional script. The script clicks real
// buttons, types into real inputs and opens real modals using a fake on-screen cursor (a real
// cursor wouldn't show up in the recording). Scripts wait on the tour clock, which stops when you
// pause, so pausing never throws the timing off. Anything a chapter changes (dark mode, Spanish,
// accessibility settings, search box, favorites) is put back when you leave it.
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type El = HTMLElement | null | undefined;

/** a card that floats over the page, e.g. the directory list that updates as a form is typed */
export interface Panel {
  title: string;
  items: string[];
  note?: string;
}

interface Ctx {
  /** wait until this many seconds into the chapter (tour clock, pause-aware) */
  until(sec: number): Promise<void>;
  /** wait this many seconds from now (tour clock, pause-aware) */
  wait(sec: number): Promise<void>;
  /** keep looking for an element (pages load a moment after the route changes) */
  find(get: () => El, maxSec?: number): Promise<HTMLElement | null>;
  /** glide the cursor over an element without clicking (only if it is on screen) */
  hover(el: El): Promise<void>;
  /** scroll to it, glide the cursor there, ripple, click */
  click(el: El): Promise<void>;
  /** click an input and type into it like a person */
  type(el: El, text: string, cps?: number): Promise<void>;
  clear(el: El): void;
  /** choose the nth option of a <select> */
  pick(el: El, index: number): Promise<void>;
  scrollToEl(el: El, where?: "center" | "top"): Promise<void>;
  scrollTop(): Promise<void>;
  /** dim the page and ring an element; it follows the element while the page scrolls */
  spot(el: El): void;
  unspot(): void;
  endCard(on: boolean): void;
  /** show a fixed overlay card with a fixed list */
  panel(p: Panel | null): void;
  /** keep the overlay in sync with live page state (polled a few times a second) */
  live(get: (() => Panel | null) | null): void;
}

interface Step {
  path: string;
  secs: number;
  title: string;
  text: string;
  /** auto-scroll window in seconds. false = do not auto-scroll (the script moves the page) */
  scroll?: false | { from?: number; to?: number };
  /** ring the page heading for the first couple of seconds (default true) */
  spotTitle?: boolean;
  run?: (c: Ctx) => Promise<void>;
  /** undo anything this chapter changed; runs when leaving the chapter or stopping */
  cleanup?: () => void | Promise<void>;
}

// ---------- small DOM helpers (all of them are safe to call when nothing matches) ----------

const visible = (e: HTMLElement) => e.getClientRects().length > 0;
const qa = (sel: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(sel)).filter((e) => !e.closest("[data-tour-ui]") && visible(e));
const qs = (sel: string) => qa(sel)[0] ?? null;

function byText(sel: string, text: string, exact = false): HTMLElement | null {
  const t = text.toLowerCase();
  return (
    qa(sel).find((e) => {
      const s = (e.textContent || "").trim().toLowerCase();
      return exact ? s === t : s.includes(t);
    }) ?? null
  );
}

// React ignores el.value = "x"; going through the native setter makes onChange fire
function setNativeValue(el: HTMLElement, v: string, evt: "input" | "change" = "input") {
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

// ---------- cleanups ----------

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
  const toggle = () => qs('button[aria-label="Toggle Accessibility Toolbar"]')?.click();
  const wasOpen = !!byText("button", "Reset Defaults");
  if (!wasOpen) {
    toggle();
    await sleep(150);
  }
  byText("button", "Reset Defaults")?.click();
  await sleep(100);
  toggle();
}

// the toggle button that sits next to a label in the accessibility panel
const a11yRow = (label: string) => byText("span", label)?.closest("div.flex")?.querySelector<HTMLElement>("button");

// ---------- the chapters ----------
// To change the length of the tour just change the "secs" numbers.

const STEPS: Step[] = [
  {
    path: "/",
    secs: 26,
    title: "Welcome to All Around Forsyth",
    text: "Live weather, lake level, air quality and pollen",
    scroll: { from: 4 },
    run: async (c) => {
      await c.until(8);
      await c.hover(byText("a,button", "Explore Live Interactive Map"));
    },
  },
  {
    path: "/",
    secs: 16,
    title: "Instant Search",
    text: "Press Cmd/Ctrl + K to search everything in the county",
    scroll: false,
    spotTitle: false,
    run: async (c) => {
      await c.until(2);
      const open = await c.find(() => qs('button[title^="Search directory"]') || byText("button", "Quick Search"), 3);
      await c.click(open);
      const input = await c.find(() => qs('input[placeholder^="Search parks, businesses"]'), 3);
      await c.wait(0.5);
      await c.type(input, "Sheriff", 9);
      await c.wait(2.6);
      c.clear(input);
      await c.wait(0.4);
      await c.type(input, "Park", 9);
      await c.wait(2.6);
      await c.click(byText("button", "ESC", true));
    },
    cleanup: closePalette,
  },
  {
    path: "/",
    secs: 16,
    title: "Best Time to Visit",
    text: "The crowd meter shows rush hours vs. quiet hours",
    scroll: false,
    spotTitle: false,
    run: async (c) => {
      await c.until(1.5);
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
    secs: 12,
    title: "Dark Mode & Español",
    text: "Comfortable at night, and in two languages",
    scroll: false,
    spotTitle: false,
    run: async (c) => {
      await c.until(1.5);
      c.panel({ title: "Dark mode & Español", items: ["Whole site re-themes live", "Spanish swaps every label on the page", "Choice is remembered on this device"] });
      await c.click(byText("button.tool-btn", "Dark"));
      await c.until(5);
      await c.click(byText("button.tool-btn", "Español"));
      await c.until(8.5);
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
    title: "Live Interactive Map",
    text: "Every park and business in the county",
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
      await c.click(sat?.parentElement?.firstElementChild as El); // back to the normal street map
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
    title: "Parks Directory",
    text: "Search by name or filter by amenity",
    scroll: { from: 15, to: 22 },
    run: async (c) => {
      await c.until(3.5);
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
    title: "Community Businesses",
    text: "Local spots our community loves",
    scroll: { from: 22, to: 26.5 },
    run: async (c) => {
      await c.until(3.5);
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
    title: "Add Your Business",
    text: "Approved instantly",
    scroll: { from: 15, to: 19 },
    run: async (c) => {
      await c.until(3.5);
      c.live(() => {
        const vals = qa("main input, main select, main textarea")
          .map((e) => (e as HTMLInputElement).value.trim())
          .filter(Boolean);
        return {
          title: "Live directory preview",
          items: vals.length ? vals : ["Your listing will appear here"],
          note: "Approved instantly after submit",
        };
      });
      await c.type(await c.find(() => qs('input[placeholder^="e.g. Cherry Street"]'), 3), "Sample Coffee Co.", 20);
      await c.wait(0.3);
      await c.type(qs('input[placeholder^="e.g. 6365"]'), "123 Main St, Cumming, GA 30040", 24);
      await c.wait(0.3);
      await c.pick(qs("main select"), 1);
      await c.type(qs('input[placeholder^="e.g. (770)"]'), "(770) 555-0199", 18);
      await c.wait(0.3);
      await c.type(qs("main textarea"), "Locally roasted coffee and fresh pastries.", 26);
      // nothing is submitted - leaving the page clears the form
    },
  },
  {
    path: "/events",
    secs: 20,
    title: "Events",
    text: "What is happening in Forsyth",
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
      await c.wait(0.4);
      await c.type(title, "Vickery Village Fall 5K", 18);
      await c.wait(1.2);
      await c.click(qs("div.fixed.inset-0 button.absolute"));
    },
  },
  {
    path: "/civic",
    secs: 12,
    title: "Civic Leaders",
    text: "Sheriff and government officials",
  },
  {
    path: "/emergency",
    secs: 10,
    title: "Emergency & Safety",
    text: "Important numbers in one place",
  },
  {
    path: "/history",
    secs: 24,
    title: "History",
    text: "Timeline and Poole's Mill Covered Bridge",
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
    secs: 8,
    title: "Sources & Credits",
    text: "Where our info comes from",
  },
  {
    path: "/favorites",
    secs: 16,
    title: "Favorites",
    text: "Save the places you love",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      const add = 'button[aria-label^="Add to favorites"]';
      await c.click(await c.find(() => qs(add), 3));
      await c.wait(0.5);
      await c.click(qs(add));
      await c.wait(0.5);
      const adds = qa(add);
      await c.click(adds[adds.length - 1]); // a business
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
    title: "Trip Planner",
    text: "Build a printable day plan",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      await c.pick(await c.find(() => qs("main select"), 3), 3); // 10:00 AM
      const boxes = qa('main input[type="checkbox"]');
      const picks = Array.from(new Set([0, 3, 10, 12].filter((n) => n < boxes.length)));
      for (const n of picks) {
        await c.click(boxes[n]);
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
    title: "Accessibility",
    text: "Built for everyone",
    scroll: { from: 20, to: 23 },
    run: async (c) => {
      await c.until(3);
      c.panel({
        title: "Accessibility toolbar",
        items: ["High contrast mode", "Text size: 112% / 125%", "Dyslexia-friendly font", "Reading guide line", "Reduced motion", "Works without a mouse"],
        note: "Built to WCAG 2.1 AA",
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
    secs: 6,
    title: "Copyright",
    text: "Jordan Daniels & DJ Reddish",
  },
  {
    path: "/fbla",
    secs: 10,
    title: "Built for FBLA 2026",
    text: "Thank you!",
    scroll: false,
    run: async (c) => {
      await c.until(3);
      c.endCard(true);
    },
  },
];

const TOTAL = STEPS.reduce((a, s) => a + s.secs, 0);
const OFFSETS = STEPS.map((_, i) => STEPS.slice(0, i).reduce((a, s) => a + s.secs, 0));
const mins = Math.floor(TOTAL / 60);
const rest = String(TOTAL % 60).padStart(2, "0");
/** e.g. "5:20" - the admin page shows this on its button */
export const TOUR_LENGTH = `${mins}:${rest}`;

const FAV_KEY = "aaf_favorites";
const ABORT = new Error("tour-step-ended");

// slow at the start and end, fast in the middle
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Phase = "idle" | "count" | "run";

export default function DemoTour() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(3);
  const [step, setStep] = useState(0);
  const [cardOn, setCardOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState(true);
  const [barOn, setBarOn] = useState(false);
  const [endCard, setEndCard] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);

  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const ctl = useRef<{ jump: (d: number) => void; togglePause: () => void } | null>(null);

  const begin = useCallback((clean: boolean) => {
    (document.activeElement as HTMLElement | null)?.blur?.(); // so Space can't re-press the start button
    setHud(!clean);
    setCount(3);
    setPhase((p) => (p === "idle" ? "count" : p));
  }, []);

  // admin page fires this event
  useEffect(() => {
    const onStart = () => begin(false);
    window.addEventListener("aaf-start-tour", onStart);
    return () => window.removeEventListener("aaf-start-tour", onStart);
  }, [begin]);

  // ?tour=1 or ?tour=clean on any page
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tour");
    if (!q) return;
    const t = setTimeout(() => begin(q === "clean"), 500);
    return () => clearTimeout(t);
  }, [begin]);

  // 3-2-1 so there is time to hit record
  useEffect(() => {
    if (phase !== "count") return;
    const t = setTimeout(() => {
      if (count <= 1) setPhase("run");
      else setCount(count - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  // keyboard
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
      } else if (e.key === "ArrowRight") ctl.current?.jump(1);
      else if (e.key === "ArrowLeft") ctl.current?.jump(-1);
      else if (e.key === "h" || e.key === "H") setHud((h) => !h);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // control bar shows when the mouse moves, hides after 2s
  useEffect(() => {
    if (phase !== "run") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function onMove() {
      setBarOn(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setBarOn(false), 2000);
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (timer) clearTimeout(timer);
      setBarOn(false);
    };
  }, [phase]);

  // ---------------- the engine ----------------
  useEffect(() => {
    if (phase !== "run") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smooth = (): ScrollBehavior => (reduce ? ("instant" as ScrollBehavior) : "smooth");

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
    let clock = 0; // seconds into the current chapter; frozen while paused
    let last = performance.now();
    let token = 0; // changes every chapter so old scripts stop
    let paused = false;
    let cardShown = false;
    let raf = 0;
    let spotEl: HTMLElement | null = null;
    let liveGet: (() => Panel | null) | null = null;
    let lastLive = "";
    let cx = -1;
    let cy = -1;
    const scr = { init: false, start: 0, last: 0 };

    const pulse =
      !reduce && spotRef.current?.animate
        ? spotRef.current.animate([{ outlineOffset: "3px" }, { outlineOffset: "9px" }], {
            duration: 900,
            iterations: Infinity,
            direction: "alternate",
            easing: "ease-in-out",
          })
        : null;

    // ----- cursor -----
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
      el.style.opacity = "1";
      el.style.transition = reduce ? "none" : `transform ${ms}ms cubic-bezier(.45,0,.2,1), opacity .3s`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      cx = x;
      cy = y;
    }

    function ripple(x: number, y: number) {
      const d = document.createElement("div");
      d.setAttribute("data-tour-ui", "");
      Object.assign(d.style, {
        position: "fixed",
        left: x - 22 + "px",
        top: y - 22 + "px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "3px solid #E29578",
        background: "rgba(226,149,120,.25)",
        pointerEvents: "none",
        zIndex: "85",
      });
      document.body.appendChild(d);
      if (reduce) {
        setTimeout(() => d.remove(), 300);
        return;
      }
      const a = d.animate([{ transform: "scale(.3)", opacity: 0.9 }, { transform: "scale(1.8)", opacity: 0 }], {
        duration: 600,
        easing: "ease-out",
      });
      a.onfinish = () => d.remove();
      cursorRef.current?.firstElementChild?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(.8)" }, { transform: "scale(1)" }],
        { duration: 240 },
      );
    }

    const aim = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.min(window.innerWidth - 20, r.left + Math.min(r.width * 0.55, 160)),
        y: r.top + Math.min(r.height * 0.5, 40),
      };
    };

    // ----- per-chapter toolbox -----
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
        const y = window.scrollY + r.top - window.innerHeight / 2 + r.height / 2;
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
          for (let i = 1; i <= text.length; i++) {
            setNativeValue(el, text.slice(0, i));
            await wait((1 / cps) * (0.6 + Math.random() * 0.8));
          }
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
          if (t === token) spotEl = el ?? null;
        },
        unspot() {
          if (t === token) spotEl = null;
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
      const prevPath = idx >= 0 ? STEPS[idx].path : null;
      idx = i;
      clock = 0;
      scr.init = false;
      paused = false;
      setPaused(false);
      setStep(i);
      setCardOn(true);
      cardShown = true;
      router.push(STEPS[i].path);
      window.scrollTo({
        top: 0,
        behavior: prevPath === STEPS[i].path && !reduce ? "smooth" : ("instant" as ScrollBehavior),
      });
      void runStep(i, token);
    }

    ctl.current = {
      jump: (d) => {
        const n = idx + d;
        if (n >= STEPS.length) setPhase("idle");
        else go(Math.max(0, n));
      },
      togglePause: () => {
        paused = !paused;
        setPaused(paused);
        if (!paused) {
          last = performance.now();
          scr.last = window.scrollY;
        }
      },
    };

    function frame(now: number) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!paused) clock += dt;
      const s = STEPS[idx];

      if (progressRef.current) {
        progressRef.current.style.width = Math.min(100, ((OFFSETS[idx] + clock) / TOTAL) * 100) + "%";
      }
      if (cardShown && clock > 3) {
        cardShown = false;
        setCardOn(false);
      }

      // wake up scripts whose time has come
      if (waiters.length) {
        const due = waiters.filter((w) => w.at <= clock);
        if (due.length) {
          waiters = waiters.filter((w) => w.at > clock);
          due.forEach((w) => w.res());
        }
      }

      // smooth auto-scroll for the chapter
      if (!paused && !reduce && s.scroll !== false) {
        const from = s.scroll?.from ?? 3;
        const to = s.scroll?.to ?? s.secs * 0.92;
        if (clock >= from) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          if (max > 0) {
            if (!scr.init) {
              scr.init = true;
              scr.start = window.scrollY;
              scr.last = scr.start;
            }
            const p = Math.min(1, Math.max(0, (clock - from) / Math.max(0.1, to - from)));
            const target = scr.start + (max - scr.start) * ease(p);
            scr.last += (target - scr.last) * 0.12; // glide so there are no jumps
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

      // spotlight follows its element
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
      setCardOn(false);
      setPaused(false);
      window.scrollTo({ top: 0 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const cur = STEPS[step];
  const running = phase === "run";

  const btn =
    "px-2.5 py-1 rounded-full hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white transition-colors";

  return (
    <>
      {/* fake cursor + spotlight: part of the "film", so they show even in clean mode */}
      <div
        ref={cursorRef}
        data-tour-ui
        aria-hidden="true"
        style={{ position: "fixed", left: 0, top: 0, zIndex: 90, pointerEvents: "none", opacity: 0, willChange: "transform" }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          style={{ display: "block", transformOrigin: "3px 2px", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.45))" }}
        >
          <path
            d="M3 2 L3 23 L8.5 18 L12.5 27 L16 25.4 L12 16.6 L19.5 16.6 Z"
            fill="#fff"
            stroke="#1B3B36"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        ref={spotRef}
        data-tour-ui
        aria-hidden="true"
        style={{
          position: "fixed",
          zIndex: 75,
          pointerEvents: "none",
          opacity: 0,
          borderRadius: 18,
          outline: "3px solid #E29578",
          outlineOffset: 4,
          boxShadow: "0 0 0 9999px rgba(8,22,19,.34)",
          transition: "opacity .35s",
        }}
      />

      {/* countdown so there is time to start the screen recorder */}
      {phase === "count" && (
        <div
          data-tour-ui
          role="status"
          className="fixed inset-0 z-[95] bg-black/70 flex flex-col items-center justify-center text-white text-center"
        >
          <p className="text-[11px] tracking-widest uppercase text-[#E29578] font-bold">Presentation tour starting</p>
          <p className="text-8xl font-black my-4">{count}</p>
          <p className="text-sm text-white/80">Start your screen recorder now</p>
          <p className="text-xs text-white/60 mt-3">
            Space pause · ← → chapters · H hide overlays · Esc stop
          </p>
        </div>
      )}

      {running && hud && (
        <>
          {/* thin progress bar across the top */}
          <div data-tour-ui className="fixed top-0 left-0 right-0 h-1 z-[70] bg-white/10">
            <div ref={progressRef} className="h-full bg-[#E29578]" style={{ width: "0%" }} />
          </div>

          {/* chapter title card for the first 3 seconds of each page */}
          <div
            data-tour-ui
            aria-live="polite"
            className={
              "fixed left-1/2 bottom-16 z-[70] -translate-x-1/2 bg-[#1B3B36]/95 text-white px-8 py-4 rounded-2xl shadow-2xl text-center transition-all duration-700 " +
              (cardOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none")
            }
          >
            <p className="text-[11px] tracking-widest uppercase text-[#E29578] font-bold">
              {step + 1} of {STEPS.length}
            </p>
            <p className="text-2xl font-extrabold">{cur.title}</p>
            <p className="text-sm text-white/80">{cur.text}</p>
          </div>

          {/* control bar - only visible while the mouse is moving, or when paused */}
          <div
            data-tour-ui
            className={
              "fixed top-3 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-1 bg-[#1B3B36]/95 text-white rounded-full px-2 py-1.5 shadow-2xl text-xs font-bold transition-opacity duration-300 " +
              (barOn || paused ? "opacity-100" : "opacity-0 pointer-events-none")
            }
          >
            <button className={btn} onClick={() => ctl.current?.jump(-1)} aria-label="Previous chapter">
              ⏮
            </button>
            <button
              className={btn}
              onClick={() => ctl.current?.togglePause()}
              aria-label={paused ? "Resume tour" : "Pause tour"}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button className={btn} onClick={() => ctl.current?.jump(1)} aria-label="Next chapter">
              ⏭
            </button>
            <button className={btn} onClick={() => setHud(false)} aria-label="Hide overlays">
              Hide overlays
            </button>
            <button className={btn} onClick={() => setPhase("idle")} aria-label="Stop tour">
              ✕ Stop
            </button>
          </div>
        </>
      )}

      {/* overlay card (feature showcase / live list) */}
      {running && hud && panel && (
        <div
          data-tour-ui
          className="fixed right-4 top-24 z-[70] w-72 max-w-[calc(100vw-2rem)] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <p className="text-[10px] tracking-widest uppercase text-[#2A8C82] font-black">{panel.title}</p>
          <ul className="mt-2 space-y-1.5">
            {panel.items.map((it, i) => (
              <li key={i + it} className="text-sm font-semibold flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span className="text-[#E29578]">●</span>
                <span className="break-words">{it}</span>
              </li>
            ))}
          </ul>
          {panel.note && <p className="mt-3 text-[11px] text-slate-500">{panel.note}</p>}
        </div>
      )}

      {/* closing card */}
      <div
        data-tour-ui
        aria-hidden={!endCard}
        className={
          "fixed inset-0 z-[85] bg-[#1B3B36] text-white flex flex-col items-center justify-center text-center gap-3 transition-opacity duration-700 " +
          (endCard ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/aaf.png" alt="" className="w-48 max-w-[60vw] h-auto" />
        <p className="text-5xl font-black">Thank you!</p>
        <p className="text-lg text-white/80">All Around Forsyth · FBLA Website Design 2026</p>
        <p className="text-sm text-[#E29578] font-bold tracking-wide">Jordan Daniels &amp; DJ Reddish</p>
      </div>
    </>
  );
}
