import React from 'react';
import { Clock, CheckCircle, XCircle, Award, Target, TrendingUp, Calendar } from 'lucide-react';
import { AssessmentResult } from '@app/types/learning/assessment';

interface AssessmentScoreboardProps {
    result: AssessmentResult;
}

const AssessmentScoreboard: React.FC<AssessmentScoreboardProps> = ({ result }) => {
    const isPassed = result.overall_result === 'Pass';
    const scorePercentage = (result.overall_score / result.marks) * 100;
    const passingPercentage = (result.passing_marks / result.marks) * 100;
    const remainingAttempts = result.total_attempts - result.attempts_taken;

    // Format time taken
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    // Format date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Last Attempt Result
                </h2>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${isPassed ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                    {isPassed ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} />
                            <span>Passed</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <XCircle size={18} />
                            <span>Failed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Overall Score */}
                <div className="dark:bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                            <Award className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Overall Score</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {result.overall_score}
                        </span>
                        <span className="text-2xl text-gray-600 dark:text-gray-400">/ {result.marks}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {scorePercentage.toFixed(1)}% achieved
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 bg-white dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${isPassed ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${scorePercentage}%` }}
                        />
                    </div>
                </div>

                {/* Passing Marks */}
                <div className="dark:bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                            <Target className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Passing Criteria</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                            {result.passing_marks}
                        </span>
                        <span className="text-2xl text-gray-600 dark:text-gray-400">/ {result.marks}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {passingPercentage.toFixed(1)}% required to pass
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 bg-white dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-500"
                            style={{ width: `${passingPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Questions */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900 rounded">
                            <Target className="text-orange-600 dark:text-orange-400" size={16} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Questions</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {result.question_count}
                    </div>
                </div>

                {/* Time Taken */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded">
                            <Clock className="text-indigo-600 dark:text-indigo-400" size={16} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Time Taken</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatTime(result.time_taken_seconds)}
                    </div>
                </div>

                {/* Attempts */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-teal-100 dark:bg-teal-900 rounded">
                            <TrendingUp className="text-teal-600 dark:text-teal-400" size={16} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Attempts</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {result.attempts_taken} / {result.total_attempts}
                    </div>
                    {remainingAttempts > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {remainingAttempts} remaining
                        </div>
                    )}
                </div>

                {/* Duration */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-pink-100 dark:bg-pink-900 rounded">
                            <Calendar className="text-pink-600 dark:text-pink-400" size={16} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Valid Till</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatDate(result.end_date)}
                    </div>
                </div>
            </div>

            {/* Message */}
            {!isPassed && remainingAttempts > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Note:</strong> You have {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining.
                        Review your answers and try again to improve your score.
                    </p>
                </div>
            )}

            {isPassed && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Congratulations!</strong> You have successfully passed this assessment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AssessmentScoreboard;
