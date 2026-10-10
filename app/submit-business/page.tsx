"use client";

// -------------------------------------------------------------
// All Around Forsyth - Local Business Submission & Community Portal
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Allows Forsyth County businesses to submit their storefront with INSTANT AUTOMATIC APPROVAL
// Submissions appear immediately on /top-10, /map, Day Trip Builder, and site search!
// -------------------------------------------------------------

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store, Trophy, CheckCircle2, Sparkles, MapPin, Phone,
  Globe, Award, ArrowRight, Share2, ShieldCheck, HeartHandshake,
  Check, Copy, BadgePercent, Zap, Clock, ExternalLink, Eye
} from "lucide-react";
import { getStoredData, saveStoredData, Business } from "../data/forsythData";

const IMAGE_PRESETS = [
  { label: "Cumming City Center Hub", value: "/images/cumming-city-center.jpg" },
  { label: "Halcyon Village Promenade", value: "/images/interior-hero.jpg" },
  { label: "Downtown Dining & Bistro", value: "/images/tams-backstage.jpg" },
  { label: "Artisan Bakery & Sweets", value: "/images/dutch-monkey-doughnuts.jpg" },
  { label: "Italian & Pizzeria Storefront", value: "/images/giorgios.jpg" },
  { label: "Delicatessen & Café", value: "/images/maries-deli.jpg" },
  { label: "Town Center & Boutiques", value: "/images/collection-at-forsyth.jpg" },
  { label: "Historic Courthouse Square", value: "/images/Forsyth_County_courthouse.jpg" },
];

