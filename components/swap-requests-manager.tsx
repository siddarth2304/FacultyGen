"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Search, XCircle } from "lucide-react"
import { getSwapRequestsForFaculty, updateSwapRequestStatus, getAllFaculties, getFacultyByEmail } from "@/lib/database"

interface SwapRequest {
  id: string
  requestingFacultyId: string
  requestedFacultyId: string
  timeSlot: {
    day: string
    time: string
    subject: string
    class: string
  }
  proposedTimeSlot: any
  reason: string
  status: string
  createdAt: Date
}

export function SwapRequestsManager() {
  const { toast } = useToast()
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch all swap requests
    // For now, we'll get all faculty members and then get their swap requests
    const faculties = getAllFaculties()
    let allRequests: SwapRequest[] = []

    faculties.forEach((faculty) => {
      const facultyRequests = getSwapRequestsForFaculty(faculty.id)
      allRequests = [...allRequests, ...facultyRequests]
    })

    // Remove duplicates (since each request appears for both requesting and requested faculty)
    const uniqueRequests = Array.from(new Map(allRequests.map((item) => [item.id, item])).values())

    setSwapRequests(uniqueRequests)
  }, [])

  const handleApproveRequest = (requestId: string) => {
    try {
      updateSwapRequestStatus(requestId, "accepted")

      // Update the local state
      setSwapRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" } : req)))

      toast({
        title: "Request approved",
        description: "The swap request has been approved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request",
        variant: "destructive",
      })
    }
  }

  const handleRejectRequest = (requestId: string) => {
    try {
      updateSwapRequestStatus(requestId, "rejected")

      // Update the local state
      setSwapRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))

      toast({
        title: "Request rejected",
        description: "The swap request has been rejected",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const getFacultyName = (id: string) => {
    const faculty = getFacultyByEmail(id)
    return faculty ? faculty.name : "Unknown Faculty"
  }

  // Filter requests based on search term and status filter
  const filteredRequests = swapRequests.filter((request) => {
    const requestingFacultyName = getFacultyName(request.requestingFacultyId)
    const requestedFacultyName = getFacultyName(request.requestedFacultyId)

    const matchesSearch =
      requestingFacultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestedFacultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.timeSlot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.timeSlot.day.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="grid gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">
                      {getFacultyName(request.requestingFacultyId)} → {getFacultyName(request.requestedFacultyId)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>{getStatusBadge(request.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Subject</p>
                    <p className="text-sm">{request.timeSlot.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm">
                      {request.timeSlot.day}, {request.timeSlot.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Class</p>
                    <p className="text-sm">{request.timeSlot.class}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Reason</p>
                  <p className="text-sm">{request.reason}</p>
                </div>

                {request.status === "pending" && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleApproveRequest(request.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No swap requests found</div>
        )}
      </div>
    </div>
  )
}
