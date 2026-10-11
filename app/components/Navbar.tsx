"use client";

// -------------------------------------------------------------
// All Around Forsyth - Main Navigation Header
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Brand Colors: Deep Pine (#1B3B36), Teal (#2A8C82), Ochre (#E29578)
// Admin & Judges buttons removed from public header; accessible via /judge and /admin directly
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Trees, Trophy, Calendar, History, Search, Menu, X, Landmark, ShieldAlert, Store } from "lucide-react";

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Jordan: keeping track of whether we're scrolled so the header gets a shadow
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // DJ note: 20px threshold felt smoother than 10px on trackpad
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {name: "Live Map", href: "/map", icon: MapPin },
    { name: "Parks", href: "/parks", icon: Trees },
    { name: "Community Businesses", href: "/top-10", icon: Store },
    { name: "Civic", href: "/civic", icon: Landmark },
    { name: "Safety", href: "/emergency", icon: ShieldAlert },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "History", href: "/history", icon: History },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-[#1B3B36]/95 backdrop-blur-md shadow-lg py-3 text-white"
          : "bg-[#1B3B36] py-4 text-white border-b border-[#2A8C82]/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative w-28 h-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image src="/images/aaf.png" alt="" fill sizes="112px" className="object-contain logo-glow" priority />
            </span>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#E29578] transition-colors block leading-none">
              All Around Forsyth
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-[#2A8C82] block mt-1">
              Forsyth County, GA Directory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? "bg-[#2A8C82] text-white shadow-sm"
                    : "text-emerald-100/90 hover:bg-[#2A8C82]/30 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Search & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Cmd + K Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 bg-[#142D29] hover:bg-[#2A8C82]/40 text-emerald-100 text-xs px-3.5 py-2 rounded-xl border border-emerald-500/20 transition-colors shadow-xs"
            title="Search directory (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#E29578]" />
            <span>Search...</span>
            <kbd className="bg-black/40 text-[10px] px-1.5 py-0.5 rounded text-emerald-300 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-emerald-100 hover:bg-[#2A8C82]/30"
            aria-label="Toggle Navigation Menu" aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#142D29] border-b border-[#2A8C82]/30 px-4 py-4 space-y-1 animate-in slide-in-from-top-2">
          {/* Quick Search in Mobile */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between bg-[#1B3B36] text-emerald-100 text-xs px-3 py-2.5 rounded-lg border border-emerald-500/20 mb-3"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#E29578]" /> Quick Search...
            </span>
            <span className="text-[10px] bg-[#2A8C82] text-white px-2 py-0.5 rounded">Search</span>
          </button>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? "bg-[#2A8C82] text-white"
                    : "text-emerald-100/90 hover:bg-[#2A8C82]/30"
                }`}
              >
                <Icon className="w-4 h-4 text-[#E29578]" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
