"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getOBSSettings } from "@/lib/api"

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const ruleId = searchParams.get("rule")
  const [settings, setSettings] = useState<any>({})
  const [rule, setRule] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const obsSettings = await getOBSSettings()
        setSettings(obsSettings)

        if (ruleId && obsSettings.donationRules) {
          const foundRule = obsSettings.donationRules.find((r: any) => r.id === ruleId)
          setRule(foundRule)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchData()
  }, [ruleId])

  const startPreview = () => {
    setShowPreview(true)

    // Play sound if available
    if (settings.enableSound && (rule?.soundUrl || settings.defaultSoundUrl)) {
      const audio = new Audio(rule?.soundUrl || settings.defaultSoundUrl)
      audio.volume = (settings.soundVolume || 70) / 100
      audio.play().catch(console.error)
    }

    // Hide after duration
    setTimeout(
      () => {
        setShowPreview(false)
      },
      (rule?.duration || settings.alertDuration || 5) * 1000,
    )
  }

  const mockAlert = {
    name: "کاربر تست",
    amount: rule?.minAmount || 10000,
    message: "این یک پیام تست است!",
  }

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-white text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">پیش‌نمایش اعلان</h1>
        <p className="mb-4">قانون: {rule?.name || "پیش‌فرض"}</p>
        <button onClick={startPreview} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
          نمایش پیش‌نمایش
        </button>
      </div>

      {/* Preview Alert */}
      {showPreview && (
        <div className="fixed inset-0 pointer-events-none">
          <div
            className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              max-w-md text-lg z-50 animate-bounce
            `}
          >
            <div
              className="relative p-6 rounded-lg shadow-2xl backdrop-blur-sm"
              style={{
                background: rule?.backgroundColor || settings.backgroundColor || "rgba(139, 92, 246, 0.9)",
                color: rule?.textColor || settings.textColor || "#ffffff",
                borderRadius: `${settings.borderRadius || 12}px`,
              }}
            >
              {/* GIF Display */}
              {rule?.gifUrl && (
                <div className="text-center mb-4">
                  <img
                    src={rule.gifUrl || "/placeholder.svg"}
                    alt="Donation GIF"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}

              {/* Alert Content */}
              <div className="text-center relative z-10">
                <div className="text-3xl font-bold mb-2 drop-shadow-lg">🎉 دونیت جدید! 🎉</div>

                <div className="text-2xl font-bold mb-4 drop-shadow-lg">{mockAlert.name}</div>

                <div className="text-4xl font-bold mb-4 drop-shadow-lg">{mockAlert.amount.toLocaleString()} تومان</div>

                <div className="text-xl italic drop-shadow-lg">"{mockAlert.message}"</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
