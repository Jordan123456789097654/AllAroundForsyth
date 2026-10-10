"use client";

// -------------------------------------------------------------
// All Around Forsyth - Parks & Recreation Directory Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified real 10 parks with amenity filtering, hours, acreage, and directions
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStoredData, INITIAL_DATA, ForsythDataset, Park } from "../data/forsythData";
import { Trees, MapPin, CheckCircle, Search, Clock, Compass, Phone, ShieldCheck, ExternalLink } from "lucide-react";

export default function ParksPage() {
  const [data, setData] = useState<ForsythDataset>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("all");

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const popularAmenities = [
    "all",
    "Hiking Trails",
    "Playground",
    "Dog Park",
    "Lake Views",
    "Disc Golf Course",
    "Boat Ramps",
  ];

  const filteredParks = data.parks.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.highlight.toLowerCase().includes(search.toLowerCase()) ||
      p.amenities.some((a) => a.toLowerCase().includes(search.toLowerCase()));

    const matchesAmenity =
      selectedAmenity === "all" ||
      p.amenities.some((a) => a.toLowerCase().includes(selectedAmenity.toLowerCase()));

    return matchesSearch && matchesAmenity;
  });

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#1B3B36] to-[#142D29] text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-emerald-500/20 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-black tracking-widest text-[#E29578] uppercase flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-emerald-400" /> Forsyth County Parks & Recreation (P&R)
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Parks, Greenways & Nature Preserves
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Explore 960+ acres of Blue Ridge foothill trails, historic covered bridge creeks, Lake Lanier beaches, and multi-sport complexes.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search parks or amenities..."
              className="w-full bg-[#0D1F1C] border border-[#2A8C82] text-white text-xs font-semibold rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#E29578] placeholder-emerald-100/40"
            />
          </div>
        </div>

        {/* Amenity Filter Pills */}
        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-emerald-200/80 font-bold text-[11px] pr-2">Filter Amenities:</span>
          {popularAmenities.map((amenity) => (
            <button
              key={amenity}
              onClick={() => setSelectedAmenity(amenity)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                selectedAmenity === amenity
                  ? "bg-[#2A8C82] text-white shadow-sm"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              {amenity === "all" ? "All Parks (10)" : amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Parks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParks.map((park) => (
          <div
            key={park.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
          >
            {/* Image Banner */}
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              {park.image ? (
                <Image
                  src={park.image}
                  alt={park.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-[#1B3B36] flex items-center justify-center text-white/40">
                  <Trees className="w-16 h-16 stroke-1" />
                </div>
              )}

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-[#1B3B36]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                  {park.category}
                </span>
                {park.acreage && (
                  <span className="bg-[#2A8C82]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                    {park.acreage}
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  {park.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {park.address}
                </p>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {park.highlight}
                </p>

                {/* Operating hours & phone */}
                <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  {park.hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> {park.hours}
                    </span>
                  )}
                  {park.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {park.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Amenities Tags */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Features & Amenities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {park.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> {amenity}
                    </span>
                  ))}
                </div>

                {/* Special Interactive Feature Links */}
                {park.id === "pooles-mill" && (
                  <div className="pt-2">
                    <Link
                      href="/history"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-all"
                    >
                      📐 1901 Architecture Blueprint Deep-Dive →
                    </Link>
                  </div>
                )}
                {(park.id === "sawnee-mountain" || park.id === "central-park") && (
                  <div className="pt-2">
                    <Link
                      href="/#crowd-meter"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all"
                    >
                      👥 View Best Time to Visit (Crowd Meter) →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
