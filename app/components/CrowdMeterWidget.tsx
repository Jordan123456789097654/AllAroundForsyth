"use client";

// -------------------------------------------------------------
// All Around Forsyth - Interactive "Best Time to Visit" Crowd Meter
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Visual hourly graph estimating peak vs. quiet hours and parking availability
// for Halcyon, Sawnee Mountain, Central Park, and Cumming Fairgrounds
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import {
  Users, Clock, Car, Sparkles, TrendingUp,
  MapPin, CheckCircle, AlertCircle, Info, Compass
} from "lucide-react";

interface LocationCrowdData {
  id: string;
  name: string;
  type: string;
  bestQuietWindow: string;
  peakRushWindow: string;
  parkingTip: string;
  insiderTip: string;
  schedules: {
    [key: string]: {
      hours: { time: string; crowd: number; note: string }[];
    };
  };
}

const CROWD_DATA: LocationCrowdData[] = [
  {
    id: "halcyon",
    name: "Halcyon Forsyth",
    type: "Mixed-Use Dining & Greenway Hub",
    bestQuietWindow: "8:00 AM – 11:30 AM (Morning Coffee & Greenway Strolls)",
    peakRushWindow: "12:30 PM – 2:00 PM & 6:30 PM – 9:00 PM",
    parkingTip: "Multi-level parking deck behind Market Hall always has spaces; avoid surface lot on Friday nights.",
    insiderTip: "Dog-friendly green space has live acoustic music on weekend evenings near Cherry Street Brewing.",
    schedules: {
      weekday: {
        hours: [
          { time: "8 AM", crowd: 18, note: "Coffee shops open, empty paths" },
          { time: "10 AM", crowd: 28, note: "Remote workers at Market Hall" },
          { time: "12 PM", crowd: 68, note: "Lunch rush from local corporate parks" },
          { time: "2 PM", crowd: 40, note: "Quiet afternoon outdoor seating" },
          { time: "4 PM", crowd: 52, note: "After-school treats and greenway walkers" },
          { time: "6 PM", crowd: 78, note: "Dinner crowds & patio dining" },
          { time: "8 PM", crowd: 65, note: "Bistro drinks & evening strollers" },
          { time: "10 PM", crowd: 22, note: "Closing hours" },
        ],
      },
      friday: {
        hours: [
          { time: "8 AM", crowd: 20, note: "Light morning trail traffic" },
          { time: "10 AM", crowd: 35, note: "Casual brunch meetings" },
          { time: "12 PM", crowd: 75, note: "Heavy Friday lunch crowd" },
          { time: "2 PM", crowd: 48, note: "Patios begin filling" },
          { time: "4 PM", crowd: 62, note: "Happy hour kick-off" },
          { time: "6 PM", crowd: 92, note: "Peak weekend rush, live musicians" },
          { time: "8 PM", crowd: 90, note: "Bustling village green & dining" },
          { time: "10 PM", crowd: 45, note: "Late-night gathering at brewery" },
        ],
      },
      saturday: {
        hours: [
          { time: "8 AM", crowd: 30, note: "Runners and cycling groups assemble" },
          { time: "10 AM", crowd: 60, note: "Farmer markets & family brunch" },
          { time: "12 PM", crowd: 88, note: "Peak family lunch and retail shoppers" },
          { time: "2 PM", crowd: 82, note: "Lively lawn games and ice cream lines" },
          { time: "4 PM", crowd: 76, note: "Greenway walkers heading to patios" },
          { time: "6 PM", crowd: 95, note: "Peak Saturday night dinner reservations" },
          { time: "8 PM", crowd: 85, note: "Outdoor movies & live music" },
          { time: "10 PM", crowd: 38, note: "Night wraps up" },
        ],
      },
      sunday: {
        hours: [
          { time: "8 AM", crowd: 22, note: "Peaceful morning coffee & dog walking" },
          { time: "10 AM", crowd: 55, note: "Sunday morning church & brunch" },
          { time: "12 PM", crowd: 85, note: "Peak brunch hours at CT Cantina & Market" },
          { time: "2 PM", crowd: 70, note: "Afternoon family walks on Greenway" },
          { time: "4 PM", crowd: 58, note: "Relaxed village lawn lounging" },
          { time: "6 PM", crowd: 50, note: "Casual Sunday dinner" },
          { time: "8 PM", crowd: 28, note: "Quiet evening wrap-up" },
          { time: "10 PM", crowd: 10, note: "Most shops closed" },
        ],
      },
    },
  },
  {
    id: "sawnee-mountain",
    name: "Sawnee Mountain Preserve",
    type: "Nature Preserve & Indian Seats Overlook",
    bestQuietWindow: "6:30 AM – 9:00 AM (Sunrise Vistas & Cool Mountain Air)",
    peakRushWindow: "10:30 AM – 2:00 PM (Weekends)",
    parkingTip: "Spot Road main trailhead fills by 10 AM on sunny Saturdays; use Bettis Tribble Gap trailhead for overflow.",
    insiderTip: "Climb the Indian Seats trail in the early morning for Blue Ridge mountain vistas above the fog layer.",
    schedules: {
      weekday: {
        hours: [
          { time: "8 AM", crowd: 24, note: "Local trail runners & bird watchers" },
          { time: "10 AM", crowd: 38, note: "Moderate hiking groups" },
          { time: "12 PM", crowd: 30, note: "Midday sun, light traffic" },
          { time: "2 PM", crowd: 25, note: "Quiet peaceful woodland" },
          { time: "4 PM", crowd: 42, note: "Afternoon fitness hikers" },
          { time: "6 PM", crowd: 55, note: "Sunset hikers heading to Indian Seats" },
          { time: "8 PM", crowd: 20, note: "Park closes at dusk/9:30 PM" },
          { time: "10 PM", crowd: 0, note: "Preserve gates locked" },
        ],
      },
      friday: {
        hours: [
          { time: "8 AM", crowd: 26, note: "Trail runners & peaceful climbs" },
          { time: "10 AM", crowd: 40, note: "Visitor center school groups" },
          { time: "12 PM", crowd: 35, note: "Lunchtime picnic pavilion use" },
          { time: "2 PM", crowd: 32, note: "Moderate afternoon pace" },
          { time: "4 PM", crowd: 50, note: "Weekend warm-up hikers" },
          { time: "6 PM", crowd: 68, note: "Golden hour sunset viewing" },
          { time: "8 PM", crowd: 22, note: "Trail clearing for closing" },
          { time: "10 PM", crowd: 0, note: "Preserve gates locked" },
        ],
      },
      saturday: {
        hours: [
          { time: "8 AM", crowd: 52, note: "Early risers securing parking" },
          { time: "10 AM", crowd: 90, note: "Peak trailhead parking lot capacity" },
          { time: "12 PM", crowd: 94, note: "Busy trails and Indian Seats overlook" },
          { time: "2 PM", crowd: 80, note: "Hikers descending, parking frees slowly" },
          { time: "4 PM", crowd: 65, note: "Late afternoon summit trekkers" },
          { time: "6 PM", crowd: 72, note: "Sunset summit lovers" },
          { time: "8 PM", crowd: 25, note: "Rangers sweep trailheads" },
          { time: "10 PM", crowd: 0, note: "Preserve gates locked" },
        ],
      },
      sunday: {
        hours: [
          { time: "8 AM", crowd: 45, note: "Quiet sunrise meditative hikers" },
          { time: "10 AM", crowd: 75, note: "Post-breakfast nature families" },
          { time: "12 PM", crowd: 86, note: "Peak weekend crowd at summits" },
          { time: "2 PM", crowd: 78, note: "Warm afternoon walks" },
          { time: "4 PM", crowd: 58, note: "Trail density thins out" },
          { time: "6 PM", crowd: 60, note: "Peaceful golden light overlook" },
          { time: "8 PM", crowd: 18, note: "Dusk trail clearing" },
          { time: "10 PM", crowd: 0, note: "Preserve gates locked" },
        ],
      },
    },
  },
  {
    id: "central-park",
    name: "Central Park Complex",
    type: "160-Acre Sports, Disc Golf & Dog Park Hub",
    bestQuietWindow: "8:00 AM – 11:00 AM & 1:00 PM – 3:30 PM",
    peakRushWindow: "5:30 PM – 8:30 PM (Youth League Games & Tennis)",
    parkingTip: "North complex lot by the disc golf course rarely fills, even during major baseball tournament weekends.",
    insiderTip: "The 18-hole disc golf course winds through scenic woods and is completely free to the public.",
    schedules: {
      weekday: {
        hours: [
          { time: "8 AM", crowd: 20, note: "Walking track joggers & dog park regulars" },
          { time: "10 AM", crowd: 25, note: "Casual disc golf players" },
          { time: "12 PM", crowd: 28, note: "Recreation center fitness room users" },
          { time: "2 PM", crowd: 22, note: "Quiet midday park grounds" },
          { time: "4 PM", crowd: 50, note: "Afternoon tennis and batting cages" },
          { time: "6 PM", crowd: 85, note: "Youth baseball, softball & tennis leagues" },
          { time: "8 PM", crowd: 70, note: "Lighted field games under the lights" },
          { time: "10 PM", crowd: 15, note: "Field lights shut off" },
        ],
      },
      friday: {
        hours: [
          { time: "8 AM", crowd: 22, note: "Morning walking loop and dog park" },
          { time: "10 AM", crowd: 28, note: "Disc golf course active" },
          { time: "12 PM", crowd: 30, note: "Indoor basketball open play" },
          { time: "2 PM", crowd: 35, note: "Weekend tournament teams arriving" },
          { time: "4 PM", crowd: 60, note: "Friday night tournament warmups" },
          { time: "6 PM", crowd: 88, note: "Packed ballfields and tennis matches" },
          { time: "8 PM", crowd: 75, note: "Evening community sports" },
          { time: "10 PM", crowd: 18, note: "Park closing" },
        ],
      },
      saturday: {
        hours: [
          { time: "8 AM", crowd: 65, note: "Early tournament baseball games begin" },
          { time: "10 AM", crowd: 92, note: "Peak sports tournament parking congestion" },
          { time: "12 PM", crowd: 90, note: "Food concessions & packed playgrounds" },
          { time: "2 PM", crowd: 84, note: "Championship bracket baseball rounds" },
          { time: "4 PM", crowd: 70, note: "Afternoon games conclude" },
          { time: "6 PM", crowd: 60, note: "Casual evening pickleball & dog park" },
          { time: "8 PM", crowd: 40, note: "Sunset walking track use" },
          { time: "10 PM", crowd: 10, note: "Fields closed" },
        ],
      },
      sunday: {
        hours: [
          { time: "8 AM", crowd: 25, note: "Peaceful morning dog park socialization" },
          { time: "10 AM", crowd: 45, note: "Casual disc golf & tennis drills" },
          { time: "12 PM", crowd: 72, note: "Afternoon baseball tournament finales" },
          { time: "2 PM", crowd: 75, note: "Busy rec center open gym" },
          { time: "4 PM", crowd: 62, note: "Family playground and walking loop" },
          { time: "6 PM", crowd: 42, note: "Calm evening wind-down" },
          { time: "8 PM", crowd: 20, note: "Field lights down" },
          { time: "10 PM", crowd: 5, note: "Park closes" },
        ],
      },
    },
  },
  {
    id: "cumming-fairgrounds",
    name: "Cumming Fairgrounds & City Center",
    type: "Events, Arena, Amphitheater & Downtown",
    bestQuietWindow: "9:00 AM – 1:00 PM (Tues - Fri Non-Event Days)",
    peakRushWindow: "6:00 PM – 9:30 PM (Concerts & Festival Evenings)",
    parkingTip: "City Center provides 3 dedicated covered parking decks with free 4-hour parking and pedestrian bridges.",
    insiderTip: "Check Lou Sobh Amphitheater concert schedule; lawn chairs are permitted on the sloped turf.",
    schedules: {
      weekday: {
        hours: [
          { time: "8 AM", crowd: 15, note: "Morning cafe patrons at City Center" },
          { time: "10 AM", crowd: 25, note: "Heritage Village quiet strolls" },
          { time: "12 PM", crowd: 60, note: "Downtown Cumming lunch diners" },
          { time: "2 PM", crowd: 35, note: "Boutique shopping & fountain walks" },
          { time: "4 PM", crowd: 45, note: "Piazza outdoor gathering" },
          { time: "6 PM", crowd: 70, note: "Dinner reservations at Tam's Backstage" },
          { time: "8 PM", crowd: 62, note: "Evening strolls by the stream" },
          { time: "10 PM", crowd: 20, note: "Quiet downtown nights" },
        ],
      },
      friday: {
        hours: [
          { time: "8 AM", crowd: 18, note: "Coffee and bakery traffic" },
          { time: "10 AM", crowd: 30, note: "Casual downtown visitors" },
          { time: "12 PM", crowd: 65, note: "Brisk lunch patronage" },
          { time: "2 PM", crowd: 45, note: "Retail browsing" },
          { time: "4 PM", crowd: 60, note: "Happy hour & patio cocktail bars" },
          { time: "6 PM", crowd: 88, note: "Amphitheater lawn seating opens" },
          { time: "8 PM", crowd: 92, note: "Peak Friday concert & dinner rush" },
          { time: "10 PM", crowd: 50, note: "Post-concert strolls" },
        ],
      },
      saturday: {
        hours: [
          { time: "8 AM", crowd: 35, note: "Weekend morning joggers & bakery runs" },
          { time: "10 AM", crowd: 68, note: "City Center farmers market & mini-golf" },
          { time: "12 PM", crowd: 82, note: "Busy lunch patios and fountain plaza" },
          { time: "2 PM", crowd: 78, note: "Family games and artisan shopping" },
          { time: "4 PM", crowd: 75, note: "Pre-concert crowd arriving" },
          { time: "6 PM", crowd: 95, note: "Full amphitheater lawn & bustling dining" },
          { time: "8 PM", crowd: 96, note: "Live music, outdoor fountain lights" },
          { time: "10 PM", crowd: 42, note: "Night wraps up" },
        ],
      },
      sunday: {
        hours: [
          { time: "8 AM", crowd: 20, note: "Quiet morning church bells & coffee" },
          { time: "10 AM", crowd: 50, note: "Brunch diners at City Center" },
          { time: "12 PM", crowd: 75, note: "Lively Sunday family afternoon" },
          { time: "2 PM", crowd: 68, note: "Mini-golf and creek boardwalk walks" },
          { time: "4 PM", crowd: 55, note: "Relaxed piazza coffee drinkers" },
          { time: "6 PM", crowd: 48, note: "Cozy Sunday evening dinners" },
          { time: "8 PM", crowd: 25, note: "Quiet plaza fountains" },
          { time: "10 PM", crowd: 8, note: "All venues closed" },
        ],
      },
    },
  },
];

