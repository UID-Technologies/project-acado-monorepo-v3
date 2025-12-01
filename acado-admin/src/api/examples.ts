/**
 * API Usage Examples
 * 
 * This file contains example implementations showing how to use the API client
 * in different scenarios. These are for reference only and should not be imported.
 */

import { 
  authApi, 
  formsApi, 
  universitiesApi, 
  applicationsApi, 
  portfolioApi, 
  masterFieldsApi,
  axiosInstance 
} from '@/api';

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Example: User Login
 */
export const exampleLogin = async () => {
  try {
    const response = await authApi.login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    // Store token and user data from response.data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Example: User Signup
 */
export const exampleSignup = async () => {
  try {
    const response = await authApi.signup({
      email: 'newuser@example.com',
      password: 'securePassword123',
      name: 'John Doe'
    });
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response.user;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

/**
 * Example: Logout
 */
export const exampleLogout = async () => {
  try {
    await authApi.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout failed:', error);
    // Clear local storage anyway
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ============================================================================
// FORMS EXAMPLES
// ============================================================================

/**
 * Example: Fetch all forms
 */
export const exampleGetForms = async () => {
  try {
    const forms = await formsApi.getForms();
    console.log('Forms:', forms);
    return forms;
  } catch (error) {
    console.error('Failed to fetch forms:', error);
    throw error;
  }
};

/**
 * Example: Create a new form
 */
export const exampleCreateForm = async () => {
  try {
    const newForm = await formsApi.createForm({
      title: 'Application Form',
      description: 'University application form',
      fields: [
        {
          id: '1',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: '2',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'your.email@example.com'
        },
        {
          id: '3',
          label: 'Program',
          type: 'select',
          required: true,
          options: ['Computer Science', 'Business', 'Engineering']
        }
      ]
    });
    
    console.log('Created form:', newForm);
    return newForm;
  } catch (error) {
    console.error('Failed to create form:', error);
    throw error;
  }
};

/**
 * Example: Update a form
 */
export const exampleUpdateForm = async (formId: string) => {
  try {
    const updatedForm = await formsApi.updateForm(formId, {
      title: 'Updated Application Form',
      status: 'published'
    });
    
    return updatedForm;
  } catch (error) {
    console.error('Failed to update form:', error);
    throw error;
  }
};

// ============================================================================
// UNIVERSITIES EXAMPLES
// ============================================================================

/**
 * Example: Fetch universities
 */
export const exampleGetUniversities = async () => {
  try {
    const universities = await universitiesApi.getUniversities();
    return universities;
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    throw error;
  }
};

/**
 * Example: Create university
 */
export const exampleCreateUniversity = async () => {
  try {
    const university = await universitiesApi.createUniversity({
      name: 'Tech University',
      description: 'Leading technology university',
      location: 'New York, USA',
      website: 'https://techuni.edu'
    });
    
    return university;
  } catch (error) {
    console.error('Failed to create university:', error);
    throw error;
  }
};

/**
 * Example: Create course for university
 */
export const exampleCreateCourse = async (universityId: string) => {
  try {
    const course = await universitiesApi.createCourse(universityId, {
      name: 'Computer Science',
      description: 'Bachelor of Science in Computer Science',
      duration: '4 years',
      fee: 50000,
      requirements: ['High School Diploma', 'SAT Score 1200+']
    });
    
    return course;
  } catch (error) {
    console.error('Failed to create course:', error);
    throw error;
  }
};

// ============================================================================
// APPLICATIONS EXAMPLES
// ============================================================================

/**
 * Example: Submit application
 */
export const exampleSubmitApplication = async () => {
  try {
    const application = await applicationsApi.createApplication({
      courseId: 'course-123',
      universityId: 'uni-456',
      data: {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        program: 'Computer Science',
        statement: 'I am passionate about technology...',
        gpa: 3.8
      }
    });
    
    console.log('Application submitted:', application);
    return application;
  } catch (error) {
    console.error('Failed to submit application:', error);
    throw error;
  }
};

/**
 * Example: Get my applications
 */
export const exampleGetMyApplications = async () => {
  try {
    const applications = await applicationsApi.getMyApplications();
    return applications;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    throw error;
  }
};

/**
 * Example: Review application (University admin)
 */
export const exampleReviewApplication = async (applicationId: string) => {
  try {
    const reviewed = await applicationsApi.reviewApplication(applicationId, {
      status: 'accepted',
      notes: 'Excellent application. Strong academic background.'
    });
    
    return reviewed;
  } catch (error) {
    console.error('Failed to review application:', error);
    throw error;
  }
};

// ============================================================================
// PORTFOLIO EXAMPLES
// ============================================================================

/**
 * Example: Get my portfolio
 */
export const exampleGetPortfolio = async () => {
  try {
    const portfolio = await portfolioApi.getMyPortfolio();
    return portfolio;
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    throw error;
  }
};

/**
 * Example: Add education to portfolio
 */
export const exampleAddEducation = async () => {
  try {
    const education = await portfolioApi.addEducation({
      institution: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2018-09-01',
      endDate: '2022-05-31',
      description: 'Focused on AI and Machine Learning'
    });
    
    return education;
  } catch (error) {
    console.error('Failed to add education:', error);
    throw error;
  }
};

/**
 * Example: Add experience to portfolio
 */
export const exampleAddExperience = async () => {
  try {
    const experience = await portfolioApi.addExperience({
      company: 'Tech Corp',
      position: 'Software Engineer',
      startDate: '2022-06-01',
      current: true,
      description: 'Developing web applications using React and Node.js',
      location: 'San Francisco, CA'
    });
    
    return experience;
  } catch (error) {
    console.error('Failed to add experience:', error);
    throw error;
  }
};

/**
 * Example: Add skills to portfolio
 */
export const exampleAddSkills = async () => {
  const skills = [
    { name: 'JavaScript', level: 'Expert', category: 'Programming' },
    { name: 'React', level: 'Advanced', category: 'Frontend' },
    { name: 'Node.js', level: 'Advanced', category: 'Backend' }
  ];
  
  try {
    const addedSkills = await Promise.all(
      skills.map(skill => portfolioApi.addSkill(skill))
    );
    
    return addedSkills;
  } catch (error) {
    console.error('Failed to add skills:', error);
    throw error;
  }
};

// ============================================================================
// MASTER FIELDS EXAMPLES
// ============================================================================

/**
 * Example: Get all master fields
 */
export const exampleGetMasterFields = async () => {
  try {
    const fields = await masterFieldsApi.getMasterFields();
    return fields;
  } catch (error) {
    console.error('Failed to fetch master fields:', error);
    throw error;
  }
};

/**
 * Example: Create master field
 */
export const exampleCreateMasterField = async () => {
  try {
    const field = await masterFieldsApi.createMasterField({
      name: 'Graduation Year',
      type: 'select',
      category: 'Education',
      subcategory: 'Academic',
      options: ['2023', '2024', '2025', '2026'],
      validation: {
        required: true
      }
    });
    
    return field;
  } catch (error) {
    console.error('Failed to create master field:', error);
    throw error;
  }
};

/**
 * Example: Create category
 */
export const exampleCreateCategory = async () => {
  try {
    const category = await masterFieldsApi.createCategory({
      name: 'Personal Information',
      description: 'Basic personal details'
    });
    
    return category;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
};

// ============================================================================
// CUSTOM REQUEST EXAMPLE
// ============================================================================

/**
 * Example: Custom API request using axios instance
 */
export const exampleCustomRequest = async () => {
  try {
    // GET request
    const getData = await axiosInstance.get('/custom/endpoint');
    
    // POST request
    const postData = await axiosInstance.post('/custom/endpoint', {
      key: 'value'
    });
    
    // PUT request
    const putData = await axiosInstance.put('/custom/endpoint/123', {
      updated: 'data'
    });
    
    // DELETE request
    await axiosInstance.delete('/custom/endpoint/123');
    
    return { getData, postData, putData };
  } catch (error) {
    console.error('Custom request failed:', error);
    throw error;
  }
};

// ============================================================================
// REACT HOOK EXAMPLE
// ============================================================================

/**
 * Example: Custom React Hook for data fetching
 */
/*
import { useState, useEffect } from 'react';
import { formsApi, Form } from '@/api';

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const data = await formsApi.getForms();
        setForms(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const createForm = async (formData: any) => {
    const newForm = await formsApi.createForm(formData);
    setForms(prev => [...prev, newForm]);
    return newForm;
  };

  const updateForm = async (formId: string, formData: any) => {
    const updatedForm = await formsApi.updateForm(formId, formData);
    setForms(prev => prev.map(f => f.id === formId ? updatedForm : f));
    return updatedForm;
  };

  const deleteForm = async (formId: string) => {
    await formsApi.deleteForm(formId);
    setForms(prev => prev.filter(f => f.id !== formId));
  };

  return { 
    forms, 
    loading, 
    error, 
    createForm, 
    updateForm, 
    deleteForm 
  };
};
*/

