import { MessageCircle } from 'lucide-react';
import React from "react";
import { useLocation } from "react-router-dom";
import { Alert, Button } from '@/components/ui';

export default function Content() {

    const location = useLocation();
    const { content } = location.state || {};

    // popup for show resources 

    const [showResources, setShowResources] = React.useState(false);
    const [showResourceIndex, setShowResourceIndex] = React.useState(0);

    if (!content) {
        return <Alert title="Content not found" type='warning' />;
    }

    // check resource_path is img, video, pdf 

    const checkResourceType = (resource_path: string): 'img' | 'video' | 'pdf' | 'unknown' => {
        const resourceTypeMap: { [key: string]: 'img' | 'video' | 'pdf' | 'unknown' } = {
            jpg: 'img',
            png: 'img',
            jpeg: 'img',
            mp4: 'video',
            pdf: 'pdf',
        };

        const extension = resource_path.split('.').pop()?.toLowerCase(); // Ensure case-insensitivity
        return extension && resourceTypeMap[extension] ? resourceTypeMap[extension] : 'unknown';
    };

    return (
        <article className="min-h-screen">
            <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                <div className="absolute inset-0">
                    <img
                        src={content.thumbnail_url || "https://default-image-url.com"}
                        alt={content.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
                {!showResources && (
                    <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                        <div className='flex justify-between gap-4'>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                {content.title}
                            </h1>
                            <Button onClick={() => setShowResources(true)} className="border dark:border-gray-300">View</Button>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            <div className="text-sm dark:text-gray-200" dangerouslySetInnerHTML={{
                                __html: content?.description
                            }}></div>
                        </div>
                    </div>
                )}

                {showResources && (
                    <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                        <div className='flex justify-between gap-4'>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                Resources
                            </h1>
                            <Button onClick={() => setShowResources(false)} className="">Back</Button>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            {
                                content.resource_path && <div>
                                    {
                                        content?.multi_file_uploads?.map((file: any, index: number) => (
                                            <div key={index}>
                                                {/* tabs */}
                                                <div className="flex items-center gap-4 cursor-pointer p-3 border mb-3" onClick={() => setShowResourceIndex(index)}>
                                                    <span>{file.split('/').pop()}</span>
                                                </div>
                                                <div key={index} className={`flex items-center gap-4 ${index === showResourceIndex ? 'block' : 'hidden'}`}>
                                                    {
                                                        checkResourceType(file) === 'img' &&
                                                        <img src={file} alt="Resource" className="w-full" />
                                                    }
                                                    {
                                                        checkResourceType(file) === 'video' &&
                                                        <video src={file} controls className="w-full"></video>
                                                    }
                                                    {
                                                        checkResourceType(file) === 'pdf' &&
                                                        <embed src={file} type="application/pdf" width="100%" height="600px" />
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
