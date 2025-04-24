"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle } from "lucide-react"
import { getSwapRequestsForFaculty, updateSwapRequestStatus, getFacultyByEmail } from "@/lib/database"

interface SwapRequestsListProps {
  facultyId: string
}

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

export function SwapRequestsList({ facultyId }: SwapRequestsListProps) {
  const { toast } = useToast()
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [activeTab, setActiveTab] = useState("incoming")

  useEffect(() => {
    // Load swap requests
    const requests = getSwapRequestsForFaculty(facultyId)
    setSwapRequests(requests)
  }, [facultyId])

  const incomingRequests = swapRequests.filter((req) => req.requestedFacultyId === facultyId)
  const outgoingRequests = swapRequests.filter((req) => req.requestingFacultyId === facultyId)

  const handleAcceptRequest = (requestId: string) => {
    try {
      updateSwapRequestStatus(requestId, "accepted")

      // Update the local state
      setSwapRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" } : req)))

      toast({
        title: "Request accepted",
        description: "You have accepted the swap request",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the request",
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
        description: "You have rejected the swap request",
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

  return (
    <Tabs defaultValue="incoming" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="incoming">
          Incoming Requests
          {incomingRequests.filter((r) => r.status === "pending").length > 0 && (
            <Badge className="ml-2 bg-primary">{incomingRequests.filter((r) => r.status === "pending").length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="incoming" className="space-y-4">
        {incomingRequests.length > 0 ? (
          incomingRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="grid gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{getFacultyName(request.requestingFacultyId)}</h3>
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
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No incoming swap requests</div>
        )}
      </TabsContent>

      <TabsContent value="outgoing" className="space-y-4">
        {outgoingRequests.length > 0 ? (
          outgoingRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="grid gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">Request to {getFacultyName(request.requestedFacultyId)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Sent on {new Date(request.createdAt).toLocaleDateString()}
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
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No outgoing swap requests</div>
        )}
      </TabsContent>
    </Tabs>
  )
}
