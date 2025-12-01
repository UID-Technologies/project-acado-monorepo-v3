export interface CourseCampaign {
  modeOfDelivery?: string;
  aboutCourse?: string;
  whatWillYouGet?: string;
  brochure?: string;
  eligibility?: string;
  fieldOfStudy?: string;
  duration?: string;
  noOfPeopleRated?: string;
  rating?: string;
  department?: string;
  tuitionFee?: string;
  credits?: string;
  maximumSeats?: string;
  availableSeats?: string;
  preRequisites?: string;
  classSlots?: string;
  language?: string;
  scholarship?: string;
  howToApply?: string;
  courseStructure?: string;
  learningOutcome?: string;
  partners?: string;
  collaboration?: string;
  careerOpportunities?: string;
  courseUSP?: string;
}

export interface Course {
  id: string;
  universityId: string;
  universityName?: string;
  name: string;
  shortName: string;
  courseCode?: string;
  thumbnail?: string;
  bannerImage?: string;
  videoUrl?: string;
  description: string;
  keywords?: string;
  courseCategoryId: string | null;
  courseLevelId: string | null;
  courseTypeId: string | null;
  duration?: string;
  requirements?: string;
  fee?: number;
  currency?: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  applicationFormId?: string | null;
  learningOutcomeIds?: string[];
  isActive: boolean;
  campaign?: CourseCampaign;
  createdAt: string;
  updatedAt: string;
}

