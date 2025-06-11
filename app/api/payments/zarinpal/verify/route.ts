import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { emitAlert, emitGoalUpdate, emitRecentDonationsUpdate } from "@/lib/realtime"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { authority, amount, donationData, username } = body

    // In a real app, you would call Zarinpal API to verify the payment
    // For demo purposes, we'll simulate a successful response

    // Simulate API call
    // const zarinpalResponse = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    //     amount,
    //     authority,
    //   }),
    // });
    // const data = await zarinpalResponse.json();

    // Simulate successful response
    const data = {
      data: {
        code: 100,
        ref_id: `REF${Date.now()}`,
      },
      errors: [],
    }

    if (data.data.code === 100) {
      // Get user by username
      const user = db.getUserByUsername(username)

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "کاربر یافت نشد",
          },
          { status: 404 },
        )
      }

      // Create donation
      const newDonation = db.createDonation({
        userId: user.id,
        name: donationData.name,
        amount: amount,
        message: donationData.message,
        createdAt: new Date().toISOString(),
      })

      // Get updated goal data
      const currentGoalAmount = db.getCurrentMonthDonations(user.id)

      // Get updated recent donations
      const recentDonations = db.getRecentDonations(user.id)

      // Format donations for frontend
      const formattedDonations = recentDonations.map((donation) => ({
        id: donation.id.toString(),
        name: donation.name,
        amount: donation.amount,
        message: donation.message,
        createdAt: donation.createdAt,
      }))

      // Emit events
      emitAlert(user.username, {
        id: newDonation.id.toString(),
        name: donationData.name,
        amount: amount,
        message: donationData.message,
      })

      emitGoalUpdate(user.username, {
        title: user.goalTitle,
        target: user.goalAmount,
        current: currentGoalAmount,
      })

      emitRecentDonationsUpdate(user.username, formattedDonations)

      return NextResponse.json({
        success: true,
        refID: data.data.ref_id,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "خطا در تایید پرداخت",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Zarinpal verify error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "خطا در پردازش درخواست",
      },
      { status: 500 },
    )
  }
}
