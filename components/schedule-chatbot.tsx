"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { searchTimetable } from "@/lib/timetable"
import { Send, Bot, Clock, MapPin, BookOpen } from "lucide-react"

interface ScheduleChatbotProps {
  facultyId: string
}

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
  results?: any
}

export function ScheduleChatbot({ facultyId }: ScheduleChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Hello! I can help you find your schedule. Try asking me about a specific day (e.g., 'Monday') or course (e.g., 'CS101').",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const results = await searchTimetable(facultyId, input)

      let botResponse: Message

      if (Object.keys(results).length === 0) {
        botResponse = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content:
            "I couldn't find any schedule matching your query. Try asking about a specific day like 'Monday' or a course code like 'CS101'.",
          timestamp: new Date(),
        }
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: "Here's what I found in your schedule:",
          timestamp: new Date(),
          results,
        }
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: "Sorry, I encountered an error while searching for your schedule. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const renderScheduleResults = (results: any) => {
    return Object.entries(results).map(([day, slots]) => (
      <div key={day} className="mt-2 space-y-2">
        <h4 className="font-medium capitalize">{day}</h4>
        {Array.isArray(slots) &&
          slots.map((slot: any, index: number) => (
            <div key={index} className="bg-muted/50 rounded-md p-2 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{slot.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{slot.course}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{slot.room}</span>
              </div>
            </div>
          ))}
      </div>
    ))
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Schedule Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  {message.results && renderScheduleResults(message.results)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Ask about your schedule..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
