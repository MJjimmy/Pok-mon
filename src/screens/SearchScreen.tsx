import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSearchPokemon } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import PokeballSpinner, { PokeballIcon } from '../components/PokeballSpinner';

export default function SearchScreen() {
  const { goBack, navigate } = useApp();
  const [query, setQuery] = useState('');
  const { results, loading, searched } = useSearchPokemon(query);

  return (
    <div className="h-full flex flex-col bg-[#0d1020]">
      {/* Header */}
      <div
        className="flex-none px-4 pt-3 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            onClick={goBack}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontFamily: "'Outfit', sans-serif",
              }}
              placeholder="Search by name or Pokédex #"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {results.length > 0 && (
          <p className="text-white/40 text-xs pl-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {results.length} Pokémon found
          </p>
        )}
      </div>

      {/* Results / states */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <PokeballSpinner size={48} />
            <p className="text-white/40 text-sm">Searching...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <PokeballIcon size={36} />
            </div>
            <div>
              <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                No Pokémon Found
              </p>
              <p className="text-white/40 text-sm mb-4">
                Try searching by exact name<br />or Pokédex number
              </p>
              <button
                className="game-btn game-btn-red px-5 py-2 text-sm"
                onClick={() => setQuery('')}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {!loading && !searched && query.length === 0 && (
          <div className="py-8">
            <p className="text-white/30 text-xs text-center mb-6 tracking-widest uppercase">Popular searches</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['pikachu', 'charizard', 'mewtwo', 'eevee', 'gengar', 'lucario', 'garchomp', 'dragonite'].map(name => (
                <button
                  key={name}
                  className="px-4 py-2 rounded-full text-sm capitalize"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                  onClick={() => setQuery(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {results.map(p => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                onClick={() => navigate('detail', { id: p.id })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
