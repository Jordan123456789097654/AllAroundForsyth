"use client";

// -------------------------------------------------------------
// All Around Forsyth - Accessibility Enhancer
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Runs on every page change to fix common ADA gaps automatically:
//  - connects <label> to its form field
//  - gives icon-only buttons/links an accessible name
//  - adds rel="noopener" + a screen reader note to links that open a new tab
//  - announces page changes to screen readers and moves focus to main content
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function A11yEnhancer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const fix = () => {
      // 1. labels -> fields
      document.querySelectorAll("label:not([for])").forEach((label, i) => {
        if (label.querySelector("input,select,textarea")) return;
        const field = label.parentElement?.querySelector("input,select,textarea") as HTMLElement | null;
        if (field && !field.getAttribute("aria-label")) {
          if (!field.id) field.id = `auto-field-${i}-${Math.random().toString(36).slice(2, 7)}`;
          label.setAttribute("for", field.id);
        }
      });

      // 2. unnamed fields
      document.querySelectorAll("input,select,textarea").forEach((el) => {
        const f = el as HTMLInputElement;
        if (f.type === "hidden") return;
        const hasLabel = f.id && document.querySelector(`label[for="${f.id}"]`);
        if (!hasLabel && !f.getAttribute("aria-label") && !f.closest("label")) {
          const name = f.getAttribute("placeholder") || f.getAttribute("title") || f.name;
          if (name) f.setAttribute("aria-label", name);
        }
      });

      // 3. icon-only buttons and links
      document.querySelectorAll("button, a").forEach((el) => {
        if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return;
        const text = (el.textContent || "").trim();
        if (!text) {
          const name = el.getAttribute("title");
          if (name) el.setAttribute("aria-label", name);
        }
      });

      // 4. decorative icons hidden from screen readers
      document.querySelectorAll("svg:not([aria-hidden]):not([role])").forEach((svg) => {
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
      });

      // 5. new-tab links
      document.querySelectorAll('a[target="_blank"]').forEach((a) => {
        a.setAttribute("rel", "noopener noreferrer");
        if (!a.getAttribute("aria-label") && !a.querySelector(".sr-only")) {
          const note = document.createElement("span");
          note.className = "sr-only";
          note.textContent = " (opens in a new tab)";
          a.appendChild(note);
        }
      });
    };

    fix();
    const observer = new MutationObserver(() => fix());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  // announce route changes and move focus
  useEffect(() => {
    const h1 = document.querySelector("h1")?.textContent?.trim();
    setAnnouncement(`Navigated to ${h1 || document.title}`);
    const main = document.getElementById("main-content");
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
