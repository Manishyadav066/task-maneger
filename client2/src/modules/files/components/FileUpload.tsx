import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { FileItem } from '../../../types';

interface FileUploadProps {
  onUpload: (data: Partial<FileItem>) => Promise<FileItem | null>;
  projectId?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, projectId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setUploading(true);
    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    await onUpload({
      name: file.name,
      size: sizeFormatted,
      type: file.name.split('.').pop() || 'doc',
      projectId: projectId || 'proj-1',
    });
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50/50'
          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 bg-white'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <UploadCloud className="w-6 h-6" />
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-800 mb-1">
        {uploading ? 'Uploading asset...' : 'Click to upload or drag and drop'}
      </h4>
      <p className="text-xs text-slate-400">PDF, PNG, JPG, JSON, or Figma exports up to 50MB</p>
    </div>
  );
};
