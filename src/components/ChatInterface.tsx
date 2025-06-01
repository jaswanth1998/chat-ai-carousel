
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
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "example-1",
      title: "What is machine learning?",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      messages: [
        {
          id: "msg-1",
          content: "What is machine learning?",
          role: "user",
          timestamp: new Date(Date.now() - 86400000),
          modelId: "user",
        },
        {
          id: "msg-2",
          content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task. It uses algorithms to identify patterns in data and make predictions or decisions based on those patterns.",
          role: "assistant",
          timestamp: new Date(Date.now() - 86400000 + 1000),
          modelId: "chatgpt",
        },
        {
          id: "msg-3",
          content: "Machine learning is a method of data analysis that automates analytical model building. It's based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention. Think of it as teaching computers to recognize patterns the way humans do, but at scale.",
          role: "assistant",
          timestamp: new Date(Date.now() - 86400000 + 2000),
          modelId: "claude",
        },
        {
          id: "msg-4",
          content: "Machine learning is a branch of AI that focuses on building systems that learn from data. Instead of programming explicit rules, we feed algorithms large amounts of data so they can automatically find patterns and make predictions. It's like giving a computer the ability to improve its performance on a task through experience.",
          role: "assistant",
          timestamp: new Date(Date.now() - 86400000 + 3000),
          modelId: "deepseek",
        },
      ],
    },
    {
      id: "example-2",
      title: "Best programming languages...",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      messages: [
        {
          id: "msg-5",
          content: "What are the best programming languages to learn in 2024?",
          role: "user",
          timestamp: new Date(Date.now() - 172800000),
          modelId: "user",
        },
        {
          id: "msg-6",
          content: "For 2024, I'd recommend: 1) Python - excellent for AI/ML, data science, and web development, 2) JavaScript/TypeScript - essential for web development, 3) Rust - growing rapidly for systems programming, 4) Go - great for backend services, and 5) Swift/Kotlin for mobile development.",
          role: "assistant",
          timestamp: new Date(Date.now() - 172800000 + 1000),
          modelId: "chatgpt",
        },
        {
          id: "msg-7",
          content: "The top languages for 2024 depend on your goals: Python remains king for AI/data science, JavaScript is still essential for web development, TypeScript adds type safety, Rust offers memory safety for systems programming, and Go provides simplicity for cloud services. Consider your career path when choosing!",
          role: "assistant",
          timestamp: new Date(Date.now() - 172800000 + 2000),
          modelId: "claude",
        },
      ],
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>("example-1");
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
