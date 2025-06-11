"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { verifyZarinpalPayment } from "@/lib/payment"
import { submitDonation } from "@/lib/api"

export default function VerifyPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyPayment = async () => {
      const authority = searchParams.get("Authority")
      const status = searchParams.get("Status")
      const username = searchParams.get("username")

      if (!authority || status !== "OK" || !username) {
        setStatus("error")
        setMessage("اطلاعات پرداخت ناقص است")
        return
      }

      try {
        // Get donation data from localStorage
        const storedDonationData = localStorage.getItem(`donation_${username}`)

        if (!storedDonationData) {
          setStatus("error")
          setMessage("اطلاعات دونیت یافت نشد")
          return
        }

        const donationData = JSON.parse(storedDonationData)

        // Verify payment
        const result = await verifyZarinpalPayment(authority, donationData.amount)

        if (result.success) {
          // Submit donation
          await submitDonation(username, {
            name: donationData.name,
            amount: donationData.amount,
            message: donationData.message,
            transactionId: result.refID,
          })

          setStatus("success")
          setMessage("پرداخت با موفقیت انجام شد")
          localStorage.removeItem(`donation_${username}`)
        } else {
          setStatus("error")
          setMessage("خطا در تایید پرداخت")
        }
      } catch (error) {
        setStatus("error")
        setMessage("خطا در پردازش پرداخت")
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">نتیجه پرداخت</CardTitle>
          <CardDescription>وضعیت پرداخت دونیت شما</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
              <p className="text-lg">در حال بررسی پرداخت...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-lg font-medium">پرداخت با موفقیت انجام شد</p>
              <p className="text-gray-600">با تشکر از حمایت شما! دونیت شما به زودی در استریم نمایش داده خواهد شد.</p>
              <Button
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  const username = searchParams.get("username")
                  if (username) {
                    router.push(`/donate/${username}`)
                  } else {
                    router.push("/")
                  }
                }}
              >
                بازگشت به صفحه دونیت
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-600" />
              <p className="text-lg font-medium">خطا در پرداخت</p>
              <p className="text-gray-600">{message}</p>
              <Button
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  const username = searchParams.get("username")
                  if (username) {
                    router.push(`/donate/${username}`)
                  } else {
                    router.push("/")
                  }
                }}
              >
                بازگشت به صفحه دونیت
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
