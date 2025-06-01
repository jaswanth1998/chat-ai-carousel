
import { Plus, MessageSquare, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { ChatSession, AIModel } from "./ChatInterface";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  aiModels: AIModel[];
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onToggleModel: (modelId: string) => void;
  onNewChatWithModel: (modelIds: string[]) => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  aiModels,
  onNewChat,
  onSelectSession,
  onToggleModel,
  onNewChatWithModel,
}: ChatSidebarProps) {
  const handleNewChatWithSpecificModel = (modelId: string) => {
    onNewChatWithModel([modelId]);
  };

  const handleNewChatWithAllModels = () => {
    const activeModelIds = aiModels.filter(model => model.isActive).map(model => model.id);
    onNewChatWithModel(activeModelIds);
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex gap-2">
          <Button
            onClick={onNewChat}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-11 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 border-gray-200 hover:bg-gray-50"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleNewChatWithAllModels}>
                <Plus className="w-4 h-4 mr-2" />
                New Chat (All Active)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {aiModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => handleNewChatWithSpecificModel(model.id)}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${model.color.split(' ')[0]}`} />
                  New Chat with {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-2 mb-2">
            AI Models
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 mb-4">
              {aiModels.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{model.name}</span>
                  <Switch
                    checked={model.isActive}
                    onCheckedChange={() => onToggleModel(model.id)}
                    className="scale-75"
                  />
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-2 mb-2">
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.length === 0 ? (
                <div className="px-3 py-8 text-center text-gray-400 text-sm">
                  No chat history yet
                </div>
              ) : (
                sessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectSession(session.id)}
                      isActive={currentSessionId === session.id}
                      className="w-full justify-start text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 truncate">
                          {session.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {session.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
