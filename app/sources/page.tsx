"use client";

// -------------------------------------------------------------
// All Around Forsyth - Copyright & Citation Documentation Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Required for FBLA Website Design Rubric
// -------------------------------------------------------------

import React from "react";
import { FileText, ShieldCheck, ExternalLink, Award } from "lucide-react";

export default function SourcesPage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-[#E29578] uppercase flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-[#E29578]" /> FBLA Documentation
        </span>
        <h1 className="text-3xl font-extrabold text-[#1B3B36] tracking-tight">
          Copyright, Citations & Source Documentation
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          In strict compliance with FBLA Website Design guidelines, all external media, datasets, map tile providers, and software libraries used in <em>All Around Forsyth</em> (developed by Jordan Daniels & DJ Reddish) are documented below.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Attribution */}
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2 text-xs text-emerald-900">
          <h3 className="font-black text-sm flex items-center gap-2 text-emerald-950">
            <Award className="w-4 h-4 text-[#2A8C82]" /> Student Developers Attribution
          </h3>
          <p>
            <strong>All Around Forsyth</strong> was coded, engineered, and developed by <strong>Jordan Daniels & DJ Reddish</strong> for the 2026 Future Business Leaders of America (FBLA) Website Design State Competition.
          </p>
        </div>

        {/* Media & Photography */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-base text-[#1B3B36] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2A8C82]" /> Media & Photography Citations
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Poole's Mill Covered Bridge Photograph:</strong> Photography by Brian Brown (<em>Vanishing Georgia / Vanishing South Georgia USA</em>, 2022). Used with attribution under educational fair use for non-commercial student competition.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Forsyth County Courthouse Image:</strong> Public domain civic archival photography of Downtown Cumming, Georgia.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Lake Lanier Boating & Recreation Image:</strong> Stock media licensed for educational & non-profit student projects.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Cumming City Center & Community Photography:</strong> Authentic regional photography of Forsyth County parks, local business storefronts, and Lake Lanier recreation areas provided for educational competition display.
            </li>
          </ul>
        </div>

        {/* Data & Mapping Licenses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-base text-[#1B3B36] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2A8C82]" /> Geographic & Data Registry Sources
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>OpenStreetMap (OSM) Map Tiles:</strong> Open Data Commons Open Database License (ODbL) by the OpenStreetMap Foundation (OSMF).
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Forsyth County Government & Public Safety Portals:</strong> Official leadership, emergency response, and municipal registries sourced from forsythco.com and cityofcumming.net.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Forsyth County Parks & Recreation (P&R):</strong> Trail networks, park addresses, and acreage verified via official Forsyth County government GIS portals.
            </li>
          </ul>
        </div>

        {/* Open Source Software Libraries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-base text-[#1B3B36] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2A8C82]" /> Software Frameworks & Libraries
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Next.js (React Framework):</strong> MIT License © Vercel, Inc.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Tailwind CSS:</strong> MIT License © Tailwind Labs, Inc.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Lucide React Icons:</strong> ISC License © Lucide Contributors.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl">
              <strong>Leaflet.js & React-Leaflet:</strong> BSD-2-Clause License © Volodymyr Agafonkin.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
