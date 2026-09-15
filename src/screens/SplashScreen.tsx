import { useEffect, useState } from 'react';
import { FullPokeballSVG } from '../components/PokeballSpinner';

interface Props {
  onComplete: () => void;
}

type Phase = 'spin' | 'open' | 'logo' | 'tagline' | 'done';

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('spin');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('open'),    900),
      setTimeout(() => setPhase('logo'),    1600),
      setTimeout(() => setPhase('tagline'), 2100),
      setTimeout(() => setPhase('done'),    2800),
      setTimeout(() => onComplete(),        3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #12082a 0%, #0d1020 50%, #0a0616 100%)' }}
    >
      {/* Speed lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 origin-top-left"
            style={{
              width: 1,
              height: '55%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(238,21,21,0.08) 40%, rgba(238,21,21,0.15) 70%, transparent 100%)',
              transform: `rotate(${i * 22.5}deg) translateX(-50%)`,
              opacity: phase === 'open' || phase === 'logo' || phase === 'tagline' ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
        ))}
      </div>

      {/* Outer glow ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(238,21,21,0.18) 0%, transparent 70%)',
          opacity: phase !== 'spin' ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />

      {/* Pokéball */}
      <div
        style={{
          animation: phase === 'spin' ? 'pokeball-spin 0.7s linear infinite' : undefined,
          transform: phase === 'done' ? 'scale(0.9)' : 'scale(1)',
          transition: 'transform 0.4s ease',
          filter: phase === 'open' || phase === 'logo' || phase === 'tagline'
            ? 'drop-shadow(0 0 24px rgba(255,203,5,0.5))'
            : 'none',
        }}
      >
        <FullPokeballSVG size={100} opening={phase !== 'spin'} />
      </div>

      {/* Radiate burst */}
      {phase === 'open' && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 80,
            height: 80,
            border: '3px solid rgba(255,203,5,0.8)',
            animation: 'radiate 0.8s ease-out forwards',
          }}
        />
      )}

      {/* Logo */}
      <div
        className="mt-10 text-center"
        style={{
          opacity: phase === 'logo' || phase === 'tagline' || phase === 'done' ? 1 : 0,
          transform: phase === 'logo' || phase === 'tagline' || phase === 'done' ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div
          className="text-[13px] font-bold tracking-[0.3em] uppercase mb-1"
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: '#FFCB05',
            letterSpacing: '0.35em',
          }}
        >
          {'· · ·'}
        </div>
        <h1
          className="text-4xl font-black leading-none"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          <span style={{ color: '#EE1515' }}>Pokémon</span>
          <br />
          <span style={{ color: 'white' }}>Explorer</span>
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="mt-4 text-xs tracking-[0.4em] uppercase"
        style={{
          fontFamily: "'Outfit', sans-serif",
          color: 'rgba(255,255,255,0.45)',
          opacity: phase === 'tagline' || phase === 'done' ? 1 : 0,
          transition: 'opacity 0.5s ease 0.1s',
        }}
      >
        Discover &nbsp;·&nbsp; Compare &nbsp;·&nbsp; Explore
      </p>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #EE1515, transparent)' }}
      />
    </div>
  );
}
