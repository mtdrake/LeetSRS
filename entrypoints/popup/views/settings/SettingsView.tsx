import { Button, TextField, Label, Input } from 'react-aria-components';
import { ViewLayout } from '../../components/ViewLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { bounceButton } from '@/shared/styles';

export function SettingsView() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ViewLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-secondary text-primary">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <span>Theme</span>
            <Button
              onPress={toggleTheme}
              className={`px-4 py-2 rounded-md transition-all hover:opacity-80 bg-accent text-white ${bounceButton}`}
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </Button>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-secondary text-primary">
          <h3 className="text-lg font-semibold mb-4">Review Settings</h3>
          <div className="space-y-3">
            <TextField className="flex items-center justify-between">
              <Label>New Cards Per Day</Label>
              <Input
                type="number"
                placeholder="5"
                className="w-20 px-2 py-1 rounded border bg-tertiary text-primary border-current"
              />
            </TextField>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-secondary text-primary">
          <h3 className="text-lg font-semibold mb-4">Data</h3>
          <div className="space-y-2">
            <Button
              className={`w-full px-4 py-2 rounded transition-opacity hover:opacity-80 bg-tertiary text-primary ${bounceButton}`}
            >
              Export Data
            </Button>
            <Button
              className={`w-full px-4 py-2 rounded transition-opacity hover:opacity-80 bg-tertiary text-primary ${bounceButton}`}
            >
              Import Data
            </Button>
            <Button
              className={`w-full px-4 py-2 rounded transition-opacity hover:opacity-80 text-white bg-danger ${bounceButton}`}
            >
              Reset All Data
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-tertiary">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </ViewLayout>
  );
}
