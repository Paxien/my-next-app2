'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";

export interface LayoutSettings {
  editorSize: number;
  fileViewerSize: number;
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
}

interface LayoutSettingsProps {
  settings: LayoutSettings;
  onSettingsChange: (settings: LayoutSettings) => void;
  onClose: () => void;
}

export function LayoutSettings({ settings, onSettingsChange, onClose }: LayoutSettingsProps) {
  const handleSettingChange = <K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <Card className="p-4 space-y-4 w-80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <h3 className="font-medium">Layout Settings</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Editor Size (%)</Label>
          <Slider
            value={[settings.editorSize]}
            onValueChange={([value]) => handleSettingChange('editorSize', value)}
            min={20}
            max={80}
            step={5}
          />
          <div className="text-xs text-muted-foreground text-right">
            {settings.editorSize}%
          </div>
        </div>

        <div className="space-y-2">
          <Label>File Viewer Size (%)</Label>
          <Slider
            value={[settings.fileViewerSize]}
            onValueChange={([value]) => handleSettingChange('fileViewerSize', value)}
            min={20}
            max={50}
            step={5}
          />
          <div className="text-xs text-muted-foreground text-right">
            {settings.fileViewerSize}%
          </div>
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) =>
              handleSettingChange('theme', value as 'light' | 'dark' | 'system')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => handleSettingChange('fontSize', value)}
            min={12}
            max={24}
            step={1}
          />
          <div className="text-xs text-muted-foreground text-right">
            {settings.fontSize}px
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Word Wrap</Label>
          <Switch
            checked={settings.wordWrap}
            onCheckedChange={(checked) => handleSettingChange('wordWrap', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Show Minimap</Label>
          <Switch
            checked={settings.minimap}
            onCheckedChange={(checked) => handleSettingChange('minimap', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Line Numbers</Label>
          <Switch
            checked={settings.lineNumbers}
            onCheckedChange={(checked) => handleSettingChange('lineNumbers', checked)}
          />
        </div>
      </div>
    </Card>
  );
}
