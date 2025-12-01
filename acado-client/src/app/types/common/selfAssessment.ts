export interface SelfAssessmentResponse {
    status: number;
    data: SelfAssessmentData;
  }
  
  export interface SelfAssessmentData {
    list: AssessmentList[];
    category: Category;
  }
  
  export interface AssessmentList {
    id: number;
    title: string;
    description: string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    status: string;
    parent_id: number;
    category_id: number;
    content_type: string;
    resource_path: string;
    language: string;
    tag: string | null;
    total_likes: number | null;
    program_content_id: number;
    start_date: number;
    end_date: number;
    is_multilingual: number;
    visibility_value: number;
    visibility: number;
    multi_file_uploads: string[];
    multiple_file_upload: string | null;
    view_count: number;
    like_count: number;
    comment_count: number;
    is_featured: number;
    user_like_trackings_id: number | null;
    action_url: string | null;
    youtube_url: string;
    multi_file_uploads_count: any[]; 
    thumbnail_url: string;
    user_liked: number;
    is_attempt: number;
    user_submitted_file: string;
    user_submitted_multiple_file: string[];
  }
  
  export interface Category {
    id: number;
    title: string;
    description: string;
    image: string;
    parent_id: number;
    user_mapping_id: number;
    total_user_joined: number;
  }
  