"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { subscribeToAlerts } from "@/lib/realtime"

export default function AlertsPage() {
  const { username } = useParams()
  const [alert, setAlert] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToAlerts(username as string, (data) => {
      setAlert(data)
      setVisible(true)

      // Hide alert after 5 seconds
      setTimeout(() => {
        setVisible(false)
        setTimeout(() => setAlert(null), 500) // Clear after animation
      }, 5000)
    })

    return () => {
      unsubscribe()
    }
  }, [username])

  return (
    <div className="w-full h-screen overflow-hidden bg-transparent">
      {alert && (
        <div
          className={`
            fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-gradient-to-r from-purple-600 to-pink-600 
            text-white rounded-lg p-6 shadow-lg
            transition-all duration-500 ease-in-out
            ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          `}
          style={{ minWidth: "300px" }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">دونیت جدید!</div>
            <div className="text-xl mb-4">{alert.name}</div>
            <div className="text-3xl font-bold mb-4">{alert.amount.toLocaleString()} تومان</div>
            {alert.message && <div className="text-lg italic">"{alert.message}"</div>}
          </div>
        </div>
      )}
    </div>
  )
}
