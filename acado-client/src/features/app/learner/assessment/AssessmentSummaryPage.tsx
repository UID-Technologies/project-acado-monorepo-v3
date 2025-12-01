import React, { useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import Button from "@/components/ui/Button";
import { fetchAssessmentReview } from '@services/public/AssessmentReviewService';
import { useAssessmentReviewStore } from '@app/store/public/assessmentReviewStore';
import { ChevronRight } from "lucide-react";

const AssessmentSummaryPage: React.FC = () => {
    const { setAssessmentReview, assessmentReview, setError: setDetailsError, setIsLoading: setDetailsLoading } = useAssessmentReviewStore();
    const location = useLocation();
    const assessmentDetails = location.state?.program_content_id;

    useEffect(() => {
        const fetchAssessmentReviewData = async () => {
            setDetailsLoading(true);
            setDetailsError('question load error');
            try {
                const reviewData = await fetchAssessmentReview(assessmentDetails.program_content_id);
                setAssessmentReview(reviewData);
                console.log('fetch assessment question', reviewData);
            } catch (error) {
                setDetailsError('Failed to load event details.');
                console.error('Error fetching assessment review:', error);
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchAssessmentReviewData();
    }, [assessmentDetails.program_content_id, setAssessmentReview, setDetailsLoading, setDetailsError]);



    // Calculate skipped count
    const skippedCount = assessmentReview?.questions?.filter(question => question.attempt_state === 0).length ?? 0;





    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <div className="dark:bg-gray-700 bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6 dark:text-primary text-primary">Assessment Summary</h1>
                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Total Questions</p>
                                <p className="text-2xl font-bold">{assessmentReview?.question_count}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Attempted</p>
                                <p className="text-2xl font-bold">{assessmentReview?.attempt_count ?? 0}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Skipped</p>
                                <p className="text-2xl font-bold">{skippedCount}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Time Taken</p>
                                <p className="text-2xl font-bold">{assessmentReview?.time_taken ?? '00.00'}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4 dark:text-primary text-primary">Question-wise Summary</h2>
                            <div className="space-y-4">
                                {assessmentReview && assessmentReview.questions?.map((question, index) => (
                                    <div key={question?.question_id} className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium">Question {index + 1}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Status: {question.attempt_state !== 0 ? 'Attempted' : 'Skipped'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Link to='/'>
                            <Button className="dark:bg-primary dark:text-gray-700 flex items-center">
                                Go-to Dashboard
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssessmentSummaryPage;
