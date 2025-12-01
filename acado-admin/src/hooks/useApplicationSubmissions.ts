import { useState, useEffect } from 'react';
import { useApplicationProcess, MatchingCriterion } from './useApplicationProcess';
import { applicationsApi } from '@/api';
import { toast } from 'sonner';

export interface ApplicationSubmission {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  courseId: string;
  courseName: string;
  universityId: string;
  universityName: string;
  formId: string;
  formData: Record<string, any>;
  matchScore: number;
  matchDetails: MatchDetail[];
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'waitlisted';
  submittedAt: Date;
  lastUpdated: Date;
  documents: ApplicationDocument[];
}

export interface MatchDetail {
  criteriaId: string;
  fieldName: string;
  type: 'required' | 'weighted' | 'preferred';
  matched: boolean;
  score: number;
  maxScore: number;
  actualValue: any;
  expectedValue: any;
  reason?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: Date;
  status: 'pending' | 'verified' | 'rejected';
}

export interface ApplicationStats {
  totalApplications: number;
  byStatus: Record<string, number>;
  byCourse: Record<string, number>;
  averageMatchScore: number;
  highMatchCount: number; // Applications with score > 80%
  mediumMatchCount: number; // Applications with score 50-80%
  lowMatchCount: number; // Applications with score < 50%
}

