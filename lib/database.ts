// Simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.

interface TimeSlot {
  day: string
  time: string
  subject: string
  class: string
}

export interface Faculty {
  id: string
  name: string
  email: string
  password: string
  subjects: string[]
  timeSlots: TimeSlot[]
}

export interface Class {
  name: string
  timetable: {
    [day: string]: {
      [time: string]: {
        subject: string
        faculty: string
      }
    }
  }
}

// Global state (in-memory database)
let faculties: Faculty[] = []
let classes: Class[] = []
let isDataUploaded = false

// Admin credentials
const adminCredentials = {
  username: "admin",
  password: "admin123",
}

// Helper functions
export function validateAdminLogin(username: string, password: string): boolean {
  return username === adminCredentials.username && password === adminCredentials.password
}

export function validateFacultyLogin(email: string, password: string): Faculty | null {
  const faculty = faculties.find((f) => f.email === email && f.password === password)
  return faculty || null
}

export function getFacultyByEmail(email: string): Faculty | null {
  return faculties.find((f) => f.email === email) || null
}

export function getFacultyById(id: string): Faculty | null {
  return faculties.find((f) => f.id === id) || null
}

export function getAllFaculties(): Faculty[] {
  return [...faculties]
}

export function getAllClasses(): Class[] {
  return [...classes]
}

export function getFacultyTimetable(facultyId: string): TimeSlot[] {
  const faculty = faculties.find((f) => f.id === facultyId)
  return faculty ? [...faculty.timeSlots] : []
}

export function isDataLoaded(): boolean {
  return isDataUploaded
}

// Function to parse the uploaded document data
export function processUploadedData(data: any): void {
  // Reset data
  faculties = []
  classes = []

  // Check if data exists
  if (!data) {
    console.error("Invalid data format: data is null or undefined")
    return
  }

  // Check if classes array exists
  if (!data.classes || !Array.isArray(data.classes)) {
    console.error("Invalid data format: missing classes array", data)
    return
  }

  // Process the data from the document
  const classData = data.classes

  console.log(`Processing ${classData.length} classes`)

  // Process class data
  classes = classData.map((cls) => ({
    name: cls.name,
    timetable: cls.timetable || {},
  }))

  // Extract unique faculty members and create accounts
  const uniqueFaculties = new Map()

  classData.forEach((cls) => {
    if (!cls.facultyAssignments || !Array.isArray(cls.facultyAssignments)) {
      console.warn(`Class ${cls.name} has no faculty assignments`)
      return
    }

    cls.facultyAssignments.forEach((assignment) => {
      if (!assignment.faculty) return

      const facultyNames = assignment.faculty
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name)

      facultyNames.forEach((name) => {
        if (name && !uniqueFaculties.has(name)) {
          // Create email from name (simplified)
          const email = name.toLowerCase().replace(/[^a-z0-9]/g, ".") + "@faculty.edu"

          // Default password is the last part of their name
          const nameParts = name.split(" ")
          const password = nameParts[nameParts.length - 1].toLowerCase()

          uniqueFaculties.set(name, {
            id: `faculty-${uniqueFaculties.size + 1}`,
            name,
            email,
            password,
            subjects: [assignment.subject],
            timeSlots: [],
          })
        } else if (name && uniqueFaculties.has(name)) {
          // Add subject if not already in the list
          const faculty = uniqueFaculties.get(name)
          if (!faculty.subjects.includes(assignment.subject)) {
            faculty.subjects.push(assignment.subject)
          }
        }
      })
    })
  })

  // Process timetable data to assign time slots to faculty
  classData.forEach((cls) => {
    if (cls.timetable) {
      Object.entries(cls.timetable).forEach(([day, slots]) => {
        if (!slots) return

        Object.entries(slots).forEach(([time, details]) => {
          if (!details) return

          const facultyName = details.faculty
          if (facultyName && uniqueFaculties.has(facultyName)) {
            const faculty = uniqueFaculties.get(facultyName)
            faculty.timeSlots.push({
              day,
              time,
              subject: details.subject,
              class: cls.name,
            })
          }
        })
      })
    }
  })

  // Convert Map to array
  faculties = Array.from(uniqueFaculties.values())

  // Mark data as uploaded
  isDataUploaded = true

  console.log(`Processed ${faculties.length} faculty members and ${classes.length} classes`)
}

// For demonstration, let's add some sample data
export function loadSampleData(): void {
  // Sample data based on the document provided
  const sampleData = {
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
        },
      },
    ],
  }

  processUploadedData(sampleData)
}

// Swap request system
interface SwapRequest {
  id: string
  requestingFacultyId: string
  requestedFacultyId: string
  timeSlot: TimeSlot
  proposedTimeSlot: TimeSlot | null
  reason: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
}

const swapRequests: SwapRequest[] = []

export function createSwapRequest(
  requestingFacultyId: string,
  requestedFacultyId: string,
  timeSlot: TimeSlot,
  proposedTimeSlot: TimeSlot | null,
  reason: string,
): SwapRequest {
  const newRequest: SwapRequest = {
    id: `swap-${Date.now()}`,
    requestingFacultyId,
    requestedFacultyId,
    timeSlot,
    proposedTimeSlot,
    reason,
    status: "pending",
    createdAt: new Date(),
  }

  swapRequests.push(newRequest)
  return newRequest
}

export function getSwapRequestsForFaculty(facultyId: string): SwapRequest[] {
  return swapRequests.filter((req) => req.requestingFacultyId === facultyId || req.requestedFacultyId === facultyId)
}

export function updateSwapRequestStatus(requestId: string, status: "accepted" | "rejected"): SwapRequest | null {
  const requestIndex = swapRequests.findIndex((req) => req.id === requestId)

  if (requestIndex === -1) return null

  swapRequests[requestIndex].status = status

  // If accepted, update the faculty timetables
  if (status === "accepted") {
    const request = swapRequests[requestIndex]
    const requestingFaculty = faculties.find((f) => f.id === request.requestingFacultyId)
    const requestedFaculty = faculties.find((f) => f.id === request.requestedFacultyId)

    if (requestingFaculty && requestedFaculty) {
      // Find the time slots to swap
      const requestingSlotIndex = requestingFaculty.timeSlots.findIndex(
        (slot) =>
          slot.day === request.timeSlot.day &&
          slot.time === request.timeSlot.time &&
          slot.subject === request.timeSlot.subject,
      )

      if (requestingSlotIndex !== -1) {
        // If there's a proposed slot, swap them
        if (request.proposedTimeSlot) {
          const requestedSlotIndex = requestedFaculty.timeSlots.findIndex(
            (slot) =>
              slot.day === request.proposedTimeSlot?.day &&
              slot.time === request.proposedTimeSlot?.time &&
              slot.subject === request.proposedTimeSlot?.subject,
          )

          if (requestedSlotIndex !== -1) {
            // Swap the slots
            const temp = { ...requestingFaculty.timeSlots[requestingSlotIndex] }
            requestingFaculty.timeSlots[requestingSlotIndex] = { ...requestedFaculty.timeSlots[requestedSlotIndex] }
            requestedFaculty.timeSlots[requestedSlotIndex] = temp
          }
        } else {
          // Just assign the requesting faculty's slot to the requested faculty
          requestedFaculty.timeSlots.push({ ...requestingFaculty.timeSlots[requestingSlotIndex] })
          requestingFaculty.timeSlots.splice(requestingSlotIndex, 1)
        }
      }
    }
  }

  return swapRequests[requestIndex]
}

// Initialize with sample data for development
loadSampleData()
