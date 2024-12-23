"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Edit2, Trash2, Check, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
  name: string;
  key: string;
  placeholder: string;
  envKey: string;
  exists: boolean;
  isEditing: boolean;
  existingKey: string;
  isRevealed: boolean;
}

const initialApiKeys: Omit<ApiKey, 'exists' | 'isEditing' | 'existingKey' | 'isRevealed'>[] = [
  { name: 'OpenAI', key: '', placeholder: 'sk-...', envKey: 'OPENAI_API_KEY' },
  { name: 'Anthropic', key: '', placeholder: 'sk-ant-...', envKey: 'ANTHROPIC_API_KEY' },
  { name: 'Open Router', key: '', placeholder: 'sk-or-...', envKey: 'OPENROUTER_API_KEY' },
  { name: 'Google AI', key: '', placeholder: 'AIza...', envKey: 'GOOGLE_AI_API_KEY' },
  { name: 'Mistral', key: '', placeholder: 'mistral_...', envKey: 'MISTRAL_API_KEY' },
  { name: 'Cohere', key: '', placeholder: 'co-...', envKey: 'COHERE_API_KEY' }
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing keys on mount
    const fetchKeys = async () => {
      try {
        const response = await fetch('/api/settings/get-api-keys');
        if (response.ok) {
          const data = await response.json();
          const existingKeys = initialApiKeys.map(key => ({
            ...key,
            exists: !!data[key.envKey],
            isEditing: false,
            existingKey: data[key.envKey] || '',
            key: '', // Don't show actual key value until editing
            isRevealed: false
          }));
          setKeys(existingKeys);
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
      }
    };
    fetchKeys();
  }, []);

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...keys];
    newKeys[index] = { ...newKeys[index], key: value };
    setKeys(newKeys);
  };

  const toggleEdit = (index: number) => {
    const newKeys = [...keys];
    const currentKey = newKeys[index];
    newKeys[index] = { 
      ...currentKey, 
      isEditing: !currentKey.isEditing,
      // Set the input value to the existing key when starting to edit
      key: !currentKey.isEditing ? currentKey.existingKey : '',
      isRevealed: false // Reset reveal state when toggling edit
    };
    setKeys(newKeys);
  };

  const toggleReveal = (index: number) => {
    const newKeys = [...keys];
    newKeys[index] = { 
      ...newKeys[index], 
      isRevealed: !newKeys[index].isRevealed 
    };
    setKeys(newKeys);
  };

  const deleteKey = async (index: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/delete-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: keys[index].envKey
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      const newKeys = [...keys];
      newKeys[index] = { 
        ...newKeys[index], 
        exists: false, 
        key: '',
        existingKey: '',
        isEditing: false,
        isRevealed: false
      };
      setKeys(newKeys);

      toast({
        title: "Success",
        description: `${keys[index].name} API key deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveApiKeys = async () => {
    try {
      setLoading(true);
      const keysToUpdate = keys.reduce((acc, key) => {
        if (key.key) {
          acc[key.envKey] = key.key;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch('/api/settings/save-api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys: keysToUpdate }),
      });

      if (!response.ok) {
        throw new Error('Failed to save API keys');
      }

      // Update exists status for saved keys
      const newKeys = keys.map(key => ({
        ...key,
        exists: key.key ? true : key.exists,
        existingKey: key.key || key.existingKey, // Update the stored key
        isEditing: false,
        key: '', // Clear input value after saving
        isRevealed: false
      }));
      setKeys(newKeys);

      toast({
        title: "Success",
        description: "API keys saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Keys</h1>
        
        <div className="grid gap-6">
          {keys.map((apiKey, index) => (
            <Card key={apiKey.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>{apiKey.name} API Key</CardTitle>
                    {apiKey.exists ? (
                      <span className="flex items-center text-sm text-green-500">
                        <Check className="w-4 h-4 mr-1" />
                        Configured
                      </span>
                    ) : (
                      <span className="flex items-center text-sm text-yellow-500">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Not Configured
                      </span>
                    )}
                  </div>
                  {apiKey.exists && !apiKey.isEditing && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit(index)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteKey(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  Enter your {apiKey.name} API key to use {apiKey.name} features
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(apiKey.isEditing || !apiKey.exists) && (
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor={`${apiKey.name.toLowerCase()}-key`}>
                        {apiKey.name} API Key
                      </Label>
                      <div className="relative">
                        <Input
                          id={`${apiKey.name.toLowerCase()}-key`}
                          placeholder={apiKey.placeholder}
                          value={apiKey.key}
                          onChange={(e) => handleKeyChange(index, e.target.value)}
                          type={apiKey.isRevealed ? "text" : "password"}
                          className="pr-10" // Make room for the reveal button
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => toggleReveal(index)}
                        >
                          {apiKey.isRevealed ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={saveApiKeys} disabled={loading}>
            {loading ? "Saving..." : "Save API Keys"}
          </Button>
        </div>
      </div>
    </div>
  );
}
