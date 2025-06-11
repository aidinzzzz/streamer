"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getUserByUsername } from "@/lib/api"
import { subscribeToGoalUpdates } from "@/lib/realtime"

export default function GoalPage() {
  const { username } = useParams()
  const [goal, setGoal] = useState<any>({
    title: "هدف ماهانه",
    current: 0,
    target: 1000,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const userData = await getUserByUsername(username as string)
        setGoal({
          title: userData.goalTitle || "هدف ماهانه",
          current: userData.currentGoalAmount || 0,
          target: userData.goalAmount || 1000,
        })
      } catch (error) {
        console.error("Error fetching goal data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGoal()

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

  return (
    <div className="w-full p-4 bg-transparent">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg">{goal.title}</div>
          <div className="text-lg font-bold">
            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} تومان
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-right mt-1 text-sm text-gray-600">{percentage}%</div>
      </div>
    </div>
  )
}
