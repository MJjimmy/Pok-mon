import { useState, useEffect } from 'react';

export interface PokemonSummary {
  id:    number;
  name:  string;
  types: string[];
}

export interface PokemonDetail extends PokemonSummary {
  height:    number;
  weight:    number;
  abilities: { name: string; isHidden: boolean }[];
  stats:     { name: string; value: number }[];
  moves:     string[];
  sprites:   { default: string | null; shiny: string | null };
  flavorText?: string;
}

const BASE = 'https://pokeapi.co/api/v2';
const cache = new Map<string, unknown>();

async function get<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

function extractId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1]);
}

function mapPokemon(d: any): PokemonSummary {
  return {
    id:    d.id,
    name:  d.name,
    types: d.types.map((t: any) => t.type.name),
  };
}

export function usePokemonList(limit = 20, offset = 0) {
  const [items, setItems]   = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    get<any>(`${BASE}/pokemon?limit=${limit}&offset=${offset}`)
      .then(async list => {
        const ids: { id: number; name: string }[] = list.results.map((p: any) => ({
          id:   extractId(p.url),
          name: p.name,
        }));
        setItems(ids.map(p => ({ ...p, types: [] })));

        const details = await Promise.all(
          ids.map(({ id }) => get<any>(`${BASE}/pokemon/${id}`))
        );
        setItems(details.map(mapPokemon));
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [limit, offset]);

  return { items, loading, error };
}

export function usePokemonDetail(id: number | null) {
  const [data, setData]       = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setData(null);

    Promise.all([
      get<any>(`${BASE}/pokemon/${id}`),
      get<any>(`${BASE}/pokemon-species/${id}`).catch(() => null),
    ])
      .then(([p, species]) => {
        const flavorEntry = species?.flavor_text_entries?.find(
          (e: any) => e.language.name === 'en'
        );
        setData({
          id:    p.id,
          name:  p.name,
          types: p.types.map((t: any) => t.type.name),
          height: p.height,
          weight: p.weight,
          abilities: p.abilities.map((a: any) => ({
            name:     a.ability.name,
            isHidden: a.is_hidden,
          })),
          stats: p.stats.map((s: any) => ({
            name:  s.stat.name,
            value: s.base_stat,
          })),
          moves: p.moves.slice(0, 10).map((m: any) => m.move.name),
          sprites: {
            default: p.sprites.other?.['official-artwork']?.front_default ?? null,
            shiny:   p.sprites.other?.['official-artwork']?.front_shiny   ?? null,
          },
          flavorText: flavorEntry?.flavor_text?.replace(/\f|\n/g, ' '),
        });
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  return { data, loading, error };
}

export function useSearchPokemon(query: string) {
  const [results, setResults] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setSearched(false); return; }

    setLoading(true);
    setSearched(false);

    const timer = setTimeout(() => {
      get<any>(`${BASE}/pokemon/${q}`)
        .then(d => {
          setResults([mapPokemon(d)]);
          setLoading(false);
          setSearched(true);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
          setSearched(true);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, searched };
}
