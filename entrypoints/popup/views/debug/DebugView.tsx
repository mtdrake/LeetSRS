import { DebugPanel } from '../../debug/DebugPanel';

export function DebugView() {
  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden p-4">
      <h2 className="text-xl font-bold mb-4 text-primary">Debug Information</h2>
      <DebugPanel />
    </div>
  );
}
