"use client"

import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileSidebar } from "./profile-sidebar"

export function ProfileDropdown() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show a placeholder if not mounted or if Clerk hasn't loaded user data yet
  if (!mounted || !isLoaded) {
    return (
      <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 backdrop-blur-sm animate-pulse">
        <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gray-200 m-0.5"></div>
      </div>
    )
  }

  // Once mounted and loaded, check if signed in
  if (!isSignedIn) {
    return (
      <Button
        variant="ghost"
        onClick={() => router.push("/signin")}
        className="p-0 h-auto text-gray-700 text-sm sm:text-base font-medium hover:bg-transparent"
      >
        Log in
      </Button>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Button
        id="profile-trigger"
        variant="ghost"
        onClick={() => setSidebarOpen(true)}
        className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
          <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
            {user?.fullName ? getInitials(user.fullName) : <User className="h-3 w-3 sm:h-4 sm:w-4" />}
          </AvatarFallback>
        </Avatar>
      </Button>

      <ProfileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
