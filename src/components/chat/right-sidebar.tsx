import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, Settings, HelpCircle, Bot } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="w-64 h-full border-l bg-muted/50 p-4 flex flex-col gap-4">
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

      <div className="mt-auto text-xs text-muted-foreground">
        <p className="mb-1">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Press Enter to send message</li>
          <li>Shift + Enter for new line</li>
          <li>↑ to edit last message</li>
        </ul>
      </div>
    </div>
  );
}
