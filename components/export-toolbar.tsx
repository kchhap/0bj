"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ExportToolbarProps {
  onExport: () => void
  onZoomChange?: (zoom: number) => void
  onRotate?: (axis: 'x' | 'y', direction: 'left' | 'right' | 'up' | 'down') => void
}

export function ExportToolbar({ onExport, onZoomChange, onRotate }: ExportToolbarProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showZoomMenu, setShowZoomMenu] = useState(false)

  const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 300]

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom)
    onZoomChange?.(newZoom)
    setShowZoomMenu(false)
  }

  const handleRotate = (axis: 'x' | 'y', direction: 'left' | 'right' | 'up' | 'down') => {
    onRotate?.(axis, direction)
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center px-4 py-2 gap-3">
        {/* Tool Icons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-200"
            onClick={() => handleRotate('y', 'left')}
          >
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-gray-700"></div>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-200"
            onClick={() => handleRotate('y', 'right')}
          >
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-gray-700"></div>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-200"
            onClick={() => handleRotate('x', 'up')}
          >
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-700"></div>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-200"
            onClick={() => handleRotate('x', 'down')}
          >
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-700"></div>
          </Button>
        </div>

        {/* Zoom Control with Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-700 font-medium">{zoomLevel}%</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-gray-200"
              onClick={() => setShowZoomMenu(!showZoomMenu)}
            >
              <ChevronDown className="h-3 w-3 text-gray-700" />
            </Button>
          </div>
          
          {/* Zoom Menu */}
          {showZoomMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-40 min-w-[80px]">
              {zoomLevels.map((level) => (
                <button
                  key={level}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                    level === zoomLevel ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleZoomChange(level)}
                >
                  {level}%
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Export Button */}
        <Button 
          onClick={onExport} 
          size="sm" 
          className="bg-green-400 hover:bg-green-500 text-white px-4 rounded-md font-medium"
        >
          Export
        </Button>
      </div>
    </div>
  )
}
