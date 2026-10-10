"use client";

// -------------------------------------------------------------
// All Around Forsyth - Global Command Palette (Cmd + K)
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Instant search across Parks, Businesses, Events, Civic Leadership & Safety
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, MapPin, Trees, Trophy, Calendar, History, X,
  Landmark, ShieldAlert, Store
} from "lucide-react";
import { getStoredData, ForsythDataset, INITIAL_DATA } from "../data/forsythData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [dataset, setDataset] = useState<ForsythDataset>(INITIAL_DATA);

  useEffect(() => {
    if (isOpen) {
      setDataset(getStoredData());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lowerQuery = query.toLowerCase();

  const matchedParks = dataset.parks.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.amenities.some((a) => a.toLowerCase().includes(lowerQuery))
  );

  const matchedBusinesses = dataset.businesses.filter(
    (b) => b.name.toLowerCase().includes(lowerQuery) || b.category.toLowerCase().includes(lowerQuery)
  );

  const matchedEvents = dataset.events.filter(
    (e) => e.title.toLowerCase().includes(lowerQuery) || e.category.toLowerCase().includes(lowerQuery)
  );

  const civicItems = [
    { name: "Ron Freeman (County Sheriff)", href: "/civic", category: "Elected Leader" },
    { name: "Troy Brumbalow (Mayor of Cumming)", href: "/civic", category: "Elected Leader" },
    { name: "Alfred John (BOC Commission Chair)", href: "/civic", category: "Elected Leader" },
    { name: "Forsyth County Courthouse", href: "/civic", category: "County Courts" },
    { name: "Voter Registrations & Elections", href: "/civic", category: "Elections" },
    { name: "Water & Sewer Department", href: "/civic", category: "Utilities" },
    { name: "Tax Commissioner & Tag Office", href: "/civic", category: "Administration" },
  ].filter((c) => c.name.toLowerCase().includes(lowerQuery) || c.category.toLowerCase().includes(lowerQuery));

  const safetyItems = [
    { name: "Call 911 (Life Emergency)", href: "/emergency", category: "Immediate Dispatch" },
    { name: "FCSO Sheriff Non-Emergency ((770) 781-3087)", href: "/emergency", category: "Sheriff Dispatch" },
    { name: "Northside Hospital Forsyth ER", href: "/emergency", category: "Emergency Trauma" },
    { name: "Sawnee EMC Power Outages", href: "/emergency", category: "Power Utility" },
  ].filter((s) => s.name.toLowerCase().includes(lowerQuery) || s.category.toLowerCase().includes(lowerQuery));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
          <Search className="w-5 h-5 text-[#2A8C82]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parks, businesses, events, civic offices, emergency (e.g. Sawnee, Halcyon, Sheriff)..."
            autoFocus
            className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-xs sm:text-sm placeholder-slate-400 font-semibold"
          />
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Box */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1">
          {query.trim() === "" ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <span className="block text-base">🔍</span>
              <p className="font-medium">
                Type any keyword to instantly search 10 parks, top businesses, civic officials, and emergency response across Forsyth County.
              </p>
            </div>
          ) : (
            <>
              {/* Civic Leadership & Departments */}
              {civicItems.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-teal-600" /> Civic & Leadership Directory
                  </h4>
                  <div className="space-y-1">
                    {civicItems.map((c, i) => (
                      <Link
                        key={i}
                        href={c.href}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                        <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">
                          {c.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety & Emergency */}
              {safetyItems.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Public Safety & 24/7 Response
                  </h4>
                  <div className="space-y-1">
                    {safetyItems.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                      >
                        <span className="font-bold text-red-700 dark:text-red-300">{s.name}</span>
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                          {s.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Parks */}
              {matchedParks.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-600" /> Parks & Recreation
                  </h4>
                  <div className="space-y-1">
                    {matchedParks.map((park) => (
                      <Link
                        key={park.id}
                        href="/parks"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                      >
                        <span className="font-black text-slate-800 dark:text-slate-200">{park.name}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                          {park.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Businesses */}
              {matchedBusinesses.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> Top Businesses
                  </h4>
                  <div className="space-y-1">
                    {matchedBusinesses.map((biz) => (
                      <Link
                        key={biz.id}
                        href="/top-10"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                      >
                        <span className="font-black text-slate-800 dark:text-slate-200">
                          #{biz.rank} {biz.name}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-black">
                          {biz.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {matchedEvents.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E29578]" /> Upcoming Events
                  </h4>
                  <div className="space-y-1">
                    {matchedEvents.map((evt) => (
                      <Link
                        key={evt.id}
                        href="/events"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                      >
                        <span className="font-black text-slate-800 dark:text-slate-200">{evt.title}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{evt.date}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchedParks.length === 0 &&
                matchedBusinesses.length === 0 &&
                matchedEvents.length === 0 &&
                civicItems.length === 0 &&
                safetyItems.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No results found for "{query}". Try "Sawnee", "Dutch", "Fowler", "Sheriff", or "Halcyon".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
