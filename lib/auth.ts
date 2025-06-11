import { db } from "./db"

export async function login(email: string, password: string) {
  // Get user by email
  const user = db.getUserByEmail(email)

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password")
  }

  // Store user in localStorage for session management
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
    }),
  )

  return user
}

export async function register(username: string, email: string, password: string) {
  // Check if user already exists
  const existingUserByEmail = db.getUserByEmail(email)
  const existingUserByUsername = db.getUserByUsername(username)

  if (existingUserByEmail || existingUserByUsername) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser = db.createUser({
    username,
    email,
    password,
    goalAmount: 1000,
    goalTitle: "هدف ماهانه",
    createdAt: new Date().toISOString(),
  })

  // Store user in localStorage for session management
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    }),
  )

  return newUser
}

export async function logout() {
  localStorage.removeItem("user")
}

export async function getCurrentUser() {
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    return null
  }

  try {
    return JSON.parse(userJson)
  } catch (error) {
    return null
  }
}
