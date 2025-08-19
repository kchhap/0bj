"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Plus, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getInitials } from "@/lib/utils"

interface ProfileEditDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileEditDialog({ isOpen, onClose }: ProfileEditDialogProps): ReactElement {
  const { user, isLoaded } = useUser()
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null) // State to hold the new image file
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(user?.imageUrl || "/placeholder.svg") // State for image preview
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setPreviewAvatarUrl(user.imageUrl || "/placeholder.svg")
      setNewAvatarFile(null) // Reset file when dialog opens
    }
  }, [isLoaded, user, isOpen]) // Reset state when dialog opens or user data changes

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        // 1MB limit
        toast({
          title: "File too large",
          description: "Max file size is 1MB.",
          variant: "destructive",
        })
        setNewAvatarFile(null)
        setPreviewAvatarUrl(user?.imageUrl || "/placeholder.svg") // Revert preview
        return
      }
      setNewAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewAvatarUrl(reader.result as string) // Set preview URL
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!isLoaded || !user) return

    setLoading(true)
    try {
      // Update first name and last name
      await user.update({
        firstName,
        lastName,
      })

      // Update profile image if a new one was selected
      if (newAvatarFile) {
        await user.setProfileImage({ file: newAvatarFile })
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      })
      onClose()
    } catch (error: any) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error updating profile",
        description: error.errors?.[0]?.longMessage || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px] p-3 sm:p-6 rounded-xl">
        {" "}
        {/* Added rounded-xl */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-2 sm:border-r sm:pr-6 pb-3 sm:pb-0 border-b sm:border-b-0">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewAvatarUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-3xl">
                  {user?.fullName ? getInitials(user.fullName) : <User className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            <p className="text-sm font-medium text-gray-700">Upload Image</p>
            <p className="text-xs text-gray-500">Max file size: 1MB</p>
            <Button variant="outline" size="sm" onClick={handleImageClick} disabled={loading}>
              Add Image
            </Button>
          </div>
          {/* Form Fields Section */}
          <div className="flex flex-col space-y-3 sm:pl-6 pt-3 sm:pt-0">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
