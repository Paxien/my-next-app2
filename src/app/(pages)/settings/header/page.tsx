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

const logoPositionOptions = [
  { value: 'start', label: 'Left' },
  { value: 'center', label: 'Center' },
];

const navAlignmentOptions = [
  { value: 'start', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'Right' },
];

const navSpacingOptions = [
  { value: 'space-x-4', label: 'Compact' },
  { value: 'space-x-6', label: 'Medium' },
  { value: 'space-x-8', label: 'Large' },
  { value: 'space-x-10', label: 'Extra Large' },
];

const navPaddingOptions = [
  { value: 'px-2', label: 'Small' },
  { value: 'px-4', label: 'Medium' },
  { value: 'px-6', label: 'Large' },
];

const navStyleOptions = [
  { value: 'default', label: 'Default' },
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
];

const navHoverEffectOptions = [
  { value: 'hover:bg-gray-100 dark:hover:bg-gray-700', label: 'Light Background' },
  { value: 'hover:bg-primary/90', label: 'Primary Color' },
  { value: 'hover:bg-secondary/90', label: 'Secondary Color' },
  { value: 'hover:scale-105', label: 'Scale Up' },
];

const navRoundedOptions = [
  { value: 'rounded-none', label: 'None' },
  { value: 'rounded-sm', label: 'Small' },
  { value: 'rounded-md', label: 'Medium' },
  { value: 'rounded-lg', label: 'Large' },
  { value: 'rounded-full', label: 'Full' },
];

const navButtonVariantOptions = [
  { value: 'ghost', label: 'Ghost' },
  { value: 'default', label: 'Default' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
];

const buttonSpacingOptions = [
  { value: 'space-x-1', label: 'Extra Small' },
  { value: 'space-x-2', label: 'Small' },
  { value: 'space-x-3', label: 'Medium' },
  { value: 'space-x-4', label: 'Large' },
  { value: 'space-x-6', label: 'Extra Large' },
];

const buttonPaddingOptions = [
  { value: 'px-2 py-1', label: 'Extra Small' },
  { value: 'px-3 py-1.5', label: 'Small' },
  { value: 'px-4 py-2', label: 'Medium' },
  { value: 'px-5 py-2.5', label: 'Large' },
  { value: 'px-6 py-3', label: 'Extra Large' },
];

const containerPositionOptions = [
  { value: 'items-start', label: 'Top' },
  { value: 'items-center', label: 'Center' },
  { value: 'items-end', label: 'Bottom' },
  { value: 'items-stretch', label: 'Stretch' },
];

const containerHeightOptions = [
  { value: 'h-auto', label: 'Auto' },
  { value: 'h-full', label: 'Full Height' },
  { value: 'h-3/4', label: '75% Height' },
  { value: 'h-1/2', label: '50% Height' },
];

const headerPositionOptions = [
  { value: 'items-start', label: 'Top' },
  { value: 'items-center', label: 'Center' },
  { value: 'items-end', label: 'Bottom' },
];

const headerHeightOptions = [
  { value: 'h-full', label: 'Full Height' },
  { value: 'h-[80%]', label: '80% Height' },
  { value: 'h-[60%]', label: '60% Height' },
  { value: 'h-[40%]', label: '40% Height' },
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

                <div>
                  <label className="block text-sm font-medium mb-1">Logo Position</label>
                  <select
                    value={settings.logoPosition}
                    onChange={(e) => updateSettings({ logoPosition: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {logoPositionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Navigation Alignment</label>
                  <select
                    value={settings.navAlignment}
                    onChange={(e) => updateSettings({ navAlignment: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navAlignmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Navigation Spacing</label>
                  <select
                    value={settings.navSpacing}
                    onChange={(e) => updateSettings({ navSpacing: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navSpacingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Navigation Padding</label>
                  <select
                    value={settings.navPadding}
                    onChange={(e) => updateSettings({ navPadding: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navPaddingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Navigation Style</label>
                  <select
                    value={settings.navStyle}
                    onChange={(e) => updateSettings({ navStyle: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navStyleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Variant</label>
                  <select
                    value={settings.navButtonVariant}
                    onChange={(e) => updateSettings({ navButtonVariant: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navButtonVariantOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hover Effect</label>
                  <select
                    value={settings.navHoverEffect}
                    onChange={(e) => updateSettings({ navHoverEffect: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navHoverEffectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Rounding</label>
                  <select
                    value={settings.navRounded}
                    onChange={(e) => updateSettings({ navRounded: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {navRoundedOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Spacing</label>
                  <select
                    value={settings.navButtonSpacing}
                    onChange={(e) => updateSettings({ navButtonSpacing: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {buttonSpacingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Padding</label>
                  <select
                    value={settings.navButtonPadding}
                    onChange={(e) => updateSettings({ navButtonPadding: e.target.value })}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    {buttonPaddingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4">Navigation Container</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Vertical Position</label>
                      <select
                        value={settings.navContainerPosition}
                        onChange={(e) => updateSettings({ navContainerPosition: e.target.value })}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        {containerPositionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Container Height</label>
                      <select
                        value={settings.navContainerHeight}
                        onChange={(e) => updateSettings({ navContainerHeight: e.target.value })}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        {containerHeightOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4">Header Content Position</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Vertical Position</label>
                      <select
                        value={settings.headerContentPosition}
                        onChange={(e) => updateSettings({ headerContentPosition: e.target.value })}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        {headerPositionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Content Height</label>
                      <select
                        value={settings.headerContentHeight}
                        onChange={(e) => updateSettings({ headerContentHeight: e.target.value })}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        {headerHeightOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
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

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium">Boxed Layout</label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Constrain header content to maximum width
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.isBoxed}
                    onChange={(e) => updateSettings({ isBoxed: e.target.checked })}
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
