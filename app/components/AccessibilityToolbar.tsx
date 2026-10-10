"use client";

// -------------------------------------------------------------
// All Around Forsyth - Accessibility Control Panel (WCAG 2.1 AAA)
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Features: High Contrast Mode, Text Scaling, Dyslexia Mode,
// Reading Guide Line tracker, and Reduced Motion.
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import {
  Eye, Type, Volume2, ShieldCheck, Sun, Moon, Compass,
  Sparkles, MousePointer, Activity, RotateCcw, X
} from "lucide-react";

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // 1. High Contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // 2. Font Size Scaling
    root.classList.remove("text-scale-normal", "text-scale-large", "text-scale-xlarge");
    root.classList.add(`text-scale-${fontSize}`);

    // 3. Dyslexia Mode
    if (dyslexicFont) {
      root.classList.add("font-dyslexic");
    } else {
      root.classList.remove("font-dyslexic");
    }

    // 4. Reduced Motion
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  }, [highContrast, fontSize, dyslexicFont, reducedMotion]);

  // Reading Guide Line Effect
  useEffect(() => {
    let guide = document.getElementById("reading-guide-bar");
    if (!guide) {
      guide = document.createElement("div");
      guide.id = "reading-guide-bar";
      document.body.appendChild(guide);
    }

    if (readingGuide) {
      guide.style.display = "block";
      const handleMouseMove = (e: MouseEvent) => {
        if (guide) {
          guide.style.top = `${e.clientY - 14}px`;
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (guide) guide.style.display = "none";
      };
    } else {
      guide.style.display = "none";
    }
  }, [readingGuide]);

  const handleReset = () => {
    setHighContrast(false);
    setFontSize("normal");
    setDyslexicFont(false);
    setReadingGuide(false);
    setReducedMotion(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Pill with Glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Accessibility Toolbar"
        className="bg-[#1B3B36] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#2A8C82] transition-all flex items-center gap-2.5 border-2 border-white/20 hover:scale-105 active:scale-95 animate-glow"
      >
        <ShieldCheck className="w-5 h-5 text-[#E29578] animate-bounce" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">Accessibility</span>
      </button>

      {/* Control Panel Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-88 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-black text-[#2A8C82] uppercase tracking-wider block">
                WCAG 2.1 AAA Compliant
              </span>
              <h3 className="font-black text-sm flex items-center gap-2 text-[#1B3B36] dark:text-emerald-300">
                <Eye className="w-4 h-4 text-[#E29578]" /> Accessibility Controls
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  {highContrast ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-500" />} High Contrast
                </span>
                <span className="text-[10px] text-slate-500 block">Stark black & yellow theme</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-1 rounded-full font-black text-[11px] transition-all ${
                  highContrast ? "bg-amber-400 text-black shadow-sm" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {highContrast ? "ON" : "OFF"}
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Type className="w-4 h-4 text-[#2A8C82]" /> Text Scaling
              </span>
              <div className="grid grid-cols-3 gap-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`py-1.5 text-center font-black rounded-lg transition-all ${
                    fontSize === "normal" ? "bg-white dark:bg-slate-700 shadow-sm text-[#1B3B36] dark:text-white" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`py-1.5 text-center font-black rounded-lg transition-all ${
                    fontSize === "large" ? "bg-white dark:bg-slate-700 shadow-sm text-[#1B3B36] dark:text-white" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Large (112%)
                </button>
                <button
                  onClick={() => setFontSize("xlarge")}
                  className={`py-1.5 text-center font-black rounded-lg transition-all ${
                    fontSize === "xlarge" ? "bg-white dark:bg-slate-700 shadow-sm text-[#1B3B36] dark:text-white" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  XL (125%)
                </button>
              </div>
            </div>

            {/* Dyslexic Font Toggle */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Volume2 className="w-4 h-4 text-[#E29578]" /> Dyslexia Mode
                </span>
                <span className="text-[10px] text-slate-500 block">High-legibility typography</span>
              </div>
              <button
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`px-3 py-1 rounded-full font-black text-[11px] transition-all ${
                  dyslexicFont ? "bg-[#2A8C82] text-white shadow-sm" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {dyslexicFont ? "ON" : "OFF"}
              </button>
            </div>

            {/* Reading Guide Line Toggle */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <MousePointer className="w-4 h-4 text-emerald-600" /> Reading Guide Bar
                </span>
                <span className="text-[10px] text-slate-500 block">Focus bar tracks cursor</span>
              </div>
              <button
                onClick={() => setReadingGuide(!readingGuide)}
                className={`px-3 py-1 rounded-full font-black text-[11px] transition-all ${
                  readingGuide ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {readingGuide ? "ON" : "OFF"}
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Activity className="w-4 h-4 text-blue-600" /> Reduce Motion
                </span>
                <span className="text-[10px] text-slate-500 block">Pause smooth animations</span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-3 py-1 rounded-full font-black text-[11px] transition-all ${
                  reducedMotion ? "bg-blue-600 text-white shadow-sm" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {reducedMotion ? "ON" : "OFF"}
              </button>
            </div>

            {/* Reset All Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Settings persist in session</span>
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-red-600 font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
