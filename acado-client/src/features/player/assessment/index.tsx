import React from 'react'
import { BookOpenCheck, Calendar, Clock, Minus, Pencil } from 'lucide-react';
import { BiQuestionMark } from 'react-icons/bi';
import { formatDate } from '@/utils/commonDateFormat';
import { CommonModuleContent } from '@app/types/learning/courses';

interface AssessmentProps {
    content: CommonModuleContent;
}

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
    <div className="flex items-center border p-3 rounded gap-4 bg-white dark:bg-black border-gray-200 dark:border-gray-700">
        {icon}
        <div>
            <span className="block dark:text-gray-300 text-gray-700">{label}</span>
            <span className="block text-gray-800 dark:text-gray-200 text-nowrap">{value}</span>
        </div>
    </div>
);

const Assessment = ({ content }: AssessmentProps) => {
    const baseInfo = [
        {
            icon: <Calendar className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Start Date",
            value: formatDate(content.start_date, "ddd, DD/MM/YY HH:mm A")
        },
        {
            icon: <Calendar className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Due Date",
            value: content.due_date ? formatDate(content.due_date, "ddd, DD/MM/YY HH:mm A") : "-"
        },
        ...(content?.attempts_remaining > 0
            ? [{
                icon: <Pencil className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
                label: "Attempts",
                value: `${content?.attempts_remaining < 0 ? 0 : content?.attempts_remaining} attempts remaining`
            }]
            : []),
        {
            icon: <Clock className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Duration",
            value: `${content?.duration_in_minutes} minutes`
        },
        {
            icon: <BiQuestionMark className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Questions",
            value: `${content?.questions_attempted} questions`
        },
        {
            icon: <BookOpenCheck className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Maximum Marks",
            value: content?.maximum_marks
        },
        {
            icon: <Minus className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Negative Marking",
            value: content?.negative_marks
        }
    ];

    const lastAttemptInfo = [
        {
            icon: <Calendar className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Date",
            value: (
                <>
                    {new Date(content.attempt_date ?? new Date()).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric"
                    })}{" "}
                    {formatDate(content.attempt_date ?? new Date(), "DD/MM/YY HH:mm:ss")}
                </>
            )
        },
        {
            icon: <BookOpenCheck className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Marks",
            value: content?.score
        },
        {
            icon: <BiQuestionMark className="h-6 w-6 dark:text-gray-300 text-gray-700" />,
            label: "Questions",
            value: `${content?.questions_attempted} questions`
        }
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 mb-6 gap-4">
                {baseInfo.map((item, idx) => (
                    <InfoCard key={idx} {...item} />
                ))}
            </div>
            {(content?.attempt_date != null && content?.attempt_date !== 0) && (
                <div>
                    <h5 className="mb-2">Last Attempt Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 mb-10 gap-4">
                        {lastAttemptInfo.map((item, idx) => (
                            <InfoCard key={idx} {...item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assessment;
