'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type AIModel } from '../utils/models';

interface ModelSelectorProps {
  onModelSelect: (model: AIModel) => void;
  currentModel: AIModel;
  availableModels: AIModel[];
  className?: string;
}

export function ModelSelector({ onModelSelect, currentModel, availableModels, className }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter models based on search query
  const filteredModels = availableModels.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group models by free/paid
  const freeModels = filteredModels.filter(model => model.isFree);
  const paidModels = filteredModels.filter(model => !model.isFree);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <span className="truncate">{currentModel.name}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search models..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No model found.</CommandEmpty>
          {freeModels.length > 0 && (
            <CommandGroup heading="Free Models">
              {freeModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelSelect(model);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start py-2"
                >
                  <div className="flex w-full items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentModel.id === model.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-green-500">Free</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {model.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Context: {model.contextWindow?.toLocaleString() || 'Unknown'} tokens</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {paidModels.length > 0 && (
            <CommandGroup heading="Paid Models">
              {paidModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelSelect(model);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start py-2"
                >
                  <div className="flex w-full items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentModel.id === model.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        {model.pricing && (
                          <span className="text-xs text-muted-foreground">
                            ${model.pricing.prompt}/1K prompt, ${model.pricing.completion}/1K completion
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {model.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Context: {model.contextWindow?.toLocaleString() || 'Unknown'} tokens</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
