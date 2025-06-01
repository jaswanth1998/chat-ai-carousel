
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  modelId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export interface AIModel {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [aiModels, setAiModels] = useState<AIModel[]>([
    { id: "chatgpt", name: "ChatGPT", color: "bg-green-50 border-green-200", isActive: true },
    { id: "claude", name: "Claude", color: "bg-blue-50 border-blue-200", isActive: true },
    { id: "deepseek", name: "DeepSeek", color: "bg-purple-50 border-purple-200", isActive: true },
  ]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const activeModels = aiModels.filter(model => model.isActive);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messages: [],
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const sendMessage = (content: string) => {
    if (!currentSessionId) {
      createNewChat();
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      modelId: "user",
    };

    // Simulate AI responses for each active model
    const aiResponses: ChatMessage[] = activeModels.map((model, index) => ({
      id: `${Date.now()}-${index}`,
      content: `This is a simulated response from ${model.name}. In a real implementation, this would be the actual AI response to: "${content}"`,
      role: "assistant",
      timestamp: new Date(),
      modelId: model.id,
    }));

    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage, ...aiResponses],
              title: session.messages.length === 0 ? content.slice(0, 30) + "..." : session.title,
            }
          : session
      )
    );
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const toggleModel = (modelId: string) => {
    setAiModels(prev =>
      prev.map(model =>
        model.id === modelId ? { ...model, isActive: !model.isActive } : model
      )
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          aiModels={aiModels}
          onNewChat={createNewChat}
          onSelectSession={selectSession}
          onToggleModel={toggleModel}
        />
        <ChatArea
          currentSession={currentSession}
          activeModels={activeModels}
          onSendMessage={sendMessage}
        />
      </div>
    </SidebarProvider>
  );
}
