import { db } from "./db"
import { emitAlert, emitGoalUpdate, emitRecentDonationsUpdate } from "./realtime"

export async function getUserData() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  const userData = db.getUserById(user.id)

  if (!userData) {
    throw new Error("User not found")
  }

  // Get aggregated data
  const totalDonations = db.getTotalDonations(user.id)
  const donationCount = db.getDonationCount(user.id)
  const todayDonations = db.getTodayDonations(user.id)
  const currentGoalAmount = db.getCurrentMonthDonations(user.id)
  const recentDonations = db.getRecentDonations(user.id)

  // Format donations for frontend
  const formattedDonations = recentDonations.map((donation) => ({
    id: donation.id.toString(),
    name: donation.name,
    amount: donation.amount,
    message: donation.message,
    createdAt: donation.createdAt,
  }))

  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    totalDonations,
    donationCount,
    todayDonations,
    goalAmount: userData.goalAmount,
    goalTitle: userData.goalTitle,
    currentGoalAmount,
    recentDonations: formattedDonations,
  }
}

export async function getUserByUsername(username: string) {
  // Get user data from database
  const userData = db.getUserByUsername(username)

  if (!userData) {
    throw new Error("User not found")
  }

  // Get aggregated data
  const currentGoalAmount = db.getCurrentMonthDonations(userData.id)
  const recentDonations = db.getRecentDonations(userData.id)

  // Format donations for frontend
  const formattedDonations = recentDonations.map((donation) => ({
    id: donation.id.toString(),
    name: donation.name,
    amount: donation.amount,
    message: donation.message,
    createdAt: donation.createdAt,
  }))

  return {
    id: userData.id,
    username: userData.username,
    goalAmount: userData.goalAmount,
    goalTitle: userData.goalTitle,
    currentGoalAmount,
    recentDonations: formattedDonations,
  }
}

export async function updateGoal(amount: number, title: string) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)

  // Update user
  db.updateUser(user.id, {
    goalAmount: amount,
    goalTitle: title,
  })

  // Get current goal amount
  const currentGoalAmount = db.getCurrentMonthDonations(user.id)

  // Emit goal update event
  emitGoalUpdate(user.username, {
    title,
    target: amount,
    current: currentGoalAmount || 0,
  })

  return { success: true }
}

export async function submitDonation(username: string, donation: { name: string; amount: number; message?: string }) {
  // Get user by username
  const user = db.getUserByUsername(username)

  if (!user) {
    throw new Error("User not found")
  }

  // Create donation
  const newDonation = db.createDonation({
    userId: user.id,
    name: donation.name,
    amount: donation.amount,
    message: donation.message,
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
    name: donation.name,
    amount: donation.amount,
    message: donation.message,
  })

  emitGoalUpdate(user.username, {
    title: user.goalTitle,
    target: user.goalAmount,
    current: currentGoalAmount,
  })

  emitRecentDonationsUpdate(user.username, formattedDonations)

  return { success: true }
}

export async function sendTestAlert() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)

  // Emit test alert
  emitAlert(user.username, {
    id: "test",
    name: "تست دونیت",
    amount: 10000,
    message: "این یک پیام تست است!",
  })

  return { success: true }
}

// Add new API functions for advanced features

export async function getAdvancedPaymentSettings() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  const settings = db.getPaymentSettings(user.id)

  return (
    settings || {
      minDonationAmount: 1000,
      maxDonationAmount: 1000000,
      autoWithdrawal: false,
      withdrawalThreshold: 100000,
      commissionRate: 5,
      allowedCurrencies: ["IRR", "USD"],
      fraudDetection: true,
      webhookUrl: "",
      emailNotifications: true,
      smsNotifications: false,
      dailyLimit: 5000000,
      monthlyLimit: 50000000,
      suspiciousActivityAlert: true,
      requireVerificationAbove: 500000,
      blockVpnUsers: false,
      allowRecurringDonations: true,
      customFees: {
        zarinpal: 1.5,
        paypal: 3.4,
        creditcard: 2.9,
        crypto: 1.0,
      },
    }
  )
}

export async function updateAdvancedPaymentSettings(settings: any) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  db.updatePaymentSettings(user.id, settings)

  return { success: true }
}

