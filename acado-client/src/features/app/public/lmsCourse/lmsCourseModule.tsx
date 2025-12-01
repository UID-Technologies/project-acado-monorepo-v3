import React, { useEffect, useState } from 'react'
import { fetchModuleByCourseId } from '@services/public/LmsCourseService'
import { useModuleStore } from '@app/store/public/___LmsCourseStore'
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

function CourseModuleShow() {
    const { courseId, moduleId } = useParams<{ courseId: string, moduleId: string }>();
    const { setModule, module, course, setCourse, content, setContent, error, setError, loading, setLoading } = useModuleStore();
    const [expandedContentIndex, setExpandedContentIndex] = useState<number | null>(null);

    useEffect(() => {
        const getModule = () => {

            if (!courseId || !moduleId) {
                setError('Course ID or Module ID is missing');
                return;
            }

            setLoading(true);
            fetchModuleByCourseId(moduleId)
                .then((data) => {
                    setModule(data?.module_details);
                    setCourse(data?.course_details);
                    setContent(data?.contents);
                    console.log(data);
                })
                .catch((error) => {
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        getModule();

    }, [courseId, moduleId, setModule, setError, setLoading, setCourse, setContent]);

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={error} type="danger" />

    return (
        <div className="container">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Link to="/" className="hover:text-primary">
                    Home
                </Link>
                <span>›</span>
                <Link to={'/my-courses'} className="hover:text-primary">Courses</Link>
                <span>›</span>
                <Link to={`/courses/${course?.id}`} className="hover:text-primary">
                    {course?.name}
                </Link>
                <span>›</span>
                <span className="font-semibold">{module?.name}</span>
            </nav>
            {/* Module Header */}
            <div className="bg-white p-6 rounded-lg shadow mb-5">
                <span className="text-sm text-gray-600 bg-gray-100 p-1 rounded">{course?.name}</span>
                <h1 className="text-3xl md:text-3xl font-bold mb-2 mt-2">{module?.name}</h1>
                <p className="text-gray-700 mb-2">{module?.description}</p>
                <div className="flex items-center space-x-5">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                        </svg>
                        <span className="text-sm text-gray-600">10</span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                        </svg>
                        <span className="text-sm text-gray-600">{course?.liked}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <span className="text-sm text-gray-600">{course?.rating}</span>
                    </div> */}
                </div>
                <h2 className="text-xl font-bold mb-2 mt-4">What’s Included</h2>
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {module?.whats_included?.map((item, index: number) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            {item.type === 'video' && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                            {item.type === 'reading' && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m-6-8h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            )}
                            {item.type === 'assignment' && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-yellow-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m-6-8h6M7 4h10a2 2 0 012 2v2H5V6a2 2 0 012-2z"
                                    />
                                </svg>
                            )}
                            <span className="text-gray-700">{item.title}</span>
                        </div>
                    ))}
                </div> */}
            </div>

            {/* Module Contents */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Contents</h2>
                <div className="space-y-4">
                    {Array.isArray(content) && content?.map((contentItem, index: number) => (
                        <div key={contentItem.program_content_id} className="border border-gray-200 rounded-lg">
                            <button
                                className="w-full px-4 py-3 flex items-center justify-between focus:outline-none"
                                onClick={() =>
                                    setExpandedContentIndex(expandedContentIndex === index ? null : index)
                                }
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Icon based on content type */}
                                    {contentItem.content_type === 'video' && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    )}
                                    {contentItem.content_type === 'assesment' && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-green-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m-6-8h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    )}
                                    {contentItem.content_type === 'assignment' && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-yellow-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m-6-8h6M7 4h10a2 2 0 012 2v2H5V6a2 2 0 012-2z"
                                            />
                                        </svg>
                                    )}
                                    <span className="font-medium">{contentItem.title}</span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transform transition-transform ${expandedContentIndex === index ? 'rotate-180' : ''
                                        }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {/* {expandedContentIndex === index && (
                                <div className="px-4 py-3 border-t border-gray-200">
                                    <p className="text-gray-700 mb-2">{contentItem.description}</p>
                                    {contentItem.content && contentItem.content.length > 0 && (
                                        <ul className="list-disc pl-5 space-y-1">
                                            {contentItem.content.map((sub) => (
                                                <li key={`content-${sub.title}`} className="text-gray-600">
                                                    {sub.title}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CourseModuleShow
