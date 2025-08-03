import { useState } from 'react';
import './App.css';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';
import { DebugView } from './views/DebugView';

function App() {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="app">
      <div className="main-content">
        {activeView === 'home' && <HomeView />}
        {activeView === 'stats' && <StatsView />}
        {activeView === 'settings' && <SettingsView />}
        {activeView === 'debug' && <DebugView />}
      </div>

      <BottomNav activeView={activeView} onNavigate={setActiveView} />
    </div>
  );
}

export default App;
