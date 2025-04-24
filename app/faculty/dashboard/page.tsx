"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TimetableViewer } from "@/components/timetable-viewer"
import { SwapRequestsList } from "@/components/swap-requests-list"
import type { Faculty } from "@/lib/database"

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState("timetable")
  const [faculty, setFaculty] = useState<Faculty | null>(null)

  useEffect(() => {
    // Get faculty data from session storage
    const storedFaculty = sessionStorage.getItem("currentFaculty")
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty))
    }
  }, [])

  if (!faculty) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Session Expired</CardTitle>
            <CardDescription>Your session has expired or you are not logged in. Please log in again.</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/login"
              className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md"
            >
              Return to Login
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader heading={`Welcome, ${faculty.name}`} text={`View your timetable and manage swap requests`} />

      <DashboardShell>
        <Tabs defaultValue="timetable" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="timetable">My Timetable</TabsTrigger>
            <TabsTrigger value="swap-requests">Swap Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="timetable" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Current Timetable</CardTitle>
                <CardDescription>View your weekly schedule and request period swaps if needed</CardDescription>
              </CardHeader>
              <CardContent>
                <TimetableViewer facultyId={faculty.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swap-requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Period Swap Requests</CardTitle>
                <CardDescription>Manage your incoming and outgoing swap requests</CardDescription>
              </CardHeader>
              <CardContent>
                <SwapRequestsList facultyId={faculty.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </>
  )
}
