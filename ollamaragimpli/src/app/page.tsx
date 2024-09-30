'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Trash2, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [chats, setChats] = useState<{ id: string; title: string }[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [language, setLanguage] = useState('English')
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat()

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const startNewChat = () => {
    const newChatId = Date.now().toString()
    setChats([...chats, { id: newChatId, title: `Chat ${chats.length + 1}` }])
    setCurrentChatId(newChatId)
    setMessages([])
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    setMessages([])
  }

  const clearHistory = () => {
    setChats([])
    setCurrentChatId(null)
    setMessages([])
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-64 p-4 flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r`}>
        <Button onClick={startNewChat} className="w-full mb-4">New Chat</Button>
        <div className="flex-grow space-y-2 overflow-y-auto">
          {chats.map(chat => (
            <Button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              variant={currentChatId === chat.id ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              {chat.title}
            </Button>
          ))}
        </div>
        {/* Settings panel */}
        <div className={`mt-4 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="flex justify-between items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="rounded-full">
                    {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle dark mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={clearHistory} variant="ghost" size="icon" className="rounded-full">
                    <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Globe className="h-[1.2rem] w-[1.2rem]" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change language</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('English')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('Spanish')}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('French')}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>AI Chatbot with Ollama and RAG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg p-2 ${
                    m.role === 'user' 
                      ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Say something in ${language}...`}
                className={`flex-grow ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}