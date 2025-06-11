"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getUserByUsername, getOBSSettings } from "@/lib/api"
import { subscribeToGoalUpdates } from "@/lib/realtime"

export default function EnhancedGoalPage() {
  const { username } = useParams()
  const [goal, setGoal] = useState<any>({
    title: "هدف ماهانه",
    current: 0,
    target: 1000,
  })
  const [settings, setSettings] = useState<any>({
    goalBarStyle: "modern",
    goalBarColor: "#8b5cf6",
    goalBarAnimation: true,
    showPercentage: true,
    showRemainingAmount: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserByUsername(username as string)
        const obsSettings = await getOBSSettings()

        setGoal({
          title: userData.goalTitle || "هدف ماهانه",
          current: userData.currentGoalAmount || 0,
          target: userData.goalAmount || 1000,
        })

        if (obsSettings) {
          setSettings(obsSettings)
        }
      } catch (error) {
        console.error("Error fetching goal data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const unsubscribe = subscribeToGoalUpdates(username as string, (data) => {
      setGoal((prevGoal) => ({
        ...prevGoal,
        current: data.current,
        title: data.title || prevGoal.title,
        target: data.target || prevGoal.target,
      }))
    })

    return () => {
      unsubscribe()
    }
  }, [username])

  if (loading) {
    return null
  }

  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100))
  const remaining = Math.max(0, goal.target - goal.current)

  const getBarStyle = () => {
    const baseStyle = {
      width: `${percentage}%`,
      transition: settings.goalBarAnimation ? "all 1s ease-out" : "none",
    }

    switch (settings.goalBarStyle) {
      case "neon":
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, ${settings.goalBarColor}, #fff)`,
          boxShadow: `0 0 20px ${settings.goalBarColor}, 0 0 40px ${settings.goalBarColor}`,
          filter: "brightness(1.2)",
        }
      case "gradient":
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, ${settings.goalBarColor}, #ec4899, #f59e0b)`,
        }
      case "glass":
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, ${settings.goalBarColor}80, ${settings.goalBarColor}40)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${settings.goalBarColor}40`,
        }
      case "retro":
        return {
          ...baseStyle,
          background: `repeating-linear-gradient(90deg, ${settings.goalBarColor}, ${settings.goalBarColor} 10px, #fff 10px, #fff 12px)`,
          animation: settings.goalBarAnimation ? "retroMove 2s linear infinite" : "none",
        }
      default: // modern
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, ${settings.goalBarColor}, ${settings.goalBarColor}cc)`,
        }
    }
  }

  return (
    <div className="w-full p-6 bg-transparent">
      <style jsx>{`
        @keyframes retroMove {
          0% { background-position: 0 0; }
          100% { background-position: 24px 0; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .goal-container {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        
        .goal-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: ${settings.goalBarAnimation ? "float 3s ease-in-out infinite" : "none"};
          pointer-events: none;
        }
        
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .progress-bar {
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: ${settings.goalBarAnimation ? "shimmer 2s ease-in-out infinite" : "none"};
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="goal-container">
        {/* Sparkle Effects */}
        {settings.goalBarAnimation && (
          <>
            <div className="sparkle" style={{ top: "20%", left: "10%", animationDelay: "0s" }}></div>
            <div className="sparkle" style={{ top: "60%", left: "30%", animationDelay: "0.5s" }}></div>
            <div className="sparkle" style={{ top: "40%", left: "70%", animationDelay: "1s" }}></div>
            <div className="sparkle" style={{ top: "80%", left: "90%", animationDelay: "1.5s" }}></div>
          </>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-white drop-shadow-lg">{goal.title}</div>
          {settings.showPercentage && <div className="text-3xl font-bold text-white drop-shadow-lg">{percentage}%</div>}
        </div>

        {/* Amount Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-white/90">{goal.current.toLocaleString()} تومان</div>
          <div className="text-lg font-semibold text-white/90">{goal.target.toLocaleString()} تومان</div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-white/20 rounded-full h-8 overflow-hidden progress-bar">
            <div className="h-full rounded-full relative" style={getBarStyle()}>
              {/* Inner glow effect */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`,
                  animation: settings.goalBarAnimation ? "shimmer 2s ease-in-out infinite" : "none",
                }}
              ></div>
            </div>
          </div>

          {/* Progress indicator */}
          {percentage > 0 && (
            <div
              className="absolute top-0 h-8 w-1 bg-white/80 rounded-full shadow-lg"
              style={{
                left: `${Math.min(percentage, 98)}%`,
                animation: settings.goalBarAnimation ? "pulse 2s ease-in-out infinite" : "none",
              }}
            ></div>
          )}
        </div>

        {/* Remaining Amount */}
        {settings.showRemainingAmount && remaining > 0 && (
          <div className="text-center mt-4 text-white/80">
            <span className="text-sm">باقی‌مانده: </span>
            <span className="font-bold text-lg">{remaining.toLocaleString()} تومان</span>
          </div>
        )}

        {/* Achievement Badge */}
        {percentage >= 100 && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
            🎉 هدف محقق شد!
          </div>
        )}
      </div>
    </div>
  )
}
