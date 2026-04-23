import Image from "next/image";

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
    <Image
      src="/assets/loco/logo.png"
      alt="LOCO Complex"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
