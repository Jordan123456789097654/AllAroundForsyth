"use client";

// -------------------------------------------------------------
// All Around Forsyth - Civic & Government Services Directory
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified County & City Officials, Departments, and Public Services
// -------------------------------------------------------------

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Landmark, Shield, Phone, Mail, MapPin, ExternalLink,
  Copy, Check, UserCheck, Building2, Scale, Vote, Droplet,
  FileText, Clock, Search, Sparkles
} from "lucide-react";

interface Official {
  id: string;
  name: string;
  role: string;
  agency: string;
  image: string;
  fallbackInitials: string;
  phone: string;
  address: string;
  bio: string;
  website: string;
}

interface Department {
  id: string;
  name: string;
  category: "Safety" | "Courts" | "Administration" | "Utilities";
  address: string;
  phone: string;
  hours: string;
  description: string;
  onlineServiceUrl: string;
}

const OFFICIALS: Official[] = [
  {
    id: "sheriff-freeman",
    name: "Ron H. Freeman",
    role: "County Sheriff",
    agency: "Forsyth County Sheriff's Office (FCSO)",
    image: "/images/sheriff-freeman.jpg",
    fallbackInitials: "RF",
    phone: "(770) 781-3087",
    address: "3520 Settingdown Rd, Cumming, GA 30028",
    bio: "Serving as Forsyth County's Sheriff since 2017. Leading one of Georgia's highest-rated law enforcement agencies focusing on neighborhood safety, school resource officers, and community trust.",
    website: "https://www.forsythsheriff.org",
  },
  {
    id: "mayor-brumbalow",
    name: "Troy Brumbalow",
    role: "Mayor of Cumming",
    agency: "City of Cumming Municipal Government",
    image: "/images/mayor-troy-brumbalow.jpg",
    fallbackInitials: "TB",
    phone: "(770) 781-2010",
    address: "100 Main St, Cumming, GA 30040",
    bio: "Elected Mayor in 2018. Championed the landmark Cumming City Center downtown revitalization, featuring the Lou Sobh Amphitheater, green spaces, and locally owned dining.",
    website: "https://www.cityofcumming.net",
  },
  {
    id: "chair-john",
    name: "Alfred John",
    role: "Chairman & Commissioner",
    agency: "Forsyth County Board of Commissioners (District 2)",
    image: "/images/county-commission-chair.jpg",
    fallbackInitials: "AJ",
    phone: "(770) 781-2101",
    address: "110 E Main St, Suite 210, Cumming, GA 30040",
    bio: "Commission Chairman representing southern Forsyth County. Guiding sustainable economic expansion, infrastructure investments, and preservation of greenspace across the county.",
    website: "https://www.forsythco.com",
  },
];

const DEPARTMENTS: Department[] = [
  {
    id: "courthouse",
    name: "Forsyth County Courthouse & Clerk of Superior Court",
    category: "Courts",
    address: "101 E Courthouse Sq, Cumming, GA 30040",
    phone: "(770) 781-2120",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM",
    description: "Superior, State, and Juvenile Courts handling civil cases, property deeds, criminal proceedings, and jury services.",
    onlineServiceUrl: "https://www.forsythclerk.com",
  },
  {
    id: "elections",
    name: "Voter Registrations & Elections Office",
    category: "Administration",
    address: "1201 Sawnee Dr, Cumming, GA 30040",
    phone: "(770) 781-2118",
    hours: "Mon - Fri: 8:00 AM - 4:30 PM",
    description: "Official county elections board managing voter registration, absentee ballots, and advance voting precincts.",
    onlineServiceUrl: "https://www.forsythco.com/Departments-Offices/Voter-Registrations-Elections",
  },
  {
    id: "water-sewer",
    name: "Forsyth County Department of Water & Sewer",
    category: "Utilities",
    address: "110 E Main St, Suite 150, Cumming, GA 30040",
    phone: "(770) 781-2160",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM",
    description: "County water utility providing clean Lake Lanier water distribution, meter reading, account setup, and emergency leaks.",
    onlineServiceUrl: "https://www.forsythco.com/Departments-Offices/Water-Sewer",
  },
  {
    id: "tax-commissioner",
    name: "Forsyth County Tax Commissioner (Tags & Property)",
    category: "Administration",
    address: "1092 Tribble Gap Rd, Cumming, GA 30040",
    phone: "(770) 781-2110",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM",
    description: "Processes motor vehicle tag renewals, title transfers, property taxes, and homestead exemption filings.",
    onlineServiceUrl: "https://www.forsythtax.com",
  },
  {
    id: "fire-hq",
    name: "Forsyth County Fire Department Headquarters",
    category: "Safety",
    address: "3520 Settingdown Rd, Cumming, GA 30028",
    phone: "(770) 781-2180",
    hours: "Admin: 8:00 AM - 5:00 PM | Emergency: 24/7",
    description: "Operates 9 county fire stations providing advanced life support EMS, fire suppression, and outdoor burn permits.",
    onlineServiceUrl: "https://www.forsythco.com/Departments-Offices/Fire-Department",
  },
  {
    id: "cumming-city-hall",
    name: "City of Cumming City Hall & Police Support",
    category: "Administration",
    address: "100 Main St, Cumming, GA 30040",
    phone: "(770) 781-2010",
    hours: "Mon - Fri: 8:00 AM - 5:00 PM",
    description: "Municipal headquarters for City of Cumming licensing, planning & zoning, water billing, and municipal courts.",
    onlineServiceUrl: "https://www.cityofcumming.net",
  },
];

