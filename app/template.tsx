// template re-mounts on every page change so we get a nice fade
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
