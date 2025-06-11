"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Trophy, Gift, Users, TrendingUp, Award } from "lucide-react"

export default function PointsSystem() {
  const [userStats] = useState({
    totalPoints: 1250,
    level: 12,
    nextLevelPoints: 1500,
    streak: 7,
    badges: ["bronze_donor", "silver_supporter", "chat_master"],
    rank: 15,
  })

  const [leaderboard] = useState([
    { rank: 1, name: "علی احمدی", points: 5420, level: 54 },
    { rank: 2, name: "مریم رضایی", points: 4890, level: 48 },
    { rank: 3, name: "حسین محمدی", points: 4320, level: 43 },
    { rank: 4, name: "فاطمه کریمی", points: 3950, level: 39 },
    { rank: 5, name: "محمد حسینی", points: 3680, level: 36 },
  ])

  const [rewards] = useState([
    { id: 1, name: "نشان برنزی", cost: 100, type: "badge", available: true },
    { id: 2, name: "نشان نقره‌ای", cost: 500, type: "badge", available: true },
    { id: 3, name: "نشان طلایی", cost: 1000, type: "badge", available: false },
    { id: 4, name: "دسترسی VIP", cost: 2000, type: "privilege", available: false },
    { id: 5, name: "تی‌شرت اختصاصی", cost: 3000, type: "physical", available: false },
  ])

  const progressToNextLevel = ((userStats.totalPoints % 100) / 100) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">سیستم امتیازدهی</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* آمار کاربر */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">امتیاز کل</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                تا سطح بعد: {userStats.nextLevelPoints - userStats.totalPoints} امتیاز
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">سطح فعلی</CardTitle>
              <Trophy className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">سطح {userStats.level}</div>
              <Progress value={progressToNextLevel} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">روزهای متوالی</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.streak} روز</div>
              <p className="text-xs text-muted-foreground">بونوس فعال</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رتبه شما</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{userStats.rank}</div>
              <p className="text-xs text-muted-foreground">در جدول امتیازات</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="leaderboard">جدول امتیازات</TabsTrigger>
            <TabsTrigger value="rewards">جوایز</TabsTrigger>
            <TabsTrigger value="settings">تنظیمات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>نشان‌های کسب شده</CardTitle>
                  <CardDescription>نشان‌هایی که تاکنون کسب کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userStats.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {badge === "bronze_donor" && "اهداکننده برنزی"}
                        {badge === "silver_supporter" && "حامی نقره‌ای"}
                        {badge === "chat_master" && "استاد چت"}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>نحوه کسب امتیاز</CardTitle>
                  <CardDescription>راه‌های مختلف کسب امتیاز</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>هر 1000 تومان دونیت</span>
                    <Badge>+1 امتیاز</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>دونیت روزانه (بونوس)</span>
                    <Badge>+2 امتیاز</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>فعالیت در چت</span>
                    <Badge>+0.1 امتیاز</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>دعوت دوستان</span>
                    <Badge>+10 امتیاز</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>جدول امتیازات</CardTitle>
                <CardDescription>برترین اهداکنندگان این ماه</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">#{user.rank}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">سطح {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{user.points.toLocaleString()} امتیاز</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>فروشگاه جوایز</CardTitle>
                <CardDescription>امتیازهای خود را با جوایز مختلف تبدیل کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <h3 className="font-medium">{reward.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {reward.type === "badge" && "نشان"}
                        {reward.type === "privilege" && "امتیاز ویژه"}
                        {reward.type === "physical" && "جایزه فیزیکی"}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-600">{reward.cost} امتیاز</span>
                        <Button size="sm" disabled={!reward.available || userStats.totalPoints < reward.cost}>
                          {reward.available ? "دریافت" : "ناموجود"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات سیستم امتیازدهی</CardTitle>
                <CardDescription>تنظیمات مربوط به نمایش و محاسبه امتیازها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">نمایش امتیاز در چت</p>
                    <p className="text-sm text-gray-500">نمایش امتیاز کنار نام در چت</p>
                  </div>
                  <Button variant="outline" size="sm">
                    فعال
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">اعلان کسب امتیاز</p>
                    <p className="text-sm text-gray-500">نمایش اعلان هنگام کسب امتیاز</p>
                  </div>
                  <Button variant="outline" size="sm">
                    فعال
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">مشارکت در جدول امتیازات</p>
                    <p className="text-sm text-gray-500">نمایش نام شما در جدول عمومی</p>
                  </div>
                  <Button variant="outline" size="sm">
                    فعال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
