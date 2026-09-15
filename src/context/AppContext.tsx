import { createContext, useContext, useState, ReactNode } from 'react';

export type TabId = 'explore' | 'collection' | 'compare' | 'guide';

export interface NavFrame {
  screen: string;
  params?: Record<string, unknown>;
}

export interface AppContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  currentFrame: NavFrame;
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
  canGoBack: boolean;
  favorites: Set<number>;
  caught: Set<number>;
  toggleFavorite: (id: number) => void;
  toggleCaught: (id: number) => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (t: 'dark' | 'light' | 'system') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabId>('explore');
  const [stacks, setStacks] = useState<Record<TabId, NavFrame[]>>({
    explore:    [{ screen: 'home' }],
    collection: [{ screen: 'collection' }],
    compare:    [{ screen: 'compare' }],
    guide:      [{ screen: 'typeGuide' }],
  });
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set([25, 1, 6])
  );
  const [caught, setCaught] = useState<Set<number>>(
    new Set([25, 1, 6, 7, 4, 5, 152, 249, 250, 384, 143, 59, 130, 131, 9, 3, 65, 68, 76, 94, 149])
  );
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const stack = stacks[activeTab];
  const currentFrame = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const navigate = (screen: string, params?: Record<string, unknown>) => {
    setStacks(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { screen, params }],
    }));
  };

  const goBack = () => {
    setStacks(prev => {
      const s = prev[activeTab];
      if (s.length <= 1) return prev;
      return { ...prev, [activeTab]: s.slice(0, -1) };
    });
  };

  const setActiveTab = (tab: TabId) => {
    setActiveTabState(tab);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleCaught = (id: number) => {
    setCaught(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      currentFrame, navigate, goBack, canGoBack,
      favorites, caught, toggleFavorite, toggleCaught,
      theme, setTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
