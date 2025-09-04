"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut, User, X, Loader2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ProfileEditDialog } from "./profile-edit-dialog"
import { getProjects, deleteProject } from "@/app/actions"
import type { IProject } from "@/models/Project"
import { toast } from "@/hooks/use-toast"
import { getInitials } from "@/lib/utils"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userProjects, setUserProjects] = useState<IProject[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("profile-sidebar")
      const trigger = document.getElementById("profile-trigger")

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        trigger &&
        !trigger.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden" // Prevent background scroll
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Fetch projects when sidebar opens or user status changes
  useEffect(() => {
    if (isOpen && isSignedIn && user?.id) {
      const fetchUserProjects = async () => {
        setProjectsLoading(true)
        const projects = await getProjects(user.id)
        setUserProjects(projects)
        setProjectsLoading(false)
      }
      fetchUserProjects()
    } else if (!isSignedIn) {
      setUserProjects([]) // Clear projects if user logs out
    }
  }, [isOpen, isSignedIn, user?.id])

  // Don't render if user is not signed in or Clerk is not loaded
  if (!isLoaded || !isSignedIn || !user) {
    return null
  }

  const handleSignOut = () => {
    signOut()
    onClose()
  }

  const handleProfileClick = () => {
    setIsEditDialogOpen(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not identified. Cannot delete project.",
        variant: "destructive",
      })
      return
    }

    const result = await deleteProject(projectId, user.id)
    if (result.success) {
      toast({
        title: "Project Deleted",
        description: result.message,
      })
      // Optimistically update UI or re-fetch projects
      setUserProjects((prevProjects) => prevProjects.filter((p) => p._id !== projectId))
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-60 transition-opacity duration-300" />}

      {/* Sidebar */}
      <div
        id="profile-sidebar"
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-70 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Projects Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 mb-0">Recent Projects</h3>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
            <ScrollArea className="flex-1 px-4">
              {projectsLoading ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading projects...
                </div>
              ) : userProjects.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                  No projects found. Generate your first model!
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {userProjects.map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate flex-1 pr-2">{project.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent opening profile edit dialog
                          handleDeleteProject(project._id)
                        }}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete project</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Profile Section - Now clickable, moved to bottom */}
          <div className="p-4 border-t cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleProfileClick}>
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {user?.fullName ? getInitials(user.fullName) : <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || "User"}</p>
                <p className="text-sm text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="p-4 border-t mt-auto">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </>
  )
}
