import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Trash } from "lucide-react";

export function LeftSidebar() {
  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4 border-b">
        <Button className="w-full justify-start gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold px-2 py-1">Recent Chats</h2>
          {/* Example chat history items */}
          {[1, 2, 3].map((i) => (
            <Button
              key={i}
              variant="ghost"
              className="w-full justify-start gap-2 text-sm truncate h-auto py-2"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">Chat Session {i}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash className="h-4 w-4" />
          Clear All Chats
        </Button>
      </div>
    </div>
  );
}
