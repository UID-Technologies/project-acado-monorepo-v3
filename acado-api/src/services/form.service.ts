// src/services/form.service.ts
import Form from '../models/Form.js';
import Category from '../models/Category.js';
import University from '../models/University.js';
import Organization from '../models/Organization.js';
import Course from '../models/Course.js';
import { Types } from 'mongoose';

export interface CreateFormInput {
  name: string;
  title: string;
  description?: string;
  organizationId?: string;
  organizationName?: string;
  universityId?: string;
  universityName?: string; // Can be provided or will be fetched
  courseIds?: string[];
  courseNames?: string[]; // Can be provided or will be fetched
  fields: any[];
  customCategoryNames?: Record<string, any>;
  status?: 'draft' | 'published' | 'archived';
  isLaunched?: boolean;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateFormInput extends Partial<CreateFormInput> {}

export interface QueryFormsInput {
  status?: 'draft' | 'published' | 'archived';
  universityId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

async function enrichFormDocument(rawForm: any) {
  const formJson = rawForm.toJSON ? rawForm.toJSON() : { ...rawForm };

  // Ensure university name
  if (formJson.universityId && (!formJson.universityName || !formJson.universityName.trim())) {
    const fetchedUniversityName = await fetchUniversityName(formJson.universityId);
    if (fetchedUniversityName) {
      formJson.universityName = fetchedUniversityName;
    }
  }

  // Ensure course names
  if (Array.isArray(formJson.courseIds) && formJson.courseIds.length > 0) {
    const existingNames = Array.isArray(formJson.courseNames) ? [...formJson.courseNames] : [];
    let needsFetch = existingNames.length !== formJson.courseIds.length || existingNames.some(name => !name || !name.trim());

    if (needsFetch) {
      try {
        const courseObjectIds = formJson.courseIds.map((id: string) =>
          Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id
        );

        const courses = await Course.find({
          _id: { $in: courseObjectIds },
        }).select('name');

        const courseNameMap = new Map<string, string>();
        courses.forEach(course => {
          courseNameMap.set(course.id.toString(), course.name);
        });

        formJson.courseNames = formJson.courseIds.map((courseId: string, idx: number) => {
          const mappedId = Types.ObjectId.isValid(courseId) ? courseId : courseId;
          return (
            courseNameMap.get(String(mappedId)) ||
            existingNames[idx] ||
            ''
          );
        });
      } catch (error) {
        console.warn('⚠️ Failed to fetch course names for form enrichment:', error);
        if (!existingNames.length) {
          formJson.courseNames = formJson.courseIds.map(() => '');
        } else {
          formJson.courseNames = existingNames;
        }
      }
    }
  } else {
    formJson.courseNames = [];
  }

  return formJson;
}

export async function listForms(query: QueryFormsInput = {}) {
  const { status, universityId, isActive, search, page = 1, limit = 20, sort = '-createdAt' } = query;
  
  const filter: any = {};
  
  if (status) filter.status = status;
  if (universityId) filter.universityId = universityId;
  if (isActive !== undefined) filter.isActive = isActive;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const [forms, total] = await Promise.all([
    Form.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec(),
    Form.countDocuments(filter)
  ]);
  
  const enrichedForms = await Promise.all(forms.map(form => enrichFormDocument(form)));

  return {
    forms: enrichedForms,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function getFormById(formId: string) {
  const form = await Form.findById(formId);
  if (!form) throw new Error('FORM_NOT_FOUND');
  
  const formData = await enrichFormDocument(form);
  
  // Fetch all categories to enrich field data with category and subcategory names
  const categories = await Category.find().exec();
  const categoryMap = new Map();
  const subcategoryMap = new Map();
  
  categories.forEach(cat => {
    const catObj = cat.toJSON();
    categoryMap.set(catObj.id, catObj.name);
    
    if (catObj.subcategories && Array.isArray(catObj.subcategories)) {
      catObj.subcategories.forEach((sub: any) => {
        subcategoryMap.set(sub.id, sub.name);
      });
    }
  });
  
  // Enrich fields with category and subcategory names
  if (formData.fields && Array.isArray(formData.fields)) {
    formData.fields = formData.fields.map((field: any) => ({
      ...field,
      categoryName: categoryMap.get(field.categoryId) || field.categoryId,
      subcategoryName: field.subcategoryId ? (subcategoryMap.get(field.subcategoryId) || field.subcategoryId) : undefined
    }));
  }
  
  return formData;
}

/**
 * Fetch organization name by organizationId
 */
async function fetchOrganizationName(organizationId: string): Promise<string | undefined> {
  try {
    const organization = await Organization.findById(organizationId);
    return organization?.name;
  } catch (error) {
    console.warn('⚠️ Failed to fetch organization name:', error);
    return undefined;
  }
}

/**
 * Fetch university name by universityId
 */
async function fetchUniversityName(universityId: string): Promise<string | undefined> {
  try {
    const university = await University.findById(universityId);
    return university?.name;
  } catch (error) {
    console.warn('⚠️ Failed to fetch university name:', error);
    return undefined;
  }
}

/**
 * Fetch course names by courseIds
 */
async function fetchCourseNames(courseIds: string[]): Promise<string[]> {
  if (!courseIds || courseIds.length === 0) return [];
  
  try {
    const courses = await Course.find({ 
      _id: { $in: courseIds.map(id => {
        // Try to convert to ObjectId if it's a valid format
        if (Types.ObjectId.isValid(id)) {
          return new Types.ObjectId(id);
        }
        return id;
      })}
    }).select('name');
    
    return courses.map(course => course.name).filter(Boolean);
  } catch (error) {
    console.warn('⚠️ Failed to fetch course names:', error);
    // Try to fetch as string IDs if ObjectId conversion failed
    try {
      const courses = await Course.find({ 
        _id: { $in: courseIds }
      }).select('name');
      return courses.map(course => course.name).filter(Boolean);
    } catch (err) {
      console.warn('⚠️ Failed to fetch course names (fallback):', err);
      return [];
    }
  }
}

export async function createForm(data: CreateFormInput, createdBy?: any) {
  // Handle createdBy - it might be ObjectId, string, or number (from SSO)
  let createdByValue: Types.ObjectId | undefined;
  
  if (createdBy) {
    try {
      // Try to convert to ObjectId if it's a valid format
      if (typeof createdBy === 'string' && /^[a-fA-F0-9]{24}$/.test(createdBy)) {
        createdByValue = new Types.ObjectId(createdBy);
      } else if (createdBy instanceof Types.ObjectId) {
        createdByValue = createdBy;
      } else {
        // For SSO users with numeric IDs, skip createdBy field
        console.log('⚠️ Skipping createdBy - not a valid ObjectId format:', createdBy);
        createdByValue = undefined;
      }
    } catch (err) {
      console.warn('⚠️ Could not convert createdBy to ObjectId:', createdBy);
      createdByValue = undefined;
    }
  }
  
  // Fetch organization name if not provided
  let organizationName = data.organizationName;
  if (!organizationName && data.organizationId) {
    organizationName = await fetchOrganizationName(data.organizationId);
    console.log('📝 Fetched organization name:', organizationName);
  }
  
  // Fetch university name if not provided
  let universityName = data.universityName;
  if (!universityName && data.universityId) {
    universityName = await fetchUniversityName(data.universityId);
    console.log('📝 Fetched university name:', universityName);
  }
  
  // Fetch course names if not provided
  let courseNames = data.courseNames;
  if ((!courseNames || courseNames.length === 0) && data.courseIds && data.courseIds.length > 0) {
    courseNames = await fetchCourseNames(data.courseIds);
    console.log('📝 Fetched course names:', courseNames);
  }
  
  // Ensure courseNames array length matches courseIds array length
  if (data.courseIds && data.courseIds.length > 0) {
    if (!courseNames || courseNames.length !== data.courseIds.length) {
      // Pad with empty strings or fill missing names
      if (!courseNames) courseNames = [];
      while (courseNames.length < data.courseIds.length) {
        courseNames.push(''); // Use empty string for courses where name wasn't found
      }
    }
  }
  
  const form = await Form.create({
    ...data,
    organizationName,
    universityName,
    courseNames,
    createdBy: createdByValue,
    status: data.status || 'draft',
    isLaunched: data.isLaunched || false,
    isActive: data.isActive !== undefined ? data.isActive : true
  });
  return form.toJSON();
}

export async function updateForm(formId: string, data: UpdateFormInput) {
  // If organizationId changed but organizationName not provided, fetch it
  let updateData = { ...data };
  if (data.organizationId && !data.organizationName) {
    const organizationName = await fetchOrganizationName(data.organizationId);
    if (organizationName) {
      updateData.organizationName = organizationName;
    }
  }
  
  // If universityId changed but universityName not provided, fetch it
  if (data.universityId && !data.universityName) {
    const universityName = await fetchUniversityName(data.universityId);
    if (universityName) {
      updateData.universityName = universityName;
    }
  }
  
  // If courseIds changed but courseNames not provided or mismatched, fetch them
  if (data.courseIds && (!data.courseNames || data.courseNames.length !== data.courseIds.length)) {
    const courseNames = await fetchCourseNames(data.courseIds);
    if (courseNames.length > 0) {
      // Pad to match courseIds length
      while (courseNames.length < data.courseIds.length) {
        courseNames.push('');
      }
      updateData.courseNames = courseNames;
    }
  }
  
  const form = await Form.findByIdAndUpdate(
    formId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  if (!form) throw new Error('FORM_NOT_FOUND');
  return form.toJSON();
}

export async function deleteForm(formId: string) {
  const form = await Form.findByIdAndDelete(formId);
  if (!form) throw new Error('FORM_NOT_FOUND');
  return { message: 'Form deleted successfully' };
}

export async function publishForm(formId: string) {
  return updateForm(formId, { status: 'published', isLaunched: true });
}

export async function archiveForm(formId: string) {
  return updateForm(formId, { status: 'archived', isActive: false });
}

export async function duplicateForm(formId: string, createdBy?: any) {
  const originalForm = await Form.findById(formId);
  if (!originalForm) throw new Error('FORM_NOT_FOUND');
  
  const formData: any = originalForm.toObject();
  delete formData._id;
  delete formData.id;
  delete formData.createdAt;
  delete formData.updatedAt;
  
  // Handle createdBy - it might be ObjectId, string, or number (from SSO)
  let createdByValue: Types.ObjectId | undefined;
  
  if (createdBy) {
    try {
      if (typeof createdBy === 'string' && /^[a-fA-F0-9]{24}$/.test(createdBy)) {
        createdByValue = new Types.ObjectId(createdBy);
      } else if (createdBy instanceof Types.ObjectId) {
        createdByValue = createdBy;
      } else {
        console.log('⚠️ Skipping createdBy for duplicate - not a valid ObjectId format:', createdBy);
        createdByValue = undefined;
      }
    } catch (err) {
      console.warn('⚠️ Could not convert createdBy to ObjectId:', createdBy);
      createdByValue = undefined;
    }
  }
  
  const duplicatedForm = await Form.create({
    ...formData,
    name: `${formData.name} (Copy)`,
    title: `${formData.title} (Copy)`,
    status: 'draft',
    isLaunched: false,
    createdBy: createdByValue
  });
  
  return duplicatedForm.toJSON();
}

export async function getFormByCourseId(courseId: string) {
  // Find forms where the courseId is in the courseIds array
  const forms = await Form.find({
    courseIds: courseId,
    isActive: true
  }).select('_id name title status').exec();
  
  if (!forms || forms.length === 0) {
    throw new Error('NO_FORM_FOUND_FOR_COURSE');
  }
  
  // Return the first published form, or the first form if no published form exists
  const publishedForm = forms.find(form => form.status === 'published');
  const selectedForm = publishedForm || forms[0];
  
  return {
    formId: selectedForm._id.toString(),
    name: selectedForm.name,
    title: selectedForm.title,
    status: selectedForm.status,
    allForms: forms.map(f => ({
      formId: f._id.toString(),
      name: f.name,
      title: f.title,
      status: f.status
    }))
  };
}

