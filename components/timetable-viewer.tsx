"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SwapRequestForm } from "./swap-request-form"
import { CalendarClock } from "lucide-react"
import { getFacultyTimetable, getAllFaculties, type Faculty } from "@/lib/database"

interface TimetableViewerProps {
  facultyId: string
}

interface TimeSlot {
  day: string
  time: string
  subject: string
  class: string
}

export function TimetableViewer({ facultyId }: TimetableViewerProps) {
  const [selectedDay, setSelectedDay] = useState("MONDAY")
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [timetable, setTimetable] = useState<TimeSlot[]>([])
  const [otherFaculties, setOtherFaculties] = useState<Faculty[]>([])

  useEffect(() => {
    // Load timetable data
    const facultyTimetable = getFacultyTimetable(facultyId)
    setTimetable(facultyTimetable)

    // Load other faculty members for swap requests
    const allFaculties = getAllFaculties()
    setOtherFaculties(allFaculties.filter((f) => f.id !== facultyId))
  }, [facultyId])

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

  // Filter timetable by selected day
  const daySchedule = timetable.filter((slot) => slot.day === selectedDay)

  const handleRequestSwap = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setIsSwapModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Label htmlFor="day">Select Day</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {daySchedule.length > 0 ? (
          daySchedule.map((slot, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm">{slot.time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Subject</p>
                      <p className="text-sm">{slot.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Class</p>
                      <p className="text-sm">{slot.class}</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleRequestSwap(slot)}
                  >
                    <CalendarClock className="h-4 w-4" />
                    <span>Swap</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No classes scheduled for {selectedDay}</div>
        )}
      </div>

      {selectedTimeSlot && (
        <SwapRequestForm
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          timeSlot={selectedTimeSlot}
          facultyId={facultyId}
          otherFaculties={otherFaculties}
        />
      )}
    </div>
  )
}
