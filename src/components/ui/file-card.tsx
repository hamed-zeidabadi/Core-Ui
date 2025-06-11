import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  File,
  Folder,
  Image,
  Video,
  Music,
  Archive,
  FileText,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Share,
  Edit,
} from 'lucide-react';
import { FileItem } from '@/data/mockFileData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FileCardProps {
  file: FileItem;
  onDelete?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  onView?: (fileId: string) => void;
  className?: string;
}

const getFileIcon = (type: FileItem['type'], size: number = 24) => {
  const iconProps = { size, className: 'text-muted-foreground' };
  
  switch (type) {
    case 'folder':
      return <Folder {...iconProps} className="text-blue-600" />;
    case 'image':
      return <Image {...iconProps} className="text-green-600" />;
    case 'video':
      return <Video {...iconProps} className="text-purple-600" />;
    case 'audio':
      return <Music {...iconProps} className="text-orange-600" />;
    case 'archive':
      return <Archive {...iconProps} className="text-yellow-600" />;
    case 'document':
      return <FileText {...iconProps} className="text-red-600" />;
    default:
      return <File {...iconProps} />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getFileTypeLabel = (type: FileItem['type']) => {
  switch (type) {
    case 'folder':
      return 'پوشه';
    case 'image':
      return 'تصویر';
    case 'video':
      return 'ویدیو';
    case 'audio':
      return 'صوتی';
    case 'archive':
      return 'آرشیو';
    case 'document':
      return 'سند';
    default:
      return 'فایل';
  }
};

export function FileCard({ file, onDelete, onDownload, onView, className }: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete?.(file.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={cn('hover:shadow-md transition-shadow group', className)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type, 32)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getFileTypeLabel(file.type)}
                    </Badge>
                    {file.type !== 'folder' && (
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onView?.(file.id)} className="gap-2">
                    <Eye className="h-4 w-4" />
                    مشاهده
                  </DropdownMenuItem>
                  {file.type !== 'folder' && (
                    <DropdownMenuItem onClick={() => onDownload?.(file.id)} className="gap-2">
                      <Download className="h-4 w-4" />
                      دانلود
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="gap-2">
                    <Share className="h-4 w-4" />
                    اشتراک‌گذاری
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Edit className="h-4 w-4" />
                    تغییر نام
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>آپلودکننده:</span>
                <span className="font-medium">{file.uploaderName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>تاریخ:</span>
                <span>{formatDate(file.uploadDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف فایل</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید "{file.name}" را حذف کنید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}