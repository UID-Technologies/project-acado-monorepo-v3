export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
  }
  
  export function isAllowedFileType(filename: string): boolean {
    const allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'xlsx', 'xls']
    const extension = getFileExtension(filename)
    return allowedTypes.includes(extension)
  }
  
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }
  
  export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
  
  