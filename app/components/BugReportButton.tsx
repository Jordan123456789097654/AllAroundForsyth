"use client";

// -------------------------------------------------------------
// All Around Forsyth - Bug Report Button & Dialog
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Sends the report plus current page, device, browser and screen info to Discord.
// Accessible: native <dialog>, focus trap, Escape to close, live status messages.
// -------------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bug, X, Send, CheckCircle2 } from "lucide-react";

export default function BugReportButton() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [category, setCategory] = useState("Display / Layout");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const open = () => {
    setStatus("idle");
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close(); // click on backdrop
    };
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const w = window.innerWidth;
    const info = {
      category,
      description,
      contact,
      website: honeypot,
      page: window.location.href,
      pathname,
      deviceType: w < 640 ? "Phone" : w < 1024 ? "Tablet" : "Desktop",
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${w}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "yes" : "no",
    };
    try {
      const res = await fetch("/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setDescription("");
      setContact("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <>
      <button
        onClick={open}
        aria-label="Report a bug"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-[#1B3B36] hover:bg-[#2A8C82] text-white text-xs font-bold px-4 py-3 rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:-translate-y-1 active:scale-95 min-h-[44px]"
      >
        <Bug className="w-4 h-4 text-amber-300" aria-hidden="true" />
        <span className="hidden sm:inline">Report a Bug</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="bug-title"
        className="bug-dialog m-auto w-[calc(100%-1.5rem)] max-w-lg rounded-3xl p-0 shadow-2xl border border-slate-200 backdrop:bg-black/60"
      >
        <div className="p-5 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="bug-title" className="text-xl font-black text-[#1B3B36]">Report a Bug</h2>
              <p className="text-xs text-slate-600 mt-1">
                We automatically include the page you are on and your device info to help us fix it.
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Close bug report"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {status === "sent" ? (
            <div role="status" className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto anim-pop" aria-hidden="true" />
              <p className="font-black text-[#1B3B36]">Thanks! Your report was sent.</p>
              <button onClick={close} className="bg-[#1B3B36] text-white px-5 py-2.5 rounded-xl text-xs font-bold min-h-[44px]">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 text-sm">
              <div>
                <label htmlFor="bug-cat" className="block font-bold text-slate-800 mb-1">What kind of problem?</label>
                <select
                  id="bug-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-base sm:text-sm"
                >
                  <option>Display / Layout</option>
                  <option>Broken link or button</option>
                  <option>Wrong information</option>
                  <option>Map problem</option>
                  <option>Accessibility problem</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="bug-desc" className="block font-bold text-slate-800 mb-1">
                  What happened? <span className="text-rose-700" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <textarea
                  id="bug-desc"
                  required
                  minLength={5}
                  maxLength={1500}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-base sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="bug-contact" className="block font-bold text-slate-800 mb-1">
                  Contact (optional)
                </label>
                <input
                  id="bug-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email or Discord, if you want a reply"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-base sm:text-sm"
                />
              </div>

              {/* honeypot, hidden from people and screen readers */}
              <div className="hidden" aria-hidden="true">
                <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
                Sent with your report: current page ({pathname}), device type, screen size, browser, and language.
                No personal data is collected.
              </p>

              <div role="alert" aria-live="assertive">
                {status === "error" && <p className="text-rose-700 font-bold text-xs">{errorMsg}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#1B3B36] hover:bg-[#2A8C82] disabled:opacity-60 text-white py-3.5 rounded-xl font-black flex items-center justify-center gap-2 min-h-[44px] transition-colors"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                {status === "sending" ? "Sending..." : "Send Bug Report"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
