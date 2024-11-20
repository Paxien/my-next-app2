'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AISettings {
  model: string;
  systemPrompt: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  openRouterApiKey: string;
  googleApiKey: string;
  mistralApiKey: string;
  cohereApiKey: string;
}

export default function AIPage() {
  const [settings, setSettings] = useState<AISettings>({
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant.',
    openaiApiKey: '',
    anthropicApiKey: '',
    openRouterApiKey: '',
    googleApiKey: '',
    mistralApiKey: '',
    cohereApiKey: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/ai/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        router.refresh();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const ApiKeyInput = ({ name, label, placeholder }: { name: string; label: string; placeholder: string }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <input
        type="password"
        id={name}
        name={name}
        value={settings[name as keyof AISettings]}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Settings</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Default AI Model
            </label>
            <select
              id="model"
              name="model"
              value={settings.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <optgroup label="OpenAI">
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </optgroup>
              <optgroup label="Anthropic">
                <option value="claude-2">Claude 2</option>
                <option value="claude-instant">Claude Instant</option>
              </optgroup>
              <optgroup label="Mistral">
                <option value="mistral-tiny">Mistral Tiny</option>
                <option value="mistral-small">Mistral Small</option>
                <option value="mistral-medium">Mistral Medium</option>
              </optgroup>
              <optgroup label="Google">
                <option value="gemini-pro">Gemini Pro</option>
              </optgroup>
              <optgroup label="Open Router">
                <option value="openrouter-any">Any Available Model</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Default System Prompt
            </label>
            <textarea
              id="systemPrompt"
              name="systemPrompt"
              value={settings.systemPrompt}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">API Keys</h2>
            
            <ApiKeyInput 
              name="openaiApiKey" 
              label="OpenAI API Key" 
              placeholder="sk-..." 
            />
            
            <ApiKeyInput 
              name="anthropicApiKey" 
              label="Anthropic API Key" 
              placeholder="sk-ant-..." 
            />
            
            <ApiKeyInput 
              name="openRouterApiKey" 
              label="Open Router API Key" 
              placeholder="sk-or-..." 
            />
            
            <ApiKeyInput 
              name="googleApiKey" 
              label="Google AI API Key" 
              placeholder="AIza..." 
            />
            
            <ApiKeyInput 
              name="mistralApiKey" 
              label="Mistral API Key" 
              placeholder="..." 
            />
            
            <ApiKeyInput 
              name="cohereApiKey" 
              label="Cohere API Key" 
              placeholder="..." 
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSaving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}