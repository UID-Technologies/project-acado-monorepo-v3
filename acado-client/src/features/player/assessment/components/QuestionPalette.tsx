import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Question } from "@app/types/learning/assessment";

interface QuestionPaletteProps {
    questions: Question[];
    answers: Record<number, number | number[]>;
    markedForReview: Set<number>;
    setCurrentQuestion: (index: number) => void;
    getQuestionStatus: (index: number) => string;
}

const QuestionPalette: React.FC<QuestionPaletteProps> = ({
    questions,
    answers,
    markedForReview,
    setCurrentQuestion,
    getQuestionStatus,
}) => {
    return (
        <div className="w-80">
            <Card className="p-4 sticky top-28">
                <h3 className="text-lg font-semibold mb-4">Question Palette</h3>
                <div className="grid grid-cols-5 gap-2 mb-6">
                    {questions && questions?.map((_, index) => (
                        <Button
                            key={index}
                            className={`h-10 w-10 text-white ${getQuestionStatus(index) === "answered" ? "bg-[#20b2aa] hover:bg-[#20b2aa]/70" : getQuestionStatus(index) === "review" ? " hover:bg-[#f19e2a]/70 bg-[#f19e2a]" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 "}`}
                            onClick={() => setCurrentQuestion(index)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#20b2aa] rounded"></div>
                        <span>Answered</span>
                        <span className="ml-auto">{Object.keys(answers).length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f19e2a] rounded"></div>
                        <span>Marked for Review</span>
                        <span className="ml-auto">{markedForReview.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span>Not Answered</span>
                        <span className="ml-auto">{questions?.length - Object.keys(answers)?.length}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default QuestionPalette;
