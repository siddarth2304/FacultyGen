"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  isLab?: boolean
  labHour?: number
  totalLabHours?: number
}

export function TimetableViewer({ facultyId }: TimetableViewerProps) {
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
  const timeSlots = ["9:00-10:00", "10:00-11:00", "11:10-12:10", "1:00-2:00", "2:00-3:00", "3:00-4:00"]

  // Process timetable data to create a weekly view
  const weeklyTimetable = React.useMemo(() => {
    const processedTimetable = {}

    // Initialize empty timetable structure
    days.forEach((day) => {
      processedTimetable[day] = {}
      timeSlots.forEach((timeSlot) => {
        processedTimetable[day][timeSlot] = null
      })
    })

    // Group lab sessions to avoid duplicates
    const labSlotMap = new Map<string, TimeSlot>()

    // Fill in the timetable with actual data
    timetable.forEach((slot) => {
      // Skip lab hours after the first one
      if (slot.isLab && slot.labHour && slot.labHour > 1) {
        return
      }

      // Get the base time slot (for labs, this is the first hour)
      const baseTimeSlot = timeSlots.find((ts) => ts.startsWith(slot.time.split("-")[0]))
      if (!baseTimeSlot || !processedTimetable[slot.day]) {
        return
      }

      // For labs, mark multiple time slots
      if (slot.isLab && slot.totalLabHours) {
        const labHours = Math.min(slot.totalLabHours, 3) // Ensure labs don't exceed 3 hours
        const startIndex = timeSlots.indexOf(baseTimeSlot)

        // Only process if we found a valid start index
        if (startIndex !== -1) {
          // Create a modified slot with the correct time range
          const endIndex = Math.min(startIndex + labHours - 1, timeSlots.length - 1)
          const endTime = timeSlots[endIndex].split("-")[1]
          const startTime = baseTimeSlot.split("-")[0]

          const modifiedSlot = {
            ...slot,
            time: `${startTime}-${endTime}`,
            spanHours: labHours,
          }

          // Add the lab to the first time slot
          processedTimetable[slot.day][baseTimeSlot] = modifiedSlot

          // Mark subsequent slots as occupied by this lab
          for (let i = 1; i < labHours && startIndex + i < timeSlots.length; i++) {
            processedTimetable[slot.day][timeSlots[startIndex + i]] = "occupied"
          }
        }
      } else {
        // Regular class
        processedTimetable[slot.day][baseTimeSlot] = slot
      }
    })

    return processedTimetable
  }, [timetable])

  const handleRequestSwap = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setIsSwapModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-muted">Time / Day</th>
              {days.map((day) => (
                <th key={day} className="border p-2 bg-muted">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot}>
                <td className="border p-2 font-medium">{timeSlot}</td>
                {days.map((day) => {
                  const slot = weeklyTimetable[day][timeSlot]

                  // Skip rendering for slots marked as 'occupied' (part of a multi-hour lab)
                  if (slot === "occupied") {
                    return <td key={`${day}-${timeSlot}`} className="border"></td>
                  }

                  return (
                    <td
                      key={`${day}-${timeSlot}`}
                      className={`border p-2 ${slot?.isLab ? "bg-blue-50" : ""}`}
                      rowSpan={slot?.spanHours || 1}
                    >
                      {slot ? (
                        <div className="space-y-1">
                          <div className="font-medium">{slot.subject}</div>
                          <div className="text-xs text-muted-foreground">{slot.class}</div>
                          {slot.isLab && (
                            <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded inline-block">
                              Lab ({slot.time})
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 mt-1 w-full"
                            onClick={() => handleRequestSwap(slot)}
                          >
                            <CalendarClock className="h-3 w-3" />
                            <span className="text-xs">Swap</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center">-</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
