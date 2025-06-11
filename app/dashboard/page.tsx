"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, BarChart3, Settings, Star, MessageCircle, Zap, CreditCard, Target, Shield } from "lucide-react"

export default function Dashboard() {
  const [stats] = useState({
    totalDonations: 125000,
    donationsCount: 45,
    points: 1250,
    level: 12,
    chatMessages: 2340,
    apiCalls: 890,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">داشبورد DonateStream</h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                سطح {stats.level}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {stats.points.toLocaleString()} امتیاز
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل دونیت‌ها</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonations.toLocaleString()} تومان</div>
              <p className="text-xs text-muted-foreground">{stats.donationsCount} دونیت</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">امتیاز کل</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.points.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">سطح {stats.level}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">پیام‌های چت</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chatMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">این ماه</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">فراخوانی API</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">این ماه</p>
            </CardContent>
          </Card>
        </div>

        {/* منوی اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ویژگی‌های اصلی */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                مدیریت دونیت‌ها
              </CardTitle>
              <CardDescription>مشاهده و مدیریت دونیت‌های دریافتی</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/donations">
                <Button className="w-full">مشاهده دونیت‌ها</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                سیستم امتیازدهی
              </CardTitle>
              <CardDescription>مدیریت امتیازها، جوایز و رتبه‌بندی</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/points-system">
                <Button className="w-full">مدیریت امتیازها</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                چت زنده
              </CardTitle>
              <CardDescription>مدیریت چت و تعامل با بینندگان</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/live-chat">
                <Button className="w-full">مدیریت چت</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                API های عمومی
              </CardTitle>
              <CardDescription>مدیریت کلیدهای API و مجوزها</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/api-management">
                <Button className="w-full">مدیریت API</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                اهداف دونیت
              </CardTitle>
              <CardDescription>تنظیم و مدیریت اهداف دونیت</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/goals">
                <Button className="w-full">مدیریت اهداف</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                گزارش‌های مالی
              </CardTitle>
              <CardDescription>آمار و گزارش‌های تفصیلی</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/financial-reports">
                <Button className="w-full">مشاهده گزارش‌ها</Button>
              </Link>
            </CardContent>
          </Card>

          {/* تنظیمات */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                تنظیمات پرداخت
              </CardTitle>
              <CardDescription>مدیریت روش‌های پرداخت</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/payment-settings">
                <Button className="w-full" variant="outline">
                  تنظیمات
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                تنظیمات پیشرفته
              </CardTitle>
              <CardDescription>امنیت و تنظیمات پیشرفته</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/advanced-settings">
                <Button className="w-full" variant="outline">
                  تنظیمات پیشرفته
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                تنظیمات عمومی
              </CardTitle>
              <CardDescription>تنظیمات حساب کاربری</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/settings">
                <Button className="w-full" variant="outline">
                  تنظیمات
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* لینک‌های OBS */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>لینک‌های OBS</CardTitle>
            <CardDescription>این لینک‌ها را در OBS به عنوان Browser Source اضافه کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">اعلان دونیت</h4>
                <code className="text-xs bg-white p-2 rounded block break-all">
                  {process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/obs/alerts/username
                </code>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">نوار پیشرفت هدف</h4>
                <code className="text-xs bg-white p-2 rounded block break-all">
                  {process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/obs/goal/username
                </code>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">آخرین دونیت‌ها</h4>
                <code className="text-xs bg-white p-2 rounded block break-all">
                  {process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/obs/recent/username
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
