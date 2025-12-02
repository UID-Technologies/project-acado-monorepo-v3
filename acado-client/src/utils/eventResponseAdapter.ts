/**
 * Event Response Adapter Utility
 * 
 * Adapts responses from the new acado-api events endpoint to match the expected legacy format.
 * This ensures backward compatibility while transitioning to the new API structure.
 */

/**
 * Maps new API status to legacy status format
 */
function mapEventStatus(apiStatus: string): string {
  const statusMapping: Record<string, string> = {
    'active': 'Ongoing',
    'completed': 'Completed',
    'draft': 'Upcoming',
    'cancelled': 'Cancelled',
  };
  return statusMapping[apiStatus] || apiStatus;
}

/**
 * Maps legacy status to new API status format
 */
function mapLegacyToApiStatus(legacyStatus: string): string {
  const statusMapping: Record<string, string> = {
    'ongoing': 'active',
    'completed': 'completed',
    'upcoming': 'draft',
    'cancelled': 'cancelled',
  };
  return statusMapping[legacyStatus.toLowerCase()] || legacyStatus;
}

/**
 * Formats date to legacy format (YYYY-MM-DD or simple string)
 */
function formatLegacyDate(date: Date | string | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch (error) {
    return String(date);
  }
}

/**
 * Adapts a single event from new API format to legacy format
 * 
 * @param newEvent - Event from acado-api
 * @returns Event in legacy format
 */
export function adaptEventToLegacy(newEvent: any): any {
  if (!newEvent) return null;
  
  // If it's already in legacy format (has 'name' field), return as-is
  if (newEvent.name && !newEvent.title) {
    return newEvent;
  }
  
  return {
    // Basic fields
    id: newEvent.id || newEvent._id,
    name: newEvent.title || newEvent.name, // Map title → name
    description: newEvent.description || '',
    image: newEvent.logo || newEvent.thumbnailUrl || newEvent.image || '', // Map logo → image
    
    // Dates
    start_date: formatLegacyDate(newEvent.registrationStartDate || newEvent.start_date),
    end_date: formatLegacyDate(newEvent.registrationEndDate || newEvent.end_date),
    event_date: formatLegacyDate(newEvent.eventDate || newEvent.event_date),
    event_time: newEvent.eventTime || newEvent.event_time || '',
    
    // Status - Map new API status to legacy format
    com_status: {
      program_status: mapEventStatus(newEvent.status || 'draft'),
      program_time: newEvent.eventTime || newEvent.event_time || '',
    },
    
    // Mode and type
    mode: newEvent.mode || 'online',
    type: 'event', // Always 'event' for events endpoint
    
    // Additional fields
    difficulty_level: newEvent.difficultyLevel || newEvent.difficulty_level,
    subscription_type: newEvent.subscriptionType || newEvent.subscription_type,
    is_popular: newEvent.isPopular ?? newEvent.is_popular ?? false,
    
    // Metadata
    conducted_by: newEvent.conductedBy || newEvent.conducted_by || '',
    functional_domain: newEvent.functionalDomain || newEvent.functional_domain || '',
    job_role: newEvent.jobRole || newEvent.job_role || '',
    skills: newEvent.skills || [],
    category_tags: newEvent.categoryTags || newEvent.category_tags || [],
    
    // Registration
    registration_start_date: formatLegacyDate(newEvent.registrationStartDate),
    registration_end_date: formatLegacyDate(newEvent.registrationEndDate),
    max_seats: newEvent.registrationSettings?.maxSeats || newEvent.max_seats,
    
    // Content blocks
    whats_in_it_for_you: newEvent.whatsInItForYou || newEvent.whats_in_it_for_you || '',
    instructions: newEvent.instructions || '',
    faq: newEvent.faq || '',
    additional_info: newEvent.additionalInfo || newEvent.additional_info || '',
    
    // Expert info
    expert_id: newEvent.expertId || newEvent.expert_id,
    expert_name: newEvent.expertName || newEvent.expert_name || '',
    
    // Venue
    venue: newEvent.venue || '',
    
    // Analytics
    registrations: newEvent.registrations || 0,
    views: newEvent.views || 0,
    completions: newEvent.completions || 0,
    
    // Stages
    stages: newEvent.stages || [],
    
    // Eligibility
    eligibility: newEvent.eligibility || {},
    
    // Timestamps
    created_at: newEvent.createdAt || newEvent.created_at,
    updated_at: newEvent.updatedAt || newEvent.updated_at,
    published_at: newEvent.publishedAt || newEvent.published_at,
    
    // Keep original data for reference
    _original: newEvent,
  };
}

/**
 * Adapts an array of events from new API format to legacy format
 * 
 * @param events - Array of events from acado-api
 * @returns Array of events in legacy format
 */
export function adaptEventsArrayToLegacy(events: any[]): any[] {
  if (!Array.isArray(events)) return [];
  return events.map(adaptEventToLegacy).filter(Boolean);
}

