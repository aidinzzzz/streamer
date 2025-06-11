"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateCryptoPaymentAddress } from "@/lib/payment"
import QRCode from "react-qr-code"

interface CryptoPaymentProps {
  amount: number
  donationData: {
    name: string
    message?: string
    username: string
  }
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

export default function CryptoPayment({ amount, donationData, onSuccess, onError }: CryptoPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<{
    address: string
    amountCrypto: string
    currency: string
  } | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")

  // Convert amount from Toman to USD (approximate conversion)
  const amountUSD = (amount / 50000).toFixed(2)

  const handleGenerateAddress = async (currency: string) => {
    setLoading(true)
    setError(null)
    setSelectedCrypto(currency)

    try {
      const result = await generateCryptoPaymentAddress({
        amount: Number.parseFloat(amountUSD),
        currency,
        donationData,
      })

      if (result.success) {
        setPaymentInfo({
          address: result.address,
          amountCrypto: result.amountCrypto,
          currency: result.currency,
        })
      } else {
        setError(result.message || "خطا در ایجاد آدرس پرداخت")
        onError(result.message || "خطا در ایجاد آدرس پرداخت")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در ایجاد آدرس پرداخت"
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, you would check the payment status with your backend
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        onSuccess(`crypto-${Date.now()}`)
        setLoading(false)
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در بررسی وضعیت پرداخت"
      setError(errorMessage)
      onError(errorMessage)
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

      <Tabs defaultValue="bitcoin" value={selectedCrypto} onValueChange={(value) => handleGenerateAddress(value)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="bitcoin">بیت‌کوین</TabsTrigger>
          <TabsTrigger value="ethereum">اتریوم</TabsTrigger>
          <TabsTrigger value="tether">تتر</TabsTrigger>
        </TabsList>

        <TabsContent value="bitcoin" className="space-y-4">
          {paymentInfo ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-3 rounded-lg">
                <QRCode value={paymentInfo.address} size={200} />
              </div>
              <div className="text-center">
                <p className="font-bold mb-1">مقدار: {paymentInfo.amountCrypto} BTC</p>
                <p className="text-xs break-all bg-gray-100 p-2 rounded">{paymentInfo.address}</p>
              </div>
              <Button onClick={handleCheckPayment} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    بررسی وضعیت پرداخت...
                  </>
                ) : (
                  "پرداخت را انجام دادم"
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => handleGenerateAddress("bitcoin")} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ایجاد آدرس...
                </>
              ) : (
                "ایجاد آدرس پرداخت بیت‌کوین"
              )}
            </Button>
          )}
        </TabsContent>

        <TabsContent value="ethereum" className="space-y-4">
          {paymentInfo ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-3 rounded-lg">
                <QRCode value={paymentInfo.address} size={200} />
              </div>
              <div className="text-center">
                <p className="font-bold mb-1">مقدار: {paymentInfo.amountCrypto} ETH</p>
                <p className="text-xs break-all bg-gray-100 p-2 rounded">{paymentInfo.address}</p>
              </div>
              <Button onClick={handleCheckPayment} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    بررسی وضعیت پرداخت...
                  </>
                ) : (
                  "پرداخت را انجام دادم"
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => handleGenerateAddress("ethereum")} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ایجاد آدرس...
                </>
              ) : (
                "ایجاد آدرس پرداخت اتریوم"
              )}
            </Button>
          )}
        </TabsContent>

        <TabsContent value="tether" className="space-y-4">
          {paymentInfo ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-3 rounded-lg">
                <QRCode value={paymentInfo.address} size={200} />
              </div>
              <div className="text-center">
                <p className="font-bold mb-1">مقدار: {paymentInfo.amountCrypto} USDT</p>
                <p className="text-xs break-all bg-gray-100 p-2 rounded">{paymentInfo.address}</p>
              </div>
              <Button onClick={handleCheckPayment} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    بررسی وضعیت پرداخت...
                  </>
                ) : (
                  "پرداخت را انجام دادم"
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => handleGenerateAddress("tether")} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ایجاد آدرس...
                </>
              ) : (
                "ایجاد آدرس پرداخت تتر"
              )}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
