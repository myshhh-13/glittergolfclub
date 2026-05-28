export default function Brand({ color = "var(--c-forest)", size = 44, withText = false, textColor }) {
  const stroke = color;
  return (
    <span className="brand" style={{ "--brand-color": color, "--brand-text": textColor || color }}>
      <svg
        className="brand__shield"
        width={size}
        height={size * (56 / 48)}
        viewBox="0 0 48 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shield outline */}
        <path
          d="M4 6 Q4 4 6 4 L24 1 L42 4 Q44 4 44 6 L44 32 Q44 38 36 46 L24 55 L12 46 Q4 38 4 32 Z"
          stroke={stroke}
          strokeWidth="1.6"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Crossed clubs - shaft + head */}
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none">
          <line x1="11" y1="9" x2="32" y2="40" />
          <path d="M30 38 Q34 41 32 44 Q29 45 28 42 Z" fill={stroke} stroke="none" />
          <line x1="37" y1="9" x2="16" y2="40" />
          <path d="M18 38 Q14 41 16 44 Q19 45 20 42 Z" fill={stroke} stroke="none" />
        </g>
        {/* G monogram in the middle */}
        <text
          x="24"
          y="33"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="20"
          fontWeight="600"
          fill={stroke}
        >
          G
        </text>
      </svg>
      {withText && (
        <span className="brand__name">
          <strong>Glitter Golf Club</strong>
          <span>с 2025 года</span>
        </span>
      )}
    </span>
  );
}
