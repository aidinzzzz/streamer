"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserData, updatePaymentSettings } from "@/lib/api"

export default function PaymentSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [paymentSettings, setPaymentSettings] = useState({
    zarinpal: {
      enabled: true,
      merchantId: "",
    },
    paypal: {
      enabled: true,
      clientId: "",
      secret: "",
    },
    creditCard: {
      enabled: true,
    },
    crypto: {
      enabled: true,
      bitcoin: true,
      ethereum: true,
      tether: true,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData()
        setUser(userData)

        // If user has payment settings, load them
        if (userData.paymentSettings) {
          setPaymentSettings(userData.paymentSettings)
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
      await updatePaymentSettings(paymentSettings)
      setSuccess(true)
    } catch (error) {
      setError("خطا در ذخیره تنظیمات")
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePaymentMethod = (method: string, value: boolean) => {
    setPaymentSettings((prev) => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        enabled: value,
      },
    }))
  }

  const handleToggleCryptoMethod = (crypto: string, value: boolean) => {
    setPaymentSettings((prev) => ({
      ...prev,
      crypto: {
        ...prev.crypto,
        [crypto]: value,
      },
    }))
  }

  const handleInputChange = (method: string, field: string, value: string) => {
    setPaymentSettings((prev) => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        [field]: value,
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تنظیمات پرداخت</h1>

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

      <Tabs defaultValue="zarinpal">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="zarinpal">زرین‌پال</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="creditcard">کارت اعتباری</TabsTrigger>
          <TabsTrigger value="crypto">ارز دیجیتال</TabsTrigger>
        </TabsList>

        <TabsContent value="zarinpal">
          <Card>
            <CardHeader>
              <CardTitle>زرین‌پال</CardTitle>
              <CardDescription>تنظیمات زرین‌پال</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="zarinpal-enabled">فعال</Label>
                <Switch
                  id="zarinpal-enabled"
                  checked={paymentSettings.zarinpal.enabled}
                  onCheckedChange={(value) => handleTogglePaymentMethod("zarinpal", value)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="zarinpal-merchantId">شناسه‌مرچنت</Label>
                <Input
                  id="zarinpal-merchantId"
                  value={paymentSettings.zarinpal.merchantId}
                  onChange={(e) => handleInputChange("zarinpal", "merchantId", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <CardTitle>PayPal</CardTitle>
              <CardDescription>تنظیمات PayPal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="paypal-enabled">فعال</Label>
                <Switch
                  id="paypal-enabled"
                  checked={paymentSettings.paypal.enabled}
                  onCheckedChange={(value) => handleTogglePaymentMethod("paypal", value)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="paypal-clientId">شناسه کلاینت</Label>
                <Input
                  id="paypal-clientId"
                  value={paymentSettings.paypal.clientId}
                  onChange={(e) => handleInputChange("paypal", "clientId", e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="paypal-secret">رمز مخفی</Label>
                <Input
                  id="paypal-secret"
                  value={paymentSettings.paypal.secret}
                  onChange={(e) => handleInputChange("paypal", "secret", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creditcard">
          <Card>
            <CardHeader>
              <CardTitle>کارت اعتباری</CardTitle>
              <CardDescription>تنظیمات کارت اعتباری</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="creditcard-enabled">فعال</Label>
                <Switch
                  id="creditcard-enabled"
                  checked={paymentSettings.creditCard.enabled}
                  onCheckedChange={(value) => handleTogglePaymentMethod("creditCard", value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle>ارز دیجیتال</CardTitle>
              <CardDescription>تنظیمات ارز دیجیتال</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="crypto-enabled">فعال</Label>
                <Switch
                  id="crypto-enabled"
                  checked={paymentSettings.crypto.enabled}
                  onCheckedChange={(value) => handleTogglePaymentMethod("crypto", value)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="crypto-bitcoin">Bitcoin</Label>
                <Switch
                  id="crypto-bitcoin"
                  checked={paymentSettings.crypto.bitcoin}
                  onCheckedChange={(value) => handleToggleCryptoMethod("bitcoin", value)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="crypto-ethereum">Ethereum</Label>
                <Switch
                  id="crypto-ethereum"
                  checked={paymentSettings.crypto.ethereum}
                  onCheckedChange={(value) => handleToggleCryptoMethod("ethereum", value)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="crypto-tether">Tether</Label>
                <Switch
                  id="crypto-tether"
                  checked={paymentSettings.crypto.tether}
                  onCheckedChange={(value) => handleToggleCryptoMethod("tether", value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button className="mt-6" onClick={handleSaveSettings} disabled={saving}>
        {saving ? "در حال ذخیره‌سازی..." : "ذخیره تنظیمات"}
      </Button>
    </div>
  )
}
