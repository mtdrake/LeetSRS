import { Button, TextField, Label, Input, Switch } from 'react-aria-components';
import { FaSun, FaMoon } from 'react-icons/fa6';
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
            <Switch
              isSelected={theme === 'dark'}
              onChange={toggleTheme}
              className="group inline-flex touch-none items-center gap-2"
            >
              <FaSun
                className={`text-sm transition-colors ${theme === 'light' ? 'text-accent' : 'text-tertiary opacity-50'}`}
              />
              <span className="group-data-[selected]:bg-accent group-data-[focus-visible]:ring-2 h-6 w-11 cursor-pointer rounded-full border border-current bg-tertiary ring-offset-2 ring-offset-primary transition-colors">
                <span className="group-data-[selected]:ml-5 group-data-[selected]:group-data-[pressed]:ml-4 group-data-[pressed]:w-6 block h-5 w-5 origin-right rounded-full bg-white shadow-sm transition-all" />
              </span>
              <FaMoon
                className={`text-sm transition-colors ${theme === 'dark' ? 'text-accent' : 'text-tertiary opacity-50'}`}
              />
            </Switch>
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
