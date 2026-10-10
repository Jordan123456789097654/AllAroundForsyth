"use client";

// favorites page - star parks and businesses, saved in localStorage
import { useEffect, useState } from "react";
import { getStoredData, Park, Business } from "../data/forsythData";

const KEY = "aaf_favorites";

export default function FavoritesPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [biz, setBiz] = useState<Business[]>([]);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const d = getStoredData();
    setParks(d.parks);
    setBiz(d.businesses);
    try {
      setFavs(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setFavs([]);
    }
  }, []);

  function toggle(id: string) {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function Row({ id, name, sub }: { id: string; name: string; sub: string }) {
    const on = favs.includes(id);
    return (
      <li className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
        <div>
          <p className="font-bold text-slate-800">{name}</p>
          <p className="text-xs text-slate-600">{sub}</p>
        </div>
        <button
          onClick={() => toggle(id)}
          aria-pressed={on}
          aria-label={(on ? "Remove from favorites: " : "Add to favorites: ") + name}
          className={"text-2xl transition-transform hover:scale-125 " + (on ? "text-amber-500" : "text-slate-400")}
        >
          {on ? "★" : "☆"}
        </button>
      </li>
    );
  }

  const savedParks = parks.filter((p) => favs.includes(p.id));
  const savedBiz = biz.filter((b) => favs.includes(b.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B3B36]">My Favorites</h1>
        <p className="text-slate-600 text-sm mt-1">Tap a star to save a place. Saved on this device only.</p>
      </div>

      <section aria-labelledby="saved-h" className="space-y-3">
        <h2 id="saved-h" className="text-xl font-bold text-[#1B3B36]">
          Saved ({savedParks.length + savedBiz.length})
        </h2>
        {savedParks.length + savedBiz.length === 0 ? (
          <p className="text-slate-600 text-sm">Nothing saved yet - star something below!</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {savedParks.map((p) => <Row key={p.id} id={p.id} name={p.name} sub={p.address} />)}
            {savedBiz.map((b) => <Row key={b.id} id={b.id} name={b.name} sub={b.address} />)}
          </ul>
        )}
      </section>

      <section aria-labelledby="parks-h" className="space-y-3">
        <h2 id="parks-h" className="text-xl font-bold text-[#1B3B36]">Parks</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {parks.map((p) => <Row key={p.id} id={p.id} name={p.name} sub={p.category} />)}
        </ul>
      </section>

      <section aria-labelledby="biz-h" className="space-y-3">
        <h2 id="biz-h" className="text-xl font-bold text-[#1B3B36]">Community Businesses</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {biz.map((b) => <Row key={b.id} id={b.id} name={b.name} sub={b.category} />)}
        </ul>
      </section>
    </div>
  );
}
