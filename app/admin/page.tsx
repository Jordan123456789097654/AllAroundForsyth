"use client";

// -------------------------------------------------------------
// All Around Forsyth - Comprehensive Admin Management Portal
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Full CMS: Manage Parks, Businesses, Events, and Schools with LocalStorage
// PIN Code: 2026
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { getStoredData, saveStoredData, resetToDefaultData, ForsythDataset, Park, Business, EventItem } from "../data/forsythData";
import { Settings, Lock, Plus, Trash2, Save, CheckCircle2, RotateCcw, Trees, Trophy, Calendar, Download, Clock, ShieldAlert, Key } from "lucide-react";
import { TOUR_LENGTH } from "../components/DemoTour";

export default function AdminPage() {
  const [pinInput, setPinInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<ForsythDataset | null>(null);
  const [activeTab, setActiveTab] = useState<"parks" | "businesses" | "events">("parks");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states for Park
  const [parkName, setParkName] = useState("");
  const [parkCategory, setParkCategory] = useState("Nature & Hiking");
  const [parkAddress, setParkAddress] = useState("");
  const [parkHighlight, setParkHighlight] = useState("");

  // Form states for Business
  const [bizName, setBizName] = useState("");
  const [bizCategory, setBizCategory] = useState("Dining & Café");
  const [bizAddress, setBizAddress] = useState("");
  const [bizBadge, setBizBadge] = useState("Local Favorite");
  const [bizDesc, setBizDesc] = useState("");

  // Form states for Event
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLoc, setEventLoc] = useState("");
  const [eventCategory, setEventCategory] = useState("Community Festival");
  const [eventDesc, setEventDesc] = useState("");

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "2026") {
      setAuthenticated(true);
    } else {
      alert("Invalid Admin PIN. Use PIN: 2026");
    }
  };

  const notifySaved = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddPark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !parkName) return;
    const newPark: Park = {
      id: `park-${Date.now()}`,
      name: parkName,
      category: parkCategory,
      address: parkAddress || "Forsyth County, GA",
      lat: 34.2073,
      lng: -84.1402,
      amenities: ["Public Access", "Parking", "Restrooms"],
      highlight: parkHighlight || "Newly added community park.",
      hours: "Dawn to Dusk",
    };
    const updated = { ...data, parks: [newPark, ...data.parks] };
    setData(updated);
    saveStoredData(updated);
    setParkName("");
    setParkHighlight("");
    notifySaved();
  };

  const handleDeletePark = (id: string) => {
    if (!data) return;
    const updated = { ...data, parks: data.parks.filter((p) => p.id !== id) };
    setData(updated);
    saveStoredData(updated);
  };

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !bizName) return;
    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      rank: data.businesses.length + 1,
      name: bizName,
      category: bizCategory,
      address: bizAddress || "Cumming, GA",
      lat: 34.2073,
      lng: -84.1402,
      badge: bizBadge,
      description: bizDesc || "Newly added local business.",
    };
    const updated = { ...data, businesses: [...data.businesses, newBiz] };
    setData(updated);
    saveStoredData(updated);
    setBizName("");
    setBizDesc("");
    notifySaved();
  };

  const handleDeleteBusiness = (id: string) => {
    if (!data) return;
    const updated = { ...data, businesses: data.businesses.filter((b) => b.id !== id) };
    setData(updated);
    saveStoredData(updated);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !eventTitle) return;
    const newEvt: EventItem = {
      id: `evt-${Date.now()}`,
      title: eventTitle,
      date: eventDate || "Upcoming 2026",
      location: eventLoc || "Cumming Fairgrounds",
      category: eventCategory,
      description: eventDesc || "Community event description.",
    };
    const updated = { ...data, events: [newEvt, ...data.events] };
    setData(updated);
    saveStoredData(updated);
    setEventTitle("");
    setEventDesc("");
    notifySaved();
  };

  const handleDeleteEvent = (id: string) => {
    if (!data) return;
    const updated = { ...data, events: data.events.filter((e) => e.id !== id) };
    setData(updated);
    saveStoredData(updated);
  };

  const handleResetData = () => {
    if (confirm("Reset directory data to official Forsyth County defaults? All custom changes will be refreshed.")) {
      const reset = resetToDefaultData();
      setData(reset);
      notifySaved();
    }
  };

  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all_around_forsyth_dataset.json";
    a.click();
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#1B3B36]">Admin Portal Login</h1>
          <p className="text-xs text-slate-500">
            Enter PIN <code className="bg-slate-100 px-2 py-0.5 rounded font-black text-slate-800">2026</code> to manage Forsyth County directory listings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Enter Admin PIN:</label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-center text-xl font-mono font-black outline-none focus:border-[#2A8C82] tracking-widest"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1B3B36] hover:bg-[#2A8C82] text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-md"
          >
            Unlock Management CMS
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-black tracking-widest text-amber-600 uppercase flex items-center gap-1.5">
            <Settings className="w-4 h-4" /> Real-Time Content Management System
          </span>
          <h1 className="text-3xl font-black text-[#1B3B36] tracking-tight mt-1">
            Admin Dashboard & Editor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event("aaf-start-tour"))}
            className="bg-[#E29578] hover:bg-[#d4805f] text-[#1B3B36] text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            ▶ Start Presentation Tour ({TOUR_LENGTH})
          </button>
          <button
            onClick={handleResetData}
            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Changes successfully saved to local storage!
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold">Parks Registered</span>
          <span className="text-2xl font-black text-emerald-700 block">{data?.parks.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold">Top Businesses</span>
          <span className="text-2xl font-black text-amber-600 block">{data?.businesses.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold">Upcoming Events</span>
          <span className="text-2xl font-black text-[#E29578] block">{data?.events.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold">Historic Eras</span>
          <span className="text-2xl font-black text-purple-600 block">4 Key Eras</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs font-bold max-w-2xl">
        <button
          onClick={() => setActiveTab("parks")}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "parks" ? "bg-white text-[#1B3B36] shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Trees className="w-4 h-4 text-emerald-600" /> Parks ({data?.parks.length})
        </button>
        <button
          onClick={() => setActiveTab("businesses")}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "businesses" ? "bg-white text-[#1B3B36] shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" /> Community Businesses ({data?.businesses.length})
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "events" ? "bg-white text-[#1B3B36] shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4 text-[#E29578]" /> Events ({data?.events.length})
        </button>
      </div>

      {/* TAB 1: PARKS */}
      {activeTab === "parks" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-base text-[#1B3B36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#2A8C82]" /> Add New Park Listing
            </h3>
            <form onSubmit={handleAddPark} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Park Name:</label>
                <input
                  type="text"
                  required
                  value={parkName}
                  onChange={(e) => setParkName(e.target.value)}
                  placeholder="e.g. Chattahoochee Pointe Park"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category:</label>
                <input
                  type="text"
                  value={parkCategory}
                  onChange={(e) => setParkCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Address:</label>
                <input
                  type="text"
                  value={parkAddress}
                  onChange={(e) => setParkAddress(e.target.value)}
                  placeholder="Street address, Cumming, GA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Highlight Description:</label>
                <input
                  type="text"
                  value={parkHighlight}
                  onChange={(e) => setParkHighlight(e.target.value)}
                  placeholder="Special amenities or trails info..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#E29578]" /> Save Park
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-sm text-[#1B3B36]">Current Parks Registry ({data?.parks.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {data?.parks.map((p) => (
                <div key={p.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50">
                  <div>
                    <strong className="text-slate-900 text-sm font-black">{p.name}</strong>
                    <span className="text-slate-500 block">{p.category} • {p.address}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePark(p.id)}
                    className="text-red-500 hover:text-red-700 font-bold p-2 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUSINESSES */}
      {activeTab === "businesses" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-base text-[#1B3B36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" /> Add New Community Business Spotlight
            </h3>
            <form onSubmit={handleAddBusiness} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Business Name:</label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Tam's Backstage"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge Tag:</label>
                <input
                  type="text"
                  value={bizBadge}
                  onChange={(e) => setBizBadge(e.target.value)}
                  placeholder="e.g. Local Choice"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category:</label>
                <input
                  type="text"
                  value={bizCategory}
                  onChange={(e) => setBizCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Address:</label>
                <input
                  type="text"
                  value={bizAddress}
                  onChange={(e) => setBizAddress(e.target.value)}
                  placeholder="Address, Cumming, GA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={bizDesc}
                  onChange={(e) => setBizDesc(e.target.value)}
                  placeholder="Overview of business, dining style, special features..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#E29578]" /> Save Business
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-sm text-[#1B3B36]">Current Community Businesses Registry ({data?.businesses.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {data?.businesses.map((b) => (
                <div key={b.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-black flex items-center justify-center text-xs">
                      #{b.rank}
                    </span>
                    <div>
                      <strong className="text-slate-900 text-sm font-black">{b.name}</strong>
                      <span className="text-slate-500 block">{b.category} • {b.badge}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBusiness(b.id)}
                    className="text-red-500 hover:text-red-700 font-bold p-2 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-base text-[#1B3B36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#E29578]" /> Add New Community Event
            </h3>
            <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Title:</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Cumming Fall Music Fest"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Date:</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. November 12, 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Location:</label>
                <input
                  type="text"
                  value={eventLoc}
                  onChange={(e) => setEventLoc(e.target.value)}
                  placeholder="e.g. Cumming City Center Amphitheater"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category:</label>
                <input
                  type="text"
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Description:</label>
                <input
                  type="text"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Event schedule, activities, and admission..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#2A8C82]"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#E29578]" /> Save Event
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-sm text-[#1B3B36]">Current Events Calendar ({data?.events.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {data?.events.map((e) => (
                <div key={e.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50">
                  <div>
                    <strong className="text-slate-900 text-sm font-black">{e.title}</strong>
                    <span className="text-slate-500 block">{e.date} • {e.location}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(e.id)}
                    className="text-red-500 hover:text-red-700 font-bold p-2 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
