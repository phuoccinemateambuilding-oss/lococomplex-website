"use client";

interface MarqueeProps {
  items: string[];
}

export default function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-4 bg-ink">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-6 inline-block font-[family-name:var(--font-space-mono)] text-sm uppercase tracking-widest text-white/40"
          >
            {item}
            <span className="mx-6 text-loco-red/60" aria-hidden="true">
              /
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
