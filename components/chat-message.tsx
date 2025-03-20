import type { Message } from "ai"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-lg", isUser ? "bg-muted ml-12" : "bg-primary/10 mr-12")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isUser ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-medium">{isUser ? "You" : "AI Assistant"}</div>
        <div className="prose prose-sm">{message.content}</div>
      </div>
    </div>
  )
}

