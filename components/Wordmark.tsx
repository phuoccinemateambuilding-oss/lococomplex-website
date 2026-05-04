export function Wordmark({
  width = 110,
  height = 46,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet="/assets/loco/logo.avif" />
      <source type="image/webp" srcSet="/assets/loco/logo.webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/loco/logo.png"
        alt="LOCO Complex"
        width={width}
        height={height}
        className={className}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
