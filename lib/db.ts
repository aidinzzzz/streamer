// Browser-compatible database using localStorage

// Define types for our data
interface User {
  id: number
  username: string
  email: string
  password: string
  goalAmount: number
  goalTitle: string
  createdAt: string
}

interface Donation {
  id: number
  userId: number
  name: string
  amount: number
  message?: string
  createdAt: string
}

// Add new interfaces for subscriptions and financial data
interface Subscription {
  id: number
  userId: number
  planId: string
  status: "active" | "cancelled" | "expired"
  startDate: string
  endDate: string
  amount: number
  paymentMethod: string
  createdAt: string
}

interface Transaction {
  id: number
  userId: number
  type: "donation" | "subscription" | "withdrawal"
  amount: number
  fee: number
  netAmount: number
  currency: string
  paymentMethod: string
  status: "pending" | "completed" | "failed"
  transactionId: string
  createdAt: string
}

interface PaymentSettings {
  id: number
  userId: number
  minDonationAmount: number
  maxDonationAmount: number
  autoWithdrawal: boolean
  withdrawalThreshold: number
  commissionRate: number
  allowedCurrencies: string[]
  fraudDetection: boolean
  webhookUrl?: string
  createdAt: string
  updatedAt: string
}

// Add new interfaces after existing ones

interface UserPoints {
  id: number
  userId: number
  totalPoints: number
  level: number
  badges: string[]
  lastDonationDate: string
  streakDays: number
  createdAt: string
  updatedAt: string
}

interface PointsTransaction {
  id: number
  userId: number
  points: number
  type: "earned" | "redeemed" | "bonus"
  reason: string
  donationId?: number
  createdAt: string
}

interface Reward {
  id: number
  name: string
  description: string
  pointsCost: number
  type: "badge" | "privilege" | "physical"
  isActive: boolean
  createdAt: string
}

interface ApiKey {
  id: number
  userId: number
  keyName: string
  apiKey: string
  permissions: string[]
  isActive: boolean
  lastUsed?: string
  requestCount: number
  createdAt: string
}

interface ChatMessage {
  id: number
  userId: number
  streamerId: number
  username: string
  message: string
  type: "message" | "donation" | "system"
  isModerated: boolean
  createdAt: string
}

interface ChatSettings {
  id: number
  userId: number
  isEnabled: boolean
  allowGuests: boolean
  moderationEnabled: boolean
  bannedWords: string[]
  slowMode: number
  subscriberOnly: boolean
  createdAt: string
  updatedAt: string
}

// Initialize database with sample data
function initDb() {
  // Check if DB is already initialized
  if (!localStorage.getItem("db_initialized")) {
    // Create initial data
    const users: User[] = [
      {
        id: 1,
        username: "demo",
        email: "demo@example.com",
        password: "password",
        goalAmount: 1000,
        goalTitle: "هدف ماهانه",
        createdAt: new Date().toISOString(),
      },
    ]

    const donations: Donation[] = [
      {
        id: 1,
        userId: 1,
        name: "علی",
        amount: 10000,
        message: "عالی بود!",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        userId: 1,
        name: "محمد",
        amount: 5000,
        message: "ادامه بده!",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        userId: 1,
        name: "سارا",
        amount: 20000,
        message: "استریم خیلی خوبی بود",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ]

    const subscriptions: Subscription[] = []
    const transactions: Transaction[] = []
    const paymentSettings: PaymentSettings[] = []
    const userPoints: UserPoints[] = []
    const pointsTransactions: PointsTransaction[] = []
    const rewards: Reward[] = [
      {
        id: 1,
        name: "نشان برنزی",
        description: "اولین دونیت شما",
        pointsCost: 0,
        type: "badge",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "نشان نقره‌ای",
        description: "10 دونیت موفق",
        pointsCost: 100,
        type: "badge",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "نشان طلایی",
        description: "50 دونیت موفق",
        pointsCost: 500,
        type: "badge",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "دسترسی VIP",
        description: "دسترسی به چت VIP",
        pointsCost: 200,
        type: "privilege",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]
    const apiKeys: ApiKey[] = []
    const chatMessages: ChatMessage[] = []
    const chatSettings: ChatSettings[] = []

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("donations", JSON.stringify(donations))
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions))
    localStorage.setItem("transactions", JSON.stringify(transactions))
    localStorage.setItem("payment_settings", JSON.stringify(paymentSettings))
    localStorage.setItem("user_points", JSON.stringify(userPoints))
    localStorage.setItem("points_transactions", JSON.stringify(pointsTransactions))
    localStorage.setItem("rewards", JSON.stringify(rewards))
    localStorage.setItem("api_keys", JSON.stringify(apiKeys))
    localStorage.setItem("chat_messages", JSON.stringify(chatMessages))
    localStorage.setItem("chat_settings", JSON.stringify(chatSettings))
    localStorage.setItem("db_initialized", "true")
  }
}

