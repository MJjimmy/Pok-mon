import { getTypeColor, getContrastColor } from '../data/typeData';

interface Props {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: Props) {
  const color = getTypeColor(type);
  const fg    = getContrastColor(color);

  const cls =
    size === 'sm' ? 'px-2 py-0.5 text-[10px]' :
    size === 'lg' ? 'px-4 py-1.5 text-sm' :
                    'px-3 py-1 text-xs';

  return (
    <span
      className={`${cls} rounded-full font-bold uppercase tracking-wider inline-block`}
      style={{
        background: color,
        color:      fg,
        fontFamily: "'Nunito', sans-serif",
        boxShadow: `0 2px 6px ${color}55`,
      }}
    >
      {type}
    </span>
  );
}
