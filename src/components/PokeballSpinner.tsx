interface Props {
  size?: number;
  className?: string;
}

export default function PokeballSpinner({ size = 48, className = '' }: Props) {
  return (
    <div
      className={`animate-pokeball-spin ${className}`}
      style={{ width: size, height: size }}
    >
      <PokeballIcon size={size} />
    </div>
  );
}

export function PokeballIcon({ size = 24, filled = false, caught = false }: {
  size?: number;
  filled?: boolean;
  caught?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={caught ? '#EE1515' : filled ? '#EE1515' : 'transparent'} stroke="white" strokeWidth="1.5" />
      {!caught && <path d="M2.5 12h19" stroke="white" strokeWidth="1.5" />}
      {caught
        ? <circle cx="12" cy="12" r="3.5" fill="white" />
        : <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill={filled ? 'white' : 'transparent'} />
      }
    </svg>
  );
}

export function FullPokeballSVG({ size = 80, opening = false }: { size?: number; opening?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <clipPath id="circle-clip">
        <circle cx="50" cy="50" r="48" />
      </clipPath>
      <g clipPath="url(#circle-clip)">
        <rect x="2" y="2" width="96" height="48" fill="#EE1515" />
        <rect x="2" y="50" width="96" height="48" fill="white" />
        <rect x="2" y="44" width="96" height="12" fill="#1a1020" />
      </g>
      <circle cx="50" cy="50" r="48" stroke="#1a1020" strokeWidth="4" fill="none" />
      <circle cx="50" cy="50" r="16" fill="white" stroke="#1a1020" strokeWidth="4" />
      <circle cx="50" cy="50" r="8" fill={opening ? '#FFCB05' : '#f0f0f0'} />
    </svg>
  );
}
