const colorMap = {
  red: "bg-[#E23A2C]",
  pink: "bg-[#E91E8C]",
  yellow: "bg-[#F5C330]",
  blue: "bg-[#4A90D9]",
  teal: "bg-[#2DB89A]",
} as const;

interface StickerTagProps {
  text: string;
  color: keyof typeof colorMap;
  className?: string;
}

export default function StickerTag({ text, color, className = "" }: StickerTagProps) {
  const rotation = text.length % 2 === 0 ? "rotate-[-2deg]" : "rotate-[3deg]";

  return (
    <span
      className={`inline-block ${colorMap[color]} ${rotation} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md ${className}`}
    >
      {text}
    </span>
  );
}
