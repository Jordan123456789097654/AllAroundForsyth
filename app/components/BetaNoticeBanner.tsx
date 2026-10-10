"use client";

// -------------------------------------------------------------
// All Around Forsyth - Public Beta Notice Banner
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Displays official disclaimer that site is in beta and information may not be 100% accurate.
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, X, ShieldAlert, Sparkles } from "lucide-react";

export default function BetaNoticeBanner() {
  const [dismissed, setDismissed] = useState<boolean>(true); // default true until client check
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const isDismissed = sessionStorage.getItem("forsyth_beta_notice_dismissed") === "true";
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("forsyth_beta_notice_dismissed", "true");
    setDismissed(true);
  };

  if (!mounted || dismissed) return null;

  return (
    <div
      role="alert"
      className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-medium py-2 px-4 border-b border-amber-600 shadow-xs relative z-40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
          <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 font-black text-[11px]">
            !
          </span>
          <p className="leading-snug">
            <strong>Website Beta Notice:</strong> All Around Forsyth is currently in public beta. Information, park hours, business listings, and schedules <strong>may not be 100% accurate</strong> as data is continuously updated.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/submit-business"
            className="hidden md:inline-flex items-center gap-1 bg-slate-950/15 hover:bg-slate-950/25 px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-colors"
          >
            Submit Corrections →
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss Beta Notice"
            className="p-1 hover:bg-slate-950/20 rounded-md transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
