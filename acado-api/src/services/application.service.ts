// src/services/application.service.ts
import Application from '../models/Application.js';
import Course from '../models/Course.js';
import University from '../models/University.js';
import Form from '../models/Form.js';
import User from '../models/User.js';
import { Types } from 'mongoose';

export interface CreateApplicationInput {
  userId: string;
  universityId?: string;
  courseId?: string;
  formId: string;
  formData: Record<string, any>;
  status?: 'draft' | 'submitted';
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    completionTime?: number;
  };
}

export interface UpdateApplicationInput {
  userId?: string;
  universityId?: string;
  courseId?: string;
  formId?: string;
  formData?: Record<string, any>;
  status?: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted';
  reviewNotes?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    completionTime?: number;
  };
}

export interface QueryApplicationsInput {
  userId?: string;
  universityId?: string;
  courseId?: string;
  formId?: string;
  status?: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted';
  page?: number;
  limit?: number;
  sort?: string;
  enrich?: boolean; // If true, populate related data
}

/**
 * Enrich application with related data (course, university, user, form)
 */
export async function enrichApplication(app: any): Promise<any> {
  const enriched: any = { ...app };
  
  try {
    // Helper to check if string is valid ObjectId
    const isValidObjectId = (id: string) => {
      return id && Types.ObjectId.isValid(id);
    };
    
    // Get course information
    if (app.courseId && isValidObjectId(app.courseId)) {
      try {
        const course = await Course.findById(app.courseId);
        if (course) {
          enriched.courseName = course.name;
          // Course has universityId as ObjectId reference
          if (course.universityId) {
            enriched.universityId = course.universityId.toString();
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    }
    
    // Get university information
    let universityIdToQuery = enriched.universityId;
    if (!universityIdToQuery && app.courseId && isValidObjectId(app.courseId)) {
      try {
        const courseForUni = await Course.findById(app.courseId).select('universityId');
        if (courseForUni && courseForUni.universityId) {
          universityIdToQuery = courseForUni.universityId.toString();
        }
      } catch (error) {
        console.error('Error fetching course for university:', error);
      }
    }
    
    if (universityIdToQuery && isValidObjectId(universityIdToQuery)) {
      try {
        const university = await University.findById(universityIdToQuery);
        if (university) {
          enriched.universityName = university.name;
        }
      } catch (error) {
        console.error('Error fetching university:', error);
      }
    }
    
    // Get user information (for applicant details)
    if (app.userId && isValidObjectId(app.userId)) {
      try {
        const user = await User.findById(app.userId).select('name email');
        if (user) {
          enriched.applicantName = user.name;
          enriched.applicantEmail = user.email;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    
    // Get form information
    let formForContext: any = null;
    if (app.formId && isValidObjectId(app.formId)) {
      try {
        formForContext = await Form.findById(app.formId).select(
          'name title universityId universityName courseIds courseNames'
        );
        if (formForContext) {
          if (!enriched.formName) {
            enriched.formName = formForContext.title || formForContext.name;
          }
          if (!enriched.universityId && formForContext.universityId) {
            enriched.universityId = String(formForContext.universityId);
          }
          if (!enriched.universityName && formForContext.universityName) {
            enriched.universityName = formForContext.universityName;
          }
          if (!enriched.courseName) {
            const formCourseIds: string[] = Array.isArray(formForContext.courseIds)
              ? formForContext.courseIds.map((id: any) => String(id))
              : [];
            const formCourseNames: string[] = Array.isArray(formForContext.courseNames)
              ? formForContext.courseNames
              : [];

            if (formCourseIds.length && formCourseNames.length) {
              const courseIndex = app.courseId
                ? formCourseIds.findIndex((id: string) => id === String(app.courseId))
                : -1;
              if (courseIndex >= 0 && formCourseNames[courseIndex]) {
                enriched.courseName = formCourseNames[courseIndex];
              } else if (formCourseNames[0]) {
                enriched.courseName = formCourseNames[0];
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    }
    
    // Extract applicant info from formData if not available
    if (app.formData) {
      const formData = app.formData;
      if (!enriched.applicantName) {
        enriched.applicantName = formData.name || formData.fullName || formData['Full Name'] || 
          (formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : null) ||
          null;
      }
      if (!enriched.applicantEmail) {
        enriched.applicantEmail = formData.email || formData['Email Address'] || formData.emailAddress || null;
      }
      if (!enriched.applicantPhone) {
        enriched.applicantPhone = formData.phone || formData.phoneNumber || formData['Phone Number'] || formData.mobile || null;
      }
      if (!enriched.courseName) {
        enriched.courseName =
          formData.courseName ||
          formData['Course Name'] ||
          formData.course?.name ||
          formData.selectedCourse ||
          formData.programName ||
          enriched.courseName ||
          null;
      }
      if (!enriched.universityName) {
        enriched.universityName =
          formData.universityName ||
          formData['University Name'] ||
          formData.university?.name ||
          formData.selectedUniversity ||
          formData.schoolName ||
          enriched.universityName ||
          null;
      }
      if (!enriched.universityId && formData.universityId) {
        enriched.universityId = formData.universityId;
      }
    }
  } catch (error) {
    console.error('Error enriching application:', error);
  }
  
  return enriched;
}

export async function listApplications(query: QueryApplicationsInput = {}) {
  const { userId, universityId, courseId, formId, status, page = 1, limit = 20, sort = '-createdAt', enrich = false } = query;
  
  const filter: any = {};
  
  if (userId) filter.userId = userId;
  if (universityId) filter.universityId = universityId;
  if (courseId) filter.courseId = courseId;
  if (formId) filter.formId = formId;
  if (status) filter.status = status;
  
  const skip = (page - 1) * limit;
  
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec(),
    Application.countDocuments(filter)
  ]);
  
  let enrichedApplications = applications.map(app => app.toJSON());
  
  // Enrich applications if requested
  if (enrich) {
    enrichedApplications = await Promise.all(
      enrichedApplications.map(app => enrichApplication(app))
    );
  }
  
  return {
    applications: enrichedApplications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function getApplicationById(applicationId: string, enrich: boolean = true) {
  const application = await Application.findById(applicationId);
  if (!application) throw new Error('APPLICATION_NOT_FOUND');
  const appJson = application.toJSON();
  return enrich ? enrichApplication(appJson) : appJson;
}

async function buildAttachments(
  formId: string | undefined,
  formData: Record<string, any> | undefined
) {
  if (!formData || typeof formData !== 'object') return [];

  const fileFieldNames = new Set<string>();

  if (formId) {
    try {
      const form = await Form.findById(formId).select('fields');
      form?.fields
        ?.filter((field: any) => field?.type === 'file')
        .forEach((field: any) => {
          if (field?.name) {
            fileFieldNames.add(field.name);
          }
        });
    } catch (error) {
      console.error('Error loading form for attachment extraction:', error);
    }
  }

  // Fallback: detect file-like values based on value content
  Object.entries(formData).forEach(([fieldName, value]) => {
    if (fileFieldNames.has(fieldName)) return;
    if (isFileLikeValue(value)) {
      fileFieldNames.add(fieldName);
    }
  });

  const attachments: {
    fieldName: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  }[] = [];

  fileFieldNames.forEach((fieldName) => {
    const value = formData[fieldName];
    const normalized = normalizeAttachmentValue(fieldName, value);
    if (normalized) {
      attachments.push(normalized);
      // Ensure formData stores the URL string for persistence/compatibility
      formData[fieldName] = normalized.fileUrl;
    }
  });

  return attachments;
}

function isFileLikeValue(value: unknown) {
  if (!value) return false;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return (
      lower.includes('/upload/') ||
      /\.(pdf|doc|docx|jpe?g|png|webp)$/.test(lower.split('?')[0] || '')
    );
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, any>;
    return Boolean(obj.url || obj.fileUrl);
  }
  return false;
}

function normalizeAttachmentValue(fieldName: string, value: unknown) {
  if (!value) return null;

  let fileUrl: string | undefined;
  let originalName: string | undefined;

  if (typeof value === 'string') {
    fileUrl = value.trim();
  } else if (typeof value === 'object') {
    const obj = value as Record<string, any>;
    fileUrl = (obj.url || obj.fileUrl || '').trim();
    originalName = (obj.fileName || obj.name || obj.originalName || '').trim();
  }

  if (!fileUrl) return null;

  const decodedUrl = decodeURIComponent(fileUrl);
  const derivedName = decodedUrl.split('/').pop() || fieldName;
  const fileName = originalName || derivedName;

  return {
    fieldName,
    fileName,
    fileUrl,
    uploadedAt: new Date()
  };
}

export async function createApplication(data: CreateApplicationInput, createdBy?: Types.ObjectId) {
  const attachments = await buildAttachments(data.formId, data.formData);

  const application = await Application.create({
    ...data,
    attachments,
    createdBy,
    status: data.status || 'draft',
    submittedAt: data.status === 'submitted' ? new Date() : undefined
  });
  return application.toJSON();
}

export async function updateApplication(applicationId: string, data: UpdateApplicationInput) {
  const updateData: any = { ...data };
  
  // If status is being changed to submitted, set submittedAt
  if (data.status === 'submitted') {
    updateData.submittedAt = new Date();
  }

  // If status is being changed to review statuses, set reviewedAt
  if (data.status === 'accepted' || data.status === 'rejected' || 
      data.status === 'shortlisted' || data.status === 'interview_scheduled' ||
      data.status === 'waitlisted') {
    updateData.reviewedAt = new Date();
  }

  if (data.formData) {
    let formIdForAttachments = data.formId;

    if (!formIdForAttachments) {
      const existing = await Application.findById(applicationId).select('formId');
      formIdForAttachments = existing?.formId;
    }

    updateData.attachments = await buildAttachments(formIdForAttachments, data.formData);
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  if (!application) throw new Error('APPLICATION_NOT_FOUND');
  return application.toJSON();
}

export async function deleteApplication(applicationId: string) {
  const application = await Application.findByIdAndDelete(applicationId);
  if (!application) throw new Error('APPLICATION_NOT_FOUND');
  return { message: 'Application deleted successfully' };
}

export async function submitApplication(applicationId: string) {
  return updateApplication(applicationId, { 
    status: 'submitted',
    submittedAt: new Date() 
  });
}

export async function withdrawApplication(applicationId: string) {
  return updateApplication(applicationId, { status: 'withdrawn' });
}

export async function reviewApplication(
  applicationId: string, 
  reviewedBy: Types.ObjectId,
  status: 'accepted' | 'rejected' | 'shortlisted' | 'interview_scheduled' | 'under_review' | 'waitlisted',
  reviewNotes?: string
) {
  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      $set: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes
      }
    },
    { new: true, runValidators: true }
  );
  
  if (!application) throw new Error('APPLICATION_NOT_FOUND');
  return application.toJSON();
}

export async function getApplicationStats(filter: { userId?: string; universityId?: string; courseId?: string; formId?: string } = {}) {
  const match: any = {};
  if (filter.userId) match.userId = filter.userId;
  if (filter.universityId) match.universityId = filter.universityId;
  if (filter.courseId) match.courseId = filter.courseId;
  if (filter.formId) match.formId = filter.formId;
  
  const stats = await Application.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result: any = {
    total: 0,
    draft: 0,
    submitted: 0,
    under_review: 0,
    shortlisted: 0,
    interview_scheduled: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
    waitlisted: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
}

