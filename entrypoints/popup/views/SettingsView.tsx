export function SettingsView() {
  return (
    <div className="settings-view">
      <div className="view-header">
        <h1>Settings</h1>
        <span className="subtitle">Configure your preferences</span>
      </div>

      <div className="settings-section">
        <h3>Review Settings</h3>
        <div className="setting-item">
          <label>Daily Review Goal</label>
          <input type="number" placeholder="10" />
        </div>
        <div className="setting-item">
          <label>New Cards Per Day</label>
          <input type="number" placeholder="5" />
        </div>
        <div className="setting-item">
          <label>Review Order</label>
          <select>
            <option>Random</option>
            <option>Due Date</option>
            <option>Difficulty</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            Enable Daily Reminders
          </label>
        </div>
        <div className="setting-item">
          <label>Reminder Time</label>
          <input type="time" />
        </div>
      </div>

      <div className="settings-section">
        <h3>Data</h3>
        <button className="settings-button">Export Data</button>
        <button className="settings-button">Import Data</button>
        <button className="settings-button danger">Reset All Data</button>
      </div>

      <div className="settings-footer">
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
}
