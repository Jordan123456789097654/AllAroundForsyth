"use client";

// -------------------------------------------------------------
// All Around Forsyth - Complete Modern Homepage
// Coded by DJ for FBLA Competition 2026
// Verified real Forsyth County GA data, Day Trip Itinerary Builder & Feeder Visualizer
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Trees, Trophy, Calendar, History, Landmark, ShieldAlert, Store,
  ArrowRight, Sparkles, ShieldCheck, Award, Star, Compass,
  Clock, Waves, Sun, CheckCircle2, Share2, Printer
} from "lucide-react";
import { getStoredData, INITIAL_DATA, ForsythDataset, Park, Business, EventItem } from "./data/forsythData";
import LiveConditionsWidget from "./components/LiveConditionsWidget";
import CrowdMeterWidget from "./components/CrowdMeterWidget";

export default function HomePage() {
  const [data, setData] = useState<ForsythDataset>(INITIAL_DATA);

  // Day Trip Builder State
  const [selectedParkId, setSelectedParkId] = useState<string>("sawnee-mountain");
  const [selectedBizId, setSelectedBizId] = useState<string>("halcyon");
  const [selectedEventId, setSelectedEventId] = useState<string>("city-center-concerts");
  const [itineraryCopied, setItineraryCopied] = useState<boolean>(false);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const chosenPark = data.parks.find((p) => p.id === selectedParkId) || data.parks[0];
  const chosenBiz = data.businesses.find((b) => b.id === selectedBizId) || data.businesses[0];
  const chosenEvent = data.events.find((e) => e.id === selectedEventId) || data.events[0];

  // DJ & Jordan: copy button formatting for the quick trip itinerary
  const handleCopyItinerary = () => {
    // DJ: added emojis so when people text it to their friends it looks clean
    const text = `🌟 My Forsyth County Day Trip:\n` +
      `🌲 Morning (10:00 AM): Explore ${chosenPark.name} (${chosenPark.address})\n` +
      `🍽️ Afternoon (1:00 PM): Lunch & Shopping at ${chosenBiz.name} (${chosenBiz.address})\n` +
      `🎉 Evening (6:30 PM): Attend ${chosenEvent.title} (${chosenEvent.location})\n` +
      `Plan your own trip at All Around Forsyth!`;
    navigator.clipboard.writeText(text);
    setItineraryCopied(true);
    setTimeout(() => setItineraryCopied(false), 2000); // Jordan: 2 sec is good before checkmark resets
  };

  return (
    <div className="space-y-14 animate-in fade-in duration-300">
      {/* Premium Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B3B36] via-[#142D29] to-[#0A1A18] text-white shadow-2xl border border-[#2A8C82]/30">
        {/* Real Courthouse Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Forsyth_County_courthouse.jpg"
            alt="Forsyth County Courthouse"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3B36] via-[#1B3B36]/95 to-transparent" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 p-8 sm:p-14 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#2A8C82]/30 border border-[#2A8C82]/60 backdrop-blur-md text-emerald-200 px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-[#E29578]" /> Official FBLA Community Web Guide 2026
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Explore Everything <br />
            <span className="bg-gradient-to-r from-[#E29578] via-amber-300 to-emerald-300 bg-clip-text text-transparent">
              All Around Forsyth
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl font-medium">
            Your centralized interactive guide to <strong>Forsyth County, Georgia</strong> — featuring 10 county parks, verified community businesses, civic government directory, and upcoming community festivals.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/map"
              className="bg-[#2A8C82] hover:bg-[#23776f] text-white px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-emerald-900/40 transition-all hover:-translate-y-0.5"
            >
              <MapPin className="w-4 h-4 text-[#E29578]" /> Explore Live Interactive Map
            </Link>
            <Link
              href="/top-10"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all hover:-translate-y-0.5"
            >
              <Trophy className="w-4 h-4 text-amber-300" /> View Community Businesses
            </Link>
          </div>

          {/* Verified Stats Strip */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-[#E29578] block">38,000 Acres</span>
              <span className="text-emerald-100/80 text-[11px] font-bold">Lake Lanier Reservoir</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-amber-300 block">10 Parks</span>
              <span className="text-emerald-100/80 text-[11px] font-bold">960+ Acres of Trails</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-emerald-300 block">Community</span>
              <span className="text-emerald-100/80 text-[11px] font-bold">Businesses Listed</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-cyan-300 block">11+ Miles</span>
              <span className="text-emerald-100/80 text-[11px] font-bold">Big Creek Greenway</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Conditions Widget Banner (Real-time Open-Meteo & USGS APIs) */}
      <LiveConditionsWidget />

      {/* Category Directory Grid */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#2A8C82] uppercase block mb-1">
              Interactive Navigation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
              Explore by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          <Link
            href="/map"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#2A8C82] shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#2A8C82] mx-auto flex items-center justify-center group-hover:bg-[#2A8C82] group-hover:text-white transition-colors shadow-inner">
              <MapPin className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Live Map
            </span>
          </Link>

          <Link
            href="/parks"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
              <Trees className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Parks & Trails (10)
            </span>
          </Link>

          <Link
            href="/top-10"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-inner">
              <Trophy className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Community Businesses
            </span>
          </Link>

          <Link
            href="/civic"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-inner">
              <Landmark className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Civic & Government
            </span>
          </Link>

          <Link
            href="/emergency"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-red-500 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Safety & 911 Hub
            </span>
          </Link>

          <Link
            href="/events"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#E29578] shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#E29578] mx-auto flex items-center justify-center group-hover:bg-[#E29578] group-hover:text-white transition-colors shadow-inner">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Events (8)
            </span>
          </Link>

          <Link
            href="/history"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-inner">
              <History className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              History
            </span>
          </Link>

          <Link
            href="/submit-business"
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-3 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-inner">
              <Store className="w-7 h-7" />
            </div>
            <span className="font-black text-xs text-slate-800 group-hover:text-[#1B3B36] block">
              Submit Business
            </span>
          </Link>
        </div>
      </section>

      {/* Interactive Day Trip Itinerary Builder Feature */}
      <section className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-[#F4F6F8] p-6 sm:p-10 rounded-3xl border border-amber-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" /> Interactive Planner Tool
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight mt-1">
              Build Your Perfect Day in Forsyth
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Select 1 park, 1 restaurant or shop, and 1 community event to generate your personalized weekend plan.
            </p>
          </div>

          <button
            onClick={handleCopyItinerary}
            className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            {itineraryCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4 text-[#E29578]" />}
            {itineraryCopied ? "Itinerary Copied!" : "Copy Schedule"}
          </button>
        </div>

        {/* 3 Step Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-xs font-black text-emerald-800">
              1. Morning Outdoor Adventure:
            </label>
            <select
              value={selectedParkId}
              onChange={(e) => setSelectedParkId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#2A8C82]"
            >
              {data.parks.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">{chosenPark.highlight}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-xs font-black text-amber-800">
              2. Afternoon Dining & Shopping:
            </label>
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#2A8C82]"
            >
              {data.businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.rank} {b.name} ({b.category})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">{chosenBiz.description}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-xs font-black text-orange-800">
              3. Evening Community Event:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#2A8C82]"
            >
              {data.events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">{chosenEvent.date} • {chosenEvent.location}</p>
          </div>
        </div>
      </section>

      {/* Interactive Best Time to Visit Crowd Meter */}
      <div id="crowd-meter">
        <CrowdMeterWidget />
      </div>

      {/* 🎭 Tourism, Culture & Heritage Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#E29578] uppercase flex items-center gap-1.5 mb-1">
              🎭 Tourism, Culture & Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
              Forsyth County Cultural Landmarks
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Explore living Appalachian foothills heritage, historic Town lattice engineering, outdoor amphitheaters, and 38,000 acres of Lake Lanier.
            </p>
          </div>

          <Link
            href="/history"
            className="text-xs font-black text-[#2A8C82] hover:text-[#1B3B36] flex items-center gap-1 shrink-0"
          >
            Explore Heritage Timeline & Blueprint →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Poole's Mill Covered Bridge */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/pooles-mill-covered-bridge-1-forsyth-county-ga-photograph-copyright-brian-brown-vanishing-georgia-usa-2022.webp"
                alt="Poole's Mill Covered Bridge"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-4 left-4 bg-[#1B3B36] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                Built 1901 • Settendown Creek
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  Poole's Mill Covered Bridge
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Historic 96-ft Town lattice-truss bridge held with wooden tree-nails. Discover the 1820 Cherokee grist mill site.
                </p>
              </div>
              <Link
                href="/history"
                className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 hover:text-purple-900 pt-2"
              >
                📐 View 1901 Architecture Blueprint <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Lou Sobh Amphitheater & Cumming City Center */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/cumming-city-center.jpg"
                alt="Lou Sobh Amphitheater & Cumming City Center"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                Performing Arts & Piazza
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  Lou Sobh Amphitheater & City Center
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The cultural heart of Forsyth County featuring free outdoor summer concerts, local community theater, water fountains, and boardwalks.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#2A8C82] hover:text-[#1B3B36] pt-2"
              >
                View Concerts & Festivals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Lake Lanier Boating & Water Sports */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/lake-lanier-boating-fishing_240591beeb8.jpg"
                alt="Lake Lanier Boating and Recreation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                38,000-Acre Water Sports
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  Lake Lanier Shoreline & Mary Alice Park
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  White sandy swimming beaches, deep-water public boat ramps, kayak launch points, and annual illuminated Christmas boat parades.
                </p>
              </div>
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#2A8C82] hover:text-[#1B3B36] pt-2"
              >
                View on Live Map <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Sawnee Mountain Sacred Heritage */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/sawnee-mountain.jpg"
                alt="Sawnee Mountain Indian Seats"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-4 left-4 bg-[#1B3B36] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                1,970 Ft Elevation
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  Sawnee Mountain Sacred Indian Seats
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Named for Cherokee leader Sawnee. Carved natural granite rock outcroppings offering panoramic views of the Blue Ridge mountain range.
                </p>
              </div>
              <Link
                href="/parks"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#2A8C82] hover:text-[#1B3B36] pt-2"
              >
                View Preserve Trails <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 5: Heritage Village at Cumming Fairgrounds */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/cumming-fairgrounds.jpg"
                alt="Heritage Village at Cumming Fairgrounds"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                Historic Living Village
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  Heritage Village & Fairgrounds
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Preserved 19th-century blacksmith shop, one-room schoolhouse, antique steam tractors, and the annual 11-day Cumming Country Fair.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#2A8C82] hover:text-[#1B3B36] pt-2"
              >
                Festival Schedules <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 6: Halcyon Pedestrian Village */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/interior-hero.jpg"
                alt="Halcyon Forsyth Modern Village"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-4 left-4 bg-[#E29578] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                Greenway Trailhead Hub
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  Halcyon Pedestrian Village
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  135-acre outdoor community village featuring local chef dining, Market Hall, pet-friendly open spaces, and direct Big Creek Greenway access.
                </p>
              </div>
              <Link
                href="/top-10"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#2A8C82] hover:text-[#1B3B36] pt-2"
              >
                Explore Village Dining <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
