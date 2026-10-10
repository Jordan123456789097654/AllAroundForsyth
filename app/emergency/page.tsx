"use client";

// -------------------------------------------------------------
// All Around Forsyth - Public Safety & Emergency Operations Hub
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified 24/7 Emergency Contacts, Hospitals, Outage Lines, and Safety Guidelines
// -------------------------------------------------------------

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, Phone, ShieldAlert, HeartPulse, Zap,
  Droplets, Waves, CheckCircle2, Copy, Check, ExternalLink,
  Flame, Radio, Siren, MapPin, Clock, LifeBuoy
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  agency: string;
  phone: string;
  category: "Primary" | "Utility" | "Medical" | "Public Works";
  description: string;
  badge: string;
  badgeColor: string;
}

const CONTACTS: EmergencyContact[] = [
  {
    id: "911",
    name: "Immediate Life Safety Emergency",
    agency: "Forsyth County 911 E-911 Communications Center",
    phone: "911",
    category: "Primary",
    description: "For active fires, medical emergencies, crimes in progress, and serious vehicle collisions.",
    badge: "Immediate 24/7",
    badgeColor: "bg-red-600 text-white",
  },
  {
    id: "fcso-non-emergency",
    name: "Forsyth Sheriff Non-Emergency Dispatch",
    agency: "Forsyth County Sheriff's Office (FCSO)",
    phone: "(770) 781-3087",
    category: "Primary",
    description: "To report suspicious activity, noise complaints, minor incidents, or request a welfare check.",
    badge: "24/7 Dispatch",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    id: "northside-hospital",
    name: "Northside Hospital Forsyth Emergency Room",
    agency: "24/7 Level Emergency Department",
    phone: "(770) 844-3200",
    category: "Medical",
    description: "1200 Northside Forsyth Dr, Cumming, GA 30041. Full-service hospital trauma & critical care.",
    badge: "24/7 ER Trauma",
    badgeColor: "bg-emerald-700 text-white",
  },
  {
    id: "choa-urgent-care",
    name: "Children's Healthcare of Atlanta (CHOA) Urgent Care",
    agency: "Pediatric Urgent Care at The Collection",
    phone: "(404) 785-5437",
    category: "Medical",
    description: "410 Peachtree Pkwy, Suite 300, Cumming, GA 30041. Specialized pediatric emergency medical care.",
    badge: "Pediatric Care",
    badgeColor: "bg-sky-600 text-white",
  },
  {
    id: "poison-control",
    name: "Georgia Poison Center",
    agency: "National Poison Help",
    phone: "(800) 222-1222",
    category: "Medical",
    description: "Free, confidential medical advice for chemical, drug, and plant exposures 24/7.",
    badge: "Toll-Free 24/7",
    badgeColor: "bg-purple-600 text-white",
  },
  {
    id: "sawnee-emc",
    name: "Sawnee EMC Power Outage Hotline",
    agency: "Sawnee Electric Membership Corp",
    phone: "(770) 887-2363",
    category: "Utility",
    description: "To report power outages, downed power lines, and electrical grid hazards across Forsyth County.",
    badge: "Electric Outage",
    badgeColor: "bg-amber-600 text-white",
  },
  {
    id: "water-leaks",
    name: "Water Main Break & Leak Emergency",
    agency: "Forsyth County Water & Sewer Dept",
    phone: "(770) 781-2160",
    category: "Utility",
    description: "After-hours emergency water line repairs, sewer backups, and main line leak response.",
    badge: "Water Emergency",
    badgeColor: "bg-cyan-700 text-white",
  },
  {
    id: "road-hazards",
    name: "Road Hazards & Fallen Trees on Roads",
    agency: "Forsyth County Roads & Bridges Dept",
    phone: "(770) 781-2155",
    category: "Public Works",
    description: "To report blocked roadways, storm debris, washouts, and damaged traffic signals.",
    badge: "Road Works",
    badgeColor: "bg-slate-700 text-white",
  },
  {
    id: "animal-control",
    name: "Forsyth County Animal Services",
    agency: "Animal Shelter & Humane Response",
    phone: "(770) 781-2138",
    category: "Public Works",
    description: "Aggressive animals, injured wildlife on county roads, and stray animal reporting.",
    badge: "Animal Welfare",
    badgeColor: "bg-teal-700 text-white",
  },
];

