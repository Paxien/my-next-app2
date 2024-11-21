'use client';

import { useState, useEffect } from 'react';
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { type AIModel, toggleFavoriteModel, defaultModels } from '../utils/models';

export default function ModelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<AIModel[]>(defaultModels);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const { models: loadedModels } = await import('../utils/models');
        if (loadedModels && Array.isArray(loadedModels)) {
          setModels(loadedModels);
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        // Keep using default models if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteModels = filteredModels.filter((model) => model.isFavorite);
  const otherModels = filteredModels.filter((model) => !model.isFavorite);

  const handleModelSelect = (model: AIModel) => {
    localStorage.setItem('selectedModel', JSON.stringify(model));
    router.push('/ce-1');
  };

  const handleFavoriteToggle = (model: AIModel) => {
    const updatedModels = toggleFavoriteModel(model, models);
    setModels(updatedModels);
  };

  const ModelCard = ({ model }: { model: AIModel }) => (
    <Card className="relative hover:shadow-lg transition-shadow">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          handleFavoriteToggle(model);
        }}
      >
        <Star className={cn(
          "h-5 w-5",
          model.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
        )} />
      </Button>

      <CardHeader className="cursor-pointer" onClick={() => handleModelSelect(model)}>
        <CardTitle>{model.name}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {model.features?.map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Select AI Model</h1>
          <Input
            type="search"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      )}

      {favoriteModels.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}
