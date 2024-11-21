'use client';

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  Bot,
  Wand2,
  FileSearch,
  RefreshCw,
  PenTool,
  Globe,
  Database,
  Terminal,
  Wrench,
  BookOpen,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandMode = 
  | 'assistant'  // General chat and analysis
  | 'webapp'     // Web application generation
  | 'database'   // Database and API design
  | 'refactor'   // Code refactoring
  | 'docs'       // Documentation generation
  | 'debug';     // Debugging assistance

interface CommandBarProps {
  mode: CommandMode;
  onModeChange: (mode: CommandMode) => void;
  onCommandClick: (command: string) => void;
  className?: string;
}

const modeCommands: Record<CommandMode, { icon: any; label: string; commands: string[] }> = {
  assistant: {
    icon: Bot,
    label: 'Assistant',
    commands: [
      '/analyze',
      '/explain',
      '/suggest',
      '/search',
      '/help'
    ]
  },
  webapp: {
    icon: Globe,
    label: 'Web App',
    commands: [
      '/generate component',
      '/add route',
      '/create api',
      '/style component',
      '/add feature'
    ]
  },
  database: {
    icon: Database,
    label: 'Database',
    commands: [
      '/create schema',
      '/add model',
      '/generate api',
      '/add relation',
      '/optimize query'
    ]
  },
  refactor: {
    icon: RefreshCw,
    label: 'Refactor',
    commands: [
      '/improve code',
      '/extract component',
      '/optimize',
      '/clean up',
      '/type check'
    ]
  },
  docs: {
    icon: BookOpen,
    label: 'Docs',
    commands: [
      '/document code',
      '/add comments',
      '/generate readme',
      '/api docs',
      '/usage example'
    ]
  },
  debug: {
    icon: Wrench,
    label: 'Debug',
    commands: [
      '/find bug',
      '/test code',
      '/add logging',
      '/performance',
      '/security check'
    ]
  }
};

export function CommandBar({ mode, onModeChange, onCommandClick, className }: CommandBarProps) {
  const currentCommands = modeCommands[mode].commands;
  const modes = Object.entries(modeCommands);

  return (
    <div className={cn("space-y-2", className)}>
      <Tabs value={mode} onValueChange={(value) => onModeChange(value as CommandMode)}>
        <TabsList className="w-full grid grid-cols-6">
          {modes.map(([key, { icon: Icon, label }]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {currentCommands.map((command) => (
          <Button
            key={command}
            variant="secondary"
            className="justify-start text-sm"
            onClick={() => onCommandClick(command)}
          >
            <Zap className="h-3 w-3 mr-2" />
            {command}
          </Button>
        ))}
      </div>
    </div>
  );
}
