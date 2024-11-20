'use client';

import { useHeaderSettings } from '@/lib/store/header-settings-store';

const backgroundOptions = [
  { value: 'bg-white dark:bg-gray-800', label: 'Default (White/Dark)' },
  { value: 'bg-gray-100 dark:bg-gray-900', label: 'Light Gray' },
  { value: 'bg-blue-500 dark:bg-blue-800', label: 'Blue' },
  { value: 'bg-indigo-500 dark:bg-indigo-800', label: 'Indigo' },
];

const textColorOptions = [
  { value: 'text-gray-900 dark:text-white', label: 'Default (Dark/Light)' },
  { value: 'text-white', label: 'White' },
  { value: 'text-gray-600 dark:text-gray-300', label: 'Gray' },
];

const fontSizeOptions = [
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Medium' },
  { value: 'text-lg', label: 'Large' },
];

const heightOptions = [
  { value: 'h-12', label: 'Compact' },
  { value: 'h-16', label: 'Default' },
  { value: 'h-20', label: 'Large' },
];

export default function HeaderSettingsPage() {
  const { settings, updateSettings, resetSettings } = useHeaderSettings();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Header Settings</h1>
        
        <div className="grid gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Header Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize the appearance of the main navigation header
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <select
                    value={settings.backgroundColor}
                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {backgroundOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <select
                    value={settings.textColor}
                    onChange={(e) => updateSettings({ textColor: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {textColorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {fontSizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Header Height</label>
                  <select
                    value={settings.height}
                    onChange={(e) => updateSettings({ height: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {heightOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium">Sticky Header</label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Keep the header fixed at the top while scrolling
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.isSticky}
                    onChange={(e) => updateSettings({ isSticky: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium">Show Shadow</label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Add a subtle shadow below the header
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showShadow}
                    onChange={(e) => updateSettings({ showShadow: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={resetSettings}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
