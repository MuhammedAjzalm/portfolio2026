export default function Marquee({
  items,
  className = "",
  speed = "animate-marquee",
  outline = false,
  starClass = "text-[#d7ff3e]",
}: {
  items: string[];
  className?: string;
  speed?: string;
  outline?: boolean;
  starClass?: string;
}) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex items-center gap-8 ${speed}`}>
        {[0, 1].map((half) => (
          <div key={half} className="inline-flex items-center gap-8">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="inline-flex items-center gap-8">
                <span className={outline ? "text-stroke-white" : ""}>{item}</span>
                <span className={starClass}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
