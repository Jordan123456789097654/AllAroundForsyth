// copyright page - ownership info for the site
export default function CopyrightPage() {
  const year = 2026;
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-[#1B3B36]">Copyright &amp; Ownership</h1>

      <p className="text-slate-700 leading-relaxed">
        &copy; {year} <strong>Jordan Daniels</strong> and <strong>DJ Reddish</strong>. All rights reserved.
      </p>

      <h2 className="text-xl font-bold text-[#1B3B36]">Sole Ownership</h2>
      <p className="text-slate-700 leading-relaxed">
        Jordan Daniels and DJ Reddish are the sole owners, designers, and developers of{" "}
        <em>All Around Forsyth</em>. This includes the website design, layout, source code,
        written content, logo, and every feature on the site. It was created for the FBLA
        Website Design Competition 2026.
      </p>

      <h2 className="text-xl font-bold text-[#1B3B36]">What You Can&apos;t Do</h2>
      <ul className="list-disc pl-6 space-y-1 text-slate-700">
        <li>Copy, sell, or re-publish this website or its code without written permission.</li>
        <li>Use the All Around Forsyth name or logo as your own.</li>
        <li>Claim this work as yours in any competition or project.</li>
      </ul>

      <h2 className="text-xl font-bold text-[#1B3B36]">Third-Party Material</h2>
      <p className="text-slate-700 leading-relaxed">
        Public information about Forsyth County (parks, government, history, weather and
        lake data) belongs to its original sources. Photos, map tiles, and data providers
        are credited on the <a href="/sources" className="underline text-[#2A8C82] font-semibold">Sources</a> page.
        Businesses listed on this site own their own names and trademarks.
      </p>

      <h2 className="text-xl font-bold text-[#1B3B36]">Contact</h2>
      <p className="text-slate-700 leading-relaxed">
        Want permission to use something? Use the <strong>Report a Bug</strong> button on any page
        to reach us.
      </p>

      <p className="text-xs text-slate-500">Last updated: {year}. This site is in beta.</p>
    </div>
  );
}
