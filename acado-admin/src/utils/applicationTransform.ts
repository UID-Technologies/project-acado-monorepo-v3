/**
 * Utility functions to transform backend Application data to frontend ApplicationSubmission format
 */
import { Application } from '@/api/applications.api';
import { ApplicationSubmission } from '@/hooks/useApplicationSubmissions';

/**
 * Extract applicant information from formData
 */
export const extractApplicantInfo = (formData: Record<string, any>) => {
  return {
    applicantName: formData.name || formData.fullName || formData['Full Name'] || formData.firstName + ' ' + formData.lastName || 'Unknown',
    applicantEmail: formData.email || formData['Email Address'] || formData.emailAddress || '',
    applicantPhone: formData.phone || formData.phoneNumber || formData['Phone Number'] || formData.mobile || '',
  };
};

/**
 * Transform backend Application to frontend ApplicationSubmission
 */
export const transformApplication = (
  app: Application,
  courseName?: string,
  universityName?: string,
  matchScore?: number,
  matchDetails?: any[]
): ApplicationSubmission => {
  const applicantInfo = extractApplicantInfo(app.formData || {});
  
  return {
    id: app.id,
    applicantName: app.applicantName || applicantInfo.applicantName || 'Unknown',
    applicantEmail: app.applicantEmail || applicantInfo.applicantEmail || '',
    applicantPhone: app.applicantPhone || applicantInfo.applicantPhone || '',
    courseId: app.courseId || '',
    courseName: app.courseName || courseName || '',
    universityId: app.universityId || '',
    universityName: app.universityName || universityName || '',
    formId: app.formId || '',
    formData: app.formData || {},
    matchScore: app.matchScore || matchScore || 0,
    matchDetails: app.matchDetails || matchDetails || [],
    status: (app.status || 'submitted') as ApplicationSubmission['status'],
    submittedAt: app.submittedAt ? new Date(app.submittedAt) : new Date(app.createdAt || Date.now()),
    lastUpdated: app.updatedAt ? new Date(app.updatedAt) : new Date(app.createdAt || Date.now()),
    documents: (app.attachments || []).map((att) => ({
      id: att.fieldName || '',
      name: att.fileName || '',
      url: att.fileUrl || '',
      size: '',
      type: '',
      uploadedAt: att.uploadedAt ? new Date(att.uploadedAt) : new Date(),
      status: 'pending' as const
    }))
  };
};

/**
 * Transform array of backend Applications to frontend ApplicationSubmissions
 */
export const transformApplications = (
  applications: Application[],
  coursesMap?: Map<string, { name: string; universityId?: string }>,
  universitiesMap?: Map<string, { name: string }>
): ApplicationSubmission[] => {
  return applications.map((app) => {
    const course = app.courseId && coursesMap?.get(app.courseId);
    const university = (app.universityId || course?.universityId) && universitiesMap?.get(app.universityId || course?.universityId || '');
    
    return transformApplication(
      app,
      app.courseName || course?.name,
      app.universityName || university?.name,
      app.matchScore,
      app.matchDetails
    );
  });
};

