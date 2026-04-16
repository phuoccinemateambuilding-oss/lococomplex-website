interface MusicTagProps {
  genre: string;
  className?: string;
}

export default function MusicTag({ genre, className = "" }: MusicTagProps) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-[#0A0A0A] bg-transparent px-4 py-1 font-mono text-sm uppercase tracking-wider text-[#0A0A0A] ${className}`}
    >
      {genre}
    </span>
  );
}
