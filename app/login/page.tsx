"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { validateAdminLogin, validateFacultyLogin } from "@/lib/database"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"admin" | "faculty">("admin")
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
  })
  const [facultyForm, setFacultyForm] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminForm({
      ...adminForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleFacultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacultyForm({
      ...facultyForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const isValid = validateAdminLogin(adminForm.username, adminForm.password)

      if (isValid) {
        toast({
          title: "Login successful",
          description: "Welcome, Admin!",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const faculty = validateFacultyLogin(facultyForm.email, facultyForm.password)

      if (faculty) {
        toast({
          title: "Login successful",
          description: `Welcome, ${faculty.name}!`,
        })

        // Store faculty ID in session storage for retrieval in the dashboard
        sessionStorage.setItem("currentFaculty", JSON.stringify(faculty))

        router.push("/faculty/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the faculty timetable system</CardDescription>
        </CardHeader>

        <Tabs defaultValue="admin" onValueChange={(value) => setActiveTab(value as "admin" | "faculty")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <form onSubmit={handleAdminSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    name="username"
                    placeholder="admin"
                    required
                    value={adminForm.username}
                    onChange={handleAdminChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={adminForm.password}
                    onChange={handleAdminChange}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Default admin credentials:</p>
                  <p>Username: admin</p>
                  <p>Password: admin123</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="faculty">
            <form onSubmit={handleFacultySubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty-email">Email</Label>
                  <Input
                    id="faculty-email"
                    name="email"
                    type="email"
                    placeholder="faculty@example.com"
                    required
                    value={facultyForm.email}
                    onChange={handleFacultyChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-password">Password</Label>
                  <Input
                    id="faculty-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={facultyForm.password}
                    onChange={handleFacultyChange}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Faculty credentials are generated after admin uploads the timetable.</p>
                  <p>Email: [name]@faculty.edu</p>
                  <p>Password: [last name in lowercase]</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Faculty"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
