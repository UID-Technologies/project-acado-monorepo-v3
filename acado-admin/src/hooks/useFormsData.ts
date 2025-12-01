import { useState, useEffect } from 'react';
import { ApplicationForm, University } from '@/types/application';
import { ElmsCourse } from '@/api/universities.api';
import { formsApi, universitiesApi } from '@/api';
import { useToast } from './use-toast';

export const useFormsData = () => {
  const [forms, setForms] = useState<ApplicationForm[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<ElmsCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log('📊 useFormsData: Starting to fetch forms and courses...');
        
        // Fetch forms first (required)
        console.log('📝 Fetching forms...');
        const formsData = await formsApi.getForms();
        console.log('✅ Forms fetched:', formsData);
        setForms(formsData.forms as unknown as ApplicationForm[]);
        
        // Fetch courses (optional - if fails, continue with empty array)
        try {
          console.log('📚 Fetching courses...');
          const coursesResponse = await universitiesApi.getCourses();
          console.log('✅ Courses fetched:', coursesResponse);
          
          // Extract courses from the new API response structure
          const coursesData = coursesResponse?.data?.programs?.data || [];
          console.log('📚 Extracted courses:', coursesData.length, 'courses');
          
          // Filter for active courses on client side
          const activeCourses = coursesData
            .filter((course: any) => 
              course.status === 'Active' || course.status === 'active'
            )
            .map((course: any) => ({
              ...course,
              // Add universityId alias if not present
              universityId: course.universityId || course.organization_id || course.university_id
            }));
          console.log('📚 Active courses:', activeCourses.length);
          setCourses(activeCourses);
        } catch (courseErr) {
          console.warn('⚠️ Failed to fetch courses (continuing with empty list):', courseErr);
          setCourses([]); // Set empty array if courses fail to load
        }
        
        // Fetch universities if available
        try {
          const universitiesResponse = await universitiesApi.getUniversities({ page: 1, pageSize: 100 });
          if (universitiesResponse?.data?.length) {
            setUniversities(
              universitiesResponse.data.map((uni) => ({
                id: uni.id,
                name: uni.name,
                country: uni.location?.country || '',
                logo: undefined,
                website: undefined,
                description: undefined,
                createdAt: uni.createdAt ? new Date(uni.createdAt) : new Date(),
              }))
            );
          } else {
            throw new Error('No universities returned from API');
          }
        } catch (uniErr) {
          console.warn('⚠️ Failed to fetch universities (falling back to local storage):', uniErr);
          const localUniversities = localStorage.getItem('acado_universities');
          if (localUniversities) {
            setUniversities(JSON.parse(localUniversities));
          } else {
            setUniversities([]);
          }
        }
        
        console.log('✅ useFormsData: Data loading complete');
      } catch (err: any) {
        setError(err as Error);
        console.error('❌ Failed to fetch forms data:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        toast({
          title: "Failed to load data",
          description: err.response?.data?.error || err.message || "Could not load forms and courses data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const createForm = async (form: any) => {
    try {
      console.log('📝 Creating form...');
      
      // Extract course names from courseIds if not provided
      let courseNames = form.courseNames;
      if ((!courseNames || courseNames.length === 0) && form.courseIds && form.courseIds.length > 0) {
        courseNames = form.courseIds.map((id: string) => {
          const course = courses.find(c => String(c.id) === String(id));
          return course?.name || '';
        }).filter((name: string) => name !== '');
      }
      
      // Extract university name if not provided
      let universityName = form.universityName;
      if (!universityName && form.universityId) {
        const university = universities.find(u => u.id === form.universityId);
        universityName = university?.name;
      }
      
      const newForm = await formsApi.createForm({
        name: form.name,
        title: form.name, // Use name as title for now
        description: form.description,
        organizationId: form.organizationId,
        organizationName: form.organizationName,
        universityId: form.universityId,
        universityName: universityName,
        courseIds: form.courseIds,
        courseNames: courseNames,
        fields: form.fields,
        customCategoryNames: form.customCategoryNames,
        status: form.status || 'draft',
        isLaunched: form.isLaunched || false,
        isActive: form.isActive !== undefined ? form.isActive : true,
      });
      setForms([...forms, newForm as unknown as ApplicationForm]);
      toast({
        title: "Success!",
        description: "Form created successfully.",
        variant: "default",
      });
      console.log('✅ Form created successfully');
      return newForm.id;
    } catch (err: any) {
      console.error('❌ Failed to create form:', err);
      toast({
        title: "Failed to create form",
        description: err?.response?.data?.error || err?.message || "An error occurred while creating the form.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateForm = async (formId: string, updates: any) => {
    try {
      console.log('📝 Updating form:', formId);
      
      // Extract course names from courseIds if not provided
      let courseNames = updates.courseNames;
      if ((!courseNames || courseNames.length === 0) && updates.courseIds && updates.courseIds.length > 0) {
        courseNames = updates.courseIds.map((id: string) => {
          const course = courses.find(c => String(c.id) === String(id));
          return course?.name || '';
        }).filter((name: string) => name !== '');
      }
      
      // Extract university name if not provided
      let universityName = updates.universityName;
      if (!universityName && updates.universityId) {
        const university = universities.find(u => u.id === updates.universityId);
        universityName = university?.name;
      }
      
      // Merge extracted names into updates
      const updatedData = {
        ...updates,
        courseNames,
        universityName
      };
      
      const updatedForm = await formsApi.updateForm(formId, updatedData);
      setForms(forms.map(form => 
        form.id === formId ? updatedForm as unknown as ApplicationForm : form
      ));
      toast({
        title: "Success!",
        description: "Form updated successfully.",
        variant: "default",
      });
      console.log('✅ Form updated successfully');
    } catch (err: any) {
      console.error('❌ Failed to update form:', err);
      toast({
        title: "Failed to update form",
        description: err?.response?.data?.error || err?.message || "An error occurred while updating the form.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteForm = async (formId: string) => {
    try {
      console.log('🗑️ Deleting form:', formId);
      await formsApi.deleteForm(formId);
      setForms(forms.filter(form => form.id !== formId));
      toast({
        title: "Form deleted",
        description: "Form has been deleted successfully.",
        variant: "default",
      });
      console.log('✅ Form deleted successfully');
    } catch (err: any) {
      console.error('❌ Failed to delete form:', err);
      console.error('Error details:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message
      });
      
      toast({
        title: "Failed to delete form",
        description: err?.response?.data?.error || err?.message || "An error occurred while deleting the form.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const publishForm = async (formId: string) => {
    try {
      const publishedForm = await formsApi.publishForm(formId);
      setForms(forms.map(form => 
        form.id === formId ? publishedForm as unknown as ApplicationForm : form
      ));
      toast({
        title: "Form published!",
        description: "Form has been published successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Failed to publish form:', err);
      toast({
        title: "Failed to publish form",
        description: err?.response?.data?.error || err?.message || "An error occurred while publishing the form.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const archiveForm = async (formId: string) => {
    try {
      const archivedForm = await formsApi.archiveForm(formId);
      setForms(forms.map(form => 
        form.id === formId ? archivedForm as unknown as ApplicationForm : form
      ));
      toast({
        title: "Form archived",
        description: "Form has been archived successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Failed to archive form:', err);
      toast({
        title: "Failed to archive form",
        description: err?.response?.data?.error || err?.message || "An error occurred while archiving the form.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const duplicateForm = async (formId: string) => {
    try {
      const duplicatedForm = await formsApi.duplicateForm(formId);
      setForms([...forms, duplicatedForm as unknown as ApplicationForm]);
      toast({
        title: "Form duplicated!",
        description: "Form has been duplicated successfully.",
        variant: "default",
      });
      return duplicatedForm.id;
    } catch (err: any) {
      console.error('Failed to duplicate form:', err);
      toast({
        title: "Failed to duplicate form",
        description: err?.response?.data?.error || err?.message || "An error occurred while duplicating the form.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getFormById = (formId: string) => {
    return forms.find(form => form.id === formId);
  };

  return {
    forms,
    universities,
    courses,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    publishForm,
    archiveForm,
    duplicateForm,
    getFormById,
  };
};