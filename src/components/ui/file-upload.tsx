import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface FileUploadProps {
  onUploadComplete?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

export function FileUpload({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['*'],
  className
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files)
      .slice(0, maxFiles - uploadFiles.length)
      .filter(file => file.size <= maxSize)
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading' as const,
      }));

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          const isCompleted = newProgress >= 100;
          
          if (isCompleted) {
            clearInterval(interval);
            return { ...file, progress: 100, status: 'completed' as const };
          }
          
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const completedFiles = uploadFiles.filter(f => f.status === 'completed');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          'hover:border-primary hover:bg-primary/5'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">فایل‌های خود را اینجا بکشید</h3>
          <p className="text-sm text-muted-foreground mb-4">
            یا کلیک کنید تا فایل انتخاب کنید
          </p>
          <Button variant="outline" size="sm">
            انتخاب فایل
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            حداکثر {formatFileSize(maxSize)} برای هر فایل
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept={acceptedTypes.join(',')}
      />

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">در حال آپلود ({uploadFiles.length})</h4>
          {uploadFiles.map((uploadFile) => (
            <Card key={uploadFile.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {uploadFile.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <File className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(uploadFile.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={uploadFile.progress} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(uploadFile.progress)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Files Summary */}
      {completedFiles.length > 0 && (
        <div className="text-sm text-green-600">
          ✓ {completedFiles.length} فایل با موفقیت آپلود شد
        </div>
      )}
    </div>
  );
}