export async function getSubscriptionData() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  const subscriptions = db.getSubscriptionsByUserId(user.id)
  const activeSubscription = subscriptions.find((sub) => sub.status === "active")

  if (activeSubscription) {
    return {
      ...activeSubscription,
      billingHistory: [
        {
          planName: "پلان حرفه‌ای",
          date: "1403/08/15",
          amount: 99000,
          status: "paid",
        },
        {
          planName: "پلان حرفه‌ای",
          date: "1403/07/15",
          amount: 99000,
          status: "paid",
        },
      ],
    }
  }

  return null
}

export async function subscribeToplan(planId: string) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)

  // Cancel existing subscription
  const existingSubscriptions = db.getSubscriptionsByUserId(user.id)
  existingSubscriptions.forEach((sub) => {
    if (sub.status === "active") {
      db.updateSubscription(sub.id, { status: "cancelled" })
    }
  })

  // Create new subscription
  const startDate = new Date()
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 1)

  const subscription = db.createSubscription({
    userId: user.id,
    planId,
    status: "active",
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    amount: planId === "basic" ? 49000 : planId === "pro" ? 99000 : 199000,
    paymentMethod: "zarinpal",
    createdAt: new Date().toISOString(),
  })

  return { success: true, subscription }
}

export async function cancelSubscription() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  const subscriptions = db.getSubscriptionsByUserId(user.id)
  const activeSubscription = subscriptions.find((sub) => sub.status === "active")

  if (activeSubscription) {
    db.updateSubscription(activeSubscription.id, { status: "cancelled" })
    return { success: true }
  }

  return { success: false, message: "اشتراک فعالی یافت نشد" }
}

export async function getFinancialReports(period: string, year: string) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  const transactions = db.getTransactionsByUserId(user.id)
  const donations = db.getDonationsByUserId(user.id)

  // Generate mock financial data
  const mockData = {
    totalRevenue: 2450000,
    previousRevenue: 1890000,
    totalTransactions: 45,
    previousTransactions: 38,
    averageDonation: 54444,
    previousAverageDonation: 49737,
    totalFees: 73500,
    maxMonthlyRevenue: 350000,

    monthlyRevenue: [
      { name: "فروردین", amount: 180000 },
      { name: "اردیبهشت", amount: 220000 },
      { name: "خرداد", amount: 195000 },
      { name: "تیر", amount: 280000 },
      { name: "مرداد", amount: 310000 },
      { name: "شهریور", amount: 265000 },
      { name: "مهر", amount: 340000 },
      { name: "آبان", amount: 290000 },
      { name: "آذر", amount: 320000 },
      { name: "دی", amount: 350000 },
      { name: "بهمن", amount: 280000 },
      { name: "اسفند", amount: 310000 },
    ],

    topDonors: [
      { name: "علی احمدی", amount: 150000, donations: 8 },
      { name: "مریم کریمی", amount: 120000, donations: 6 },
      { name: "حسین رضایی", amount: 95000, donations: 4 },
      { name: "فاطمه محمدی", amount: 80000, donations: 5 },
      { name: "محمد علیزاده", amount: 75000, donations: 3 },
    ],

    dailyAnalysis: [
      { date: "1403/09/01", revenue: 45000, transactions: 3, average: 15000 },
      { date: "1403/09/02", revenue: 62000, transactions: 4, average: 15500 },
      { date: "1403/09/03", revenue: 38000, transactions: 2, average: 19000 },
      { date: "1403/09/04", revenue: 71000, transactions: 5, average: 14200 },
      { date: "1403/09/05", revenue: 54000, transactions: 3, average: 18000 },
    ],

    transactions: donations.map((donation) => ({
      donorName: donation.name,
      amount: donation.amount,
      fee: Math.round(donation.amount * 0.03),
      paymentMethod: "زرین‌پال",
      date: new Date(donation.createdAt).toLocaleDateString("fa-IR"),
      message: donation.message,
      status: "completed",
    })),

    paymentMethods: [
      { name: "زرین‌پال", percentage: 65, count: 29, amount: 1592500 },
      { name: "PayPal", percentage: 20, count: 9, amount: 490000 },
      { name: "کارت اعتباری", percentage: 10, count: 5, amount: 245000 },
      { name: "ارز دیجیتال", percentage: 5, count: 2, amount: 122500 },
    ],

    paymentFees: [
      { method: "زرین‌پال", rate: 1.5, totalFee: 23888, transactions: 29 },
      { method: "PayPal", rate: 3.4, totalFee: 16660, transactions: 9 },
      { method: "کارت اعتباری", rate: 2.9, totalFee: 7105, transactions: 5 },
      { method: "ارز دیجیتال", rate: 1.0, totalFee: 1225, transactions: 2 },
    ],

    taxableIncome: 2450000,
    deductibleFees: 73500,

    monthlyTaxReport: [
      { month: "فروردین", grossIncome: 180000, fees: 5400, netIncome: 174600, transactions: 8 },
      { month: "اردیبهشت", grossIncome: 220000, fees: 6600, netIncome: 213400, transactions: 10 },
      { month: "خرداد", grossIncome: 195000, fees: 5850, netIncome: 189150, transactions: 9 },
      { month: "تیر", grossIncome: 280000, fees: 8400, netIncome: 271600, transactions: 12 },
      { month: "مرداد", grossIncome: 310000, fees: 9300, netIncome: 300700, transactions: 14 },
    ],
  }

  return mockData
}

