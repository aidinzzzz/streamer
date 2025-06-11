// In a real app, you would use a real-time solution like Socket.io or WebSockets
// For this demo, we'll simulate real-time updates with a simple event system

type Listener = (data: any) => void

const listeners: Record<string, Record<string, Listener[]>> = {
  alerts: {},
  goals: {},
  recentDonations: {},
}

// Alert events
export function subscribeToAlerts(username: string, callback: Listener) {
  if (!listeners.alerts[username]) {
    listeners.alerts[username] = []
  }

  listeners.alerts[username].push(callback)

  return () => {
    listeners.alerts[username] = listeners.alerts[username].filter((cb) => cb !== callback)
  }
}

export function emitAlert(username: string, data: any) {
  if (listeners.alerts[username]) {
    listeners.alerts[username].forEach((callback) => callback(data))
  }
}

// Goal update events
export function subscribeToGoalUpdates(username: string, callback: Listener) {
  if (!listeners.goals[username]) {
    listeners.goals[username] = []
  }

  listeners.goals[username].push(callback)

  return () => {
    listeners.goals[username] = listeners.goals[username].filter((cb) => cb !== callback)
  }
}

export function emitGoalUpdate(username: string, data: any) {
  if (listeners.goals[username]) {
    listeners.goals[username].forEach((callback) => callback(data))
  }
}

// Recent donations events
export function subscribeToRecentDonations(username: string, callback: Listener) {
  if (!listeners.recentDonations[username]) {
    listeners.recentDonations[username] = []
  }

  listeners.recentDonations[username].push(callback)

  return () => {
    listeners.recentDonations[username] = listeners.recentDonations[username].filter((cb) => cb !== callback)
  }
}

export function emitRecentDonationsUpdate(username: string, data: any) {
  if (listeners.recentDonations[username]) {
    listeners.recentDonations[username].forEach((callback) => callback(data))
  }
}
