import { type NextRequest, NextResponse } from "next/server"

const goals = [
  {
    id: 1,
    title: "خرید میکروفون جدید",
    description: "میکروفون حرفه‌ای برای کیفیت صدای بهتر",
    targetAmount: 500000,
    currentAmount: 125000,
    isActive: true,
    createdAt: "2024-01-15",
    deadline: "2024-02-15",
  },
]

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey || !apiKey.startsWith("sk_")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    return NextResponse.json({
      data: goals,
      total: goals.length,
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
    const { title, description, targetAmount, deadline } = body

    if (!title || !targetAmount) {
      return NextResponse.json({ error: "Title and target amount are required" }, { status: 400 })
    }

    const newGoal = {
      id: goals.length + 1,
      title,
      description: description || "",
      targetAmount,
      currentAmount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      deadline: deadline || null,
    }

    goals.push(newGoal)

    return NextResponse.json(newGoal, { status: 201 })
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
    const { id, currentAmount } = body

    if (!id || currentAmount === undefined) {
      return NextResponse.json({ error: "Goal ID and current amount are required" }, { status: 400 })
    }

    const goalIndex = goals.findIndex((goal) => goal.id === id)
    if (goalIndex === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    goals[goalIndex].currentAmount = currentAmount

    return NextResponse.json(goals[goalIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
