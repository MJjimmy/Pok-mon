import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { usePokemonDetail } from '../hooks/usePokemon';
import { getTypeColor, STAT_LABELS } from '../data/typeData';
import TypeBadge from '../components/TypeBadge';
import PokeballSpinner from '../components/PokeballSpinner';

interface Props {
  params?: { idA?: number };
}

const DEFAULT_A = 25;  // Pikachu
const DEFAULT_B = 6;   // Charizard

function statColor(v: number): string {
  if (v >= 100) return '#7AC74C';
  if (v >= 70)  return '#F7D02C';
  if (v >= 45)  return '#EE8130';
  return '#EE1515';
}

function PokemonPicker({
  label, id, onPick,
}: { label: string; id: number; onPick: (id: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [input,   setInput]   = useState('');

  const submit = () => {
    const n = parseInt(input.trim());
    if (n > 0 && n <= 1025) { onPick(n); setEditing(false); setInput(''); }
  };

  if (editing) {
    return (
      <div className="flex gap-2 items-center">
        <input
          autoFocus
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm outline-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          placeholder="Name or #"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setEditing(false); }}
        />
        <button className="game-btn game-btn-red px-3 py-2 text-xs" onClick={submit}>Go</button>
        <button className="text-white/40 text-xs" onClick={() => setEditing(false)}>✕</button>
      </div>
    );
  }
  return (
    <button
      className="flex items-center gap-2 text-white/50 text-xs underline underline-offset-2"
      style={{ fontFamily: "'Nunito', sans-serif" }}
      onClick={() => setEditing(true)}
    >
      Change {label}
    </button>
  );
}

function PokemonHalf({
  id, side,
}: { id: number; side: 'left' | 'right' }) {
  const { data, loading } = usePokemonDetail(id);
  const primaryColor = data?.types[0] ? getTypeColor(data.types[0]) : '#555';

  return (
    <div
      className="flex flex-col items-center justify-end pb-4 px-3 relative overflow-hidden"
      style={{
        background: data
          ? `linear-gradient(${side === 'left' ? '135deg' : '225deg'}, ${primaryColor}60 0%, ${primaryColor}25 50%, transparent 100%)`
          : 'rgba(255,255,255,0.03)',
        flex: 1,
        minHeight: 180,
      }}
    >
      {loading && <PokeballSpinner size={36} className="mb-4" />}
      {data && (
        <>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
            alt={data.name}
            className="w-28 h-28 object-contain drop-shadow-lg animate-float mb-2"
            style={{ filter: `drop-shadow(0 4px 12px ${primaryColor}60)` }}
          />
          <p className="text-white/40 text-[10px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            #{String(data.id).padStart(3, '0')}
          </p>
          <p className="text-white font-black text-sm capitalize mb-1.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {data.name}
          </p>
          <div className="flex gap-1 flex-wrap justify-center">
            {data.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function CompareScreen({ params }: Props) {
  const { goBack } = useApp();
  const [idA, setIdA] = useState(params?.idA ?? DEFAULT_A);
  const [idB, setIdB] = useState(DEFAULT_B);

  const { data: pA } = usePokemonDetail(idA);
  const { data: pB } = usePokemonDetail(idB);

  const statNames = pA?.stats.map(s => s.name) ?? [];
  const colorA = pA?.types[0] ? getTypeColor(pA.types[0]) : '#EE1515';
  const colorB = pB?.types[0] ? getTypeColor(pB.types[0]) : '#6390F0';

  const totalA = pA?.stats.reduce((s, x) => s + x.value, 0) ?? 0;
  const totalB = pB?.stats.reduce((s, x) => s + x.value, 0) ?? 0;

  // update idA when params change
  useEffect(() => {
    if (params?.idA) setIdA(params.idA);
  }, [params?.idA]);

  return (
    <div className="h-full flex flex-col bg-[#0d1020] overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center gap-3 px-4 pt-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          onClick={goBack}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-white font-black text-lg" style={{ fontFamily: "'Nunito', sans-serif" }}>Compare Pokémon</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* VS Arena */}
        <div className="relative flex" style={{ borderBottom: '2px solid #1a1030' }}>
          <PokemonHalf id={idA} side="left" />

          {/* VS divider */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center z-10"
            style={{ width: 48 }}
          >
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)', left: '50%' }}
            />
            <div
              className="relative rounded-full w-11 h-11 flex items-center justify-center font-black text-sm"
              style={{
                background: 'linear-gradient(135deg, #EE1515, #6390F0)',
                boxShadow: '0 0 20px rgba(238,21,21,0.5), 0 0 20px rgba(99,144,240,0.5)',
                fontFamily: "'Nunito', sans-serif",
                color: 'white',
              }}
            >
              VS
            </div>
          </div>

          <PokemonHalf id={idB} side="right" />
        </div>

        {/* Picker row */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-3 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <PokemonPicker label="A" id={idA} onPick={setIdA} />
          <PokemonPicker label="B" id={idB} onPick={setIdB} />
        </div>

        {/* Stat comparison */}
        {pA && pB && (
          <div className="px-4 py-4">
            <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Stat Comparison
            </h2>
            <div className="space-y-3">
              {statNames.map(name => {
                const valA = pA.stats.find(s => s.name === name)?.value ?? 0;
                const valB = pB.stats.find(s => s.name === name)?.value ?? 0;
                const max  = Math.max(valA, valB, 1);
                const aWins = valA >= valB;
                return (
                  <div key={name} className="flex items-center gap-2">
                    {/* Bar A */}
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <span
                        className={`text-xs font-bold ${aWins ? 'text-white' : 'text-white/35'}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace", width: 28, textAlign: 'right' }}
                      >
                        {valA}
                      </span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/10 flex justify-end">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(valA / 255) * 100}%`,
                            background: aWins ? colorA : `${colorA}60`,
                            boxShadow: aWins ? `0 0 6px ${colorA}80` : 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Stat label */}
                    <span
                      className="text-white/40 text-[10px] font-bold shrink-0"
                      style={{ width: 44, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {STAT_LABELS[name] ?? name}
                    </span>

                    {/* Bar B */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(valB / 255) * 100}%`,
                            background: !aWins ? colorB : `${colorB}60`,
                            boxShadow: !aWins ? `0 0 6px ${colorB}80` : 'none',
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold ${!aWins ? 'text-white' : 'text-white/35'}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace", width: 28 }}
                      >
                        {valB}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div
                className="flex items-center justify-between pt-3 mt-1"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-center flex-1">
                  <p
                    className="text-white font-black text-xl"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: totalA >= totalB ? colorA : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {totalA}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">Total</p>
                </div>
                <div
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  BASE STAT TOTAL
                </div>
                <div className="text-center flex-1">
                  <p
                    className="text-white font-black text-xl"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: totalB >= totalA ? colorB : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {totalB}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">Total</p>
                </div>
              </div>

              {/* Total bar */}
              <div className="flex gap-2 items-center">
                <div className="flex-1 h-3 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full rounded-l-full transition-all duration-700"
                    style={{
                      width: `${(totalA / (totalA + totalB)) * 100}%`,
                      background: `linear-gradient(90deg, ${colorA}, ${colorA}cc)`,
                    }}
                  />
                </div>
                <div className="flex-1 h-3 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full rounded-r-full transition-all duration-700 ml-auto"
                    style={{
                      width: `${(totalB / (totalA + totalB)) * 100}%`,
                      background: `linear-gradient(90deg, ${colorB}cc, ${colorB})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
