/**
 * Utility function to safely extract error messages from API errors
 * Handles both string and object error formats
 */
export function extractErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
  if (!error) return defaultMessage;

  // Handle error object from API response
  if (error?.response?.data?.error) {
    const errorObj = error.response.data.error;
    if (typeof errorObj === 'string') {
      return errorObj;
    }
    if (errorObj?.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }

  // Handle direct error message
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // Fallback to default
  return defaultMessage;
}