export async function exportFinancialReport(period: string, year: string, format: "pdf" | "excel") {
  // Simulate export functionality
  const filename = `financial-report-${period}-${year}.${format}`

  // In a real app, you would generate and download the actual file
  const blob = new Blob(["Mock report data"], {
    type: format === "pdf" ? "application/pdf" : "application/vnd.ms-excel",
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return { success: true }
}

// OBS Settings APIs
export async function getOBSSettings() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)

  // Get from localStorage or return defaults
  const settings = localStorage.getItem(`obs_settings_${user.id}`)

  if (settings) {
    return JSON.parse(settings)
  }

  // Default settings
  return {
    alertDuration: 5,
    alertPosition: "center",
    alertSize: "medium",
    showDonorName: true,
    showAmount: true,
    showMessage: true,
    enableSound: true,
    soundVolume: 70,
    defaultSoundUrl: "",
    animationStyle: "slideIn",
    particleEffects: true,
    backgroundBlur: false,
    goalBarStyle: "modern",
    goalBarColor: "#8b5cf6",
    goalBarAnimation: true,
    showPercentage: true,
    showRemainingAmount: true,
    primaryColor: "#8b5cf6",
    secondaryColor: "#ec4899",
    textColor: "#ffffff",
    backgroundColor: "rgba(139, 92, 246, 0.9)",
    borderRadius: 12,
    customCSS: "",
    enableWebhook: false,
    webhookUrl: "",
    donationRules: [
      {
        id: "1",
        name: "دونیت کوچک",
        minAmount: 1000,
        maxAmount: 9999,
        duration: 3,
        animationType: "fadeIn",
        particleEffect: false,
        textColor: "#ffffff",
        backgroundColor: "rgba(59, 130, 246, 0.9)",
        enabled: true,
      },
      {
        id: "2",
        name: "دونیت متوسط",
        minAmount: 10000,
        maxAmount: 49999,
        gifUrl: "/gifs/medium-donation.gif",
        soundUrl: "/sounds/medium-donation.mp3",
        duration: 5,
        animationType: "slideIn",
        particleEffect: true,
        textColor: "#ffffff",
        backgroundColor: "rgba(139, 92, 246, 0.9)",
        enabled: true,
      },
      {
        id: "3",
        name: "دونیت بزرگ",
        minAmount: 50000,
        gifUrl: "/gifs/big-donation.gif",
        soundUrl: "/sounds/big-donation.mp3",
        duration: 8,
        animationType: "bounce",
        particleEffect: true,
        textColor: "#ffffff",
        backgroundColor: "rgba(236, 72, 153, 0.9)",
        enabled: true,
      },
    ],
  }
}

export async function updateOBSSettings(settings: any) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  localStorage.setItem(`obs_settings_${user.id}`, JSON.stringify(settings))

  return { success: true }
}

