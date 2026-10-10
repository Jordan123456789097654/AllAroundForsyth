"use client";

// Auto tour - goes through the whole site in 4 minutes (240s) so we can record a voiceover.
// Press Esc or the Stop button to end it.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { path: "/", secs: 30, text: "Home - live weather, lake level, air quality and pollen" },
  { path: "/map", secs: 25, text: "Live interactive map of Forsyth County" },
  { path: "/parks", secs: 22, text: "Parks directory and crowd meter" },
  { path: "/top-10", secs: 22, text: "Community Businesses" },
  { path: "/submit-business", secs: 15, text: "Businesses can submit themselves" },
  { path: "/events", secs: 15, text: "Upcoming events" },
  { path: "/civic", secs: 15, text: "Government and civic leaders" },
  { path: "/emergency", secs: 12, text: "Emergency and safety info" },
  { path: "/history", secs: 18, text: "History timeline and Poole's Mill" },
  { path: "/sources", secs: 10, text: "Sources and credits" },
  { path: "/favorites", secs: 10, text: "Favorites" },
  { path: "/trip-planner", secs: 12, text: "Trip planner" },
  { path: "/accessibility", secs: 12, text: "Accessibility statement" },
  { path: "/copyright", secs: 10, text: "Copyright - Jordan Daniels & DJ Reddish" },
  { path: "/fbla", secs: 12, text: "Built for FBLA 2026" },
];

export default function DemoTour() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(0);
  const [showBar, setShowBar] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
    window.scrollTo({ top: 0 });
  }

  function start() {
    setRunning(true);
    setStep(-1);
  }

  // main loop: ticks every 100ms
  useEffect(() => {
    if (!running) return;
    let idx = -1;
    let t0 = 0;

    function go(i: number) {
      idx = i;
      t0 = Date.now();
      setStep(i);
      router.push(STEPS[i].path);
      window.scrollTo({ top: 0 });
    }
    go(0);

    timer.current = setInterval(() => {
      const s = STEPS[idx];
      const sec = (Date.now() - t0) / 1000;
      setLeft(Math.max(0, Math.round(s.secs - sec)));

      // wait 2s for page to load, then scroll down until 90% of the time
      const prog = Math.min(1, Math.max(0, (sec - 2) / (s.secs * 0.9 - 2)));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) window.scrollTo({ top: max * prog });

      if (sec >= s.secs) {
        if (idx + 1 >= STEPS.length) {
          stop();
        } else {
          go(idx + 1);
        }
      }
    }, 100);

    return () => {
      if (timer.current) clearInterval(timer.current);
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

  if (!running) {
    return (
      <button
        onClick={start}
        className="tool-btn bg-[#E29578] text-[#1B3B36] font-extrabold"
        aria-label="Start the 4 minute automatic website tour"
      >
        ▶ Auto Tour (4 min)
      </button>
    );
  }

  const cur = STEPS[Math.max(0, step)];
  return (
    <>
      {showBar && (
        <div role="status" className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] bg-black/80 text-white text-sm px-5 py-2 rounded-full shadow-xl flex items-center gap-3">
          <span className="font-bold">{Math.max(1, step + 1)}/{STEPS.length}</span>
          <span>{cur.text}</span>
          <span className="opacity-70">{left}s</span>
        </div>
      )}
      <div className="fixed bottom-6 left-6 z-[60] flex gap-2">
        <button onClick={stop} className="tool-btn bg-red-600 text-white font-bold">■ Stop (Esc)</button>
        <button onClick={() => setShowBar(!showBar)} className="tool-btn bg-white text-slate-800">
          {showBar ? "Hide captions" : "Show captions"}
        </button>
      </div>
    </>
  );
}
