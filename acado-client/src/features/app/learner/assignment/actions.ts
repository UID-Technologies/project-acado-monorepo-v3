export async function submitAssignment(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: 'Assignment submitted successfully!'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to submit assignment. Please try again.'
    }
  }
}

