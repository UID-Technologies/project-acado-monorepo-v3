import React, { useEffect, useRef, useState } from 'react';
import HlsPlayer, { HlsPlayerHandle } from './HlsPlayer';
import Loading from '@/components/shared/Loading';
import { CommonModuleContent } from '@app/types/learning/courses';
import { saveContentCompletion } from '@services/learning/CourseService';

interface StreamingProps {
    videoId: string;
    content: CommonModuleContent;
}

const Streaming: React.FC<StreamingProps> = ({ videoId, content }) => {
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const playerRef = useRef<HlsPlayerHandle>(null);
    const [completion, setCompletion] = useState(content?.completion || 0)

    useEffect(() => {
        fetch(`https://streamevsoa.edulystventures.com/videos/${videoId}`, {
            method: 'GET',
            headers: {
                'api-key': '6f568c7ebab5eb21f4c66df0c451869e31652b6ade6851b55db83d0ac792dbb3',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.videoURL) {
                    setStreamUrl(data.videoURL);
                }
            })
            .catch((error) => {
                console.error('Error fetching video URL:', error);
            });
    }, [videoId]);


    const VideoDuration = () => {
        if (!playerRef?.current) {
            console.error('Player reference is not set.');
            return;
        }
        if (!playerRef.current.videoLength) {
            console.error('videoLength method is not available.');
            return;
        }

        return playerRef?.current?.videoLength();
    }

    const handleGetTime = () => {
        if (!playerRef?.current) {
            console.error('Player reference is not set.');
            return;
        }

        if (!playerRef.current.getCurrentProgress) {
            console.error('getCurrentProgress method is not available.');
            return;
        }

        return playerRef?.current?.getCurrentProgress();
    };

    const videoPlayState = () => {
        if (!playerRef?.current) {
            console.error('Player reference is not set.');
            return;
        }
        if (!playerRef.current.currentPlayState) {
            console.error('currentPlayState method is not available.');
            return;
        }

        return playerRef?.current?.currentPlayState();
    }


    const saveProgress = () => {
        if (!content?.program_content_id) {
            return;
        }

        const curentTime = handleGetTime() || 0;
        const videoPlaystateIs = videoPlayState() || false;
        const duration = VideoDuration() || 0;

        if (!curentTime) {
            return;
        }

        if (curentTime >= duration) {
            return;
        }

        if (curentTime === 0) {
            return;
        }

        // convert to percentage
        const percentage = (curentTime / duration) * 100;
        if (videoPlaystateIs) {
            if (Number(completion) < curentTime) {
                const formData = new FormData();
                formData.append('bookmark', percentage.toString());
                formData.append('content_id', content?.program_content_id.toString());
                formData.append('completion', Math.floor(percentage).toString());
                saveContentCompletion(formData).then((res) => {
                    console.log("res", res);
                    setCompletion(percentage);
                });
            }
        }
    }


    useEffect(() => {
        const interval = setInterval(() => {
            saveProgress();
        }, 10000); // 2 minutes - 120000
        return () => clearInterval(interval);
    }, [streamUrl, content?.program_content_id]);


    return (
        <div>
            {streamUrl ? (
                <HlsPlayer ref={playerRef} url={`https://streamevsoa.edulystventures.com/${streamUrl}`} autoPlay={true} />
            ) : (
                <div className='h-48'>
                    <Loading loading={true} />
                </div>
            )}
        </div>
    );
};

export default Streaming;
