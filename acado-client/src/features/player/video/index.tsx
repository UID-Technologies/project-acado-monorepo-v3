/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 25 March 2025
@author:: Edulyst Ventures  
@purpose : This component is used to show the video player
@dependency : This page is dependent on the content to and video url to play the video

@@ Use case (if any use case) and solutions 

**/

import { CommonModuleContent } from '@app/types/learning/courses';
import React from 'react'

interface AssessmentProps {
    content: CommonModuleContent;
}

const VideoPlayer = ({ content }: AssessmentProps) => {
    return (
        <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 border">
            <video controls className="w-full md:h-[600px]">
                <source src={content?.url} type="video/mp4" />
            </video>
        </div>
    )
}

export default VideoPlayer
