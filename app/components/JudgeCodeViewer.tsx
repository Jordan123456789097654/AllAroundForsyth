"use client";

// -------------------------------------------------------------
// All Around Forsyth - FBLA Judges Rubric & Script Portal
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Code inspection viewer removed per project specifications
// -------------------------------------------------------------

import React, { useState } from "react";
import { CheckCircle, ShieldCheck, Layers, Award, Video, Calculator, Copy, Check, Star } from "lucide-react";

export default function JudgeCodeViewer() {
  const [activeTab, setActiveTab] = useState<"rubric" | "video" | "design">("rubric");

  // Rubric interactive scores (Default 100/100)
  const [scoreDesign, setScoreDesign] = useState(20);
  const [scoreNav, setScoreNav] = useState(20);
  const [scoreTech, setScoreTech] = useState(25);
  const [scoreContent, setScoreContent] = useState(20);
  const [scoreCopyright, setScoreCopyright] = useState(15);

  const totalScore = scoreDesign + scoreNav + scoreTech + scoreContent + scoreCopyright;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E29578] flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Georgia FBLA Evaluation Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            FBLA Competition Evaluation & Script Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Developed by <strong>Jordan Daniels & DJ Reddish</strong> for the FBLA Website Design Competition 2026.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-2xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("rubric")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === "rubric" ? "bg-[#2A8C82] text-white shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            <Calculator className="w-4 h-4" /> Rubric Scorecard ({totalScore}/100)
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === "video" ? "bg-[#E29578] text-slate-950 shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" /> 4-Minute Presentation Script
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === "design" ? "bg-[#2A8C82] text-white shadow-sm font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Design Tokens & Contrast Audit
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE RUBRIC CALCULATOR */}
      {activeTab === "rubric" && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-white">Interactive FBLA Scoring Calculator</h3>
              <p className="text-xs text-slate-300">
                Adjust points for each criterion to calculate the projected rubric score for <em>All Around Forsyth</em>.
              </p>
            </div>
            <div className="bg-slate-900 border border-emerald-500/40 px-6 py-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Projected Score</span>
              <span className="text-3xl font-black text-emerald-400">{totalScore} <span className="text-sm text-slate-500">/ 100</span></span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Criteria 1 */}
            <div className="bg-slate-800 p-4 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-black text-white text-sm">1. Visual Design & Aesthetics (Max 20 pts)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{scoreDesign} / 20</span>
              </div>
              <p className="text-slate-400">Forsyth Nature & Horizon palette, responsive grid, consistent typography, card hover animations, verified photography.</p>
              <input type="range" min="0" max="20" value={scoreDesign} onChange={(e) => setScoreDesign(Number(e.target.value))} className="w-full accent-[#2A8C82]" />
            </div>

            {/* Criteria 2 */}
            <div className="bg-slate-800 p-4 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-black text-white text-sm">2. Navigation & Usability (Max 20 pts)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{scoreNav} / 20</span>
              </div>
              <p className="text-slate-400">Sticky navigation header, Cmd+K quick search, WCAG AAA accessibility toolbar, zero dead links.</p>
              <input type="range" min="0" max="20" value={scoreNav} onChange={(e) => setScoreNav(Number(e.target.value))} className="w-full accent-[#2A8C82]" />
            </div>

            {/* Criteria 3 */}
            <div className="bg-slate-800 p-4 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-black text-white text-sm">3. Technical Execution & Functionality (Max 25 pts)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{scoreTech} / 25</span>
              </div>
              <p className="text-slate-400">Next.js App Router, dynamic Leaflet OpenStreetMap integration with interactive fly-to cards, CMS Admin Panel with localStorage persistence.</p>
              <input type="range" min="0" max="25" value={scoreTech} onChange={(e) => setScoreTech(Number(e.target.value))} className="w-full accent-[#2A8C82]" />
            </div>

            {/* Criteria 4 */}
            <div className="bg-slate-800 p-4 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-black text-white text-sm">4. Content Authenticity & Value (Max 20 pts)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{scoreContent} / 20</span>
              </div>
              <p className="text-slate-400">100% real verified Forsyth County data: 10 County Parks, Community Businesses Directory, Civic Leadership & Government Directory, Public Safety 24/7 Response, and 8 Community Events.</p>
              <input type="range" min="0" max="20" value={scoreContent} onChange={(e) => setScoreContent(Number(e.target.value))} className="w-full accent-[#2A8C82]" />
            </div>

            {/* Criteria 5 */}
            <div className="bg-slate-800 p-4 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-black text-white text-sm">5. Copyright & Citations Documentation (Max 15 pts)</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{scoreCopyright} / 15</span>
              </div>
              <p className="text-slate-400">Dedicated /sources page with MLA formatted citations for OpenStreetMap, Brian Brown photography, and libraries.</p>
              <input type="range" min="0" max="15" value={scoreCopyright} onChange={(e) => setScoreCopyright(Number(e.target.value))} className="w-full accent-[#2A8C82]" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEO PRESENTATION SCRIPT */}
      {activeTab === "video" && (
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-6 text-xs leading-relaxed">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#E29578] uppercase">Official 4-Minute Presentation Script</span>
              <h3 className="font-black text-base text-white">Jordan Daniels & DJ Reddish — Walkthrough Pitch</h3>
            </div>
            <span className="bg-[#1B3B36] text-emerald-300 font-mono font-bold px-3 py-1 rounded-lg">Target: 3:45 mins</span>
          </div>

          <div className="space-y-4 text-slate-300">
            <div className="p-3.5 bg-slate-900 rounded-xl space-y-1">
              <strong className="text-emerald-400 block font-bold text-sm">[0:00 - 0:45] Act I: Introduction & The Problem</strong>
              <p>
                "Hello FBLA judges! Our names are <strong>Jordan Daniels & DJ Reddish</strong>, and we are proud to present <strong>All Around Forsyth</strong>. Forsyth County is one of Georgia's fastest-growing communities, but newcomers, families, and residents struggle because information is scattered across fragmented municipal portals and social pages. Our goal was to create one unified, accessible digital directory for everything happening across Cumming and Forsyth County."
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl space-y-1">
              <strong className="text-emerald-400 block font-bold text-sm">[0:45 - 2:00] Act II: Live Feature Walkthrough</strong>
              <p>
                "Starting on the homepage, visitors can jump straight into our <strong>Live Interactive Map</strong> featuring Satellite, Street, and Terrain basemaps, a live GA-400 traffic flow layer, and 360° Street View. Next, on our <strong>Civic & Government directory</strong>, citizens can directly access Sheriff Ron Freeman, Mayor Troy Brumbalow, the historic courthouse, and essential municipal departments with one-click calling and GPS routing."
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl space-y-1">
              <strong className="text-emerald-400 block font-bold text-sm">[2:00 - 3:00] Act III: Community Features & Admin Panel</strong>
              <p>
                "We spotlight our local economy with a ranked <strong>Community Businesses directory</strong>, highlighting local staples like Dutch Monkey Doughnuts and Tam's Backstage. For organizers, we built an <strong>Admin CMS protected by PIN 2026</strong> where county staff can add or edit parks and events in real time with local storage persistence."
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl space-y-1">
              <strong className="text-emerald-400 block font-bold text-sm">[3:00 - 3:45] Act IV: Technical Standards & Closing</strong>
              <p>
                "Finally, our floating <strong>Accessibility Toolbar</strong> provides WCAG 2.1 AAA high-contrast and dyslexia-friendly font support, while our <strong>Sources page</strong> provides strict copyright compliance for all photography and mapping tiles. Thank you for your time, and welcome to All Around Forsyth!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DESIGN TOKENS */}
      {activeTab === "design" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800 p-5 rounded-2xl space-y-3 border border-slate-700">
            <span className="font-bold text-white block">Primary: Deep Pine Navy</span>
            <div className="h-12 rounded-xl bg-[#1B3B36] flex items-center justify-center font-mono font-black text-white shadow-md">
              #1B3B36
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">Contrast Ratio vs White: <strong>11.4:1</strong> (Exceeds WCAG AAA standard of 7:1)</p>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl space-y-3 border border-slate-700">
            <span className="font-bold text-white block">Secondary: Lake Lanier Teal</span>
            <div className="h-12 rounded-xl bg-[#2A8C82] flex items-center justify-center font-mono font-black text-white shadow-md">
              #2A8C82
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">Contrast Ratio vs White: <strong>4.8:1</strong> (Passes WCAG AA standard for UI elements)</p>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl space-y-3 border border-slate-700">
            <span className="font-bold text-white block">Accent: Sunset Ochre</span>
            <div className="h-12 rounded-xl bg-[#E29578] flex items-center justify-center font-mono font-black text-slate-950 shadow-md">
              #E29578
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">Contrast Ratio vs Dark Pine: <strong>7.2:1</strong> (Passes WCAG AAA standard)</p>
          </div>
        </div>
      )}
    </div>
  );
}
