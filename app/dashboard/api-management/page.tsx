"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Copy, Eye, EyeOff, Plus, Trash2, Key, BarChart3, Shield, Book } from "lucide-react"

export default function ApiManagement() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Production API",
      key: "sk_live_1234567890abcdef",
      permissions: ["read:donations", "read:user", "write:goals"],
      lastUsed: "2 ساعت پیش",
      requests: 1250,
      status: "active",
    },
    {
      id: 2,
      name: "Development API",
      key: "sk_test_abcdef1234567890",
      permissions: ["read:donations", "read:user"],
      lastUsed: "1 روز پیش",
      requests: 89,
      status: "active",
    },
  ])

  const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({})
  const [newKeyName, setNewKeyName] = useState("")

  const toggleKeyVisibility = (id: number) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const createNewKey = () => {
    if (!newKeyName.trim()) return

    const newKey = {
      id: Date.now(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ["read:donations"],
      lastUsed: "هرگز",
      requests: 0,
      status: "active" as const,
    }

    setApiKeys((prev) => [...prev, newKey])
    setNewKeyName("")
  }

  const deleteKey = (id: number) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">مدیریت API های عمومی</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keys">کلیدهای API</TabsTrigger>
            <TabsTrigger value="permissions">مجوزها</TabsTrigger>
            <TabsTrigger value="usage">آمار استفاده</TabsTrigger>
            <TabsTrigger value="docs">مستندات</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-6">
            {/* ایجاد کلید جدید */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  ایجاد کلید API جدید
                </CardTitle>
                <CardDescription>کلید جدید برای دسترسی به API ایجاد کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="keyName">نام کلید</Label>
                    <Input
                      id="keyName"
                      placeholder="مثال: Production API"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={createNewKey} disabled={!newKeyName.trim()}>
                      ایجاد کلید
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* لیست کلیدها */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  کلیدهای موجود
                </CardTitle>
                <CardDescription>مدیریت کلیدهای API موجود</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <p className="text-sm text-gray-500">
                            آخرین استفاده: {apiKey.lastUsed} • {apiKey.requests} درخواست
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                            {apiKey.status === "active" ? "فعال" : "غیرفعال"}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => deleteKey(apiKey.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono">
                          {showKeys[apiKey.id] ? apiKey.key : "••••••••••••••••"}
                        </code>
                        <Button variant="outline" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                          {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  مجوزهای API
                </CardTitle>
                <CardDescription>تنظیم مجوزهای دسترسی برای کلیدهای API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">خواندن دونیت‌ها (read:donations)</p>
                      <p className="text-sm text-gray-500">دسترسی به لیست و جزئیات دونیت‌ها</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">نوشتن دونیت‌ها (write:donations)</p>
                      <p className="text-sm text-gray-500">ایجاد دونیت جدید از طریق API</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">خواندن پروفایل (read:user)</p>
                      <p className="text-sm text-gray-500">دسترسی به اطلاعات پروفایل کاربر</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">مدیریت اهداف (write:goals)</p>
                      <p className="text-sm text-gray-500">ایجاد و ویرایش اهداف دونیت</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">آمار و گزارش‌ها (read:analytics)</p>
                      <p className="text-sm text-gray-500">دسترسی به آمار و گزارش‌های تفصیلی</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">کل درخواست‌ها</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,339</div>
                  <p className="text-xs text-muted-foreground">این ماه</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">درخواست‌های موفق</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,287</div>
                  <p className="text-xs text-muted-foreground">96.1% نرخ موفقیت</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">خطاها</CardTitle>
                  <BarChart3 className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">52</div>
                  <p className="text-xs text-muted-foreground">3.9% نرخ خطا</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>آمار استفاده روزانه</CardTitle>
                <CardDescription>تعداد درخواست‌های API در 7 روز گذشته</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[120, 89, 156, 203, 178, 145, 167].map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className="bg-purple-500 rounded-t"
                        style={{ height: `${(value / 250) * 200}px`, width: "40px" }}
                      />
                      <span className="text-xs text-gray-500">{["ش", "ی", "د", "س", "چ", "پ", "ج"][index]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  مستندات API
                </CardTitle>
                <CardDescription>راهنمای کامل استفاده از API های عمومی</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">احراز هویت</h3>
                  <p className="text-gray-600 mb-3">
                    برای استفاده از API، کلید API خود را در هدر Authorization قرار دهید:
                  </p>
                  <code className="block bg-gray-100 p-3 rounded text-sm">Authorization: Bearer YOUR_API_KEY</code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Endpoints اصلی</h3>
                  <div className="space-y-4">
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/api/v1/donations</code>
                      </div>
                      <p className="text-sm text-gray-600">دریافت لیست دونیت‌ها</p>
                    </div>

                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/api/v1/donations</code>
                      </div>
                      <p className="text-sm text-gray-600">ایجاد دونیت جدید</p>
                    </div>

                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/api/v1/user/profile</code>
                      </div>
                      <p className="text-sm text-gray-600">دریافت اطلاعات پروفایل</p>
                    </div>

                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/api/v1/goals</code>
                      </div>
                      <p className="text-sm text-gray-600">دریافت اهداف دونیت</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">مثال استفاده</h3>
                  <code className="block bg-gray-100 p-3 rounded text-sm whitespace-pre">
                    {`curl -X GET "https://your-domain.com/api/v1/donations" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">محدودیت‌ها</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>حداکثر 1000 درخواست در ساعت</li>
                    <li>حداکثر 100 آیتم در هر درخواست</li>
                    <li>Rate limiting بر اساس IP و API key</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
