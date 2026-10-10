"use client";

// -------------------------------------------------------------
// All Around Forsyth - Forsyth Heritage & History Timeline Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026 (#2 Requested Feature)
// Uses reference images for Courthouse, Poole's Mill, Lake Lanier, and Halcyon
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStoredData, INITIAL_DATA, ForsythDataset } from "../data/forsythData";
import { History, BookOpen, ShieldCheck } from "lucide-react";
import PoolesMillDiagram from "../components/PoolesMillDiagram";

export default function HistoryPage() {
  const [data, setData] = useState<ForsythDataset>(INITIAL_DATA);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(getStoredData());
    setMounted(true);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in" suppressHydrationWarning>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#1B3B36] to-[#0A1A18] text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-purple-500/20 space-y-3" suppressHydrationWarning>
        <span className="text-[11px] font-black tracking-widest text-purple-300 uppercase flex items-center gap-1.5">
          <History className="w-4 h-4 text-purple-400" /> Forsyth County Historical Society & Heritage
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Forsyth County Heritage & Architecture
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
          From the 1832 creation of Forsyth County and the 1901 Town lattice covered bridge over Settendown Creek, to the Buford Dam flooding and modern commercial centers.
        </p>
      </div>

      {/* Interactive Poole's Mill Architecture Deep-Dive Blueprint */}
      <PoolesMillDiagram />

      {/* Visual Timeline Stream */}
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 block mb-1">
            Historical Milestones
          </span>
          <h2 className="text-2xl font-black text-[#1B3B36]">
            County Heritage Timeline (1832 - 2026)
          </h2>
        </div>
      <div className="relative border-l-2 border-[#2A8C82]/40 ml-4 sm:ml-8 space-y-12 pl-6 sm:pl-10" suppressHydrationWarning>
        {data.history.map((event, idx) => (
          <div key={idx} className="relative group" suppressHydrationWarning>
            {/* Timeline Circle Marker */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#2A8C82] border-4 border-white text-white flex items-center justify-center shadow-md">
              <div className="w-2 h-2 rounded-full bg-[#E29578]" />
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-7" suppressHydrationWarning>
              <div className="md:col-span-2 space-y-3 flex flex-col justify-between" suppressHydrationWarning>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#1B3B36] text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
                      {event.year}
                    </span>
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1B3B36]">{event.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-[#2A8C82]" />
                  <span>Archived in Forsyth County Historical Society Records</span>
                </div>
              </div>

              {event.image && (
                <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner" suppressHydrationWarning>
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Citation Callout at bottom */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600" suppressHydrationWarning>
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Historic photography including Poole's Mill Bridge courtesy of Brian Brown (<em>Vanishing Georgia</em>).
        </span>
        <Link href="/sources" className="font-bold text-[#2A8C82] hover:underline shrink-0">
          View Complete Citations →
        </Link>
      </div>
    </div>
  );
}
