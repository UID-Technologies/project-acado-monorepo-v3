import React from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Progress } from "@/components/ui/shadcn/progress";

interface AssesmentHeaderProps {
    title: string;
    timeLeft: number;
    progress: number;
    onEndExam: () => void;
}

const AssesmentHeader: React.FC<AssesmentHeaderProps> = ({ title, timeLeft, progress, onEndExam }) => {

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black shadow-md z-40 p-4">
            <div className="flex items-center justify-between max-w-[1440px] mx-auto">
                <h1 className="text-xl font-bold">{title}</h1>
                <div className="text-2xl font-mono bg-gray-100 dark:bg-gray-900 px-6 py-2 rounded-lg">
                    {formatTime(timeLeft)}
                </div>
                <Button variant="destructive" className="text-white" onClick={onEndExam}>End Exam</Button>
            </div>
            <Progress value={progress} className="mt-4 dark:bg-gray-800 bg-gray-100" />
        </header>
    );
};

export default AssesmentHeader;
``
