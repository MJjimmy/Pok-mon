import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_TYPES, TYPE_COLORS, TYPE_MATCHUPS, getContrastColor } from '../data/typeData';
import TypeBadge from '../components/TypeBadge';

function TypeCard({ type, onClick }: { type: string; onClick: () => void }) {
  const color = TYPE_COLORS[type];
  const fg    = getContrastColor(color);
  return (
    <button
      className="rounded-2xl py-3 flex flex-col items-center justify-center gap-1.5 font-bold text-sm capitalize active:scale-95 transition-transform"
      style={{
        background: `linear-gradient(145deg, ${color} 0%, ${color}cc 100%)`,
        color: fg,
        boxShadow: `0 4px 12px ${color}40`,
        fontFamily: "'Nunito', sans-serif",
        border: `1px solid ${color}`,
      }}
      onClick={onClick}
    >
      <TypeIcon type={type} fg={fg} />
      {type}
    </button>
  );
}

function TypeIcon({ type, fg }: { type: string; fg: string }) {
  const icons: Record<string, string> = {
    normal: '⭐', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
    ice: '❄️', fighting: '👊', poison: '☠️', ground: '🏔️', flying: '🦅',
    psychic: '🔮', bug: '🐛', rock: '💎', ghost: '👻', dragon: '🐉',
    dark: '🌑', steel: '⚙️', fairy: '✨',
  };
  return <span className="text-xl">{icons[type] ?? '?'}</span>;
}

interface MatchupRow {
  symbol: string;
  label:  string;
  types:  string[];
  accent: string;
}

export default function TypeGuideScreen() {
  const { navigate } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const matchup = selected ? TYPE_MATCHUPS[selected] : null;
  const color   = selected ? TYPE_COLORS[selected] : '#EE1515';

  const rows: MatchupRow[] = matchup ? [
    { symbol: '⚔️', label: 'Super Effective Against', types: matchup.strongAgainst, accent: '#7AC74C' },
    { symbol: '🛡️', label: 'Not Very Effective Against', types: matchup.weakAgainst,   accent: '#EE1515' },
    { symbol: '💪', label: 'Resistant To',              types: matchup.resistantTo,    accent: '#6390F0' },
    { symbol: '🚫', label: 'Immune To',                 types: matchup.immuneTo,       accent: '#F7D02C' },
  ].filter(r => r.types.length > 0) : [];

  return (
    <div className="h-full flex flex-col bg-[#0d1020]">
      {/* Header */}
      <div className="flex-none px-4 pt-3 pb-3">
        <h1 className="text-white text-xl font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Type <span style={{ color: '#7AC74C' }}>Guide</span>
        </h1>
        <p className="text-white/40 text-xs mt-0.5">Select a type to see matchups</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Selected type detail */}
        {selected && matchup && (
          <div
            className="rounded-3xl p-4 mb-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
              border: `1px solid ${color}40`,
            }}
          >
            {/* Background glow */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: color }} />

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: color }}
              >
                <TypeIcon type={selected} fg={getContrastColor(color)} />
              </div>
              <div>
                <h2 className="text-white font-black text-lg capitalize" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {selected} Type
                </h2>
                <p className="text-white/40 text-xs">Full matchup breakdown</p>
              </div>
              <button
                className="ml-auto text-white/40 text-xs underline"
                onClick={() => setSelected(null)}
              >
                Clear
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              {rows.map(row => (
                <div key={row.label}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>{row.symbol}</span>
                    <span className="text-xs font-bold" style={{ color: row.accent, fontFamily: "'Nunito', sans-serif" }}>
                      {row.label}
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {row.types.map(t => (
                      <button key={t} onClick={() => setSelected(t)}>
                        <TypeBadge type={t} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* View Pokémon of this type */}
            <button
              className="mt-4 w-full game-btn game-btn-red py-2.5 text-sm flex items-center justify-center gap-2 relative z-10"
              onClick={() => navigate('search', { filterType: selected })}
            >
              View {selected} Pokémon →
            </button>
          </div>
        )}

        {/* Type grid */}
        <h3
          className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {selected ? 'All Types' : 'Select a type'}
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {ALL_TYPES.map(type => (
            <div
              key={type}
              className={`transition-all duration-200 ${selected === type ? 'ring-2 ring-white/60 rounded-2xl' : ''}`}
            >
              <TypeCard type={type} onClick={() => setSelected(selected === type ? null : type)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
