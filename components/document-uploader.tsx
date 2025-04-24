"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { processUploadedData } from "@/lib/database"
import { Upload } from "lucide-react"

interface DocumentUploaderProps {
  onUploadComplete: () => void
}

export function DocumentUploader({ onUploadComplete }: DocumentUploaderProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a document to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would send the file to the server for processing
      // Here we'll simulate parsing the document with the data provided by the user

      // Simulate file reading and processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Process the data (in a real app, this would be the parsed document data)
      const mockData = {
        classes: [
          {
            name: "CSE-A",
            facultyAssignments: [
              { subject: "DM", faculty: "Mrs. R. Pallavi Reddy" },
              { subject: "OOPJ", faculty: "Dr. T. Divya Kumari" },
              { subject: "OS", faculty: "Mrs. R. Mamatha" },
              { subject: "COA", faculty: "Mr. Ch. Sudarshan Reddy" },
              { subject: "SE", faculty: "Mrs. A. Jyothi" },
              { subject: "HVPE", faculty: "Mrs. N. Durga Bhavani" },
              { subject: "OOPJ LAB", faculty: "Dr. T. Divya Kumari, Mrs. A. Jyothi" },
              { subject: "OSMP LAB", faculty: "Mr. Ch. Sudarshan Reddy, Mrs. R. Mamatha" },
              { subject: "MP1 LAB", faculty: "Dr. T. Divya Kumari, Mrs. A. Jyothi" },
            ],
            timetable: {
              MONDAY: {
                "9:00-10:00": { subject: "DM", faculty: "Mrs. R. Pallavi Reddy" },
                "10:00-11:00": { subject: "OOPJ", faculty: "Dr. T. Divya Kumari" },
                "11:10-12:10": { subject: "Library", faculty: "" },
                "1:00-2:00": { subject: "HVPE", faculty: "Mrs. N. Durga Bhavani" },
                "2:00-3:00": { subject: "SE", faculty: "Mrs. A. Jyothi" },
                "3:00-4:00": { subject: "Sports", faculty: "" },
              },
              TUESDAY: {
                "9:00-10:00": { subject: "", faculty: "" },
                "10:00-11:00": { subject: "", faculty: "" },
                "11:10-12:10": { subject: "Placement Training", faculty: "" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "", faculty: "" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              WEDNESDAY: {
                "9:00-10:00": { subject: "OS", faculty: "Mrs. R. Mamatha" },
                "10:00-11:00": { subject: "COA", faculty: "Mr. Ch. Sudarshan Reddy" },
                "11:10-12:10": { subject: "SE", faculty: "Mrs. A. Jyothi" },
                "1:00-2:00": { subject: "OOPJ LAB", faculty: "Dr. T. Divya Kumari" },
                "2:00-3:00": { subject: "OSMP LAB", faculty: "Mr. Ch. Sudarshan Reddy" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              THURSDAY: {
                "9:00-10:00": { subject: "COA", faculty: "Mr. Ch. Sudarshan Reddy" },
                "10:00-11:00": { subject: "HVPE", faculty: "Mrs. N. Durga Bhavani" },
                "11:10-12:10": { subject: "OS", faculty: "Mrs. R. Mamatha" },
                "1:00-2:00": { subject: "DM", faculty: "Mrs. R. Pallavi Reddy" },
                "2:00-3:00": { subject: "OOPJ", faculty: "Dr. T. Divya Kumari" },
                "3:00-4:00": { subject: "Library", faculty: "" },
              },
              FRIDAY: {
                "9:00-10:00": { subject: "OOPJ LAB", faculty: "Dr. T. Divya Kumari" },
                "10:00-11:00": { subject: "OSMP LAB", faculty: "Mr. Ch. Sudarshan Reddy" },
                "11:10-12:10": { subject: "", faculty: "" },
                "1:00-2:00": { subject: "OS", faculty: "Mrs. R. Mamatha" },
                "2:00-3:00": { subject: "COA", faculty: "Mr. Ch. Sudarshan Reddy" },
                "3:00-4:00": { subject: "MP1 LAB", faculty: "Dr. T. Divya Kumari" },
              },
              SATURDAY: {
                "9:00-10:00": { subject: "OOPJ", faculty: "Dr. T. Divya Kumari" },
                "10:00-11:00": { subject: "COA", faculty: "Mr. Ch. Sudarshan Reddy" },
                "11:10-12:10": { subject: "DM", faculty: "Mrs. R. Pallavi Reddy" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "MP1 LAB", faculty: "Dr. T. Divya Kumari" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
            },
          },
          {
            name: "CSE-B",
            facultyAssignments: [
              { subject: "DM", faculty: "Mrs. M. Lalitha" },
              { subject: "OOPJ", faculty: "Dr. P. Vasanth Sena" },
              { subject: "OS", faculty: "Mrs. S. Sandhya" },
              { subject: "COA", faculty: "Mr. P. Kranthi Kiran" },
              { subject: "SE", faculty: "Mrs. B. Spandana" },
              { subject: "HVPE", faculty: "Dr. T. Anuradha" },
              { subject: "OOPJ LAB", faculty: "Dr. P. Vasanth Sena, Mrs. M. Lalitha" },
              { subject: "OSMP LAB", faculty: "Mrs. S. Sandhya, Mr. P.Kranthi Kiran" },
              { subject: "MP1 LAB", faculty: "Dr. P. Vasanth Sena, Mrs. S. Sandhya" },
            ],
            timetable: {
              MONDAY: {
                "9:00-10:00": { subject: "", faculty: "" },
                "10:00-11:00": { subject: "", faculty: "" },
                "11:10-12:10": { subject: "Placement Training", faculty: "" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "", faculty: "" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              TUESDAY: {
                "9:00-10:00": { subject: "OOPJ", faculty: "Dr. P. Vasanth Sena" },
                "10:00-11:00": { subject: "SE", faculty: "Mrs. B. Spandana" },
                "11:10-12:10": { subject: "OS", faculty: "Mrs. S. Sandhya" },
                "1:00-2:00": { subject: "OOPJ LAB", faculty: "Dr. P. Vasanth Sena" },
                "2:00-3:00": { subject: "OSMP LAB", faculty: "Mrs. S. Sandhya" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              WEDNESDAY: {
                "9:00-10:00": { subject: "COA", faculty: "Mr. P. Kranthi Kiran" },
                "10:00-11:00": { subject: "OS", faculty: "Mrs. S. Sandhya" },
                "11:10-12:10": { subject: "DM", faculty: "Mrs. M. Lalitha" },
                "1:00-2:00": { subject: "HVPE", faculty: "Dr. T. Anuradha" },
                "2:00-3:00": { subject: "OOPJ", faculty: "Dr. P. Vasanth Sena" },
                "3:00-4:00": { subject: "Sports", faculty: "" },
              },
              THURSDAY: {
                "9:00-10:00": { subject: "OSMP LAB", faculty: "Mrs. S. Sandhya" },
                "10:00-11:00": { subject: "OOPJ LAB", faculty: "Dr. P. Vasanth Sena" },
                "11:10-12:10": { subject: "", faculty: "" },
                "1:00-2:00": { subject: "DM", faculty: "Mrs. M. Lalitha" },
                "2:00-3:00": { subject: "SE", faculty: "Mrs. B. Spandana" },
                "3:00-4:00": { subject: "Library", faculty: "" },
              },
              FRIDAY: {
                "9:00-10:00": { subject: "DM", faculty: "Mrs. M. Lalitha" },
                "10:00-11:00": { subject: "HVPE", faculty: "Dr. T. Anuradha" },
                "11:10-12:10": { subject: "Library", faculty: "" },
                "1:00-2:00": { subject: "OS", faculty: "Mrs. S. Sandhya" },
                "2:00-3:00": { subject: "COA", faculty: "Mr. P. Kranthi Kiran" },
                "3:00-4:00": { subject: "MP1 LAB", faculty: "Dr. P. Vasanth Sena" },
              },
              SATURDAY: {
                "9:00-10:00": { subject: "SE", faculty: "Mrs. B. Spandana" },
                "10:00-11:00": { subject: "OOPJ", faculty: "Dr. P. Vasanth Sena" },
                "11:10-12:10": { subject: "COA", faculty: "Mr. P. Kranthi Kiran" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "MP1 LAB", faculty: "Dr. P. Vasanth Sena" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
            },
          },
          {
            name: "CSE-C",
            facultyAssignments: [
              { subject: "DM", faculty: "Mrs. Ch. Mandakini" },
              { subject: "OOPJ", faculty: "Mrs. G. Sandhya" },
              { subject: "OS", faculty: "Mrs. Ch. Radhika" },
              { subject: "COA", faculty: "Mr. G. Nagababu" },
              { subject: "SE", faculty: "Mrs. G. Amulya" },
              { subject: "HVPE", faculty: "Mrs. N. Durga Bhavani" },
              { subject: "OOPJ LAB", faculty: "Mrs. G. Sandhya, Mrs. Ch. Mandakini" },
              { subject: "OSMP LAB", faculty: "Mrs. Ch.Radhika, Mr. G. Nagababu" },
              { subject: "MP1 LAB", faculty: "Mrs. Ch. Radhika, Mrs. G. Amulya" },
            ],
            timetable: {
              MONDAY: {
                "9:00-10:00": { subject: "COA", faculty: "Mr. G. Nagababu" },
                "10:00-11:00": { subject: "HVPE", faculty: "Mrs. N. Durga Bhavani" },
                "11:10-12:10": { subject: "Library", faculty: "" },
                "1:00-2:00": { subject: "DM", faculty: "Mrs. Ch. Mandakini" },
                "2:00-3:00": { subject: "OS", faculty: "Mrs. Ch. Radhika" },
                "3:00-4:00": { subject: "Sports", faculty: "" },
              },
              TUESDAY: {
                "9:00-10:00": { subject: "", faculty: "" },
                "10:00-11:00": { subject: "", faculty: "" },
                "11:10-12:10": { subject: "Placement Training", faculty: "" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "", faculty: "" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              WEDNESDAY: {
                "9:00-10:00": { subject: "OOPJ", faculty: "Mrs. G. Sandhya" },
                "10:00-11:00": { subject: "COA", faculty: "Mr. G. Nagababu" },
                "11:10-12:10": { subject: "DM", faculty: "Mrs. Ch. Mandakini" },
                "1:00-2:00": { subject: "OOPJ LAB", faculty: "Mrs. G. Sandhya" },
                "2:00-3:00": { subject: "OSMP LAB", faculty: "Mrs. Ch.Radhika" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              THURSDAY: {
                "9:00-10:00": { subject: "DM", faculty: "Mrs. Ch. Mandakini" },
                "10:00-11:00": { subject: "OS", faculty: "Mrs. Ch. Radhika" },
                "11:10-12:10": { subject: "SE", faculty: "Mrs. G. Amulya" },
                "1:00-2:00": { subject: "HVPE", faculty: "Mrs. N. Durga Bhavani" },
                "2:00-3:00": { subject: "OOPJ", faculty: "Mrs. G. Sandhya" },
                "3:00-4:00": { subject: "Library", faculty: "" },
              },
              FRIDAY: {
                "9:00-10:00": { subject: "OSMP LAB", faculty: "Mrs. Ch.Radhika" },
                "10:00-11:00": { subject: "OOPJ LAB", faculty: "Mrs. G. Sandhya" },
                "11:10-12:10": { subject: "", faculty: "" },
                "1:00-2:00": { subject: "COA", faculty: "Mr. G. Nagababu" },
                "2:00-3:00": { subject: "SE", faculty: "Mrs. G. Amulya" },
                "3:00-4:00": { subject: "MP1 LAB", faculty: "Mrs. Ch. Radhika" },
              },
              SATURDAY: {
                "9:00-10:00": { subject: "OS", faculty: "Mrs. Ch. Radhika" },
                "10:00-11:00": { subject: "OOPJ", faculty: "Mrs. G. Sandhya" },
                "11:10-12:10": { subject: "SE", faculty: "Mrs. G. Amulya" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "MP1 LAB", faculty: "Mrs. Ch. Radhika" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
            },
          },
          {
            name: "CSE-D",
            facultyAssignments: [
              { subject: "DM", faculty: "Mr. Ch. Sudarshan Reddy" },
              { subject: "OOPJ", faculty: "Mrs. G. Mythili Sharvani" },
              { subject: "OS", faculty: "Mrs. D. Naga Swetha" },
              { subject: "COA", faculty: "Dr. G. Narendrababu Reddy" },
              { subject: "SE", faculty: "Mrs. J. Srilatha" },
              { subject: "HVPE", faculty: "Dr. T. Anuradha" },
              { subject: "OOPJ LAB", faculty: "Mrs. G. Mythili Sharvani, Mrs. J. Srilatha" },
              { subject: "OSMP LAB", faculty: "Mrs. D. Naga Swetha, Mr. G. Nagababu" },
              { subject: "MP1 LAB", faculty: "Mrs. D. Naga Swetha, Mrs. G. Mythili Sharvani" },
            ],
            timetable: {
              MONDAY: {
                "9:00-10:00": { subject: "OS", faculty: "Mrs. D. Naga Swetha" },
                "10:00-11:00": { subject: "HVPE", faculty: "Dr. T. Anuradha" },
                "11:10-12:10": { subject: "COA", faculty: "Dr. G. Narendrababu Reddy" },
                "1:00-2:00": { subject: "OOPJ LAB", faculty: "Mrs. G. Mythili Sharvani" },
                "2:00-3:00": { subject: "OSMP LAB", faculty: "Mrs. D. Naga Swetha" },
                "3:00-4:00": { subject: "MP1 LAB", faculty: "Mrs. D. Naga Swetha" },
              },
              TUESDAY: {
                "9:00-10:00": { subject: "", faculty: "" },
                "10:00-11:00": { subject: "", faculty: "" },
                "11:10-12:10": { subject: "Placement Training", faculty: "" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "", faculty: "" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
              WEDNESDAY: {
                "9:00-10:00": { subject: "OOPJ", faculty: "Mrs. G. Mythili Sharvani" },
                "10:00-11:00": { subject: "DM", faculty: "Mr. Ch. Sudarshan Reddy" },
                "11:10-12:10": { subject: "", faculty: "" },
                "1:00-2:00": { subject: "COA", faculty: "Dr. G. Narendrababu Reddy" },
                "2:00-3:00": { subject: "OS", faculty: "Mrs. D. Naga Swetha" },
                "3:00-4:00": { subject: "Library", faculty: "" },
              },
              THURSDAY: {
                "9:00-10:00": { subject: "OSMP LAB", faculty: "Mrs. D. Naga Swetha" },
                "10:00-11:00": { subject: "OOPJ LAB", faculty: "Mrs. G. Mythili Sharvani" },
                "11:10-12:10": { subject: "", faculty: "" },
                "1:00-2:00": { subject: "DM", faculty: "Mr. Ch. Sudarshan Reddy" },
                "2:00-3:00": { subject: "OOPJ", faculty: "Mrs. G. Mythili Sharvani" },
                "3:00-4:00": { subject: "MP1 LAB", faculty: "Mrs. D. Naga Swetha" },
              },
              FRIDAY: {
                "9:00-10:00": { subject: "COA", faculty: "Dr. G. Narendrababu Reddy" },
                "10:00-11:00": { subject: "OS", faculty: "Mrs. D. Naga Swetha" },
                "11:10-12:10": { subject: "Library", faculty: "" },
                "1:00-2:00": { subject: "HVPE", faculty: "Dr. T. Anuradha" },
                "2:00-3:00": { subject: "SE", faculty: "Mrs. J. Srilatha" },
                "3:00-4:00": { subject: "Sports", faculty: "" },
              },
              SATURDAY: {
                "9:00-10:00": { subject: "DM", faculty: "Mr. Ch. Sudarshan Reddy" },
                "10:00-11:00": { subject: "", faculty: "" },
                "11:10-12:10": { subject: "OOPJ", faculty: "Mrs. G. Mythili Sharvani" },
                "1:00-2:00": { subject: "", faculty: "" },
                "2:00-3:00": { subject: "MP1 LAB", faculty: "Mrs. D. Naga Swetha" },
                "3:00-4:00": { subject: "", faculty: "" },
              },
            },
          },
        ],
      }

      processUploadedData(mockData)

      toast({
        title: "Upload successful",
        description: "The timetable data has been processed",
      })

      onUploadComplete()
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing the document",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document">Timetable Document</Label>
        <Input id="document" type="file" accept=".docx,.doc" onChange={handleFileChange} />
        {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
      </div>

      <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
        {isUploading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload and Process Document
          </>
        )}
      </Button>

      <div className="text-sm text-muted-foreground mt-4">
        <p className="font-medium">Document Format Requirements:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Microsoft Word document (.docx or .doc)</li>
          <li>Contains faculty names and their assigned subjects</li>
          <li>Contains class timetables with time slots</li>
          <li>Faculty credentials will be automatically generated</li>
        </ul>
      </div>
    </div>
  )
}
