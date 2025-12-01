import axiosInstance from '@/lib/axios';

export interface Portfolio {
  id: string;
  userId: string;
  about?: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  publications: Publication[];
  languages: Language[];
  volunteering: Volunteering[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
  category?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  url?: string;
  technologies?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  publishDate: string;
  url?: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export const portfolioApi = {
  // Get portfolio
  getMyPortfolio: async (): Promise<Portfolio> => {
    const response = await axiosInstance.get('/portfolio/me');
    return response.data;
  },

  getPortfolioByUserId: async (userId: string): Promise<Portfolio> => {
    const response = await axiosInstance.get(`/portfolio/${userId}`);
    return response.data;
  },

  // Update about section
  updateAbout: async (about: string): Promise<Portfolio> => {
    const response = await axiosInstance.patch('/portfolio/me/about', { about });
    return response.data;
  },

  // Skills
  addSkill: async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
    const response = await axiosInstance.post('/portfolio/me/skills', skill);
    return response.data;
  },

  updateSkill: async (skillId: string, skill: Partial<Omit<Skill, 'id'>>): Promise<Skill> => {
    const response = await axiosInstance.put(`/portfolio/me/skills/${skillId}`, skill);
    return response.data;
  },

  deleteSkill: async (skillId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/skills/${skillId}`);
    return response.data;
  },

  // Education
  addEducation: async (education: Omit<Education, 'id'>): Promise<Education> => {
    const response = await axiosInstance.post('/portfolio/me/education', education);
    return response.data;
  },

  updateEducation: async (educationId: string, education: Partial<Omit<Education, 'id'>>): Promise<Education> => {
    const response = await axiosInstance.put(`/portfolio/me/education/${educationId}`, education);
    return response.data;
  },

  deleteEducation: async (educationId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/education/${educationId}`);
    return response.data;
  },

  // Experience
  addExperience: async (experience: Omit<Experience, 'id'>): Promise<Experience> => {
    const response = await axiosInstance.post('/portfolio/me/experience', experience);
    return response.data;
  },

  updateExperience: async (experienceId: string, experience: Partial<Omit<Experience, 'id'>>): Promise<Experience> => {
    const response = await axiosInstance.put(`/portfolio/me/experience/${experienceId}`, experience);
    return response.data;
  },

  deleteExperience: async (experienceId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/experience/${experienceId}`);
    return response.data;
  },

  // Projects
  addProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const response = await axiosInstance.post('/portfolio/me/projects', project);
    return response.data;
  },

  updateProject: async (projectId: string, project: Partial<Omit<Project, 'id'>>): Promise<Project> => {
    const response = await axiosInstance.put(`/portfolio/me/projects/${projectId}`, project);
    return response.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/projects/${projectId}`);
    return response.data;
  },

  // Certifications
  addCertification: async (certification: Omit<Certification, 'id'>): Promise<Certification> => {
    const response = await axiosInstance.post('/portfolio/me/certifications', certification);
    return response.data;
  },

  updateCertification: async (certificationId: string, certification: Partial<Omit<Certification, 'id'>>): Promise<Certification> => {
    const response = await axiosInstance.put(`/portfolio/me/certifications/${certificationId}`, certification);
    return response.data;
  },

  deleteCertification: async (certificationId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/certifications/${certificationId}`);
    return response.data;
  },

  // Publications
  addPublication: async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
    const response = await axiosInstance.post('/portfolio/me/publications', publication);
    return response.data;
  },

  updatePublication: async (publicationId: string, publication: Partial<Omit<Publication, 'id'>>): Promise<Publication> => {
    const response = await axiosInstance.put(`/portfolio/me/publications/${publicationId}`, publication);
    return response.data;
  },

  deletePublication: async (publicationId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/publications/${publicationId}`);
    return response.data;
  },

  // Languages
  addLanguage: async (language: Omit<Language, 'id'>): Promise<Language> => {
    const response = await axiosInstance.post('/portfolio/me/languages', language);
    return response.data;
  },

  updateLanguage: async (languageId: string, language: Partial<Omit<Language, 'id'>>): Promise<Language> => {
    const response = await axiosInstance.put(`/portfolio/me/languages/${languageId}`, language);
    return response.data;
  },

  deleteLanguage: async (languageId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/languages/${languageId}`);
    return response.data;
  },

  // Volunteering
  addVolunteering: async (volunteering: Omit<Volunteering, 'id'>): Promise<Volunteering> => {
    const response = await axiosInstance.post('/portfolio/me/volunteering', volunteering);
    return response.data;
  },

  updateVolunteering: async (volunteeringId: string, volunteering: Partial<Omit<Volunteering, 'id'>>): Promise<Volunteering> => {
    const response = await axiosInstance.put(`/portfolio/me/volunteering/${volunteeringId}`, volunteering);
    return response.data;
  },

  deleteVolunteering: async (volunteeringId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/portfolio/me/volunteering/${volunteeringId}`);
    return response.data;
  },
};