export const useApplicationSubmissions = () => {
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    totalApplications: 0,
    byStatus: {},
    byCourse: {},
    averageMatchScore: 0,
    highMatchCount: 0,
    mediumMatchCount: 0,
    lowMatchCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getCriteriaByCoursId } = useApplicationProcess();

  // Calculate match score function (needs to be defined before loadApplications uses it)
  const calculateMatchScore = (formData: Record<string, any>, courseId: string): { score: number; details: MatchDetail[] } => {
    const criteriaConfig = getCriteriaByCoursId(courseId);
    
    if (!criteriaConfig || !criteriaConfig.criteria.length) {
      // No criteria configured, return default score
      return { score: 75, details: [] };
    }

    let totalScore = 0;
    let maxPossibleScore = 0;
    const details: MatchDetail[] = [];

    criteriaConfig.criteria.forEach((criterion: MatchingCriterion) => {
      const fieldValue = formData[criterion.fieldName];
      let matched = false;
      let score = 0;
      const maxScore = criterion.weight;

      // Simple matching logic - can be enhanced based on field type
      if (criterion.type === 'required') {
        matched = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        score = matched ? maxScore : 0;
      } else if (criterion.type === 'weighted') {
        // For weighted criteria, check if value meets conditions
        matched = criterion.conditions?.some((condition: any) => {
          if (condition.operator === 'equals') {
            return fieldValue == condition.value;
          } else if (condition.operator === 'contains') {
            return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
          } else if (condition.operator === 'greater_than') {
            return Number(fieldValue) > Number(condition.value);
          }
          return false;
        }) || false;
        score = matched ? maxScore * (criterion.weight / 100) : 0;
      } else if (criterion.type === 'preferred') {
        // Preferred criteria get partial score
        matched = criterion.conditions?.some((condition: any) => {
          if (condition.operator === 'equals') {
            return fieldValue == condition.value;
          }
          return false;
        }) || false;
        score = matched ? maxScore * 0.5 : 0;
      }

      totalScore += score;
      maxPossibleScore += maxScore;

      details.push({
        criteriaId: criterion.id,
        fieldName: criterion.fieldName,
        type: criterion.type,
        matched,
        score,
        maxScore,
        actualValue: fieldValue || 'Not provided',
        expectedValue: criterion.conditions?.map((c: any) => `${c.operator} ${c.value}`).join(' OR ') || '',
        reason: matched ? 'Criteria met' : 'Criteria not met'
      });
    });

    const finalScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    return { score: finalScore, details };
  };

  // Load applications from API
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch applications from API with enrichment enabled
      const response = await applicationsApi.getApplications({ enrich: true });
      const appsData = response.applications || [];
      
      // Transform backend applications to frontend format
      const parsedApps = appsData.map((app: any) => {
        const formData = app.formData || {};
        
        // Calculate match score if courseId exists
        let matchScore = 0;
        let matchDetails: MatchDetail[] = [];
        if (app.courseId) {
          const matchResult = calculateMatchScore(formData, app.courseId);
          matchScore = matchResult.score;
          matchDetails = matchResult.details;
        }
        
        // Extract applicant info - prefer enriched data from backend, fallback to formData
        const applicantName = app.applicantName || 
          formData.name || 
          formData.fullName || 
          formData['Full Name'] || 
          (formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : null) ||
          app.userId || 
          'Unknown';
        const applicantEmail = app.applicantEmail || 
          formData.email || 
          formData['Email Address'] || 
          formData.emailAddress || '';
        const applicantPhone = app.applicantPhone || 
          formData.phone || 
          formData.phoneNumber || 
          formData['Phone Number'] || 
          formData.mobile || '';
        
        return {
          id: app.id || '',
          applicantName: applicantName || 'Unknown',
          applicantEmail: applicantEmail || '',
          applicantPhone: applicantPhone || '',
          courseId: app.courseId || '',
          courseName: app.courseName || '',
          universityId: app.universityId || '',
          universityName: app.universityName || '',
          formId: app.formId || '',
          formData: formData,
          matchScore: matchScore || app.matchScore || 0,
          matchDetails: matchDetails || app.matchDetails || [],
          status: (app.status || 'submitted') as ApplicationSubmission['status'],
          submittedAt: app.submittedAt ? new Date(app.submittedAt) : (app.createdAt ? new Date(app.createdAt) : new Date()),
          lastUpdated: app.updatedAt ? new Date(app.updatedAt) : (app.createdAt ? new Date(app.createdAt) : new Date()),
          documents: app.attachments?.map((att: any) => ({
            id: att.fieldName || '',
            name: att.fileName || '',
            url: att.fileUrl || '',
            size: '',
            type: '',
            uploadedAt: att.uploadedAt ? new Date(att.uploadedAt) : new Date(),
            status: 'pending' as const
          })) || []
        } as ApplicationSubmission;
      });
      
      setApplications(parsedApps);
      calculateStats(parsedApps);
    } catch (err: any) {
      const error = err as Error;
      setError(error);
      console.error('❌ Failed to load applications:', {
        error,
        message: err?.message,
        response: err?.response,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        code: err?.code,
        config: err?.config ? {
          url: err.config.url,
          method: err.config.method,
          baseURL: err.config.baseURL
        } : null
      });
      
      // On error, set empty array instead of mock data
      setApplications([]);
      calculateStats([]);
      
      // Show user-friendly error toast
      let errorMessage = 'Failed to load applications.';
      if (err?.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to connect to the server. Please check your connection.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view applications.';
      } else if (err?.response?.status === 404) {
        errorMessage = 'Applications endpoint not found.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error('Failed to Load Applications', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const evaluateFieldValue = (value: any, conditions: any[]): number => {
    // Simple evaluation logic - can be enhanced
    if (!value) return 0;
    
    // Check if value meets any condition
    for (const condition of conditions) {
      if (condition.includes('>')) {
        const threshold = parseFloat(condition.replace('>', '').trim());
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && !isNaN(threshold)) {
          return numValue > threshold ? 100 : (numValue / threshold) * 100;
        }
      } else if (condition.includes('=')) {
        const expected = condition.replace('=', '').trim();
        if (value.toString().toLowerCase() === expected.toLowerCase()) {
          return 100;
        }
      } else if (value.toString().toLowerCase().includes(condition.toLowerCase())) {
        return 100;
      }
    }
    
    return 50; // Partial credit if value exists but doesn't match conditions
  };

  const calculateStats = (apps: ApplicationSubmission[]) => {
    const newStats: ApplicationStats = {
      totalApplications: apps.length,
      byStatus: {},
      byCourse: {},
      averageMatchScore: 0,
      highMatchCount: 0,
      mediumMatchCount: 0,
      lowMatchCount: 0
    };

    let totalScore = 0;

    apps.forEach(app => {
      // Count by status
      newStats.byStatus[app.status] = (newStats.byStatus[app.status] || 0) + 1;
      
      // Count by course
      newStats.byCourse[app.courseName] = (newStats.byCourse[app.courseName] || 0) + 1;
      
      // Calculate match score distribution
      totalScore += app.matchScore;
      if (app.matchScore > 80) {
        newStats.highMatchCount++;
      } else if (app.matchScore >= 50) {
        newStats.mediumMatchCount++;
      } else {
        newStats.lowMatchCount++;
      }
    });

    newStats.averageMatchScore = apps.length > 0 ? Math.round(totalScore / apps.length) : 0;
    setStats(newStats);
  };

  const submitApplication = async (applicationData: Partial<ApplicationSubmission>) => {
    try {
      const newApplication: ApplicationSubmission = {
        id: `APP-${Date.now()}`,
        applicantName: applicationData.applicantName || '',
        applicantEmail: applicationData.applicantEmail || '',
        applicantPhone: applicationData.applicantPhone || '',
        courseId: applicationData.courseId || '',
        courseName: applicationData.courseName || '',
        universityId: applicationData.universityId || '',
        universityName: applicationData.universityName || '',
        formId: applicationData.formId || '',
        formData: applicationData.formData || {},
        matchScore: 0,
        matchDetails: [],
        status: 'submitted',
        submittedAt: new Date(),
        lastUpdated: new Date(),
        documents: applicationData.documents || []
      };

      // Calculate match score
      const { score, details } = calculateMatchScore(newApplication.formData, newApplication.courseId);
      newApplication.matchScore = score;
      newApplication.matchDetails = details;

      // Submit via API
      const createdApp = await applicationsApi.createApplication({
        courseId: newApplication.courseId,
        universityId: newApplication.universityId,
        data: {
          ...newApplication.formData,
          matchScore: newApplication.matchScore,
          matchDetails: newApplication.matchDetails
        }
      });

      const updatedApplications = [...applications, { ...newApplication, id: createdApp.id }];
      setApplications(updatedApplications);
      calculateStats(updatedApplications);

      return { ...newApplication, id: createdApp.id };
    } catch (err) {
      console.error('Failed to submit application:', err);
      throw err;
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: ApplicationSubmission['status']) => {
    try {
      // Use the new updateStatus convenience method
      await applicationsApi.updateStatus(applicationId, newStatus);
      const updatedApplications = applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, lastUpdated: new Date() }
          : app
      );
      setApplications(updatedApplications);
      calculateStats(updatedApplications);
    } catch (err) {
      console.error('Failed to update application status:', err);
      throw err;
    }
  };

  const getApplicationById = (applicationId: string): ApplicationSubmission | undefined => {
    return applications.find(app => app.id === applicationId);
  };

  const getApplicationsByCourse = (courseId: string): ApplicationSubmission[] => {
    return applications.filter(app => app.courseId === courseId);
  };

  const getApplicationsByStatus = (status: ApplicationSubmission['status']): ApplicationSubmission[] => {
    return applications.filter(app => app.status === status);
  };

  const generateMockApplications = (): ApplicationSubmission[] => {
    const now = new Date();
    const mockData: ApplicationSubmission[] = [
      // Form 1 Applications - MBA
      {
        id: 'APP-001',
        applicantName: 'John Doe',
        applicantEmail: 'john.doe@example.com',
        applicantPhone: '+1 234-567-8900',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234-567-8900',
          gpa: '3.8',
          greScore: '325',
          workExperience: '3 years',
          englishProficiency: 'TOEFL 110',
          recommendations: '3',
          previousEducation: "Bachelor's in Business Administration",
          graduationYear: '2020',
          fieldOfStudy: 'Business Management',
          statementOfPurpose: 'I am passionate about advancing my career in business leadership...',
          dateOfBirth: '1998-05-15',
          nationality: 'United States',
          gender: 'Male'
        },
        matchScore: 92,
        matchDetails: [],
        status: 'shortlisted' as const,
        submittedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        lastUpdated: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        documents: []
      },
      {
        id: 'APP-002',
        applicantName: 'Sarah Williams',
        applicantEmail: 'sarah.williams@example.com',
        applicantPhone: '+1 234-567-8901',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          phone: '+1 234-567-8901',
          gpa: '3.9',
          greScore: '330',
          workExperience: '5 years',
          englishProficiency: 'TOEFL 115',
          previousEducation: "Master's in Finance",
          graduationYear: '2019',
          fieldOfStudy: 'Finance',
          statementOfPurpose: 'My goal is to lead strategic initiatives in global markets...',
          dateOfBirth: '1997-03-22',
          nationality: 'United States',
          gender: 'Female'
        },
        matchScore: 95,
        matchDetails: [],
        status: 'accepted' as const,
        submittedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-003',
        applicantName: 'Michael Johnson',
        applicantEmail: 'michael.j@example.com',
        applicantPhone: '+1 234-567-8902',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'Michael Johnson',
          email: 'michael.j@example.com',
          phone: '+1 234-567-8902',
          gpa: '3.2',
          greScore: '310',
          workExperience: '5 years',
          previousEducation: "Bachelor's in Economics",
          graduationYear: '2018',
          fieldOfStudy: 'Economics',
          statementOfPurpose: 'I seek to enhance my analytical and leadership skills...',
          dateOfBirth: '1996-11-08',
          nationality: 'United States',
          gender: 'Male',
          englishProficiency: 'IELTS 7.0'
        },
        matchScore: 65,
        matchDetails: [],
        status: 'submitted' as const,
        submittedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-004',
        applicantName: 'Emily Chen',
        applicantEmail: 'emily.chen@example.com',
        applicantPhone: '+1 234-567-8903',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'Emily Chen',
          email: 'emily.chen@example.com',
          phone: '+1 234-567-8903',
          gpa: '3.5',
          greScore: '318',
          workExperience: '4 years',
          previousEducation: "Bachelor's in Marketing",
          graduationYear: '2020',
          fieldOfStudy: 'Marketing',
          statementOfPurpose: 'I aim to become a marketing leader in the tech industry...',
          dateOfBirth: '1998-07-12',
          nationality: 'China',
          gender: 'Female',
          englishProficiency: 'TOEFL 105'
        },
        matchScore: 78,
        matchDetails: [],
        status: 'under_review' as const,
        submittedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-005',
        applicantName: 'David Brown',
        applicantEmail: 'david.brown@example.com',
        applicantPhone: '+1 234-567-8904',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'David Brown',
          email: 'david.brown@example.com',
          phone: '+1 234-567-8904',
          gpa: '2.8',
          greScore: '300',
          workExperience: '2 years',
          previousEducation: "Bachelor's in Engineering",
          graduationYear: '2022',
          fieldOfStudy: 'Engineering',
          statementOfPurpose: 'I want to transition into business management...',
          dateOfBirth: '2000-01-20',
          nationality: 'United States',
          gender: 'Male',
          englishProficiency: 'IELTS 6.5'
        },
        matchScore: 45,
        matchDetails: [],
        status: 'rejected' as const,
        submittedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        documents: []
      },
      
      // Form 2 Applications - Computer Science
      {
        id: 'APP-006',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane.smith@example.com',
        applicantPhone: '+1 234-567-8905',
        courseId: 'course-2',
        courseName: 'Master of Computer Science',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-2',
        formData: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 234-567-8905',
          gpa: '3.6',
          greScore: '315',
          workExperience: '2 years',
          englishProficiency: 'IELTS 7.5',
          previousEducation: "Bachelor's in Computer Science",
          graduationYear: '2021',
          fieldOfStudy: 'Computer Science',
          statementOfPurpose: 'I am eager to advance my technical skills and research capabilities...',
          dateOfBirth: '1999-09-14',
          nationality: 'Canada',
          gender: 'Female'
        },
        matchScore: 78,
        matchDetails: [],
        status: 'under_review' as const,
        submittedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-007',
        applicantName: 'Robert Taylor',
        applicantEmail: 'robert.t@example.com',
        applicantPhone: '+1 234-567-8906',
        courseId: 'course-2',
        courseName: 'Master of Computer Science',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-2',
        formData: {
          name: 'Robert Taylor',
          email: 'robert.t@example.com',
          phone: '+1 234-567-8906',
          gpa: '3.7',
          greScore: '320',
          workExperience: '3 years',
          englishProficiency: 'TOEFL 105',
          previousEducation: "Bachelor's in Software Engineering",
          graduationYear: '2020',
          fieldOfStudy: 'Software Engineering',
          statementOfPurpose: 'I want to specialize in AI and machine learning systems...',
          dateOfBirth: '1998-02-28',
          nationality: 'United Kingdom',
          gender: 'Male'
        },
        matchScore: 85,
        matchDetails: [],
        status: 'interview_scheduled' as const,
        submittedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-008',
        applicantName: 'Lisa Anderson',
        applicantEmail: 'lisa.a@example.com',
        applicantPhone: '+1 234-567-8907',
        courseId: 'course-2',
        courseName: 'Master of Computer Science',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-2',
        formData: {
          name: 'Lisa Anderson',
          email: 'lisa.a@example.com',
          phone: '+1 234-567-8907',
          gpa: '3.4',
          greScore: '312',
          workExperience: '1 year',
          previousEducation: "Bachelor's in Information Systems",
          graduationYear: '2023',
          fieldOfStudy: 'Information Systems',
          statementOfPurpose: 'I am passionate about cybersecurity and data protection...',
          dateOfBirth: '2001-06-30',
          nationality: 'United States',
          gender: 'Female',
          englishProficiency: 'TOEFL 102'
        },
        matchScore: 72,
        matchDetails: [],
        status: 'submitted' as const,
        submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        documents: []
      },
      
      // Form 3 Applications - Engineering
      {
        id: 'APP-009',
        applicantName: 'James Wilson',
        applicantEmail: 'james.wilson@example.com',
        applicantPhone: '+1 234-567-8908',
        courseId: 'course-3',
        courseName: 'Master of Engineering',
        universityId: 'uni-2',
        universityName: 'MIT',
        formId: 'form-3',
        formData: {
          name: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '+1 234-567-8908',
          gpa: '3.8',
          greScore: '328',
          workExperience: '4 years',
          previousEducation: "Bachelor's in Mechanical Engineering",
          graduationYear: '2019',
          fieldOfStudy: 'Mechanical Engineering',
          statementOfPurpose: 'I aim to innovate in sustainable engineering solutions...',
          dateOfBirth: '1997-04-17',
          nationality: 'United States',
          gender: 'Male',
          englishProficiency: 'TOEFL 108'
        },
        matchScore: 88,
        matchDetails: [],
        status: 'accepted' as const,
        submittedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-010',
        applicantName: 'Maria Garcia',
        applicantEmail: 'maria.g@example.com',
        applicantPhone: '+1 234-567-8909',
        courseId: 'course-3',
        courseName: 'Master of Engineering',
        universityId: 'uni-2',
        universityName: 'MIT',
        formId: 'form-3',
        formData: {
          name: 'Maria Garcia',
          email: 'maria.g@example.com',
          phone: '+1 234-567-8909',
          gpa: '3.3',
          greScore: '308',
          workExperience: '3 years',
          previousEducation: "Bachelor's in Civil Engineering",
          graduationYear: '2020',
          fieldOfStudy: 'Civil Engineering',
          statementOfPurpose: 'I want to contribute to infrastructure development projects...',
          dateOfBirth: '1998-12-05',
          nationality: 'Spain',
          gender: 'Female',
          englishProficiency: 'IELTS 7.0'
        },
        matchScore: 68,
        matchDetails: [],
        status: 'under_review' as const,
        submittedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        documents: []
      },
      
      // Form 1 - Additional applications
      {
        id: 'APP-011',
        applicantName: 'Thomas Lee',
        applicantEmail: 'thomas.lee@example.com',
        applicantPhone: '+1 234-567-8910',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'Thomas Lee',
          email: 'thomas.lee@example.com',
          phone: '+1 234-567-8910',
          gpa: '3.7',
          greScore: '322',
          workExperience: '6 years',
          previousEducation: "Bachelor's in Business Administration",
          graduationYear: '2017',
          fieldOfStudy: 'Business Administration',
          statementOfPurpose: 'With extensive experience, I seek to deepen my strategic thinking...',
          dateOfBirth: '1995-08-25',
          nationality: 'Singapore',
          gender: 'Male',
          englishProficiency: 'TOEFL 112'
        },
        matchScore: 82,
        matchDetails: [],
        status: 'shortlisted' as const,
        submittedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        documents: []
      },
      {
        id: 'APP-012',
        applicantName: 'Jennifer Martinez',
        applicantEmail: 'jennifer.m@example.com',
        applicantPhone: '+1 234-567-8911',
        courseId: 'course-1',
        courseName: 'Master of Business Administration',
        universityId: 'uni-1',
        universityName: 'Stanford University',
        formId: 'form-1',
        formData: {
          name: 'Jennifer Martinez',
          email: 'jennifer.m@example.com',
          phone: '+1 234-567-8911',
          gpa: '3.1',
          greScore: '305',
          workExperience: '1 year',
          previousEducation: "Bachelor's in Business",
          graduationYear: '2023',
          fieldOfStudy: 'Business',
          statementOfPurpose: 'I am looking to build a strong foundation in business management...',
          dateOfBirth: '2001-10-11',
          nationality: 'United States',
          gender: 'Female',
          englishProficiency: 'TOEFL 98'
        },
        matchScore: 58,
        matchDetails: [],
        status: 'rejected' as const,
        submittedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        documents: []
      },
    ];

    return mockData;
  };

  return {
    applications,
    stats,
    loading,
    error,
    submitApplication,
    updateApplicationStatus,
    getApplicationById,
    getApplicationsByCourse,
    getApplicationsByStatus,
    calculateMatchScore,
    refreshApplications: loadApplications
  };
};