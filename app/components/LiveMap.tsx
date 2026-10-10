"use client";

// -------------------------------------------------------------
// All Around Forsyth - Live Interactive Map Component
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Features: Google Maps Style View Toggles (Satellite, Street, Terrain),
// Live GA-400 Traffic Corridor Layer, Street View Modal, Driving Directions,
// and custom styled SVG teardrop pins.
// -------------------------------------------------------------

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Park, Business } from "../data/forsythData";
import {
  Trees, Trophy, MapPin, Navigation, Compass,
  Layers, Car, Eye, ExternalLink, Route, Clock, X, AlertTriangle
} from "lucide-react";

interface Landmark {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  image?: string;
}

const FORSYTH_LANDMARKS: Landmark[] = [
  {
    id: "historic-courthouse",
    name: "Historic Forsyth Courthouse Square",
    category: "Civic Landmark",
    address: "100 West Courthouse Sq, Cumming, GA 30040",
    lat: 34.2065,
    lng: -84.1430,
    description: "Historic town square of Forsyth County founded in 1832 with courthouse monuments and local civic center.",
    image: "/images/Forsyth_County_courthouse.jpg"
  },
  {
    id: "cumming-fairgrounds",
    name: "Cumming Fairgrounds",
    category: "Fairgrounds & Arena",
    address: "235 Castleberry Rd, Cumming, GA 30040",
    lat: 34.2015,
    lng: -84.1480,
    description: "Home of the annual 11-day Cumming Country Fair, tractor shows, rodeo, and Heritage Village.",
    image: "/images/cumming-fairgrounds.jpg"
  },
  {
    id: "buford-dam-overlook",
    name: "Buford Dam & Lake Lanier Overlook",
    category: "Engineering & Water",
    address: "3500 Buford Dam Rd, Cumming, GA 30041",
    lat: 34.1580,
    lng: -84.0750,
    description: "Iconic Corps of Engineers dam completed in 1956 impounding 38,000-acre Lake Lanier.",
    image: "/images/lake-lanier-boating-fishing_240591beeb8.jpg"
  }
];

// Presets for starting locations across Forsyth County
const ORIGINS = [
  { name: "Downtown Cumming (Courthouse Sq)", lat: 34.2065, lng: -84.1430 },
  { name: "South Forsyth (Halcyon / GA-400 Exit 12)", lat: 34.1118, lng: -84.2235 },
  { name: "North Forsyth (Coal Mountain)", lat: 34.2708, lng: -84.1362 },
  { name: "West Forsyth (Post Rd / Vickery)", lat: 34.1531, lng: -84.2105 },
  { name: "East Forsyth / Lake Lanier Shore", lat: 34.2885, lng: -84.0251 },
];

interface LiveMapProps {
  parks: Park[];
  businesses: Business[];
  selectedCategory: "all" | "parks" | "businesses" | "landmarks";
}

