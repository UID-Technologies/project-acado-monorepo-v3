export interface AssessmentOption {
    option_id: number;
    option_statement: string;
    attempted: number;
  }
  
  export interface AssessmentQuestion {
    question_id: number;
    question: string;
    question_image: any[];
    question_type: string;
    question_type_id: number;
    response_medium: string;
    negative_marks: number;
    marks: number;
    attempted: number;
    difficulty_level: string;
    time_taken: number;
    options: AssessmentOption[];
  }
  
  export interface AssessmentDetails {
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    maximum_marks: number;
    passing_marks: number;
    question_count: number;
    negative_marking: number;
    negative_marks: number;
    total_attempts: number;
    attempt_count: number;
    duration_in_minutes: number;
    questions: AssessmentQuestion[];
  }
  
  export interface AssessmentData {
    assessment_details: AssessmentDetails;
  }
  
  export interface AssessmentResponse {
    status: number;
    data: AssessmentData;
    error: any[];
  }
  