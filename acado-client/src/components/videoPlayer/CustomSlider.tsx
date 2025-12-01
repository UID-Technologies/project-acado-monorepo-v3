
import { useRef, useState, useEffect } from 'react'

interface CustomSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  step?: number
  className?: string
}

export function CustomSlider({
  value,
  onValueChange,
  max = 100,
  step = 0.1,
  className = '',
}: CustomSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return value[0]
    
    const rect = trackRef.current.getBoundingClientRect()
    const position = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (position / rect.width) * 100))
    const newValue = Math.round((percentage * max) / step) * step
    
    return Math.min(max, Math.max(0, newValue))
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    const newValue = calculateValue(e.clientX)
    onValueChange([newValue])
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return
    const newValue = calculateValue(e.clientX)
    onValueChange([newValue])
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging])

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      className={`
        relative h-2 w-full rounded-full 
        bg-white/20 
        cursor-pointer
        touch-none
        ${className}
      `}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value[0]}
    >
      <div
        className="absolute h-full rounded-full bg-white"
        style={{ width: `${(value[0] / max) * 100}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 
                   rounded-full bg-white shadow-sm
                   transform -translate-x-1/2
                   focus:outline-none focus:ring-2 focus:ring-white"
        style={{ left: `${(value[0] / max) * 100}%` }}
      />
    </div>
  )
}

