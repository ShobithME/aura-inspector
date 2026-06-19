export default function ScannerFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="hud-corner top-0 left-0 border-t-2 border-l-2 rounded-tl-md" />
      <span className="hud-corner top-0 right-0 border-t-2 border-r-2 rounded-tr-md" />
      <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md" />
      <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2 rounded-br-md" />
      {children}
    </div>
  );
}
