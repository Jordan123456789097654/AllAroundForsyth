"use client";

// -------------------------------------------------------------
// All Around Forsyth - Poole's Mill Covered Bridge Architecture Deep-Dive
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Interactive SVG blueprint diagram explaining the 1901 Town lattice-truss design,
// wooden trunnels, Settendown Creek granite piers, and Dr. Poole's mill history.
// -------------------------------------------------------------

import React, { useState } from "react";
import Image from "next/image";
import {
  Compass, Eye, Info, Hammer, Landmark, Waves,
  Sparkles, CheckCircle2, ChevronRight, Layers, HelpCircle
} from "lucide-react";

interface Hotspot {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  xPercent: number; // For SVG positioning
  yPercent: number;
  shortDesc: string;
  detailedAnalysis: string;
  structuralRole: string;
  historicalContext: string;
  material: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "lattice-truss",
    number: 1,
    title: "1901 Town Lattice-Truss Web",
    subtitle: "Ithiel Town 1820 Patented Geometric Lattice",
    xPercent: 50,
    yPercent: 44,
    material: "3\" x 10\" Georgia Heart-Pine Planks",
    structuralRole: "Disperses live traffic and wind loads horizontally throughout an uninterrupted criss-cross grid, eliminating the need for expensive iron tension rods.",
    historicalContext: "Patented in 1820 by Connecticut architect Ithiel Town, this lattice design revolutionized 19th-century American bridge building because it could be erected quickly by local carpenters using native timber.",
    shortDesc: "Overlapping heart-pine lattice creating a continuous girder spanning 96 feet across Settendown Creek.",
    detailedAnalysis: "The Town Lattice truss consists of continuous top and bottom chords connected by a web of crisscrossing diagonal planks that form a series of overlapping isosceles triangles. Unlike Pratt or Warren trusses which require specialized steel fittings, Town's design evenly distributes compression and tension forces through pure geometric friction and redundancy.",
  },
  {
    id: "trunnels",
    number: 2,
    title: "White Oak 'Trunnels' (Tree-Nails)",
    subtitle: "Cylindrical Hardwood Peg Fasteners",
    xPercent: 32,
    yPercent: 48,
    material: "Kiln-Seasoned Native White Oak Pegs",
    structuralRole: "Locks the intersecting heart-pine lattice planks together at every intersection, absorbing shearing stresses without rusting or rotting the surrounding timber.",
    historicalContext: "Constructed by master builder Bud Gentry in 1901. Holes were bored with hand augers, and dried oak trunnels were hammered into place. In Georgia's humid climate, the wooden pegs expand with ambient air moisture, creating a tighter friction bond over decades.",
    shortDesc: "2-inch cylindrical wooden pins driven through drilled auger holes at every truss intersection.",
    detailedAnalysis: "Metal spikes and iron bolts were both costly and vulnerable: seasonal temperature changes caused iron to sweat and rust, which rotted the adjacent wood grain. Hand-turned oak trunnels breathe with the structure, expanding and flexing with the heavy pine timbers as horse buggies and early farm tractors crossed.",
  },
  {
    id: "granite-piers",
    number: 3,
    title: "Settendown Creek Granite Piers",
    subtitle: "Hand-Quarried Native Granite Foundations",
    xPercent: 50,
    yPercent: 78,
    material: "Native Forsyth County Granitic Gneiss Stone",
    structuralRole: "Anchors the 96-foot span 20 feet above Settendown Creek to protect the wooden structure from torrential flood crests.",
    historicalContext: "Settendown Creek experiences sudden mountain runoff during North Georgia storms. In 1899, a flash flood swept away an earlier bridge. In 1901, the county commissioned massive granite stone abutments and piers to permanently resist hydraulic pressure.",
    shortDesc: "Hand-hewn granite boulders providing dry stone foundation high above turbulent flood lines.",
    detailedAnalysis: "The stone abutments are engineered with angled cutwaters (prow-like stone noses) pointing upstream into Settendown Creek. This deflects river flotsam, uprooted logs, and winter rushing waters away from the timber underpinnings, protecting the superstructure for over 125 years.",
  },
  {
    id: "weatherboard-roof",
    number: 4,
    title: "Protective Weatherboarding & Cedar Roof",
    subtitle: "The Structural Reason Bridges Were Covered",
    xPercent: 74,
    yPercent: 24,
    material: "Horizontal Pine Weatherboards & Cedar Shakes",
    structuralRole: "Shields the interior timber lattice trusses from the rot caused by rainfall, morning dew, and ultraviolet solar degradation.",
    historicalContext: "Popular folklore claimed covered bridges were built so horses would not fear the water below. In reality, timber truss bridges left uncovered in Georgia rotted within 10 to 15 years. Covering the bridge extended its service life to well over a century.",
    shortDesc: "Protective pine siding that prevents water from collecting in the thousands of trunnel joint peg holes.",
    detailedAnalysis: "The roof features extended 3-foot eaves and overhang portals on both east and west entrances. The side walls leave narrow clerestory slits under the eaves, allowing cross-ventilation to dry out moisture while shielding the critical chord joints from horizontal driving rain.",
  },
  {
    id: "cherokee-mill",
    number: 5,
    title: "Chief Settendown & Dr. Poole's Grist Mill",
    subtitle: "1820s Cherokee Heritage & Historic Commerce",
    xPercent: 18,
    yPercent: 72,
    material: "Creek Millrace, Granite Waterwheel & Turbine",
    structuralRole: "Historic industrial center that gave the bridge and park its name, powering North Forsyth's agriculture.",
    historicalContext: "Before the 1838 Trail of Tears, Cherokee leader Chief Settendown operated a grist mill at these falls. In 1880, physician and civic leader Dr. M.L. Poole acquired the site, operating a turbine-driven grist mill, cotton gin, and sawmill.",
    shortDesc: "The rushing creek falls provided hydraulic power for Cherokee and Forsyth County grist milling.",
    detailedAnalysis: "Farmers traveled from across Forsyth, Cherokee, and Dawson counties to grind cornmeal and gin cotton at Poole's Mill. The covered bridge was specifically built in 1901 by the county so farmers could safely haul heavy wagon loads of grain across Settendown Creek during high water.",
  },
];