export default function CrowdMeterWidget() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("halcyon");
  const [selectedDay, setSelectedDay] = useState<string>("saturday");
  const [activeHourIndex, setActiveHourIndex] = useState<number | null>(2); // Default 12 PM
  const [currentHourTime, setCurrentHourTime] = useState<string>("12 PM");

  const location = CROWD_DATA.find((l) => l.id === selectedLocationId) || CROWD_DATA[0];
  const schedule = location.schedules[selectedDay] || location.schedules.weekday;

  // Detect approximate client hour to label "Now"
  useEffect(() => {
    const currentHour = new Date().getHours();
    let approximateLabel = "12 PM";
    if (currentHour <= 8) approximateLabel = "8 AM";
    else if (currentHour <= 10) approximateLabel = "10 AM";
    else if (currentHour <= 12) approximateLabel = "12 PM";
    else if (currentHour <= 14) approximateLabel = "2 PM";
    else if (currentHour <= 16) approximateLabel = "4 PM";
    else if (currentHour <= 18) approximateLabel = "6 PM";
    else if (currentHour <= 20) approximateLabel = "8 PM";
    else approximateLabel = "10 PM";

    setCurrentHourTime(approximateLabel);
    const foundIdx = schedule.hours.findIndex((h) => h.time === approximateLabel);
    if (foundIdx !== -1) {
      setActiveHourIndex(foundIdx);
    }
  }, [schedule]);

  const activeHour = activeHourIndex !== null ? schedule.hours[activeHourIndex] : schedule.hours[2];

  // Helper to color-code bar based on density
  const getBarColor = (crowd: number) => {
    if (crowd < 35) return "bg-emerald-500 hover:bg-emerald-600";
    if (crowd < 70) return "bg-amber-400 hover:bg-amber-500";
    return "bg-rose-500 hover:bg-rose-600";
  };

  const getStatusBadge = (crowd: number) => {
    if (crowd < 35) {
      return {
        label: "Quiet & Relaxed",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        parking: "Abundant Parking",
      };
    }
    if (crowd < 70) {
      return {
        label: "Moderate & Lively",
        bg: "bg-amber-100 text-amber-900 border-amber-300",
        parking: "Normal Parking Flow",
      };
    }
    return {
      label: "Peak Rush / High Energy",
      bg: "bg-rose-100 text-rose-900 border-rose-300",
      parking: "High Demand — Allow Extra Time",
    };
  };

  const currentBadge = getStatusBadge(activeHour.crowd);

  return (
    <section className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-amber-600" /> Real-Time Traffic & Visitor Forecaster
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
            "Best Time to Visit" Crowd Meter
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Visual graph estimating peak rush vs. quiet hours for Forsyth's major destinations to help you plan the smoothest trip.
          </p>
        </div>

        {/* Day Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
          {[
            { id: "weekday", label: "Mon - Thu" },
            { id: "friday", label: "Friday" },
            { id: "saturday", label: "Saturday (Peak)" },
            { id: "sunday", label: "Sunday" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedDay === d.id
                  ? "bg-[#1B3B36] text-white shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CROWD_DATA.map((loc) => (
          <button
            key={loc.id}
            onClick={() => {
              setSelectedLocationId(loc.id);
              setActiveHourIndex(2);
            }}
            className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
              selectedLocationId === loc.id
                ? "bg-[#1B3B36] text-white border-[#1B3B36] shadow-md shadow-emerald-950/20 scale-[1.02]"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
              {loc.type.split(" ")[0]}
            </span>
            <span className="text-xs sm:text-sm font-black truncate block mt-0.5">
              {loc.name}
            </span>
          </button>
        ))}
      </div>

      {/* Visual Bar Chart Graph */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-black uppercase text-[#2A8C82] tracking-wider block">
              Hourly Visitor Graph (8:00 AM - 10:00 PM)
            </span>
            <h3 className="text-lg font-black text-[#1B3B36]">
              {location.name} — Estimated Capacity
            </h3>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500" /> Quiet (&lt;35%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400" /> Moderate (35-70%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" /> Peak (&gt;70%)
            </span>
          </div>
        </div>

        {/* Visual Graph Bars Container */}
        <div className="h-56 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 relative">
          {schedule.hours.map((item, idx) => {
            const isSelected = idx === activeHourIndex;
            const isCurrentClock = item.time === currentHourTime;

            return (
              <div
                key={item.time}
                onClick={() => setActiveHourIndex(idx)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Time Indicator pill when clicked */}
                {isSelected && (
                  <div className="absolute -top-7 bg-[#1B3B36] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-in fade-in">
                    {item.crowd}%
                  </div>
                )}

                {/* The Bar */}
                <div
                  style={{ height: `${Math.max(item.crowd, 8)}%` }}
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${getBarColor(
                    item.crowd
                  )} ${isSelected ? "ring-4 ring-[#1B3B36]/30 shadow-lg scale-105" : "opacity-85 group-hover:opacity-100"}`}
                >
                  {isCurrentClock && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-sm" />
                  )}
                </div>

                {/* X-Axis Label */}
                <span
                  className={`text-[11px] font-black mt-2.5 transition-colors ${
                    isSelected ? "text-[#1B3B36] underline" : "text-slate-500 group-hover:text-slate-900"
                  }`}
                >
                  {item.time}
                </span>

                {isCurrentClock && (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded-sm mt-0.5">
                    Now
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Hour Insight Box */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#1B3B36]">
                Selected Window: <strong>{activeHour.time}</strong>
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${currentBadge.bg}`}>
                {currentBadge.label} ({activeHour.crowd}% Capacity)
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              💡 <em>{activeHour.note}</em>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Car className="w-4 h-4 text-[#2A8C82]" />
            <span>Parking: {currentBadge.parking}</span>
          </div>
        </div>
      </div>

      {/* 3 Insight Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
          <span className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> Best Quiet Window
          </span>
          <h4 className="font-black text-slate-800 text-sm">
            {location.bestQuietWindow}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Minimal crowds, easy walking paths, and immediate parking availability.
          </p>
        </div>

        <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-2xl space-y-1.5">
          <span className="text-[10px] font-black uppercase text-rose-800 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" /> Peak Rush Window
          </span>
          <h4 className="font-black text-slate-800 text-sm">
            {location.peakRushWindow}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Highest vibrancy and foot traffic; plan for dining waits or busier trail overlooks.
          </p>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl space-y-1.5">
          <span className="text-[10px] font-black uppercase text-blue-800 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-blue-600" /> Parking & Insider Tip
          </span>
          <h4 className="font-black text-slate-800 text-sm">
            Local Pro Recommendation
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {location.parkingTip}
          </p>
        </div>
      </div>
    </section>
  );
}
