import { Header } from '../../components/Header';
import { StatsBar } from './StatsBar';
import { ReviewCard } from './ReviewCard';
import { NotesSection } from './NotesSection';

export function HomeView() {
  const card = {
    slug: 'two-sum',
    title: 'Two Sum',
    notes: '',
  };

  return (
    <div className="flex flex-col h-full">
      <Header>
        <StatsBar />
      </Header>

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <ReviewCard card={card} />
        <NotesSection />
      </div>
    </div>
  );
}
