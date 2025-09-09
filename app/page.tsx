"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { ExportToolbar } from "@/components/export-toolbar"
import { CustomizationSidebar } from "@/components/customization-sidebar"
import { useRouter } from "next/navigation"
import { saveProject } from "@/app/actions"
import { toast } from "@/hooks/use-toast"

// 3D Model Component with dynamic shape and color
function SampleModel({ shape = "cube", color = "#E5E5E5", roughness = 0.5, metalness = 0.5 }: { shape?: string; color?: string; roughness?: number; metalness?: number }) {
  const getGeometry = () => {
    switch (shape.toLowerCase()) {
      case "sphere":
        return <sphereGeometry args={[1, 32, 32]} />
      case "cylinder":
        return <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
      case "cone":
        return <coneGeometry args={[1, 2, 32]} />
      case "torus":
        return <torusGeometry args={[1, 0.4, 16, 32]} />
      case "octahedron":
        return <octahedronGeometry args={[1.5]} />
      case "tetrahedron":
        return <tetrahedronGeometry args={[1.5]} />
      case "dodecahedron":
        return <dodecahedronGeometry args={[1]} />
      case "icosahedron":
        return <icosahedronGeometry args={[1]} />
      case "plane":
        return <planeGeometry args={[2, 2]} />
      case "ring":
        return <ringGeometry args={[0.5, 1, 32]} />
      case "box":
      case "cube":
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />
    }
  }

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
      {getGeometry()}
      <meshStandardMaterial 
        color={color} 
        roughness={roughness}
        metalness={metalness}
        envMapIntensity={1}
      />
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
function Scene({ zoomLevel, rotation, shape, color, backgroundColor, roughness, metalness }: { 
  zoomLevel: number; 
  rotation: { x: number; y: number }; 
  shape: string; 
  color: string;
  backgroundColor: string;
  roughness: number;
  metalness: number;
}) {
  const zoomScale = zoomLevel / 100
  
  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group scale={[zoomScale, zoomScale, zoomScale]} rotation={[rotation.x, rotation.y, 0]}>
        <SampleModel shape={shape} color={color} roughness={roughness} metalness={metalness} />
      </group>
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        enableRotate={true} 
        minDistance={4} 
        maxDistance={12}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <Environment preset="studio" />
    </>
  )
}

