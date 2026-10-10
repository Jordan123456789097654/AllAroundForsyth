"use client";

// -------------------------------------------------------------
// All Around Forsyth - Upcoming Events Calendar Page
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified community events with Google Calendar sync, .ics download,
// and Community Event Submission Modal
// -------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { getStoredData, saveStoredData, INITIAL_DATA, ForsythDataset, EventItem } from "../data/forsythData";
import {
  Calendar, MapPin, Clock, PlusCircle, CheckCircle2, Ticket,
  Tag, Sparkles, Download, Plus, X, Send, Share2
} from "lucide-react";

export default function EventsPage() {
  const [data, setData] = useState<ForsythDataset>(INITIAL_DATA);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Event Form States
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCategory, setNewCategory] = useState("Community Festival");
  const [newTime, setNewTime] = useState("");
  const [newAdmission, setNewAdmission] = useState("Free Admission");
  const [newDescription, setNewDescription] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const categories = [
    { id: "all", label: "All Upcoming Events" },
    { id: "community", label: "Festivals & Heritage" },
    { id: "market", label: "Farmers Markets" },
    { id: "music", label: "Concerts & Music" },
    { id: "youth", label: "FBLA & Youth Leadership" },
  ];

  const filteredEvents = data.events.filter((evt) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "community") {
      return (
        evt.category.toLowerCase().includes("festival") ||
        evt.category.toLowerCase().includes("civic") ||
        evt.category.toLowerCase().includes("holiday")
      );
    }
    if (filterCategory === "market") {
      return evt.category.toLowerCase().includes("market");
    }
    if (filterCategory === "music") {
      return (
        evt.category.toLowerCase().includes("concert") ||
        evt.category.toLowerCase().includes("music")
      );
    }
    if (filterCategory === "youth") {
      return (
        evt.category.toLowerCase().includes("fbla") ||
        evt.category.toLowerCase().includes("youth") ||
        evt.category.toLowerCase().includes("outdoor")
      );
    }
    return true;
  });

  // Google Calendar Link
  const handleGoogleCalendar = (event: EventItem) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\nAdmission: ${event.admission || "Free"}`);
    const loc = encodeURIComponent(event.location);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}`;
    window.open(gcalUrl, "_blank");

    if (!savedEventIds.includes(event.id)) {
      setSavedEventIds([...savedEventIds, event.id]);
    }
  };

  // Download standard iCalendar (.ics) file
  const handleDownloadIcs = (event: EventItem) => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//All Around Forsyth//Community Events//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, " ")}`,
      `LOCATION:${event.location}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.id || "forsyth-event"}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Community Event Submission
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: EventItem = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate.trim() || "Upcoming 2026",
      location: newLocation.trim() || "Forsyth County, GA",
      category: newCategory,
      time: newTime.trim() || undefined,
      admission: newAdmission.trim() || "Free",
      description: newDescription.trim() || "Community event in Forsyth County.",
    };

    const updated = {
      ...data,
      events: [newEvt, ...data.events],
    };

    setData(updated);
    saveStoredData(updated);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setNewTitle("");
      setNewDate("");
      setNewLocation("");
      setNewDescription("");
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-[#1B3B36] to-[#0D1F1C] text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-orange-500/20 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#E29578] uppercase flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E29578]" /> Forsyth County Civic & Community Calendar
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Upcoming Community Events & Festivals
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed mt-1">
              From the 11-day Cumming Country Fair and weekly Halcyon Farmers Market to outdoor concerts at the Lou Sobh Amphitheater.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-[#E29578] hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Submit Community Event
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs relative z-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filterCategory === cat.id
                  ? "bg-[#E29578] text-slate-950 shadow-md font-black"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const isSaved = savedEventIds.includes(evt.id);
          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Header Tag + Date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-orange-50 text-[#E29578] border border-orange-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {evt.category}
                  </span>
                  <span className="text-xs font-black text-[#2A8C82] flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5" /> {evt.date}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#1B3B36] group-hover:text-[#2A8C82] transition-colors pt-1">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {evt.location}
                </p>

                {evt.time && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {evt.time}
                  </p>
                )}

                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {evt.description}
                </p>

                {evt.admission && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      <Ticket className="w-3.5 h-3.5 text-amber-600" /> {evt.admission}
                    </span>
                  </div>
                )}
              </div>

              {/* Sync Actions Strip */}
              <div className="pt-5 border-t border-slate-100 mt-5 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => handleDownloadIcs(evt)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  title="Download .ics file for Apple iCal or Outlook"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> .ICS Download
                </button>

                <button
                  onClick={() => handleGoogleCalendar(evt)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                    isSaved
                      ? "bg-emerald-600 text-white"
                      : "bg-[#1B3B36] hover:bg-[#2A8C82] text-white"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> Added to Google Calendar
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5 text-[#E29578]" /> Google Calendar
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Event Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#1B3B36]">Event Submitted!</h3>
                <p className="text-xs text-slate-600">Your community event has been added to the calendar.</p>
              </div>
            ) : (
              <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#2A8C82] tracking-wider block">
                    Community Submission
                  </span>
                  <h3 className="text-xl font-black text-[#1B3B36]">
                    Submit a Forsyth County Event
                  </h3>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Vickery Village Fall 5K & Fun Run"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#2A8C82] font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Date *</label>
                    <input
                      type="text"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="e.g. October 24, 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#2A8C82] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#2A8C82] font-bold"
                    >
                      <option value="Community Festival">Community Festival</option>
                      <option value="Farmers Market">Farmers Market</option>
                      <option value="Outdoor Concert">Outdoor Concert</option>
                      <option value="Youth Leadership">Youth Leadership</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Cumming Fairgrounds"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#2A8C82] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Admission</label>
                    <input
                      type="text"
                      value={newAdmission}
                      onChange={(e) => setNewAdmission(e.target.value)}
                      placeholder="e.g. Free or $10 Entry"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#2A8C82] font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Event activities, parking notes, or vendor details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#2A8C82] font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1B3B36] hover:bg-[#2A8C82] text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-[#E29578]" /> Post Event to Calendar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
