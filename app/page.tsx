"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Crown } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useRouter } from "next/navigation"
import { saveProject } from "@/app/actions" // Import the server action
import { toast } from "@/hooks/use-toast" // Import toast for notifications

// Sample 3D Model Component (reduced size)
function SampleModel() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#ff6b35" />
    </mesh>
  )
}

// Loading component for 3D scene
function SceneLoader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    </Html>
  )
}

// 3D Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <SampleModel />
      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} minDistance={4} maxDistance={12} />
      <Environment preset="studio" />
    </>
  )
}

export default function ModelGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle welcome message display and auto-hide
  useEffect(() => {
    if (mounted && isSignedIn && user) {
      // Show welcome message when user signs in
      setShowWelcome(true)
      setIsWelcomeVisible(true)

      // Hide welcome message after 4 seconds with fade out
      const timer = setTimeout(() => {
        setIsWelcomeVisible(false)
        // Remove from DOM after fade animation completes
        setTimeout(() => {
          setShowWelcome(false)
        }, 300) // Match the transition duration
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [mounted, isSignedIn, user])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Check if user is authenticated, if not, redirect to custom sign-in page
    if (!isSignedIn) {
      router.push("/signin")
      return
    }

    setIsGenerating(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save the project to MongoDB for logged-in users
    if (user?.id) {
      const result = await saveProject({
        userId: user.id,
        name: prompt.substring(0, 50), // Use first 50 chars of prompt as name
        prompt: prompt,
        modelUrl: "/placeholder.svg?height=200&width=200", // Placeholder for now
      })

      if (result.success) {
        // Show "Coming soon" message instead of success message
        toast({
          title: "Coming Soon!",
          description: "3D model generation feature is currently under development. Your prompt has been saved!",
        })
        setPrompt("") // Clear prompt after successful save
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Error",
        description: "User not identified. Cannot save project.",
        variant: "destructive",
      })
    }

    setIsGenerating(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isGenerating) {
      handleGenerate()
    }
  }

  const handleUpgradeClick = () => {
    router.push("/pricing")
  }

  // Get welcome message text
  const getWelcomeMessage = () => {
    if (!user) return ""

    const name = user.firstName || user.fullName
    return name ? `Welcome, ${name}!` : "Welcome!"
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Upgrade Button - Top Center */}
      {mounted && isSignedIn && (
        <div className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-30">
          <Button
            onClick={handleUpgradeClick}
            variant="outline"
            className="bg-grey px-10 rounded-xl text-sm font-small"
          >
            <Crown className="w-4 h-4 mr-2 text-yellow-500" />
            Upgrade
          </Button>
        </div>
      )}

      {/* Profile Icon - Upper Right Corner - Fixed positioning */}
      <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-30">
        <ProfileDropdown />
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} className="w-full h-full">
        <Suspense fallback={<SceneLoader />}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Floating Input Interface - Better positioning */}
      <div className="fixed bottom-6 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-2xl sm:max-w-none">
          {/* Input Field */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 flex-1 sm:min-w-[400px] lg:min-w-[500px]">
            <Input
              type="text"
              placeholder="Describe your 3D model..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border-0 bg-transparent text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base sm:text-lg p-0 h-auto"
              disabled={isGenerating}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 text-base h-auto whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
                <span className="sm:hidden">Loading...</span>
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>

      {/* Welcome message with auto-hide and fade animation */}
      {mounted && showWelcome && isSignedIn && user && (
        <div
          className={`fixed top-16 sm:top-20 right-4 sm:right-6 z-20 transition-opacity duration-300 ease-in-out ${
            isWelcomeVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-gray-700 text-sm shadow-md">
            {getWelcomeMessage()}
          </div>
        </div>
      )}
    </div>
  )
}
