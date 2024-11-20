import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, Settings, HelpCircle, Bot } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="w-64 border-l bg-muted/50 flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Info className="h-4 w-4" />
            Model Info
          </h2>
          
          <Card className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <h3 className="text-sm font-medium">Current Model</h3>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Model: Llama 3.2 90B</p>
              <p>Context: 128k tokens</p>
              <p>Response: Fast</p>
            </div>
          </Card>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <HelpCircle className="h-4 w-4" />
              Help & FAQ
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-muted/50">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-2">Keyboard Shortcuts:</p>
          <ul className="space-y-1.5">
            <li className="flex justify-between">
              <span>Send message</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
            </li>
            <li className="flex justify-between">
              <span>New line</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Shift + Enter</kbd>
            </li>
            <li className="flex justify-between">
              <span>Edit last message</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
