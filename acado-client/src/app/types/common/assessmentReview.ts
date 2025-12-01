export interface AssessmentReview {
    content_id: string;
    score: number;
    start_date: number;
    end_date: number;
    question_count: number;
    negative_marking: number;
    negative_marks: number;
    duration_in_minutes: number;
    total_attempts: number;
    attempt_count: number;
    time_taken: number;
    questions: ReviewQuestion[];
    error: any[];
}

export interface ReviewQuestion {
    question_id: number;
    question: string;
    question_type_id: number;
    marks: number;
    correct_options: string[];
    question_options: QuestionOption[];
    image: string | null;
    question_image: string[];
    question_type: string;
    is_correct: number;
    marks_obtained: number;
    attempt_state: number;
}

export interface QuestionOption {
    option_id: number;
    option_statement: string;
    user_answer: number;
}

export interface AssessmentReviewResponse {
    status: number;
    data: {
        assessment_review: AssessmentReview;
    };
}
