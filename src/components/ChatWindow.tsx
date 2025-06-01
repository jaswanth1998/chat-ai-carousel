import { useEffect, useRef, useState } from "react";
import { Copy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage, AIModel } from "./ChatInterface";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  model: AIModel;
  messages: ChatMessage[];
  className?: string;
  onEditMessage: (messageId: string, newContent: string) => void;
}

export function ChatWindow({ model, messages, className, onEditMessage }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied to your clipboard.",
    });
  };

  const startEditing = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingMessageId && editContent.trim()) {
      onEditMessage(editingMessageId, editContent.trim());
      setEditingMessageId(null);
      setEditContent("");
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">Welcome to {model.name}</p>
              <p className="text-sm">Start a conversation by typing a message below.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                  message.role === "user"
                    ? "bg-gray-900 text-white"
                    : `${model.color} border`
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {message.role === "assistant" && (
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {model.name}
                      </div>
                    )}
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="min-h-[60px] text-sm resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={saveEdit}
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className={cn(
                        "text-sm leading-relaxed whitespace-pre-wrap",
                        message.role === "user" ? "text-white" : "text-gray-800"
                      )}>
                        {message.content}
                      </p>
                    )}
                  </div>
                  {editingMessageId !== message.id && (
                    <div className="flex gap-1 flex-shrink-0">
                      {message.role === "user" && (
                        <Button
                          onClick={() => startEditing(message.id, message.content)}
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "h-8 w-8 p-0 flex-shrink-0",
                            message.role === "user" 
                              ? "hover:bg-gray-700/50 text-gray-300 hover:text-white" 
                              : "hover:bg-gray-200/50"
                          )}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {message.role === "assistant" && (
                        <Button
                          onClick={() => copyToClipboard(message.content)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-200/50 flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
