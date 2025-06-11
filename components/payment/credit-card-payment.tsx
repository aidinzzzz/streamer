"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard } from "lucide-react"
import { processCreditCardPayment } from "@/lib/payment"

interface CreditCardPaymentProps {
  amount: number
  donationData: {
    name: string
    message?: string
    username: string
  }
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

export default function CreditCardPayment({ amount, donationData, onSuccess, onError }: CreditCardPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  // Convert amount from Toman to USD (approximate conversion)
  const amountUSD = (amount / 50000).toFixed(2)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // In a real app, you would use a secure payment processor
      const result = await processCreditCardPayment({
        amount: Number.parseFloat(amountUSD),
        cardDetails,
        donationData,
      })

      if (result.success) {
        onSuccess(result.transactionId)
      } else {
        setError(result.message || "خطا در پردازش پرداخت")
        onError(result.message || "خطا در پردازش پرداخت")
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
          <span className="font-bold">
            ${amountUSD} (حدود {amount.toLocaleString()} تومان)
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">شماره کارت</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              required
              className="pl-10"
              maxLength={19}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardHolder">نام دارنده کارت</Label>
          <Input
            id="cardHolder"
            name="cardHolder"
            placeholder="JOHN DOE"
            value={cardDetails.cardHolder}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">تاریخ انقضا</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              required
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleInputChange}
              required
              maxLength={4}
              type="password"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال پردازش...
            </>
          ) : (
            "پرداخت"
          )}
        </Button>
      </form>
    </div>
  )
}