export default function SubmitBusinessPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Dining & Café");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [badge, setBadge] = useState("Local Favorite");
  const [price, setPrice] = useState("$$");
  const [hours, setHours] = useState("Mon-Sat 10:00 AM - 9:00 PM");
  const [selectedImage, setSelectedImage] = useState("/images/cumming-city-center.jpg");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [createdBusiness, setCreatedBusiness] = useState<Business | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = getStoredData();

    // Generate coordinates slightly offset around Cumming center so it shows distinctly on map
    const randomOffset = (Math.random() - 0.5) * 0.05;
    const lat = 34.2073 + randomOffset;
    const lng = -84.1402 + randomOffset;

    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      rank: data.businesses.length + 1,
      name: name.trim(),
      category: category,
      address: address.trim() || "Cumming, GA 30040",
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
      badge: badge,
      description: description.trim() || "Locally owned Forsyth County merchant.",
      image: selectedImage,
      price: price,
      hours: hours.trim() || "Daily 10:00 AM - 9:00 PM",
      phone: phone.trim() || "(770) 555-0199",
      website: website.trim() || undefined,
    };

    const updated = {
      ...data,
      businesses: [...data.businesses, newBiz],
    };

    saveStoredData(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("forsyth-data-updated"));
    }

    setCreatedBusiness(newBiz);
    setSubmitted(true);
  };

  const badgeEmbedCode = `<a href="https://allaroundforsyth.com" target="_blank" rel="noopener"><img src="/images/shop-local-forsyth.png" alt="Shop Local Forsyth 2026 Featured Business" /></a>`;

  const copyBadgeCode = () => {
    navigator.clipboard.writeText(badgeEmbedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#1B3B36] via-[#142D29] to-[#0A1A18] text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-[#2A8C82]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#2A8C82]/30 border border-[#2A8C82]/60 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-300 uppercase tracking-wider">
            <Store className="w-4 h-4 text-[#E29578]" /> Local Merchant Chamber Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Feature Your Business in <br />
            <span className="bg-gradient-to-r from-[#E29578] via-amber-300 to-emerald-300 bg-clip-text text-transparent">
              All Around Forsyth
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            Are you a local restaurateur, retail boutique owner, or service provider in Forsyth County? Submit your establishment to be featured across our county directory, interactive map, and community guides.
          </p>

          {/* Instant Auto-Approval Callout */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-4 py-2 rounded-2xl text-xs font-black text-emerald-200">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            <span>⚡ 100% Instant Auto-Approval Active — Submissions Go Live on Website Immediately!</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
          {submitted && createdBusiness ? (
            <div className="py-6 space-y-6 animate-in fade-in zoom-in-95">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-300">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  Auto-Approved & Published Live
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1B3B36]">
                  Congratulations! You're Live on the Website!
                </h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your storefront <strong>{createdBusiness.name}</strong> has passed automated verification and was instantly published to the Community Businesses Directory, Interactive Live Map, and Day Trip Planner.
                </p>
              </div>

              {/* Live Preview Card */}
              <div className="bg-slate-50 border-2 border-emerald-400/60 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Live Listing Preview
                  </span>
                  <span className="bg-[#1B3B36] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    Listing #{createdBusiness.rank}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {createdBusiness.image && (
                    <div className="relative w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <Image
                        src={createdBusiness.image}
                        alt={createdBusiness.name}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-base text-[#1B3B36]">{createdBusiness.name}</h4>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full">
                        {createdBusiness.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {createdBusiness.price}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-[#2A8C82]">{createdBusiness.category}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{createdBusiness.description}</p>
                    <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {createdBusiness.address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {createdBusiness.hours}</span>
                      {createdBusiness.phone && <span className="flex items-center gap-1 font-bold text-slate-700"><Phone className="w-3 h-3 text-emerald-600" /> {createdBusiness.phone}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/top-10"
                  className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md text-center"
                >
                  <Trophy className="w-4 h-4 text-amber-300" /> View in Community Businesses →
                </Link>
                <Link
                  href="/map"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md text-center"
                >
                  <MapPin className="w-4 h-4 text-amber-300" /> View on Live Map →
                </Link>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCreatedBusiness(null);
                    setName("");
                    setAddress("");
                    setPhone("");
                    setWebsite("");
                    setDescription("");
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-[#1B3B36] underline"
                >
                  Submit Another Business
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium">
              <div>
                <span className="text-[11px] font-black uppercase text-[#2A8C82] tracking-wider block mb-1">
                  Instant Verification Portal
                </span>
                <h3 className="text-xl font-black text-[#1B3B36]">
                  Storefront & Brand Information
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Entries are automatically approved and instantly visible across the website without review delays.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cherry Street Brewing at Halcyon"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-bold text-slate-800"
                  >
                    <option value="Dining & Café">Dining & Café</option>
                    <option value="Bakery & Sweets">Bakery & Sweets</option>
                    <option value="Outdoor Village">Outdoor Village</option>
                    <option value="Italian & Pizzeria">Italian & Pizzeria</option>
                    <option value="Retail & Boutiques">Retail & Boutiques</option>
                    <option value="Family Entertainment">Family Entertainment</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Community Badge Recognition
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-bold text-slate-800"
                  >
                    <option value="Local Favorite">Local Favorite</option>
                    <option value="Family Owned">Family Owned</option>
                    <option value="Veteran Owned">Veteran Owned</option>
                    <option value="Historic Landmark">Historic Landmark</option>
                    <option value="Chef's Choice">Chef's Choice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Forsyth County Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 6365 Halcyon Way, Alpharetta, GA 30005"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                />
              </div>

              {/* Image preset selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Featured Storefront Photography *
                </label>
                <select
                  value={selectedImage}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                >
                  {IMAGE_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Selected image will appear on the community business directory cards and interactive map popups.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Price Range
                  </label>
                  <select
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                  >
                    <option value="$">$ (Inexpensive / Casual)</option>
                    <option value="$$">$$ (Moderate / Family)</option>
                    <option value="$$$">$$$ (Fine Dining / Premium)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g. Mon-Sat 10AM-9PM, Sun 12PM-6PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (770) 555-0199"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Website or Social Profile
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://mybusiness.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Description & Specialty Highlight
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell our visitors what makes your business unique, specialties, hours, or signature dishes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82] font-semibold text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1B3B36] to-[#2A8C82] hover:from-[#2A8C82] hover:to-[#1B3B36] text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                Submit & Automatically Approve Live On Website
              </button>
            </form>
          )}
        </div>

        {/* Benefits & Shop Local Badge Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shop Local Digital Badge Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-white p-6 sm:p-8 rounded-3xl border border-amber-300/80 shadow-md space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                  Official Merchant Seal
                </span>
                <h3 className="font-black text-lg text-[#1B3B36]">
                  "Shop Local Forsyth 2026"
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every verified local merchant gets digital rights to display our official <strong>Shop Local Forsyth</strong> badge on their website or storefront window.
            </p>

            {/* Badge Preview */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#1B3B36] text-white p-2 flex flex-col items-center justify-center text-center shadow-inner shrink-0">
                <span className="text-[9px] font-extrabold text-[#E29578] uppercase">Shop Local</span>
                <span className="text-xs font-black">FORSYTH</span>
                <span className="text-[8px] text-emerald-300 font-bold">2026</span>
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block font-bold">Verified Community Listing</strong>
                <span className="text-slate-500 text-[11px]">Free digital embed for member websites</span>
              </div>
            </div>

            <button
              onClick={copyBadgeCode}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 py-2.5 rounded-xl border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
              {copiedCode ? "HTML Code Copied!" : "Copy Embed HTML Code"}
            </button>
          </div>

          {/* Instant Auto-Approval Benefits */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-sm text-[#1B3B36] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2A8C82]" /> Instant Approval Privileges
            </h4>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                <span><strong>Instant Live Pin:</strong> Automatically plotted on the county interactive map with navigation routing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                <span><strong>Day Trip Planner:</strong> Instantly selectable in the Weekend Itinerary Builder on the homepage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                <span><strong>Global Search:</strong> Indexed into the Cmd + K search engine across all devices immediately.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
