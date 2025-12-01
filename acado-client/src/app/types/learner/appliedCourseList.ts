// Define the main response structure
export interface ApiResponse {
  status: number;
  data: Course[];
  page: Pagination;
  error: string;
}

// Define the structure of a single course
export interface Course {
  ID: number;
  json: CourseDetails;
  price_to_sort: number;
  is_sale: number;
  post_author: number;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_status: string;
  post_name: string;
  menu_order: number;
  lang: null | string;
  university_name: string;
  university_image_id: string;
  university_image_url: string;
}

// Define the structure of course details
export interface CourseDetails {
  ID: number;
  post_author: string;
  post_date_gmt: string;
  post_title: string;
  post_status: string;
  post_name: string;
  price_to_sort: number;
  is_sale: number;
  lang: null | string;
  author: Author;
  meta_data: MetaData;
  image_url: string;
  permalink: string;
  categories: Category[];
  post_excerpt: string;
  first_item_id: number;
  total_items: TotalItems;
  sections_items: SectionItem[];
}

// Define the structure of the author
export interface Author {
  ID: string;
  user_login: number;
  user_nicename: string;
  user_email: string;
  user_url: null | string;
  user_register: string;
  display_name: string;
  meta_data: Record<string, unknown>;
  image_url: string;
}

// Define the structure of metadata
export interface MetaData {
  _lp_duration: string;
  _lp_block_expire_duration: string;
  _lp_block_finished: string;
  _lp_allow_course_repurchase: string;
  _lp_course_repurchase_option: string;
  _lp_level: string;
  _lp_students: string | number;
  _lp_max_students: string;
  _lp_retake_count: string;
  _lp_has_finish: string;
  _lp_featured: string;
  _lp_featured_review: string;
  _lp_external_link_buy_course: string;
  _lp_regular_price: string;
  _lp_sale_price: string;
  _lp_sale_start: boolean;
  _lp_sale_end: boolean;
  _lp_no_required_enroll: string;
  _lp_requirements: unknown[];
  _lp_target_audiences: unknown[];
  _lp_key_features: unknown[];
  _lp_faqs: [string, string][];
  _lp_course_result: string;
  _lp_passing_condition: number;
  post_author: string;
  _lp_course_material: null | unknown;
  _lp_final_quiz: number;
}

// Define the structure of a category
export interface Category {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  term_taxonomy_id: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
}

// Define the structure of total items
export interface TotalItems {
  count_items: string;
  lp_lesson: string;
  lp_quiz: string;
}

// Define the structure of a section item
export interface SectionItem {
  id: string;
  section_id: string;
  order: string;
  section_order: string;
  title: string;
  section_name: string;
  description: string;
  section_description: string;
  items: Lesson[];
}

// Define the structure of a lesson
export interface Lesson {
  id: string;
  order: string;
  type: string;
  title: string;
  preview: boolean;
}

// Define the structure of pagination
export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  next_page_url: null | string;
  prev_page_url: null | string;
  from: number;
  to: number;
}