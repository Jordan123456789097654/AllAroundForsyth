// -------------------------------------------------------------
// All Around Forsyth - Custom 404 Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// -------------------------------------------------------------

import Link from "next/link";
import Image from "next/image";
import { MapPin, Trees, Store, Calendar, Landmark, Home } from "lucide-react";

const links = [
  { href: "/map", label: "Live Map", icon: MapPin },
  { href: "/parks", label: "Parks & Trails", icon: Trees },
  { href: "/top-10", label: "Community Businesses", icon: Store },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/civic", label: "Civic & Government", icon: Landmark },
];

export default function NotFound() {
  return (
    <div className="text-center py-10 sm:py-16 space-y-8 max-w-2xl mx-auto">
      <div className="relative w-56 h-40 mx-auto animate-float">
        <Image src="/images/aaf.png" alt="All Around Forsyth logo" fill sizes="224px" className="object-contain" priority />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-black tracking-widest uppercase text-[#E29578]">Error 404</p>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1B3B36] tracking-tight">Lost in Forsyth?</h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          We couldn&apos;t find that page. It may have moved, or the link might be typed wrong.
          Try one of these instead, or press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-xs">K</kbd> to search.
        </p>
      </div>

      <nav aria-label="Helpful links" className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 bg-white border border-slate-200 hover:border-[#2A8C82] rounded-2xl p-4 font-bold text-[#1B3B36] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2A8C82] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#1B3B36] hover:bg-[#2A8C82] text-white px-7 py-3.5 rounded-xl font-black text-sm transition-colors min-h-[44px]"
      >
        <Home className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
