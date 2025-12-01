import React, { useState } from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

interface QuestionNavigationProps {
    currentQuestion: number;
    setCurrentQuestion: (questionIndex: number) => void;
    markedForReview: Set<number>;
    toggleMarkForReview: () => void;
    setAnswers: React.Dispatch<React.SetStateAction<Record<number, number | number[]>>>;
    questionsLength: number;
    finishAssesment: () => void;
    timeLeft: number;
    answersLength: number;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
    currentQuestion,
    setCurrentQuestion,
    markedForReview,
    toggleMarkForReview,
    setAnswers,
    questionsLength,
    finishAssesment,
    timeLeft,
    answersLength,
}) => {

    const [onLastQuestion, setOnLastQuestion] = useState<boolean>(false);

    const nextQuestion = () => {
        if (currentQuestion === questionsLength - 1) {
            setOnLastQuestion(true);
        } else {
            setCurrentQuestion(Math.min(questionsLength - 1, currentQuestion + 1));
        }
    }

    const finishAssesmentExam = () => {
        setOnLastQuestion(false);
        finishAssesment();
    }

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black border-t p-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Previous Button */}
                <Button
                    disabled={currentQuestion === 0}
                    className="text-white dark:text-black"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                >
                    <ChevronLeft />
                    Previous
                </Button>

                {/* Middle Actions */}
                <div className="flex items-center gap-4">
                    {/* Mark for Review */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="mark-review"
                            checked={markedForReview.has(currentQuestion)}
                            onCheckedChange={toggleMarkForReview}
                        />
                        <Label htmlFor="mark-review">Mark for Review</Label>
                    </div>
                    {/* Clear Response */}
                    <Button
                        variant="outline"
                        className="text-primary"
                        onClick={() => {
                            setAnswers(prev => {
                                const newAnswers = { ...prev };
                                delete newAnswers[currentQuestion];
                                return newAnswers;
                            });
                        }}
                    >
                        Clear Response
                    </Button>
                </div>
                {/* Next Button */}
                <Button
                    // disabled={currentQuestion === questionsLength - 1}
                    className="text-white dark:text-black"
                    // onClick={() => setCurrentQuestion(Math.min(questionsLength - 1, currentQuestion + 1))}
                    onClick={nextQuestion}
                >
                    Next
                    <ChevronRight />
                </Button>
            </div>
            <Dialog open={onLastQuestion} onOpenChange={setOnLastQuestion}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {`It's`} the last question
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to submit the assessment?
                    </DialogDescription>
                    <div>

                        {
                            timeLeft > 0 && (
                                <p className="text-left text-sm text-gray-700 dark:text-gray-300">
                                    You still have <span className="text-black font-bold italic">{formatTime(timeLeft)}</span> seconds left
                                </p>
                            )
                        }

                        <div className="space-y-2 mb-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#20b2aa] rounded"></div>
                                <span>Answered</span>
                                <span className="ml-auto">{answersLength}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                <span>Not Answered</span>
                                <span className="ml-auto">{questionsLength - answersLength}</span>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOnLastQuestion(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="text-white dark:text-black"
                            onClick={finishAssesmentExam}
                        >
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div >
    );
};

export default QuestionNavigation;