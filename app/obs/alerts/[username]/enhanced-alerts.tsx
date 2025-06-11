"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { subscribeToAlerts } from "@/lib/realtime"
import { getOBSSettings } from "@/lib/api"

export default function EnhancedAlertsPage() {
  const { username } = useParams()
  const [alert, setAlert] = useState<any>(null)
  const [visible, setVisible] = useState(false)
  const [settings, setSettings] = useState<any>({})
  const [donationRules, setDonationRules] = useState<any[]>([])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const obsSettings = await getOBSSettings()
        if (obsSettings) {
          setSettings(obsSettings)
          setDonationRules(obsSettings.donationRules || [])
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()

    const unsubscribe = subscribeToAlerts(username as string, (data) => {
      setAlert(data)
      setVisible(true)

      // Find matching rule
      const matchingRule = donationRules.find(
        (rule) => rule.enabled && data.amount >= rule.minAmount && (!rule.maxAmount || data.amount <= rule.maxAmount),
      )

      const duration = matchingRule?.duration || settings.alertDuration || 5

      // Play sound if available
      if (settings.enableSound && (matchingRule?.soundUrl || settings.defaultSoundUrl)) {
        const audio = new Audio(matchingRule?.soundUrl || settings.defaultSoundUrl)
        audio.volume = (settings.soundVolume || 70) / 100
        audio.play().catch(console.error)
      }

      // Hide alert after duration
      setTimeout(() => {
        setVisible(false)
        setTimeout(() => setAlert(null), 500)
      }, duration * 1000)
    })

    return () => {
      unsubscribe()
    }
  }, [username, donationRules, settings])

  if (!alert) return null

  // Find matching rule for styling
  const matchingRule = donationRules.find(
    (rule) => rule.enabled && alert.amount >= rule.minAmount && (!rule.maxAmount || alert.amount <= rule.maxAmount),
  )

  const getAnimationClass = () => {
    const animationType = matchingRule?.animationType || settings.animationStyle || "slideIn"

    switch (animationType) {
      case "fadeIn":
        return visible ? "animate-fadeIn" : "animate-fadeOut"
      case "slideIn":
        return visible ? "animate-slideIn" : "animate-slideOut"
      case "bounce":
        return visible ? "animate-bounce" : "animate-fadeOut"
      case "zoom":
        return visible ? "animate-zoom" : "animate-zoomOut"
      case "flip":
        return visible ? "animate-flip" : "animate-fadeOut"
      case "shake":
        return visible ? "animate-shake" : "animate-fadeOut"
      default:
        return visible ? "animate-slideIn" : "animate-slideOut"
    }
  }

  const getPositionClass = () => {
    switch (settings.alertPosition) {
      case "top":
        return "top-10 left-1/2 transform -translate-x-1/2"
      case "bottom":
        return "bottom-10 left-1/2 transform -translate-x-1/2"
      case "top-left":
        return "top-10 left-10"
      case "top-right":
        return "top-10 right-10"
      case "bottom-left":
        return "bottom-10 left-10"
      case "bottom-right":
        return "bottom-10 right-10"
      default: // center
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    }
  }

  const getSizeClass = () => {
    switch (settings.alertSize) {
      case "small":
        return "max-w-sm text-sm"
      case "large":
        return "max-w-2xl text-xl"
      case "xl":
        return "max-w-4xl text-2xl"
      default: // medium
        return "max-w-md text-lg"
    }
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-transparent">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100px); opacity: 0; }
        }
        
        @keyframes zoom {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes zoomOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0); opacity: 0; }
        }
        
        @keyframes flip {
          from { transform: rotateY(-90deg); opacity: 0; }
          to { transform: rotateY(0); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        @keyframes particles {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeOut { animation: fadeOut 0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
        .animate-slideOut { animation: slideOut 0.5s ease-out; }
        .animate-zoom { animation: zoom 0.5s ease-out; }
        .animate-zoomOut { animation: zoomOut 0.5s ease-out; }
        .animate-flip { animation: flip 0.5s ease-out; }
        .animate-shake { animation: shake 0.6s ease-out; }
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #ffd700;
          border-radius: 50%;
          animation: particles 2s ease-out infinite;
        }
      `}</style>

      <div
        className={`
          fixed ${getPositionClass()} ${getSizeClass()} ${getAnimationClass()}
          z-50 pointer-events-none
        `}
      >
        <div
          className="relative p-6 rounded-lg shadow-2xl backdrop-blur-sm"
          style={{
            background: matchingRule?.backgroundColor || settings.backgroundColor || "rgba(139, 92, 246, 0.9)",
            color: matchingRule?.textColor || settings.textColor || "#ffffff",
            borderRadius: `${settings.borderRadius || 12}px`,
            filter: settings.backgroundBlur ? "blur(0.5px)" : "none",
          }}
        >
          {/* Particle Effects */}
          {(matchingRule?.particleEffect || settings.particleEffects) && visible && (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </>
          )}

          {/* GIF Display */}
          {matchingRule?.gifUrl && (
            <div className="text-center mb-4">
              <img
                src={matchingRule.gifUrl || "/placeholder.svg"}
                alt="Donation GIF"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

          {/* Alert Content */}
          <div className="text-center relative z-10">
            <div className="text-3xl font-bold mb-2 drop-shadow-lg">🎉 دونیت جدید! 🎉</div>

            {settings.showDonorName && <div className="text-2xl font-bold mb-4 drop-shadow-lg">{alert.name}</div>}

            {settings.showAmount && (
              <div className="text-4xl font-bold mb-4 drop-shadow-lg">{alert.amount.toLocaleString()} تومان</div>
            )}

            {settings.showMessage && alert.message && (
              <div className="text-xl italic drop-shadow-lg">"{alert.message}"</div>
            )}
          </div>

          {/* Border Glow Effect */}
          <div
            className="absolute inset-0 rounded-lg opacity-50 animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${settings.primaryColor || "#8b5cf6"}, ${settings.secondaryColor || "#ec4899"})`,
              filter: "blur(8px)",
              zIndex: -1,
            }}
          />
        </div>
      </div>
    </div>
  )
}
