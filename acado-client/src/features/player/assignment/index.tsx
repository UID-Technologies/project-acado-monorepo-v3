/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 20 March 2025
@author:: Edulyst Ventures  
@purpose : This page use to show the assignment details, dowload and view the assignment
@dependency : This page is dependent on the content_id to fetch the assignment details

@@ Use case (if any use case) and solutions 


@updatedAt 16 sep 2025 optemized api calls and removed unwanted code

**/

import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import React from 'react'
import { FaEye } from 'react-icons/fa6';
import { LuDownload } from 'react-icons/lu';
import { RiFilePdfFill } from 'react-icons/ri';
import UploadAssignment from './upload';
import PdfRender from '../pdf';
import { Badge } from '@/components/ui/badge';
import ReviewAssignment from './review';
import { Button } from '@/components/ui/ShadcnButton';
import { useLearnerSubmittedAssignments } from '@app/hooks/data/useCourses';
import { formatDate } from '@/utils/commonDateFormat';
import { SubmittedAssignment } from '@app/types/learning/courses';

interface AssignmentProps {
    content_url: string | null;
    content_id: number,
    uploadAssignmentDialog: boolean;
    setUploadAssignmentDialog: (value: boolean) => void;
}

function Assignments({ content_id, content_url, uploadAssignmentDialog, setUploadAssignmentDialog }: AssignmentProps) {
    const [reviewAssignmentDialog, setReviewAssignmentDialog] = React.useState(false);
    const [reviewAssignment, setReviewAssignment] = React.useState<SubmittedAssignment | null>(null);

    const { data: assignments, isLoading, isError, error } = useLearnerSubmittedAssignments(content_id);

    if (isLoading) {
        return <Loading loading={isLoading} />
    }

    if (isError) {
        return <Alert title={error.message} type="danger" />
    }

    const handleDownload = (url: string, fileName: string) => {
        fetch(url).then(response => {
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
            });
        });
    }

    return (
        <div>
            {content_url && <div className="overflow-hidden mb-6 h-[450px]">
                <PdfRender fileUrl={content_url} />
            </div >}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Submitted Assignments
                    <span className="text-sm text-gray-500 ml-2">({assignments?.length})</span>
                </h2>
                <Button title="Upload Assignment" className='text-white' onClick={() => setUploadAssignmentDialog(true)}>
                    Upload Assignment
                </Button>
            </div>
            {Array.isArray(assignments) && assignments?.map((assignment: SubmittedAssignment, index: number) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 flex items-start gap-4 mb-3 bg-white dark:bg-black">
                    <RiFilePdfFill className="w-6 h-6 text-red-500" />
                    <div className="flex-1">
                        <h3 className="text-base font-bold mb-1 text-gray-900">Assignment {assignments?.length - index}</h3>
                        <p className="text-sm text-gray-500 mb-2">{assignment.user_notes}</p>
                        <p className="text-sm text-gray-400 m-0">
                            {formatDate(assignment.updated_at, "ddd, DD/MM/YY HH:mm A")} · {"2MB"}
                        </p>
                    </div>
                    <div className='flex-col items-stretch relative h-20'>
                        <div className="flex gap-4 justify-end items-center">
                            <Badge variant="outline" className={`text-xs py-2 px-3 ${assignment?.review_status === 0 ? 'text-[#f59e0b]' : assignment?.review_status === 1 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                                {assignment?.review_status === 0 && 'Pending'}
                                {assignment?.review_status === 1 && 'Approved'}
                                {assignment?.review_status === 2 && 'Rejected'}
                            </Badge>
                            <Button asChild size={'icon'} variant={'outline'}>
                                <a
                                    href={assignment?.file}
                                    title="View"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FaEye className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </a>
                            </Button>
                            <Button
                                size={'icon'}
                                variant={'outline'}
                                title="Download"
                                onClick={() => handleDownload(assignment?.file, assignment.user_notes ?? "")}
                            >
                                <LuDownload className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </Button>
                        </div>
                        {assignment?.teacher_notes && <div className="text-xs text-gray-400 mt-1 absolute bottom-0 right-0">
                            <button className="text-blue-500" onClick={() => { setReviewAssignment(assignment); setReviewAssignmentDialog(true) }}>View Review</button>
                        </div>
                        }
                    </div>
                </div>
            ))}
            {content_id && <UploadAssignment
                show={uploadAssignmentDialog}
                content_id={content_id}
                onClose={() => setUploadAssignmentDialog(false)}
            />}

            {
                reviewAssignment && <ReviewAssignment
                    show={reviewAssignmentDialog}
                    assignment={reviewAssignment}
                    onClose={() => setReviewAssignmentDialog(false)}
                />
            }

        </div>
    )
}

export default Assignments
