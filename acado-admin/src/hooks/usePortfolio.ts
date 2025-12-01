import { useState, useEffect } from 'react';
import { Portfolio, Experience, Education, Project, Certification, Publication, Volunteering, Skill, Language } from '@/types/portfolio';
import { portfolioApi } from '@/api';

const initialPortfolio: Portfolio = {
  id: '1',
  userId: '1',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  about: '',
  profileImage: '',
  socialLinks: {},
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  publications: [],
  volunteering: [],
  skills: [],
  languages: [],
  resumes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const data = await portfolioApi.getMyPortfolio();
        setPortfolio(data as unknown as Portfolio);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch portfolio:', err);
        // Fallback to initial portfolio on error
        setPortfolio(initialPortfolio);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const updateBasicInfo = async (info: Partial<Portfolio>) => {
    try {
      // Update portfolio with basic info
      const updated = { ...portfolio, ...info };
      setPortfolio(updated);
      // API call would be made here when backend is ready
    } catch (err) {
      console.error('Failed to update basic info:', err);
      throw err;
    }
  };

  const updateAbout = async (about: string) => {
    try {
      await portfolioApi.updateAbout(about);
      setPortfolio(prev => ({ ...prev, about }));
    } catch (err) {
      console.error('Failed to update about:', err);
      throw err;
    }
  };

  // Experience methods
  const addExperience = async (experience: Omit<Experience, 'id'>) => {
    try {
      const newExperience = await portfolioApi.addExperience(experience as any);
      setPortfolio(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience as unknown as Experience],
      }));
    } catch (err) {
      console.error('Failed to add experience:', err);
      throw err;
    }
  };

  const updateExperience = async (id: string, experience: Partial<Experience>) => {
    try {
      await portfolioApi.updateExperience(id, experience as any);
      setPortfolio(prev => ({
        ...prev,
        experience: prev.experience.map(exp =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      }));
    } catch (err) {
      console.error('Failed to update experience:', err);
      throw err;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await portfolioApi.deleteExperience(id);
      setPortfolio(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete experience:', err);
      throw err;
    }
  };

  // Education methods
  const addEducation = async (education: Omit<Education, 'id'>) => {
    try {
      const newEducation = await portfolioApi.addEducation(education as any);
      setPortfolio(prev => ({
        ...prev,
        education: [...prev.education, newEducation as unknown as Education],
      }));
    } catch (err) {
      console.error('Failed to add education:', err);
      throw err;
    }
  };

  const updateEducation = async (id: string, education: Partial<Education>) => {
    try {
      await portfolioApi.updateEducation(id, education as any);
      setPortfolio(prev => ({
        ...prev,
        education: prev.education.map(edu =>
          edu.id === id ? { ...edu, ...education } : edu
        ),
      }));
    } catch (err) {
      console.error('Failed to update education:', err);
      throw err;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id);
      setPortfolio(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete education:', err);
      throw err;
    }
  };

  // Projects methods
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const newProject = await portfolioApi.addProject(project as any);
      setPortfolio(prev => ({
        ...prev,
        projects: [...prev.projects, newProject as unknown as Project],
      }));
    } catch (err) {
      console.error('Failed to add project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      await portfolioApi.updateProject(id, project as any);
      setPortfolio(prev => ({
        ...prev,
        projects: prev.projects.map(proj =>
          proj.id === id ? { ...proj, ...project } : proj
        ),
      }));
    } catch (err) {
      console.error('Failed to update project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await portfolioApi.deleteProject(id);
      setPortfolio(prev => ({
        ...prev,
        projects: prev.projects.filter(proj => proj.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete project:', err);
      throw err;
    }
  };

  // Skills methods
  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    try {
      const newSkill = await portfolioApi.addSkill(skill as any);
      setPortfolio(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill as unknown as Skill],
      }));
    } catch (err) {
      console.error('Failed to add skill:', err);
      throw err;
    }
  };

  const updateSkill = async (id: string, skill: Partial<Skill>) => {
    try {
      await portfolioApi.updateSkill(id, skill as any);
      setPortfolio(prev => ({
        ...prev,
        skills: prev.skills.map(s =>
          s.id === id ? { ...s, ...skill } : s
        ),
      }));
    } catch (err) {
      console.error('Failed to update skill:', err);
      throw err;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await portfolioApi.deleteSkill(id);
      setPortfolio(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete skill:', err);
      throw err;
    }
  };

  // Certifications methods
  const addCertification = async (certification: Omit<Certification, 'id'>) => {
    try {
      const newCertification = await portfolioApi.addCertification(certification as any);
      setPortfolio(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification as unknown as Certification],
      }));
    } catch (err) {
      console.error('Failed to add certification:', err);
      throw err;
    }
  };

  const updateCertification = async (id: string, certification: Partial<Certification>) => {
    try {
      await portfolioApi.updateCertification(id, certification as any);
      setPortfolio(prev => ({
        ...prev,
        certifications: prev.certifications.map(cert =>
          cert.id === id ? { ...cert, ...certification } : cert
        ),
      }));
    } catch (err) {
      console.error('Failed to update certification:', err);
      throw err;
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      await portfolioApi.deleteCertification(id);
      setPortfolio(prev => ({
        ...prev,
        certifications: prev.certifications.filter(cert => cert.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete certification:', err);
      throw err;
    }
  };

  // Publications methods
  const addPublication = async (publication: Omit<Publication, 'id'>) => {
    try {
      const newPublication = await portfolioApi.addPublication(publication as any);
      setPortfolio(prev => ({
        ...prev,
        publications: [...prev.publications, newPublication as unknown as Publication],
      }));
    } catch (err) {
      console.error('Failed to add publication:', err);
      throw err;
    }
  };

  const updatePublication = async (id: string, publication: Partial<Publication>) => {
    try {
      await portfolioApi.updatePublication(id, publication as any);
      setPortfolio(prev => ({
        ...prev,
        publications: prev.publications.map(pub =>
          pub.id === id ? { ...pub, ...publication } : pub
        ),
      }));
    } catch (err) {
      console.error('Failed to update publication:', err);
      throw err;
    }
  };

  const deletePublication = async (id: string) => {
    try {
      await portfolioApi.deletePublication(id);
      setPortfolio(prev => ({
        ...prev,
        publications: prev.publications.filter(pub => pub.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete publication:', err);
      throw err;
    }
  };

  // Volunteering methods
  const addVolunteering = async (volunteering: Omit<Volunteering, 'id'>) => {
    try {
      const newVolunteering = await portfolioApi.addVolunteering(volunteering as any);
      setPortfolio(prev => ({
        ...prev,
        volunteering: [...prev.volunteering, newVolunteering as unknown as Volunteering],
      }));
    } catch (err) {
      console.error('Failed to add volunteering:', err);
      throw err;
    }
  };

  const updateVolunteering = async (id: string, volunteering: Partial<Volunteering>) => {
    try {
      await portfolioApi.updateVolunteering(id, volunteering as any);
      setPortfolio(prev => ({
        ...prev,
        volunteering: prev.volunteering.map(vol =>
          vol.id === id ? { ...vol, ...volunteering } : vol
        ),
      }));
    } catch (err) {
      console.error('Failed to update volunteering:', err);
      throw err;
    }
  };

  const deleteVolunteering = async (id: string) => {
    try {
      await portfolioApi.deleteVolunteering(id);
      setPortfolio(prev => ({
        ...prev,
        volunteering: prev.volunteering.filter(vol => vol.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete volunteering:', err);
      throw err;
    }
  };

  // Languages methods
  const addLanguage = async (language: Omit<Language, 'id'>) => {
    try {
      const newLanguage = await portfolioApi.addLanguage(language as any);
      setPortfolio(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage as unknown as Language],
      }));
    } catch (err) {
      console.error('Failed to add language:', err);
      throw err;
    }
  };

  const updateLanguage = async (id: string, language: Partial<Language>) => {
    try {
      await portfolioApi.updateLanguage(id, language as any);
      setPortfolio(prev => ({
        ...prev,
        languages: prev.languages.map(lang =>
          lang.id === id ? { ...lang, ...language } : lang
        ),
      }));
    } catch (err) {
      console.error('Failed to update language:', err);
      throw err;
    }
  };

  const deleteLanguage = async (id: string) => {
    try {
      await portfolioApi.deleteLanguage(id);
      setPortfolio(prev => ({
        ...prev,
        languages: prev.languages.filter(lang => lang.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete language:', err);
      throw err;
    }
  };

  const exportPortfolio = () => {
    const dataStr = JSON.stringify(portfolio, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `portfolio_${portfolio.firstName}_${portfolio.lastName}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    portfolio,
    isLoading,
    error,
    updateBasicInfo,
    updateAbout,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addPublication,
    updatePublication,
    deletePublication,
    addVolunteering,
    updateVolunteering,
    deleteVolunteering,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    exportPortfolio,
  };
};