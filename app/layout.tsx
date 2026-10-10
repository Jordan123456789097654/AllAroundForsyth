"use client";

// -------------------------------------------------------------
// All Around Forsyth - Root Layout
// Coded by DJ for FBLA Competition 2026
// Includes Leaflet CSS globally to support map rendering without Turbopack require errors
// -------------------------------------------------------------

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import CommandPalette from "./components/CommandPalette";
import BetaNoticeBanner from "./components/BetaNoticeBanner";
import CookieConsentBanner from "./components/CookieConsentBanner";
import BugReportButton from "./components/BugReportButton";
import A11yEnhancer from "./components/A11yEnhancer";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>All Around Forsyth — Forsyth County, GA Community Directory</title>
        <meta
          name="description"
          content="Centralized directory for Parks, Civic Leadership, Public Safety, Businesses, Events, and History across Forsyth County, Georgia."
        />
        <link rel="icon" href="/images/aaf.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#F4F6F8] text-slate-800 font-sans antialiased selection:bg-[#2A8C82] selection:text-white"
        suppressHydrationWarning
      >
        {/* Skip link for keyboard and screen reader users (WCAG 2.4.1) */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <A11yEnhancer />

        {/* Public Beta Notice Warning Banner */}
        <BetaNoticeBanner />

        {/* Navigation Header */}
        <Navbar onOpenSearch={() => setSearchOpen(true)} />

        {/* Global Command Palette (Cmd + K) */}
        <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Main Content View */}
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 outline-none">
          {children}
        </main>

        {/* Accessibility Floating Toolbar */}
        <AccessibilityToolbar />

        {/* Bug Report (sends to Discord) */}
        <BugReportButton />

        {/* Cookie Consent Banner */}
        <CookieConsentBanner />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
