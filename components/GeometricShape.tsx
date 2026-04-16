interface GeometricShapeProps {
  variant: "square" | "circle" | "asterisk";
  size?: number;
  className?: string;
}

export default function GeometricShape({
  variant,
  size = 80,
  className = "",
}: GeometricShapeProps) {
  if (variant === "square") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <rect width="80" height="80" rx="16" fill="#E23A2C" />
        <circle cx="40" cy="40" r="18" fill="white" />
      </svg>
    );
  }

  if (variant === "circle") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <circle cx="40" cy="40" r="40" fill="#E23A2C" />
        {/* 6-point asterisk */}
        <g stroke="white" strokeWidth="5" strokeLinecap="round">
          <line x1="40" y1="18" x2="40" y2="62" />
          <line x1="21" y1="29" x2="59" y2="51" />
          <line x1="21" y1="51" x2="59" y2="29" />
        </g>
      </svg>
    );
  }

  // asterisk variant
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g stroke="#E23A2C" strokeWidth="6" strokeLinecap="round">
        <line x1="40" y1="8" x2="40" y2="72" />
        <line x1="12" y1="24" x2="68" y2="56" />
        <line x1="12" y1="56" x2="68" y2="24" />
      </g>
    </svg>
  );
}
