"use client"

import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface PayPalPaymentProps {
  amount: number
  donationData: {
    name: string
    message?: string
    username: string
  }
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalPayment({ amount, donationData, onSuccess, onError }: PayPalPaymentProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert amount from Toman to USD (approximate conversion)
  const amountUSD = (amount / 50000).toFixed(2)

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"
    }&currency=USD`
    script.async = true

    script.onload = () => {
      setLoading(false)

      if (window.paypal && paypalRef.current) {
        window.paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: `Donation to ${donationData.username}`,
                    amount: {
                      currency_code: "USD",
                      value: amountUSD,
                    },
                  },
                ],
              })
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture()
              onSuccess(order.id)
            },
            onError: (err: any) => {
              setError("خطا در پردازش پرداخت PayPal")
              onError("خطا در پردازش پرداخت PayPal")
              console.error(err)
            },
          })
          .render(paypalRef.current)
      }
    }

    script.onerror = () => {
      setLoading(false)
      setError("خطا در بارگذاری اسکریپت PayPal")
      onError("خطا در بارگذاری اسکریپت PayPal")
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [amountUSD, donationData.username, onError, onSuccess])

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
          <span className="font-bold">
            ${amountUSD} (حدود {amount.toLocaleString()} تومان)
          </span>
        </div>
        <div className="text-xs text-gray-500">پرداخت امن با PayPal یا کارت اعتباری از طریق PayPal</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <div ref={paypalRef} />
      )}
    </div>
  )
}
