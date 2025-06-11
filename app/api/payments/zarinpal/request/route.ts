import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, description, donationData } = body

    // In a real app, you would call Zarinpal API to request a payment
    // For demo purposes, we'll simulate a successful response

    // Simulate API call
    // const zarinpalResponse = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    //     amount,
    //     description,
    //     callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/verify?username=${donationData.username}`,
    //   }),
    // });
    // const data = await zarinpalResponse.json();

    // Simulate successful response
    const data = {
      data: {
        authority: `ZP${Date.now()}`,
        code: 100,
      },
      errors: [],
    }

    if (data.data.code === 100) {
      return NextResponse.json({
        success: true,
        authority: data.data.authority,
        paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "خطا در ایجاد درخواست پرداخت",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Zarinpal request error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "خطا در پردازش درخواست",
      },
      { status: 500 },
    )
  }
}
