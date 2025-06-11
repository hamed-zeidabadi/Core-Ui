export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';
  size: number;
  uploadDate: string;
  uploaderName: string;
  uploaderEmail: string;
  mimeType: string;
  url?: string;
  parentId?: string;
}

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'پروژه‌های طراحی',
    type: 'folder',
    size: 0,
    uploadDate: '2024-01-15T10:30:00Z',
    uploaderName: 'علی احمدی',
    uploaderEmail: 'ali@example.com',
    mimeType: 'folder',
  },
  {
    id: '2',
    name: 'گزارش ماهانه.pdf',
    type: 'document',
    size: 2048576, // 2MB
    uploadDate: '2024-01-14T14:20:00Z',
    uploaderName: 'سارا نجفی',
    uploaderEmail: 'sara@example.com',
    mimeType: 'application/pdf',
    url: '/files/report.pdf',
  },
  {
    id: '3',
    name: 'لوگو شرکت.png',
    type: 'image',
    size: 512000, // 500KB
    uploadDate: '2024-01-13T09:15:00Z',
    uploaderName: 'مریم جوادی',
    uploaderEmail: 'maryam@example.com',
    mimeType: 'image/png',
    url: '/files/logo.png',
  },
  {
    id: '4',
    name: 'ویدیو معرفی محصول.mp4',
    type: 'video',
    size: 52428800, // 50MB
    uploadDate: '2024-01-12T16:45:00Z',
    uploaderName: 'حسین رضایی',
    uploaderEmail: 'hossein@example.com',
    mimeType: 'video/mp4',
    url: '/files/intro.mp4',
  },
  {
    id: '5',
    name: 'آرشیو پروژه.zip',
    type: 'archive',
    size: 10485760, // 10MB
    uploadDate: '2024-01-11T11:30:00Z',
    uploaderName: 'فاطمه کریمی',
    uploaderEmail: 'fateme@example.com',
    mimeType: 'application/zip',
    url: '/files/archive.zip',
  },
  {
    id: '6',
    name: 'موسیقی پس‌زمینه.mp3',
    type: 'audio',
    size: 3145728, // 3MB
    uploadDate: '2024-01-10T13:20:00Z',
    uploaderName: 'امیر محمدی',
    uploaderEmail: 'amir@example.com',
    mimeType: 'audio/mp3',
    url: '/files/background.mp3',
  },
  {
    id: '7',
    name: 'جدول داده‌ها.xlsx',
    type: 'document',
    size: 1048576, // 1MB
    uploadDate: '2024-01-09T08:45:00Z',
    uploaderName: 'زهرا احمدی',
    uploaderEmail: 'zahra@example.com',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: '/files/data.xlsx',
  },
  {
    id: '8',
    name: 'عکس تیم.jpg',
    type: 'image',
    size: 2097152, // 2MB
    uploadDate: '2024-01-08T15:10:00Z',
    uploaderName: 'محمد حسینی',
    uploaderEmail: 'mohammad@example.com',
    mimeType: 'image/jpeg',
    url: '/files/team.jpg',
  },
];

export const storageStats = {
  totalStorage: 107374182400, // 100GB
  usedStorage: 73741824000, // 68.7GB
  availableStorage: 33632358400, // 31.3GB
  fileCount: mockFiles.length,
  folderCount: mockFiles.filter(f => f.type === 'folder').length,
};