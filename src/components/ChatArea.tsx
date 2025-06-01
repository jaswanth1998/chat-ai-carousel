import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ChatSession, AIModel } from "./ChatInterface";

interface ChatAreaProps {
  currentSession: ChatSession | undefined;
  activeModels: AIModel[];
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
}

export function ChatArea({ currentSession, activeModels, onSendMessage, onEditMessage }: ChatAreaProps) {
  const [selectedModel, setSelectedModel] = useState<string>(activeModels[0]?.id || "");
  const isMobile = useIsMobile();

  if (activeModels.length === 0) {
    return (
      <main className="flex-1 flex flex-col">
        <header className="flex items-center p-4 border-b border-gray-100">
          <SidebarTrigger className="mr-3" />
          <h1 className="text-lg font-semibold text-gray-800">Multi-AI Chat</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">No AI models selected</p>
            <p className="text-sm">Please enable at least one AI model from the sidebar to start chatting.</p>
          </div>
        </div>
      </main>
    );
  }

  const getMessagesForModel = (modelId: string) => {
    if (!currentSession) return [];
    return currentSession.messages.filter(msg => msg.role === "user" || msg.modelId === modelId);
  };

  if (isMobile) {
    return (
      <main className="flex-1 flex flex-col">
        <header className="flex items-center p-4 border-b border-gray-100">
          <SidebarTrigger className="mr-3" />
          <h1 className="text-lg font-semibold text-gray-800">Multi-AI Chat</h1>
        </header>
        
        <Tabs value={selectedModel} onValueChange={setSelectedModel} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4 bg-gray-100 rounded-lg p-1">
            {activeModels.map((model) => (
              <TabsTrigger
                key={model.id}
                value={model.id}
                className="text-xs font-medium transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {model.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex-1 flex flex-col">
            {activeModels.map((model) => (
              <TabsContent key={model.id} value={model.id} className="flex-1 flex flex-col mt-0">
                <ChatWindow
                  model={model}
                  messages={getMessagesForModel(model.id)}
                  className="flex-1"
                  onEditMessage={onEditMessage}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <div className="border-t border-gray-100 p-4">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <header className="flex items-center p-4 border-b border-gray-100">
        <SidebarTrigger className="mr-3" />
        <h1 className="text-lg font-semibold text-gray-800">Multi-AI Chat</h1>
      </header>
      
      <div className="flex-1 flex">
        {activeModels.map((model, index) => (
          <div
            key={model.id}
            className={`flex-1 flex flex-col ${index > 0 ? 'border-l border-gray-100' : ''}`}
          >
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-700">{model.name}</h2>
            </div>
            <ChatWindow
              model={model}
              messages={getMessagesForModel(model.id)}
              className="flex-1"
              onEditMessage={onEditMessage}
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 p-4">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </main>
  );
}
