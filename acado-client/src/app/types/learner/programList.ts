export interface Program {
  id: number;
  short_code: string | null;
  certificate_id: number;
  g_score: number | null;
  is_global_program: number;
  registration_need_approval: number;
  name: string;
  level: string;
  description: string;
  image: string;
  start_date: number;
  end_date: number;
  category_id: number;
  created_by: number;
  regular_price: number | null;
  is_structured: number | null;
  is_competition: number | null;
  termination_days: number | null;
  sale_price: number | null;
  sis_ref_module_id: number | null;
  completion: number;
  score: string;
  organization: {
    id: number;
    name: string;
    organization_logo: string;
  }
}

export interface ProgramList {
  list: Program[];
}

export interface ProgramApiResponse {
  status: number;
  data: ProgramList;
  error: string[];
}
