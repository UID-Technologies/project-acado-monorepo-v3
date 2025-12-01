// src/docs/openapi.ts
import { OpenAPIV3_1 } from 'openapi-types';

const spec: OpenAPIV3_1.Document = {
  openapi: '3.0.3',
  info: { 
    title: 'Akedo Form Builder API', 
    version: '1.0.0',
    description: 'Comprehensive API for managing application forms, master fields, categories, universities, courses, student applications, engagement builder features (wall posts, community posts, reels, events, scholarships), and user authentication with JWT tokens. Supports form creation, field configuration, university/course management, complete application lifecycle tracking, and engagement builder content management.'
  },
  servers: [
    { url: '', description: 'Current server (recommended)' }, // Empty URL uses current origin - works everywhere
    { url: 'http://57.159.29.149:5000', description: 'Staging server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /auth/login'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          name: { type: 'string', example: 'Admin User' },
          role: { type: 'string', enum: ['superadmin', 'admin', 'learner'], example: 'admin' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          password: { type: 'string', format: 'password', example: 'admin123' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { 
            type: 'string', 
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjIzNjViNGNiODVmMDc3NWEyMDdiMSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA3MDQxNzIsImV4cCI6MTc2MTMwODk3Mn0.Y8nWLTc79JUShaVF_n7pyUSsYnV2__RIWMpLQpHKe5c'
          },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email', example: 'newuser@example.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'password123' },
          name: { type: 'string', minLength: 2, example: 'New User' },
          role: { type: 'string', enum: ['superadmin', 'admin', 'learner'], example: 'learner' }
        }
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', format: 'password', example: 'oldpassword' },
          newPassword: { type: 'string', format: 'password', minLength: 6, example: 'newpassword123' }
        }
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, example: 'Updated Name' },
          email: { type: 'string', format: 'email', example: 'updated@example.com' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Error message' }
        }
      },
      ConfiguredField: {
        type: 'object',
        properties: {
          fieldId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'firstName' },
          label: { type: 'string', example: 'First Name' },
          customLabel: { type: 'string', example: 'Your First Name' },
          type: { type: 'string', example: 'text' },
          placeholder: { type: 'string', example: 'Enter your first name' },
          required: { type: 'boolean', example: true },
          isVisible: { type: 'boolean', example: true },
          isRequired: { type: 'boolean', example: true },
          categoryId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          subcategoryId: { type: 'string', example: '68f2365b4cb85f0775a207b2' },
          options: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' }, label: { type: 'string' } } } },
          validation: { type: 'array', items: { type: 'object' } },
          description: { type: 'string', example: 'Enter your legal first name' },
          order: { type: 'number', example: 1 }
        }
      },
      Form: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'undergraduate-application' },
          title: { type: 'string', example: 'Undergraduate Application Form' },
          description: { type: 'string', example: 'Application form for undergraduate programs' },
          universityId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          courseIds: { type: 'array', items: { type: 'string' }, example: ['68f2365b4cb85f0775a207b1'] },
          fields: { type: 'array', items: { $ref: '#/components/schemas/ConfiguredField' } },
          customCategoryNames: { type: 'object' },
          status: { type: 'string', enum: ['draft', 'published', 'archived'], example: 'draft' },
          isLaunched: { type: 'boolean', example: false },
          isActive: { type: 'boolean', example: true },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      FormCreateRequest: {
        type: 'object',
        required: ['name', 'title'],
        properties: {
          name: { type: 'string', example: 'undergraduate-application' },
          title: { type: 'string', example: 'Undergraduate Application Form' },
          description: { type: 'string', example: 'Application form for undergraduate programs' },
          universityId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          courseIds: { type: 'array', items: { type: 'string' } },
          fields: { type: 'array', items: { $ref: '#/components/schemas/ConfiguredField' } },
          status: { type: 'string', enum: ['draft', 'published', 'archived'] }
        }
      },
      University: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'Harvard University' },
          country: { type: 'string', example: 'United States' },
          city: { type: 'string', example: 'Cambridge' },
          description: { type: 'string', example: 'Leading research university' },
          website: { type: 'string', example: 'https://www.harvard.edu' },
          logo: { type: 'string', example: 'https://example.com/logo.png' },
          ranking: { type: 'number', example: 1 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      UniversityCreateRequest: {
        type: 'object',
        required: ['name', 'country'],
        properties: {
          name: { type: 'string', example: 'Harvard University' },
          country: { type: 'string', example: 'United States' },
          city: { type: 'string', example: 'Cambridge' },
          description: { type: 'string', example: 'Leading research university' },
          website: { type: 'string', example: 'https://www.harvard.edu' },
          logo: { type: 'string', example: 'https://example.com/logo.png' },
          ranking: { type: 'number', example: 1 }
        }
      },
      Organization: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'Acado Global' },
          shortName: { type: 'string', example: 'ACADO' },
          type: { type: 'string', enum: ['University', 'Corporate', 'Non-Profit'], example: 'University' },
          onboardingStage: {
            type: 'string',
            enum: ['Profile Created', 'Documents Submitted', 'Approved', 'Live'],
            example: 'Approved'
          },
          suspended: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      OrganizationCreateRequest: {
        type: 'object',
        required: ['name', 'type', 'admin'],
        properties: {
          name: { type: 'string', example: 'Acado Global' },
          shortName: { type: 'string', example: 'ACADO' },
          type: { type: 'string', enum: ['University', 'Corporate', 'Non-Profit'], example: 'University' },
          onboardingStage: {
            type: 'string',
            enum: ['Profile Created', 'Documents Submitted', 'Approved', 'Live'],
            example: 'Profile Created'
          },
          admin: {
            type: 'object',
            required: ['email', 'name'],
            properties: {
              email: { type: 'string', format: 'email', example: 'admin@acado.ai' },
              name: { type: 'string', example: 'Primary Admin' },
              phone: { type: 'string', example: '+1-555-555-0100' },
              password: { type: 'string', example: 'StrongPass#123' }
            }
          }
        }
      },
      SendEmailRequest: {
        type: 'object',
        required: ['template', 'to', 'data'],
        properties: {
          template: {
            type: 'string',
            enum: ['admin_invitation', 'forgot_password', 'welcome'],
            example: 'admin_invitation',
            description: 'Email template to send'
          },
          to: { type: 'string', format: 'email', example: 'recipient@example.com' },
          cc: {
            type: 'array',
            items: { type: 'string', format: 'email' },
            maxItems: 10,
            description: 'Optional CC recipients'
          },
          bcc: {
            type: 'array',
            items: { type: 'string', format: 'email' },
            maxItems: 10,
            description: 'Optional BCC recipients'
          },
          data: {
            type: 'object',
            description: [
              'Template data payload. Expected fields per template:',
              '- admin_invitation: { inviteLink (url), inviterName?, recipientName?, organizationName? }',
              '- forgot_password: { resetLink (url), recipientName?, expiresInMinutes? }',
              '- welcome: { recipientName?, loginLink?, organizationName? }',
            ].join('\n')
          }
        }
      },
      SendEmailResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Email queued successfully' },
          messageId: { type: 'string', example: '<abc123@mailer>' },
          previewUrl: {
            type: 'string',
            example: 'https://ethereal.email/message/WaQKMgKddxQDoou...',
            description: 'Preview URL when supported by the mail transport'
          }
        }
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          universityId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'Master of Computer Science' },
          shortName: { type: 'string', example: 'MCS' },
          courseCode: { type: 'string', example: 'CS-501' },
          description: { type: 'string', example: 'Advanced coursework covering AI, systems, and software engineering.' },
          keywords: { type: 'string', example: 'computer science, ai, systems' },
          courseCategoryId: { type: 'string', example: '68f2365b4cb85f0775a207c1', description: 'Course category id (optional)' },
          courseLevelId: { type: 'string', example: '68f2365b4cb85f0775a207d2', description: 'Course level id (optional)' },
          courseTypeId: { type: 'string', example: '68f2365b4cb85f0775a207e3', description: 'Course type id (optional)' },
          type: { type: 'string', enum: ['degree', 'exchange', 'pathway', 'diploma', 'certification'], example: 'degree', description: 'Legacy course type string (optional)' },
          level: { type: 'string', enum: ['undergraduate', 'postgraduate', 'doctoral'], example: 'postgraduate', description: 'Legacy course level string (optional)' },
          duration: { type: 'string', example: '4 semesters' },
          requirements: { type: 'string', example: 'Bachelor in CS or related field, minimum GPA 3.0' },
          fee: { type: 'number', example: 25000 },
          currency: { type: 'string', example: 'USD' },
          thumbnail: { type: 'string', example: 'https://cdn.example.com/images/mcs-thumb.jpg' },
          bannerImage: { type: 'string', example: 'https://cdn.example.com/images/mcs-banner.jpg' },
          videoUrl: { type: 'string', example: 'https://videos.example.com/programs/mcs.mp4' },
          startDate: { type: 'string', format: 'date-time', description: 'ISO start date (optional)' },
          endDate: { type: 'string', format: 'date-time', description: 'ISO end date (optional)' },
          applicationDeadline: { type: 'string', format: 'date-time', description: 'ISO application deadline (optional)' },
          applicationFormId: { type: 'string', example: '68f2365b4cb85f0775a207b1', description: 'Associated application form id (optional)' },
          learningOutcomeIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['68f2365b4cb85f0775a207f4', '68f2365b4cb85f0775a207f5'],
          },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CourseCreateRequest: {
        type: 'object',
        required: ['universityId', 'name', 'shortName', 'description'],
        properties: {
          universityId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'Master of Computer Science' },
          shortName: { type: 'string', example: 'MCS' },
          courseCode: { type: 'string', example: 'CS-501' },
          description: { type: 'string', example: 'Advanced program covering AI, systems, and software engineering.' },
          keywords: { type: 'string', example: 'computer science, ai' },
          courseCategoryId: { type: 'string', example: '68f2365b4cb85f0775a207c1', description: 'Course category id (optional)' },
          courseLevelId: { type: 'string', example: '68f2365b4cb85f0775a207d2', description: 'Course level id (optional)' },
          courseTypeId: { type: 'string', example: '68f2365b4cb85f0775a207e3', description: 'Course type id (optional)' },
          duration: { type: 'string', example: '4 semesters' },
          requirements: { type: 'string', example: 'Bachelor in CS or related field' },
          fee: { type: 'number', example: 25000 },
          currency: { type: 'string', example: 'USD' },
          thumbnail: { type: 'string', example: 'https://cdn.example.com/images/mcs-thumb.jpg' },
          bannerImage: { type: 'string', example: 'https://cdn.example.com/images/mcs-banner.jpg' },
          videoUrl: { type: 'string', example: 'https://videos.example.com/programs/mcs.mp4' },
          startDate: { type: 'string', format: 'date-time', description: 'ISO start date (optional)' },
          endDate: { type: 'string', format: 'date-time', description: 'ISO end date (optional)' },
          applicationDeadline: { type: 'string', format: 'date-time', description: 'ISO application deadline (optional)' },
          learningOutcomeIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['68f2365b4cb85f0775a207f4'],
          },
          isActive: { type: 'boolean', example: true },
        },
      },
      CourseCategory: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207c1' },
          name: { type: 'string', example: 'Science & Technology' },
          shortName: { type: 'string', example: 'SCI-TECH' },
          code: { type: 'string', example: 'ST' },
          parentId: { type: 'string', example: null, description: 'Parent category id (optional)' },
          description: { type: 'string', example: 'Science and technology related courses' },
          keywords: { type: 'string', example: 'science, technology, engineering' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CourseType: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207e3' },
          name: { type: 'string', example: 'Degree Program' },
          shortName: { type: 'string', example: 'DEG' },
          description: { type: 'string', example: 'Full-length degree programs' },
          keywords: { type: 'string', example: 'degree, major' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CourseLevel: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207d2' },
          name: { type: 'string', example: 'Postgraduate' },
          shortName: { type: 'string', example: 'PG' },
          description: { type: 'string', example: 'Courses for postgraduate students' },
          keywords: { type: 'string', example: 'masters, postgraduate' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LearningOutcome: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207f4' },
          name: { type: 'string', example: 'Critical Thinking' },
          shortName: { type: 'string', example: 'CRIT-THINK' },
          code: { type: 'string', example: 'LO-CT' },
          parentId: { type: 'string', example: null, description: 'Parent learning outcome id (optional)' },
          description: { type: 'string', example: 'Ability to analyze and evaluate problems' },
          keywords: { type: 'string', example: 'analysis, evaluation' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          userId: { type: 'string', example: 'user@example.com' },
          formId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          universityId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          courseId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          status: { type: 'string', enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'], example: 'submitted' },
          formData: { 
            type: 'object',
            description: 'All submitted form field values',
            additionalProperties: true,
            example: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
          },
          submittedAt: { type: 'string', format: 'date-time' },
          reviewedAt: { type: 'string', format: 'date-time' },
          reviewedBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          reviewNotes: { type: 'string', example: 'Excellent qualifications' },
          metadata: {
            type: 'object',
            properties: {
              ipAddress: { type: 'string', example: '192.168.1.1' },
              userAgent: { type: 'string', example: 'Mozilla/5.0...' },
              completionTime: { type: 'number', example: 300, description: 'Time taken in seconds' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ApplicationCreateRequest: {
        type: 'object',
        required: ['formId', 'formData'],
        properties: {
          userId: { type: 'string', example: 'user@example.com' },
          formId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          universityId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          courseId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          formData: { 
            type: 'object',
            additionalProperties: true,
            example: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
          },
          status: { type: 'string', enum: ['draft', 'submitted'], example: 'submitted' },
          metadata: {
            type: 'object',
            properties: {
              completionTime: { type: 'number', example: 300 }
            }
          }
        }
      },
      ApplicationUpdateRequest: {
        type: 'object',
        properties: {
          formData: { type: 'object', additionalProperties: true },
          status: { type: 'string', enum: ['draft', 'submitted', 'withdrawn'] }
        }
      },
      ApplicationReviewRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['under_review', 'accepted', 'rejected'], example: 'accepted' },
          reviewNotes: { type: 'string', example: 'Excellent candidate with strong qualifications' }
        }
      },
      ApplicationStats: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 10 },
          draft: { type: 'number', example: 2 },
          submitted: { type: 'number', example: 5 },
          under_review: { type: 'number', example: 2 },
          accepted: { type: 'number', example: 1 },
          rejected: { type: 'number', example: 0 },
          withdrawn: { type: 'number', example: 0 }
        }
      },
      StringListResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { type: 'string' },
            example: ['India', 'United States']
          }
        }
      },
      // Engagement Builder Schemas
      WallPost: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          description: { type: 'string', example: 'Welcome to our learning community!' },
          media: { type: 'string', example: 'https://example.com/media/image.jpg' },
          mediaType: { type: 'string', enum: ['image', 'video'], example: 'image' },
          createdBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      WallPostCreateRequest: {
        type: 'object',
        required: ['description'],
        properties: {
          description: { type: 'string', example: 'Welcome to our learning community!' },
          media: { type: 'string', example: 'https://example.com/media/image.jpg' },
          mediaType: { type: 'string', enum: ['image', 'video'], example: 'image' }
        }
      },
      CommunityCategory: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          name: { type: 'string', example: 'Blog' },
          color: { type: 'string', example: '#3B82F6' },
          createdBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CommunityCategoryCreateRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Blog' },
          color: { type: 'string', example: '#3B82F6' }
        }
      },
      CommunityPost: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          title: { type: 'string', example: 'Introduction to Machine Learning' },
          description: { type: 'string', example: 'Learn the fundamentals of ML' },
          contentType: { type: 'string', enum: ['images', 'notes', 'videos'], example: 'notes' },
          categoryId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          thumbnail: { type: 'string', example: 'https://example.com/thumb.jpg' },
          media: { type: 'string', example: 'https://example.com/media.pdf' },
          isPinned: { type: 'boolean', example: false },
          createdBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          translations: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      CommunityPostCreateRequest: {
        type: 'object',
        required: ['title', 'description', 'contentType', 'categoryId'],
        properties: {
          title: { type: 'string', example: 'Introduction to Machine Learning' },
          description: { type: 'string', example: 'Learn the fundamentals of ML' },
          contentType: { type: 'string', enum: ['images', 'notes', 'videos'], example: 'notes' },
          categoryId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          thumbnail: { type: 'string', example: 'https://example.com/thumb.jpg' },
          media: { type: 'string', example: 'https://example.com/media.pdf' },
          isPinned: { type: 'boolean', example: false },
          translations: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      Reel: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          title: { type: 'string', example: 'Quick Tips: React Hooks' },
          description: { type: 'string', example: 'Learn React hooks in 5 minutes' },
          category: { type: 'string', example: 'Programming' },
          tags: { type: 'array', items: { type: 'string' }, example: ['react', 'javascript', 'hooks'] },
          videoUrl: { type: 'string', example: 'https://example.com/video.mp4' },
          thumbnailUrl: { type: 'string', example: 'https://example.com/thumb.jpg' },
          duration: { type: 'number', example: 300, description: 'Duration in seconds' },
          captionUrl: { type: 'string', example: 'https://example.com/captions.srt' },
          language: { type: 'string', example: 'en' },
          visibility: { type: 'string', enum: ['public', 'organization', 'private'], example: 'public' },
          status: { type: 'string', enum: ['draft', 'active', 'inactive'], example: 'active' },
          scheduledPublishAt: { type: 'string', format: 'date-time' },
          views: { type: 'number', example: 1250 },
          likes: { type: 'number', example: 45 },
          createdBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          publishedAt: { type: 'string', format: 'date-time' }
        }
      },
      ReelCreateRequest: {
        type: 'object',
        required: ['title', 'category', 'videoUrl', 'duration'],
        properties: {
          title: { type: 'string', example: 'Quick Tips: React Hooks' },
          description: { type: 'string', example: 'Learn React hooks in 5 minutes' },
          category: { type: 'string', example: 'Programming' },
          tags: { type: 'array', items: { type: 'string' }, example: ['react', 'javascript'] },
          videoUrl: { type: 'string', example: 'https://example.com/video.mp4' },
          thumbnailUrl: { type: 'string', example: 'https://example.com/thumb.jpg' },
          duration: { type: 'number', example: 300 },
          captionUrl: { type: 'string', example: 'https://example.com/captions.srt' },
          language: { type: 'string', example: 'en' },
          visibility: { type: 'string', enum: ['public', 'organization', 'private'], example: 'public' },
          status: { type: 'string', enum: ['draft', 'active', 'inactive'], example: 'draft' },
          scheduledPublishAt: { type: 'string', format: 'date-time' }
        }
      },
      EventStage: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          type: { type: 'string', enum: ['assessment', 'submission', 'video', 'notes', 'live_session'], example: 'assessment' },
          title: { type: 'string', example: 'Quiz: Introduction' },
          description: { type: 'string', example: 'Test your knowledge' },
          order: { type: 'number', example: 1 },
          status: { type: 'string', enum: ['draft', 'ready'], example: 'ready' },
          resourceId: { type: 'string', example: 'resource-123' },
          duration: { type: 'number', example: 30, description: 'Duration in minutes' },
          points: { type: 'number', example: 100 },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Event: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          logo: { type: 'string', example: 'https://example.com/logo.png' },
          title: { type: 'string', example: 'Web Development Bootcamp' },
          categoryTags: { type: 'array', items: { type: 'string' }, example: ['programming', 'web-dev'] },
          conductedBy: { type: 'string', example: 'Tech Academy' },
          functionalDomain: { type: 'string', example: 'Software Development' },
          jobRole: { type: 'string', example: 'Full Stack Developer' },
          skills: { type: 'array', items: { type: 'string' }, example: ['JavaScript', 'React', 'Node.js'] },
          difficultyLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'beginner' },
          subscriptionType: { type: 'string', enum: ['free', 'paid'], example: 'free' },
          isPopular: { type: 'boolean', example: true },
          description: { type: 'string', example: 'Comprehensive web development course' },
          whatsInItForYou: { type: 'string', example: 'Learn modern web technologies' },
          instructions: { type: 'string', example: 'Complete all stages to get certificate' },
          faq: { type: 'string', example: 'Q: Is this course free? A: Yes' },
          registrationStartDate: { type: 'string', format: 'date-time' },
          registrationEndDate: { type: 'string', format: 'date-time' },
          eventDate: { type: 'string', format: 'date-time' },
          eventTime: { type: 'string', example: '10:00 AM' },
          mode: { type: 'string', enum: ['online', 'offline', 'hybrid'], example: 'online' },
          venue: { type: 'string', example: 'Online Platform' },
          expertId: { type: 'string', example: 'expert-123' },
          expertName: { type: 'string', example: 'John Doe' },
          additionalInfo: { type: 'string', example: 'Additional information' },
          eligibility: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['everyone', 'students', 'professionals', 'custom'], example: 'everyone' },
              colleges: { type: 'array', items: { type: 'string' } },
              organizations: { type: 'array', items: { type: 'string' } },
              genderRestriction: { type: 'string', enum: ['all', 'male', 'female', 'other'], example: 'all' }
            }
          },
          registrationSettings: {
            type: 'object',
            properties: {
              approval: { type: 'string', enum: ['auto', 'manual'], example: 'auto' },
              maxSeats: { type: 'number', example: 100 },
              enableWaitlist: { type: 'boolean', example: true },
              cutoffLogic: { type: 'string', example: 'First come first serve' },
              eventFee: { type: 'number', example: 0 }
            }
          },
          stages: { type: 'array', items: { $ref: '#/components/schemas/EventStage' } },
          status: { type: 'string', enum: ['draft', 'active', 'completed', 'cancelled'], example: 'active' },
          createdBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          publishedAt: { type: 'string', format: 'date-time' },
          registrations: { type: 'number', example: 50 },
          views: { type: 'number', example: 200 },
          completions: { type: 'number', example: 30 }
        }
      },
      EventCreateRequest: {
        type: 'object',
        required: ['title', 'conductedBy', 'functionalDomain', 'jobRole', 'difficultyLevel', 'subscriptionType', 'description', 'registrationStartDate', 'registrationEndDate', 'eventDate', 'eventTime', 'mode', 'eligibility', 'registrationSettings'],
        properties: {
          logo: { type: 'string', example: 'https://example.com/logo.png' },
          title: { type: 'string', example: 'Web Development Bootcamp' },
          categoryTags: { type: 'array', items: { type: 'string' }, example: ['programming'] },
          conductedBy: { type: 'string', example: 'Tech Academy' },
          functionalDomain: { type: 'string', example: 'Software Development' },
          jobRole: { type: 'string', example: 'Full Stack Developer' },
          skills: { type: 'array', items: { type: 'string' }, example: ['JavaScript'] },
          difficultyLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'beginner' },
          subscriptionType: { type: 'string', enum: ['free', 'paid'], example: 'free' },
          isPopular: { type: 'boolean', example: false },
          description: { type: 'string', example: 'Comprehensive course' },
          whatsInItForYou: { type: 'string' },
          instructions: { type: 'string' },
          faq: { type: 'string' },
          registrationStartDate: { type: 'string', format: 'date-time' },
          registrationEndDate: { type: 'string', format: 'date-time' },
          eventDate: { type: 'string', format: 'date-time' },
          eventTime: { type: 'string', example: '10:00 AM' },
          mode: { type: 'string', enum: ['online', 'offline', 'hybrid'], example: 'online' },
          venue: { type: 'string' },
          expertId: { type: 'string' },
          expertName: { type: 'string' },
          additionalInfo: { type: 'string' },
          eligibility: {
            type: 'object',
            required: ['type'],
            properties: {
              type: { type: 'string', enum: ['everyone', 'students', 'professionals', 'custom'] },
              colleges: { type: 'array', items: { type: 'string' } },
              organizations: { type: 'array', items: { type: 'string' } },
              genderRestriction: { type: 'string', enum: ['all', 'male', 'female', 'other'] }
            }
          },
          registrationSettings: {
            type: 'object',
            required: ['approval', 'enableWaitlist'],
            properties: {
              approval: { type: 'string', enum: ['auto', 'manual'] },
              maxSeats: { type: 'number' },
              enableWaitlist: { type: 'boolean' },
              cutoffLogic: { type: 'string' },
              eventFee: { type: 'number' }
            }
          },
          stages: { type: 'array', items: { $ref: '#/components/schemas/EventStage' } },
          status: { type: 'string', enum: ['draft', 'active', 'completed', 'cancelled'], example: 'draft' }
        }
      },
      ScholarshipFormField: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          fieldType: { type: 'string', enum: ['text', 'textarea', 'email', 'phone', 'file', 'url', 'dropdown'], example: 'text' },
          label: { type: 'string', example: 'Full Name' },
          required: { type: 'boolean', example: true },
          placeholder: { type: 'string', example: 'Enter your full name' },
          options: { type: 'array', items: { type: 'string' }, example: ['Option 1', 'Option 2'] }
        }
      },
      ScholarshipStage: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          type: { type: 'string', enum: ['screening', 'assessment', 'interview', 'assignment'], example: 'screening' },
          title: { type: 'string', example: 'Initial Screening' },
          description: { type: 'string', example: 'Review of application documents' },
          order: { type: 'number', example: 1 },
          deadline: { type: 'string', format: 'date-time' },
          weightage: { type: 'number', example: 30, description: 'Percentage weight' },
          autoScore: { type: 'boolean', example: false },
          reviewers: { type: 'array', items: { type: 'string' }, example: ['reviewer-1', 'reviewer-2'] },
          passScore: { type: 'number', example: 70 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Scholarship: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          categoryTags: { type: 'array', items: { type: 'string' }, example: ['merit', 'engineering'] },
          title: { type: 'string', example: 'Merit Scholarship for Engineering' },
          providerId: { type: 'string', example: 'provider-123' },
          providerName: { type: 'string', example: 'Tech Foundation' },
          type: { type: 'string', enum: ['merit', 'need_based', 'partial', 'full', 'fellowship', 'travel_grant'], example: 'merit' },
          amount: { type: 'number', example: 10000 },
          currency: { type: 'string', example: 'USD' },
          numberOfAwards: { type: 'number', example: 10 },
          duration: { type: 'string', example: '12 months' },
          studyLevel: { type: 'string', enum: ['undergraduate', 'postgraduate', 'phd', 'short_course', 'any'], example: 'undergraduate' },
          fieldsOfStudy: { type: 'array', items: { type: 'string' }, example: ['Engineering', 'Computer Science'] },
          applicationDeadline: { type: 'string', format: 'date-time' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          mode: { type: 'string', enum: ['online', 'offline'], example: 'online' },
          bannerUrl: { type: 'string', example: 'https://example.com/banner.jpg' },
          thumbnailUrl: { type: 'string', example: 'https://example.com/thumb.jpg' },
          shortDescription: { type: 'string', example: 'Merit-based scholarship for engineering students' },
          description: { type: 'string', example: 'Full description of the scholarship' },
          formFields: { type: 'array', items: { $ref: '#/components/schemas/ScholarshipFormField' } },
          applicationTemplateUrl: { type: 'string', example: 'https://example.com/template.pdf' },
          stages: { type: 'array', items: { $ref: '#/components/schemas/ScholarshipStage' } },
          evaluationRules: {
            type: 'object',
            properties: {
              passScore: { type: 'number', example: 70 },
              tieBreakRules: { type: 'string', example: 'Higher GPA first' },
              seatAllocationLogic: { type: 'string', example: 'Equal distribution' }
            }
          },
          status: { type: 'string', enum: ['draft', 'active', 'inactive', 'completed', 'cancelled'], example: 'active' },
          visibility: { type: 'string', enum: ['public', 'organization', 'private'], example: 'public' },
          createdBy: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          publishedAt: { type: 'string', format: 'date-time' },
          views: { type: 'number', example: 500 },
          applications: { type: 'number', example: 150 },
          shortlisted: { type: 'number', example: 30 },
          awarded: { type: 'number', example: 10 }
        }
      },
      ScholarshipCreateRequest: {
        type: 'object',
        required: ['title', 'providerId', 'providerName', 'type', 'amount', 'numberOfAwards', 'duration', 'studyLevel', 'applicationDeadline', 'mode', 'shortDescription', 'description'],
        properties: {
          categoryTags: { type: 'array', items: { type: 'string' }, example: ['merit'] },
          title: { type: 'string', example: 'Merit Scholarship for Engineering' },
          providerId: { type: 'string', example: 'provider-123' },
          providerName: { type: 'string', example: 'Tech Foundation' },
          type: { type: 'string', enum: ['merit', 'need_based', 'partial', 'full', 'fellowship', 'travel_grant'], example: 'merit' },
          amount: { type: 'number', example: 10000 },
          currency: { type: 'string', example: 'USD' },
          numberOfAwards: { type: 'number', example: 10 },
          duration: { type: 'string', example: '12 months' },
          studyLevel: { type: 'string', enum: ['undergraduate', 'postgraduate', 'phd', 'short_course', 'any'], example: 'undergraduate' },
          fieldsOfStudy: { type: 'array', items: { type: 'string' }, example: ['Engineering'] },
          applicationDeadline: { type: 'string', format: 'date-time' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          mode: { type: 'string', enum: ['online', 'offline'], example: 'online' },
          bannerUrl: { type: 'string', example: 'https://example.com/banner.jpg' },
          thumbnailUrl: { type: 'string', example: 'https://example.com/thumb.jpg' },
          shortDescription: { type: 'string', example: 'Merit-based scholarship' },
          description: { type: 'string', example: 'Full description' },
          formFields: { type: 'array', items: { $ref: '#/components/schemas/ScholarshipFormField' } },
          applicationTemplateUrl: { type: 'string' },
          stages: { type: 'array', items: { $ref: '#/components/schemas/ScholarshipStage' } },
          evaluationRules: {
            type: 'object',
            properties: {
              passScore: { type: 'number' },
              tieBreakRules: { type: 'string' },
              seatAllocationLogic: { type: 'string' }
            }
          },
          status: { type: 'string', enum: ['draft', 'active', 'inactive', 'completed', 'cancelled'], example: 'draft' },
          visibility: { type: 'string', enum: ['public', 'organization', 'private'], example: 'public' }
        }
      }
    }
  },
  paths: {
    '/health': { 
      get: { 
        summary: 'Health Check',
        description: 'Check if the API is running',
        responses: { 
          '200': { 
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'number', example: 12345.67 }
                  }
                }
              }
            }
          } 
        } 
      } 
    },
    '/emails': {
      post: {
        tags: ['Emails'],
        summary: 'Send transactional email',
        description: 'Trigger an email using a predefined template (admin only).',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SendEmailRequest' }
            }
          }
        },
        responses: {
          '202': {
            description: 'Email accepted for delivery',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SendEmailResponse' }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
          '500': { description: 'Failed to send email' }
        }
      }
    },
    '/organizations/public': {
      get: {
        tags: ['Organizations'],
        summary: 'List organizations (public)',
        description: 'Return active organizations without authentication. Useful for onboarding flows.',
        responses: {
          '200': {
            description: 'List of organizations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    organizations: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Organization' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/organizations': {
      get: {
        tags: ['Organizations'],
        summary: 'List organizations',
        description: 'List organizations (Super Admin or Admin access).',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of organizations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    organizations: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Organization' }
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' }
        }
      },
      post: {
        tags: ['Organizations'],
        summary: 'Create organization',
        description: 'Create a new organization and seed an administrator (Super Admin only).',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrganizationCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Organization created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    organization: { $ref: '#/components/schemas/Organization' }
                  }
                }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' }
        }
      }
    },
    '/locations/countries': {
      get: {
        tags: ['Locations'],
        summary: 'List countries',
        description: 'Return a distinct, alphabetically sorted list of all countries available in the location dataset.',
        responses: {
          '200': {
            description: 'List of countries',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StringListResponse' }
              }
            }
          }
        }
      }
    },
    '/locations/states': {
      get: {
        tags: ['Locations'],
        summary: 'List states for a country',
        description: 'Return a distinct, alphabetically sorted list of states or provinces for the supplied country name.',
        parameters: [
          {
            name: 'country',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'India' },
            description: 'Country name to filter states for (case insensitive).'
          }
        ],
        responses: {
          '200': {
            description: 'List of states for the country',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StringListResponse' }
              }
            }
          },
          '400': {
            description: 'Country missing or invalid',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/locations/cities': {
      get: {
        tags: ['Locations'],
        summary: 'List cities for a state',
        description: 'Return a distinct, alphabetically sorted list of cities for the supplied country and state names.',
        parameters: [
          {
            name: 'country',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'India' },
            description: 'Country name to scope the search (case insensitive).'
          },
          {
            name: 'state',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'Maharashtra' },
            description: 'State or province name to filter cities (case insensitive).'
          }
        ],
        responses: {
          '200': {
            description: 'List of cities for the state',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StringListResponse' }
              }
            }
          },
          '400': {
            description: 'Country or state missing/invalid',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login',
        description: 'Login with email and password to receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials or account deactivated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register New User',
        description: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          '400': {
            description: 'User already exists or validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get Current User Profile',
        description: 'Get the profile of the currently authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Authentication'],
        summary: 'Update User Profile',
        description: 'Update the current user\'s name or email',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/change-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Change Password',
        description: 'Change the current user\'s password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Password updated successfully' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Unauthorized or current password incorrect',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh JWT Token',
        description: 'Get a new JWT token using current valid token',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'New token generated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/masterCategories': {
      get: {
        tags: ['Categories'],
        summary: 'List all categories',
        description: 'Get all categories with their subcategories (JSON Server compatible endpoint)',
        parameters: [
          { name: 'include', in: 'query', schema: { type: 'string', enum: ['count'] }, description: 'Include field counts' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search categories by name' }
        ],
        responses: { '200': { description: 'List of categories' } }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create category',
        description: 'Create a new category (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'icon', 'order'],
                properties: {
                  name: { type: 'string', example: 'Test Category' },
                  icon: { type: 'string', example: 'Folder' },
                  description: { type: 'string', example: 'Category description' },
                  order: { type: 'number', example: 11 }
                }
              }
            }
          }
        },
        responses: { 
          '201': { description: 'Category created' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Insufficient permissions' }
        }
      }
    },
    '/masterCategories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'Category details' } }
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category',
        description: 'Update category (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { description: 'Category updated' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category',
        description: 'Delete category (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '204': { description: 'Category deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/masterCategories/{id}/subcategories': {
      post: {
        tags: ['Categories'],
        summary: 'Add subcategory',
        description: 'Add subcategory to a category (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '201': { description: 'Subcategory added' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/masterFields': {
      get: {
        tags: ['Fields'],
        summary: 'Search/list fields',
        description: 'Get all fields with optional filtering',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'categoryId', in: 'query', schema: { type: 'string' } },
          { name: 'subcategoryId', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'number', default: 50 } }
        ],
        responses: { '200': { description: 'List of fields' } }
      },
      post: {
        tags: ['Fields'],
        summary: 'Create field',
        description: 'Create a new master field (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        responses: { 
          '201': { description: 'Field created' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/masterFields/{id}': {
      get: {
        tags: ['Fields'],
        summary: 'Get field by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'Field details' } }
      },
      put: {
        tags: ['Fields'],
        summary: 'Update field',
        description: 'Update field (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { description: 'Field updated' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Fields'],
        summary: 'Delete field',
        description: 'Delete field (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '204': { description: 'Field deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/forms': {
      get: {
        tags: ['Forms'],
        summary: 'List all forms',
        description: 'Get all application forms with optional filtering',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'published', 'archived'] }, description: 'Filter by status' },
          { name: 'universityId', in: 'query', schema: { type: 'string' }, description: 'Filter by university' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name or title' }
        ],
        responses: { 
          '200': { 
            description: 'List of forms',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Form' }
                }
              }
            }
          } 
        }
      },
      post: {
        tags: ['Forms'],
        summary: 'Create form',
        description: 'Create a new application form (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FormCreateRequest' }
            }
          }
        },
        responses: { 
          '201': { 
            description: 'Form created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Form' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin/Editor only' }
        }
      }
    },
    '/forms/by-course/{courseId}': {
      get: {
        tags: ['Forms'],
        summary: 'Get form by course ID',
        description: 'Get the form ID associated with a specific course. Returns the published form if available, otherwise returns the first active form.',
        parameters: [
          { name: 'courseId', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' }
        ],
        responses: { 
          '200': { 
            description: 'Form information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    formId: { type: 'string', example: '68f2365b4cb85f0775a207b1', description: 'The primary form ID (published or first active)' },
                    name: { type: 'string', example: 'undergraduate-application-2024', description: 'Form name' },
                    title: { type: 'string', example: 'Undergraduate Application Form 2024', description: 'Form title' },
                    status: { type: 'string', enum: ['draft', 'published', 'archived'], example: 'published', description: 'Form status' },
                    allForms: {
                      type: 'array',
                      description: 'All forms associated with this course',
                      items: {
                        type: 'object',
                        properties: {
                          formId: { type: 'string', example: '68f2365b4cb85f0775a207b1' },
                          name: { type: 'string', example: 'undergraduate-application-2024' },
                          title: { type: 'string', example: 'Undergraduate Application Form 2024' },
                          status: { type: 'string', enum: ['draft', 'published', 'archived'], example: 'published' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': { description: 'No form found for this course' }
        }
      }
    },
    '/forms/{id}': {
      get: {
        tags: ['Forms'],
        summary: 'Get form by ID',
        description: 'Get a specific form with all configured fields',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'Form details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Form' }
              }
            }
          },
          '404': { description: 'Form not found' }
        }
      },
      put: {
        tags: ['Forms'],
        summary: 'Update form',
        description: 'Update form details and configuration (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FormCreateRequest' }
            }
          }
        },
        responses: { 
          '200': { 
            description: 'Form updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Form' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Form not found' }
        }
      },
      patch: {
        tags: ['Forms'],
        summary: 'Partially update form',
        description: 'Update specific fields of a form (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FormCreateRequest' }
            }
          }
        },
        responses: { 
          '200': { description: 'Form updated' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Forms'],
        summary: 'Delete form',
        description: 'Delete an application form (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '204': { description: 'Form deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/forms/{id}/publish': {
      post: {
        tags: ['Forms'],
        summary: 'Publish form',
        description: 'Change form status to published (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { description: 'Form published' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/forms/{id}/archive': {
      post: {
        tags: ['Forms'],
        summary: 'Archive form',
        description: 'Change form status to archived (Admin/Editor)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { description: 'Form archived' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/forms/{id}/duplicate': {
      post: {
        tags: ['Forms'],
        summary: 'Duplicate form',
        description: 'Create a copy of an existing form (Admin/Editor)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '201': { 
            description: 'Form duplicated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Form' }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/universities': {
      get: {
        tags: ['Universities'],
        summary: 'List all universities',
        description: 'Get all universities with optional filtering',
        parameters: [
          { name: 'country', in: 'query', schema: { type: 'string' }, description: 'Filter by country' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name' },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' }, description: 'Filter by active status' }
        ],
        responses: { 
          '200': { 
            description: 'List of universities',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/University' }
                }
              }
            }
          } 
        }
      },
      post: {
        tags: ['Universities'],
        summary: 'Create university',
        description: 'Create a new university (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UniversityCreateRequest' }
            }
          }
        },
        responses: { 
          '201': { 
            description: 'University created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/University' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/universities/{id}': {
      get: {
        tags: ['Universities'],
        summary: 'Get university by ID',
        description: 'Get a specific university with details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'University details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/University' }
              }
            }
          },
          '404': { description: 'University not found' }
        }
      },
      put: {
        tags: ['Universities'],
        summary: 'Update university',
        description: 'Update university details (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UniversityCreateRequest' }
            }
          }
        },
        responses: { 
          '200': { 
            description: 'University updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/University' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      },
      patch: {
        tags: ['Universities'],
        summary: 'Partially update university',
        description: 'Update specific fields of a university (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { description: 'University updated' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Universities'],
        summary: 'Delete university',
        description: 'Delete a university (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '204': { description: 'University deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/universities/{id}/courses': {
      get: {
        tags: ['Universities'],
        summary: 'Get university courses',
        description: 'Get all courses offered by a specific university',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'List of courses',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Course' }
                }
              }
            }
          },
          '404': { description: 'University not found' }
        }
      }
    },
    '/courses': {
      get: {
        tags: ['Courses'],
        summary: 'List all courses',
        description: 'Get all courses with optional filtering',
        parameters: [
          { name: 'universityId', in: 'query', schema: { type: 'string' }, description: 'Filter by university' },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['degree', 'exchange', 'pathway', 'diploma', 'certification'] }, description: 'Filter by legacy type string' },
          { name: 'level', in: 'query', schema: { type: 'string', enum: ['undergraduate', 'postgraduate', 'doctoral'] }, description: 'Filter by legacy level string' },
          { name: 'courseCategoryId', in: 'query', schema: { type: 'string' }, description: 'Filter by course category id' },
          { name: 'courseTypeId', in: 'query', schema: { type: 'string' }, description: 'Filter by course type id' },
          { name: 'courseLevelId', in: 'query', schema: { type: 'string' }, description: 'Filter by course level id' },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' }, description: 'Filter by active status' }
        ],
        responses: { 
          '200': { 
            description: 'List of courses',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Course' }
                }
              }
            }
          } 
        }
      },
      post: {
        tags: ['Courses'],
        summary: 'Create course',
        description: 'Create a new course (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CourseCreateRequest' }
            }
          }
        },
        responses: { 
          '201': { 
            description: 'Course created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Course' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin/Editor only' }
        }
      }
    },
    '/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get course by ID',
        description: 'Get a specific course with details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'Course details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Course' }
              }
            }
          },
          '404': { description: 'Course not found' }
        }
      },
      put: {
        tags: ['Courses'],
        summary: 'Update course',
        description: 'Update course details (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CourseCreateRequest' }
            }
          }
        },
        responses: { 
          '200': { 
            description: 'Course updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Course' }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      },
      patch: {
        tags: ['Courses'],
        summary: 'Partially update course',
        description: 'Update specific fields of a course (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { description: 'Course updated' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Courses'],
        summary: 'Delete course',
        description: 'Delete a course (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '204': { description: 'Course deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    },
    '/course-categories': {
      get: {
        tags: ['Course Catalog'],
        summary: 'List course categories',
        description: 'Retrieve all course categories. Use parentId to filter children.',
        parameters: [
          { name: 'parentId', in: 'query', schema: { type: 'string' }, description: 'Return categories under the provided parent id. Omit to fetch root categories.' },
          { name: 'includeInactive', in: 'query', schema: { type: 'boolean' }, description: 'Include inactive categories.' }
        ],
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/CourseCategory' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Course Catalog'],
        summary: 'Create course category',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseCategory' } } }
        },
        responses: {
          '201': { description: 'Category created', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseCategory' } } } }
        }
      }
    },
    '/course-categories/{id}': {
      get: {
        tags: ['Course Catalog'],
        summary: 'Get course category',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Category details', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseCategory' } } } },
          '404': { description: 'Category not found' }
        }
      },
      put: {
        tags: ['Course Catalog'],
        summary: 'Update course category',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseCategory' } } } },
        responses: { '200': { description: 'Category updated' } }
      },
      patch: {
        tags: ['Course Catalog'],
        summary: 'Partially update course category',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Category updated' } }
      },
      delete: {
        tags: ['Course Catalog'],
        summary: 'Delete course category',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Category deleted' } }
      }
    },
    '/course-types': {
      get: {
        tags: ['Course Catalog'],
        summary: 'List course types',
        parameters: [
          { name: 'includeInactive', in: 'query', schema: { type: 'boolean' }, description: 'Include inactive types.' }
        ],
        responses: {
          '200': { description: 'List of types', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/CourseType' } } } } }
        }
      },
      post: {
        tags: ['Course Catalog'],
        summary: 'Create course type',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseType' } } } },
        responses: { '201': { description: 'Type created' } }
      }
    },
    '/course-types/{id}': {
      get: {
        tags: ['Course Catalog'],
        summary: 'Get course type',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Course type', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseType' } } } } }
      },
      put: {
        tags: ['Course Catalog'],
        summary: 'Update course type',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseType' } } } },
        responses: { '200': { description: 'Type updated' } }
      },
      patch: {
        tags: ['Course Catalog'],
        summary: 'Partially update course type',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Type updated' } }
      },
      delete: {
        tags: ['Course Catalog'],
        summary: 'Delete course type',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Type deleted' } }
      }
    },
    '/course-levels': {
      get: {
        tags: ['Course Catalog'],
        summary: 'List course levels',
        parameters: [
          { name: 'includeInactive', in: 'query', schema: { type: 'boolean' }, description: 'Include inactive levels.' }
        ],
        responses: {
          '200': { description: 'List of levels', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/CourseLevel' } } } } }
        }
      },
      post: {
        tags: ['Course Catalog'],
        summary: 'Create course level',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseLevel' } } } },
        responses: { '201': { description: 'Level created' } }
      }
    },
    '/course-levels/{id}': {
      get: {
        tags: ['Course Catalog'],
        summary: 'Get course level',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Course level', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseLevel' } } } } }
      },
      put: {
        tags: ['Course Catalog'],
        summary: 'Update course level',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseLevel' } } } },
        responses: { '200': { description: 'Level updated' } }
      },
      patch: {
        tags: ['Course Catalog'],
        summary: 'Partially update course level',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Level updated' } }
      },
      delete: {
        tags: ['Course Catalog'],
        summary: 'Delete course level',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Level deleted' } }
      }
    },
    '/learning-outcomes': {
      get: {
        tags: ['Course Catalog'],
        summary: 'List learning outcomes',
        parameters: [
          { name: 'parentId', in: 'query', schema: { type: 'string' }, description: 'Filter by parent outcome id.' },
          { name: 'includeInactive', in: 'query', schema: { type: 'boolean' }, description: 'Include inactive outcomes.' }
        ],
        responses: {
          '200': { description: 'List of learning outcomes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/LearningOutcome' } } } } }
        }
      },
      post: {
        tags: ['Course Catalog'],
        summary: 'Create learning outcome',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LearningOutcome' } } } },
        responses: { '201': { description: 'Learning outcome created' } }
      }
    },
    '/learning-outcomes/{id}': {
      get: {
        tags: ['Course Catalog'],
        summary: 'Get learning outcome',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Learning outcome', content: { 'application/json': { schema: { $ref: '#/components/schemas/LearningOutcome' } } } } }
      },
      put: {
        tags: ['Course Catalog'],
        summary: 'Update learning outcome',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LearningOutcome' } } } },
        responses: { '200': { description: 'Learning outcome updated' } }
      },
      patch: {
        tags: ['Course Catalog'],
        summary: 'Partially update learning outcome',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Learning outcome updated' } }
      },
      delete: {
        tags: ['Course Catalog'],
        summary: 'Delete learning outcome',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Learning outcome deleted' } }
      }
    },
    '/applications': {
      get: {
        tags: ['Applications'],
        summary: 'List applications',
        description: 'Get all applications with optional filtering (users see only their own, superadmin/admin see all)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'query', schema: { type: 'string' }, description: 'Filter by user' },
          { name: 'universityId', in: 'query', schema: { type: 'string' }, description: 'Filter by university' },
          { name: 'courseId', in: 'query', schema: { type: 'string' }, description: 'Filter by course' },
          { name: 'formId', in: 'query', schema: { type: 'string' }, description: 'Filter by form' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'] }, description: 'Filter by status' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in form data' },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'number', default: 20, maximum: 100 }, description: 'Items per page' },
          { name: 'sort', in: 'query', schema: { type: 'string', default: '-createdAt' }, description: 'Sort order' }
        ],
        responses: { 
          '200': { 
            description: 'List of applications',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    applications: { type: 'array', items: { $ref: '#/components/schemas/Application' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Applications'],
        summary: 'Create application',
        description: 'Submit a new application',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApplicationCreateRequest' }
            }
          }
        },
        responses: { 
          '201': { 
            description: 'Application created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' }
              }
            }
          },
          '400': { description: 'Invalid request data' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/applications/stats': {
      get: {
        tags: ['Applications'],
        summary: 'Get application statistics',
        description: 'Get application counts by status (users see only their own, superadmin/admin see all)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'query', schema: { type: 'string' }, description: 'Filter by user (superadmin/admin only)' }
        ],
        responses: { 
          '200': { 
            description: 'Application statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApplicationStats' }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/applications/{id}': {
      get: {
        tags: ['Applications'],
        summary: 'Get application by ID',
        description: 'Get a specific application with all details',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'Application details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Application not found' }
        }
      },
      put: {
        tags: ['Applications'],
        summary: 'Update application',
        description: 'Update an application (only drafts can be updated by users, superadmin/admin can update any)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApplicationUpdateRequest' }
            }
          }
        },
        responses: { 
          '200': { 
            description: 'Application updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Application not found' }
        }
      },
      delete: {
        tags: ['Applications'],
        summary: 'Delete application',
        description: 'Delete an application (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'Application deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Application deleted successfully' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Application not found' }
        }
      }
    },
    '/applications/{id}/submit': {
      post: {
        tags: ['Applications'],
        summary: 'Submit application',
        description: 'Change application status from draft to submitted',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'Application submitted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '400': { description: 'Application already submitted' },
          '404': { description: 'Application not found' }
        }
      }
    },
    '/applications/{id}/withdraw': {
      post: {
        tags: ['Applications'],
        summary: 'Withdraw application',
        description: 'Withdraw a submitted application',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 
          '200': { 
            description: 'Application withdrawn',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Application not found' }
        }
      }
    },
    '/applications/{id}/review': {
      post: {
        tags: ['Applications'],
        summary: 'Review application',
        description: 'Accept or reject an application (Admin/Editor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApplicationReviewRequest' }
            }
          }
        },
        responses: { 
          '200': { 
            description: 'Application reviewed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin/Editor only' },
          '404': { description: 'Application not found' }
        }
      }
    },
    // Engagement Builder - Wall Posts
    '/wall-posts': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'List wall posts',
        description: 'Get all wall posts with optional filtering',
        parameters: [
          { name: 'createdBy', in: 'query', schema: { type: 'string' }, description: 'Filter by creator user ID' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in description' }
        ],
        responses: {
          '200': {
            description: 'List of wall posts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/WallPost' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Engagement Builder'],
        summary: 'Create wall post',
        description: 'Create a new wall post (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WallPostCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Wall post created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WallPost' }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Super Admin/Admin only' }
        }
      }
    },
    '/wall-posts/{id}': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'Get wall post by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Wall post details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WallPost' }
              }
            }
          },
          '404': { description: 'Post not found' }
        }
      },
      put: {
        tags: ['Engagement Builder'],
        summary: 'Update wall post',
        description: 'Update a wall post (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WallPostCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Wall post updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WallPost' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Post not found' }
        }
      },
      delete: {
        tags: ['Engagement Builder'],
        summary: 'Delete wall post',
        description: 'Delete a wall post (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Wall post deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Post deleted successfully' },
                    post: { $ref: '#/components/schemas/WallPost' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Post not found' }
        }
      }
    },
    // Engagement Builder - Community Posts
    '/community-posts/categories': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'List community categories',
        description: 'Get all community post categories',
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CommunityCategory' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Engagement Builder'],
        summary: 'Create community category',
        description: 'Create a new community category (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommunityCategoryCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Category created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommunityCategory' }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/community-posts/categories/{id}': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'Get community category by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Category details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommunityCategory' }
              }
            }
          },
          '404': { description: 'Category not found' }
        }
      },
      put: {
        tags: ['Engagement Builder'],
        summary: 'Update community category',
        description: 'Update a community category (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommunityCategoryCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Category updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommunityCategory' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Category not found' }
        }
      },
      delete: {
        tags: ['Engagement Builder'],
        summary: 'Delete community category',
        description: 'Delete a community category (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Category deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Category deleted successfully' },
                    category: { $ref: '#/components/schemas/CommunityCategory' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Category not found' }
        }
      }
    },
    '/community-posts': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'List community posts',
        description: 'Get all community posts with optional filtering',
        parameters: [
          { name: 'categoryId', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
          { name: 'contentType', in: 'query', schema: { type: 'string', enum: ['images', 'notes', 'videos'] }, description: 'Filter by content type' },
          { name: 'isPinned', in: 'query', schema: { type: 'boolean' }, description: 'Filter pinned posts' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in title or description' }
        ],
        responses: {
          '200': {
            description: 'List of community posts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CommunityPost' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Engagement Builder'],
        summary: 'Create community post',
        description: 'Create a new community post (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommunityPostCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Community post created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommunityPost' }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/community-posts/{id}': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'Get community post by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Community post details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommunityPost' }
              }
            }
          },
          '404': { description: 'Post not found' }
        }
      },
      put: {
        tags: ['Engagement Builder'],
        summary: 'Update community post',
        description: 'Update a community post (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommunityPostCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Community post updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommunityPost' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Post not found' }
        }
      },
      delete: {
        tags: ['Engagement Builder'],
        summary: 'Delete community post',
        description: 'Delete a community post (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Community post deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Post deleted successfully' },
                    post: { $ref: '#/components/schemas/CommunityPost' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Post not found' }
        }
      }
    },
    // Engagement Builder - Reels
    '/reels': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'List reels',
        description: 'Get all reels with optional filtering',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'active', 'inactive'] }, description: 'Filter by status' },
          { name: 'visibility', in: 'query', schema: { type: 'string', enum: ['public', 'organization', 'private'] }, description: 'Filter by visibility' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in title, description, or tags' }
        ],
        responses: {
          '200': {
            description: 'List of reels',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Reel' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Engagement Builder'],
        summary: 'Create reel',
        description: 'Create a new reel (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReelCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Reel created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reel' }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/reels/{id}': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'Get reel by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Reel details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reel' }
              }
            }
          },
          '404': { description: 'Reel not found' }
        }
      },
      put: {
        tags: ['Engagement Builder'],
        summary: 'Update reel',
        description: 'Update a reel (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReelCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Reel updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reel' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Reel not found' }
        }
      },
      delete: {
        tags: ['Engagement Builder'],
        summary: 'Delete reel',
        description: 'Delete a reel (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Reel deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Reel deleted successfully' },
                    reel: { $ref: '#/components/schemas/Reel' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Reel not found' }
        }
      }
    },
    '/reels/{id}/views': {
      post: {
        tags: ['Engagement Builder'],
        summary: 'Increment reel views',
        description: 'Increment view count for a reel',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Views incremented',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reel' }
              }
            }
          },
          '404': { description: 'Reel not found' }
        }
      }
    },
    '/reels/{id}/likes': {
      post: {
        tags: ['Engagement Builder'],
        summary: 'Increment reel likes',
        description: 'Increment like count for a reel',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Likes incremented',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reel' }
              }
            }
          },
          '404': { description: 'Reel not found' }
        }
      }
    },
    // Engagement Builder - Events
    '/events': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'List events',
        description: 'Get all events with optional filtering',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'active', 'completed', 'cancelled'] }, description: 'Filter by status' },
          { name: 'mode', in: 'query', schema: { type: 'string', enum: ['online', 'offline', 'hybrid'] }, description: 'Filter by mode' },
          { name: 'difficultyLevel', in: 'query', schema: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] }, description: 'Filter by difficulty' },
          { name: 'subscriptionType', in: 'query', schema: { type: 'string', enum: ['free', 'paid'] }, description: 'Filter by subscription type' },
          { name: 'isPopular', in: 'query', schema: { type: 'boolean' }, description: 'Filter popular events' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in title, description, or category tags' }
        ],
        responses: {
          '200': {
            description: 'List of events',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Event' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Engagement Builder'],
        summary: 'Create event',
        description: 'Create a new event (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Event created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/events/{id}': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'Get event by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Event details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' }
              }
            }
          },
          '404': { description: 'Event not found' }
        }
      },
      put: {
        tags: ['Engagement Builder'],
        summary: 'Update event',
        description: 'Update an event (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Event updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Event not found' }
        }
      },
      delete: {
        tags: ['Engagement Builder'],
        summary: 'Delete event',
        description: 'Delete an event (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Event deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Event deleted successfully' },
                    event: { $ref: '#/components/schemas/Event' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Event not found' }
        }
      }
    },
    '/events/{id}/views': {
      post: {
        tags: ['Engagement Builder'],
        summary: 'Increment event views',
        description: 'Increment view count for an event',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Views incremented',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' }
              }
            }
          },
          '404': { description: 'Event not found' }
        }
      }
    },
    '/events/{id}/registrations': {
      post: {
        tags: ['Engagement Builder'],
        summary: 'Increment event registrations',
        description: 'Increment registration count for an event',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Registrations incremented',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' }
              }
            }
          },
          '404': { description: 'Event not found' }
        }
      }
    },
    // Engagement Builder - Scholarships
    '/scholarships': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'List scholarships',
        description: 'Get all scholarships with optional filtering',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'active', 'inactive', 'completed', 'cancelled'] }, description: 'Filter by status' },
          { name: 'visibility', in: 'query', schema: { type: 'string', enum: ['public', 'organization', 'private'] }, description: 'Filter by visibility' },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['merit', 'need_based', 'partial', 'full', 'fellowship', 'travel_grant'] }, description: 'Filter by type' },
          { name: 'studyLevel', in: 'query', schema: { type: 'string', enum: ['undergraduate', 'postgraduate', 'phd', 'short_course', 'any'] }, description: 'Filter by study level' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in title, description, or provider name' }
        ],
        responses: {
          '200': {
            description: 'List of scholarships',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Scholarship' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Engagement Builder'],
        summary: 'Create scholarship',
        description: 'Create a new scholarship (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ScholarshipCreateRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Scholarship created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Scholarship' }
              }
            }
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/scholarships/{id}': {
      get: {
        tags: ['Engagement Builder'],
        summary: 'Get scholarship by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Scholarship details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Scholarship' }
              }
            }
          },
          '404': { description: 'Scholarship not found' }
        }
      },
      put: {
        tags: ['Engagement Builder'],
        summary: 'Update scholarship',
        description: 'Update a scholarship (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ScholarshipCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Scholarship updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Scholarship' }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Scholarship not found' }
        }
      },
      delete: {
        tags: ['Engagement Builder'],
        summary: 'Delete scholarship',
        description: 'Delete a scholarship (Super Admin/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Scholarship deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Scholarship deleted successfully' },
                    scholarship: { $ref: '#/components/schemas/Scholarship' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Scholarship not found' }
        }
      }
    },
    '/scholarships/{id}/views': {
      post: {
        tags: ['Engagement Builder'],
        summary: 'Increment scholarship views',
        description: 'Increment view count for a scholarship',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Views incremented',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Scholarship' }
              }
            }
          },
          '404': { description: 'Scholarship not found' }
        }
      }
    },
    '/scholarships/{id}/applications': {
      post: {
        tags: ['Engagement Builder'],
        summary: 'Increment scholarship applications',
        description: 'Increment application count for a scholarship',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Applications incremented',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Scholarship' }
              }
            }
          },
          '404': { description: 'Scholarship not found' }
        }
      }
    }
  }
};

export default spec;
