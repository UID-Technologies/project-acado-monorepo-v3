import { useVideoPlayer } from '@/utils/hooks/useVideoPlayer'
import { CustomButton } from '@/components/videoPlayer/CustomButton'
import { CustomSlider } from '@/components/videoPlayer/CustomSlider'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, ZoomIn, ZoomOut, X } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  onClose: () => void
  isPlaying:boolean
}

export default function VideoPlayer({ src, onClose }: VideoPlayerProps) {
  const {
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
  } = useVideoPlayer()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-4xl mx-auto">
        <CustomButton
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-50"
        >
          <X className="h-6 w-6" />
        </CustomButton>

        <div className="relative group">
          <div
            className="relative overflow-hidden rounded-lg bg-black"
            style={{ transform: `scale(${zoom})` }}
          >
            <video
              ref={videoRef}
              className="w-full aspect-video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              src={src}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <CustomSlider
              value={[progress]}
              onValueChange={(value) => handleVideoProgress(value[0])}
              max={100}
              step={0.1}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CustomButton
                  onClick={togglePlay}
                  className="text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </CustomButton>

                <CustomButton
                  onClick={() => handleSkip(-10)}
                  className="text-white"
                >
                  <SkipBack className="h-5 w-5" />
                </CustomButton>

                <CustomButton
                  onClick={() => handleSkip(10)}
                  className="text-white"
                >
                  <SkipForward className="h-5 w-5" />
                </CustomButton>

                <div className="flex items-center space-x-2 min-w-[200px]">
                  <CustomButton
                    onClick={() => handleVolume(volume === 0 ? 1 : 0)}
                    className="text-white"
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </CustomButton>
                  <CustomSlider
                    value={[volume * 100]}
                    onValueChange={(value) => handleVolume(value[0] / 100)}
                    max={100}
                    className="w-24"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <CustomButton
                  onClick={() => handleZoom(Math.max(1, zoom - 0.1))}
                  className="text-white"
                >
                  <ZoomOut className="h-5 w-5" />
                </CustomButton>
                <CustomButton
                  onClick={() => handleZoom(Math.min(2, zoom + 0.1))}
                  className="text-white"
                >
                  <ZoomIn className="h-5 w-5" />
                </CustomButton>
                <CustomButton
                  onClick={() => videoRef.current?.requestFullscreen()}
                  className="text-white"
                >
                  <Maximize className="h-5 w-5" />
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