/**
 * Adapts event list response from new API to legacy format
 * 
 * @param response - Response from API
 * @returns Adapted response in legacy format
 */
export function adaptEventsResponse(response: any): any {
  console.log('🔄 Adapting events response:', { 
    hasSuccess: 'success' in response, 
    hasData: 'data' in response,
    dataType: Array.isArray(response?.data) ? 'array' : typeof response?.data,
    dataCount: Array.isArray(response?.data) ? response.data.length : 0
  });
  
  // If response has 'success' field, it's from new API
  if (response && typeof response === 'object' && 'success' in response) {
    const events = Array.isArray(response.data) ? response.data : [];
    const adapted = {
      data: adaptEventsArrayToLegacy(events),
      // Include pagination if available
      pagination: response.meta || response.pagination,
    };
    console.log('✅ Adapted events:', adapted.data.length, 'events');
    return adapted;
  }
  
  // If it's already in legacy format with 'data' array
  if (response && Array.isArray(response.data)) {
    return {
      data: adaptEventsArrayToLegacy(response.data),
      pagination: response.pagination,
    };
  }
  
  // If it's just an array
  if (Array.isArray(response)) {
    return {
      data: adaptEventsArrayToLegacy(response),
    };
  }
  
  console.warn('⚠️ Unknown response format:', response);
  return response;
}

/**
 * Adapts event details response from new API to legacy format
 * The legacy format has a nested structure: { competitions_details: { program: {...} }, competition_instructions: {...} }
 * 
 * @param response - Response from API
 * @returns Adapted event details in legacy format
 */
export function adaptEventDetailsResponse(response: any): any {
  console.log('🔄 Adapting event details response:', response);
  
  let eventData: any;
  
  // Extract event data from response
  if (response && typeof response === 'object' && 'success' in response) {
    eventData = response.data;
  } else if (response && response.data) {
    eventData = response.data;
  } else {
    eventData = response;
  }
  
  // If it's already in legacy format (has competitions_details), return as-is
  if (eventData?.competitions_details) {
    console.log('✅ Already in legacy format');
    return eventData;
  }
  
  // Adapt to legacy format with nested structure
  const adaptedEvent = adaptEventToLegacy(eventData);
  
  const legacyFormat = {
    competitions_details: {
      program: {
        id: adaptedEvent.id,
        name: adaptedEvent.name,
        description: adaptedEvent.description,
        image: adaptedEvent.image,
        start_date: adaptedEvent.start_date,
        end_date: adaptedEvent.end_date,
        event_details: {
          event_datetime: adaptedEvent.event_date,
          event_time: adaptedEvent.event_time,
          functional_domain: adaptedEvent.functional_domain,
          job_role: adaptedEvent.job_role,
          conducted_by: adaptedEvent.conducted_by,
          mode: adaptedEvent.mode,
          venue: adaptedEvent.venue,
        },
        com_status: adaptedEvent.com_status,
        registration_start_date: adaptedEvent.registration_start_date,
        registration_end_date: adaptedEvent.registration_end_date,
        max_seats: adaptedEvent.max_seats,
        registrations: adaptedEvent.registrations,
        views: adaptedEvent.views,
      }
    },
    competition_instructions: {
      whats_in: adaptedEvent.whats_in_it_for_you,
      instructions: adaptedEvent.instructions,
      faq: adaptedEvent.faq,
    },
    job_skill_details: {
      all_program_skills: adaptedEvent.skills?.map((skill: string) => ({ skill_name: skill })) || []
    },
    // Include stages if available
    stages: adaptedEvent.stages || [],
    // Include eligibility if available
    eligibility: adaptedEvent.eligibility || {},
  };
  
  console.log('✅ Adapted to legacy format with nested structure');
  return legacyFormat;
}

/**
 * Checks if an event is ongoing based on dates
 * 
 * @param event - Event object (legacy or new format)
 * @returns true if event is ongoing
 */
export function isEventOngoing(event: any): boolean {
  const now = new Date();
  const startDate = new Date(event.start_date || event.registrationStartDate);
  const endDate = new Date(event.end_date || event.registrationEndDate);
  
  return now >= startDate && now <= endDate;
}

/**
 * Checks if an event is completed
 * 
 * @param event - Event object (legacy or new format)
 * @returns true if event is completed
 */
export function isEventCompleted(event: any): boolean {
  const now = new Date();
  const endDate = new Date(event.end_date || event.registrationEndDate || event.eventDate);
  
  return now > endDate;
}

/**
 * Gets event status class for styling
 * 
 * @param event - Event object
 * @returns CSS class string
 */
export function getEventStatusClass(event: any): string {
  const status = event.com_status?.program_status || event.status;
  
  switch (status?.toLowerCase()) {
    case 'ongoing':
    case 'active':
      return 'bg-green-500 text-white';
    case 'completed':
      return 'bg-red-500 text-white';
    case 'upcoming':
    case 'draft':
      return 'bg-blue-500 text-white';
    case 'cancelled':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

