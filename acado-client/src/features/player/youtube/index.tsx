/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 25 March 2025
@author:: Edulyst Ventures  
@purpose : This component is used to show the video player
@dependency : This page is dependent on the content to and video url to play the video

@@ Use case (if any use case) and solutions 

**/

import React from 'react'
import { CommonModuleContent } from '@app/types/learning/courses';
import { saveContentCompletion } from '@services/learning/CourseService';

interface AssessmentProps {
    content: CommonModuleContent;
}

const YoutubeVideoPlayer = ({ content }: AssessmentProps) => {

    const [youtubeVideoId, setYoutubeVideoId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const url = new URL(content?.url);
        const videoId = url.searchParams.get('v');
        setYoutubeVideoId(videoId);
        // set video play to complete
        if (youtubeVideoId) {
            if (Number(content.completion) !== 100) {
                const formData = new FormData();
                formData.append('bookmark', '100');
                formData.append('content_id', content?.program_content_id.toString());
                formData.append('completion', '100');
                saveContentCompletion(formData).then((res) => {
                    console.log("res", res);
                });
            }
        }
    }, [content?.url]);


    return (
        <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 border">
            {youtubeVideoId && (
                <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    )
}

export default YoutubeVideoPlayer
