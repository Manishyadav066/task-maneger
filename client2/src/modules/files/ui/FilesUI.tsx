import React from 'react';
import { FileItem } from '../../../types';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { Loader2 } from 'lucide-react';

interface FilesUIProps {
  files: FileItem[];
  loading: boolean;
  onUpload: (data: Partial<FileItem>) => Promise<FileItem | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export const FilesUI: React.FC<FilesUIProps> = ({ files, loading, onUpload, onDelete }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Files & Deliverables</h2>
        <p className="text-xs text-slate-500">
          Upload and manage task design specs, documents, and export assets
        </p>
      </div>

      <FileUpload onUpload={onUpload} />

      {loading ? (
        <div className="p-8 flex justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <FileList files={files} onDelete={onDelete} />
      )}
    </div>
  );
};
