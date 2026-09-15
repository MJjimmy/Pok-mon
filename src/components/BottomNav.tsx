import { useApp, TabId } from '../context/AppContext';

interface Tab {
  id:    TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'explore',    label: 'Explore'    },
  { id: 'collection', label: 'Collection' },
  { id: 'compare',    label: 'Compare'    },
  { id: 'guide',      label: 'Guide'      },
];

function ExploreIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={active ? '#EE1515' : 'rgba(255,255,255,0.45)'} strokeWidth="2" fill={active ? 'rgba(238,21,21,0.15)' : 'none'} />
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke={active ? '#EE1515' : 'rgba(255,255,255,0.45)'} strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill={active ? '#EE1515' : 'rgba(255,255,255,0.45)'} stroke={active ? 'white' : 'transparent'} strokeWidth="1" />
    </svg>
  );
}

function CollectionIcon({ active }: { active: boolean }) {
  const c = active ? '#FFCB05' : 'rgba(255,255,255,0.45)';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="16" rx="2" fill={active ? 'rgba(255,203,5,0.12)' : 'none'} />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="14" y2="13" />
      <circle cx="17" cy="16" r="2" fill={c} stroke="none" />
    </svg>
  );
}

function CompareIcon({ active }: { active: boolean }) {
  const c = active ? '#6390F0' : 'rgba(255,255,255,0.45)';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="5" width="8" height="14" rx="2" fill={active ? 'rgba(99,144,240,0.15)' : 'none'} />
      <rect x="14" y="5" width="8" height="14" rx="2" fill={active ? 'rgba(99,144,240,0.15)' : 'none'} />
      <path d="M11 12h2" strokeWidth="2.5" stroke={c} />
    </svg>
  );
}

function GuideIcon({ active }: { active: boolean }) {
  const c = active ? '#7AC74C' : 'rgba(255,255,255,0.45)';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={c} strokeWidth="2" fill={active ? 'rgba(122,199,76,0.1)' : 'none'} />
      <path d="M12 2.5 L12 21.5 M2.5 12 L21.5 12" stroke={c} strokeWidth="1" opacity="0.4" />
      <path d="M12 5 L16 8 L12 11 L8 8 Z" fill={c} />
      <circle cx="12" cy="17" r="1.5" fill={c} />
    </svg>
  );
}

const ICONS = [ExploreIcon, CollectionIcon, CompareIcon, GuideIcon];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div
      className="flex-none flex"
      style={{
        background: 'linear-gradient(0deg, #0a0916 0%, #12112a 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {TABS.map((tab, i) => {
        const Icon = ICONS[i];
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200"
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon active={active} />
            <span
              className={`text-[10px] font-bold transition-colors duration-200 ${active ? 'text-white' : 'text-white/35'}`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: '#EE1515' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
