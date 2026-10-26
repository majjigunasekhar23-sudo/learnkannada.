interface IconProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * Line-style auto-rickshaw icon used for the flagship "Taking an auto" situation.
 */
export default function AutoIcon({ className = 'w-7 h-7', strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* roof */}
      <path d="M10 18 L16 8 H32 L38 18" />
      {/* body */}
      <path d="M6 18 H42 V30 H6 Z" />
      {/* cabin opening */}
      <path d="M16 18 L16 28 M32 18 L32 28" />
      {/* floor line */}
      <path d="M6 30 H42" />
      {/* wheels */}
      <circle cx="13" cy="35" r="4" />
      <circle cx="35" cy="35" r="4" />
    </svg>
  );
}
