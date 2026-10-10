// accessibility statement page
export default function AccessibilityPage() {
  const features = [
    "Skip to main content link for keyboard users",
    "Full keyboard navigation with visible focus outlines",
    "Screen reader labels, landmarks and page change announcements",
    "Text size, high contrast, and dyslexia-friendly font options in the accessibility toolbar",
    "Reduced motion support - animations turn off if your device asks for it",
    "Alt text on images and readable color contrast",
    "Dark mode and a Spanish language option",
    "Works on phones, tablets and desktops",
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-[#1B3B36]">Accessibility Statement</h1>
      <p className="text-slate-700 leading-relaxed">
        We want everyone in Forsyth County to be able to use All Around Forsyth. We built the
        site to follow the WCAG 2.1 AA guidelines and the ADA as closely as we can.
      </p>

      <h2 className="text-xl font-bold text-[#1B3B36]">What we do</h2>
      <ul className="list-disc pl-6 space-y-1 text-slate-700">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-[#1B3B36]">Known limits</h2>
      <p className="text-slate-700 leading-relaxed">
        The site is in beta. The live map is hard to use with a screen reader, so every park
        and business is also listed in text on their own pages.
      </p>

      <h2 className="text-xl font-bold text-[#1B3B36]">Tell us about a problem</h2>
      <p className="text-slate-700 leading-relaxed">
        If something is hard to use, press the <strong>Report a Bug</strong> button and tell us
        the page and what went wrong. We will try to fix it.
      </p>
    </div>
  );
}
