import { useState, useEffect } from "react";
import type React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountrySelect } from "@/components/ui/country-select";
import { StateSelect } from "@/components/ui/state-select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  Check, 
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Home,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Award,
  Building,
  Languages,
  Target,
  Info,
  Upload,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Loader2,
  AlertCircle,
  File,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { ApplicationField } from "@/types/application";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";
import { toast } from "sonner";
import { formsApi, Form, ConfiguredField } from "@/api/forms.api";
import { applicationsApi } from "@/api/applications.api";
import { universitiesApi } from "@/api/universities.api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUploadField } from "@/components/forms/FileUploadField";

const ApplicationWizard = () => {
  // Get form ID from URL parameter
  const { formId } = useParams<{ formId: string }>();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const { portfolio } = usePortfolio();
  
  // API state
  const [form, setForm] = useState<Form | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invalidFormId, setInvalidFormId] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]); // Start with empty, will be set when data loads
  const [portfolioDataLoaded, setPortfolioDataLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationStartTime] = useState<number>(Date.now());
  
  // Get organization name from logged-in user (from SSO auto-login)
  const getUserOrganizationName = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.universityName || user.organizationName || user.organization_name || "University";
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    return "University";
  };
  
  const organizationName = getUserOrganizationName();
  
  // Get course info from navigation state
  const courseInfo = location.state || {
    courseName: form?.title || "Course Application",
    universityName: organizationName
  };

  // Fetch form data on mount
  useEffect(() => {
    const fetchForm = async () => {
      // Validate form ID exists
      if (!formId || formId.trim() === '') {
        console.error('❌ No form ID provided in URL');
        setError('Missing form ID. Please provide a valid form ID in the URL.');
        setInvalidFormId(true);
        setLoading(false);
        return;
      }

      // Validate form ID format (MongoDB ObjectId format: 24 hex characters)
      const objectIdRegex = /^[a-fA-F0-9]{24}$/;
      if (!objectIdRegex.test(formId)) {
        console.error('❌ Invalid form ID format:', formId);
        setError(`Invalid form ID format: "${formId}". Form ID must be a valid 24-character hexadecimal string.`);
        setInvalidFormId(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setInvalidFormId(false);
        
        console.log('✅ Fetching form with ID:', formId);
        const formData = await formsApi.getFormById(formId);
        console.log('✅ Form data received:', formData);
        console.log('Sample field with enriched data:', formData.fields[0]);

        setForm(formData);

        // Keep raw course IDs; learner dashboard uses these for submissions
        setCourses(
          Array.isArray(formData.courseIds) ? formData.courseIds.map((id) => ({ id })) : []
        );

        // Set first category as expanded by default
        if (formData.fields.length > 0) {
          const firstCategory = formData.fields[0].categoryId;
          setExpandedGroups([firstCategory]);
        }
      } catch (err: any) {
        console.error('❌ Error fetching form:', err);
        
        // Check if it's a 404 - form not found
        if (err.response?.status === 404) {
          setError(`Form not found. The form with ID "${formId}" does not exist or has been deleted.`);
          setInvalidFormId(true);
        } else {
          setError(err.response?.data?.error || err.message || 'Failed to load form. Please try again later.');
          setInvalidFormId(true);
        }
        
        toastHook({
          title: "Error Loading Form",
          description: err.response?.status === 404 
            ? `Form with ID "${formId}" not found` 
            : "Failed to load form. Please check the form ID and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, toastHook]);

  // Helper function to get icon based on category
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, any> = {
      personal: User,
      education: GraduationCap,
      professional: Briefcase,
      experience: Briefcase,
      documents: FileText,
      additional: Info,
    };
    return iconMap[categoryId.toLowerCase()] || FileText;
  };

  // Helper function to get color based on category
  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      personal: "from-blue-500 to-purple-600",
      education: "from-green-500 to-cyan-600",
      professional: "from-orange-500 to-red-600",
      experience: "from-orange-500 to-red-600",
      documents: "from-teal-500 to-violet-600",
      additional: "from-violet-500 to-pink-600",
    };
    return colorMap[categoryId.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  // Build wizard steps dynamically from form fields
  const buildWizardSteps = () => {
    if (!form) return [];

    console.log('Building wizard steps from form:', form);
    console.log('Total fields:', form.fields.length);
    console.log('Visible fields:', form.fields.filter(f => f.isVisible).length);
    
    // Log category names for debugging
    const uniqueCategoryNames = Array.from(new Set(
      form.fields.filter(f => f.isVisible).map(f => `${f.categoryId} -> ${f.categoryName || 'N/A'}`)
    ));
    console.log('Category ID -> Name mappings:', uniqueCategoryNames);

    // Group fields by category
    const fieldsByCategory = form.fields
      .filter(field => field.isVisible)
      .sort((a, b) => a.order - b.order)
      .reduce((acc, field) => {
        const category = field.categoryId;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(field);
        return acc;
      }, {} as Record<string, ConfiguredField[]>);

    console.log('Fields grouped by category:', Object.keys(fieldsByCategory));

    // Convert to wizard steps - one step per category
    const steps = Object.entries(fieldsByCategory).map(([categoryId, fields], index) => {
      const customCategoryName = form.customCategoryNames?.[categoryId];
      // Use categoryName from first field if available, otherwise use custom name or ID
      const firstFieldCategoryName = fields[0]?.categoryName;
      const categoryTitle = customCategoryName?.name || firstFieldCategoryName || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
      
      console.log(`Category ${categoryId} (${categoryTitle}): ${fields.length} fields`);
      
      return {
        id: `step-${categoryId}`,
        title: categoryTitle,
        subtitle: `Complete your ${categoryTitle.toLowerCase()} information`,
        icon: getCategoryIcon(categoryId),
        fields: fields.map(f => ({
          id: f.fieldId || f.name,
          name: f.name,
          label: f.customLabel || f.label,
          type: f.type as any, // Type assertion for compatibility
          placeholder: f.placeholder || '',
          required: f.isRequired,
          options: f.options || [],
          description: f.description || '',
          validation: f.validation || [],
          categoryId: f.categoryId,
          subcategoryId: f.subcategoryId || '',
          order: f.order
        } as ApplicationField)),
        color: getCategoryColor(categoryId),
        group: categoryId,
        categoryName: categoryTitle // Store the display name
      };
    });

    // Add review step at the end
    steps.push({
      id: "review",
      title: "Review & Submit",
      subtitle: "Check your application before submitting",
      icon: CheckCircle2,
      fields: [],
      color: "from-slate-500 to-slate-600",
      group: "review",
      categoryName: "Review & Submit"
    });

    console.log('Total wizard steps created:', steps.length);
    return steps;
  };

  const wizardSteps = buildWizardSteps();

  // Build wizard groups dynamically from steps
  const buildWizardGroups = () => {
    if (wizardSteps.length === 0) return [];

    // Get unique groups from wizard steps
    const uniqueGroups = Array.from(new Set(wizardSteps.map(step => step.group)));
    
    return uniqueGroups.map(groupId => {
      const firstStepInGroup = wizardSteps.find(step => step.group === groupId);
      const customCategoryName = form?.customCategoryNames?.[groupId];
      // Use categoryName from step if available
      const groupTitle = (firstStepInGroup as any)?.categoryName || customCategoryName?.name || groupId.charAt(0).toUpperCase() + groupId.slice(1);
      
      return {
        id: groupId,
        title: groupTitle,
        icon: getCategoryIcon(groupId),
        description: `Complete ${groupTitle.toLowerCase()} section`,
        color: getCategoryColor(groupId)
      };
    });
  };

  const wizardGroups = buildWizardGroups();

  const currentStepData = wizardSteps[currentStep] || wizardSteps[0];
  const progress = wizardSteps.length > 0 ? ((currentStep + 1) / wizardSteps.length) * 100 : 0;

  // Map portfolio data to form fields
  const mapPortfolioToFormData = () => {
    const mappedData: Record<string, any> = {};
    
    // Map personal information
    if (portfolio.firstName) mappedData.firstName = portfolio.firstName;
    if (portfolio.lastName) mappedData.lastName = portfolio.lastName;
    if (portfolio.email) mappedData.email = portfolio.email;
    if (portfolio.phone) mappedData.phone = portfolio.phone;
    if (portfolio.about) mappedData.personalStatement = portfolio.about;
    
    // Map education information
    if (portfolio.education.length > 0) {
      const latestEducation = portfolio.education[0];
      mappedData.currentDegree = latestEducation.degree;
      mappedData.currentUniversity = latestEducation.institution;
      mappedData.educationLevel = latestEducation.degree.includes('Bachelor') ? 'undergraduate' : 
                                  latestEducation.degree.includes('Master') ? 'graduate' : 'other';
      
      // Map all education to previous education
      const previousEducation = portfolio.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.endDate ? new Date(edu.endDate).getFullYear().toString() : '',
        grade: edu.grade
      }));
      
      if (previousEducation.length > 0) {
        mappedData.previousEducation = JSON.stringify(previousEducation);
      }
    }
    
    // Map work experience
    if (portfolio.experience.length > 0) {
      const workExperience = portfolio.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        duration: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
        description: exp.description
      }));
      mappedData.workExperience = JSON.stringify(workExperience);
      mappedData.yearsOfExperience = portfolio.experience.length.toString();
    }
    
    // Map skills
    if (portfolio.skills.length > 0) {
      mappedData.technicalSkills = portfolio.skills
        .filter(s => s.category === 'technical' || s.category === 'programming')
        .map(s => s.name).join(', ');
      mappedData.softSkills = portfolio.skills
        .filter(s => s.category === 'soft' || s.category === 'interpersonal')
        .map(s => s.name).join(', ');
    }
    
    // Map languages
    if (portfolio.languages.length > 0) {
      mappedData.languageSkills = portfolio.languages
        .map(lang => `${lang.name} (${lang.proficiency})`)
        .join(', ');
    }
    
    // Map certifications
    if (portfolio.certifications.length > 0) {
      mappedData.certifications = portfolio.certifications
        .map(cert => `${cert.name} - ${cert.issuer}`)
        .join(', ');
    }
    
    // Map projects
    if (portfolio.projects.length > 0) {
      mappedData.projects = JSON.stringify(portfolio.projects.map(proj => ({
        title: proj.title,
        description: proj.description,
        technologies: proj.technologies.join(', ')
      })));
    }
    
    // Map volunteering
    if (portfolio.volunteering.length > 0) {
      mappedData.extracurricular = portfolio.volunteering
        .map(vol => `${vol.role} at ${vol.organization}`)
        .join(', ');
    }
    
    return mappedData;
  };

  // Load portfolio data on component mount
  useEffect(() => {
    if (portfolio && !portfolioDataLoaded) {
      const mappedData = mapPortfolioToFormData();
      if (Object.keys(mappedData).length > 0) {
        setFormData(prev => ({
          ...mappedData,
          ...prev // Keep any existing form data
        }));
        setPortfolioDataLoaded(true);
        
        // Show notification that portfolio data has been loaded
        toast("✅ Portfolio data loaded! Your information has been pre-filled. You can still edit any field.");
      }
    }
  }, [portfolio, portfolioDataLoaded]);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    // RFC 5322 compliant email regex (simplified but robust)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateStep = () => {
    const stepErrors: Record<string, string> = {};
    const currentFields = currentStepData.fields;
    
    currentFields.forEach(field => {
      const fieldValue = formData[field.name];
      
      // Check required fields
      if (field.required && (!fieldValue || (typeof fieldValue === 'string' && !fieldValue.trim()))) {
        stepErrors[field.name] = `${field.label} is required`;
      }
      
      // Validate email format if field is email type and has a value
      if (field.type === 'email' && fieldValue) {
        const emailValue = typeof fieldValue === 'string' ? fieldValue.trim() : String(fieldValue);
        if (emailValue && !isValidEmail(emailValue)) {
          stepErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (fieldName: string, value: any, fieldType?: string) => {
    // Always update form data
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Validate email in real-time if it's an email field
    if (fieldType === 'email' && value) {
      const emailValue = typeof value === 'string' ? value.trim() : String(value);
      if (emailValue && !isValidEmail(emailValue)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'Please enter a valid email address'
        }));
      } else {
        // Clear email error if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      // Clear error for non-email fields if they have a value
      if (errors[fieldName] && value) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const handleNext = () => {
    if (currentStep === wizardSteps.length - 1) {
      handleSubmit();
      return;
    }
    
    if (validateStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toastHook({
        title: "Please complete required fields",
        description: "Fill in all required fields before proceeding",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (index: number) => {
    // Allow navigation to completed steps or current step
    if (index <= currentStep || completedSteps.includes(index)) {
      setCurrentStep(index);
      
      // Auto-expand the group containing the selected step
      const stepGroup = wizardSteps[index].group;
      if (stepGroup && !expandedGroups.includes(stepGroup)) {
        setExpandedGroups(prev => [...prev, stepGroup]);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProgress = () => {
    const applicationData = {
      formId,
      courseInfo,
      formData,
      currentStep,
      completedSteps,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`application_${formId}`, JSON.stringify(applicationData));
    
    toastHook({
      title: "Progress Saved",
      description: "Your application has been saved. You can continue later.",
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Get user info from localStorage
      const userStr = localStorage.getItem('user');
      const userAuthStr = localStorage.getItem('userAuth');
      const ssoToken = (() => {
        try {
          const parsed = userAuthStr ? JSON.parse(userAuthStr) : null;
          return parsed?.sso_token || null;
        } catch {
          return null;
        }
      })();
      
      let userId = '';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || user.email || '';
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      } else if (userAuthStr) {
        try {
          const userAuth = JSON.parse(userAuthStr);
          userId = userAuth.email || '';
        } catch (e) {
          console.error('Error parsing userAuth:', e);
        }
      }

      // Prefer sub from SSO token if available
      if (ssoToken) {
        try {
          const decoded: any = JSON.parse(atob(ssoToken.split('.')[1]));
          if (decoded?.sub) {
            userId = decoded.sub;
          }
        } catch {
          // ignore decode errors
        }
      }
      
      // Calculate completion time
      const completionTime = Math.floor((Date.now() - applicationStartTime) / 1000);
      
      // Get university and course IDs from courseInfo or state
      const universityId = courseInfo.universityId || undefined;
      const courseId = courseInfo.courseId || undefined;
      
      // Validate required fields before submission
      if (!formId || !formId.trim()) {
        throw new Error('Form ID is missing. Please refresh the page and try again.');
      }
      
      if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
        throw new Error('Form data is empty. Please fill out the form before submitting.');
      }
      
      const trimmedUserId = userId && String(userId).trim();
      if (!trimmedUserId || trimmedUserId === '') {
        console.warn('⚠️ No userId found, using anonymous');
      }
      
      // Create application data
      const applicationData: any = {
        userId: trimmedUserId || 'anonymous',
        formId: formId.trim(),
        formData: formData,
        status: 'submitted' as const,
        metadata: {
          completionTime: completionTime
        }
      };
      
      // Only include optional fields if they exist
      if (universityId && String(universityId).trim()) {
        applicationData.universityId = String(universityId).trim();
      }
      if (courseId && String(courseId).trim()) {
        applicationData.courseId = String(courseId).trim();
      }
      
      console.log('📤 Submitting application:', {
        userId: applicationData.userId,
        userIdLength: applicationData.userId?.length,
        formId: applicationData.formId,
        formIdLength: applicationData.formId?.length,
        hasFormData: !!applicationData.formData,
        formDataCount: Object.keys(applicationData.formData).length,
        formDataKeys: Object.keys(applicationData.formData).slice(0, 10), // First 10 keys
        status: applicationData.status,
        hasMetadata: !!applicationData.metadata,
        metadataCompletionTime: applicationData.metadata?.completionTime,
        universityId: applicationData.universityId,
        courseId: applicationData.courseId,
        fullPayload: JSON.stringify(applicationData, null, 2)
      });
      
      // Submit to API
      const result = await applicationsApi.createApplication(applicationData);
      
      console.log('Application submitted successfully:', result);
      
      // Remove saved draft
      localStorage.removeItem(`application_${formId}`);
      
      // Show success toast
      toastHook({
        title: "Application Submitted!",
        description: "Redirecting to confirmation page...",
      });
      
      // Navigate to success page with application data
      setTimeout(() => {
        navigate(`/user/application/success/${result.id || result._id}`, {
          state: { application: result },
          replace: true
        });
      }, 1000);
      
    } catch (err: any) {
      console.error('❌ Error submitting application:', {
        error: err,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        request: {
          userId: applicationData.userId,
          formId: applicationData.formId,
          hasFormData: !!applicationData.formData,
          formDataKeys: applicationData.formData ? Object.keys(applicationData.formData) : [],
          status: applicationData.status,
          metadata: applicationData.metadata
        }
      });
      
      const apiError = err.response?.data;
      const status = err.response?.status;
      
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (status === 422 || status === 400) {
        // Validation error (422 Unprocessable Entity or 400 Bad Request)
        const validationDetails = apiError?.details;
        const rawErrors = apiError?.errors; // Raw Zod errors array
        
        // Try to parse raw Zod errors first (most detailed)
        if (rawErrors && Array.isArray(rawErrors) && rawErrors.length > 0) {
          const errorMessages: string[] = [];
          rawErrors.forEach((error: any) => {
            const path = error.path?.join('.') || 'unknown';
            const message = error.message || 'Validation failed';
            errorMessages.push(`${path}: ${message}`);
          });
          if (errorMessages.length > 0) {
            errorMessage = `Validation failed: ${errorMessages.join('; ')}`;
          }
        }
        
        // Fallback to flattened error structure
        if (!errorMessage || errorMessage === 'Failed to submit application. Please try again.') {
          if (validationDetails) {
            // Check for Zod flattened error structure
            const bodyErrors = validationDetails?.body || validationDetails;
            
            if (bodyErrors && typeof bodyErrors === 'object') {
              // Extract field errors from Zod structure
              const fieldIssues: string[] = [];
              
              // Zod error can be in different formats
              if (bodyErrors._errors && bodyErrors._errors.length > 0) {
                fieldIssues.push(...bodyErrors._errors);
              }
              
              // Check for field-specific errors
              Object.keys(bodyErrors).forEach(key => {
                if (key !== '_errors' && bodyErrors[key]) {
                  const fieldError = bodyErrors[key];
                  if (fieldError._errors && fieldError._errors.length > 0) {
                    fieldIssues.push(`${key}: ${fieldError._errors.join(', ')}`);
                  }
                }
              });
              
              if (fieldIssues.length > 0) {
                errorMessage = `Validation failed: ${fieldIssues.join('; ')}`;
              } else {
                errorMessage = 'Validation failed. Please check all required fields are filled correctly.';
              }
            } else if (typeof validationDetails === 'string') {
              errorMessage = validationDetails;
            }
          }
        }
        
        if (apiError?.error === 'VALIDATION_ERROR') {
          // Backend validation error format
          if (!errorMessage || errorMessage === 'Failed to submit application. Please try again.') {
            errorMessage = 'Validation failed. Please check all required fields are filled correctly.';
          }
        }
        
        console.error('❌ Validation errors:', {
          status,
          apiError,
          validationDetails,
          rawErrors: apiError?.errors, // Raw Zod errors
          bodyErrors: validationDetails?.body,
          flattened: JSON.stringify(validationDetails, null, 2),
          rawResponse: err.response?.data
        });
      } else if (status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (status === 403) {
        errorMessage = 'Access denied. You do not have permission to submit applications.';
      } else if (apiError?.error) {
        errorMessage = apiError.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toastHook({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Load saved progress if exists
  useEffect(() => {
    if (!form || wizardSteps.length === 0) return;
    
    const savedData = localStorage.getItem(`application_${formId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData || {});
      setCurrentStep(parsed.currentStep || 0);
      setCompletedSteps(parsed.completedSteps || []);
      
      // Expand the group containing the current step
      const stepIndex = parsed.currentStep || 0;
      if (wizardSteps[stepIndex]) {
        const currentGroup = wizardSteps[stepIndex].group;
        if (currentGroup) {
          setExpandedGroups([currentGroup]);
        }
      }
      
      toastHook({
        title: "Progress Restored",
        description: "Your previous progress has been loaded.",
      });
    }
  }, [formId, form, wizardSteps.length, toastHook]);
  
  // Auto-expand current step's group when step changes
  useEffect(() => {
    if (wizardSteps.length === 0 || !wizardSteps[currentStep]) return;
    
    const currentGroup = wizardSteps[currentStep].group;
    if (currentGroup && !expandedGroups.includes(currentGroup)) {
      setExpandedGroups(prev => [...prev, currentGroup]);
    }
  }, [currentStep, wizardSteps.length]);

  const renderField = (field: ApplicationField) => {
    const value = formData[field.name] || "";
    const hasError = errors[field.name];
    
    // Handle state field - check by name as well as type for backward compatibility
    // Check if field is state by type OR by name (handles "state", "location.state", etc.)
    const isStateField = field.type === "state" || 
      (field.type === "text" && (field.name === "state" || field.name.endsWith(".state") || field.name === "location.state"));
    
    if (isStateField) {
      const countryValue = formData.country || '';
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <StateSelect
            id={field.id}
            value={value || ''}
            onValueChange={(val) => handleInputChange(field.name, val)}
            placeholder={field.placeholder || "Select state/province"}
            required={field.required}
            countryName={countryValue}
            className={cn(
              hasError && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {hasError && (
            <p className="text-sm text-destructive">{errors[field.name]}</p>
          )}
          {field.description && !hasError && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </div>
      );
    }
    
    switch (field.type) {
      case "text":
      case "tel":
      case "url":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={() => {
                // Validate on blur for better UX
                if (field.required && !formData[field.name]) {
                  setErrors(prev => ({
                    ...prev,
                    [field.name]: `${field.label} is required`
                  }));
                }
              }}
              required={field.required}
              className={cn(
                "transition-all",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "email":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="email"
              placeholder={field.placeholder || "your.email@example.com"}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value, 'email')}
              onBlur={(e) => {
                const emailValue = e.target.value.trim();
                // Validate on blur
                if (field.required && !emailValue) {
                  setErrors(prev => ({
                    ...prev,
                    [field.name]: `${field.label} is required`
                  }));
                } else if (emailValue && !isValidEmail(emailValue)) {
                  setErrors(prev => ({
                    ...prev,
                    [field.name]: 'Please enter a valid email address'
                  }));
                }
              }}
              required={field.required}
              className={cn(
                "transition-all",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              rows={4}
              className={cn(
                "transition-all resize-none",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "country":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <CountrySelect
              id={field.id}
              value={value || ''}
              onValueChange={(val) => {
                handleInputChange(field.name, val);
                // Clear state when country changes
                if (formData.state) {
                  handleInputChange('state', '');
                }
              }}
              placeholder={field.placeholder || "Select country"}
              required={field.required}
              showFlag={true}
              className={cn(
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
              <SelectTrigger className={cn(
                hasError && "border-destructive focus-visible:ring-destructive"
              )}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "checkbox":
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={value === true}
                onCheckedChange={(checked) => handleInputChange(field.name, checked)}
              />
              <Label htmlFor={field.id} className="font-normal cursor-pointer">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
            </div>
            {hasError && (
              <p className="text-sm text-destructive ml-6">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
            )}
          </div>
        );
        
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className={cn(
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
              case "file":
          return (
            <FileUploadField
              key={field.id}
              id={field.id}
              name={field.name}
              label={field.label}
              required={field.required}
              description={field.description}
              value={typeof value === 'string' ? value : ''}
              error={hasError ? errors[field.name] : undefined}
              onChange={(fieldName, fileUrl, fileName) => {
                handleInputChange(fieldName, fileUrl);
              }}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={5 * 1024 * 1024} // 5MB
            />
          );
        
      default:
        return null;
    }
  };

  const renderReviewStep = () => {
    const filledSections = wizardSteps.slice(0, -1).filter((step, index) => 
      completedSteps.includes(index)
    );
    
    // Get all filled fields data organized by category
    const getFilledFieldsByCategory = () => {
      const fieldsByCategory: Record<string, Array<{ field: ConfiguredField; value: any }>> = {};
      
      if (!form) return fieldsByCategory;
      
      form.fields.forEach(field => {
        const value = formData[field.name];
        if (value !== undefined && value !== null && value !== '') {
          const categoryId = field.categoryId;
          if (!fieldsByCategory[categoryId]) {
            fieldsByCategory[categoryId] = [];
          }
          fieldsByCategory[categoryId].push({ field, value });
        }
      });
      
      return fieldsByCategory;
    };
    
          const filledFieldsByCategory = getFilledFieldsByCategory();
      
      // Format field value for display - returns JSX for file fields, string for others
      const formatFieldValue = (field: ConfiguredField, value: any): string | React.ReactNode => {
        // Handle file fields with preview
        if (field.type === 'file' && value) {
          const fileUrl = typeof value === 'string' ? value : '';
          if (!fileUrl) return 'No file uploaded';
          
          const fileName = fileUrl.split('/').pop() || 'file';
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
          const isPdf = /\.pdf$/i.test(fileName);
          
          return (
            <div className="flex items-center gap-3 p-2 border rounded-lg bg-muted/30">
              {isImage ? (
                <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden border bg-muted">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Hide image and show icon on error
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector('.error-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'error-fallback h-full w-full flex items-center justify-center bg-muted';
                        fallback.innerHTML = '<svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-16 w-16 flex-shrink-0 rounded border flex items-center justify-center bg-muted">
                  {isPdf ? (
                    <FileText className="h-8 w-8 text-red-500" />
                  ) : (
                    <File className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  View file
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        }
        
        // Handle other field types
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        if (typeof value === 'boolean') {
          return value ? 'Yes' : 'No';
        }
        if (field.type === 'date' && value) {
          try {
            return new Date(value).toLocaleDateString();
          } catch {
            return value;
          }
        }
        return value?.toString() || '';
      };
    
    return (
      <div className="space-y-6">
        {/* Application Summary Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3">Application Summary</h3>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><span className="font-medium">Form:</span> {form?.title || form?.name || 'Application Form'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><span className="font-medium">University:</span> {organizationName}</span>
            </div>
            {courses.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Course{courses.length > 1 ? 's' : ''}:</span>
                </div>
                <div className="ml-6 space-y-1">
                  {courses
                    .filter(course => course && course.name) // Filter out null/undefined courses
                    .map((course, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        • {course.name} {course.level ? `(${course.level})` : ''}
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {filledSections.length} of {wizardSteps.length - 1} sections completed
              </span>
            </div>
          </div>
        </div>
        
        {/* Completed Sections with Data */}
        <div className="space-y-4">
          <h4 className="font-semibold text-base">Your Information</h4>
          {wizardSteps.slice(0, -1).map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(index);
            const categoryFields = filledFieldsByCategory[step.group] || [];
            
            return (
              <Card 
                key={index} 
                className={cn(
                  "transition-all",
                  !isCompleted && "opacity-60"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-r",
                        step.color,
                        !isCompleted && "opacity-50"
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{step.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {categoryFields.length} field{categoryFields.length !== 1 ? 's' : ''} completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setCurrentStep(index)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                                  {/* Show filled data */}
                  {categoryFields.length > 0 && (
                    <CardContent className="pt-0">
                      <div className={`grid gap-3 text-sm ${categoryFields.some(({ field }) => field.type === 'file') ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {categoryFields.map(({ field, value }) => {
                          const formattedValue = formatFieldValue(field, value);
                          const isFileField = field.type === 'file';
                          
                          return (
                            <div key={field.name} className={cn("space-y-1", isFileField && "md:col-span-2")}>
                              <p className="text-xs text-muted-foreground mb-2">{field.customLabel || field.label}</p>
                              {typeof formattedValue === 'string' ? (
                                <p className="font-medium">{formattedValue}</p>
                              ) : (
                                formattedValue
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
              </Card>
            );
          })}
        </div>
        
        {/* Terms and Conditions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I confirm that all information provided is accurate and complete
                </Label>
                <p className="text-xs text-muted-foreground">
                  By submitting this application, you agree to the terms and conditions
                  and acknowledge that false information may result in rejection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Application Form</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground text-lg">Loading application form...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Application Form</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">
                {invalidFormId ? 'Invalid Form ID' : 'Unable to Load Form'}
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p className="text-sm">{error || 'Failed to load form data. Please try again.'}</p>
                {invalidFormId && formId && (
                  <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      Form ID: <span className="text-destructive font-semibold">{formId}</span>
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>

            {/* Help information */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                What to do next?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Check if the form ID in the URL is correct</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>The form may have been deleted or is no longer available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Contact the institution if you received this link from them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Browse available courses and forms from the courses page</span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <Loader2 className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have wizard steps
  if (wizardSteps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Application Form</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle>No Form Fields</AlertTitle>
            <AlertDescription>
              This form doesn't have any fields configured yet.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => navigate('/user/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{form.title || 'Application Form'}</h1>
              <p className="text-sm text-muted-foreground">
                {form.description || `${courseInfo.courseName} • ${courseInfo.universityName}`}
              </p>
              {/* Debug indicator */}
              <p className="text-xs text-muted-foreground/60 mt-1">
                Form ID: {formId}
              </p>
            </div>
            {/*<Button
              variant="outline"
              size="sm"
              onClick={handleSaveProgress}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Progress</span>
            </Button>*/}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Data Notification */}
          {portfolioDataLoaded && (
            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <UserCheck className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Your portfolio information has been automatically loaded. You can edit any field as needed.</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/user/portfolio")}
                  className="ml-4"
                >
                  View Portfolio
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {wizardSteps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-6" />
            
            {/* Step Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = completedSteps.includes(index);
                const isClickable = index <= currentStep || isCompleted;
                
                return (
                  <button
                    key={index}
                    onClick={() => isClickable && handleStepClick(index)}
                    disabled={!isClickable}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                      isActive && "bg-primary text-primary-foreground shadow-lg scale-105",
                      isCompleted && !isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground",
                      isClickable && !isActive && "hover:bg-muted hover:text-foreground cursor-pointer",
                      !isClickable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Icon className="h-3 w-3" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Step Navigation */}
            <div className="hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">Navigation</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete each section to proceed
                  </p>
                </CardHeader>
                <CardContent className="p-3">
                  <nav className="space-y-2">
                    {wizardGroups.map((group) => {
                      const groupSteps = wizardSteps.filter(step => step.group === group.id);
                      const GroupIcon = group.icon;
                      const isGroupExpanded = expandedGroups.includes(group.id);
                      const hasCompletedStep = groupSteps.some((_, idx) => {
                        const stepIndex = wizardSteps.findIndex(s => s.id === groupSteps[idx].id);
                        return completedSteps.includes(stepIndex);
                      });
                      const hasActiveStep = groupSteps.some(step => {
                        const stepIndex = wizardSteps.findIndex(s => s.id === step.id);
                        return stepIndex === currentStep;
                      });
                      
                      return (
                        <div key={group.id} className="space-y-1">
                          {/* Group Header */}
                          <button
                            onClick={() => {
                              setExpandedGroups(prev => 
                                isGroupExpanded 
                                  ? prev.filter(g => g !== group.id)
                                  : [...prev, group.id]
                              );
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                              "hover:bg-muted/50",
                              hasActiveStep && "bg-primary/10 text-primary",
                              hasCompletedStep && !hasActiveStep && "text-primary"
                            )}
                          >
                            <div className={cn(
                              "p-1 rounded-md bg-gradient-to-r",
                              group.color,
                              "opacity-90"
                            )}>
                              <GroupIcon className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="flex-1 text-left">{group.title}</span>
                            {hasCompletedStep && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                            )}
                            <ChevronDown 
                              className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                isGroupExpanded && "rotate-180"
                              )}
                            />
                          </button>
                          
                          {/* Group Steps */}
                          {isGroupExpanded && (
                            <div className="ml-3 pl-3 border-l-2 border-muted space-y-0.5">
                              {groupSteps.map((step) => {
                                const stepIndex = wizardSteps.findIndex(s => s.id === step.id);
                                const Icon = step.icon;
                                const isActive = stepIndex === currentStep;
                                const isCompleted = completedSteps.includes(stepIndex);
                                const isClickable = stepIndex <= currentStep || isCompleted;
                                
                                return (
                                  <button
                                    key={step.id}
                                    onClick={() => isClickable && handleStepClick(stepIndex)}
                                    disabled={!isClickable}
                                    className={cn(
                                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all text-left",
                                      isActive && "bg-primary text-primary-foreground font-medium",
                                      isCompleted && !isActive && "text-primary hover:bg-primary/10",
                                      !isActive && !isCompleted && "text-muted-foreground",
                                      isClickable && !isActive && "hover:bg-muted",
                                      !isClickable && "opacity-50 cursor-not-allowed"
                                    )}
                                  >
                                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="flex-1 truncate">{step.title}</span>
                                    {isCompleted && (
                                      <Check className="h-3 w-3 flex-shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-2">
              {currentStepData ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow-lg">
                      <CardHeader className={cn(
                        "relative overflow-hidden",
                        currentStep !== wizardSteps.length - 1 && "pb-8"
                      )}>
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-r opacity-10",
                          currentStepData.color
                        )} />
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={cn(
                              "p-2 rounded-lg bg-gradient-to-r",
                              currentStepData.color
                            )}>
                              <currentStepData.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                              <CardDescription>{currentStepData.subtitle}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {currentStep === wizardSteps.length - 1 ? (
                        renderReviewStep()
                      ) : (
                        <>
                          {currentStepData.fields.length > 0 ? (
                            currentStepData.fields.map(field => renderField(field))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No fields available for this section</p>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>

                    {/* Navigation Buttons */}
                    <div className="border-t px-6 py-4 bg-muted/5">
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                          className="gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        {currentStep === wizardSteps.length - 1 ? (
                          <Button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleNext}
                            className="gap-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Loading step data...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;