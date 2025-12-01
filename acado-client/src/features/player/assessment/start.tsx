import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { assessmentQuestionSave, assessmentFinish } from '@services/learning/AssesmentService';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Flag } from 'lucide-react';
import Report from './components/Report';
import QuestionPalette from './components/QuestionPalette';
import QuestionNavigation from './components/QuestionNavigation';
import AssesmentHeader from './components/AssesmentHeader';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useAssessmentQuestions } from '@app/hooks/data/useCourses';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Review = React.lazy(() => import('./components/Review'));


const AssesmentAttempt: React.FC = () => {

    const { id, courseId } = useParams<{ id: string, courseId: string }>();
    const queryClient = useQueryClient();
    const { data: assessment, isLoading: loading, isError } = useAssessmentQuestions(id);

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
    const [timeLeft, setTimeLeft] = useState<number>(assessment?.duration_in_minutes ? assessment.duration_in_minutes * 60 : 0);
    const [error, setError] = useState<string | null>(null);

    const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
    const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
    // const { assesment, setAssesment, loading, setLoading, error, setError } = useAssesmentStore();
    // const { isFullScreen, enterFullScreen } = useFullScreen();
    const [reviewDialog, setReviewDialog] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const saveAnswerMutation = useMutation({
        mutationFn: assessmentQuestionSave,
        onError: (error: string) => {
            console.log('Error saving answer:', error);
        },
        onSuccess: (message: string) => {
            console.log('Answer saved successfully:', message);
        }
    });

    const handleAnswerChange = (value: number | number[]) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: value,
        }));

        if (!id) {
            setError('Assessment Not Found, Please try again later');
            return;
        }

        if (!assessment) {
            setError('Assessment Not Found, Please try again later');
            return;
        }

        const data = {
            content_id: id,
            question_id: assessment?.questions[currentQuestion].question_id,
            option_id: value,
            mark_review: markedForReview.has(currentQuestion) ? 1 : 0,
            durationSec: assessment?.duration_in_minutes * 60 - timeLeft,
        }

        const formData = new FormData();
        formData.append('content_id', id.toString());
        formData.append('question_id', data.question_id.toString());
        if (data.option_id !== null) {
            formData.append('option_id[]', data.option_id.toString());
        }
        formData.append('mark_review', data.mark_review.toString());
        formData.append('durationSec', data.durationSec.toString());

        saveAnswerMutation.mutate(formData);
        // assessmentQuestionSave(data).then((message: string) => {
        //     console.log(message);
        // }).catch((error: string) => {
        //     console.log(error);
        // });
    };

    const getQuestionStatus = (index: number): string => {
        if (markedForReview.has(index)) return 'review';
        if (answers[index] !== undefined) return 'answered';
        return 'unanswered';
    };

    const toggleMarkForReview = () => {
        setMarkedForReview((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion)) {
                newSet.delete(currentQuestion);
            } else {
                newSet.add(currentQuestion);
            }
            return newSet;
        });
    };

    // useEffect(() => {
    //     const handleVisibilityChange = () => {
    //         if (document.hidden) {
    //             alert("Warning: You left the exam window!");
    //         }
    //     };
    //     document.addEventListener("visibilitychange", handleVisibilityChange);
    //     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    // }, []);


    const finishAssesment = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, finish it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (!id) {
                    setError('Assessment Not Found, Please try again later');
                    return;
                }
                assessmentFinish(id).then(() => {
                    setReviewDialog(true);
                    queryClient.invalidateQueries({ queryKey: ['assessmentReview', id] });
                    queryClient.invalidateQueries({ queryKey: ['courseModule'] });
                }).catch((error: string) => {
                    Swal.fire(
                        'Error!',
                        error,
                        'error'
                    )
                });
            }
        })
    }

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert title={error} type='danger' />
    }

    if (!assessment || isError) {
        return <Alert title="Assessment Not Found, Please try again later" type='danger' />
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <AssesmentHeader
                    title={assessment?.title}
                    timeLeft={timeLeft}
                    progress={(Object.keys(answers).length / assessment?.questions?.length) * 100}
                    onEndExam={finishAssesment}
                />
                {/* Main Content */}
                <div className="pt-28 pb-20 flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-semibold">Question {currentQuestion + 1}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Marks: {assessment?.questions?.[currentQuestion]?.marks ?? "N/A"}</span>
                                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => setShowReportDialog(true)}>
                                        <Flag />
                                        Report
                                    </Button>
                                </div>
                            </div>
                            <div className="mb-8">
                                <p className="text-lg mb-6">{assessment?.questions?.[currentQuestion]?.question ?? 'N/A'}</p>
                                {assessment?.questions?.[currentQuestion]?.question_type === 'MCQ' ||
                                    assessment?.questions?.[currentQuestion]?.question_type === 'TRUE/FALSE' ? (
                                    <RadioGroup
                                        value={answers[currentQuestion] !== undefined ? answers[currentQuestion].toString() : ""}
                                        className="space-y-4"
                                        onValueChange={(value: string) => handleAnswerChange(Number(value))}
                                    >
                                        {assessment?.questions[currentQuestion]?.options.map((option) => (
                                            <div key={option?.option_id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option?.option_id?.toString()} id={`option-${option?.option_id}`} />
                                                <Label htmlFor={`option-${option?.option_id}`}>{option?.option_statement}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <div className="space-y-4">
                                        {assessment?.questions?.[currentQuestion]?.options.map((option) => (
                                            <div key={option.option_id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`option-${option.option_id}`}
                                                    checked={(answers[currentQuestion] as number[] || []).includes(option.option_id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentAnswers = answers[currentQuestion] as number[] || [];
                                                        if (checked) {
                                                            handleAnswerChange([...currentAnswers, option.option_id]);
                                                        } else {
                                                            handleAnswerChange(currentAnswers.filter(id => id !== option.option_id));
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`option-${option.option_id}`}>{option.option_statement}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                    {/* Question Navigation */}
                    <QuestionPalette
                        questions={assessment?.questions}
                        answers={answers}
                        markedForReview={markedForReview}
                        setCurrentQuestion={setCurrentQuestion}
                        getQuestionStatus={getQuestionStatus}
                    />
                </div>
                {/* Bottom Action Bar */}
                <QuestionNavigation
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                    markedForReview={markedForReview}
                    toggleMarkForReview={toggleMarkForReview}
                    setAnswers={setAnswers}
                    questionsLength={assessment?.questions?.length ?? 0}
                    answersLength={Object.keys(answers).length}
                    finishAssesment={finishAssesment}
                    timeLeft={timeLeft}
                />
            </div>
            <Report
                show={showReportDialog}
                question={assessment?.questions?.[currentQuestion]?.question_id}
                onClose={() => setShowReportDialog(false)}
            />

            {reviewDialog && <Review
                show={reviewDialog}
                assessment_id={id || null}
                courseId={courseId || null}
                onClose={(value: boolean) => setReviewDialog(value)}
            />}
        </div>
    );
};

export default AssesmentAttempt;
