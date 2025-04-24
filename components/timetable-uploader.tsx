"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentUploader } from "./document-uploader"
import { useToast } from "@/hooks/use-toast"
import { isDataLoaded } from "@/lib/database"

export function TimetableUploader() {
  const { toast } = useToast()
  const [isUploaded, setIsUploaded] = useState(isDataLoaded())

  const handleUploadComplete = () => {
    setIsUploaded(true)
    toast({
      title: "Timetable uploaded",
      description: "Faculty timetable data has been processed successfully",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Faculty Timetable</CardTitle>
        <CardDescription>
          Upload the faculty timetable document to generate faculty accounts and schedules
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isUploaded ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Timetable data uploaded successfully</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      The faculty timetable has been processed. Faculty accounts have been created and schedules have
                      been assigned.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setIsUploaded(false)} className="text-sm text-primary hover:underline">
              Upload a different timetable
            </button>
          </div>
        ) : (
          <DocumentUploader onUploadComplete={handleUploadComplete} />
        )}
      </CardContent>
    </Card>
  )
}
