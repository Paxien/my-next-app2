'use client';

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface ModelSelectorDisplayOptions {
  showDescription: boolean;
  showContextWindow: boolean;
  showPricing: boolean;
  showFreeLabel: boolean;
  showModelId: boolean;
  groupByProvider: boolean;
  groupByPricing: boolean;
}

interface ModelSelectorSettingsProps {
  options: ModelSelectorDisplayOptions;
  onChange: (options: ModelSelectorDisplayOptions) => void;
}

export function ModelSelectorSettings({ options, onChange }: ModelSelectorSettingsProps) {
  const updateOption = (key: keyof ModelSelectorDisplayOptions) => {
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Open model selector settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Model Selector Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-description">Show Description</Label>
            <Switch
              id="show-description"
              checked={options.showDescription}
              onCheckedChange={() => updateOption('showDescription')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-context">Show Context Window</Label>
            <Switch
              id="show-context"
              checked={options.showContextWindow}
              onCheckedChange={() => updateOption('showContextWindow')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-pricing">Show Pricing</Label>
            <Switch
              id="show-pricing"
              checked={options.showPricing}
              onCheckedChange={() => updateOption('showPricing')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-free-label">Show Free Label</Label>
            <Switch
              id="show-free-label"
              checked={options.showFreeLabel}
              onCheckedChange={() => updateOption('showFreeLabel')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-model-id">Show Model ID</Label>
            <Switch
              id="show-model-id"
              checked={options.showModelId}
              onCheckedChange={() => updateOption('showModelId')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="group-provider">Group by Provider</Label>
            <Switch
              id="group-provider"
              checked={options.groupByProvider}
              onCheckedChange={() => updateOption('groupByProvider')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="group-pricing">Group by Pricing</Label>
            <Switch
              id="group-pricing"
              checked={options.groupByPricing}
              onCheckedChange={() => updateOption('groupByPricing')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