// Points System APIs
export async function getPointsData() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  let pointsData = db.getUserPoints(user.id)

  if (!pointsData) {
    pointsData = db.createUserPoints(user.id)
  }

  // Get transactions
  const transactions = db.getPointsTransactionsByUserId(user.id)

  return {
    ...pointsData,
    transactions: transactions.slice(0, 10), // Last 10 transactions
  }
}

export async function getRewards() {
  return db.getRewards()
}

export async function redeemReward(rewardId: number) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  return db.redeemReward(user.id, rewardId)
}

export async function getLeaderboard() {
  // Mock leaderboard data
  return [
    { userId: 1, username: "demo", totalPoints: 1250, level: 13, badges: ["bronze", "silver", "gold"] },
    { userId: 2, username: "user2", totalPoints: 980, level: 10, badges: ["bronze", "silver"] },
    { userId: 3, username: "user3", totalPoints: 750, level: 8, badges: ["bronze"] },
    { userId: 4, username: "user4", totalPoints: 620, level: 7, badges: ["bronze"] },
    { userId: 5, username: "user5", totalPoints: 450, level: 5, badges: ["bronze"] },
  ]
}

// API Management APIs
export async function getApiKeys() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  return db.getApiKeysByUserId(user.id)
}

export async function createApiKey(keyName: string, permissions: string[]) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  return db.createApiKey(user.id, keyName, permissions)
}

export async function updateApiKey(keyId: number, updates: any) {
  return db.updateApiKey(keyId, updates)
}

export async function getApiDocumentation() {
  // Return API documentation
  return {
    baseUrl: "https://your-domain.com/api/v1",
    endpoints: [
      {
        method: "GET",
        path: "/donations",
        description: "Get list of donations",
        permissions: ["donations:read"],
      },
      {
        method: "POST",
        path: "/donations",
        description: "Create new donation",
        permissions: ["donations:create"],
      },
      {
        method: "GET",
        path: "/user/profile",
        description: "Get user profile",
        permissions: ["user:read"],
      },
      {
        method: "GET",
        path: "/goals",
        description: "Get donation goals",
        permissions: ["goals:read"],
      },
      {
        method: "PUT",
        path: "/goals",
        description: "Update donation goals",
        permissions: ["goals:update"],
      },
    ],
  }
}

// Chat APIs
export async function getChatMessages() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  const messages = db.getChatMessagesByStreamer(user.id)

  // Add some mock messages if empty
  if (messages.length === 0) {
    const mockMessages = [
      {
        id: 1,
        userId: 1,
        streamerId: user.id,
        username: "علی",
        message: "سلام! استریم عالی‌ای داری",
        type: "message",
        isModerated: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        userId: 2,
        streamerId: user.id,
        username: "مریم",
        message: "دونیت 10,000 تومانی ارسال شد",
        type: "donation",
        isModerated: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        userId: 3,
        streamerId: user.id,
        username: "حسین",
        message: "چه بازی جالبی!",
        type: "message",
        isModerated: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
    ]

    mockMessages.forEach((msg) => {
      db.createChatMessage({
        userId: msg.userId,
        streamerId: msg.streamerId,
        username: msg.username,
        message: msg.message,
        type: msg.type as "message" | "donation" | "system",
        isModerated: msg.isModerated,
        createdAt: msg.createdAt,
      })
    })

    return mockMessages
  }

  return messages
}

export async function sendChatMessage(message: string, type: "message" | "donation" | "system" = "message") {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)

  return db.createChatMessage({
    userId: user.id,
    streamerId: user.id,
    username: user.username,
    message,
    type,
    isModerated: false,
    createdAt: new Date().toISOString(),
  })
}

export async function getChatSettings() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  let settings = db.getChatSettings(user.id)

  if (!settings) {
    settings = db.updateChatSettings(user.id, {
      isEnabled: true,
      allowGuests: true,
      moderationEnabled: false,
      bannedWords: [],
      slowMode: 0,
      subscriberOnly: false,
    })
  }

  return settings
}

export async function updateChatSettings(newSettings: any) {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    throw new Error("Not authenticated")
  }

  const user = JSON.parse(userJson)
  return db.updateChatSettings(user.id, newSettings)
}
