import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnimationsContextType {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

const AnimationsContext = createContext<AnimationsContextType | undefined>(undefined);

export function AnimationsProvider({ children }: { children: ReactNode }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? saved === 'true' : true; // Default to enabled
  });

  useEffect(() => {
    localStorage.setItem('animationsEnabled', String(animationsEnabled));

    // Apply class to root element
    if (!animationsEnabled) {
      document.documentElement.classList.add('animations-disabled');
    } else {
      document.documentElement.classList.remove('animations-disabled');
    }
  }, [animationsEnabled]);

  const toggleAnimations = () => {
    setAnimationsEnabled((prev) => !prev);
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
