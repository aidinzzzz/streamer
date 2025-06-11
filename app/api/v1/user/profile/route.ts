import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey || !apiKey.startsWith("sk_")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Mock user data
    const userProfile = {
      id: 1,
      username: "streamer_user",
      displayName: "استریمر نمونه",
      email: "user@example.com",
      totalDonations: 125000,
      donationCount: 45,
      points: 1250,
      level: 12,
      badges: ["bronze_donor", "silver_supporter"],
      joinDate: "2024-01-15",
      settings: {
        publicProfile: true,
        showDonations: true,
        allowMessages: true,
      },
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey || !apiKey.startsWith("sk_")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const body = await request.json()
    const { displayName, settings } = body

    // در پروژه واقعی، اطلاعات را در دیتابیس به‌روزرسانی کنید
    const updatedProfile = {
      id: 1,
      username: "streamer_user",
      displayName: displayName || "استریمر نمونه",
      email: "user@example.com",
      settings: settings || {
        publicProfile: true,
        showDonations: true,
        allowMessages: true,
      },
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
