/**
 * Course Detail Response Adapter
 * 
 * Adapts new API course detail response + legacy meta response
 * to the format expected by course detail components.
 * 
 * Strategy: Hybrid Migration
 * - Use new API for: basic details, campaign sections, dates, fees
 * - Use legacy API for: modules, faculty, skills, enrollment stats
 * - Merge both into a unified format
 */

/**
 * Adapts new API course detail response to legacy client format
 * @param newCourse - Course data from new API (/courses/:id)
 * @param legacyMeta - Course metadata from legacy API (/get-course-meta)
 * @returns Adapted course object in legacy format
 */
export function adaptCourseDetailResponse(newCourse: any, legacyMeta?: any): any {
  if (!newCourse) {
    console.warn('⚠️ adaptCourseDetailResponse: newCourse is null/undefined');
    return null;
  }

  console.log('🔄 Adapting course detail response:', {
    hasNewCourse: !!newCourse,
    hasLegacyMeta: !!legacyMeta,
    courseId: newCourse.id || newCourse._id,
    courseName: newCourse.name,
  });

  // Build adapted response
  const adapted = {
    // ========================================
    // BASIC INFO (from new API)
    // ========================================
    id: newCourse.id || newCourse._id,
    name: newCourse.name,
    shortName: newCourse.shortName,
    description: newCourse.description,
    keywords: newCourse.keywords,
    
    // ========================================
    // MEDIA (from new API)
    // ========================================
    thumbnail: newCourse.thumbnail || '',
    bannerImage: newCourse.bannerImage || '',
    videoUrl: newCourse.videoUrl || '',
    
    // ========================================
    // UNIVERSITY (from new API)
    // ========================================
    university: {
      id: newCourse.universityId,
      name: newCourse.universityName || 'Unknown University',
    },
    universityId: newCourse.universityId,
    universityName: newCourse.universityName,
    
    // ========================================
    // COURSE CLASSIFICATION (from new API)
    // ========================================
    type: newCourse.type,
    typeId: newCourse.typeId,
    level: newCourse.level,
    levelId: newCourse.levelId,
    categoryId: newCourse.categoryId,
    courseCode: newCourse.courseCode,
    
    // ========================================
    // COURSE DETAILS (from new API)
    // ========================================
    duration: newCourse.duration || newCourse.campaign?.duration || '',
    fee: newCourse.fee || 0,
    currency: newCourse.currency || 'USD',
    requirements: newCourse.requirements || newCourse.campaign?.eligibility || '',
    
    // ========================================
    // DATES (from new API)
    // ========================================
    startDate: newCourse.startDate,
    start_date: newCourse.startDate, // Legacy field name
    endDate: newCourse.endDate,
    end_date: newCourse.endDate, // Legacy field name
    applicationDeadline: newCourse.applicationDeadline,
    
    // ========================================
    // CAMPAIGN SECTIONS (from new API)
    // ========================================
    // These are rich content sections from the campaign object
    aboutCourse: newCourse.campaign?.aboutCourse || '',
    whatWillYouGet: newCourse.campaign?.whatWillYouGet || '',
    courseStructure: newCourse.campaign?.courseStructure || '',
    learningOutcome: newCourse.campaign?.learningOutcome || '',
    partners: newCourse.campaign?.partners || '',
    collaboration: newCourse.campaign?.collaboration || '',
    careerOpportunities: newCourse.campaign?.careerOpportunities || '',
    courseUSP: newCourse.campaign?.courseUSP || '',
    eligibility: newCourse.campaign?.eligibility || newCourse.requirements || '',
    preRequisites: newCourse.campaign?.preRequisites || '',
    modeOfDelivery: newCourse.campaign?.modeOfDelivery || '',
    brochure: newCourse.campaign?.brochure || '',
    fieldOfStudy: newCourse.campaign?.fieldOfStudy || '',
    noOfPeopleRated: newCourse.campaign?.noOfPeopleRated || '0',
    rating: newCourse.campaign?.rating || '0',
    department: newCourse.campaign?.department || '',
    tuitionFee: newCourse.campaign?.tuitionFee || newCourse.fee?.toString() || '0',
    credits: newCourse.campaign?.credits || '',
    maximumSeats: newCourse.campaign?.maximumSeats || '',
    availableSeats: newCourse.campaign?.availableSeats || '',
    classSlots: newCourse.campaign?.classSlots || '',
    language: newCourse.campaign?.language || '',
    scholarship: newCourse.campaign?.scholarship || '',
    howToApply: newCourse.campaign?.howToApply || '',
    
    // ========================================
    // LEGACY META (from legacy API if provided)
    // ========================================
    // These fields are only available from legacy API
    // If legacyMeta is not provided, use empty defaults
    course_skills: legacyMeta?.course_skills || '',
    program_faculty: legacyMeta?.program_faculty || [],
    modules: legacyMeta?.modules || [],
    student_enrolled: legacyMeta?.student_enrolled || 0,
    program_status: legacyMeta?.program_status || {
      program_status: 'upcoming',
      program_time: ''
    },
    
    // ========================================
    // ORGANIZATION (from legacy meta or new API)
    // ========================================
    organization: legacyMeta?.organization || {
      id: newCourse.universityId,
      name: newCourse.universityName || 'Unknown University',
      logo: ''
    },
    
    // ========================================
    // METADATA
    // ========================================
    isActive: newCourse.isActive,
    createdAt: newCourse.createdAt,
    updatedAt: newCourse.updatedAt,
    createdBy: newCourse.createdBy,
    applicationFormId: newCourse.applicationFormId,
    learningOutcomeIds: newCourse.learningOutcomeIds || [],
    
    // ========================================
    // KEEP ORIGINALS FOR DEBUGGING
    // ========================================
    _source: {
      newApi: newCourse,
      legacyMeta: legacyMeta || null,
    },
  };

  console.log('✅ Course detail adapted:', {
    id: adapted.id,
    name: adapted.name,
    hasModules: adapted.modules.length > 0,
    hasFaculty: adapted.program_faculty.length > 0,
    hasSkills: !!adapted.course_skills,
    hasEnrollmentCount: adapted.student_enrolled > 0,
    hasCampaignContent: !!adapted.aboutCourse,
  });

  return adapted;
}

/**
 * Adapts course list item from new API to legacy format
 * (For course listing pages that might need similar adaptation)
 */
export function adaptCourseListItem(newCourse: any): any {
  if (!newCourse) return null;

  return {
    id: newCourse.id || newCourse._id,
    name: newCourse.name,
    shortName: newCourse.shortName,
    description: newCourse.description,
    thumbnail: newCourse.thumbnail || '',
    bannerImage: newCourse.bannerImage || '',
    universityId: newCourse.universityId,
    universityName: newCourse.universityName,
    type: newCourse.type,
    level: newCourse.level,
    duration: newCourse.duration,
    fee: newCourse.fee,
    currency: newCourse.currency,
    startDate: newCourse.startDate,
    endDate: newCourse.endDate,
    isActive: newCourse.isActive,
  };
}

/**
 * Helper: Check if course has legacy meta data
 */
export function hasLegacyMetaData(course: any): boolean {
  return !!(
    course?.modules?.length > 0 ||
    course?.program_faculty?.length > 0 ||
    course?.course_skills ||
    course?.student_enrolled > 0
  );
}

/**
 * Helper: Check if course has campaign content
 */
export function hasCampaignContent(course: any): boolean {
  return !!(
    course?.aboutCourse ||
    course?.courseStructure ||
    course?.learningOutcome ||
    course?.partners ||
    course?.collaboration ||
    course?.careerOpportunities
  );
}

