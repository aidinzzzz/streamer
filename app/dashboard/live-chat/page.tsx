"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MessageCircle, Send, Settings, Users, Shield, BarChart3, Trash2, Clock, Ban } from "lucide-react"

interface ChatMessage {
  id: number
  user: string
  message: string
  timestamp: Date
  type: "user" | "donation" | "system"
  amount?: number
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: "علی احمدی",
      message: "سلام! استریم عالی بود",
      timestamp: new Date(Date.now() - 300000),
      type: "user",
    },
    {
      id: 2,
      user: "مریم رضایی",
      message: "دونیت 50000 تومانی",
      timestamp: new Date(Date.now() - 240000),
      type: "donation",
      amount: 50000,
    },
    {
      id: 3,
      user: "سیستم",
      message: "حسین محمدی به چت پیوست",
      timestamp: new Date(Date.now() - 180000),
      type: "system",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [chatSettings, setChatSettings] = useState({
    enabled: true,
    slowMode: false,
    slowModeDelay: 5,
    subscribersOnly: false,
    moderationEnabled: true,
    maxMessageLength: 200,
  })

  const [chatStats] = useState({
    totalMessages: 2340,
    activeUsers: 45,
    moderatedMessages: 12,
    bannedUsers: 3,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now(),
      user: "شما (مدیر)",
      message: newMessage,
      timestamp: new Date(),
      type: "user",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  const timeoutUser = (username: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now(),
      user: "سیستم",
      message: `${username} برای 5 دقیقه تایم‌اوت شد`,
      timestamp: new Date(),
      type: "system",
    }
    setMessages((prev) => [...prev, systemMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">چت زنده</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* چت اصلی */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    چت زنده
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {chatStats.activeUsers} کاربر آنلاین
                    </Badge>
                    <Switch
                      checked={chatSettings.enabled}
                      onCheckedChange={(checked) => setChatSettings((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* پیام‌ها */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-gray-50 rounded">
                  {messages.map((message) => (
                    <div key={message.id} className="group">
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === "donation"
                            ? "bg-yellow-100 border border-yellow-200"
                            : message.type === "system"
                              ? "bg-blue-100 border border-blue-200"
                              : "bg-white border"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.user}</span>
                              {message.amount && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.amount.toLocaleString()} تومان
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>

                          {message.type === "user" && (
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => deleteMessage(message.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => timeoutUser(message.user)}>
                                <Clock className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* ارسال پیام */}
                <div className="flex gap-2">
                  <Input
                    placeholder="پیام خود را بنویسید..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={!chatSettings.enabled}
                  />
                  <Button onClick={sendMessage} disabled={!chatSettings.enabled}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* تنظیمات و آمار */}
          <div className="space-y-6">
            {/* آمار چت */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  آمار چت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>کل پیام‌ها:</span>
                  <span className="font-bold">{chatStats.totalMessages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>کاربران آنلاین:</span>
                  <span className="font-bold">{chatStats.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span>پیام‌های مدیریت شده:</span>
                  <span className="font-bold">{chatStats.moderatedMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span>کاربران مسدود:</span>
                  <span className="font-bold">{chatStats.bannedUsers}</span>
                </div>
              </CardContent>
            </Card>

            {/* تنظیمات چت */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  تنظیمات چت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chat-enabled">فعال بودن چت</Label>
                  <Switch
                    id="chat-enabled"
                    checked={chatSettings.enabled}
                    onCheckedChange={(checked) => setChatSettings((prev) => ({ ...prev, enabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="slow-mode">حالت آهسته</Label>
                  <Switch
                    id="slow-mode"
                    checked={chatSettings.slowMode}
                    onCheckedChange={(checked) => setChatSettings((prev) => ({ ...prev, slowMode: checked }))}
                  />
                </div>

                {chatSettings.slowMode && (
                  <div className="space-y-2">
                    <Label htmlFor="slow-delay">تاخیر (ثانیه)</Label>
                    <Input
                      id="slow-delay"
                      type="number"
                      value={chatSettings.slowModeDelay}
                      onChange={(e) =>
                        setChatSettings((prev) => ({
                          ...prev,
                          slowModeDelay: Number.parseInt(e.target.value) || 5,
                        }))
                      }
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="subscribers-only">فقط اشتراک‌دارها</Label>
                  <Switch
                    id="subscribers-only"
                    checked={chatSettings.subscribersOnly}
                    onCheckedChange={(checked) => setChatSettings((prev) => ({ ...prev, subscribersOnly: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="moderation">مدیریت خودکار</Label>
                  <Switch
                    id="moderation"
                    checked={chatSettings.moderationEnabled}
                    onCheckedChange={(checked) => setChatSettings((prev) => ({ ...prev, moderationEnabled: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-length">حداکثر طول پیام</Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={chatSettings.maxMessageLength}
                    onChange={(e) =>
                      setChatSettings((prev) => ({
                        ...prev,
                        maxMessageLength: Number.parseInt(e.target.value) || 200,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* ابزارهای مدیریت */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  ابزارهای مدیریت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Ban className="h-4 w-4 mr-2" />
                  مسدود کردن کاربر
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  تایم‌اوت کاربر
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  پاک کردن چت
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  لیست مدیران
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
