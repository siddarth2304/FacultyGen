import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/faculty/dashboard" className="font-bold">
              Faculty Timetable System
            </Link>
            <span className="rounded-md bg-green-600 px-1.5 py-0.5 text-[0.625rem] font-medium text-white">
              FACULTY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="container flex-1 py-6">{children}</div>
    </div>
  )
}
