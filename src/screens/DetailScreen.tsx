import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePokemonDetail } from '../hooks/usePokemon';
import { getTypeColor } from '../data/typeData';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import PokeballSpinner, { PokeballIcon } from '../components/PokeballSpinner';
import { SkeletonDetail } from '../components/SkeletonCard';

interface Props {
  params: { id: number };
}

function capitalize(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function DetailScreen({ params }: Props) {
  const { goBack, navigate, favorites, caught, toggleFavorite, toggleCaught } = useApp();
  const { data, loading, error } = usePokemonDetail(params?.id ?? null);
  const [shiny, setShiny] = useState(false);
  const [favAnim, setFavAnim] = useState(false);
  const [catchAnim, setCatchAnim] = useState(false);

  const isFav    = data ? favorites.has(data.id) : false;
  const isCaught = data ? caught.has(data.id)    : false;

  const handleFav = () => {
    if (!data) return;
    toggleFavorite(data.id);
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 400);
  };
  const handleCatch = () => {
    if (!data) return;
    toggleCaught(data.id);
    setCatchAnim(true);
    setTimeout(() => setCatchAnim(false), 400);
  };

  const primaryColor  = data?.types[0] ? getTypeColor(data.types[0]) : '#EE1515';
  const secondaryColor = data?.types[1] ? getTypeColor(data.types[1]) : primaryColor;
  const artUrl = data
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shiny ? 'shiny/' : ''}${data.id}.png`
    : null;

  const totalStats = data?.stats.reduce((sum, s) => sum + s.value, 0) ?? 0;

  return (
    <div className="h-full flex flex-col bg-[#0d1020] overflow-hidden">
      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4 pt-3 pb-2 z-10">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          onClick={goBack}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${favAnim ? 'animate-pop' : ''}`}
            style={{ background: 'rgba(255,255,255,0.08)' }}
            onClick={handleFav}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill={isFav ? '#EE1515' : 'none'}
              stroke={isFav ? '#EE1515' : 'rgba(255,255,255,0.7)'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          {/* Compare */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            onClick={() => data && navigate('compare', { idA: data.id })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
              <path d="M18 4l4 4-4 4M6 20l-4-4 4-4M14 8H2M22 16H10" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && <SkeletonDetail />}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 px-8 text-center">
            <PokeballSpinner size={48} />
            <p className="text-white font-bold text-lg" style={{ fontFamily: "'Nunito', sans-serif" }}>Pokémon info unavailable</p>
            <p className="text-white/40 text-sm">Tap back and try again</p>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Hero gradient panel */}
            <div
              className="relative mx-4 rounded-3xl overflow-hidden mb-4"
              style={{
                background: `linear-gradient(160deg, ${primaryColor}55 0%, ${secondaryColor}30 60%, #1a1030 100%)`,
                border: `1px solid ${primaryColor}40`,
              }}
            >
              {/* BG circles */}
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: primaryColor }} />
              <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: secondaryColor }} />

              {/* Pokédex number */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-white/35 text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  #{String(data.id).padStart(3, '0')}
                </span>
              </div>

              {/* Artwork */}
              <div className="flex justify-center pt-6 pb-2 relative z-10">
                <img
                  src={artUrl!}
                  alt={data.name}
                  key={artUrl}
                  className="w-44 h-44 object-contain drop-shadow-xl animate-float"
                  style={{
                    filter: shiny ? 'drop-shadow(0 0 16px rgba(255,215,0,0.7))' : `drop-shadow(0 8px 16px ${primaryColor}60)`,
                  }}
                />
              </div>

              {/* Name + types */}
              <div className="text-center pb-3 relative z-10 px-4">
                <h1 className="text-white text-2xl font-black capitalize mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {data.name}
                </h1>
                <div className="flex justify-center gap-2 mb-3">
                  {data.types.map(t => <TypeBadge key={t} type={t} size="lg" />)}
                </div>

                {/* Normal / Shiny toggle */}
                <div
                  className="inline-flex rounded-full p-0.5 mx-auto"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {['Normal', 'Shiny'].map((label, i) => {
                    const active = shiny === (i === 1);
                    return (
                      <button
                        key={label}
                        className="px-4 py-1 rounded-full text-xs font-bold transition-all duration-200"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          background: active ? (i === 1 ? '#FFCB05' : primaryColor) : 'transparent',
                          color:      active ? (i === 1 ? '#1a1200' : 'white') : 'rgba(255,255,255,0.4)',
                        }}
                        onClick={() => setShiny(i === 1)}
                      >
                        {label} {i === 1 && '✦'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Physical info */}
            <div className="grid grid-cols-2 gap-3 px-4 mb-4">
              {[
                { label: 'Height', value: `${(data.height / 10).toFixed(1)} m`, icon: '↕' },
                { label: 'Weight', value: `${(data.weight / 10).toFixed(1)} kg`, icon: '⚖' },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="rounded-2xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-white font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <div className="px-4 mb-4">
              <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Abilities
              </h3>
              <div className="flex gap-2 flex-wrap">
                {data.abilities.map(a => (
                  <span
                    key={a.name}
                    className="px-3 py-1.5 rounded-xl text-sm font-semibold capitalize"
                    style={{
                      background:  a.isHidden ? 'rgba(255,203,5,0.12)' : 'rgba(255,255,255,0.07)',
                      border:      `1px solid ${a.isHidden ? 'rgba(255,203,5,0.3)' : 'rgba(255,255,255,0.10)'}`,
                      color:       a.isHidden ? '#FFCB05' : 'white',
                      fontFamily:  "'Outfit', sans-serif",
                    }}
                  >
                    {capitalize(a.name)} {a.isHidden && '(Hidden)'}
                  </span>
                ))}
              </div>
            </div>

            {/* Base stats */}
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  Base Stats
                </h3>
                <span className="text-white font-black text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="text-white/40 text-xs font-normal mr-1">Total</span>
                  {totalStats}
                </span>
              </div>
              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {data.stats.map((s, i) => (
                  <StatBar key={s.name} name={s.name} value={s.value} delay={i * 80} />
                ))}
              </div>
            </div>

            {/* Moves */}
            <div className="px-4 mb-4">
              <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Moves
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.moves.map(m => (
                  <span
                    key={m}
                    className="px-3 py-1 rounded-full text-xs capitalize"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.6)',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {capitalize(m)}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-6 grid grid-cols-3 gap-2.5">
              <button
                className={`game-btn py-3 flex flex-col items-center gap-1 text-xs ${isFav ? 'game-btn-red' : 'game-btn-outline'} ${favAnim ? 'animate-pop' : ''}`}
                onClick={handleFav}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'white' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                </svg>
                <span style={{ fontFamily: "'Nunito', sans-serif" }}>{isFav ? 'Saved' : 'Favourite'}</span>
              </button>

              <button
                className={`game-btn py-3 flex flex-col items-center gap-1 text-xs ${isCaught ? 'game-btn-yellow' : 'game-btn-outline'} ${catchAnim ? 'animate-pop' : ''}`}
                onClick={handleCatch}
              >
                <PokeballIcon size={18} caught={isCaught} />
                <span style={{ fontFamily: "'Nunito', sans-serif" }}>{isCaught ? 'Caught!' : 'Catch'}</span>
              </button>

              <button
                className="game-btn game-btn-outline py-3 flex flex-col items-center gap-1 text-xs"
                onClick={() => navigate('compare', { idA: data.id })}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 4l4 4-4 4M6 20l-4-4 4-4M14 8H2M22 16H10" />
                </svg>
                <span style={{ fontFamily: "'Nunito', sans-serif" }}>Compare</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
