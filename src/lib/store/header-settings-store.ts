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
  logoPosition: string;
  navAlignment: string;
  navSpacing: string;
  navPadding: string;
  navStyle: string;
  navHoverEffect: string;
  navRounded: string;
  navButtonVariant: string;
  navButtonSpacing: string;
  navButtonPadding: string;
  navContainerPosition: string;
  navContainerHeight: string;
  headerContentPosition: string;
  headerContentHeight: string;
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
  blurStrength: 'backdrop-blur-sm',
  logoPosition: 'start',
  navAlignment: 'center',
  navSpacing: 'space-x-4',
  navPadding: 'px-4',
  navStyle: 'default',
  navHoverEffect: 'hover:bg-gray-100 dark:hover:bg-gray-700',
  navRounded: 'rounded-md',
  navButtonVariant: 'ghost',
  navButtonSpacing: 'space-x-2',
  navButtonPadding: 'px-4 py-2',
  navContainerPosition: 'items-center',
  navContainerHeight: 'h-full',
  headerContentPosition: 'items-center',
  headerContentHeight: 'h-full',
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
