"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ChevronDown } from "lucide-react"

interface CustomizationSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function CustomizationSidebar({ isOpen = true, onClose }: CustomizationSidebarProps) {
  const [backgroundColor, setBackgroundColor] = useState("#F8F7F7")
  const [backgroundOpacity, setBackgroundOpacity] = useState([100])
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [selectedStyle, setSelectedStyle] = useState(0)
  const [cameraMode, setCameraMode] = useState("Isometric")
  const [distortionValue, setDistortionValue] = useState([8])
  const [expandedSections, setExpandedSections] = useState({
    materials: true,
    styles: true,
    background: true,
    camera: true,
    distortion: true
  })

  const materials = [
    { id: 0, color: "#E5E5E5", name: "Silver", preview: "sphere" },
    { id: 1, color: "#CD7F32", name: "Bronze", preview: "sphere" },
    { id: 2, color: "#2C2C2C", name: "Black", preview: "sphere" },
    { id: 3, color: "#1A1A1A", name: "Dark", preview: "sphere" },
  ]

  const styles = [
    { id: 0, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", name: "Ocean" },
    { id: 1, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", name: "Sunset" },
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <>
      {/* Backdrop - only show if onClose is provided */}
      {onClose && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-45 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        <div className="p-6">
          <div className="space-y-6">
              {/* Materials Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800">Materials</h3>
                  <button 
                    onClick={() => toggleSection('materials')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.materials ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.materials && (
                  <div className="grid grid-cols-2 gap-3">
                    {materials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterial(material.id)}
                        className={`p-3 rounded-lg border-2 transition-all bg-white ${
                          selectedMaterial === material.id
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-full h-16 rounded-lg mb-2 flex items-center justify-center">
                          <div 
                            className="w-12 h-12 rounded-full shadow-lg"
                            style={{ backgroundColor: material.color }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{material.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Styles Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800">Styles</h3>
                  <button 
                    onClick={() => toggleSection('styles')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.styles ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.styles && (
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-lg border-2 transition-all bg-white ${
                          selectedStyle === style.id
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div 
                          className="w-full h-16 rounded-lg mb-2"
                          style={{ background: style.gradient }}
                        />
                        <span className="text-xs text-gray-600">{style.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Background Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800">Background</h3>
                  <button 
                    onClick={() => toggleSection('background')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.background ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.background && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: backgroundColor }}
                      />
                      <span className="text-sm text-gray-800 font-mono">{backgroundColor.toUpperCase()}</span>
                      <span className="text-sm text-gray-800 ml-auto">{backgroundOpacity[0]}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800">Camera</h3>
                  <button 
                    onClick={() => toggleSection('camera')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.camera ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.camera && (
                  <div className="bg-white rounded-lg p-1 border border-gray-200 flex">
                    <Button
                      variant={cameraMode === "Isometric" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCameraMode("Isometric")}
                      className={`flex-1 rounded-md ${
                        cameraMode === "Isometric" 
                          ? "bg-gray-800 text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Isometric
                    </Button>
                    <Button
                      variant={cameraMode === "Perspective" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCameraMode("Perspective")}
                      className={`flex-1 rounded-md ${
                        cameraMode === "Perspective" 
                          ? "bg-gray-800 text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Perspective
                    </Button>
                  </div>
                )}
              </div>

              {/* Distortion Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800">Distortion</h3>
                  <button 
                    onClick={() => toggleSection('distortion')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.distortion ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.distortion && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Slider
                          value={distortionValue}
                          onValueChange={setDistortionValue}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <Input
                        type="text"
                        value={`${distortionValue[0]}s`}
                        onChange={(e) => {
                          const value = parseInt(e.target.value.replace('s', '')) || 0
                          setDistortionValue([Math.min(Math.max(value, 0), 20)])
                        }}
                        className="w-12 h-8 text-center text-sm border-0 bg-transparent p-0"
                      />
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