// Get all users
function getUsers(): User[] {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

// Get all donations
function getDonations(): Donation[] {
  const donations = localStorage.getItem("donations")
  return donations ? JSON.parse(donations) : []
}

// Save users
function saveUsers(users: User[]) {
  localStorage.setItem("users", JSON.stringify(users))
}

// Save donations
function saveDonations(donations: Donation[]) {
  localStorage.setItem("donations", JSON.stringify(donations))
}

// Get all subscriptions
function getSubscriptions(): Subscription[] {
  const subscriptions = localStorage.getItem("subscriptions")
  return subscriptions ? JSON.parse(subscriptions) : []
}

// Save subscriptions
function saveSubscriptions(subscriptions: Subscription[]) {
  localStorage.setItem("subscriptions", JSON.stringify(subscriptions))
}

// Get all transactions
function getTransactions(): Transaction[] {
  const transactions = localStorage.getItem("transactions")
  return transactions ? JSON.parse(transactions) : []
}

// Save transactions
function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

// Get all payment settings
function getPaymentSettingsData(): PaymentSettings[] {
  const settings = localStorage.getItem("payment_settings")
  return settings ? JSON.parse(settings) : []
}

// Save payment settings
function savePaymentSettingsData(settings: PaymentSettings[]) {
  localStorage.setItem("payment_settings", JSON.stringify(settings))
}

// Initialize the database
if (typeof window !== "undefined") {
  initDb()
}

// Database methods
export const db = {
  // User methods
  getUserByEmail: (email: string) => {
    const users = getUsers()
    return users.find((user) => user.email === email) || null
  },

  getUserById: (id: number) => {
    const users = getUsers()
    return users.find((user) => user.id === id) || null
  },

  getUserByUsername: (username: string) => {
    const users = getUsers()
    return users.find((user) => user.username === username) || null
  },

  createUser: (userData: Omit<User, "id">) => {
    const users = getUsers()
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

    const newUser = {
      ...userData,
      id: newId,
    }

    users.push(newUser)
    saveUsers(users)

    return newUser
  },

  updateUser: (id: number, userData: Partial<User>) => {
    const users = getUsers()
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
      users[index] = { ...users[index], ...userData }
      saveUsers(users)
      return users[index]
    }

    return null
  },

  // Donation methods
  getDonationsByUserId: (userId: number) => {
    const donations = getDonations()
    return donations.filter((donation) => donation.userId === userId)
  },

  createDonation: (donationData: Omit<Donation, "id">) => {
    const donations = getDonations()
    const newId = donations.length > 0 ? Math.max(...donations.map((d) => d.id)) + 1 : 1

    const newDonation = {
      ...donationData,
      id: newId,
    }

    donations.push(newDonation)
    saveDonations(donations)

    return newDonation
  },

  // Aggregation methods
  getTotalDonations: (userId: number) => {
    const donations = getDonations()
    return donations
      .filter((donation) => donation.userId === userId)
      .reduce((sum, donation) => sum + donation.amount, 0)
  },

  getDonationCount: (userId: number) => {
    const donations = getDonations()
    return donations.filter((donation) => donation.userId === userId).length
  },

  getTodayDonations: (userId: number) => {
    const donations = getDonations()
    const today = new Date().toISOString().split("T")[0]

    return donations
      .filter((donation) => {
        const donationDate = donation.createdAt.split("T")[0]
        return donation.userId === userId && donationDate === today
      })
      .reduce((sum, donation) => sum + donation.amount, 0)
  },

  getCurrentMonthDonations: (userId: number) => {
    const donations = getDonations()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    return donations
      .filter((donation) => donation.userId === userId && donation.createdAt >= startOfMonth)
      .reduce((sum, donation) => sum + donation.amount, 0)
  },

  getRecentDonations: (userId: number, limit = 10) => {
    const donations = getDonations()
    return donations
      .filter((donation) => donation.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  },

  // Subscription methods
  createSubscription: (subscriptionData: Omit<Subscription, "id">) => {
    const subscriptions = getSubscriptions()
    const newId = subscriptions.length > 0 ? Math.max(...subscriptions.map((s) => s.id)) + 1 : 1

    const newSubscription = {
      ...subscriptionData,
      id: newId,
    }

    subscriptions.push(newSubscription)
    saveSubscriptions(subscriptions)
    return newSubscription
  },

  getSubscriptionsByUserId: (userId: number) => {
    const subscriptions = getSubscriptions()
    return subscriptions.filter((sub) => sub.userId === userId)
  },

  updateSubscription: (id: number, data: Partial<Subscription>) => {
    const subscriptions = getSubscriptions()
    const index = subscriptions.findIndex((sub) => sub.id === id)

    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...data }
      saveSubscriptions(subscriptions)
      return subscriptions[index]
    }
    return null
  },

  // Transaction methods
  createTransaction: (transactionData: Omit<Transaction, "id">) => {
    const transactions = getTransactions()
    const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1

    const newTransaction = {
      ...transactionData,
      id: newId,
    }

    transactions.push(newTransaction)
    saveTransactions(transactions)
    return newTransaction
  },

  getTransactionsByUserId: (userId: number) => {
    const transactions = getTransactions()
    return transactions.filter((t) => t.userId === userId)
  },

  // Payment settings methods
  getPaymentSettings: (userId: number) => {
    const settings = getPaymentSettingsData()
    return settings.find((s) => s.userId === userId) || null
  },

  updatePaymentSettings: (userId: number, settingsData: Partial<PaymentSettings>) => {
    const settings = getPaymentSettingsData()
    const index = settings.findIndex((s) => s.userId === userId)

    if (index !== -1) {
      settings[index] = { ...settings[index], ...settingsData, updatedAt: new Date().toISOString() }
    } else {
      const newSettings = {
        id: settings.length + 1,
        userId,
        minDonationAmount: 1000,
        maxDonationAmount: 1000000,
        autoWithdrawal: false,
        withdrawalThreshold: 100000,
        commissionRate: 5,
        allowedCurrencies: ["IRR", "USD"],
        fraudDetection: true,
        ...settingsData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      settings.push(newSettings)
    }

    savePaymentSettingsData(settings)
    return settings.find((s) => s.userId === userId)
  },

  // Points system methods
  getUserPoints: (userId: number) => {
    const points = getUserPoints()
    return points.find((p) => p.userId === userId) || null
  },

  createUserPoints: (userId: number) => {
    const points = getUserPoints()
    const newPoints = {
      id: points.length + 1,
      userId,
      totalPoints: 0,
      level: 1,
      badges: ["bronze"],
      lastDonationDate: new Date().toISOString(),
      streakDays: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    points.push(newPoints)
    saveUserPoints(points)
    return newPoints
  },

  updateUserPoints: (userId: number, pointsData: Partial<UserPoints>) => {
    const points = getUserPoints()
    const index = points.findIndex((p) => p.userId === userId)

    if (index !== -1) {
      points[index] = { ...points[index], ...pointsData, updatedAt: new Date().toISOString() }
      saveUserPoints(points)
      return points[index]
    }
    return null
  },

  addPointsTransaction: (transactionData: Omit<PointsTransaction, "id">) => {
    const transactions = getPointsTransactions()
    const newTransaction = {
      ...transactionData,
      id: transactions.length + 1,
    }
    transactions.push(newTransaction)
    savePointsTransactions(transactions)
    return newTransaction
  },

  getPointsTransactionsByUserId: (userId: number) => {
    const transactions = getPointsTransactions()
    return transactions.filter((t) => t.userId === userId)
  },

  getRewards: () => {
    return getRewards()
  },

  redeemReward: (userId: number, rewardId: number) => {
    const userPoints = db.getUserPoints(userId)
    const rewards = getRewards()
    const reward = rewards.find((r) => r.id === rewardId)

    if (!userPoints || !reward || userPoints.totalPoints < reward.pointsCost) {
      return { success: false, message: "امتیاز کافی ندارید" }
    }

    // Deduct points
    db.updateUserPoints(userId, {
      totalPoints: userPoints.totalPoints - reward.pointsCost,
    })

    // Add transaction
    db.addPointsTransaction({
      userId,
      points: -reward.pointsCost,
      type: "redeemed",
      reason: `تبدیل امتیاز برای ${reward.name}`,
      createdAt: new Date().toISOString(),
    })

    // Add badge if it's a badge reward
    if (reward.type === "badge") {
      const updatedBadges = [...userPoints.badges, reward.name.toLowerCase().replace(/\s+/g, "_")]
      db.updateUserPoints(userId, { badges: updatedBadges })
    }

    return { success: true, reward }
  },

  // API Keys methods
  createApiKey: (userId: number, keyName: string, permissions: string[]) => {
    const keys = getApiKeys()
    const apiKey = `sk_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`

    const newKey = {
      id: keys.length + 1,
      userId,
      keyName,
      apiKey,
      permissions,
      isActive: true,
      requestCount: 0,
      createdAt: new Date().toISOString(),
    }

    keys.push(newKey)
    saveApiKeys(keys)
    return newKey
  },

  getApiKeysByUserId: (userId: number) => {
    const keys = getApiKeys()
    return keys.filter((k) => k.userId === userId)
  },

  validateApiKey: (apiKey: string) => {
    const keys = getApiKeys()
    const key = keys.find((k) => k.apiKey === apiKey && k.isActive)

    if (key) {
      // Update usage stats
      const updatedKeys = keys.map((k) =>
        k.id === key.id ? { ...k, requestCount: k.requestCount + 1, lastUsed: new Date().toISOString() } : k,
      )
      saveApiKeys(updatedKeys)
    }

    return key || null
  },

  updateApiKey: (keyId: number, updates: Partial<ApiKey>) => {
    const keys = getApiKeys()
    const index = keys.findIndex((k) => k.id === keyId)

    if (index !== -1) {
      keys[index] = { ...keys[index], ...updates }
      saveApiKeys(keys)
      return keys[index]
    }
    return null
  },

  // Chat methods
  createChatMessage: (messageData: Omit<ChatMessage, "id">) => {
    const messages = getChatMessages()
    const newMessage = {
      ...messageData,
      id: messages.length + 1,
    }
    messages.push(newMessage)
    saveChatMessages(messages)
    return newMessage
  },

  getChatMessagesByStreamer: (streamerId: number, limit = 50) => {
    const messages = getChatMessages()
    return messages
      .filter((m) => m.streamerId === streamerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  },

  getChatSettings: (userId: number) => {
    const settings = getChatSettings()
    return settings.find((s) => s.userId === userId) || null
  },

  updateChatSettings: (userId: number, settingsData: Partial<ChatSettings>) => {
    const settings = getChatSettings()
    const index = settings.findIndex((s) => s.userId === userId)

    if (index !== -1) {
      settings[index] = { ...settings[index], ...settingsData, updatedAt: new Date().toISOString() }
    } else {
      const newSettings = {
        id: settings.length + 1,
        userId,
        isEnabled: true,
        allowGuests: true,
        moderationEnabled: false,
        bannedWords: [],
        slowMode: 0,
        subscriberOnly: false,
        ...settingsData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      settings.push(newSettings)
    }

    saveChatSettings(settings)
    return settings.find((s) => s.userId === userId)
  },
}

// Add new helper functions at the end of the file

function getUserPoints(): UserPoints[] {
  const points = localStorage.getItem("user_points")
  return points ? JSON.parse(points) : []
}

function saveUserPoints(points: UserPoints[]) {
  localStorage.setItem("user_points", JSON.stringify(points))
}

function getPointsTransactions(): PointsTransaction[] {
  const transactions = localStorage.getItem("points_transactions")
  return transactions ? JSON.parse(transactions) : []
}

function savePointsTransactions(transactions: PointsTransaction[]) {
  localStorage.setItem("points_transactions", JSON.stringify(transactions))
}

function getRewards(): Reward[] {
  const rewards = localStorage.getItem("rewards")
  return rewards
    ? JSON.parse(rewards)
    : [
        {
          id: 1,
          name: "نشان برنزی",
          description: "اولین دونیت شما",
          pointsCost: 0,
          type: "badge",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "نشان نقره‌ای",
          description: "10 دونیت موفق",
          pointsCost: 100,
          type: "badge",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "نشان طلایی",
          description: "50 دونیت موفق",
          pointsCost: 500,
          type: "badge",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "دسترسی VIP",
          description: "دسترسی به چت VIP",
          pointsCost: 200,
          type: "privilege",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]
}

function saveRewards(rewards: Reward[]) {
  localStorage.setItem("rewards", JSON.stringify(rewards))
}

function getApiKeys(): ApiKey[] {
  const keys = localStorage.getItem("api_keys")
  return keys ? JSON.parse(keys) : []
}

function saveApiKeys(keys: ApiKey[]) {
  localStorage.setItem("api_keys", JSON.stringify(keys))
}

function getChatMessages(): ChatMessage[] {
  const messages = localStorage.getItem("chat_messages")
  return messages ? JSON.parse(messages) : []
}

function saveChatMessages(messages: ChatMessage[]) {
  localStorage.setItem("chat_messages", JSON.stringify(messages))
}

function getChatSettings(): ChatSettings[] {
  const settings = localStorage.getItem("chat_settings")
  return settings ? JSON.parse(settings) : []
}

function saveChatSettings(settings: ChatSettings[]) {
  localStorage.setItem("chat_settings", JSON.stringify(settings))
}