export default function ModelGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [currentShape, setCurrentShape] = useState("cube")
  const [currentColor, setCurrentColor] = useState("#E5E5E5")
  const [backgroundColor, setBackgroundColor] = useState("#F8F7F7")
  const [roughness, setRoughness] = useState(0.5)
  const [metalness, setMetalness] = useState(0.5)
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
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
    
    // Process the prompt to determine shape
    const shapeName = prompt.toLowerCase().trim()
    
    // Map common shape names to our supported shapes
    const shapeMap: { [key: string]: string } = {
      'cube': 'cube',
      'box': 'cube',
      'square': 'cube',
      'sphere': 'sphere',
      'ball': 'sphere',
      'circle': 'sphere',
      'cylinder': 'cylinder',
      'tube': 'cylinder',
      'cone': 'cone',
      'pyramid': 'cone',
      'torus': 'torus',
      'donut': 'torus',
      'ring': 'torus',
      'octahedron': 'octahedron',
      'octa': 'octahedron',
      'tetrahedron': 'tetrahedron',
      'tetra': 'tetrahedron',
      'dodecahedron': 'dodecahedron',
      'dodeca': 'dodecahedron',
      'icosahedron': 'icosahedron',
      'icosa': 'icosahedron',
      'plane': 'plane',
      'flat': 'plane'
    }

    // Find matching shape or default to cube
    const matchedShape = Object.keys(shapeMap).find(key => 
      shapeName.includes(key)
    ) || 'cube'
    
    const newShape = shapeMap[matchedShape]
    setCurrentShape(newShape)
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save the project to MongoDB for logged-in users
    if (user?.id) {
      const result = await saveProject({
        userId: user.id,
        name: prompt.substring(0, 50), // Use first 50 chars of prompt as name
        prompt: prompt,
        modelUrl: "/placeholder.svg?height=200&width=200", // Placeholder for now
      })

      if (result.success) {
        toast({
          title: "3D Shape Generated!",
          description: `Generated a ${newShape} shape. You can now customize its color using the sidebar.`,
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


  const handleExport = () => {
    try {
      // Create a comprehensive OBJ file with material information
      const shapeName = currentShape
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `${shapeName}_${timestamp}.obj`
      
      // Generate OBJ content with material info
      let objContent = `# 3D Model Export - ${shapeName}\n`
      objContent += `# Generated by 0bj\n`
      objContent += `# Color: ${currentColor}\n`
      objContent += `# Roughness: ${roughness}\n`
      objContent += `# Metalness: ${metalness}\n\n`
      
      // Generate geometry based on shape
      if (shapeName === 'cube') {
        objContent += `v -0.75 -0.75 -0.75\n`
        objContent += `v 0.75 -0.75 -0.75\n`
        objContent += `v 0.75 0.75 -0.75\n`
        objContent += `v -0.75 0.75 -0.75\n`
        objContent += `v -0.75 -0.75 0.75\n`
        objContent += `v 0.75 -0.75 0.75\n`
        objContent += `v 0.75 0.75 0.75\n`
        objContent += `v -0.75 0.75 0.75\n`
        objContent += `f 1 2 3 4\n`
        objContent += `f 5 8 7 6\n`
        objContent += `f 1 5 6 2\n`
        objContent += `f 2 6 7 3\n`
        objContent += `f 3 7 8 4\n`
        objContent += `f 5 1 4 8\n`
      } else if (shapeName === 'sphere') {
        // Higher resolution sphere
        const segments = 16
        const rings = 8
        const radius = 1
        
        // Generate vertices
        for (let ring = 0; ring <= rings; ring++) {
          const phi = (ring * Math.PI) / rings
          for (let segment = 0; segment <= segments; segment++) {
            const theta = (segment * 2 * Math.PI) / segments
            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = radius * Math.cos(phi)
            const z = radius * Math.sin(phi) * Math.sin(theta)
            objContent += `v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}\n`
          }
        }
        
        // Generate faces
        for (let ring = 0; ring < rings; ring++) {
          for (let segment = 0; segment < segments; segment++) {
            const a = ring * (segments + 1) + segment + 1
            const b = ring * (segments + 1) + segment + 2
            const c = (ring + 1) * (segments + 1) + segment + 2
            const d = (ring + 1) * (segments + 1) + segment + 1
            objContent += `f ${a} ${b} ${c} ${d}\n`
          }
        }
      } else if (shapeName === 'cylinder') {
        const radius = 0.8
        const height = 2
        const segments = 16
        
        // Top center
        objContent += `v 0 ${height/2} 0\n`
        // Top ring
        for (let i = 0; i < segments; i++) {
          const angle = (i * 2 * Math.PI) / segments
          const x = radius * Math.cos(angle)
          const z = radius * Math.sin(angle)
          objContent += `v ${x.toFixed(6)} ${height/2} ${z.toFixed(6)}\n`
        }
        // Bottom ring
        for (let i = 0; i < segments; i++) {
          const angle = (i * 2 * Math.PI) / segments
          const x = radius * Math.cos(angle)
          const z = radius * Math.sin(angle)
          objContent += `v ${x.toFixed(6)} ${-height/2} ${z.toFixed(6)}\n`
        }
        // Bottom center
        objContent += `v 0 ${-height/2} 0\n`
        
        // Top faces
        for (let i = 1; i <= segments; i++) {
          const next = i === segments ? 1 : i + 1
          objContent += `f 1 ${i + 1} ${next + 1}\n`
        }
        // Side faces
        for (let i = 1; i <= segments; i++) {
          const next = i === segments ? 1 : i + 1
          const bottom1 = i + segments
          const bottom2 = next + segments
          objContent += `f ${i + 1} ${next + 1} ${bottom2} ${bottom1}\n`
        }
        // Bottom faces
        for (let i = 1; i <= segments; i++) {
          const next = i === segments ? 1 : i + 1
          const bottom1 = i + segments
          const bottom2 = next + segments
          objContent += `f ${bottom1} ${bottom2} ${segments * 2 + 2}\n`
        }
      } else if (shapeName === 'cone') {
        const radius = 1
        const height = 2
        const segments = 16
        
        // Apex
        objContent += `v 0 ${height/2} 0\n`
        // Base ring
        for (let i = 0; i < segments; i++) {
          const angle = (i * 2 * Math.PI) / segments
          const x = radius * Math.cos(angle)
          const z = radius * Math.sin(angle)
          objContent += `v ${x.toFixed(6)} ${-height/2} ${z.toFixed(6)}\n`
        }
        // Base center
        objContent += `v 0 ${-height/2} 0\n`
        
        // Side faces
        for (let i = 1; i <= segments; i++) {
          const next = i === segments ? 1 : i + 1
          objContent += `f 1 ${i + 1} ${next + 1}\n`
        }
        // Base faces
        for (let i = 1; i <= segments; i++) {
          const next = i === segments ? 1 : i + 1
          objContent += `f ${i + 1} ${next + 1} ${segments + 2}\n`
        }
      } else {
        // Default cube for other shapes
        objContent += `v -0.75 -0.75 -0.75\n`
        objContent += `v 0.75 -0.75 -0.75\n`
        objContent += `v 0.75 0.75 -0.75\n`
        objContent += `v -0.75 0.75 -0.75\n`
        objContent += `v -0.75 -0.75 0.75\n`
        objContent += `v 0.75 -0.75 0.75\n`
        objContent += `v 0.75 0.75 0.75\n`
        objContent += `v -0.75 0.75 0.75\n`
        objContent += `f 1 2 3 4\n`
        objContent += `f 5 8 7 6\n`
        objContent += `f 1 5 6 2\n`
        objContent += `f 2 6 7 3\n`
        objContent += `f 3 7 8 4\n`
        objContent += `f 5 1 4 8\n`
      }
      
      // Add material information
      objContent += `\n# Material information\n`
      objContent += `# Use this color: ${currentColor}\n`
      objContent += `# Roughness: ${roughness}\n`
      objContent += `# Metalness: ${metalness}\n`
      
      // Create and download the file
      const blob = new Blob([objContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Export Successful!",
        description: `${filename} has been downloaded with color ${currentColor}.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your 3D model. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom)
  }

  const handleRotate = (axis: 'x' | 'y', direction: 'left' | 'right' | 'up' | 'down') => {
    const rotationStep = Math.PI / 8 // 22.5 degrees per click
    
    setRotation(prev => {
      const newRotation = { ...prev }
      
      if (axis === 'x') {
        if (direction === 'up') {
          newRotation.x += rotationStep
        } else if (direction === 'down') {
          newRotation.x -= rotationStep
        }
      } else if (axis === 'y') {
        if (direction === 'left') {
          newRotation.y += rotationStep
        } else if (direction === 'right') {
          newRotation.y -= rotationStep
        }
      }
      
      return newRotation
    })
  }

  // Get welcome message text
  const getWelcomeMessage = () => {
    if (!user) return ""

    const name = user.firstName || user.fullName
    return name ? `Welcome, ${name}!` : "Welcome!"
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Export Toolbar - Show for all signed-in users on desktop */}
      {mounted && isSignedIn && (
        <div className="hidden md:block">
          <ExportToolbar onExport={handleExport} onZoomChange={handleZoomChange} onRotate={handleRotate} />
        </div>
      )}


      {/* Profile Icon - Upper Right Corner - Fixed positioning */}
      <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-30">
        <ProfileDropdown />
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} className="w-full h-full">
        <Suspense fallback={<SceneLoader />}>
          <Scene 
            zoomLevel={zoomLevel} 
            rotation={rotation} 
            shape={currentShape} 
            color={currentColor}
            backgroundColor={backgroundColor}
            roughness={roughness}
            metalness={metalness}
          />
        </Suspense>
      </Canvas>

      {/* Floating Input Interface - Better positioning */}
      <div className="fixed bottom-6 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-2xl sm:max-w-none">
          {/* Input Field */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 flex-1 sm:min-w-[400px] lg:min-w-[500px]">
            <Input
              type="text"
              placeholder="Enter a shape name (e.g., sphere, cube, cylinder)..."
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

      {/* Customization Sidebar - Show for all signed-in users on desktop */}
      {mounted && isSignedIn && (
        <div className="hidden md:block">
          <CustomizationSidebar 
            currentColor={currentColor} 
            onColorChange={setCurrentColor}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
            roughness={roughness}
            onRoughnessChange={setRoughness}
            metalness={metalness}
            onMetalnessChange={setMetalness}
          />
        </div>
      )}
    </div>
  )
}
