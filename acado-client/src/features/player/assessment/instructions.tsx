import React, { useState } from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Globe, Wifi, Monitor, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SystemCheckDialog from "./components/SystemCheck";
import { toast } from "sonner";
import { useAssessmentInstruction } from "@app/hooks/data/useCourses";

interface Requirement {
    browser: boolean;
    screen: boolean;
    internet: boolean;
}


const Instructions: React.FC = () => {
    const [acceptedRules, setAcceptedRules] = useState(false);
    const [showSystemCheck, setShowSystemCheck] = useState(false);
    const { id, courseId } = useParams<{ id: string, courseId: string }>();

    const [requirements, setRequirements] = useState<Requirement>({
        browser: false,
        screen: false,
        internet: navigator.onLine,
    });

    const navigate = useNavigate();

    const { data: assessmentInstruction } = useAssessmentInstruction(id);

    const systemRequirements = {
        browser: "Chrome 90+ / Firefox 88+ / Safari 14+",
        internet: "Minimum 1 Mbps stable connection",
        screen: "For batter experience use above 1100x700 resolution",
        // camera: "Working webcam required",
        // audio: "Working microphone required",
    };

    const startExam = () => {

        if (!id || !courseId) {
            toast.error("Something went wrong. Please try again later.");
            return;
        }

        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            navigate(`/assessment/${courseId}/${id}`);
        }
        else {
            toast.error("Your browser does not support full screen mode. Please use latest version of Chrome, Firefox or Safari.")
        }
    }

    return (
        <div className="min-h-screen">
            <div>
                {/* Header */}
                <div className="flex mb-8 gap-4 items-center">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ChevronLeft size={40} /> Back
                    </Button>
                    <h1 className="text-2xl font-bold flex-1">Exam Instructions</h1>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-6">
                        {/* Assessment Details Card */}
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    {assessmentInstruction?.details.title}
                                </h2>
                                {assessmentInstruction?.details &&
                                    (Number(assessmentInstruction.details.is_attempted) === 1 ||
                                        Number(assessmentInstruction.details.is_review_allowed) === 1) && (
                                        <Link to={`/assessment/attempt/assessmentReview/${assessmentInstruction.details.content_id}`}>
                                            <Button className="text-white">Review Assessment</Button>
                                        </Link>
                                    )
                                }

                            </div>

                            <p className="dark:text-gray-300 text-gray-700 mb-6">
                                {assessmentInstruction?.details.description}
                            </p>

                            <div className="grid grid-cols-2 gap-36">
                                <div className="space-y-4">
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Start Date:</span>
                                        <span className="font-medium">
                                            {
                                                new Date(assessmentInstruction?.details.start_date ?? '').toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">End Date:</span>
                                        <span className="font-medium">
                                            {
                                                new Date(assessmentInstruction?.details.end_date ?? '').toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Duration:</span>
                                        <span className="font-medium">
                                            {assessmentInstruction?.details.duration_in_minutes} minutes
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Total Questions:</span>
                                        <span className="font-medium">
                                            {assessmentInstruction?.details.question_count}
                                        </span>
                                    </div>

                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Difficulty Level:</span>
                                        <Badge variant="outline">
                                            {assessmentInstruction?.details.difficulty_level}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Maximum Marks:</span>
                                        <span className="font-medium">
                                            {assessmentInstruction?.details.maximum_marks}
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Passing Marks:</span>
                                        <span className="font-medium">
                                            {assessmentInstruction?.details.passing_marks}
                                        </span>
                                    </div>

                                    {(assessmentInstruction?.details.attempt_allowed ?? 0) > 0 && (
                                        <div className="flex justify-start gap-4">
                                            <span className="text-gray-700 dark:text-gray-300 font-semibold">Attempts Allowed:</span>
                                            <span className="font-medium">
                                                {assessmentInstruction?.details.attempt_allowed ?? 0}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                        {/* Instructions Section */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Exam Instructions</h2>
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-4">
                                    {assessmentInstruction?.statement.map((instruction, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                                                {index + 1}
                                            </div>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: instruction }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* System Requirements Card */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold ">
                                Performance Recommendations
                            </h2>
                            <p className="pt-4 mb-4">To ensure enhanced performance and seamless functionality, the following system specifications are recommended:</p>
                            <div className="space-y-4">
                                {Object.entries(systemRequirements).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-3">
                                        {key === "browser" ? requirements.browser ? <CheckCircle className="text-green-500" size={24} /> : <Globe size={24} /> : null}
                                        {key === "internet" ? requirements.internet ? <CheckCircle className="text-green-500" size={24} /> : <Wifi size={24} /> : null}
                                        {key === "screen" ? requirements.screen ? <CheckCircle className="text-green-500" size={24} /> : <Monitor size={24} /> : null}
                                        {/* {key === "camera" && <Camera size={24} />}
                                        {key === "audio" && <Mic size={24} />} */}
                                        <div>
                                            <p className="font-medium capitalize font-semibold">{key}</p>
                                            <p className="text-sm dark:text-gray-300 text-gray-700">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className="w-full mt-6 !rounded-button text-primary border-primary" variant="outline"
                                onClick={() => setShowSystemCheck(true)}
                            >
                                Run System Check
                            </Button>
                        </Card>

                        {/* Certificate Information */}
                        {assessmentInstruction?.details.is_certificate === 1 && (
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <i className="fas fa-certificate text-2xl text-yellow-500"></i>
                                    <h2 className="text-xl font-semibold">
                                        Certificate Available
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Complete this assessment successfully to earn a verified
                                    certificate of completion.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t">
                    <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="accept-rules"
                                checked={acceptedRules}
                                onCheckedChange={(checked) =>
                                    setAcceptedRules(checked as boolean)
                                }
                            />
                            <Label htmlFor="accept-rules">
                                I have read and agree to all exam instructions and rules
                            </Label>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                disabled={!acceptedRules} className="!rounded-button text-white dark:text-black"
                                onClick={startExam}
                            >
                                Start Exam
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* System Check Dialog */}
            <SystemCheckDialog show={showSystemCheck} requirements={requirements} setRequirements={setRequirements} onClose={setShowSystemCheck} />
        </div>
    );
};

export default Instructions;
