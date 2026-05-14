export function Wordmark({
  width = 110,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  // Logo is 1:1 ratio (800x800px natural dimensions)
  return (
    <picture>
      <source type="image/avif" srcSet="/assets/loco/logo.avif" />
      <source type="image/webp" srcSet="/assets/loco/logo.webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/loco/logo.png"
        alt="LOCO Complex"
        width={width}
        height={width}
        className={className}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
