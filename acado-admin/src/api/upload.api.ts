import axiosInstance from '@/lib/axios';

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface UploadProgress {
  fieldName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export const uploadApi = {
  /**
   * Upload a single file
   * @param file - The file to upload
   * @param fieldName - The field name this file belongs to
   * @param onProgress - Optional progress callback
   * @returns Upload response with file URL
   */
  uploadFile: async (
    file: File,
    fieldName: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldName', fieldName);

    const response = await axiosInstance.post<UploadResponse>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  },

  /**
   * Upload multiple files
   * @param files - Array of files with their field names
   * @param onProgress - Optional progress callback for each file
   * @returns Map of field names to upload responses
   */
  uploadFiles: async (
    files: Array<{ file: File; fieldName: string }>,
    onProgress?: (fieldName: string, progress: UploadProgress) => void
  ): Promise<Record<string, UploadResponse>> => {
    const results: Record<string, UploadResponse> = {};
    
    // Upload files sequentially to avoid overwhelming the server
    for (const { file, fieldName } of files) {
      try {
        onProgress?.(fieldName, {
          fieldName,
          progress: 0,
          status: 'uploading',
        });

        const response = await uploadApi.uploadFile(
          file,
          fieldName,
          (progress) => {
            onProgress?.(fieldName, {
              fieldName,
              progress,
              status: 'uploading',
            });
          }
        );

        results[fieldName] = response;

        onProgress?.(fieldName, {
          fieldName,
          progress: 100,
          status: 'success',
        });
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
        onProgress?.(fieldName, {
          fieldName,
          progress: 0,
          status: 'error',
          error: errorMessage,
        });
        throw error;
      }
    }

    return results;
  },
};
