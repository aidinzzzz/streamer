"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getUserData, getSubscriptionData, subscribeToplan, cancelSubscription } from "@/lib/api"
import { Check, Crown, Star, Zap, Users } from "lucide-react"

const subscriptionPlans = [
  {
    id: "basic",
    name: "پایه",
    price: 49000,
    priceUSD: 1,
    duration: "ماهانه",
    features: ["تا 100 دونیت در ماه", "اعلان‌های پایه", "آمار ساده", "پشتیبانی ایمیل"],
    limits: {
      donations: 100,
      alerts: "basic",
      analytics: "basic",
      support: "email",
    },
    popular: false,
  },
  {
    id: "pro",
    name: "حرفه‌ای",
    price: 99000,
    priceUSD: 2,
    duration: "ماهانه",
    features: [
      "دونیت نامحدود",
      "اعلان‌های سفارشی",
      "آمار پیشرفته",
      "نوار پیشرفت هدف",
      "پشتیبانی اولویت‌دار",
      "تنظیمات پیشرفته",
    ],
    limits: {
      donations: "unlimited",
      alerts: "custom",
      analytics: "advanced",
      support: "priority",
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "سازمانی",
    price: 199000,
    priceUSD: 4,
    duration: "ماهانه",
    features: [
      "همه ویژگی‌های حرفه‌ای",
      "چندین کانال استریم",
      "API اختصاصی",
      "گزارش‌های مالی تفصیلی",
      "مدیریت تیم",
      "پشتیبانی 24/7",
      "تنظیمات سفارشی کامل",
    ],
    limits: {
      donations: "unlimited",
      channels: "multiple",
      api: "dedicated",
      analytics: "enterprise",
      support: "24/7",
    },
    popular: false,
  },
]

export default function SubscriptionPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData()
        setUser(userData)

        const subscriptionData = await getSubscriptionData()
        setSubscription(subscriptionData)
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSubscribe = async (planId: string) => {
    setProcessing(true)
    setError("")
    setSuccess("")

    try {
      const result = await subscribeToplan(planId)
      if (result.success) {
        setSuccess("اشتراک با موفقیت فعال شد!")
        // Refresh subscription data
        const subscriptionData = await getSubscriptionData()
        setSubscription(subscriptionData)
      } else {
        setError(result.message || "خطا در فعال‌سازی اشتراک")
      }
    } catch (err) {
      setError("خطا در پردازش درخواست")
    } finally {
      setProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    setProcessing(true)
    setError("")
    setSuccess("")

    try {
      const result = await cancelSubscription()
      if (result.success) {
        setSuccess("اشتراک با موفقیت لغو شد")
        setSubscription(null)
      } else {
        setError(result.message || "خطا در لغو اشتراک")
      }
    } catch (err) {
      setError("خطا در پردازش درخواست")
    } finally {
      setProcessing(false)
    }
  }

  const getCurrentPlan = () => {
    if (!subscription || subscription.status !== "active") return null
    return subscriptionPlans.find((plan) => plan.id === subscription.planId)
  }

  const getDaysRemaining = () => {
    if (!subscription) return 0
    const endDate = new Date(subscription.endDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getUsagePercentage = () => {
    if (!subscription || !user) return 0
    const currentPlan = getCurrentPlan()
    if (!currentPlan || currentPlan.limits.donations === "unlimited") return 0

    const used = user.donationCount || 0
    const limit = currentPlan.limits.donations
    return Math.min(100, (used / limit) * 100)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    )
  }

  const currentPlan = getCurrentPlan()
  const daysRemaining = getDaysRemaining()
  const usagePercentage = getUsagePercentage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Crown className="h-6 w-6 ml-2 text-purple-600" />
        <h1 className="text-2xl font-bold">مدیریت اشتراک</h1>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">اشتراک فعلی</TabsTrigger>
          <TabsTrigger value="plans">پلان‌ها</TabsTrigger>
          <TabsTrigger value="billing">صورتحساب</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {currentPlan ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 ml-2 text-yellow-500" />
                      پلان فعلی: {currentPlan.name}
                    </CardTitle>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      فعال
                    </Badge>
                  </div>
                  <CardDescription>{daysRemaining} روز تا پایان اشتراک</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>استفاده از دونیت‌ها</span>
                      <span>
                        {user.donationCount || 0} /{" "}
                        {currentPlan.limits.donations === "unlimited" ? "∞" : currentPlan.limits.donations}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">ویژگی‌های فعال:</h4>
                    <ul className="space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 ml-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" onClick={handleCancelSubscription} disabled={processing} className="w-full">
                    {processing ? "در حال پردازش..." : "لغو اشتراک"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>آمار استفاده</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{user.donationCount || 0}</div>
                      <div className="text-sm text-gray-600">دونیت‌های دریافتی</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(user.totalDonations || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">کل درآمد (تومان)</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">اعلان‌های ارسالی</span>
                      <span className="text-sm font-medium">∞</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">گزارش‌های تولید شده</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">درخواست‌های پشتیبانی</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>اشتراک فعالی ندارید</CardTitle>
                <CardDescription>برای استفاده از ویژگی‌های پیشرفته، یکی از پلان‌ها را انتخاب کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => document.querySelector('[value="plans"]')?.click()}>مشاهده پلان‌ها</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-purple-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">محبوب‌ترین</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    {plan.id === "basic" && <Users className="h-5 w-5 ml-2" />}
                    {plan.id === "pro" && <Zap className="h-5 w-5 ml-2" />}
                    {plan.id === "enterprise" && <Crown className="h-5 w-5 ml-2" />}
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{plan.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">تومان / {plan.duration}</div>
                    <div className="text-xs text-gray-400">(${plan.priceUSD} USD)</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 ml-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processing || (currentPlan && currentPlan.id === plan.id)}
                  >
                    {processing
                      ? "در حال پردازش..."
                      : currentPlan && currentPlan.id === plan.id
                        ? "پلان فعلی"
                        : "انتخاب پلان"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>مقایسه ویژگی‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">ویژگی</th>
                      <th className="text-center p-2">پایه</th>
                      <th className="text-center p-2">حرفه‌ای</th>
                      <th className="text-center p-2">سازمانی</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">تعداد دونیت</td>
                      <td className="text-center p-2">100/ماه</td>
                      <td className="text-center p-2">نامحدود</td>
                      <td className="text-center p-2">نامحدود</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">اعلان‌های سفارشی</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">✅</td>
                      <td className="text-center p-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">آمار پیشرفته</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">✅</td>
                      <td className="text-center p-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">API اختصاصی</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">❌</td>
                      <td className="text-center p-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">پشتیبانی</td>
                      <td className="text-center p-2">ایمیل</td>
                      <td className="text-center p-2">اولویت‌دار</td>
                      <td className="text-center p-2">24/7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تاریخچه پرداخت‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription && subscription.billingHistory ? (
                <div className="space-y-4">
                  {subscription.billingHistory.map((bill: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{bill.planName}</div>
                        <div className="text-sm text-gray-500">{bill.date}</div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{bill.amount.toLocaleString()} تومان</div>
                        <Badge variant={bill.status === "paid" ? "default" : "destructive"}>
                          {bill.status === "paid" ? "پرداخت شده" : "ناموفق"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">تاریخچه پرداختی وجود ندارد</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تنظیمات صورتحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">تجدید خودکار</div>
                  <div className="text-sm text-gray-500">اشتراک به صورت خودکار تجدید شود</div>
                </div>
                <Badge variant="default">فعال</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">روش پرداخت</div>
                  <div className="text-sm text-gray-500">کارت منتهی به 1234</div>
                </div>
                <Button variant="outline" size="sm">
                  تغییر
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
