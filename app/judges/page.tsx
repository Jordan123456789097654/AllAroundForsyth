"use client";

// -------------------------------------------------------------
// All Around Forsyth - FBLA Judges Portal Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// -------------------------------------------------------------

import React from "react";
import JudgeCodeViewer from "../components/JudgeCodeViewer";
import { Award, ShieldCheck } from "lucide-react";

export default function JudgesPage() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-[#2A8C82] uppercase flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#E29578]" /> Evaluation Hub
        </span>
        <h1 className="text-3xl font-extrabold text-[#1B3B36] tracking-tight">
          FBLA Judges Evaluation & Presentation Portal
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Welcome FBLA Judges! Use this dedicated portal to review the 100-point rubric breakdown, study our 4-minute presentation video script, and audit WCAG 2.1 AAA color contrast compliance.
        </p>
      </div>

      <JudgeCodeViewer />
    </div>
  );
}
