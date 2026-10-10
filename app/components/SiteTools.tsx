"use client";

// little tool bar at the bottom left: dark mode, Spanish, share, auto tour
import { useEffect, useState } from "react";
import DemoTour from "./DemoTour";

// not a full translation, just the main words on the site
const ES: Record<string, string> = {
  "Live Map": "Mapa en Vivo",
  "Parks": "Parques",
  "Community Businesses": "Negocios Locales",
  "Civic": "Cívico",
  "Safety": "Seguridad",
  "Events": "Eventos",
  "History": "Historia",
  "Explore Everything": "Explora Todo",
  "All Around Forsyth": "Todo Sobre Forsyth",
  "Explore by Category": "Explora por Categoría",
  "Explore Live Interactive Map": "Explorar Mapa Interactivo",
  "View Community Businesses": "Ver Negocios Locales",
  "Sources": "Fuentes",
  "Favorites": "Favoritos",
  "My Favorites": "Mis Favoritos",
  "Trip Planner": "Planificador de Viaje",
  "Print my plan": "Imprimir mi plan",
  "Skip to main content": "Saltar al contenido",
  "Report a Bug": "Reportar un Error",
  "Copyright & Ownership": "Derechos de Autor",
  "Accessibility Statement": "Declaración de Accesibilidad",
  "Emergency": "Emergencia",
  "Home": "Inicio",
  "Saved": "Guardados",
  "Your Day in Forsyth": "Tu Día en Forsyth",
  "Lost in Forsyth?": "¿Perdido en Forsyth?",
};

export default function SiteTools() {
  const [dark, setDark] = useState(false);
  const [es, setEs] = useState(false);
  const [msg, setMsg] = useState("");

  // load saved choices
  useEffect(() => {
    if (localStorage.getItem("aaf_dark") === "1") setDark(true);
    if (localStorage.getItem("aaf_lang") === "es") setEs(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("aaf_dark", dark ? "1" : "0");
  }, [dark]);

  // spanish: swap text nodes (and put them back when turned off)
  useEffect(() => {
    localStorage.setItem("aaf_lang", es ? "es" : "en");
    document.documentElement.lang = es ? "es" : "en";
    const originals = new Map<Node, string>();

    function swap() {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n = walker.nextNode();
      while (n) {
        const t = n.nodeValue?.trim() || "";
        if (ES[t] && n.nodeValue) {
          originals.set(n, n.nodeValue);
          n.nodeValue = n.nodeValue.replace(t, ES[t]);
        }
        n = walker.nextNode();
      }
    }

    if (!es) return;
    swap();
    const obs = new MutationObserver(() => {
      obs.disconnect();
      swap();
      obs.observe(document.body, { childList: true, subtree: true });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      originals.forEach((v, node) => {
        node.nodeValue = v;
      });
    };
  }, [es]);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMsg("Link copied!");
        setTimeout(() => setMsg(""), 2000);
      }
    } catch {
      // user cancelled, no big deal
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-wrap gap-2 max-w-[60vw] print:hidden">
      <button onClick={() => setDark(!dark)} aria-pressed={dark} className="tool-btn bg-white text-slate-800">
        {dark ? "☀ Light" : "🌙 Dark"}
      </button>
      <button onClick={() => setEs(!es)} aria-pressed={es} className="tool-btn bg-white text-slate-800">
        {es ? "English" : "Español"}
      </button>
      <button onClick={share} className="tool-btn bg-white text-slate-800">
        Share
      </button>
      <DemoTour />
      <span role="status" className="sr-only">{msg}</span>
      {msg && <span className="tool-btn bg-black text-white">{msg}</span>}
    </div>
  );
}
