import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchAssessmentReview } from '@services/public/AssessmentReviewService';
import { useAssessmentReviewStore } from '@app/store/public/assessmentReviewStore';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AssessmentReviewPage() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const { setAssessmentReview, assessmentReview, setError: setDetailsError, setIsLoading: setDetailsLoading } = useAssessmentReviewStore();
  const location = useLocation();
  const assessmentDetails = location.state?.program_content_id;

  useEffect(() => {
    const fetchAssessmentReviewData = async () => {
      setDetailsLoading(true);
      setDetailsError('question load error');
      try {
        const reviewData = await fetchAssessmentReview(assessmentDetails?.program_content_id);
        setAssessmentReview(reviewData);
        console.log('fetch assessment question', reviewData);
      } catch (err) {
        setDetailsError('Failed to load event details.');
        console.error('Error fetching assessment review:', err);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchAssessmentReviewData();
  }, [assessmentDetails?.program_content_id, setAssessmentReview, setDetailsLoading, setDetailsError]);

  // Calculate stats like percentage and correct answers
  // const stats = {
  //   percentage: (assessmentReview?.score ?? 0 / 100) * 100,
  //   correct: assessmentReview?.questions?.filter((question) => question.correct_options[0] === question.question?.is_correct).length ?? 0,
  //   total: assessmentReview?.questions?.length ?? 0
  // };
  const stats = {
    percentage: (assessmentReview?.score ?? 0) / 100 * 100,
    correct: assessmentReview?.questions?.filter((question) => {

      return question.correct_options[0] === (question.is_correct ? 'true' : 'false');
    }).length ?? 0,
    total: assessmentReview?.questions?.length ?? 0
  };


  // Calculate skipped count
  // const skippedCount = assessmentReview?.questions?.filter((question) => question.attempt_state === 0).length ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 dark:text-primary text-primary">Assessment Review</h1>
      <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg mb-6">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-4 dark:text-primary text-primary">{assessmentDetails?.title ?? ''}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold">{assessmentReview?.score ?? 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-2xl font-bold">{stats.percentage?.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold">{stats.correct}/{stats.total}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Attempted</p>
              <p className="text-2xl font-bold">{assessmentReview?.attempt_count}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-primary text-primary">Question Review</h2>
          <div className="space-y-4">
            {assessmentReview?.questions && assessmentReview.questions.map((question, index) => {
              const userAnswer = question?.question_options[index]?.user_answer ?? 1;
              const isCorrect = question?.correct_options?.includes(userAnswer.toString());
              const isExpanded = expandedQuestion === question?.question_id;

              return (
                <div key={question.question_id} className="border rounded-lg">
                  <div
                    className="p-4 flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedQuestion(isExpanded ? null : question.question_id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Q{question.question_id}</span>
                        {userAnswer !== undefined && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isCorrect ? (
                              <Check className="w-3 h-3 mr-1" />
                            ) : (
                              <X className="w-3 h-3 mr-1" />
                            )}
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </div>
                      <p className="font-medium">{question?.question}</p>
                    </div>
                    <button
                      className="ml-4 text-gray-500 hover:text-gray-700"
                      aria-label={isExpanded ? "Collapse question details" : "Expand question details"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 space-y-3">
                        {question?.question_options && question?.question_options.map((option, index) => {
                          const isSelected = userAnswer === index + 1;
                          const isCorrectOption = question.correct_options.includes((index + 1).toString());

                          return (
                            <div
                              key={index}
                              className={`p-3 rounded-lg ${isCorrectOption ? 'bg-green-50 border border-green-200' :
                                isSelected ? 'bg-red-50 border border-red-200' :
                                  'bg-gray-50 border border-gray-200'
                                }`}
                            >
                              <div className="flex items-center">
                                <span className="flex-1">{option.option_statement}</span>
                                {isCorrectOption && (
                                  <Check className="w-4 h-4 text-green-600" />
                                )}
                                {isSelected && !isCorrectOption && (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Explanation:</p>
                          <p className="mt-1 text-sm text-gray-600">No explanation available.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
