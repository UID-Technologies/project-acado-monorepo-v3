import { AssessmentDetail } from '@app/types/learner/assignmentDetails';
import { Activity } from '@app/types/learner/events';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Button } from '@/components/ui/ShadcnButton';
import { fetchAssignmentDetails } from '@services/learner/AssignmentDetailsService';
import { fetchAssignmentSubmissionList } from '@services/learner/AssignmentSubmitService';
import { useAssignmentDetailsStore } from '@app/store/learner/assignmentDetailsStore';
import { formatDate } from '@/utils/commonDateFormat';
import { Eye } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

type ContentProps = {
    content: Activity;
};

const Content: React.FC<ContentProps> = ({ content }) => {
    const { assignmentDetailsList, setAssignmentList, error, setError, loading, setLoading } = useAssignmentDetailsStore();
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const loadAssignmentDetails = useCallback(async () => {
        if (!content?.id) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetchAssignmentDetails(content.id);
            setAssignmentList(response);
        } catch (err: unknown) {
            setError((err as Error).message || 'An error occurred while fetching the assignment.');
        } finally {
            setLoading(false);
        }
    }, [content?.id, setAssignmentList, setError, setLoading]);

    useEffect(() => {
        loadAssignmentDetails();
    }, [loadAssignmentDetails]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);
        if (selectedFile) setAssignment((prev) => ({ ...prev, file: selectedFile.name }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return setError('Please upload a file before submitting.');

        setIsSubmitting(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('content_id', content.id.toString());
            formData.append('file', file);
            formData.append('userNotes', assignment.title);
            await fetchAssignmentSubmissionList(formData);
            loadAssignmentDetails();
            setFile(null);
            setAssignment((prev) => ({ ...prev, title: '' }));
        } catch (err: unknown) {
            setError((err as Error).message || 'An error occurred while submitting.');
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loading loading={loading} />;
    if (error) return <Alert type="danger" title={error} />;

    return (
        <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold dark:text-primary">Assignment Submission</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Upload your assignment before the deadline.</p>
                </div>

                {content?.url && <div>
                    <Button asChild className='mt-2'>
                        <Link to={content?.url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-white dark:text-black">
                            <Eye />  View Assignment
                        </Link>
                    </Button>
                </div>
                }
            </div>

            <form className="mt-6 space-y-3" onSubmit={handleSubmit} >
                <label className="block text-sm font-medium dark:text-white mb-0">User Notes</label>
                <input
                    required
                    type="text"
                    placeholder="Write short notes"
                    value={assignment.title}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white"
                    onChange={(e) => setAssignment((prev) => ({ ...prev, title: e.target.value }))}
                />
                <div className="flex items-center gap-4">
                    <button type="button" className="py-3 px-4 bg-primary w-full text-white rounded-md" onClick={() => document.getElementById('file')?.click()}>
                        Choose File
                    </button>
                    <input id="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
                    {file && <span className="text-gray-500">{file.name}</span>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || !file}
                    className={`w-full py-2 px-4 text-white rounded-md ${isSubmitting || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
            </form>

            {assignmentDetailsList?.submission_details?.length > 0 && (
                <div className="mt-6 bg-white dark:bg-gray-800">
                    <h3 className="text-xl font-semibold">Submission List</h3>
                    <div className='overflow-x-auto'>
                        <table className="w-full table-auto mt-4">
                            <thead className="dark:bg-gray-700">
                                <tr className='border'>
                                    <th className="px-2 py-2 text-left">Sr. no</th>
                                    <th className="px-2 py-2 text-left">Submission Date</th>
                                    <th className="px-2 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignmentDetailsList?.submission_details?.map((submission, index) => (
                                    <tr key={submission.id} className='dark:bg-gray-900 border'>
                                        <td className='px-2 py-2'>{index + 1}</td>
                                        <td className='px-2 py-2'>{formatDate(submission.updated_at, 'DD MMM YYYY, HH:mm a')}</td>
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
};

export default Content
