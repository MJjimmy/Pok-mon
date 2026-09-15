import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import DetailScreen from './screens/DetailScreen';
import CompareScreen from './screens/CompareScreen';
import CollectionScreen from './screens/CollectionScreen';
import TypeGuideScreen from './screens/TypeGuideScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

function StatusBar() {
  return (
    <div
      className="flex-none flex items-center justify-between px-5 pt-3 pb-1"
      style={{ height: 36 }}
    >
      <span
        className="text-white text-xs font-bold"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}
      >
        9:41
      </span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <div className="flex items-end gap-0.5 h-3">
          {[3, 5, 7, 9].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-sm"
              style={{ height: h, background: i < 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>
        {/* WiFi */}
        <svg width="14" height="10" viewBox="0 0 20 14" fill="none">
          <path d="M10 12h.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M5.7 8.5a6 6 0 018.6 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 5a11 11 0 0116 0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div
            className="rounded-sm overflow-hidden"
            style={{ width: 22, height: 11, border: '1.5px solid rgba(255,255,255,0.6)', padding: 1.5 }}
          >
            <div className="h-full rounded-[1px]" style={{ width: '80%', background: '#7AC74C' }} />
          </div>
          <div className="rounded-r-sm" style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </div>
    </div>
  );
}

const HIDDEN_NAV = new Set(['settings', 'detail', 'search']);

function AppShell() {
  const { currentFrame } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const showNav = !showSplash && !HIDDEN_NAV.has(currentFrame.screen);

  const Screen = () => {
    if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

    switch (currentFrame.screen) {
      case 'home':       return <HomeScreen />;
      case 'search':     return <SearchScreen />;
      case 'detail':     return <DetailScreen params={currentFrame.params as { id: number }} />;
      case 'compare':    return <CompareScreen params={currentFrame.params as { idA?: number }} />;
      case 'collection': return <CollectionScreen />;
      case 'typeGuide':  return <TypeGuideScreen />;
      case 'settings':   return <SettingsScreen />;
      default:           return <HomeScreen />;
    }
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: '#0d1020', fontFamily: "'Outfit', sans-serif" }}
    >
      {!showSplash && <StatusBar />}

      <div className="flex-1 overflow-hidden">
        <Screen />
      </div>

      {showNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 40% 20%, #180830 0%, #0a0818 40%, #06060f 100%)',
        padding: '32px 16px',
      }}
    >
      {/* Phone frame */}
      <div className="relative select-none" style={{ width: 390, height: 844 }}>
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-[44px] pointer-events-none"
          style={{ boxShadow: '0 0 80px rgba(238,21,21,0.12), 0 40px 80px rgba(0,0,0,0.7)', borderRadius: 44 }}
        />

        {/* Phone body */}
        <div
          className="absolute inset-0 rounded-[44px] overflow-hidden"
          style={{
            background: '#0d1020',
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.12)',
              'inset 0 0 0 1px rgba(255,255,255,0.05)',
              '0 2px 4px rgba(0,0,0,0.6)',
            ].join(', '),
          }}
        >
          <AppProvider>
            <AppShell />
          </AppProvider>
        </div>

        {/* Dynamic island / notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          style={{
            width: 120,
            height: 34,
            background: '#000',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />

        {/* Side buttons (decorative) */}
        <div className="absolute -left-1 top-28 w-1.5 h-8 rounded-l-sm" style={{ background: '#1e1e2e' }} />
        <div className="absolute -left-1 top-40 w-1.5 h-14 rounded-l-sm" style={{ background: '#1e1e2e' }} />
        <div className="absolute -left-1 top-56 w-1.5 h-14 rounded-l-sm" style={{ background: '#1e1e2e' }} />
        <div className="absolute -right-1 top-36 w-1.5 h-20 rounded-r-sm" style={{ background: '#1e1e2e' }} />

        {/* Bottom indicator bar */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"
          style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.2)' }}
        />
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div
          className="absolute rounded-full opacity-[0.04]"
          style={{ width: 600, height: 600, top: -100, right: -100, background: '#EE1515' }}
        />
        <div
          className="absolute rounded-full opacity-[0.03]"
          style={{ width: 400, height: 400, bottom: -80, left: -80, background: '#FFCB05' }}
        />
      </div>
    </div>
  );
}
