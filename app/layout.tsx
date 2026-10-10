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
import SiteTools from "./components/SiteTools";
import "leaflet/dist/leaflet.css";
import "./globals.css";

// Set NEXT_PUBLIC_SITE_URL in Vercel to the live address (no trailing slash).
// Link previews need absolute URLs, so this is used for og:url and og:image.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://all-around-forsyth.vercel.app";
const SITE_TITLE = "All Around Forsyth — Forsyth County, GA Community Directory";
const SITE_DESCRIPTION =
  "Parks, civic leaders, public safety, local businesses, events, and history across Forsyth County, Georgia, in one place.";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />
        <meta name="theme-color" content="#1B3B36" />
        <link rel="icon" href="/images/aaf.png" type="image/png" />

        {/* Open Graph: used by Facebook, LinkedIn, Slack, iMessage, Discord, and most link previews */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="All Around Forsyth" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:secure_url" content={OG_IMAGE} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Forsyth County Courthouse in Georgia, with the All Around Forsyth title" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter / X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Forsyth County Courthouse in Cumming, Georgia" />
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

        {/* Dark mode, Spanish, share, auto tour */}
        <SiteTools />

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
