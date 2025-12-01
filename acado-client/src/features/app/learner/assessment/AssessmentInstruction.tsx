import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router-dom';


export default function AssessmentInstruction() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const assessmentDetails = location.state?.assessmentDetails;

    const handleAttempt = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirm = () => {
        setIsConfirmOpen(false);
        navigate(`/assessmentQuestion/${assessmentDetails.program_content_id}`, { state: { program_content_id: assessmentDetails } });
    };


    const handleReviewButton = () => {
        navigate(`/assessmentReview/${assessmentDetails?.program_content_id}`, { state: { program_content_id: assessmentDetails } });
    };


    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 dark:text-primary text-primary">Assessment Instructions</h1>

            <div className="dark:bg-gray-700 bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 dark:text-primary text-primary">{assessmentDetails?.title ?? ''}</h2>
                <p className="text-1xl font-semibold mb-4">{assessmentDetails?.description ?? ''}</p>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div className="flex justify-between">
                        <p className="font-semibold">Submit before: {assessmentDetails?.due_by ?? 0}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Total marks: {assessmentDetails?.maximum_marks ?? 0}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Attempts allowed: {assessmentDetails?.attempt_allowed ?? 0}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Difficulty Level: {assessmentDetails?.difficulty_level ?? 'Easy'}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Remaining Attempts: {assessmentDetails?.attempts_remaining ?? 0}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Negative Marks: {assessmentDetails?.negative_marks ?? 0}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Total Questions: {assessmentDetails?.que_count ?? 0}</p>

                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Overall Score: {assessmentDetails?.overall_score ?? 0}</p>

                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 dark:text-primary text-primary">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2">

                        <li>Read each question carefully before answering.</li>
                        <li>You have {assessmentDetails?.duration ?? 0} minutes to complete the assessment.</li>
                        <li>Each question is worth 5 points.</li>
                        <li>You can review and change your answers before submission.</li>
                        <li>Ensure a stable internet connection before starting.</li>
                        <li>Click "Submit" when you're done with all questions.</li>
                    </ol>
                </div>

                <Button className="dark:bg-primary dark:text-gray-700 mr-10" onClick={handleAttempt}>
                    Attempt Assessment
                </Button>
                {/* <Link to={`/assessmentReview/${assessmentDetails?.program_content_id}`}>
                   
                </Link> */}
                <Button className="dark:bg-primary dark:text-gray-700" onClick={handleReviewButton}>
                    Review Assessment
                </Button>
            </div>

            {isConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="dark:bg-gray-700 bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirm Assessment Attempt</h2>
                        <p className="mb-6">
                            Do you want to attempt this assessment? Once started, the timer will begin and you cannot pause the assessment.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <Button className="dark:bg-primary dark:text-gray-700" onClick={() => setIsConfirmOpen(false)}>
                                Cancel
                            </Button>

                            <Button className="dark:bg-primary dark:text-gray-700" onClick={handleConfirm}>
                                Yes, Start Assessment
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
