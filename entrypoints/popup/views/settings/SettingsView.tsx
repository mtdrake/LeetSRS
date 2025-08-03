import { useTheme } from '../../contexts/ThemeContext';

export function SettingsView() {
  const { theme, toggleTheme } = useTheme();

  const sectionStyle = {
    backgroundColor: 'var(--current-bg-secondary)',
    color: 'var(--current-text-primary)',
  };

  const inputStyle = {
    backgroundColor: 'var(--current-bg-tertiary)',
    color: 'var(--current-text-primary)',
    borderColor: 'var(--current-border)',
  };

  const buttonStyle = {
    backgroundColor: 'var(--current-bg-tertiary)',
    color: 'var(--current-text-primary)',
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--current-text-primary)' }}>Settings</h1>
        <span className="text-sm" style={{ color: 'var(--current-text-secondary)' }}>Configure your preferences</span>
      </div>

      <div className="mb-6 p-4 rounded-lg" style={sectionStyle}>
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <label>Theme</label>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-md transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--current-accent)',
              color: 'white',
            }}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg" style={sectionStyle}>
        <h3 className="text-lg font-semibold mb-4">Review Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label>Daily Review Goal</label>
            <input
              type="number"
              placeholder="10"
              className="w-20 px-2 py-1 rounded border"
              style={inputStyle}
            />
          </div>
          <div className="flex items-center justify-between">
            <label>New Cards Per Day</label>
            <input
              type="number"
              placeholder="5"
              className="w-20 px-2 py-1 rounded border"
              style={inputStyle}
            />
          </div>
          <div className="flex items-center justify-between">
            <label>Review Order</label>
            <select className="px-2 py-1 rounded border" style={inputStyle}>
              <option>Random</option>
              <option>Due Date</option>
              <option>Difficulty</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg" style={sectionStyle}>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label>Enable Daily Reminders</label>
          </div>
          <div className="flex items-center justify-between">
            <label>Reminder Time</label>
            <input type="time" className="px-2 py-1 rounded border" style={inputStyle} />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg" style={sectionStyle}>
        <h3 className="text-lg font-semibold mb-4">Data</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 rounded transition-opacity hover:opacity-80" style={buttonStyle}>
            Export Data
          </button>
          <button className="w-full px-4 py-2 rounded transition-opacity hover:opacity-80" style={buttonStyle}>
            Import Data
          </button>
          <button 
            className="w-full px-4 py-2 rounded transition-opacity hover:opacity-80 text-white"
            style={{ backgroundColor: 'var(--current-danger)' }}
          >
            Reset All Data
          </button>
        </div>
      </div>

      <div className="text-center text-sm" style={{ color: 'var(--current-text-tertiary)' }}>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
}