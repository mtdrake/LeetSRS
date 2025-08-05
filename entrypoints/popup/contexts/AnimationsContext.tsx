import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAnimationsEnabledQuery, useSetAnimationsEnabledMutation } from '@/hooks/useBackgroundQueries';

interface AnimationsContextType {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

const AnimationsContext = createContext<AnimationsContextType | undefined>(undefined);

export function AnimationsProvider({ children }: { children: ReactNode }) {
  const { data: animationsEnabled = true } = useAnimationsEnabledQuery();
  const setAnimationsEnabledMutation = useSetAnimationsEnabledMutation();

  useEffect(() => {
    // Apply class to root element based on the setting
    if (!animationsEnabled) {
      document.documentElement.classList.add('animations-disabled');
    } else {
      document.documentElement.classList.remove('animations-disabled');
    }
  }, [animationsEnabled]);

  const toggleAnimations = () => {
    setAnimationsEnabledMutation.mutate(!animationsEnabled);
  };

  return (
    <AnimationsContext.Provider value={{ animationsEnabled, toggleAnimations }}>{children}</AnimationsContext.Provider>
  );
}

export function useAnimations() {
  const context = useContext(AnimationsContext);
  if (context === undefined) {
    throw new Error('useAnimations must be used within an AnimationsProvider');
  }
  return context;
}
