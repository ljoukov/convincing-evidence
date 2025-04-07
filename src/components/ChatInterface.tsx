import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { Send } from 'lucide-react'

interface Message {
  text: string
  isUser: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      const botMessage: Message = { text: data.text, isUser: false }
      
      setMessages(prev => [...prev, botMessage])
      setInput('')
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = { 
        text: 'Sorry, there was an error processing your message.', 
        isUser: false 
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  return (
    <div className="flex flex-col h-[800px] w-full max-w-7xl mx-auto bg-background border rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Convincing Evidence</h2>
        <div>
          <a
            href="https://www.sagaftra.org/production-center/contract/810/agreement/document?page=0"
            className="text-blue-500 underline"
          >
            Using SAG-AFTRA Code
          </a>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <ChatMessage
              key={i}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your question..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}