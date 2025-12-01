import React from 'react'
import { FaChevronRight } from "react-icons/fa6";
import { EventProgramContent } from '@app/types/collaborate/events';
import { formatDate } from "@/utils/dateUtils";
import { Calendar, Clock } from "lucide-react";




type ContentProps = {
    content: EventProgramContent;
};

const Content: React.FC<ContentProps> = ({ content }) => {
    return (
        <div className="relative border-l-2 border-primary p-6 bg-gray-100 py-3 dark:bg-gray-800 dark:border-primary cursor-pointer">
            <div className='flex justify-between items-center mb-2'>
                <h3 className='dark:text-primary text-primary'>{content.title}</h3>
                <FaChevronRight size={24} className='text-primary' />
            </div>
            <p className='text-justify mb-3 line-clamp-3'>{content.description}</p>
            <div className="flex flex-wrap items-center mt-3 gap-2">
                <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(content?.start_date, "dd MMM yyyy")}</span>
                    {content?.end_date && (
                        <>
                            <span>–</span>
                            <span>{formatDate(content?.end_date, "dd MMM yyyy")}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Duration: {content?.expected_duration}</span>
                </div>
            </div>
        </div>
    );
};

export default Content


// <div
//   key={index}
//   className="relative border-l-2 border-primary pl-6 bg-white py-3 dark:bg-gray-800 dark:border-primary cursor-pointer"
//   onClick={() => handleCardClick(activity)}
// >
//   <h6 className="font-bold text-primary dark:text-primary text-[14px]">
//     Activity {index + 1}
//   </h6>
//   <h3 className="font-bold text-lg text-gray-800 dark:text-white">{activity.title}</h3>
//   <p className="text-sm text-gray-600 dark:text-gray-400">
//     {activity.description}
//   </p>
//   {activity.content && (
//     <a
//       href={activity.content}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-sm text-blue-500 underline"
//     >
//       View Content
//     </a>
//   )}
//   <div className="flex items-center mt-3 gap-2">
//     <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
//       <Calendar size={16} /> {activity?.start_date}
//     </span>
//     -
//     <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
//       <Calendar size={16} /> {activity?.end_date}
//     </span>
//   </div>
//   <div className="flex justify-start w-full mt-4">
//     {activity.content_type === 'zoomclass' && activity?.liveclass_action === 'Join Class' && (
//       <button
//         onClick={() => window.open(selectedZoomClass?.zoom_url ?? '', '_blank')}
//         className="px-4 py-2 bg-primary dark:text-gray-700 text-white rounded-lg hover:bg-primary-dark"
//       >
//         Join Now
//       </button>
//     )}
//   </div>
// </div>
