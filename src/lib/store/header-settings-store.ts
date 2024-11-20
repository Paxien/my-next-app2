import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HeaderSettings {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  isSticky: boolean;
  showShadow: boolean;
  height: string;
}

interface HeaderSettingsStore {
  settings: HeaderSettings;
  updateSettings: (settings: Partial<HeaderSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: HeaderSettings = {
  backgroundColor: 'bg-white dark:bg-gray-800',
  textColor: 'text-gray-900 dark:text-white',
  fontSize: 'text-sm',
  isSticky: true,
  showShadow: true,
  height: 'h-16',
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
