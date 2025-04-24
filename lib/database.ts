// Simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.

interface TimeSlot {
  day: string
  time: string
  subject: string
  class: string
  isLab?: boolean
  labHour?: number
  totalLabHours?: number
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

  // Define valid time slots to ensure labs don't exceed 4pm
  const validTimeSlots = ["9:00-10:00", "10:00-11:00", "11:10-12:10", "1:00-2:00", "2:00-3:00", "3:00-4:00"]

  // Helper function to process lab subjects with batch information
  function processLabSubjects(subjectText, facultyText) {
    // Check if we have a split lab (Lab1/Lab2 format)
    if (subjectText.includes("/")) {
      const subjects = subjectText.split("/").map((s) => s.trim())
      const faculty = facultyText.split(",").map((f) => f.trim())

      // Determine how many faculty per lab (assuming equal distribution)
      const facultyPerLab = Math.floor(faculty.length / subjects.length)

      const result = []

      for (let i = 0; i < subjects.length; i++) {
        const labSubject = subjects[i]
        // Get faculty for this lab
        const startIdx = i * facultyPerLab
        const endIdx = startIdx + facultyPerLab
        const labFaculty = faculty.slice(startIdx, endIdx).join(", ")

        result.push({
          subject: labSubject,
          faculty: labFaculty,
        })
      }

      return result
    }

    // If not a split lab, return as is
    return [
      {
        subject: subjectText,
        faculty: facultyText,
      },
    ]
  }

  // Process timetable data to assign time slots to faculty
  classData.forEach((cls) => {
    if (cls.timetable) {
      Object.entries(cls.timetable).forEach(([day, slots]) => {
        if (!slots) return

        Object.entries(slots).forEach(([time, details]) => {
          if (!details || !details.subject) return

          // Check if this is a lab session with batch rotation
          if (details.subject.includes("LAB") && details.subject.includes("/")) {
            const labDetails = processLabSubjects(details.subject, details.faculty || "")

            // Process each lab separately
            labDetails.forEach((lab) => {
              const isLab = lab.subject.includes("LAB")

              // Get the faculty names for this lab
              const facultyNames = lab.faculty
                ? lab.faculty
                    .split(",")
                    .map((name) => name.trim())
                    .filter((name) => name)
                : []

              // For each faculty assigned to this lab
              facultyNames.forEach((facultyName) => {
                if (facultyName && uniqueFaculties.has(facultyName)) {
                  const faculty = uniqueFaculties.get(facultyName)

                  // Extract batch information if present
                  let subject = lab.subject
                  let batchInfo = ""

                  if (subject.includes("(B1)") || subject.includes("(B2)")) {
                    const batchMatch = subject.match(/$$(B[12])$$/)
                    if (batchMatch) {
                      batchInfo = batchMatch[1]
                      subject = subject.replace(/$$B[12]$$/, "").trim()
                    }
                  }

                  // For labs, create entries for all hours (up to 3 hours)
                  if (isLab) {
                    // Find the index of the current time slot
                    const timeIndex = validTimeSlots.findIndex((ts) => ts === time)

                    if (timeIndex !== -1) {
                      // Determine how many lab hours we can add (max 3, but don't exceed available slots)
                      const maxLabHours = Math.min(3, validTimeSlots.length - timeIndex)

                      // Create a slot for each hour of the lab
                      for (let hour = 0; hour < maxLabHours; hour++) {
                        if (timeIndex + hour < validTimeSlots.length) {
                          const labTimeSlot = validTimeSlots[timeIndex + hour]

                          faculty.timeSlots.push({
                            day,
                            time: labTimeSlot,
                            subject: subject + (batchInfo ? ` (${batchInfo})` : ""),
                            class: cls.name,
                            isLab: true,
                            labHour: hour + 1,
                            totalLabHours: maxLabHours,
                          })
                        }
                      }
                    }
                  }
                }
              })
            })
          } else {
            // Regular processing for non-split subjects
            // Check if this is a lab session (labs typically have "LAB" in their name)
            const isLab = details.subject.includes("LAB")

            // Get the faculty names for this slot
            const facultyNames = details.faculty
              ? details.faculty
                  .split(",")
                  .map((name) => name.trim())
                  .filter((name) => name)
              : []

            // For each faculty assigned to this slot
            facultyNames.forEach((facultyName) => {
              if (facultyName && uniqueFaculties.has(facultyName)) {
                const faculty = uniqueFaculties.get(facultyName)

                // Extract batch information if present (e.g., "OOPJ LAB(B1)")
                let subject = details.subject
                let batchInfo = ""

                if (subject.includes("(B1)") || subject.includes("(B2)")) {
                  // Extract batch info from subject
                  const batchMatch = subject.match(/$$(B[12])$$/)
                  if (batchMatch) {
                    batchInfo = batchMatch[1]
                    // Clean up subject name
                    subject = subject.replace(/$$B[12]$$/, "").trim()
                  }
                }

                // For labs, create entries for all hours (up to 3 hours)
                if (isLab) {
                  // Find the index of the current time slot
                  const timeIndex = validTimeSlots.findIndex((ts) => ts === time)

                  if (timeIndex !== -1) {
                    // Determine how many lab hours we can add (max 3, but don't exceed available slots)
                    const maxLabHours = Math.min(3, validTimeSlots.length - timeIndex)

                    // Create a slot for each hour of the lab
                    for (let hour = 0; hour < maxLabHours; hour++) {
                      if (timeIndex + hour < validTimeSlots.length) {
                        const labTimeSlot = validTimeSlots[timeIndex + hour]

                        faculty.timeSlots.push({
                          day,
                          time: labTimeSlot,
                          subject: subject + (batchInfo ? ` (${batchInfo})` : ""),
                          class: cls.name,
                          isLab: true,
                          labHour: hour + 1,
                          totalLabHours: maxLabHours,
                        })
                      }
                    }
                  }
                } else {
                  // Regular class (not a lab)
                  faculty.timeSlots.push({
                    day,
                    time,
                    subject: details.subject,
                    class: cls.name,
                    isLab: false,
                  })
                }
              }
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
