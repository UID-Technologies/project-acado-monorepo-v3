export interface Skill {
    id: number;
    short_code: string | null;
    name: string;
    image: string | null;
    description: string;
    start_date: string;
    end_date: string;
    duration: number | null;
  }
  
  export interface ModuleList {
    id: number;
    skill_id: number;
    name: string;
    image: string;
    start_date: number;
    end_date: number;
    description: string;
    duration_in_days: number;
    total_coins: number | null;
    completion: number;
    url: string;
    notes: number;
    videos: number;
    sessions: number;
    assessments: number;
    assignments: number;
    polls: number;
    surveys: number;
    scorms: number;
  }
  
 export interface SkillList {
    id: string;
    name: string;
    short_code: string;
    start_date: number;
    end_date: number;
    description: string;
    duration_in_days: number;
    image: string;
    completion: number;
    total_coins: number | null;
    score: string;
    modules: ModuleList[];
    total_modules: number;
  }
  
  export interface ModuleData {
    skills: Record<string, Skill>;
    list: SkillList[];
  }
  
  export interface ModuleListResponse {
    status: number;
    data: ModuleData;
    error: any[];
  }
  

  