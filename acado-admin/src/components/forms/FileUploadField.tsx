import { useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  X, 
  File, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { uploadApi, UploadProgress } from '@/api/upload.api';

export interface FileUploadFieldProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  value?: string; // File URL or filename
  error?: string;
  onChange: (fieldName: string, fileUrl: string, fileName: string) => void;
  onFileChange?: (fieldName: string, file: File | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

// Allowed file types
const ALLOWED_TYPES = {
  pdf: ['application/pdf'],
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  documents: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  id,
  name,
  label,
  required = false,
  description,
  value,
  error,
  onChange,
  onFileChange,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = DEFAULT_MAX_SIZE,
  className,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit. Please upload a smaller file.`;
    }

    // Check file type
    const acceptedTypes = accept
      .split(',')
      .map(type => type.trim().toLowerCase())
      .map(type => {
        if (type.startsWith('.')) {
          const ext = type.substring(1);
          if (ext === 'pdf') return ALLOWED_TYPES.pdf;
          if (['doc', 'docx'].includes(ext)) return ALLOWED_TYPES.documents;
          if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return ALLOWED_TYPES.images;
          return [];
        }
        return [type];
      })
      .flat();

    const allAcceptedTypes = [
      ...ALLOWED_TYPES.pdf,
      ...ALLOWED_TYPES.documents,
      ...ALLOWED_TYPES.images,
    ];

    const isValidType = allAcceptedTypes.some(type => 
      file.type === type || acceptedTypes.some(acc => file.type.includes(acc))
    );

    if (!isValidType) {
      return `Invalid file type. Allowed formats: PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP.`;
    }

    return null;
  }, [accept, maxSize]);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      setValidationError(null);
      onFileChange?.(name, null);
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setValidationError(validationError);
      setSelectedFile(null);
      setPreview(null);
      onFileChange?.(name, null);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
    onFileChange?.(name, file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Upload file immediately
    try {
      setUploadProgress({
        fieldName: name,
        progress: 0,
        status: 'uploading',
      });

      const response = await uploadApi.uploadFile(file, name, (progress) => {
        setUploadProgress({
          fieldName: name,
          progress,
          status: 'uploading',
        });
      });

      setUploadProgress({
        fieldName: name,
        progress: 100,
        status: 'success',
      });

      // Update parent component with file URL
      onChange(name, response.url, response.fileName);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
      setUploadProgress({
        fieldName: name,
        progress: 0,
        status: 'error',
        error: errorMessage,
      });
      setSelectedFile(null);
      setPreview(null);
      setValidationError(errorMessage);
    }
  }, [name, validateFile, onChange, onFileChange]);

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(name, '', '');
    onFileChange?.(name, null);
  }, [name, onChange, onFileChange]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: fileInputRef.current } as any);
      }
    }
  }, [handleFileSelect]);

  const hasError = error || validationError || (uploadProgress?.status === 'error');
  const displayError = error || validationError || uploadProgress?.error;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn(hasError && "text-destructive")}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      {/* File Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          hasError
            ? "border-destructive bg-destructive/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          !selectedFile && !value && "cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !selectedFile && !value && fileInputRef.current?.click()}
      >
        {!selectedFile && !value && !uploadProgress && (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {accept} (max {formatFileSize(maxSize)})
              </p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress && uploadProgress.status === 'uploading' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading {selectedFile?.name}...
              </span>
              <span className="text-muted-foreground">{uploadProgress.progress}%</span>
            </div>
            <Progress value={uploadProgress.progress} className="h-2" />
          </div>
        )}

        {/* Selected File Display */}
        {(selectedFile || value) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {preview ? (
                  <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden border">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 flex-shrink-0 rounded border flex items-center justify-center bg-muted">
                    {selectedFile ? getFileIcon(selectedFile) : <FileText className="h-5 w-5" />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile?.name || (value ? value.split('/').pop() : '')}
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  )}
                </div>
                {uploadProgress?.status === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Success State */}
            {uploadProgress?.status === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>File uploaded successfully</span>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <Input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          required={required}
        />
      </div>

      {/* Error Display */}
      {hasError && displayError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Description */}
      {description && !hasError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
