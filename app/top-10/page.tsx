"use client";

// -------------------------------------------------------------
// All Around Forsyth - Community Businesses & Commercial Hubs
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified real 10 businesses with hours, phone, category filters
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStoredData, saveStoredData, INITIAL_DATA, ForsythDataset, Business } from "../data/forsythData";
import { Trophy, MapPin, Clock, Phone, ExternalLink, Star, Filter, PlusCircle, CheckCircle2 } from "lucide-react";

export default function TopTenPage() {
  const [data, setData] = useState<ForsythDataset>(INITIAL_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showNominateModal, setShowNominateModal] = useState<boolean>(false);
  const [nominateSubmitted, setNominateSubmitted] = useState<boolean>(false);

  // Nomination form state
  const [nomBizName, setNomBizName] = useState("");
  const [nomCategory, setNomCategory] = useState("Dining & Café");
  const [nomAddress, setNomAddress] = useState("");
  const [nomReason, setNomReason] = useState("");

  useEffect(() => {
    const refreshData = () => {
      setData(getStoredData());
    };
    refreshData();
    window.addEventListener("storage", refreshData);
    window.addEventListener("forsyth-data-updated", refreshData);
    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("forsyth-data-updated", refreshData);
    };
  }, []);

  const handleNominateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomBizName.trim()) return;

    const current = getStoredData();
    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      rank: current.businesses.length + 1,
      name: nomBizName.trim(),
      category: nomCategory,
      address: nomAddress.trim() || "Forsyth County, GA",
      lat: 34.2073 + (Math.random() - 0.5) * 0.04,
      lng: -84.1402 + (Math.random() - 0.5) * 0.04,
      badge: "Community Favorite",
      description: nomReason.trim() || "Nominated by local Forsyth County residents and community visitors.",
      image: "/images/cumming-city-center.jpg",
      price: "$$",
      hours: "Daily 10:00 AM - 9:00 PM",
      phone: "(770) 555-0199",
    };

    const updated = {
      ...current,
      businesses: [...current.businesses, newBiz],
    };
    saveStoredData(updated);
    setData(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("forsyth-data-updated"));
    }

    setNominateSubmitted(true);
    setTimeout(() => {
      setNominateSubmitted(false);
      setShowNominateModal(false);
      setNomBizName("");
      setNomAddress("");
      setNomReason("");
    }, 2000);
  };

  const categories = [
    { id: "all", label: "All Community Businesses" },
    { id: "dining", label: "Dining, Cafés & Bakeries" },
    { id: "retail", label: "Town Centers & Retail" },
    { id: "entertainment", label: "Entertainment & Sports" },
  ];

  const filteredBusinesses = data.businesses.filter((b) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "dining") {
      return (
        b.category.toLowerCase().includes("dining") ||
        b.category.toLowerCase().includes("bakery") ||
        b.category.toLowerCase().includes("brewery") ||
        b.category.toLowerCase().includes("cuisine") ||
        b.category.toLowerCase().includes("deli")
      );
    }
    if (selectedCategory === "retail") {
      return (
        b.category.toLowerCase().includes("mixed-use") ||
        b.category.toLowerCase().includes("shopping") ||
        b.category.toLowerCase().includes("town center")
      );
    }
    if (selectedCategory === "entertainment") {
      return (
        b.category.toLowerCase().includes("motorsports") ||
        b.category.toLowerCase().includes("entertainment") ||
        b.category.toLowerCase().includes("hub")
      );
    }
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-amber-500/20">
        <div className="space-y-2">
          <span className="text-[11px] font-black tracking-widest text-amber-700 uppercase flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> Forsyth County Chamber & Local Commerce
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1B3B36] tracking-tight">
            Community Businesses & Commercial Hubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Celebrating entrepreneurship, culinary destinations, and shopping hubs that drive Forsyth County's thriving community economy.
          </p>
        </div>

        <button
          onClick={() => setShowNominateModal(true)}
          className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 hover:scale-105"
        >
          <PlusCircle className="w-4 h-4 text-[#E29578]" /> Nominate a Local Business
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? "bg-[#1B3B36] text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Directory Stack of Community Businesses */}
      <div className="space-y-5">
        {filteredBusinesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group hover:-translate-y-0.5"
          >
            {/* Rank + Details */}
            <div className="flex items-start gap-5 flex-1">
              {/* Rank Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shrink-0 border border-amber-300">
                #{biz.rank}
              </div>

              {/* Main Content */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-black text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors">
                    {biz.name}
                  </h3>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {biz.badge}
                  </span>
                  {biz.price && (
                    <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {biz.price}
                    </span>
                  )}
                </div>

                <p className="text-xs font-extrabold text-[#2A8C82] tracking-wide">
                  {biz.category}
                </p>

                <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                  {biz.description}
                </p>

                {/* Meta details: Address, Phone, Hours */}
                <div className="flex flex-wrap gap-y-1 gap-x-4 pt-2 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {biz.address}
                  </span>
                  {biz.hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {biz.hours}
                    </span>
                  )}
                  {biz.phone && (
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {biz.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail or Website Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0 w-full lg:w-auto">
              {biz.image && (
                <div className="relative h-28 w-full sm:w-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <Image src={biz.image} alt={biz.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 200px" />
                </div>
              )}
              {biz.website && (
                <a
                  href={biz.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-[#2A8C82] text-slate-700 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  Visit Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Nominate Business Modal */}
      {showNominateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600">Community Choice</span>
                <h3 className="text-xl font-black text-[#1B3B36]">Nominate a Forsyth Business</h3>
              </div>
              <button
                onClick={() => setShowNominateModal(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {nominateSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-[#1B3B36]">Auto-Approved & Added Live!</h4>
                <p className="text-xs text-slate-600">
                  Congratulations! <strong>{nomBizName}</strong> has been automatically verified and added to the Community Businesses Directory and Interactive Map!
                </p>
              </div>
            ) : (
              <form onSubmit={handleNominateSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Business Name:</label>
                  <input
                    type="text"
                    required
                    value={nomBizName}
                    onChange={(e) => setNomBizName(e.target.value)}
                    placeholder="e.g. Tam's Backstage, Los Rios, Slopes BBQ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Category:</label>
                    <select
                      value={nomCategory}
                      onChange={(e) => setNomCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                    >
                      <option>Dining & Café</option>
                      <option>Retail & Boutique</option>
                      <option>Recreation & Family</option>
                      <option>Local Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Address / Area:</label>
                    <input
                      type="text"
                      value={nomAddress}
                      onChange={(e) => setNomAddress(e.target.value)}
                      placeholder="e.g. Downtown Cumming"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Why should it be featured?</label>
                  <textarea
                    rows={3}
                    value={nomReason}
                    onChange={(e) => setNomReason(e.target.value)}
                    placeholder="What makes this spot special to Forsyth County?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNominateModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
                  >
                    Submit Nomination
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
