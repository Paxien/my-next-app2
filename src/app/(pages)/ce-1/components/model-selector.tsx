'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
  selectedModel?: AIModel | null;
  models?: AIModel[];
}

export function ModelSelector({
  models = [],
  selectedModel = null,
  onModelSelect,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredModels = useMemo(() => {
    if (!search.trim()) return models;
    const searchLower = search.toLowerCase();
    return models.filter(model => 
      model.name.toLowerCase().includes(searchLower) ||
      model.description.toLowerCase().includes(searchLower) ||
      model.id.toLowerCase().includes(searchLower)
    );
  }, [models, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev => 
          prev < filteredModels.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredModels[activeIndex]) {
          onModelSelect(filteredModels[activeIndex]);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (open && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedModel ? selectedModel.name : "Select a model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search models..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div 
            ref={listRef} 
            className="max-h-[300px] overflow-y-auto"
          >
            {filteredModels.map((model, index) => (
              <div
                key={model.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  activeIndex === index && "bg-accent text-accent-foreground",
                  "aria-selected:bg-accent aria-selected:text-accent-foreground"
                )}
                onClick={() => {
                  onModelSelect(model);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col flex-grow">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {model.contextWindow && (
                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-sm">
                        {model.contextWindow.toLocaleString()} tokens
                      </span>
                    )}
                    {model.pricingType === "free" ? (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-1.5 py-0.5 rounded-sm">
                        Free
                      </span>
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded-sm">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
                {selectedModel?.id === model.id && (
                  <Check className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                )}
              </div>
            ))}
            {filteredModels.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No models found.
              </div>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
