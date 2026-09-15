import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { usePokemonList, usePokemonDetail } from '../hooks/usePokemon';
import { getTypeColor } from '../data/typeData';
import TypeBadge from '../components/TypeBadge';
import PokemonCard from '../components/PokemonCard';
import SkeletonCard from '../components/SkeletonCard';
import PokeballSpinner, { PokeballIcon } from '../components/PokeballSpinner';

const FEATURED_ID = 25; // Pikachu

const TYPE_FILTERS = ['All', 'fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'ghost', 'fairy'];

export default function HomeScreen() {
  const { navigate } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { data: featured, loading: featuredLoading } = usePokemonDetail(FEATURED_ID);
  const { items, loading: listLoading } = usePokemonList(20, 0);

  const handleRandomDiscovery = useCallback(() => {
    const id = Math.floor(Math.random() * 898) + 1;
    navigate('detail', { id });
  }, [navigate]);

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(p => p.types.includes(activeFilter));

  const featuredColor  = featured?.types[0] ? getTypeColor(featured.types[0]) : '#EE1515';
  const featuredColor2 = featured?.types[1] ? getTypeColor(featured.types[1]) : featuredColor;

  return (
    <div className="h-full overflow-y-auto bg-[#0d1020] flex flex-col">
      {/* App bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-none">
        <div>
          <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: "'Nunito', sans-serif" }}>Welcome back</p>
          <h1 className="text-white text-xl font-black leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Pokémon <span style={{ color: '#EE1515' }}>Explorer</span>
          </h1>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          onClick={() => navigate('settings')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-4 flex-none">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          onClick={() => navigate('search')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-white/35 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Search Pokémon by name or #</span>
          <div className="ml-auto">
            <PokeballIcon size={20} />
          </div>
        </button>
      </div>

      {/* Featured card */}
      <div className="px-4 mb-4 flex-none">
        {featuredLoading ? (
          <div className="h-44 rounded-3xl skeleton" />
        ) : featured ? (
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${featuredColor}55 0%, ${featuredColor2}30 60%, #1a1030 100%)`,
              border: `1px solid ${featuredColor}40`,
              boxShadow: `0 8px 32px ${featuredColor}30`,
            }}
          >
            {/* BG circles */}
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20" style={{ background: featuredColor }} />
            <div className="absolute right-8 bottom-0 w-24 h-24 rounded-full opacity-10" style={{ background: featuredColor2 }} />

            <div className="flex items-end p-4 gap-3 relative z-10">
              {/* Text side */}
              <div className="flex-1 pb-2">
                <p className="text-white/50 text-xs font-bold mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  #{String(featured.id).padStart(3, '0')} · Featured
                </p>
                <h2 className="text-white text-2xl font-black capitalize leading-tight mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {featured.name}
                </h2>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {featured.types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
                {featured.flavorText && (
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-3">
                    {featured.flavorText}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    className="game-btn game-btn-red px-4 py-2 text-sm"
                    onClick={() => navigate('detail', { id: featured.id })}
                  >
                    View Details
                  </button>
                  <button
                    className="game-btn game-btn-yellow px-3 py-2 flex items-center gap-2 text-sm"
                    onClick={handleRandomDiscovery}
                  >
                    <PokeballIcon size={16} />
                    Random
                  </button>
                </div>
              </div>

              {/* Artwork */}
              <div className="w-32 shrink-0">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${featured.id}.png`}
                  alt={featured.name}
                  className="w-full h-32 object-contain animate-float drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Filter chips */}
      <div className="px-4 mb-3 flex-none">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TYPE_FILTERS.map(f => {
            const active = activeFilter === f;
            const color  = f === 'All' ? '#FFCB05' : getTypeColor(f);
            return (
              <button
                key={f}
                className="flex-none px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all duration-200"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background:  active ? color : 'rgba(255,255,255,0.08)',
                  color:       active ? (f === 'All' ? '#1a1200' : 'white') : 'rgba(255,255,255,0.5)',
                  border:      `1px solid ${active ? color : 'transparent'}`,
                  boxShadow:   active ? `0 2px 8px ${color}50` : 'none',
                }}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'All' ? '✦ All' : f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section header */}
      <div className="px-4 mb-3 flex items-center justify-between flex-none">
        <h2 className="text-white font-black text-base" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {activeFilter === 'All' ? 'All Pokémon' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Type`}
          <span className="text-white/30 text-sm font-semibold ml-2">
            {listLoading ? '...' : filtered.length}
          </span>
        </h2>
        <button className="text-white/40 text-xs" onClick={() => navigate('search')}>See all →</button>
      </div>

      {/* Grid */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3 flex-none">
        {listLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map(p => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              onClick={() => navigate('detail', { id: p.id })}
            />
          ))
        }
      </div>
    </div>
  );
}
