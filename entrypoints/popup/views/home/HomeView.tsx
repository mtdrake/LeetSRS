import { Header } from '../../components/Header';
import { StatsBar } from './StatsBar';
import { ReviewQueue } from './ReviewQueue';

export function HomeView() {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10">
        <Header>
          <StatsBar />
        </Header>
      </div>

      <div
        className="flex-1 flex flex-col py-4 gap-4 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="pr-2" style={{ paddingLeft: 'calc(0.5rem + 12px)' }}>
          <ReviewQueue />
        </div>
      </div>
    </div>
  );
}
