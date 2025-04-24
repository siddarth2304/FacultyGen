"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
  faculty: {
    name: string
    department: string
    email: string
    id: string
    lastLogin: string
  }
}

export function UserProfile({ faculty }: UserProfileProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: faculty.name,
    email: faculty.email,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    // In a real app, you would save the changes to the database
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and update your profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          {isEditing ? (
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          ) : (
            <div className="p-2 border rounded-md">{faculty.name}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          ) : (
            <div className="p-2 border rounded-md">{faculty.email}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <div className="p-2 border rounded-md">{faculty.department}</div>
        </div>

        <div className="space-y-2">
          <Label>Faculty ID</Label>
          <div className="p-2 border rounded-md">{faculty.id}</div>
        </div>

        <div className="space-y-2">
          <Label>Last Login</Label>
          <div className="p-2 border rounded-md">{faculty.lastLogin}</div>
        </div>
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="w-full">
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
