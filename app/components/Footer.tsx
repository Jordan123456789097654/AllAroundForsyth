"use client";

// -------------------------------------------------------------
// All Around Forsyth - Footer Component
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Clean public footer - Admin/Judges portal directly accessible via /judge or /admin
// -------------------------------------------------------------

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trees, MapPin, Award, ShieldCheck, Heart, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#142D29] text-emerald-100/80 border-t border-[#2A8C82]/30 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="relative w-28 h-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image src="/images/aaf.png" alt="" fill sizes="112px" className="object-contain logo-glow" priority />
            </span>
              <span className="font-extrabold text-lg text-white tracking-tight">
                All Around Forsyth
              </span>
            </div>
            <p className="text-xs leading-relaxed text-emerald-100/70">
              An all-in-one local directory connecting citizens, students, and visitors across Cumming and Forsyth County, Georgia.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#1B3B36] border border-[#2A8C82]/40 px-3 py-1.5 rounded-full text-[11px] text-[#E29578] font-semibold">
              <Award className="w-3.5 h-3.5" /> Built for FBLA Competition 2026
            </div>
          </div>

          {/* Col 2: Quick Directory Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#2A8C82]" /> Community Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Interactive Live Map
                </Link>
              </li>
              <li>
                <Link href="/parks" className="hover:text-white transition-colors">
                  Parks & Recreation (10)
                </Link>
              </li>
              <li>
                <Link href="/top-10" className="hover:text-white transition-colors">
                  Community Businesses
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Upcoming Community Events
                </Link>
              </li>
              <li>
                <Link href="/civic" className="hover:text-white transition-colors">
                  Civic & County Leadership
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-white transition-colors">
                  Public Safety & 24/7 Response
                </Link>
              </li>
              <li>
                <Link href="/submit-business" className="hover:text-white transition-colors text-amber-300 font-semibold">
                  + Submit Your Local Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Citations */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E29578]" /> County Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/history" className="hover:text-white transition-colors">
                  Forsyth Heritage & History Timeline
                </Link>
              </li>
              <li>
                <Link href="/fbla" className="hover:text-white transition-colors">
                  FBLA Chapter Showcase
                </Link>
              </li>
              <li>
                <Link href="/sources" className="hover:text-white transition-colors flex items-center gap-1 text-[#E29578] font-semibold">
                  <FileText className="w-3 h-3" /> Copyright & Citation Sources
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Forsyth Real-time Info */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              Forsyth Real-Time Info
            </h4>
            <div className="bg-[#1B3B36] p-4 rounded-xl border border-[#2A8C82]/30 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">Lake Lanier (USGS):</span>
                <span className="font-bold text-emerald-400">Live Elevation Monitoring</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">Weather API:</span>
                <span className="font-bold text-amber-300">Open-Meteo Cumming, GA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">County Seat:</span>
                <span className="font-bold text-white">Cumming, GA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#2A8C82]/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-100/60">
          <p>
            © 2026 <strong className="text-white">All Around Forsyth</strong>. Coded and developed by <strong className="text-white">Jordan Daniels & DJ Reddish</strong> for FBLA Website Design Competition.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-cookie-banner"));
                }
              }}
              className="hover:text-white underline cursor-pointer text-emerald-200"
            >
              Cookie Preferences
            </button>
            <span>•</span>
            <Link href="/copyright" className="hover:text-white">Copyright</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            <Link href="/favorites" className="hover:text-white">Favorites</Link>
            <Link href="/trip-planner" className="hover:text-white">Trip Planner</Link>
            <Link href="/sources" className="hover:text-white">
              Citations & Licenses
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-current" /> in Forsyth County, GA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
