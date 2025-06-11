"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getUserByUsername } from "@/lib/api"
import { subscribeToRecentDonations } from "@/lib/realtime"

export default function RecentDonorsPage() {
  const { username } = useParams()
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const userData = await getUserByUsername(username as string)
        setDonations(userData.recentDonations || [])
      } catch (error) {
        console.error("Error fetching donations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()

    const unsubscribe = subscribeToRecentDonations(username as string, (data) => {
      setDonations(data)
    })

    return () => {
      unsubscribe()
    }
  }, [username])

  if (loading) {
    return null
  }

  return (
    <div className="w-full p-4 bg-transparent">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4 text-center">دونیت‌کنندگان اخیر</h2>
        {donations.length === 0 ? (
          <div className="text-center text-gray-500">هنوز دونیتی دریافت نشده است</div>
        ) : (
          <ul className="space-y-2">
            {donations.map((donation, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                <span className="font-medium">{donation.name}</span>
                <span className="font-bold">{donation.amount.toLocaleString()} تومان</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
