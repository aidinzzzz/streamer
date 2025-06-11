"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { initiateZarinpalPayment } from "@/lib/payment"

interface ZarinpalPaymentProps {
  amount: number
  donationData: {
    name: string
    message?: string
    username: string
  }
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

export default function ZarinpalPayment({ amount, donationData, onSuccess, onError }: ZarinpalPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await initiateZarinpalPayment({
        amount,
        description: `دونیت به ${donationData.username}`,
        donationData,
      })

      if (result.success && result.paymentUrl) {
        // Redirect to Zarinpal payment page
        window.location.href = result.paymentUrl
      } else {
        setError(result.message || "خطا در اتصال به درگاه پرداخت")
        onError(result.message || "خطا در اتصال به درگاه پرداخت")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در پردازش پرداخت"
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">مبلغ پرداختی:</span>
          <span className="font-bold">{amount.toLocaleString()} تومان</span>
        </div>
        <div className="text-xs text-gray-500">پس از کلیک روی دکمه پرداخت، به درگاه امن زرین‌پال منتقل خواهید شد.</div>
      </div>

      <Button onClick={handlePayment} disabled={loading} className="w-full bg-[#ffd900] hover:bg-[#edc800] text-black">
        {loading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            در حال اتصال به درگاه...
          </>
        ) : (
          "پرداخت با زرین‌پال"
        )}
      </Button>
    </div>
  )
}
