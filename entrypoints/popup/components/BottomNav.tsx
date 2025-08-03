import { FaHouseChimney, FaChartSimple, FaGear, FaBug } from 'react-icons/fa6';
import { Button } from 'react-aria-components';

export type ViewId = 'home' | 'stats' | 'settings' | 'debug';

interface BottomNavProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const navItems: Array<{ id: ViewId; label: string; Icon: typeof FaHouseChimney }> = [
    { id: 'home', label: 'Home', Icon: FaHouseChimney },
    { id: 'stats', label: 'Stats', Icon: FaChartSimple },
    { id: 'settings', label: 'Settings', Icon: FaGear },
    { id: 'debug', label: 'Debug', Icon: FaBug },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 border-t flex justify-around items-center z-[1000] bg-secondary border-current">
      {navItems.map((item) => (
        <Button
          key={item.id}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-2 transition-colors duration-200 hover:text-primary ${
            activeView === item.id ? 'text-accent' : 'text-secondary'
          }`}
          onPress={() => onNavigate(item.id)}
          aria-label={item.label}
          aria-current={activeView === item.id ? 'page' : undefined}
        >
          <item.Icon className="text-lg" />
          <span className="text-[11px]">{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}
