"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getUserData, getAdvancedPaymentSettings, updateAdvancedPaymentSettings } from "@/lib/api"
import { Shield, DollarSign, Settings, Bell, CreditCard, AlertTriangle } from "lucide-react"

export default function AdvancedPaymentSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [settings, setSettings] = useState({
    minDonationAmount: 1000,
    maxDonationAmount: 1000000,
    autoWithdrawal: false,
    withdrawalThreshold: 100000,
    commissionRate: 5,
    allowedCurrencies: ["IRR", "USD"],
    fraudDetection: true,
    webhookUrl: "",
    emailNotifications: true,
    smsNotifications: false,
    dailyLimit: 5000000,
    monthlyLimit: 50000000,
    suspiciousActivityAlert: true,
    requireVerificationAbove: 500000,
    blockVpnUsers: false,
    allowRecurringDonations: true,
    customFees: {
      zarinpal: 1.5,
      paypal: 3.4,
      creditcard: 2.9,
      crypto: 1.0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData()
        setUser(userData)

        const paymentSettings = await getAdvancedPaymentSettings()
        if (paymentSettings) {
          setSettings({ ...settings, ...paymentSettings })
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSaveSettings = async () => {
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      await updateAdvancedPaymentSettings(settings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setError("خطا در ذخیره تنظیمات")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomFeeChange = (method: string, value: number) => {
    setSettings((prev) => ({
      ...prev,
      customFees: {
        ...prev.customFees,
        [method]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 ml-2" />
        <h1 className="text-2xl font-bold">تنظیمات پیشرفته پرداخت</h1>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">تنظیمات با موفقیت ذخیره شد</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="limits" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="limits" className="flex items-center">
            <DollarSign className="h-4 w-4 ml-1" />
            محدودیت‌ها
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 ml-1" />
            امنیت
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 ml-1" />
            اعلان‌ها
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center">
            <CreditCard className="h-4 w-4 ml-1" />
            کارمزدها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>محدودیت‌های مبلغ</CardTitle>
              <CardDescription>تنظیم حداقل و حداکثر مبلغ دونیت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount">حداقل مبلغ دونیت (تومان)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={settings.minDonationAmount}
                    onChange={(e) => handleInputChange("minDonationAmount", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount">حداکثر مبلغ دونیت (تومان)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={settings.maxDonationAmount}
                    onChange={(e) => handleInputChange("maxDonationAmount", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dailyLimit">محدودیت روزانه (تومان)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={settings.dailyLimit}
                    onChange={(e) => handleInputChange("dailyLimit", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyLimit">محدودیت ماهانه (تومان)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={settings.monthlyLimit}
                    onChange={(e) => handleInputChange("monthlyLimit", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تنظیمات برداشت خودکار</CardTitle>
              <CardDescription>مدیریت برداشت خودکار وجوه</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoWithdrawal">برداشت خودکار</Label>
                  <p className="text-sm text-gray-500">وجوه به صورت خودکار به حساب شما واریز شود</p>
                </div>
                <Switch
                  id="autoWithdrawal"
                  checked={settings.autoWithdrawal}
                  onCheckedChange={(value) => handleInputChange("autoWithdrawal", value)}
                />
              </div>

              {settings.autoWithdrawal && (
                <div>
                  <Label htmlFor="withdrawalThreshold">آستانه برداشت (تومان)</Label>
                  <Input
                    id="withdrawalThreshold"
                    type="number"
                    value={settings.withdrawalThreshold}
                    onChange={(e) => handleInputChange("withdrawalThreshold", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    وقتی موجودی به این مبلغ برسد، به صورت خودکار برداشت می‌شود
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تشخیص تقلب</CardTitle>
              <CardDescription>تنظیمات امنیتی برای جلوگیری از تقلب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fraudDetection">تشخیص تقلب</Label>
                  <p className="text-sm text-gray-500">فعال‌سازی سیستم تشخیص تقلب</p>
                </div>
                <Switch
                  id="fraudDetection"
                  checked={settings.fraudDetection}
                  onCheckedChange={(value) => handleInputChange("fraudDetection", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="suspiciousAlert">هشدار فعالیت مشکوک</Label>
                  <p className="text-sm text-gray-500">اطلاع‌رسانی در صورت فعالیت مشکوک</p>
                </div>
                <Switch
                  id="suspiciousAlert"
                  checked={settings.suspiciousActivityAlert}
                  onCheckedChange={(value) => handleInputChange("suspiciousActivityAlert", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="blockVpn">مسدود کردن VPN</Label>
                  <p className="text-sm text-gray-500">جلوگیری از پرداخت از طریق VPN</p>
                </div>
                <Switch
                  id="blockVpn"
                  checked={settings.blockVpnUsers}
                  onCheckedChange={(value) => handleInputChange("blockVpnUsers", value)}
                />
              </div>

              <div>
                <Label htmlFor="verificationThreshold">آستانه تایید هویت (تومان)</Label>
                <Input
                  id="verificationThreshold"
                  type="number"
                  value={settings.requireVerificationAbove}
                  onChange={(e) => handleInputChange("requireVerificationAbove", Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-gray-500 mt-1">دونیت‌های بالای این مبلغ نیاز به تایید هویت دارند</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ارزهای مجاز</CardTitle>
              <CardDescription>انتخاب ارزهای قابل قبول</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["IRR", "USD", "EUR", "BTC", "ETH"].map((currency) => (
                  <Badge
                    key={currency}
                    variant={settings.allowedCurrencies.includes(currency) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newCurrencies = settings.allowedCurrencies.includes(currency)
                        ? settings.allowedCurrencies.filter((c) => c !== currency)
                        : [...settings.allowedCurrencies, currency]
                      handleInputChange("allowedCurrencies", newCurrencies)
                    }}
                  >
                    {currency}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اعلان‌ها</CardTitle>
              <CardDescription>تنظیم نحوه دریافت اعلان‌ها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">اعلان ایمیل</Label>
                  <p className="text-sm text-gray-500">دریافت اعلان‌ها از طریق ایمیل</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleInputChange("emailNotifications", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">اعلان پیامک</Label>
                  <p className="text-sm text-gray-500">دریافت اعلان‌ها از طریق پیامک</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(value) => handleInputChange("smsNotifications", value)}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="webhookUrl">آدرس Webhook</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-website.com/webhook"
                  value={settings.webhookUrl}
                  onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">برای دریافت اعلان‌های خودکار در وب‌سایت خود</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>کارمزد سفارشی</CardTitle>
              <CardDescription>تنظیم کارمزد برای هر روش پرداخت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zarinpalFee">کارمزد زرین‌پال (%)</Label>
                  <Input
                    id="zarinpalFee"
                    type="number"
                    step="0.1"
                    value={settings.customFees.zarinpal}
                    onChange={(e) => handleCustomFeeChange("zarinpal", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="paypalFee">کارمزد PayPal (%)</Label>
                  <Input
                    id="paypalFee"
                    type="number"
                    step="0.1"
                    value={settings.customFees.paypal}
                    onChange={(e) => handleCustomFeeChange("paypal", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="creditcardFee">کارمزد کارت اعتباری (%)</Label>
                  <Input
                    id="creditcardFee"
                    type="number"
                    step="0.1"
                    value={settings.customFees.creditcard}
                    onChange={(e) => handleCustomFeeChange("creditcard", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="cryptoFee">کارمزد ارز دیجیتال (%)</Label>
                  <Input
                    id="cryptoFee"
                    type="number"
                    step="0.1"
                    value={settings.customFees.crypto}
                    onChange={(e) => handleCustomFeeChange("crypto", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 ml-2" />
                  <p className="text-sm text-yellow-800">کارمزدهای بالا به کارمزد پلتفرم اضافه می‌شوند</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تنظیمات اضافی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="recurringDonations">دونیت‌های تکراری</Label>
                  <p className="text-sm text-gray-500">اجازه دونیت‌های ماهانه و تکراری</p>
                </div>
                <Switch
                  id="recurringDonations"
                  checked={settings.allowRecurringDonations}
                  onCheckedChange={(value) => handleInputChange("allowRecurringDonations", value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSaveSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
          {saving ? "در حال ذخیره‌سازی..." : "ذخیره تنظیمات"}
        </Button>
      </div>
    </div>
  )
}
