"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, BookOpen, Send, Bot } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import ProblemRepository from "@/components/problem-repository"
import AuthButton from "@/components/auth-button"

// Mock user authentication - in a real app, use a proper auth system
const mockLogin = (email: string, password: string) => {
  // This is just for demonstration - implement real authentication
  return { id: "123", email, name: "Student User" }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    id: user?.id || "anonymous",
    initialMessages: [],
  })

  // Mock login handler
  const handleLogin = (email: string, password: string) => {
    const user = mockLogin(email, password)
    setUser(user)
    setIsLoggedIn(true)

    // In a real app, you would fetch the user's chat history from a database
    // For now, we'll just simulate loading previous messages
    const savedMessages = localStorage.getItem(`chat_history_${user.id}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }

  // Mock logout handler
  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setMessages([])
  }

  // Save chat history to localStorage when messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages))
    }
  }, [messages, user])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Student Support AI</h1>
          <AuthButton isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
        </div>

        <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat Support</span>
            </TabsTrigger>
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Problem Repository</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <Card className="p-4 h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-8 text-muted-foreground">
                    <div>
                      <Bot className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <h3 className="text-lg font-semibold">Student Support AI</h3>
                      <p className="max-w-md mx-auto">
                        Ask me any questions about your coursework, assignments, or academic challenges.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => <ChatMessage key={message.id} message={message} />)
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="repository" className="mt-4">
            <ProblemRepository />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

