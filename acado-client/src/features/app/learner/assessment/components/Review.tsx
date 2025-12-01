import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/ShadcnButton";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { useAssessmentReview } from "@app/hooks/data/useCourses";
import LoadingSection from "@/components/LoadingSection";

interface ReviewProps {
    show: boolean;
    onClose: (value: boolean) => void;
    assessment_id: string | null;
}

const Review: React.FC<ReviewProps> = ({ show, onClose, assessment_id }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const printRef = useRef<HTMLDivElement>(null); // Reference to the printable content


    const { data: reviewDetails, isLoading } = useAssessmentReview(assessment_id || undefined);

    const exportToPDF = async () => {
        setLoading(true);
        if (!printRef.current) return;
        const canvas = await html2canvas(printRef.current, {
            scale: 2, // Higher quality
            useCORS: true, // Prevent CORS issues
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('resume.pdf');
        toast.success('Data exported successfully');
        setLoading(false);
    };


    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hrs > 0) parts.push(`${hrs} h`);
        if (mins > 0) parts.push(`${mins} min`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);

        return parts.join(" ");
    };


    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assessment Review</DialogTitle>
                    <DialogDescription>
                        Here is the summary of your assessment performance.
                    </DialogDescription>
                </DialogHeader>

                {isLoading || loading ? (
                    <LoadingSection isLoading={isLoading || loading} title="Loading Review Details..." />
                ) : reviewDetails ? (
                    <div>
                        {/* Printable Section */}
                        <div ref={printRef} id="printable-content" className="space-y-3">
                            <p>
                                <strong>Assessment Name:</strong> {reviewDetails.assessement_name}
                            </p>
                            <p>
                                <strong>Score:</strong> {reviewDetails.score}
                            </p>
                            <p>
                                <strong>Total Questions:</strong> {reviewDetails.question_count}
                            </p>
                            <p>
                                <strong>Questions Attempted:</strong> {reviewDetails.question_attempted}
                            </p>
                            <p>
                                <strong>Questions Skipped:</strong> {reviewDetails.question_skipped}
                            </p>
                            <p>
                                <strong>Time Taken:</strong> {formatTime(reviewDetails.time_taken)}
                            </p>
                            <p>
                                <strong>Assessment Duration:</strong> {reviewDetails.duration_in_minutes} minutes
                            </p>
                        </div>

                        {/* Print Button */}
                        <div className="flex justify-end pt-4">
                            <Button className="bg-blue-600 text-white" onClick={exportToPDF} >
                                Print
                            </Button>
                            {/* Done */}
                            <Link to={`/event-activity/${reviewDetails.program_id}/content/${assessment_id}`}>
                                <Button className="bg-blue-600 text-white ml-2">
                                    Done
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500 text-center">No review details available.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Review;
