"use client";

// -------------------------------------------------------------
// All Around Forsyth - Dedicated /judge Portal
// Direct alias route to the FBLA Evaluation & Presentation Portal
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// -------------------------------------------------------------

import React from "react";
import JudgeCodeViewer from "../components/JudgeCodeViewer";
import { Award, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

export default function JudgePortalPage() {
  return (
    <div className="space-y-6 animate-in fade-in" suppressHydrationWarning>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <span className="text-[11px] font-black tracking-widest text-[#2A8C82] uppercase flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-[#E29578]" /> Evaluation Portal
          </span>
          <h1 className="text-3xl font-black text-[#1B3B36] tracking-tight">
            FBLA Judges Evaluation & Presentation Portal
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Welcome FBLA Judges! Use this dedicated competition portal to review the 100-point rubric scorecard, 4-minute presentation video script, and design system tokens.
          </p>
        </div>

        <Link
          href="/admin"
          className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin CMS Panel
        </Link>
      </div>

      <JudgeCodeViewer />
    </div>
  );
}
