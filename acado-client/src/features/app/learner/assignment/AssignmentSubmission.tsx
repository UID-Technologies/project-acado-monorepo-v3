import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AssessmentDetail, AssessmentResponse } from '@app/types/learner/assignmentDetails';
import { fetchAssignmentDetails } from '@services/learner/AssignmentDetailsService';
import { useAssignmentDetailsStore } from '@app/store/learner/assignmentDetailsStore';
import { fetchAssignmentSubmissionList } from '@services/learner/AssignmentSubmitService';
import { useAssignmentSubmissionStore } from '@app/store/learner/assignmentSubmissionStore';
import { Alert } from '@/components/ui';
import Loading from '@/components/shared/Loading';
import Breadcrumb from '@/utils/Breadcrumb';

export default function AssignmentSubmission() {
    const location = useLocation();
    const { program_content_id } = location.state || {};
    const { assignmentDetailsList, setAssignmentList, error, setError, loading, setLoading } = useAssignmentDetailsStore();
    const { setAssignmentSubmissionList } = useAssignmentSubmissionStore();

    // get id from params
    const { id } = useParams<{ id: string }>();

    const [assignment, setAssignment] = useState<AssessmentDetail>({
        id: 0,
        title: '',
        description: '',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        file: '',
        allow_multiple: 0,
        is_graded: 0,
        submission_mode: 0,
        learner_name: '',
        submission_details: [],
    });

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (program_content_id) {
            setLoading(true);
            setError('');
            fetchAssignmentDetails(program_content_id)
                .then((response) => {
                    setAssignmentList({ status: 200, data: { assessment_details: response }, error: [] });
                })
                .catch((err) => {
                    setError(err.message || 'An error occurred while fetching the assignment.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [program_content_id, setAssignmentList, setError, setLoading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
            setAssignment((prev) => ({ ...prev, file: selectedFile.name }));
        }
    };

    const fetchAssignmentSubmission = async (programContentId: number, file: File, userNotes: string) => {
        if (programContentId && file && userNotes) {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('content_id', programContentId.toString());
                formData.append('file', file);
                formData.append('userNotes', userNotes);

                const response = await fetchAssignmentSubmissionList(formData);
                setAssignmentSubmissionList({ status: 200, data: { assessment_details: response }, error: [] });

                setToast({ show: true, message: 'Assignment submitted successfully!', type: 'success' });
            } catch (err: any) {
                setError(err.message || 'An error occurred while submitting.');
                setToast({ show: true, message: 'Failed to submit the assignment.', type: 'error' });
            } finally {
                setLoading(false);
            }
        } else {
            setToast({ show: true, message: 'Please upload a file and provide notes.', type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            setIsSubmitting(true);
            await fetchAssignmentSubmission(program_content_id, file, assignment.title);
            setIsSubmitting(false);
        } else {
            setToast({ show: true, message: 'Please upload a file before submitting.', type: 'error' });
        }
    };


    if (loading) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return (
            <Alert type="danger" title={error} />
        );
    }

    return (
        <div className="container mx-auto">

            <Breadcrumb title="Assignment Submission" route={`/event-activity/${id}`} />
            {/* Toast Notifications */}
            {toast && toast.show && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.message}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold dark:text-primary">Assignment Submission</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Upload your assignment before the deadline.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {assignmentDetailsList?.data.assessment_details.map((detail) => (
                        <div key={detail.id} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-9">
                                    <label htmlFor={`title-${detail.id}`} className="block text-sm font-medium dark:text-white">
                                        User Notes
                                    </label>
                                    <input
                                        id={`title-${detail.id}`}
                                        type="text"
                                        placeholder="Write short notes"
                                        value={assignment.title}
                                        onChange={(e) => setAssignment((prev) => ({ ...prev, title: e.target.value }))}
                                        required
                                        className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <label htmlFor="file" className="block text-sm font-medium dark:text-white">
                                        Upload Assignment
                                    </label>
                                    <div className="relative flex items-center">
                                        <input id="file" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.xlsx,.xls" className="hidden" />
                                        <button type="button" onClick={() => document.getElementById('file')?.click()} className="w-full py-3 px-4 bg-primary text-white rounded-md">
                                            Choose File
                                        </button>
                                        {file && <span className="ml-2 text-gray-500">{file.name}</span>}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !file}
                                className={`w-full py-2 px-4 text-white rounded-md ${isSubmitting || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                            </button>
                        </div>
                    ))}
                </form>
            </div>

            {/* Submission List (Only Show if Not Empty) */}
            {assignmentDetailsList?.data?.assessment_details?.length &&
                assignmentDetailsList.data.assessment_details[0]?.submission_details?.length > 0 && (
                    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">Submission List</h3>
                        <div className='overflow-scroll'>
                            <table className="w-[100vw] md:w-full table-auto mt-4">
                                <thead className="dark:bg-gray-700">
                                    <tr>
                                        <th className="px-2 py-2 text-left">Content ID</th>
                                        <th className="px-2 py-2 text-left">User ID</th>
                                        <th className="px-2 py-2 text-left">Notes</th>
                                        <th className="px-2 py-2 text-left">Submission Date</th>
                                        <th className="px-2 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignmentDetailsList?.data.assessment_details[0]?.submission_details?.map((submission) => (
                                        <tr key={submission.id} className='dark:bg-gray-900'>
                                            <td className='px-2 py-2'>{submission.content_id}</td>
                                            <td className='px-2 py-2'>{submission.user_id}</td>
                                            <td className='px-2 py-2'>{submission.user_notes || 'N/A'}</td>
                                            <td className='px-2 py-2'>{submission.updated_at}</td>
                                            <td className='px-2 py-2'><a href={submission.file} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>
    );
}
