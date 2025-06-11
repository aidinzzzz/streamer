"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getUserByUsername, submitDonation } from "@/lib/api"
import { verifyZarinpalPayment } from "@/lib/payment"
import { DollarSign, Heart } from "lucide-react"
import PaymentMethodSelector from "@/components/payment-method-selector"
import ZarinpalPayment from "@/components/payment/zarinpal-payment"
import PayPalPayment from "@/components/payment/paypal-payment"
import CreditCardPayment from "@/components/payment/credit-card-payment"
import CryptoPayment from "@/components/payment/crypto-payment"

export default function DonatePage() {
  const { username } = useParams()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1) // 1: Form, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState("zarinpal")
  const [donationData, setDonationData] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByUsername(username as string)
        setUser(userData)
      } catch (error) {
        setError("کاربر مورد نظر یافت نشد")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Check for Zarinpal callback
    const authority = searchParams.get("Authority")
    const status = searchParams.get("Status")

    if (authority && status === "OK") {
      // Get donation data from localStorage
      const storedDonationData = localStorage.getItem(`donation_${username}`)

      if (storedDonationData) {
        const parsedData = JSON.parse(storedDonationData)
        handleZarinpalVerification(authority, parsedData)
      }
    }
  }, [username, searchParams])

  const handleZarinpalVerification = async (authority: string, donationData: any) => {
    setIsSubmitting(true)

    try {
      const result = await verifyZarinpalPayment(authority, donationData.amount)

      if (result.success) {
        await submitDonation(username as string, {
          name: donationData.name,
          amount: donationData.amount,
          message: donationData.message,
        })

        setSuccess(true)
        localStorage.removeItem(`donation_${username}`)
      } else {
        setError("خطا در تایید پرداخت. لطفا دوباره تلاش کنید.")
      }
    } catch (err) {
      setError("خطا در تایید پرداخت. لطفا دوباره تلاش کنید.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!name || !amount || Number.parseFloat(amount) < 1000) {
      setError("لطفا نام و مبلغ را به درستی وارد کنید. حداقل مبلغ 1000 تومان است.")
      return
    }

    // Store donation data
    const data = {
      name,
      amount: Number.parseFloat(amount),
      message,
      username,
    }

    setDonationData(data)
    localStorage.setItem(`donation_${username}`, JSON.stringify(data))

    // Go to payment step
    setStep(2)
  }

  const handlePaymentSuccess = async (transactionId: string) => {
    setIsSubmitting(true)

    try {
      await submitDonation(username as string, {
        name: donationData.name,
        amount: donationData.amount,
        message: donationData.message,
        transactionId,
      })

      setSuccess(true)
      localStorage.removeItem(`donation_${username}`)
    } catch (err) {
      setError("خطا در ثبت دونیت. لطفا دوباره تلاش کنید.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">خطا</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">حمایت از {user.username}</CardTitle>
          <CardDescription>با دونیت کردن از استریمر مورد علاقه خود حمایت کنید</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">با تشکر از حمایت شما!</h3>
              <p className="text-gray-600">دونیت شما با موفقیت ارسال شد و به زودی در استریم نمایش داده خواهد شد.</p>
              <Button
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setSuccess(false)
                  setStep(1)
                  setName("")
                  setAmount("")
                  setMessage("")
                }}
              >
                ارسال دونیت دیگر
              </Button>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">نام شما</Label>
                <Input
                  id="name"
                  placeholder="نام یا نام مستعار شما"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">مبلغ (تومان)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10000"
                    className="pl-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">پیام (اختیاری)</Label>
                <Textarea
                  id="message"
                  placeholder="پیام خود را بنویسید..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                ادامه به پرداخت
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">نام</div>
                  <div className="font-medium">{donationData.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">مبلغ</div>
                  <div className="font-medium">{Number(donationData.amount).toLocaleString()} تومان</div>
                </div>
              </div>

              <PaymentMethodSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />

              {paymentMethod === "zarinpal" && (
                <ZarinpalPayment
                  amount={donationData.amount}
                  donationData={{
                    name: donationData.name,
                    message: donationData.message,
                    username: username as string,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentMethod === "paypal" && (
                <PayPalPayment
                  amount={donationData.amount}
                  donationData={{
                    name: donationData.name,
                    message: donationData.message,
                    username: username as string,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentMethod === "creditcard" && (
                <CreditCardPayment
                  amount={donationData.amount}
                  donationData={{
                    name: donationData.name,
                    message: donationData.message,
                    username: username as string,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentMethod === "crypto" && (
                <CryptoPayment
                  amount={donationData.amount}
                  donationData={{
                    name: donationData.name,
                    message: donationData.message,
                    username: username as string,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                بازگشت به مرحله قبل
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          این دونیت به صورت زنده در استریم نمایش داده خواهد شد
        </CardFooter>
      </Card>
    </div>
  )
}
