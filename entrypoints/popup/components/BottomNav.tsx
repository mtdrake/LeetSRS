interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'debug', label: 'Debug', icon: '🐛' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 border-t flex justify-around items-center z-[1000] bg-secondary border-current">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-2 transition-colors duration-200 hover:text-primary ${
            activeView === item.id ? 'text-accent' : 'text-secondary'
          }`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="text-[20px]">{item.icon}</span>
          <span className="text-[11px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
