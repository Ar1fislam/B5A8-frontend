// frontend/components/messages/quick-chat.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ChatWindow } from './chat-window'
import { MessageSquare, X } from 'lucide-react'
import { DialogClose } from '@radix-ui/react-dialog'

interface QuickChatProps {
  otherUser: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string | null
    }
  }
  matchId?: string
  triggerText?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function QuickChat({
  otherUser,
  matchId,
  triggerText = 'Message',
  variant = 'default',
  size = 'default',
}: QuickChatProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="relative h-full">
          <ChatWindow
            otherUser={otherUser}
            matchId={matchId}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