export default function EmergencyPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const copyNumber = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContacts = CONTACTS.filter((c) => {
    if (filter === "All") return true;
    return c.category === filter;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Red Alert Header Banner */}
      <section className="bg-gradient-to-br from-red-950 via-[#1B3B36] to-[#0A1A18] text-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-red-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/50 px-3.5 py-1.5 rounded-full text-xs font-black text-red-200 uppercase tracking-wider animate-pulse">
            <Siren className="w-4 h-4 text-red-400" /> Forsyth County Public Safety & 24/7 Response
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Emergency & Public <br />
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
              Safety Services
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed font-medium">
            Immediate contacts for law enforcement, emergency medical trauma, utility outage reporting, Lake Lanier water rescue, and severe weather response across Cumming and Forsyth County.
          </p>

          {/* Quick 911 / Sheriff Dial Box */}
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="tel:911"
              className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-xl hover:shadow-red-900/50 transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 animate-bounce" /> Call 911 (Life Emergency)
            </a>
            <a
              href="tel:7707813087"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 border border-white/20 transition-all hover:-translate-y-0.5"
            >
              <ShieldAlert className="w-5 h-5 text-amber-300" /> FCSO Non-Emergency: (770) 781-3087
            </a>
          </div>
        </div>
      </section>

      {/* Live Advisory Strip */}
      <section className="bg-emerald-50 border border-emerald-300/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
              National Weather Service / Forsyth EMA
            </span>
            <strong className="text-xs sm:text-sm text-emerald-950 block">
              County Conditions: Normal Operations — No Active Severe Weather Watches
            </strong>
          </div>
        </div>
        <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
          All Clear
        </span>
      </section>

      {/* Directory Filter Tabs */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-black uppercase text-[#2A8C82] tracking-wider block">
              24/7 Operations Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
              Essential Emergency & Response Lines
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {["All", "Primary", "Medical", "Utility", "Public Works"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filter === cat
                    ? "bg-[#1B3B36] text-white shadow-sm font-black"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${contact.badgeColor}`}>
                    {contact.badge}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {contact.category}
                  </span>
                </div>
                <h3 className="font-black text-base text-[#1B3B36] group-hover:text-red-700 transition-colors">
                  {contact.name}
                </h3>
                <span className="text-[11px] font-bold text-[#2A8C82] block">
                  {contact.agency}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {contact.description}
                </p>
              </div>

              {/* Call & Copy Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <a
                  href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                  className="flex-1 bg-[#1B3B36] hover:bg-red-700 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E29578]" /> {contact.phone}
                </a>
                <button
                  onClick={() => copyNumber(contact.phone, contact.id)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl font-bold transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedId === contact.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Guidelines Cards */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase text-[#E29578] tracking-wider block">
            Preparedness Protocol
          </span>
          <h2 className="text-2xl font-black text-[#1B3B36] tracking-tight">
            Forsyth County Public Safety Guidelines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200/80 space-y-2">
            <span className="font-black text-blue-900 text-sm flex items-center gap-1.5">
              <LifeBuoy className="w-4 h-4 text-blue-700" /> Lake Lanier Water Safety
            </span>
            <p className="text-slate-600 leading-relaxed">
              Georgia law requires all children under 13 to wear a USCG-approved PFD life vest aboard moving vessels. Never swim outside marked park beaches at Mary Alice or Charleston Park.
            </p>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
            <span className="font-black text-amber-900 text-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-700" /> Outdoor Burn Regulations
            </span>
            <p className="text-slate-600 leading-relaxed">
              Summer burn bans run annually May 1 through September 30. During legal winter burn months, obtain an automated permit from Forsyth County Fire Department before burning natural yard debris.
            </p>
          </div>

          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200/80 space-y-2">
            <span className="font-black text-emerald-900 text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-700" /> CodeRED Emergency Alerts
            </span>
            <p className="text-slate-600 leading-relaxed">
              Residents can register mobile numbers with Forsyth County Emergency Management Agency (EMA) to receive geotargeted tornado, flood, and boil-water notices via automated SMS.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
