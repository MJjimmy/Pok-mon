import { useApp } from '../context/AppContext';

interface SettingRowProps {
  label:    string;
  sub?:     string;
  children: React.ReactNode;
}

function SettingRow({ label, sub, children }: SettingRowProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div>
        <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>{label}</p>
        {sub && <p className="text-white/35 text-xs mt-0.5">{sub}</p>}
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p
      className="text-white/35 text-[10px] font-bold uppercase tracking-widest px-4 pt-5 pb-2"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {title}
    </p>
  );
}

function SegmentedControl({
  options, value, onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="flex rounded-xl p-0.5 gap-0.5"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      {options.map(opt => {
        const active = value === opt;
        return (
          <button
            key={opt}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
            style={{
              fontFamily: "'Nunito', sans-serif",
              background: active ? 'rgba(238,21,21,0.8)' : 'transparent',
              color:      active ? 'white' : 'rgba(255,255,255,0.4)',
            }}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className="w-11 h-6 rounded-full relative transition-all duration-200"
      style={{ background: value ? '#EE1515' : 'rgba(255,255,255,0.15)' }}
      onClick={() => onChange(!value)}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: value ? '22px' : '2px' }}
      />
    </button>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function SettingsScreen() {
  const { goBack, theme, setTheme } = useApp();

  return (
    <div className="h-full flex flex-col bg-[#0d1020]">
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
        <h1 className="text-white text-xl font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <SettingRow label="Theme" sub="Choose your display preference">
            <SegmentedControl
              options={['System', 'Light', 'Dark']}
              value={theme.charAt(0).toUpperCase() + theme.slice(1)}
              onChange={v => setTheme(v.toLowerCase() as any)}
            />
          </SettingRow>
        </div>

        {/* Data */}
        <SectionHeader title="Data" />
        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { label: 'Search History',       sub: 'Save recent searches' },
            { label: 'Clear Cache',           sub: 'Free up local storage' },
            { label: 'Clear Search History',  sub: 'Remove past searches' },
            { label: 'Reset Collection',      sub: 'Clear favourites & caught' },
          ].map((row, i) => (
            <SettingRow key={row.label} label={row.label} sub={row.sub}>
              {i === 0
                ? <Toggle value={true} onChange={() => {}} />
                : <button
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      background: 'rgba(238,21,21,0.12)',
                      border: '1px solid rgba(238,21,21,0.25)',
                      color: '#EE1515',
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    Clear
                  </button>
              }
            </SettingRow>
          ))}
        </div>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <SettingRow label="Last Viewed Pokémon" sub="Resume where you left off">
            <Toggle value={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Notifications" sub="Pokédex updates & new Pokémon">
            <Toggle value={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Shiny Rate Display" sub="Show shiny encounter odds">
            <Toggle value={true} onChange={() => {}} />
          </SettingRow>
        </div>

        {/* About */}
        <SectionHeader title="About" />
        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <SettingRow label="Version" sub="Latest build">
            <span className="text-white/40 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>1.0.0</span>
          </SettingRow>
          <SettingRow label="Data Source" sub="Pokémon data via PokéAPI">
            <ChevronRight />
          </SettingRow>
          <SettingRow label="Privacy Policy" sub="">
            <ChevronRight />
          </SettingRow>
        </div>

        {/* Footer */}
        <div className="px-4 pt-8 pb-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-lg">⚾</span>
            <span className="text-white font-black text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Pokémon <span style={{ color: '#EE1515' }}>Explorer</span>
            </span>
          </div>
          <p className="text-white/20 text-xs leading-relaxed">
            Data provided by PokéAPI.co<br />
            Pokémon and all related names are trademarks of Nintendo / Game Freak.<br />
            This app is a fan project, not affiliated with The Pokémon Company.
          </p>
        </div>
      </div>
    </div>
  );
}
