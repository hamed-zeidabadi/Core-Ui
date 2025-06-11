import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileCard } from '@/components/ui/file-card';
import { FileUpload } from '@/components/ui/file-upload';
import { StorageInfo } from '@/components/ui/storage-info';
import { mockFiles, FileItem } from '@/data/mockFileData';
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';
type FilterBy = 'all' | 'folder' | 'image' | 'document' | 'video' | 'audio' | 'archive';

export function FileManagerPage() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || file.type === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'fa');
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast.success('فایل با موفقیت حذف شد');
  };

  const handleFileDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast.success(`دانلود ${file.name} شروع شد`);
      // In a real app, you would trigger the actual download here
    }
  };

  const handleFileView = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast.info(`نمایش ${file.name}`);
      // In a real app, you would open a preview modal or navigate to a view page
    }
  };

  const handleUploadComplete = (uploadedFiles: File[]) => {
    // In a real app, you would upload to your server and get back file metadata
    const newFiles: FileItem[] = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: getFileType(file.type),
      size: file.size,
      uploadDate: new Date().toISOString(),
      uploaderName: 'کاربر فعلی',
      uploaderEmail: 'current@example.com',
      mimeType: file.type,
      url: URL.createObjectURL(file),
    }));

    setFiles(prev => [...newFiles, ...prev]);
    setShowUploadDialog(false);
    toast.success(`${uploadedFiles.length} فایل با موفقیت آپلود شد`);
  };

  const getFileType = (mimeType: string): FileItem['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('spreadsheet')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
    return 'other';
  };

  const filterOptions = [
    { value: 'all', label: 'همه فایل‌ها' },
    { value: 'folder', label: 'پوشه‌ها' },
    { value: 'image', label: 'تصاویر' },
    { value: 'document', label: 'اسناد' },
    { value: 'video', label: 'ویدیوها' },
    { value: 'audio', label: 'فایل‌های صوتی' },
    { value: 'archive', label: 'آرشیوها' },
  ];

  const sortOptions = [
    { value: 'date', label: 'تاریخ' },
    { value: 'name', label: 'نام' },
    { value: 'size', label: 'اندازه' },
    { value: 'type', label: 'نوع' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت فایل‌ها</h1>
          <p className="text-muted-foreground">
            مدیریت و سازماندهی فایل‌های خود
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            پوشه جدید
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                آپلود فایل
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>آپلود فایل‌های جدید</DialogTitle>
                <DialogDescription>
                  فایل‌های خود را انتخاب کنید یا بکشید و رها کنید
                </DialogDescription>
              </DialogHeader>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters and Controls */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="جستجو در فایل‌ها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 md:w-64"
                  />
                </div>

                {/* Filter */}
                <Select value={filterBy} onValueChange={(value: FilterBy) => setFilterBy(value)}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 ml-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SortAsc className="h-4 w-4 ml-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  بروزرسانی
                </Button>
              </div>
            </div>
          </Card>

          {/* Files Grid/List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedFiles.length} فایل یافت شد
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  viewMode === 'grid'
                    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-2'
                }
              >
                <AnimatePresence>
                  {filteredAndSortedFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleFileDelete}
                      onDownload={handleFileDownload}
                      onView={handleFileView}
                      className={viewMode === 'list' ? 'w-full' : ''}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {filteredAndSortedFiles.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">فایلی یافت نشد</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterBy !== 'all'
                    ? 'فیلترهای خود را تغییر دهید یا جستجوی جدیدی انجام دهید'
                    : 'هنوز فایلی آپلود نکرده‌اید'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StorageInfo />
        </div>
      </div>
    </div>
  );
}