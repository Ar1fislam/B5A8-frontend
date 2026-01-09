// // frontend/components/messages/chat-window.tsx



'use client'

import type React from 'react'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

import { messageAPI } from '@/lib/api'
import { socketClient } from '@/lib/socket'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  ImageIcon,
  Mic,
  X,
} from 'lucide-react'

import { format } from 'date-fns'
import type { ApiResponse } from '@/types'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  read: boolean
  sender: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string | null
    }
  }
}

interface ChatWindowProps {
  otherUser: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string | null
    }
  }
  matchId?: string
  onClose?: () => void
}

export function ChatWindow({ otherUser, matchId, onClose }: ChatWindowProps) {
  const { user } = useAuth()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const socket = socketClient.getSocket()

  const otherName = useMemo(
    () => otherUser.profile?.fullName || 'Traveler',
    [otherUser.profile?.fullName]
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatMessageDate = (dateString: string) => {
    if (isToday(dateString)) return 'Today'
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const formatMessageTime = (dateString: string) => format(new Date(dateString), 'HH:mm')

  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      const date = formatMessageDate(message.createdAt)
      if (!groups[date]) groups[date] = []
      groups[date].push(message)
      return groups
    }, {} as Record<string, Message[]>)
  }, [messages])

  const fetchMessages = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await messageAPI.getConversation(otherUser.id)
      const fetched =
        (result as ApiResponse<{ messages: Message[] }>).data?.messages || []

      setMessages(fetched)

      const unreadIds = fetched
        .filter((msg) => msg.senderId === otherUser.id && !msg.read)
        .map((msg) => msg.id)

      if (unreadIds.length > 0) {
        await messageAPI.markAsRead(unreadIds)
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error('Failed to load messages:', error.message)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }, [otherUser.id])

  const handleNewMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message])

      // Mark as read if it's from the other user
      if (message.senderId === otherUser.id) {
        messageAPI.markAsRead([message.id])
      }
    },
    [otherUser.id]
  )

  const handleUserTyping = useCallback(
    (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === otherUser.id) setIsOtherTyping(data.isTyping)
    },
    [otherUser.id]
  )

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    // Join + listeners
    if (!socket || !user) return

    socket.emit('join', user.id)
    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleUserTyping)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleUserTyping)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [socket, user, handleNewMessage, handleUserTyping])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleTyping = useCallback(() => {
    if (!socket) return

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    socket.emit('typing', { receiverId: otherUser.id, isTyping: true })

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { receiverId: otherUser.id, isTyping: false })
    }, 900)
  }, [socket, otherUser.id])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !socket) return

    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      // Optimistic message
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        senderId: user.id,
        receiverId: otherUser.id,
        createdAt: new Date().toISOString(),
        read: false,
        sender: {
          id: user.id,
          profile: user.profile,
        },
      }

      setMessages((prev) => [...prev, tempMessage])

      socket.emit('send_message', {
        receiverId: otherUser.id,
        content: messageContent,
        matchId,
      })
    } catch (error: unknown) {
      if (error instanceof Error) console.error('Failed to send message:', error.message)
      toast.error('Failed to send message')
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-')))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh] overflow-hidden rounded-3xl border bg-background/70 backdrop-blur">
      {/* Header */}
      <CardHeader className="border-b p-4 bg-linear-to-r from-primary/10 via-background to-secondary/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-11 w-11 rounded-2xl">
              <AvatarImage src={otherUser.profile?.profileImage ?? undefined} />
              <AvatarFallback className="rounded-2xl">
                {otherName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-semibold truncate">{otherName}</h3>

                <Badge variant={socketClient.isConnected() ? 'default' : 'secondary'} className="rounded-full">
                  {socketClient.isConnected() ? 'Online' : 'Offline'}
                </Badge>

                {isOtherTyping && (
                  <span className="text-xs text-muted-foreground animate-pulse">
                    typing…
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground truncate">
                Chat to confirm dates, budget, and travel style.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" aria-label="More">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No messages yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation with {otherName}.
                </p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  {/* Date chip */}
                  <div className="flex justify-center my-4">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {date}
                    </Badge>
                  </div>

                  {dateMessages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id
                    const isTemp = message.id.startsWith('temp-')

                    return (
                      <div
                        key={message.id}
                        className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex max-w-[78%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {!isOwnMessage && (
                            <Avatar className="h-8 w-8 mt-1 mr-2 rounded-2xl">
                              <AvatarImage
                                src={message.sender.profile?.profileImage ?? undefined}
                              />
                              <AvatarFallback className="rounded-2xl">
                                {message.sender.profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={[
                              'px-4 py-2.5 shadow-sm',
                              'rounded-3xl',
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground rounded-tr-md'
                                : 'bg-muted rounded-tl-md',
                            ].join(' ')}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>

                            <div
                              className={[
                                'flex items-center justify-end gap-1 mt-1',
                                isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground',
                              ].join(' ')}
                            >
                              <span className="text-xs">{formatMessageTime(message.createdAt)}</span>

                              {isOwnMessage &&
                                (message.read ? (
                                  <CheckCheck className="h-3.5 w-3.5" />
                                ) : isTemp ? (
                                  <Clock className="h-3.5 w-3.5" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Composer */}
      <CardFooter className="border-t p-4 bg-background/60 backdrop-blur">
        <div className="flex w-full items-center gap-2 rounded-3xl border bg-background px-2 py-2">
          <Button variant="ghost" size="icon" className="rounded-2xl" aria-label="Attach">
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-2xl" aria-label="Image">
            <ImageIcon className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${otherName}...`}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-2xl"
              aria-label="Emoji"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="rounded-2xl"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-2xl" aria-label="Voice">
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}









