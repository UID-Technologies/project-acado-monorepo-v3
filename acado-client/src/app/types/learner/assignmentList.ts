export interface  Learner {
    id: number;
    name: string;
    image: string | null;
    email: string;
    status: string | null;
  }
  
  export interface AssignmentList {
    content_id: number;
    title: string;
    description: string;
    start_date: number;
    end_date: number;
    maximum_marks: number;
    allow_multiple: number;
    is_graded: number;
    submission_mode: number;
    content_type: string;
    language_id: number;
    module_id: number;
    score: number | null;
    total_attempts: number;
    learners: Learner[];
    file: string;
  }
  
  export interface AssignmentResponse {
    status: number;
    data: {
      list: AssignmentList[];
    };
    error: any[];
  }
  
 