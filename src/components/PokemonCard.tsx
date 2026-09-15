import { useState } from 'react';
import { getTypeColor } from '../data/typeData';
import TypeBadge from './TypeBadge';
import { PokeballIcon } from './PokeballSpinner';
import { useApp } from '../context/AppContext';
import { PokemonSummary } from '../hooks/usePokemon';

interface Props {
  pokemon:  PokemonSummary;
  onClick?: () => void;
  compact?: boolean;
}

function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function PokemonCard({ pokemon, onClick, compact = false }: Props) {
  const { favorites, caught, toggleFavorite } = useApp();
  const [imgError, setImgError] = useState(false);

  const isFav    = favorites.has(pokemon.id);
  const isCaught = caught.has(pokemon.id);
  const primary  = pokemon.types[0] ?? 'normal';
  const secondary = pokemon.types[1];
  const color    = getTypeColor(primary);
  const color2   = secondary ? getTypeColor(secondary) : color;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-200 active:scale-95 holographic`}
      style={{
        background: `linear-gradient(145deg, ${color}28 0%, ${color2}18 100%)`,
        border: `1px solid ${color}35`,
        boxShadow: isFav ? `0 0 16px ${color}40, inset 0 0 0 1px ${color}50` : undefined,
      }}
      onClick={onClick}
    >
      {/* Caught indicator */}
      {isCaught && (
        <div className="absolute top-2 left-2 z-10 opacity-80">
          <PokeballIcon size={14} caught />
        </div>
      )}

      {/* Shiny glow for favorites */}
      {isFav && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 20%, ${color}22 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Favorite button */}
      <button
        className="absolute top-2 right-2 z-10 p-0.5"
        onClick={e => { e.stopPropagation(); toggleFavorite(pokemon.id); }}
      >
        <svg
          className={`w-4 h-4 transition-all duration-200 ${isFav ? 'scale-110' : 'scale-100'}`}
          viewBox="0 0 24 24"
          fill={isFav ? '#EE1515' : 'none'}
          stroke={isFav ? '#EE1515' : 'rgba(255,255,255,0.4)'}
          strokeWidth={2}
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>

      {/* Pokédex number */}
      <div className={`${compact ? 'pt-2 px-3' : 'pt-3 px-3'}`}>
        <span
          className="text-white/35 text-[10px] font-bold"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          #{String(pokemon.id).padStart(3, '0')}
        </span>
      </div>

      {/* Artwork */}
      <div className={`${compact ? 'px-3 pb-1' : 'px-4 pb-2'}`}>
        {imgError ? (
          <div
            className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl"
            style={{ background: `${color}20` }}
          >
            ?
          </div>
        ) : (
          <img
            src={artworkUrl(pokemon.id)}
            alt={pokemon.name}
            className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Name + types */}
      <div className="px-3 pb-3">
        <p
          className="text-white font-bold text-sm capitalize leading-tight"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {pokemon.name}
        </p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {pokemon.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </div>
      </div>
    </div>
  );
}
