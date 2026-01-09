'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useAuth } from '@/lib/auth-context'
import { messageAPI } from '@/lib/api'
import { socketClient } from '@/lib/socket'
import { ChatWindow } from '@/components/messages/chat-window'

import { Search, MessageCircle, Users, Send } from 'lucide-react'

interface Conversation {
  user: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  lastMessage?: {
    id: string
    content: string
    createdAt: string
    sender: {
      profile?: {
        fullName: string
      }
    }
  }
  unreadCount: number
}

interface ApiResponse {
  data: {
    conversations: Conversation[]
  }
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (user) {
      fetchConversations()
      socketClient.connect(user.id)
    }

    return () => {
      socketClient.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const result = (await messageAPI.getConversations()) as ApiResponse
      setConversations(result.data?.conversations || [])
    } catch (error: unknown) {
      console.error('Failed to load conversations:', error)
      toast.error('Failed to load conversations')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    if (searchQuery) {
      const name = conv.user.profile?.fullName || ''
      return name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    if (activeTab === 'unread') {
      return conv.unreadCount > 0
    }

    return true
  })

  const getSelectedUser = () => {
    if (!selectedConversation) return null
    return conversations.find((c) => c.user.id === selectedConversation)?.user
  }

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return format(date, 'HH:mm')
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return format(date, 'MMM d')
    }
  }

  const truncateMessage = (text: string, length = 30) => {
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Inbox</h1>
          <p className="text-muted-foreground">Chat with your matches and plan your trip.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Conversations */}
          <Card className="lg:col-span-1 flex flex-col rounded-3xl bg-card/60 backdrop-blur overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-base">Conversations</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {filteredConversations.length}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-2xl"
                  />
                </div>

                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread" className="relative">
                      Unread
                      {unreadTotal > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                          {unreadTotal}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                  <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                    <MessageCircle className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">No chats yet</h3>
                  <p className="text-sm text-muted-foreground">Start by exploring travelers.</p>
                  <Button size="sm" className="mt-4 rounded-xl" asChild>
                    <Link href="/explore">
                      <Users className="mr-2 h-4 w-4" />
                      Explore
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.user.id}
                      type="button"
                      className={`w-full text-left p-4 transition ${
                        selectedConversation === conversation.user.id
                          ? 'bg-accent/40'
                          : 'hover:bg-accent/25'
                      }`}
                      onClick={() => setSelectedConversation(conversation.user.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={conversation.user.profile?.profileImage || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {conversation.user.profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          {conversation.unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <h4 className="font-semibold truncate">
                              {conversation.user.profile?.fullName || 'Traveler'}
                            </h4>

                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground shrink-0">
                                {formatLastMessageTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>

                          {conversation.lastMessage ? (
                            <p className="text-sm text-muted-foreground truncate">
                              {truncateMessage(conversation.lastMessage.content, 46)}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground truncate">
                              No messages yet
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatWindow
                otherUser={
                  getSelectedUser() || {
                    id: selectedConversation,
                    profile: { fullName: 'Traveler' },
                  }
                }
                onClose={() => setSelectedConversation(null)}
              />
            ) : (
              <Card className="h-full overflow-hidden rounded-3xl bg-card/60 backdrop-blur">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-10">
                  <div className="relative mb-6">
                    <div
                      className="absolute inset-0 blur-2xl rounded-full bg-primary/15"
                      aria-hidden="true"
                    />
                    <div className="relative h-20 w-20 rounded-3xl border bg-background/60 flex items-center justify-center">
                      <MessageCircle className="h-9 w-9 text-muted-foreground" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight">No chat selected</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    Pick a conversation from the left to start messaging.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button asChild className="rounded-xl">
                      <Link href="/explore">
                        <Users className="mr-2 h-4 w-4" />
                        Explore travelers
                      </Link>
                    </Button>

                    <Button variant="outline" asChild className="rounded-xl">
                      <Link href="/matches">
                        <Send className="mr-2 h-4 w-4" />
                        Match requests
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}




