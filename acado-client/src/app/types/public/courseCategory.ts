export interface CourseCategory {
  id: number;
  name: string;
  organization_id: number;
  image?: string | null;
}

export interface CourseCategoryResponse {
  status: number;
  data: CourseCategory[];
  error: string;
}
