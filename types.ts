export interface GeneratedTagsResponse {
  tags: string[];
}

export interface IconItem {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
  status: 'IDLE' | 'PENDING' | 'ANALYZING' | 'SUCCESS' | 'ERROR';
  tags: string[];
  error?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}