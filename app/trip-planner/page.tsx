"use client";

// trip planner - pick places, get a printable day plan
import { useEffect, useState } from "react";
import { getStoredData, Park, Business } from "../data/forsythData";

export default function TripPlannerPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [biz, setBiz] = useState<Business[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [start, setStart] = useState(9);

  useEffect(() => {
    const d = getStoredData();
    setParks(d.parks);
    setBiz(d.businesses);
  }, []);

  function pick(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function timeLabel(h: number) {
    const hr = Math.floor(h) % 24;
    const ampm = hr >= 12 ? "PM" : "AM";
    const twelve = hr % 12 === 0 ? 12 : hr % 12;
    return twelve + ":00 " + ampm;
  }

  const all = [...parks.map((p) => ({ id: p.id, name: p.name, sub: p.address })), ...biz.map((b) => ({ id: b.id, name: b.name, sub: b.address }))];
  const plan = picked.map((id) => all.find((a) => a.id === id)).filter(Boolean) as { id: string; name: string; sub: string }[];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 print:hidden">
        <h1 className="text-3xl font-extrabold text-[#1B3B36]">Trip Planner</h1>
        <p className="text-sm text-slate-600">Check the places you want to visit. Your plan shows up on the right.</p>

        <label className="block text-sm font-semibold">
          Start time{" "}
          <select value={start} onChange={(e) => setStart(Number(e.target.value))} className="ml-2 border border-slate-300 rounded-lg p-1.5">
            {[7, 8, 9, 10, 11, 12].map((h) => (
              <option key={h} value={h}>{timeLabel(h)}</option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-2">
          <legend className="font-bold text-[#1B3B36] mb-1">Parks</legend>
          {parks.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={picked.includes(p.id)} onChange={() => pick(p.id)} /> {p.name}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-bold text-[#1B3B36] mb-1">Businesses</legend>
          {biz.map((b) => (
            <label key={b.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={picked.includes(b.id)} onChange={() => pick(b.id)} /> {b.name}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 h-fit space-y-4">
        <h2 className="text-xl font-bold text-[#1B3B36]">Your Day in Forsyth</h2>
        {plan.length === 0 ? (
          <p className="text-sm text-slate-600">No stops yet.</p>
        ) : (
          <ol className="space-y-3">
            {plan.map((s, i) => (
              <li key={s.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="font-extrabold text-[#2A8C82] w-20 shrink-0">{timeLabel(start + i * 2)}</span>
                <span>
                  <strong>{s.name}</strong>
                  <br />
                  <span className="text-xs text-slate-600">{s.sub}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
        <button
          onClick={() => window.print()}
          disabled={plan.length === 0}
          className="print:hidden bg-[#2A8C82] text-white font-bold px-4 py-2 rounded-xl disabled:opacity-40 hover:bg-[#1B3B36] transition-colors"
        >
          Print my plan
        </button>
      </div>
    </div>
  );
}
