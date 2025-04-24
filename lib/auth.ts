// This is a mock authentication service
// In a real application, you would implement proper authentication

import { validateAdminLogin, validateFacultyLogin } from "./database"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "faculty"
  department?: string
}

// Mock user database
const users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin",
    role: "admin",
  },
  {
    id: "user-2",
    name: "Dr. Jane Smith",
    email: "faculty@example.com",
    role: "faculty",
    department: "Computer Science",
  },
]

export async function login(email: string, password: string): Promise<User | null> {
  // Check if it's the admin login
  if (validateAdminLogin(email, password)) {
    return users[0]
  }

  // Check if it's a faculty login
  const faculty = validateFacultyLogin(email, password)
  if (faculty) {
    return {
      id: faculty.id,
      name: faculty.name,
      email: faculty.email,
      role: "faculty",
    }
  }

  // For demo purposes, allow login with any of the mock users
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (user) {
    return user
  }

  throw new Error("Invalid credentials")
}

export async function logout(): Promise<void> {
  // In a real app, you would clear cookies or tokens
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function getCurrentUser(): Promise<User | null> {
  // In a real app, you would verify the session token
  return null
}

// For development purposes, expose the mock users
export const mockUsers = users