export default function CivicPage() {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDepts = DEPARTMENTS.filter((dept) => {
    const matchesFilter = filter === "All" || dept.category === filter;
    const matchesSearch =
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.description.toLowerCase().includes(search.toLowerCase()) ||
      dept.address.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#1B3B36] via-[#142D29] to-[#0A1A18] text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-[#2A8C82]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2A8C82]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#2A8C82]/30 border border-[#2A8C82]/60 px-3.5 py-1.5 rounded-full text-xs font-black text-emerald-200 uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-[#E29578]" /> Forsyth County Government & Civic Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Local Leadership & <br />
            <span className="bg-gradient-to-r from-[#E29578] via-amber-300 to-emerald-300 bg-clip-text text-transparent">
              County Services
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            Connect directly with elected leaders, public safety officials, the historic Forsyth County Courthouse, and essential municipal departments serving over 270,000 residents.
          </p>
        </div>
      </section>

      {/* Elected Officials Spotlight Grid */}
      <section className="space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase text-[#2A8C82] tracking-wider block">
            Elected Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
            Forsyth County & City Officials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFICIALS.map((official) => (
            <div
              key={official.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              {/* Photo Box with Fallback Initials */}
              <div className="relative h-64 w-full bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-b border-slate-100">
                <Image
                  src={official.image}
                  alt={official.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 360px"
                  onError={(e) => {
                    // Hide broken image and reveal styled avatar badge
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                {/* Fallback Initials Badge */}
                <div className="w-24 h-24 rounded-full bg-[#1B3B36] text-[#E29578] font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white">
                  {official.fallbackInitials}
                </div>
                <div className="absolute top-4 left-4 bg-[#1B3B36]/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                  {official.role}
                </div>
              </div>

              {/* Info Container */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#2A8C82] tracking-wider block">
                    {official.agency}
                  </span>
                  <h3 className="text-xl font-black text-[#1B3B36]">
                    {official.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {official.bio}
                  </p>
                </div>

                {/* Contact Controls */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#2A8C82]" /> {official.phone}
                    </span>
                    <button
                      onClick={() => copyToClipboard(official.phone, `phone-${official.id}`)}
                      className="text-[11px] font-black text-[#2A8C82] hover:text-[#1B3B36] flex items-center gap-1"
                    >
                      {copiedId === `phone-${official.id}` ? (
                        <span className="text-emerald-700 flex items-center gap-0.5"><Check className="w-3 h-3" /> Copied</span>
                      ) : (
                        <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" /> Copy</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 truncate pr-2">
                      <MapPin className="w-3 h-3 text-[#E29578] shrink-0" /> {official.address}
                    </span>
                  </div>

                  <a
                    href={official.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 bg-[#1B3B36] hover:bg-[#2A8C82] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* County Departments Directory */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-[11px] font-black uppercase text-[#E29578] tracking-wider block">
              Civic Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36] tracking-tight">
              Forsyth County Departments Directory
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold outline-none focus:border-[#2A8C82]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {["All", "Safety", "Administration", "Courts", "Utilities"].map((cat) => (
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

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-[#2A8C82] border border-emerald-200">
                    {dept.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {dept.hours.split("|")[0]}
                  </span>
                </div>
                <h3 className="font-black text-base text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-900">
                    <Phone className="w-3.5 h-3.5 text-[#2A8C82]" /> {dept.phone}
                  </span>
                  <button
                    onClick={() => copyToClipboard(dept.phone, `dept-phone-${dept.id}`)}
                    className="text-[11px] text-[#2A8C82] hover:text-[#1B3B36]"
                  >
                    {copiedId === `dept-phone-${dept.id}` ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E29578] shrink-0" />
                  <span className="truncate">{dept.address}</span>
                </div>

                <a
                  href={dept.onlineServiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-50 hover:bg-[#1B3B36] hover:text-white text-slate-700 py-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                >
                  Online Portal / Services <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
