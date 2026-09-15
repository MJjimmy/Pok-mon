import { useEffect, useState } from 'react';
import { STAT_LABELS } from '../data/typeData';

interface Props {
  name:  string;
  value: number;
  max?:  number;
  delay?: number;
}

function statColor(v: number): string {
  if (v >= 100) return '#7AC74C';
  if (v >= 70)  return '#F7D02C';
  if (v >= 45)  return '#EE8130';
  return '#EE1515';
}

export default function StatBar({ name, value, max = 255, delay = 0 }: Props) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.round((value / max) * 100));
  const label = STAT_LABELS[name] ?? name.toUpperCase();
  const color = statColor(value);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-white/40 text-xs shrink-0 text-right"
        style={{ width: 52, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </span>
      <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color, boxShadow: `0 0 6px ${color}80` }}
        />
      </div>
      <span
        className="text-white text-sm font-bold shrink-0"
        style={{ width: 32, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value}
      </span>
    </div>
  );
}
