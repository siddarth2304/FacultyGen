"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { createSwapRequest, type Faculty } from "@/lib/database"

interface TimeSlot {
  day: string
  time: string
  subject: string
  class: string
}

interface SwapRequestFormProps {
  isOpen: boolean
  onClose: () => void
  timeSlot: TimeSlot
  facultyId: string
  otherFaculties: Faculty[]
}

export function SwapRequestForm({ isOpen, onClose, timeSlot, facultyId, otherFaculties }: SwapRequestFormProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedFaculty, setSelectedFaculty] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFaculty || !date || !reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create swap request
      createSwapRequest(
        facultyId,
        selectedFaculty,
        timeSlot,
        null, // No proposed time slot for now
        reason,
      )

      toast({
        title: "Swap request sent",
        description: "Your swap request has been sent successfully",
      })

      // Reset form and close dialog
      setSelectedFaculty("")
      setReason("")
      onClose()
    } catch (error) {
      toast({
        title: "Failed to send request",
        description: "There was an error sending your swap request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Period Swap</DialogTitle>
          <DialogDescription>Request another faculty member to cover your class when you're absent.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {timeSlot && (
            <div className="grid gap-2">
              <Label>Current Period</Label>
              <div className="rounded-md border p-3 text-sm">
                <div className="font-medium">{timeSlot.subject}</div>
                <div className="text-muted-foreground">
                  {timeSlot.day}, {timeSlot.time}, {timeSlot.class}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="faculty">Faculty to Swap With</Label>
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger id="faculty">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {otherFaculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Date of Absence</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Absence</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your absence"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