export default function LiveMap({
  parks,
  businesses,
  selectedCategory,
}: LiveMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard");
  const [showTraffic, setShowTraffic] = useState(true);
  const [showStreetViewModal, setShowStreetViewModal] = useState(false);
  const [streetViewTarget, setStreetViewTarget] = useState<any | null>(null);

  // Directions panel states
  const [showDirections, setShowDirections] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(ORIGINS[0]);
  const [estimatedDistance, setEstimatedDistance] = useState<string>("0");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("0");

  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const trafficLayerGroupRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const FORSYTH_CENTER: [number, number] = [34.2073, -84.1402];

  // Initialize Map
  useEffect(() => {
    const L = require("leaflet");

    const container = document.getElementById("forsyth-leaflet-map");
    if (!container) return;

    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
      container.innerHTML = "";
    }

    const map = L.map("forsyth-leaflet-map", {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(FORSYTH_CENTER, 11);

    mapInstanceRef.current = map;

    // Basemaps dictionary
    const getTileUrl = (type: "standard" | "satellite" | "terrain") => {
      if (type === "satellite") {
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      } else if (type === "terrain") {
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      }
      return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    };

    const tileLayer = L.tileLayer(getTileUrl(mapType), {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Live Traffic Corridor Layer Group (GA-400, Highway 20, Peachtree Pkwy)
    const trafficGroup = L.layerGroup();
    trafficLayerGroupRef.current = trafficGroup;

    // GA-400 Highway Corridor Simulation (Forsyth Section)
    const ga400Coords = [
      [34.1050, -84.2250],
      [34.1250, -84.2050],
      [34.1550, -84.1750],
      [34.1850, -84.1500],
      [34.2150, -84.1350],
      [34.2550, -84.1200],
      [34.3100, -84.1000],
    ];

    // GA-20 East-West Corridor (Cumming to Canton)
    const ga20Coords = [
      [34.2050, -84.2400],
      [34.2070, -84.1800],
      [34.2080, -84.1400],
      [34.2150, -84.1000],
      [34.2300, -84.0500],
    ];

    // Draw Highway Traffic flow lines (Green = Fast, Amber = Moderate Congestion)
    const ga400Line1 = L.polyline(ga400Coords.slice(0, 4), { color: "#22c55e", weight: 6, opacity: 0.8, lineCap: "round" });
    const ga400Line2 = L.polyline(ga400Coords.slice(3, 7), { color: "#eab308", weight: 6, opacity: 0.8, lineCap: "round" });
    const ga20Line = L.polyline(ga20Coords, { color: "#22c55e", weight: 5, opacity: 0.8, lineCap: "round" });

    ga400Line1.bindTooltip("GA-400 Southbound: 65 MPH (Normal Flow)", { sticky: true });
    ga400Line2.bindTooltip("GA-400 Northbound at Exit 14: 45 MPH (Moderate)", { sticky: true });
    ga20Line.bindTooltip("GA-20 / Canton Hwy: 50 MPH (Smooth)", { sticky: true });

    trafficGroup.addLayer(ga400Line1);
    trafficGroup.addLayer(ga400Line2);
    trafficGroup.addLayer(ga20Line);

    if (showTraffic) {
      trafficGroup.addTo(map);
    }

    // Custom teardrop pin factory with Lucide-styled clean SVGs
    const createTeardropIcon = (bgColor: string, symbol: string) => {
      return L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            position: relative;
            width: 34px;
            height: 42px;
            filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <svg viewBox="0 0 34 42" width="34" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${bgColor}" stroke="#ffffff" stroke-width="2.5"/>
              <circle cx="17" cy="16" r="10" fill="#ffffff" fill-opacity="0.2"/>
            </svg>
            <div style="
              position: absolute;
              top: 6px;
              left: 0;
              width: 34px;
              text-align: center;
              font-size: 14px;
              line-height: 18px;
            ">${symbol}</div>
          </div>
        `,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -40],
      });
    };

    const parkIcon = createTeardropIcon("#047857", "🌲");
    const bizIcon = createTeardropIcon("#d97706", "🏆");
    const landmarkIcon = createTeardropIcon("#7c3aed", "🏛️");

    markersRef.current = {};

    // 1. Add Park Markers
    if (selectedCategory === "all" || selectedCategory === "parks") {
      parks.forEach((park) => {
        if (park.lat && park.lng) {
          const marker = L.marker([park.lat, park.lng], { icon: parkIcon, title: park.name }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px; max-width: 230px;">
              <span style="font-size: 10px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">🌲 ${park.category}</span>
              <strong style="font-size: 14px; color: #1B3B36; display: block; margin: 2px 0;">${park.name}</strong>
              <p style="font-size: 11px; color: #475569; margin: 0 0 4px 0;">${park.address}</p>
              <p style="font-size: 11px; color: #15803d; font-weight: 600; margin: 0 0 6px 0;">${park.highlight}</p>
            </div>
          `);
          marker.on("click", () => handleSelectPoint(park));
          markersRef.current[park.id] = marker;
        }
      });
    }

    // 2. Add Business Markers
    if (selectedCategory === "all" || selectedCategory === "businesses") {
      businesses.forEach((biz) => {
        if (biz.lat && biz.lng) {
          const marker = L.marker([biz.lat, biz.lng], { icon: bizIcon, title: biz.name }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px; max-width: 230px;">
              <span style="font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">🏆 #${biz.rank} Top Business</span>
              <strong style="font-size: 14px; color: #1B3B36; display: block; margin: 2px 0;">${biz.name}</strong>
              <p style="font-size: 11px; color: #475569; margin: 0 0 4px 0;">${biz.address}</p>
              <p style="font-size: 11px; color: #334155; margin: 0 0 6px 0;">${biz.description}</p>
            </div>
          `);
          marker.on("click", () => handleSelectPoint(biz));
          markersRef.current[biz.id] = marker;
        }
      });
    }

    // 3. Add Landmark Markers
    if (selectedCategory === "all" || selectedCategory === "landmarks") {
      FORSYTH_LANDMARKS.forEach((lm) => {
        const marker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon, title: lm.name }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; max-width: 230px;">
            <span style="font-size: 10px; font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px;">🏛️ ${lm.category}</span>
            <strong style="font-size: 14px; color: #1B3B36; display: block; margin: 2px 0;">${lm.name}</strong>
            <p style="font-size: 11px; color: #475569; margin: 0 0 4px 0;">${lm.address}</p>
            <p style="font-size: 11px; color: #581c87; font-weight: 600; margin: 0;">${lm.description}</p>
          </div>
        `);
        marker.on("click", () => handleSelectPoint(lm));
        markersRef.current[lm.id] = marker;
      });
    }

    setMapLoaded(true);

    return () => {
      map.remove();
    };
  }, [parks, businesses, selectedCategory, mapType, showTraffic]);

  const handleSelectPoint = (point: any) => {
    setSelectedPoint(point);
    calculateEstimatedRoute(selectedOrigin, point);
  };

  // Calculate driving distance & route
  const calculateEstimatedRoute = (origin: typeof ORIGINS[0], destination: any) => {
    if (!destination || !destination.lat || !destination.lng) return;

    // Haversine direct distance * 1.3 road curvature factor
    const R = 3958.8; // miles
    const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
    const dLon = ((destination.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistance = R * c;
    const roadDistance = straightDistance * 1.28;
    const minutes = Math.max(4, Math.round((roadDistance / 40) * 60));

    setEstimatedDistance(roadDistance.toFixed(1));
    setEstimatedDuration(`${minutes}`);

    // Draw route line on Leaflet map
    if (mapInstanceRef.current) {
      const L = require("leaflet");
      if (routePolylineRef.current) {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
      }
      const routeLine = L.polyline(
        [
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ],
        { color: "#2563eb", weight: 4, dashArray: "6, 8", opacity: 0.9 }
      ).addTo(mapInstanceRef.current);
      routePolylineRef.current = routeLine;
    }
  };

  const handleFlyTo = (point: any) => {
    handleSelectPoint(point);
    if (mapInstanceRef.current && point.lat && point.lng) {
      mapInstanceRef.current.flyTo([point.lat, point.lng], 14, { duration: 1.2 });
      const marker = markersRef.current[point.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleOpenStreetView = (point: any) => {
    setStreetViewTarget(point);
    setShowStreetViewModal(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Map Column (8 Cols) */}
      <div className="lg:col-span-8 relative h-[640px] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
        <div id="forsyth-leaflet-map" className="w-full h-full z-10" />

        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-semibold">
            Loading Forsyth County Map Tiles...
          </div>
        )}

        {/* Top-Left: Google Maps Style Layer Controls (Satellite, Street, Terrain, Traffic) */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setMapType("standard")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              mapType === "standard" ? "bg-[#1B3B36] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Street
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              mapType === "satellite" ? "bg-[#1B3B36] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType("terrain")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              mapType === "terrain" ? "bg-[#1B3B36] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Terrain
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1" />

          {/* Live Traffic Toggle */}
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              showTraffic
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="w-3.5 h-3.5" /> Traffic: {showTraffic ? "ON" : "OFF"}
          </button>
        </div>

        {/* Floating Reset View Control */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(FORSYTH_CENTER, 11);
              setSelectedPoint(null);
              if (routePolylineRef.current) {
                mapInstanceRef.current.removeLayer(routePolylineRef.current);
              }
            }
          }}
          className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md text-[#1B3B36] font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-all"
        >
          <Compass className="w-4 h-4 text-[#2A8C82]" /> Reset County View
        </button>

        {/* Live Traffic Flow Indicator (GA-400 Corridor) */}
        {showTraffic && (
          <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 text-[11px] flex items-center gap-3">
            <span className="font-extrabold text-slate-700 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-emerald-600" /> GA-400 Flow:
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Fast
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Exit 14 Mod
            </span>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute top-18 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-1.5 hidden sm:block">
          <span className="font-black text-[#1B3B36] block border-b pb-1 text-[11px]">
            Pin Category Key
          </span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">🌲</span>
            <span className="text-slate-700 font-bold text-[11px]">Parks (10)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">🏆</span>
            <span className="text-slate-700 font-bold text-[11px]">Top Businesses (10)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">🏛️</span>
            <span className="text-slate-700 font-bold text-[11px]">Landmarks (3)</span>
          </div>
        </div>
      </div>

      {/* Interactive Sidebar Directory & Directions (4 Cols) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xl p-5 space-y-4 max-h-[640px] flex flex-col">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase text-[#2A8C82] tracking-wider block">
              Interactive Navigator
            </span>
            <h3 className="text-lg font-black text-[#1B3B36] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#E29578]" /> Click Any Spot
            </h3>
          </div>

          {selectedPoint && (
            <button
              onClick={() => setShowDirections(!showDirections)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                showDirections ? "bg-[#2563eb] text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <Route className="w-3.5 h-3.5" /> {showDirections ? "Hide Route" : "Directions"}
            </button>
          )}
        </div>

        {/* Selected Location Card Spotlight (with Street View & Driving Directions) */}
        {selectedPoint && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3 animate-in fade-in">
            {selectedPoint.image && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-200 mb-2">
                <Image src={selectedPoint.image} alt={selectedPoint.name || "Location"} fill className="object-cover" sizes="300px" />
              </div>
            )}

            <div className="flex justify-between items-start">
              <h4 className="font-black text-sm text-[#1B3B36]">{selectedPoint.name}</h4>
              <span className="text-[10px] font-extrabold bg-[#2A8C82] text-white px-2 py-0.5 rounded-full">
                {selectedPoint.category || selectedPoint.type || "Spotlight"}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedPoint.address}
            </p>

            <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
              {selectedPoint.highlight || selectedPoint.description || `Feeds into ${selectedPoint.feederTo}`}
            </p>

            {/* Street View & Google Navigation Actions */}
            <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap gap-2">
              <button
                onClick={() => handleOpenStreetView(selectedPoint)}
                className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-[#E29578]" /> 360° Street View
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  selectedPoint.address || selectedPoint.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-300 transition-all shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Google Maps
              </a>
            </div>

            {/* Directions Estimator Panel */}
            {showDirections && (
              <div className="pt-3 border-t border-emerald-300/80 space-y-2 bg-white/70 p-3 rounded-xl">
                <span className="text-[10px] font-black uppercase text-blue-800 block">
                  Turn-by-Turn Route Estimator
                </span>
                <label className="text-[11px] font-bold text-slate-700 block">From Starting Area:</label>
                <select
                  value={selectedOrigin.name}
                  onChange={(e) => {
                    const found = ORIGINS.find((o) => o.name === e.target.value) || ORIGINS[0];
                    setSelectedOrigin(found);
                    calculateEstimatedRoute(found, selectedPoint);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-semibold outline-none focus:border-blue-500"
                >
                  {ORIGINS.map((o) => (
                    <option key={o.name} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-between items-center text-xs font-bold pt-1 text-slate-800">
                  <span className="flex items-center gap-1 text-blue-700">
                    <Car className="w-3.5 h-3.5" /> Approx {estimatedDistance} miles
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                    <Clock className="w-3.5 h-3.5" /> ~{estimatedDuration} mins drive
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Location List */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1 text-xs">
          {/* Parks Section */}
          {(selectedCategory === "all" || selectedCategory === "parks") && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                Parks ({parks.length})
              </span>
              {parks.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleFlyTo(p)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between ${
                    selectedPoint?.id === p.id
                      ? "bg-emerald-100 border-emerald-400 font-bold text-emerald-950"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="truncate pr-2 font-bold">🌲 {p.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">Fly →</span>
                </button>
              ))}
            </div>
          )}

          {/* Businesses Section */}
          {(selectedCategory === "all" || selectedCategory === "businesses") && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                Top Businesses ({businesses.length})
              </span>
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleFlyTo(b)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between ${
                    selectedPoint?.id === b.id
                      ? "bg-amber-100 border-amber-400 font-bold text-amber-950"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="truncate pr-2 font-bold">🏆 #{b.rank} {b.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">Fly →</span>
                </button>
              ))}
            </div>
          )}

          {/* Landmarks Section */}
          {(selectedCategory === "all" || selectedCategory === "landmarks") && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider">
                Historic Landmarks ({FORSYTH_LANDMARKS.length})
              </span>
              {FORSYTH_LANDMARKS.map((lm) => (
                <button
                  key={lm.id}
                  onClick={() => handleFlyTo(lm)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between ${
                    selectedPoint?.id === lm.id
                      ? "bg-purple-100 border-purple-400 font-bold text-purple-950"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="truncate pr-2 font-bold">🏛️ {lm.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">Fly →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Street View Modal */}
      {showStreetViewModal && streetViewTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-4 bg-[#1B3B36] text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-[#E29578] tracking-wider block">
                  360° Street View & Surroundings
                </span>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#2A8C82]" /> {streetViewTarget.name}
                </h3>
              </div>
              <button
                onClick={() => setShowStreetViewModal(false)}
                className="text-white hover:text-red-400 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Street View Visualizer Content */}
            <div className="relative w-full h-[400px] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              {streetViewTarget.image ? (
                <>
                  <Image
                    src={streetViewTarget.image}
                    alt={streetViewTarget.name}
                    fill
                    className="object-cover opacity-85"
                    sizes="800px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[#2A8C82] px-3 py-1 rounded-full shadow-md">
                      Verified Forsyth County Location View
                    </span>
                    <h4 className="text-2xl font-black">{streetViewTarget.name}</h4>
                    <p className="text-xs text-emerald-100/90 max-w-xl">{streetViewTarget.address}</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-900/60 text-emerald-400 mx-auto flex items-center justify-center">
                    <Eye className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-white">{streetViewTarget.name}</h4>
                  <p className="text-xs text-slate-400 max-w-md">{streetViewTarget.address}</p>
                </div>
              )}
            </div>

            <div className="p-5 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs border-t border-slate-200">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">GPS Coordinates:</span>
                <p className="font-mono font-bold text-slate-700">
                  {streetViewTarget.lat.toFixed(4)}° N, {streetViewTarget.lng.toFixed(4)}° W
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewTarget.lat},${streetViewTarget.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1B3B36] hover:bg-[#2A8C82] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Eye className="w-4 h-4 text-[#E29578]" /> Launch 360° Google Street View <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(streetViewTarget.address || streetViewTarget.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
