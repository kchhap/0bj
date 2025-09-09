"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ChevronDown } from "lucide-react"

interface CustomizationSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  currentColor?: string
  onColorChange?: (color: string) => void
  backgroundColor?: string
  onBackgroundColorChange?: (color: string) => void
  roughness?: number
  onRoughnessChange?: (roughness: number) => void
  metalness?: number
  onMetalnessChange?: (metalness: number) => void
}

export function CustomizationSidebar({ 
  isOpen = true, 
  onClose, 
  currentColor = "#E5E5E5", 
  onColorChange,
  backgroundColor = "#F8F7F7",
  onBackgroundColorChange,
  roughness = 0.5,
  onRoughnessChange,
  metalness = 0.5,
  onMetalnessChange
}: CustomizationSidebarProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Update selected material when currentColor changes
  useEffect(() => {
    const materialIndex = allMaterials.findIndex(material => material.color === currentColor)
    if (materialIndex !== -1) {
      setSelectedMaterial(materialIndex)
    }
  }, [currentColor])
  
  const [expandedSections, setExpandedSections] = useState({
    materials: true,
    background: true,
    material: true
  })

  const allMaterials = [
    // Metals
    { id: 0, color: "#E5E5E5", name: "Silver", category: "metals", preview: "sphere" },
    { id: 1, color: "#CD7F32", name: "Bronze", category: "metals", preview: "sphere" },
    { id: 2, color: "#FFD700", name: "Gold", category: "metals", preview: "sphere" },
    { id: 3, color: "#C0C0C0", name: "Chrome", category: "metals", preview: "sphere" },
    { id: 4, color: "#B87333", name: "Copper", category: "metals", preview: "sphere" },
    { id: 5, color: "#708090", name: "Steel", category: "metals", preview: "sphere" },
    { id: 6, color: "#2C2C2C", name: "Iron", category: "metals", preview: "sphere" },
    { id: 7, color: "#1A1A1A", name: "Dark Metal", category: "metals", preview: "sphere" },
    
    // Colors
    { id: 8, color: "#FF6B35", name: "Orange", category: "colors", preview: "sphere" },
    { id: 9, color: "#4ECDC4", name: "Teal", category: "colors", preview: "sphere" },
    { id: 10, color: "#FF1744", name: "Red", category: "colors", preview: "sphere" },
    { id: 11, color: "#00E676", name: "Green", category: "colors", preview: "sphere" },
    { id: 12, color: "#2196F3", name: "Blue", category: "colors", preview: "sphere" },
    { id: 13, color: "#9C27B0", name: "Purple", category: "colors", preview: "sphere" },
    { id: 14, color: "#FFEB3B", name: "Yellow", category: "colors", preview: "sphere" },
    { id: 15, color: "#FF9800", name: "Amber", category: "colors", preview: "sphere" },
    
    // Natural
    { id: 16, color: "#8B4513", name: "Wood", category: "natural", preview: "sphere" },
    { id: 17, color: "#D2691E", name: "Oak", category: "natural", preview: "sphere" },
    { id: 18, color: "#A0522D", name: "Mahogany", category: "natural", preview: "sphere" },
    { id: 19, color: "#F5DEB3", name: "Sand", category: "natural", preview: "sphere" },
    { id: 20, color: "#228B22", name: "Forest", category: "natural", preview: "sphere" },
    { id: 21, color: "#87CEEB", name: "Sky", category: "natural", preview: "sphere" },
    { id: 22, color: "#DDA0DD", name: "Lavender", category: "natural", preview: "sphere" },
    { id: 23, color: "#F0E68C", name: "Khaki", category: "natural", preview: "sphere" },
    
    // Gemstones
    { id: 24, color: "#FF1493", name: "Ruby", category: "gemstones", preview: "sphere" },
    { id: 25, color: "#00BFFF", name: "Sapphire", category: "gemstones", preview: "sphere" },
    { id: 26, color: "#32CD32", name: "Emerald", category: "gemstones", preview: "sphere" },
    { id: 27, color: "#FFD700", name: "Topaz", category: "gemstones", preview: "sphere" },
    { id: 28, color: "#9370DB", name: "Amethyst", category: "gemstones", preview: "sphere" },
    { id: 29, color: "#FF6347", name: "Coral", category: "gemstones", preview: "sphere" },
    { id: 30, color: "#20B2AA", name: "Aquamarine", category: "gemstones", preview: "sphere" },
    { id: 31, color: "#DC143C", name: "Garnet", category: "gemstones", preview: "sphere" },
    
    // Industrial
    { id: 32, color: "#808080", name: "Concrete", category: "industrial", preview: "sphere" },
    { id: 33, color: "#696969", name: "Asphalt", category: "industrial", preview: "sphere" },
    { id: 34, color: "#A9A9A9", name: "Aluminum", category: "industrial", preview: "sphere" },
    { id: 35, color: "#D3D3D3", name: "Plastic", category: "industrial", preview: "sphere" },
    { id: 36, color: "#2F4F4F", name: "Carbon", category: "industrial", preview: "sphere" },
    { id: 37, color: "#556B2F", name: "Olive", category: "industrial", preview: "sphere" },
    { id: 38, color: "#8B0000", name: "Rust", category: "industrial", preview: "sphere" },
    { id: 39, color: "#483D8B", name: "Indigo", category: "industrial", preview: "sphere" },
  ]

  const categories = [
    { id: "all", name: "All Materials", count: allMaterials.length },
    { id: "metals", name: "Metals", count: allMaterials.filter(m => m.category === "metals").length },
    { id: "colors", name: "Colors", count: allMaterials.filter(m => m.category === "colors").length },
    { id: "natural", name: "Natural", count: allMaterials.filter(m => m.category === "natural").length },
    { id: "gemstones", name: "Gemstones", count: allMaterials.filter(m => m.category === "gemstones").length },
    { id: "industrial", name: "Industrial", count: allMaterials.filter(m => m.category === "industrial").length },
  ]

  // Filter materials based on search and category
  const filteredMaterials = allMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
              {/* Material Library Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Material Library</h3>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{filteredMaterials.length}</span>
                  </div>
                  <button 
                    onClick={() => toggleSection('materials')}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-200 rounded-lg p-1"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.materials ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.materials && (
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <Input
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-all duration-200"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                              selectedCategory === category.id
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                            }`}
                          >
                            {category.name} 
                            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                              {category.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Materials Grid */}
                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredMaterials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => {
                            setSelectedMaterial(material.id)
                            onColorChange?.(material.color)
                          }}
                          className={`group p-3 rounded-xl border-2 transition-all duration-200 bg-white hover:shadow-md ${
                            selectedMaterial === material.id
                              ? "border-blue-500 shadow-lg ring-2 ring-blue-200 transform scale-105"
                              : "border-gray-200 hover:border-gray-300 hover:scale-105"
                          }`}
                        >
                          <div className="w-full h-12 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div 
                              className="w-8 h-8 rounded-full shadow-lg ring-2 ring-white/50"
                              style={{ backgroundColor: material.color }}
                            />
                          </div>
                          <span className="text-xs text-gray-700 text-center block truncate font-medium group-hover:text-gray-900">
                            {material.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* No Results */}
                    {filteredMaterials.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No materials found matching your search.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Background Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Background</h3>
                  </div>
                  <button 
                    onClick={() => toggleSection('background')}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-200 rounded-lg p-1"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.background ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.background && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => onBackgroundColorChange?.(e.target.value)}
                          className="w-12 h-12 rounded-xl border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700 mb-1">Background Color</div>
                        <div className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          {backgroundColor.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Material Properties Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Material Properties</h3>
                  </div>
                  <button 
                    onClick={() => toggleSection('material')}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-200 rounded-lg p-1"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.material ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expandedSections.material && (
                  <div className="space-y-4">
                    {/* Roughness */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium text-gray-700">Roughness</Label>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {Math.round(roughness * 100)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Slider
                            value={[roughness]}
                            onValueChange={(value) => onRoughnessChange?.(value[0])}
                            min={0}
                            max={1}
                            step={0.01}
                            className="w-full"
                          />
                        </div>
                        <Input
                          type="text"
                          value={roughness.toFixed(2)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0.5
                            onRoughnessChange?.(Math.min(Math.max(value, 0), 1))
                          }}
                          className="w-16 h-8 text-center text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Smooth</span>
                        <span>Rough</span>
                      </div>
                    </div>

                    {/* Metalness */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium text-gray-700">Metalness</Label>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {Math.round(metalness * 100)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Slider
                            value={[metalness]}
                            onValueChange={(value) => onMetalnessChange?.(value[0])}
                            min={0}
                            max={1}
                            step={0.01}
                            className="w-full"
                          />
                        </div>
                        <Input
                          type="text"
                          value={metalness.toFixed(2)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0.5
                            onMetalnessChange?.(Math.min(Math.max(value, 0), 1))
                          }}
                          className="w-16 h-8 text-center text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Matte</span>
                        <span>Metallic</span>
                      </div>
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