export default function PoolesMillDiagram() {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>("lattice-truss");
  const [viewMode, setViewMode] = useState<"blueprint" | "photo">("blueprint");

  const active = HOTSPOTS.find((h) => h.id === selectedHotspotId) || HOTSPOTS[0];

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-800 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5 text-purple-600" /> Historic Engineering Deep-Dive
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
            Poole's Mill Covered Bridge: Architectural Anatomy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Constructed in 1901 across Settendown Creek, Poole's Mill is one of Georgia's few surviving Town lattice-truss covered bridges. Explore the clickable structural blueprint below.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 shrink-0">
          <button
            onClick={() => setViewMode("blueprint")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === "blueprint"
                ? "bg-[#1B3B36] text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> 1901 Engineering Blueprint
          </button>
          <button
            onClick={() => setViewMode("photo")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === "photo"
                ? "bg-purple-700 text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Real Photo View
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas & Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Diagram Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-inner bg-[#0B1A28] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            {viewMode === "blueprint" ? (
              // SVG Architectural Blueprint View
              <div className="relative w-full h-full p-4 sm:p-6 select-none">
                {/* Blueprint Grid Background Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Technical Waterway & Bridge SVG Graphic */}
                <svg className="w-full h-full" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Settendown Creek Water Level */}
                  <path d="M 0 360 Q 200 345 400 365 T 800 355 L 800 450 L 0 450 Z" fill="#0369A1" fillOpacity="0.4" />
                  <path d="M 0 380 Q 250 365 500 385 T 800 375 L 800 450 L 0 450 Z" fill="#0284C7" fillOpacity="0.3" />

                  {/* Settendown Creek Current Lines */}
                  <path d="M 80 400 C 180 395, 260 415, 360 400" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
                  <path d="M 450 410 C 550 405, 620 420, 720 410" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
                  <text x="350" y="430" fill="#BAE6FD" fontSize="13" fontFamily="monospace" letterSpacing="2">
                    SETTENDOWN CREEK (WATERWAY FLOW)
                  </text>

                  {/* Left & Right Granite Abutments */}
                  <rect x="40" y="270" width="120" height="120" fill="#334155" stroke="#64748B" strokeWidth="2" />
                  <rect x="640" y="270" width="120" height="120" fill="#334155" stroke="#64748B" strokeWidth="2" />
                  {/* Central Pier */}
                  <polygon points="360,280 440,280 430,400 370,400" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  <text x="375" y="340" fill="#94A3B8" fontSize="11" fontFamily="monospace">STONE PIER</text>

                  {/* Bottom Timber Chords */}
                  <rect x="120" y="260" width="560" height="18" fill="#B45309" stroke="#FDE68A" strokeWidth="1.5" />
                  <text x="330" y="274" fill="#FEF08A" fontSize="10" fontWeight="bold">LOWER TENSION CHORD</text>

                  {/* Top Timber Chords */}
                  <rect x="120" y="140" width="560" height="18" fill="#B45309" stroke="#FDE68A" strokeWidth="1.5" />
                  <text x="325" y="153" fill="#FEF08A" fontSize="10" fontWeight="bold">UPPER COMPRESSION CHORD</text>

                  {/* Town Lattice Diagonal Webs (Criss-Cross Heart Pine Lattice) */}
                  {[140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580, 620].map((x, i) => (
                    <line key={`diag-r-${i}`} x1={x} y1="260" x2={x + 60} y2="158" stroke="#FBBF24" strokeWidth="3" opacity="0.85" />
                  ))}
                  {[140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580, 620].map((x, i) => (
                    <line key={`diag-l-${i}`} x1={x + 60} y1="260" x2={x} y2="158" stroke="#F59E0B" strokeWidth="3" opacity="0.85" />
                  ))}

                  {/* Trunnel Peg Dots at lattice intersections */}
                  {[200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600].map((x, i) => (
                    <circle key={`peg-${i}`} cx={x} cy="209" r="3.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
                  ))}

                  {/* Roof Structure */}
                  <polygon points="100,140 400,80 700,140" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />
                  <line x1="100" y1="140" x2="700" y2="140" stroke="#38BDF8" strokeWidth="2" />
                  {/* Roof overhang eaves */}
                  <line x1="80" y1="145" x2="400" y2="75" stroke="#7DD3FC" strokeWidth="3" />
                  <line x1="400" y1="75" x2="720" y2="145" stroke="#7DD3FC" strokeWidth="3" />
                  <text x="350" y="115" fill="#E0F2FE" fontSize="12" fontWeight="bold">CEDAR ROOF TRUSS</text>

                  {/* Bridge Dimension Line */}
                  <line x1="120" y1="50" x2="680" y2="50" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="120" y1="42" x2="120" y2="58" stroke="#38BDF8" strokeWidth="1.5" />
                  <line x1="680" y1="42" x2="680" y2="58" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="360" y="45" fill="#38BDF8" fontSize="11" fontFamily="monospace">96 FEET SPAN</text>
                </svg>

                {/* Hotspot Clickable Pins Overlay */}
                {HOTSPOTS.map((spot) => {
                  const isSelected = spot.id === selectedHotspotId;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspotId(spot.id)}
                      style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 z-20 cursor-pointer ${
                        isSelected
                          ? "w-9 h-9 bg-amber-400 text-black font-black ring-4 ring-amber-300/40 shadow-lg scale-110"
                          : "w-7 h-7 bg-[#2A8C82] text-white hover:bg-amber-400 hover:text-black font-bold shadow-md hover:scale-105"
                      }`}
                      title={spot.title}
                    >
                      <span className="text-xs">{spot.number}</span>
                      {isSelected && (
                        <span className="absolute -inset-1 rounded-full border-2 border-amber-300 animate-ping pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Real Photo View with Hotspot Pins Overlay
              <div className="relative w-full h-full">
                <Image
                  src="/images/pooles-mill-covered-bridge-1-forsyth-county-ga-photograph-copyright-brian-brown-vanishing-georgia-usa-2022.webp"
                  alt="Poole's Mill Covered Bridge Photograph"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-black/20" />

                {/* Hotspot Pins on photo */}
                {HOTSPOTS.map((spot) => {
                  const isSelected = spot.id === selectedHotspotId;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspotId(spot.id)}
                      style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 z-20 cursor-pointer ${
                        isSelected
                          ? "w-9 h-9 bg-amber-400 text-black font-black ring-4 ring-amber-300/60 shadow-xl scale-110"
                          : "w-7 h-7 bg-white text-slate-900 hover:bg-amber-400 font-black shadow-md hover:scale-105"
                      }`}
                    >
                      <span className="text-xs">{spot.number}</span>
                    </button>
                  );
                })}

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1 rounded-full">
                  Photo © Brian Brown / <em>Vanishing Georgia</em>
                </div>
              </div>
            )}
          </div>

          {/* Quick Select Hotspot Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {HOTSPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedHotspotId(spot.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  spot.id === selectedHotspotId
                    ? "bg-[#1B3B36] text-white border-[#1B3B36] shadow-sm font-black"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-black inline-flex items-center justify-center">
                  {spot.number}
                </span>
                {spot.title.split(" ")[0]} {spot.title.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Educational Deep-Dive Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-white to-amber-500/5 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs inline-flex items-center justify-center shrink-0">
                {active.number}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                Architectural Element
              </span>
            </div>
            <h3 className="text-xl font-black text-[#1B3B36] mt-1">
              {active.title}
            </h3>
            <p className="text-xs font-bold text-slate-500">
              {active.subtitle}
            </p>
          </div>

          {/* Material & Engineering Role Badge */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                Primary Material:
              </span>
              <strong className="text-slate-800 font-bold">{active.material}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                Structural Function:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{active.structuralRole}</p>
            </div>
          </div>

          {/* Detailed Engineering Analysis */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#2A8C82] flex items-center gap-1">
              <Hammer className="w-3.5 h-3.5" /> Engineering & Mechanics
            </span>
            <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {active.detailedAnalysis}
            </p>
          </div>

          {/* Historical Context */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-700 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" /> Forsyth County History
            </span>
            <p className="text-slate-700 leading-relaxed font-medium bg-amber-500/10 p-3.5 rounded-2xl border border-amber-300/40">
              {active.historicalContext}
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Quick Specs Bar */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Construction Year</span>
          <strong className="text-[#1B3B36] font-black text-sm">1901 by Bud Gentry</strong>
        </div>
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Clear Span</span>
          <strong className="text-[#1B3B36] font-black text-sm">96 Feet (29.3 m)</strong>
        </div>
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Lattice Truss Patent</span>
          <strong className="text-[#1B3B36] font-black text-sm">Ithiel Town (1820)</strong>
        </div>
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Creek Crossing</span>
          <strong className="text-[#1B3B36] font-black text-sm">Settendown Creek</strong>
        </div>
      </div>
    </section>
  );
}
