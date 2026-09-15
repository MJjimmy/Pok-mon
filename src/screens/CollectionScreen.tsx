import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTypeColor } from '../data/typeData';
import TypeBadge from '../components/TypeBadge';
import { PokeballIcon } from '../components/PokeballSpinner';

const TOTAL_POKEMON = 1025;

type CollectionTab = 'favourites' | 'caught';

function ProgressRing({ caught, total }: { caught: number; total: number }) {
  const pct = Math.min(1, caught / total);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = circ * pct;

  return (
    <div
      className="rounded-3xl p-5 flex items-center gap-5 mx-4 mb-4"
      style={{
        background: 'linear-gradient(135deg, rgba(238,21,21,0.18) 0%, rgba(255,203,5,0.08) 100%)',
        border: '1px solid rgba(238,21,21,0.25)',
      }}
    >
      {/* Ring */}
      <div className="relative shrink-0">
        <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          {/* Top half red */}
          <circle
            cx="64" cy="64" r={r}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ - filled}`}
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EE1515" />
              <stop offset="100%" stopColor="#FFCB05" />
            </linearGradient>
          </defs>
          {/* Center pokeball lines */}
          <line x1="64" y1="16" x2="64" y2="112" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="16" y1="64" x2="112" y2="64" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="64" cy="64" r="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        </svg>
        {/* % text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-black text-lg leading-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>

      {/* Text info */}
      <div className="flex-1">
        <p className="text-white font-black text-base leading-tight mb-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Pokédex Progress
        </p>
        <p className="text-white/40 text-xs mb-3">Your Pokémon collection</p>
        <div className="flex items-end gap-1">
          <span className="text-white font-black text-2xl leading-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {caught}
          </span>
          <span className="text-white/40 text-sm mb-0.5">/ {total}</span>
        </div>
        <p className="text-white/40 text-xs mt-0.5">Pokémon caught</p>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: CollectionTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-8">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        {tab === 'favourites' ? (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
          </svg>
        ) : (
          <PokeballIcon size={36} />
        )}
      </div>
      <div>
        <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {tab === 'favourites' ? 'No Favourites Yet' : 'No Pokémon Caught'}
        </p>
        <p className="text-white/40 text-sm">
          {tab === 'favourites'
            ? "Tap the ♥ on any Pokémon to add it here."
            : "Mark Pokémon as caught from their detail page."}
        </p>
      </div>
    </div>
  );
}

export default function CollectionScreen() {
  const { navigate, favorites, caught } = useApp();
  const [activeTab, setActiveTab] = useState<CollectionTab>('favourites');

  const favIds    = Array.from(favorites);
  const caughtIds = Array.from(caught);
  const ids = activeTab === 'favourites' ? favIds : caughtIds;

  return (
    <div className="h-full flex flex-col bg-[#0d1020]">
      {/* Header */}
      <div className="flex-none px-4 pt-3 pb-3">
        <h1 className="text-white text-xl font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>
          My <span style={{ color: '#FFCB05' }}>Collection</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Progress ring */}
        <ProgressRing caught={caughtIds.length} total={TOTAL_POKEMON} />

        {/* Tabs */}
        <div
          className="flex mx-4 mb-4 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {(['favourites', 'caught'] as CollectionTab[]).map(tab => {
            const active = activeTab === tab;
            const count  = tab === 'favourites' ? favIds.length : caughtIds.length;
            return (
              <button
                key={tab}
                className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold capitalize transition-all duration-200"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: active ? (tab === 'favourites' ? 'rgba(238,21,21,0.2)' : 'rgba(255,203,5,0.15)') : 'transparent',
                  color:      active ? 'white' : 'rgba(255,255,255,0.35)',
                  borderRadius: 14,
                  margin: active ? 2 : 0,
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'favourites'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill={active ? '#EE1515' : 'none'} stroke={active ? '#EE1515' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>
                  : <PokeballIcon size={14} caught={active} />
                }
                {tab === 'favourites' ? 'Favourites' : 'Caught'}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {ids.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            {ids.map(id => (
              <CollectionCard key={id} id={id} onClick={() => navigate('detail', { id })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionCard({ id, onClick }: { id: number; onClick: () => void }) {
  const [name,  setName]  = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(d => {
        setName(d.name);
        setTypes(d.types.map((t: any) => t.type.name));
        setLoaded(true);
      });
  }, [id]);

  const color = types[0] ? getTypeColor(types[0]) : '#555';

  return (
    <button
      className="rounded-2xl overflow-hidden text-left active:scale-95 transition-transform holographic"
      style={{
        background: `linear-gradient(145deg, ${color}25 0%, ${color}10 100%)`,
        border: `1px solid ${color}30`,
      }}
      onClick={onClick}
    >
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
        alt={name}
        className="w-full aspect-square object-contain p-3"
      />
      <div className="px-3 pb-3">
        <p className="text-white/40 text-[10px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          #{String(id).padStart(3, '0')}
        </p>
        <p className="text-white font-bold text-sm capitalize mb-1.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {loaded ? name : '...'}
        </p>
        <div className="flex gap-1 flex-wrap">
          {types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </div>
      </div>
    </button>
  );
}
