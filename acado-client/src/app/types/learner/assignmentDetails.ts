export interface SubmissionDetail {
    id: number;
    content_id: number;
    user_id: number;
    marks_obtained: number | null;
    is_passed: number;
    user_notes: string;
    teacher_notes: string | null;
    review_status: number;
    file: string;
    created_at: number;
    updated_at: number;
    organization_id: number | null;
    teacher_file: string;
    start_date_ts: number | null;
    end_date_ts: number | null;
}

export interface AssessmentDetail {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    file: string;
    allow_multiple: number;
    is_graded: number;
    submission_mode: number;
    learner_name: string;
    submission_details: SubmissionDetail[];
}

// export interface AssessmentData {
//     assessment_details: AssessmentDetail[];
// }

export interface AssessmentResponse {
    status: number;
    data: {
        assessment_details: AssessmentDetail[];
    }
    error: string[];
}

export type AllowedFileType = 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'zip' | 'xlsx' | 'xls';

export interface FileInfo {
    name: string;
    type: AllowedFileType;
    size: number;
    url: string;
}

export function convertApiAssessment(apiAssessment: AssessmentDetail): Assignment {
    const fileUrl = apiAssessment.file;
    const fileName = fileUrl.split('/').pop() || 'assignment.pdf';
    const fileType = fileName.split('.').pop()?.toLowerCase() as AllowedFileType;

    return {
        id: apiAssessment.id.toString(),
        title: apiAssessment.title,
        description: apiAssessment.description,
        startDate: new Date(apiAssessment.start_date),
        endDate: new Date(apiAssessment.end_date),
        file: fileUrl ? {
            name: fileName,
            type: fileType || 'pdf', // Set default to 'pdf' if type is not available
            size: 0, // You can update this if you have a way to calculate the file size (e.g., via an API)
            url: fileUrl
        } : null,
        allowMultiple: Boolean(apiAssessment.allow_multiple),
        isGraded: Boolean(apiAssessment.is_graded),
        submissionMode: apiAssessment.submission_mode,
        learnerName: apiAssessment.learner_name,
        submissionDetails: apiAssessment.submission_details,
    };
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    file: FileInfo | null;
    allowMultiple: boolean;
    isGraded: boolean;
    submissionMode: number;
    learnerName: string;
    submissionDetails: SubmissionDetail[];
    submittedAt?: Date;
}
