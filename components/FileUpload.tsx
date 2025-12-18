import React, { useCallback, useState } from 'react';
import { ImageFile } from '../types';

interface FileUploadProps {
  onImagesSelected: (images: ImageFile[]) => void;
  isCompact?: boolean;
}

const MAX_FILES_LIMIT = 10;

const FileUpload: React.FC<FileUploadProps> = ({ onImagesSelected, isCompact = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList | File[]) => {
    if (files.length > MAX_FILES_LIMIT) {
      alert(`You can only upload up to ${MAX_FILES_LIMIT} files at a time. Processing the first ${MAX_FILES_LIMIT} files.`);
    }

    const validImages: ImageFile[] = [];
    const fileArray = Array.from(files).slice(0, MAX_FILES_LIMIT);
    
    let processedCount = 0;

    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1];
        
        validImages.push({
          file,
          previewUrl: result,
          base64: base64Data,
          mimeType: file.type
        });

        processedCount++;
        if (processedCount === fileArray.length) {
          onImagesSelected(validImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [onImagesSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value to allow selecting the same files again if needed
      e.target.value = ''; 
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'}
        ${isCompact ? 'h-32' : 'h-48'}
        cursor-pointer
      `}
    >
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="pointer-events-none p-4 space-y-2">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mx-auto text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div>
          <p className="text-base font-medium text-slate-200">
            {isDragging ? 'Drop icons here' : 'Upload Icons'}
          </p>
          <p className="text-xs text-slate-400">
            Drag & drop up to {MAX_FILES_LIMIT} files
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;