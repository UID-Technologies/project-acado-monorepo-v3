import { useState, useRef, useEffect } from 'react'

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [zoom, setZoom] = useState(1)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVideoProgress = (value: number) => {
    if (videoRef.current) {
      const time = (value / 100) * videoRef.current.duration
      videoRef.current.currentTime = time
      setProgress(value)
    }
  }

  const handleVolume = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value
      setVolume(value)
    }
  }

  const handleSkip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount
    }
  }

  const handleZoom = (factor: number) => {
    setZoom(factor)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    videoRef,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    zoom,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleVideoProgress,
    handleVolume,
    handleSkip,
    handleZoom,
    formatTime,
  }
}

