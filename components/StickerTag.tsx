const colorMap = {
  red: { bg: "bg-[#C62E22]", text: "text-white" },
  pink: { bg: "bg-[#E91E8C]", text: "text-[#0A0A0A]" },
  yellow: { bg: "bg-[#F5C330]", text: "text-[#0A0A0A]" },
  blue: { bg: "bg-[#3978C0]", text: "text-white" },
  teal: { bg: "bg-[#1F8A73]", text: "text-white" },
} as const;

interface StickerTagProps {
  text: string;
  color: keyof typeof colorMap;
  className?: string;
}

export default function StickerTag({ text, color, className = "" }: StickerTagProps) {
  const rotation = text.length % 2 === 0 ? "rotate-[-2deg]" : "rotate-[3deg]";
  const c = colorMap[color];

  return (
    <span
      className={`inline-block ${c.bg} ${c.text} ${rotation} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-md ${className}`}
    >
      {text}
    </span>
  );
}
