"use client";

// Auto tour - goes through the whole site in 4 minutes (240s) so we can record a voiceover.
// Start it from the Admin page ("Start Presentation Tour"). Esc stops it.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { path: "/", secs: 30, title: "Welcome to All Around Forsyth", text: "Live weather, lake level, air quality and pollen" },
  { path: "/map", secs: 25, title: "Live Interactive Map", text: "Every park and business in the county" },
  { path: "/parks", secs: 22, title: "Parks & Crowd Meter", text: "Find the best time to visit" },
  { path: "/top-10", secs: 22, title: "Community Businesses", text: "Local spots our community loves" },
  { path: "/submit-business", secs: 15, title: "Add Your Business", text: "Approved instantly" },
  { path: "/events", secs: 15, title: "Events", text: "What is happening in Forsyth" },
  { path: "/civic", secs: 15, title: "Civic Leaders", text: "Sheriff and government officials" },
  { path: "/emergency", secs: 12, title: "Emergency & Safety", text: "Important numbers in one place" },
  { path: "/history", secs: 18, title: "History", text: "Timeline and Poole's Mill Covered Bridge" },
  { path: "/sources", secs: 10, title: "Sources & Credits", text: "Where our info comes from" },
  { path: "/favorites", secs: 10, title: "Favorites", text: "Save the places you love" },
  { path: "/trip-planner", secs: 12, title: "Trip Planner", text: "Build a printable day plan" },
  { path: "/accessibility", secs: 12, title: "Accessibility", text: "Built for everyone" },
  { path: "/copyright", secs: 10, title: "Copyright", text: "Jordan Daniels & DJ Reddish" },
  { path: "/fbla", secs: 12, title: "Built for FBLA 2026", text: "Thank you!" },
];

const TOTAL = STEPS.reduce((a, s) => a + s.secs, 0);

// slow at the start and end, fast in the middle
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function DemoTour() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [cardOn, setCardOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);

  function stop() {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setRunning(false);
    setCardOn(false);
    window.scrollTo({ top: 0 });
  }

  // admin page fires this event
  useEffect(() => {
    function onStart() {
      setRunning(true);
    }
    window.addEventListener("aaf-start-tour", onStart);
    return () => window.removeEventListener("aaf-start-tour", onStart);
  }, []);

  useEffect(() => {
    if (!running) return;
    let idx = 0;
    let t0 = performance.now();
    const startAll = t0;
    let lastScroll = 0;

    function go(i: number) {
      idx = i;
      t0 = performance.now();
      lastScroll = 0;
      setStep(i);
      setCardOn(true);
      router.push(STEPS[i].path);
      window.scrollTo({ top: 0 });
    }
    go(0);

    function frame(now: number) {
      const s = STEPS[idx];
      const sec = (now - t0) / 1000;
      setProgress((now - startAll) / 1000 / TOTAL);

      // card shows for the first 3 seconds
      if (sec > 3) setCardOn(false);

      // scroll from 3s until 92% of the step, with easing
      const p = Math.min(1, Math.max(0, (sec - 3) / (s.secs * 0.92 - 3)));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && sec > 1.5) {
        const target = max * ease(p);
        // glide toward the target so there are no jumps
        lastScroll = lastScroll + (target - lastScroll) * 0.12;
        window.scrollTo({ top: lastScroll, behavior: "instant" as ScrollBehavior });
      }

      if (sec >= s.secs) {
        if (idx + 1 >= STEPS.length) {
          stop();
          return;
        }
        go(idx + 1);
      }
      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Esc to stop
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && running) stop();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  if (!running) return null;

  const cur = STEPS[step];
  return (
    <>
      {/* thin progress bar across the top */}
      <div className="fixed top-0 left-0 h-1 z-[70] bg-[#E29578]" style={{ width: progress * 100 + "%" }} />

      {/* chapter title card that slides in for each page */}
      <div
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

      {/* almost invisible stop button */}
      <button
        onClick={stop}
        className="fixed bottom-2 right-2 z-[70] text-[10px] text-white bg-black/40 px-2 py-1 rounded opacity-20 hover:opacity-100 transition-opacity"
      >
        Stop (Esc)
      </button>
    </>
  );
}
