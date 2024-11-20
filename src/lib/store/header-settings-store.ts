import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HeaderSettings {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  height: string;
  customHeight: string;
  maxWidth: string;
  padding: string;
  isSticky: boolean;
  showShadow: boolean;
  isBoxed: boolean;
  contentAlignment: string;
  borderBottom: boolean;
  borderColor: string;
  opacity: number;
  blur: boolean;
  blurStrength: string;
}

interface HeaderSettingsStore {
  settings: HeaderSettings;
  updateSettings: (settings: Partial<HeaderSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: HeaderSettings = {
  backgroundColor: 'bg-white dark:bg-gray-800',
  textColor: 'text-gray-900 dark:text-white',
  fontSize: 'text-base',
  height: 'h-16',
  customHeight: '64',
  maxWidth: 'max-w-7xl',
  padding: 'px-4',
  isSticky: true,
  showShadow: true,
  isBoxed: false,
  contentAlignment: 'justify-between',
  borderBottom: false,
  borderColor: 'border-gray-200 dark:border-gray-700',
  opacity: 100,
  blur: false,
  blurStrength: 'backdrop-blur-sm'
};

export const useHeaderSettings = create<HeaderSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'header-settings',
    }
  )
);
