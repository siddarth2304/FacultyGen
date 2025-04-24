"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DocumentUploader } from "@/components/document-uploader"
import { FacultyList } from "@/components/faculty-list"
import { SwapRequestsManager } from "@/components/swap-requests-manager"
import { getAllFaculties, isDataLoaded } from "@/lib/database"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("upload")
  const [dataUploaded, setDataUploaded] = useState(false)
  const [facultyCount, setFacultyCount] = useState(0)

  useEffect(() => {
    // Check if data is already loaded
    setDataUploaded(isDataLoaded())
    setFacultyCount(getAllFaculties().length)
  }, [])

  const handleDataUploaded = () => {
    setDataUploaded(true)
    setFacultyCount(getAllFaculties().length)
  }

  return (
    <>
      <DashboardHeader heading="Admin Dashboard" text="Upload and manage faculty timetables" />

      <DashboardShell>
        <Tabs defaultValue="upload" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">Upload Timetable</TabsTrigger>
            <TabsTrigger value="faculty">Faculty List</TabsTrigger>
            <TabsTrigger value="swaps">Swap Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Timetable Document</CardTitle>
                <CardDescription>Upload a Word document containing faculty timetable information</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUploader onUploadComplete={handleDataUploaded} />
              </CardContent>
            </Card>

            {dataUploaded && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check-circle"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Timetable data uploaded successfully!</span>
                  </div>
                  <p className="mt-2">Processed {facultyCount} faculty members.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Faculty can now log in using their email and password.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="faculty" className="space-y-4">
            <FacultyList />
          </TabsContent>

          <TabsContent value="swaps" className="space-y-4">
            <SwapRequestsManager />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </>
  )
}
