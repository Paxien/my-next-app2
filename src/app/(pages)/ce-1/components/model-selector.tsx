'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type AIModel, toggleFavoriteModel, defaultModels } from '../utils/models';

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel | null;
  onModelSelect: (model: AIModel) => void;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelSelect,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localModels, setLocalModels] = useState<AIModel[]>(models || defaultModels);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (models) {
      setLocalModels(models);
    }
  }, [models]);

  const filteredModels = localModels.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteModels = filteredModels.filter((model) => model.isFavorite);
  const otherModels = filteredModels.filter((model) => !model.isFavorite);

  const handleModelSelect = (model: AIModel) => {
    onModelSelect(model);
    setOpen(false);
  };

  const handleFavoriteToggle = (model: AIModel) => {
    const updatedModels = toggleFavoriteModel(model, localModels);
    setLocalModels(updatedModels);
  };

  const ModelCard = ({ model }: { model: AIModel }) => (
    <Card className="relative hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModelSelect(model)}>
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

      <CardHeader>
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          {selectedModel?.name || "Select a model..."}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select AI Model</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {favoriteModels.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Favorites</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">All Models</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
