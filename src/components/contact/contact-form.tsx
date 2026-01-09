'use client'

import { useMemo, useState } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { User, AtSign, Text, MessageSquareText, Send, LoaderCircle } from 'lucide-react'

const initialMessageData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export function ContactForm() {
  const [messageData, setMessageData] = useState(initialMessageData)
  const [loading, setLoading] = useState(false)

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const canSubmit = useMemo(() => {
    return (
      messageData.name.trim().length >= 2 &&
      isValidEmail(messageData.email.trim()) &&
      messageData.subject.trim().length >= 3 &&
      messageData.message.trim().length >= 10
    )
  }, [messageData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      toast.error('Email service is not configured. Please try again later.')
      return
    }

    if (!canSubmit) {
      toast.error('Please fill all fields correctly.')
      return
    }

    setLoading(true)
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_name: 'Romjan Ali',
          from_name: messageData.name.trim(),
          from_email: messageData.email.trim(),
          subject: messageData.subject.trim(),
          message: messageData.message.trim(),
        },
        { publicKey }
      )

      toast.success('Message sent successfully')
      setMessageData(initialMessageData)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 rounded-2xl pl-10"
            placeholder="e.g. Alex Traveler"
            value={messageData.name}
            onChange={(e) => setMessageData((p) => ({ ...p, name: e.target.value }))}
            disabled={loading}
            autoComplete="name"
          />
        </div>
        <p className="text-xs text-muted-foreground">Use your real name for faster support.</p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            className="h-11 rounded-2xl pl-10"
            placeholder="you@example.com"
            value={messageData.email}
            onChange={(e) => setMessageData((p) => ({ ...p, email: e.target.value }))}
            disabled={loading}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Subject</label>
        <div className="relative">
          <Text className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 rounded-2xl pl-10"
            placeholder="What do you need help with?"
            value={messageData.subject}
            onChange={(e) => setMessageData((p) => ({ ...p, subject: e.target.value }))}
            disabled={loading}
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <div className="relative">
          <MessageSquareText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            className="min-h-[140px] rounded-2xl pl-10"
            placeholder="Write your message… (include steps, device/browser, screenshots if it's a bug)"
            value={messageData.message}
            onChange={(e) => setMessageData((p) => ({ ...p, message: e.target.value }))}
            disabled={loading}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Please don’t include passwords or sensitive payment details.
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="h-11 w-full rounded-2xl"
        disabled={loading || !canSubmit}
      >
        {loading ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  )
}
