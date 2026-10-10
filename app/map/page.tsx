"use client";

// -------------------------------------------------------------
// All Around Forsyth - Live Interactive Map Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified coordinates and places across Forsyth County, GA
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getStoredData, INITIAL_DATA, ForsythDataset, Park, Business } from "../data/forsythData";
import { MapPin, Trees, Trophy, Filter, Landmark } from "lucide-react";

// Dynamically import Leaflet LiveMap component with SSR disabled
const LiveMap = dynamic(() => import("../components/LiveMap"), {
  ssr: false,
  loading: () => <div role="status" className="skeleton map-skeleton"><span className="sr-only">Loading map...</span></div>,
});

export default function MapPage() {
  const [data, setData] = useState<ForsythDataset>(INITIAL_DATA);
  const [category, setCategory] = useState<"all" | "parks" | "businesses" | "landmarks">("all");

  useEffect(() => {
    setData(getStoredData());
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Page Title & Category Filter */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-black tracking-widest text-[#2A8C82] uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#E29578]" /> Geographic Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1B3B36] tracking-tight mt-1">
            Forsyth County Live Interactive Map
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore 10 county parks, verified community businesses, and historic landmarks with Google Maps layers, traffic, and 360° Street View.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 shrink-0">
          <button
            onClick={() => setCategory("all")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              category === "all" ? "bg-[#1B3B36] text-white shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> All Pins
          </button>
          <button
            onClick={() => setCategory("parks")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              category === "parks" ? "bg-emerald-700 text-white shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Trees className="w-3.5 h-3.5" /> Parks ({data.parks.length})
          </button>
          <button
            onClick={() => setCategory("businesses")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              category === "businesses" ? "bg-amber-500 text-white shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Businesses ({data.businesses.length})
          </button>
          <button
            onClick={() => setCategory("landmarks")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              category === "landmarks" ? "bg-purple-600 text-white shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Landmark className="w-3.5 h-3.5" /> Landmarks (3)
          </button>
        </div>
      </div>

      {/* Render Leaflet Map */}
      <LiveMap
        parks={data.parks}
        businesses={data.businesses}
        selectedCategory={category}
      />
    </div>
  );
}
