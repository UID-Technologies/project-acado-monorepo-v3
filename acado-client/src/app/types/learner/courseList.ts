export interface CourseList {
    id: number;
    organization_id: number;
    name: string;
    description: string;
    category_id: number;
    category_name: string;
    regular_price: number | null;
    sale_price: number | null;
    admission_start_date: number;
    admission_end_date: number;
    type: string | null;
    start_date: number;
    end_date: number;
    image: string;
    duration: string;
    contents: string;
    total_coins: number | null;
    subscription_type: string | null;
    is_subscribed: boolean;
    is_structured: boolean | null;
    is_competition: boolean | null;
    termination_days: number | null;
    trainer: string;
    enrolment_count: number;
    total_view: number | null;
    completion_per: number;
    g_score: number | null;
  }
  
  export interface CourseListData {
    programs: CourseList[];
  }
  
  export interface CourseListResponse{
    status: number;
    data: CourseListData;
    error: any[];
  }
  