// src/services/dashboard.service.ts
import University from '../models/University.js';
import Course from '../models/Course.js';
import Form from '../models/Form.js';
import Application from '../models/Application.js';

export interface DashboardStats {
  totalUniversities: number;
  totalUniversitiesChange?: string;
  activeCourses: number;
  activeCoursesChange?: string;
  formTemplates: number;
  formTemplatesChange?: string;
  totalApplications: number;
  totalApplicationsChange?: string;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('📊 Calculating dashboard statistics...');
    // Get current month start and last month start for comparison
    const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Total Universities
  const totalUniversities = await University.countDocuments({});
  const universitiesThisMonth = await University.countDocuments({
    createdAt: { $gte: currentMonthStart }
  });
  const universitiesLastMonth = await University.countDocuments({
    createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }
  });
  const universitiesChange = universitiesLastMonth > 0
    ? `+${universitiesThisMonth} this month`
    : universitiesThisMonth > 0
    ? `+${universitiesThisMonth} this month`
    : 'No change';

  // Active Courses (isActive: true)
  const activeCourses = await Course.countDocuments({
    isActive: true
  });
  const coursesThisWeek = await Course.countDocuments({
    createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    isActive: true
  });
  const coursesChange = coursesThisWeek > 0
    ? `+${coursesThisWeek} this week`
    : 'No change';

  // Form Templates (published or active forms)
  const formTemplates = await Form.countDocuments({
    $or: [
      { status: 'published' },
      { isActive: true },
      { isLaunched: true }
    ]
  });
  const customizedForms = await Form.countDocuments({
    $or: [
      { status: 'published' },
      { isActive: true },
      { isLaunched: true },
      { status: 'draft' } // Draft forms are also considered as "customized"
    ]
  });
  const formsChange = customizedForms > formTemplates
    ? `${customizedForms - formTemplates} customized`
    : formTemplates > 0
    ? `${formTemplates} active`
    : 'No forms';

  // Total Applications
  const totalApplications = await Application.countDocuments({});
  const applicationsThisMonth = await Application.countDocuments({
    createdAt: { $gte: currentMonthStart }
  });
  const applicationsLastMonth = await Application.countDocuments({
    createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }
  });
  const applicationsChange = applicationsThisMonth > 0
    ? `+${applicationsThisMonth} this month`
    : 'No applications';

    const result = {
      totalUniversities,
      totalUniversitiesChange: universitiesChange,
      activeCourses,
      activeCoursesChange: coursesChange,
      formTemplates,
      formTemplatesChange: formsChange,
      totalApplications,
      totalApplicationsChange: applicationsChange,
    };
    
    console.log('✅ Dashboard statistics calculated successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error calculating dashboard statistics:', error);
    throw error;
  }
}

