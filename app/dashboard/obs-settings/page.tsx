"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { getUserData, getOBSSettings, updateOBSSettings } from "@/lib/api"
import { Monitor, Volume2, ImageIcon, Palette, Zap, Target, Plus, Trash2, Eye } from "lucide-react"

interface DonationRule {
  id: string
  name: string
  minAmount: number
  maxAmount?: number
  gifUrl?: string
  soundUrl?: string
  duration: number
  animationType: string
  particleEffect: boolean
  textColor: string
  backgroundColor: string
  enabled: boolean
}

export default function OBSSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [obsSettings, setObsSettings] = useState({
    // تنظیمات عمومی
    alertDuration: 5,
    alertPosition: "center",
    alertSize: "medium",
    showDonorName: true,
    showAmount: true,
    showMessage: true,

    // تنظیمات صدا
    enableSound: true,
    soundVolume: 70,
    defaultSoundUrl: "",

    // تنظیمات انیمیشن
    animationStyle: "slideIn",
    particleEffects: true,
    backgroundBlur: false,

    // تنظیمات نوار هدف
    goalBarStyle: "modern",
    goalBarColor: "#8b5cf6",
    goalBarAnimation: true,
    showPercentage: true,
    showRemainingAmount: true,

    // تنظیمات رنگ و ظاهر
    primaryColor: "#8b5cf6",
    secondaryColor: "#ec4899",
    textColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 12,

    // تنظیمات پیشرفته
    customCSS: "",
    enableWebhook: false,
    webhookUrl: "",
  })

  const [donationRules, setDonationRules] = useState<DonationRule[]>([
    {
      id: "1",
      name: "دونیت کوچک",
      minAmount: 1000,
      maxAmount: 9999,
      duration: 3,
      animationType: "fadeIn",
      particleEffect: false,
      textColor: "#ffffff",
      backgroundColor: "rgba(59, 130, 246, 0.9)",
      enabled: true,
    },
    {
      id: "2",
      name: "دونیت متوسط",
      minAmount: 10000,
      maxAmount: 49999,
      gifUrl: "/gifs/medium-donation.gif",
      soundUrl: "/sounds/medium-donation.mp3",
      duration: 5,
      animationType: "slideIn",
      particleEffect: true,
      textColor: "#ffffff",
      backgroundColor: "rgba(139, 92, 246, 0.9)",
      enabled: true,
    },
    {
      id: "3",
      name: "دونیت بزرگ",
      minAmount: 50000,
      gifUrl: "/gifs/big-donation.gif",
      soundUrl: "/sounds/big-donation.mp3",
      duration: 8,
      animationType: "bounce",
      particleEffect: true,
      textColor: "#ffffff",
      backgroundColor: "rgba(236, 72, 153, 0.9)",
      enabled: true,
    },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData()
        setUser(userData)

        const settings = await getOBSSettings()
        if (settings) {
          setObsSettings({ ...obsSettings, ...settings })
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
      await updateOBSSettings({ ...obsSettings, donationRules })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setError("خطا در ذخیره تنظیمات")
    } finally {
      setSaving(false)
    }
  }

  const addNewRule = () => {
    const newRule: DonationRule = {
      id: Date.now().toString(),
      name: "قانون جدید",
      minAmount: 1000,
      duration: 5,
      animationType: "fadeIn",
      particleEffect: false,
      textColor: "#ffffff",
      backgroundColor: "rgba(59, 130, 246, 0.9)",
      enabled: true,
    }
    setDonationRules([...donationRules, newRule])
  }

  const updateRule = (id: string, updates: Partial<DonationRule>) => {
    setDonationRules((rules) => rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)))
  }

  const deleteRule = (id: string) => {
    setDonationRules((rules) => rules.filter((rule) => rule.id !== id))
  }

  const previewAlert = (rule: DonationRule) => {
    // ارسال پیش‌نمایش به صفحه OBS
    window.open(`/obs/preview?rule=${rule.id}`, "_blank", "width=800,height=600")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Monitor className="h-6 w-6 ml-2" />
        <h1 className="text-2xl font-bold">تنظیمات بصری OBS</h1>
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

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="rules">قوانین دونیت</TabsTrigger>
          <TabsTrigger value="appearance">ظاهر</TabsTrigger>
          <TabsTrigger value="goal">نوار هدف</TabsTrigger>
          <TabsTrigger value="sounds">صداها</TabsTrigger>
          <TabsTrigger value="advanced">پیشرفته</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">قوانین دونیت</h2>
            <Button onClick={addNewRule}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن قانون
            </Button>
          </div>

          <div className="space-y-4">
            {donationRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      {rule.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) => updateRule(rule.id, { enabled: checked })}
                      />
                      <Button variant="outline" size="sm" onClick={() => previewAlert(rule)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>نام قانون</Label>
                      <Input value={rule.name} onChange={(e) => updateRule(rule.id, { name: e.target.value })} />
                    </div>
                    <div>
                      <Label>حداقل مبلغ (تومان)</Label>
                      <Input
                        type="number"
                        value={rule.minAmount}
                        onChange={(e) => updateRule(rule.id, { minAmount: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>حداکثر مبلغ (تومان)</Label>
                      <Input
                        type="number"
                        value={rule.maxAmount || ""}
                        placeholder="نامحدود"
                        onChange={(e) =>
                          updateRule(rule.id, {
                            maxAmount: e.target.value ? Number.parseInt(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>مدت نمایش (ثانیه)</Label>
                      <Input
                        type="number"
                        value={rule.duration}
                        onChange={(e) => updateRule(rule.id, { duration: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>نوع انیمیشن</Label>
                      <Select
                        value={rule.animationType}
                        onValueChange={(value) => updateRule(rule.id, { animationType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fadeIn">محو شدن</SelectItem>
                          <SelectItem value="slideIn">لغزش</SelectItem>
                          <SelectItem value="bounce">پرش</SelectItem>
                          <SelectItem value="zoom">زوم</SelectItem>
                          <SelectItem value="flip">چرخش</SelectItem>
                          <SelectItem value="shake">لرزش</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>رنگ متن</Label>
                      <Input
                        type="color"
                        value={rule.textColor}
                        onChange={(e) => updateRule(rule.id, { textColor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>رنگ پس‌زمینه</Label>
                      <Input
                        type="color"
                        value={rule.backgroundColor.replace(
                          /rgba?$$[^)]+$$/,
                          rule.backgroundColor.includes("rgba") ? "#8b5cf6" : rule.backgroundColor,
                        )}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            backgroundColor: `rgba(${Number.parseInt(e.target.value.slice(1, 3), 16)}, ${Number.parseInt(e.target.value.slice(3, 5), 16)}, ${Number.parseInt(e.target.value.slice(5, 7), 16)}, 0.9)`,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>لینک GIF (اختیاری)</Label>
                      <Input
                        placeholder="https://example.com/animation.gif"
                        value={rule.gifUrl || ""}
                        onChange={(e) => updateRule(rule.id, { gifUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>لینک صدا (اختیاری)</Label>
                      <Input
                        placeholder="https://example.com/sound.mp3"
                        value={rule.soundUrl || ""}
                        onChange={(e) => updateRule(rule.id, { soundUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.particleEffect}
                        onCheckedChange={(checked) => updateRule(rule.id, { particleEffect: checked })}
                      />
                      <Label>افکت ذرات</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                تنظیمات ظاهری
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>موقعیت اعلان</Label>
                  <Select
                    value={obsSettings.alertPosition}
                    onValueChange={(value) => setObsSettings((prev) => ({ ...prev, alertPosition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">بالا</SelectItem>
                      <SelectItem value="center">وسط</SelectItem>
                      <SelectItem value="bottom">پایین</SelectItem>
                      <SelectItem value="top-left">بالا چپ</SelectItem>
                      <SelectItem value="top-right">بالا راست</SelectItem>
                      <SelectItem value="bottom-left">پایین چپ</SelectItem>
                      <SelectItem value="bottom-right">پایین راست</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>اندازه اعلان</Label>
                  <Select
                    value={obsSettings.alertSize}
                    onValueChange={(value) => setObsSettings((prev) => ({ ...prev, alertSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">کوچک</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">بزرگ</SelectItem>
                      <SelectItem value="xl">خیلی بزرگ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>نوع انیمیشن</Label>
                  <Select
                    value={obsSettings.animationStyle}
                    onValueChange={(value) => setObsSettings((prev) => ({ ...prev, animationStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slideIn">لغزش</SelectItem>
                      <SelectItem value="fadeIn">محو شدن</SelectItem>
                      <SelectItem value="bounce">پرش</SelectItem>
                      <SelectItem value="zoom">زوم</SelectItem>
                      <SelectItem value="flip">چرخش</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>مدت نمایش (ثانیه)</Label>
                  <Slider
                    value={[obsSettings.alertDuration]}
                    onValueChange={(value) => setObsSettings((prev) => ({ ...prev, alertDuration: value[0] }))}
                    max={15}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-center text-sm text-gray-500 mt-1">{obsSettings.alertDuration} ثانیه</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>رنگ اصلی</Label>
                  <Input
                    type="color"
                    value={obsSettings.primaryColor}
                    onChange={(e) => setObsSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>رنگ ثانویه</Label>
                  <Input
                    type="color"
                    value={obsSettings.secondaryColor}
                    onChange={(e) => setObsSettings((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>رنگ متن</Label>
                  <Input
                    type="color"
                    value={obsSettings.textColor}
                    onChange={(e) => setObsSettings((prev) => ({ ...prev, textColor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>شعاع گوشه</Label>
                  <Slider
                    value={[obsSettings.borderRadius]}
                    onValueChange={(value) => setObsSettings((prev) => ({ ...prev, borderRadius: value[0] }))}
                    max={50}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-center text-sm text-gray-500 mt-1">{obsSettings.borderRadius}px</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.showDonorName}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, showDonorName: checked }))}
                  />
                  <Label>نمایش نام اهداکننده</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.showAmount}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, showAmount: checked }))}
                  />
                  <Label>نمایش مبلغ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.showMessage}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, showMessage: checked }))}
                  />
                  <Label>نمایش پیام</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.particleEffects}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, particleEffects: checked }))}
                  />
                  <Label>افکت ذرات</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.backgroundBlur}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, backgroundBlur: checked }))}
                  />
                  <Label>تار کردن پس‌زمینه</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                تنظیمات نوار هدف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label>استایل نوار</Label>
                  <Select
                    value={obsSettings.goalBarStyle}
                    onValueChange={(value) => setObsSettings((prev) => ({ ...prev, goalBarStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">کلاسیک</SelectItem>
                      <SelectItem value="modern">مدرن</SelectItem>
                      <SelectItem value="neon">نئون</SelectItem>
                      <SelectItem value="gradient">گرادیانت</SelectItem>
                      <SelectItem value="glass">شیشه‌ای</SelectItem>
                      <SelectItem value="retro">رترو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>رنگ نوار</Label>
                  <Input
                    type="color"
                    value={obsSettings.goalBarColor}
                    onChange={(e) => setObsSettings((prev) => ({ ...prev, goalBarColor: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={obsSettings.goalBarAnimation}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, goalBarAnimation: checked }))}
                  />
                  <Label>انیمیشن نوار</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.showPercentage}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, showPercentage: checked }))}
                  />
                  <Label>نمایش درصد</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={obsSettings.showRemainingAmount}
                    onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, showRemainingAmount: checked }))}
                  />
                  <Label>نمایش مبلغ باقی‌مانده</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sounds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                تنظیمات صدا
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={obsSettings.enableSound}
                  onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, enableSound: checked }))}
                />
                <Label>فعال‌سازی صدا</Label>
              </div>

              {obsSettings.enableSound && (
                <>
                  <div>
                    <Label>میزان صدا</Label>
                    <Slider
                      value={[obsSettings.soundVolume]}
                      onValueChange={(value) => setObsSettings((prev) => ({ ...prev, soundVolume: value[0] }))}
                      max={100}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-center text-sm text-gray-500 mt-1">{obsSettings.soundVolume}%</div>
                  </div>

                  <div>
                    <Label>صدای پیش‌فرض</Label>
                    <Input
                      placeholder="https://example.com/default-sound.mp3"
                      value={obsSettings.defaultSoundUrl}
                      onChange={(e) => setObsSettings((prev) => ({ ...prev, defaultSoundUrl: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                تنظیمات پیشرفته
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>CSS سفارشی</Label>
                <textarea
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                  placeholder="/* CSS سفارشی خود را اینجا بنویسید */"
                  value={obsSettings.customCSS}
                  onChange={(e) => setObsSettings((prev) => ({ ...prev, customCSS: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={obsSettings.enableWebhook}
                  onCheckedChange={(checked) => setObsSettings((prev) => ({ ...prev, enableWebhook: checked }))}
                />
                <Label>فعال‌سازی Webhook</Label>
              </div>

              {obsSettings.enableWebhook && (
                <div>
                  <Label>آدرس Webhook</Label>
                  <Input
                    placeholder="https://your-website.com/webhook"
                    value={obsSettings.webhookUrl}
                    onChange={(e) => setObsSettings((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                  />
                </div>
              )}
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
