"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getAllFaculties, type Faculty } from "@/lib/database"
import { Search, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

export function FacultyList() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Load faculty data
    setFaculties(getAllFaculties())
  }, [])

  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleLoginAsFaculty = (faculty: Faculty) => {
    // Store faculty data in session storage
    sessionStorage.setItem("currentFaculty", JSON.stringify(faculty))

    // Navigate to faculty dashboard
    router.push("/faculty/dashboard")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faculty Members</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {faculties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No faculty data available. Please upload a timetable document first.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculties.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell>{faculty.email}</TableCell>
                  <TableCell>{faculty.subjects.join(", ")}</TableCell>
                  <TableCell>{faculty.password}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleLoginAsFaculty(faculty)}
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>Login as</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
