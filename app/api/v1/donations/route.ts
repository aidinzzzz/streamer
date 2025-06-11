import { type NextRequest, NextResponse } from "next/server"

// Mock data - در پروژه واقعی از دیتابیس استفاده کنید
const donations = [
  {
    id: 1,
    name: "علی احمدی",
    amount: 50000,
    message: "عالی بود!",
    timestamp: new Date().toISOString(),
    points: 50,
  },
  {
    id: 2,
    name: "مریم رضایی",
    amount: 25000,
    message: "ادامه بده",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    points: 25,
  },
]

export async function GET(request: NextRequest) {
  try {
    // بررسی API key
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    // در پروژه واقعی، API key را از دیتابیس بررسی کنید
    if (!apiKey.startsWith("sk_")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const paginatedDonations = donations.slice(offset, offset + limit)

    return NextResponse.json({
      data: paginatedDonations,
      total: donations.length,
      limit,
      offset,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey || !apiKey.startsWith("sk_")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const body = await request.json()
    const { name, amount, message } = body

    if (!name || !amount) {
      return NextResponse.json({ error: "Name and amount are required" }, { status: 400 })
    }

    const newDonation = {
      id: donations.length + 1,
      name,
      amount,
      message: message || "",
      timestamp: new Date().toISOString(),
      points: Math.floor(amount / 1000),
    }

    donations.push(newDonation)

    return NextResponse.json(newDonation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
