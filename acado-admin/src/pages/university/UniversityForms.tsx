import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsList } from '@/components/forms/FormsList';
import { useFormsData } from '@/hooks/useFormsData';
import { ApplicationForm } from '@/types/application';
import { useAuth } from '@/hooks/useAuth';
import { coursesApi } from '@/api/courses.api';
import { Course } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

const UniversityForms = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const { forms, universities, courses: elmsCourses, deleteForm, updateForm } = useFormsData();
  
  const [universityCourses, setUniversityCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get admin's university ID
  const adminUniversityId = currentUser?.universityIds?.[0];
  const adminUniversityName = currentUser?.universityName;

  // Fetch courses from internal API filtered by university
  useEffect(() => {
    const fetchUniversityCourses = async () => {
      if (!adminUniversityId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching courses for university:', adminUniversityId);
        const coursesData = await coursesApi.list();
        
        // Filter courses by admin's university
        const filtered = coursesData.filter((course: Course) => 
          course.universityId === adminUniversityId || course.organizationId === adminUniversityId
        );
        
        console.log('Filtered courses:', filtered.length);
        
        // Map to format expected by FormsList
        const mappedCourses = filtered.map((course: Course) => ({
          id: course.id,
          name: course.name,
          universityId: course.universityId || course.organizationId,
          status: course.isActive !== false ? 'Active' : 'Inactive',
        }));
        
        setUniversityCourses(mappedCourses);
      } catch (error: any) {
        console.error('Failed to fetch university courses:', error);
        toast({
          title: 'Failed to load courses',
          description: error?.message || 'Could not load courses for forms.',
          variant: 'destructive',
        });
        setUniversityCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUniversityCourses();
    }
  }, [currentUser, adminUniversityId, toast]);
  
  // Filter forms to only show those associated with university's courses
  const universityForms = forms.filter((form: ApplicationForm) => {
    // If form has universityId, check it matches
    if (form.universityId) {
      return form.universityId === adminUniversityId;
    }
    
    // If form has courseIds, check if any course belongs to this university
    if (form.courseIds && form.courseIds.length > 0) {
      const universityCourseIds = universityCourses.map(c => String(c.id));
      return form.courseIds.some((courseId: string) => 
        universityCourseIds.includes(String(courseId))
      );
    }
    
    // Default: don't show if we can't determine
    return false;
  });

  const handleCreateNew = () => {
    navigate('/university/forms/new');
  };

  const handleEdit = (formId: string) => {
    navigate(`/university/forms/${formId}`);
  };

  const handleDelete = (formId: string) => {
    deleteForm(formId);
  };

  const handleUpdateForm = (formId: string, updates: Partial<ApplicationForm>) => {
    updateForm(formId, updates);
  };

  return (
    <div>
      <FormsList
        forms={universityForms}
        universities={universities}
        courses={universityCourses}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateForm={handleUpdateForm}
      />
    </div>
  );
};

export default UniversityForms;