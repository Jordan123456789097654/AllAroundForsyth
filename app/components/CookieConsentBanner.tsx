"use client";

// -------------------------------------------------------------
// All Around Forsyth - Real Cookie Consent Management Banner
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// WCAG 2.1 AAA Compliant: Sets real browser cookies (document.cookie) & localStorage
// Supports Accept All, Essential Only, and Detailed Preference Toggles.
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, Settings2, X, ChevronRight, Lock } from "lucide-react";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(true);
  const [preferencesEnabled, setPreferencesEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    // Check if consent has already been stored
    const stored = localStorage.getItem("forsyth_cookie_consent_choice");
    const hasCookie = document.cookie.includes("forsyth_cookies_consent=");

    if (!stored && !hasCookie) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }

    // Listen for custom event triggered from Footer "Cookie Preferences"
    const handleReopen = () => {
      setVisible(true);
      setShowPreferences(true);
    };

    window.addEventListener("open-cookie-banner", handleReopen);
    return () => window.removeEventListener("open-cookie-banner", handleReopen);
  }, []);

  const setCookie = (name: string, value: string, days: number = 365) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const handleAcceptAll = () => {
    setCookie("forsyth_cookies_consent", "all");
    setCookie("forsyth_cookie_preferences", "true");
    setCookie("forsyth_cookie_analytics", "true");
    localStorage.setItem("forsyth_cookie_consent_choice", "all");
    localStorage.setItem("forsyth_cookie_prefs_active", "true");

    triggerSavedFeedback("All cookies accepted and saved ✓");
  };

  const handleEssentialOnly = () => {
    setCookie("forsyth_cookies_consent", "essential");
    setCookie("forsyth_cookie_preferences", "false");
    setCookie("forsyth_cookie_analytics", "false");
    localStorage.setItem("forsyth_cookie_consent_choice", "essential");
    localStorage.setItem("forsyth_cookie_prefs_active", "false");

    triggerSavedFeedback("Essential cookies only enabled ✓");
  };

  const handleSaveCustom = () => {
    setCookie("forsyth_cookies_consent", "custom");
    setCookie("forsyth_cookie_preferences", preferencesEnabled ? "true" : "false");
    setCookie("forsyth_cookie_analytics", analyticsEnabled ? "true" : "false");
    localStorage.setItem("forsyth_cookie_consent_choice", "custom");
    localStorage.setItem("forsyth_cookie_prefs_active", preferencesEnabled ? "true" : "false");

    triggerSavedFeedback("Custom cookie preferences saved ✓");
  };

  const triggerSavedFeedback = (msg: string) => {
    setToastMessage(msg);
    setShowPreferences(false);
    setTimeout(() => {
      setVisible(false);
      setToastMessage("");
    }, 1500);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-4xl mx-auto bg-[#1B3B36] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#2A8C82]/50 backdrop-blur-xl space-y-5">
        {toastMessage ? (
          <div className="py-4 text-center flex items-center justify-center gap-2 text-emerald-300 font-black text-sm">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        ) : showPreferences ? (
          // Detailed Preferences Modal View
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-base sm:text-lg">
                  Customize Cookie Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Configure which cookies and local storage items you allow All Around Forsyth to store on your device:
            </p>

            <div className="space-y-3 text-xs">
              {/* Category 1: Essential */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-black text-emerald-200">
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Essential & Security Cookies</span>
                    <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-bold ml-1">Always Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/70">
                    Required for site security and core navigation functionality.
                  </p>
                </div>
                <input type="checkbox" checked disabled className="w-4 h-4 accent-[#2A8C82] cursor-not-allowed opacity-70" />
              </div>

              {/* Category 2: Preferences */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-black text-emerald-200">
                    User Preferences & Accessibility
                  </div>
                  <p className="text-[11px] text-emerald-100/70">
                    Remembers your High Contrast mode, font size scaling, reading guide bar, and Day Trip Planner.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferencesEnabled}
                  onChange={(e) => setPreferencesEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#2A8C82] cursor-pointer"
                />
              </div>

              {/* Category 3: Analytics */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-black text-emerald-200">
                    Anonymous Performance & Telemetry
                  </div>
                  <p className="text-[11px] text-emerald-100/70">
                    Helps FBLA developers understand park search trends and weather widget API health.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#2A8C82] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPreferences(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSaveCustom}
                className="bg-[#2A8C82] hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black transition-colors shadow-md cursor-pointer"
              >
                Save Selected Preferences
              </button>
            </div>
          </div>
        ) : (
          // Default Banner View
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                  <span>Cookie & Storage Consent</span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Privacy First
                  </span>
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
                  All Around Forsyth uses functional browser cookies to preserve your accessibility tools (High Contrast, Text Scaling, Reading Guide), save custom Day Trip itineraries, and store merchant storefront bookmarks.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                onClick={handleAcceptAll}
                className="flex-1 lg:flex-initial bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 rounded-xl font-black text-xs transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                Accept All Cookies
              </button>
              <button
                onClick={handleEssentialOnly}
                className="flex-1 lg:flex-initial bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="p-3 text-emerald-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Customize cookie settings"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
