import React, {
    useEffect,
    useImperativeHandle,
    useRef,
    forwardRef,
} from 'react';
import Hls from 'hls.js';

export interface HlsPlayerHandle {
    getCurrentProgress?: () => number | null;
    start?: () => void;
    stop?: () => void;
    togglePlay?: () => void;
    setDefaultStart?: (time?: number | null | undefined) => void;
    currentPlayState?: () => boolean;
    videoLength?: () => number;
}

interface HlsPlayerProps {
    url: string;
    autoPlay?: boolean;
}

const HlsPlayer = forwardRef<HlsPlayerHandle, HlsPlayerProps>(({ url, autoPlay }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    useImperativeHandle(ref, () => ({
        getCurrentProgress: () => videoRef.current?.currentTime ?? null,
        start: () => videoRef.current?.play(),
        stop: () => videoRef.current?.pause(),
        togglePlay: () => {
            if (!videoRef.current) return;
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        },
        setDefaultStart: (time) => {
            if (videoRef.current && typeof time === 'number') {
                videoRef.current.currentTime = time;
            }
        },
        currentPlayState: () => {
            if (!videoRef.current) return false;
            return !videoRef.current.paused;
        },
        videoLength: () => {
            if (!videoRef.current) return 0;
            return videoRef.current?.duration || 0;
        }
    }));

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls({
                xhrSetup: (xhr, url) => {
                    xhr.setRequestHeader(
                        'api-key',
                        '6f568c7ebab5eb21f4c66df0c451869e31652b6ade6851b55db83d0ac792dbb3'
                    );
                    console.log('Requesting URL:', url);
                },
                maxBufferLength: 5,
                maxMaxBufferLength: 10,
                maxBufferSize: 60 * 1000 * 1000,
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });

            hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }

        return () => {
            hlsRef.current?.destroy();
        };
    }, [url]);

    return (
        <video
            ref={videoRef}
            controls
            autoPlay={autoPlay ?? true}
            id="video-player"
            className="h-96 w-full"
        />
    );
});

HlsPlayer.displayName = 'HlsPlayer';

export default HlsPlayer;