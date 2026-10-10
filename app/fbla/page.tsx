"use client";

// -------------------------------------------------------------
// All Around Forsyth - Forsyth FBLA Chapter Showcase Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Includes mounted check to eliminate browser extension hydration warnings
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Award, Star, Users, CheckCircle, Trophy, BookOpen } from "lucide-react";

export default function FblaPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chapters = [
    { name: "Lambert Chapter FBLA", mascot: "Longhorns", members: "350+", highlights: "State Chapter of the Year Qualifier, March of Dimes Top Contributor" },
    { name: "South Forsyth Chapter FBLA", mascot: "War Eagles", members: "280+", highlights: "Business Leadership Workshop Host, National Conference Qualifiers" },
    { name: "Alliance Academy Chapter FBLA", mascot: "Innovators", members: "190+", highlights: "STEM & Business Tech Project Finalists, Local Entrepreneurship Seminars" },
    { name: "Denmark Chapter FBLA", mascot: "Danes", members: "210+", highlights: "Community Service Excellence Award, Agribusiness Marketing Leaders" },
    { name: "West Forsyth Chapter FBLA", mascot: "Wolverines", members: "240+", highlights: "Financial Literacy Workshops, Regional Case Study Champions" },
    { name: "North Forsyth Chapter FBLA", mascot: "Raiders", members: "170+", highlights: "Community Drive Leadership, Career Skills Mentorship" },
    { name: "East Forsyth Chapter FBLA", mascot: "Broncos", members: "150+", highlights: "Rapid Chapter Growth Recognition, Digital Media Showcase" },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-in fade-in">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-[#E29578] uppercase flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#E29578]" /> Future Business Leaders of America
        </span>
        <h1 className="text-3xl font-extrabold text-[#1B3B36] tracking-tight">
          Forsyth County FBLA Chapter Showcase
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Empowering the next generation of business leaders, entrepreneurs, and community visionaries across Georgia FBLA Region 10.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chap, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-extrabold text-base text-[#1B3B36]">{chap.name}</h3>
              <span className="bg-[#2A8C82] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {chap.members} Members
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-bold">Mascot: {chap.mascot}</p>
            <p className="text-xs text-slate-700 leading-relaxed">{chap.highlights}</p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-[#E29578] font-bold">
              <Trophy className="w-3.5 h-3.5" /> FBLA Georgia Region 10
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
