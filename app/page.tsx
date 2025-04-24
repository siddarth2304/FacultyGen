import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary px-4 py-3 flex items-center">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Faculty Timetable Portal</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">Faculty Timetable Management System</h1>
          <p className="text-xl text-muted-foreground">
            A centralized platform for managing and accessing faculty timetables
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>For Administrators</CardTitle>
                <CardDescription>Upload and manage faculty timetables</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Upload timetables for all faculty members, manage schedules, and ensure everyone has access to their
                  latest schedule.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/login?role=admin" className="w-full">
                  <Button className="w-full">Admin Login</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Faculty</CardTitle>
                <CardDescription>View your personal timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access your personalized timetable, view your teaching schedule, and stay updated with any changes.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/login?role=faculty" className="w-full">
                  <Button className="w-full">Faculty Login</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Faculty Timetable Portal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
