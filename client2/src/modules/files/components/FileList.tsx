import React from 'react';
import { FileItem } from '../../../types';
import { FileText, Download, Trash2, Calendar, User } from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  onDelete: (id: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Project Files ({files.length})</h3>
      </div>

      <div className="divide-y divide-slate-100">
        {files.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No files uploaded yet.</div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-xs uppercase border border-slate-200">
                  {file.type}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{file.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>{file.size}</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {file.uploadedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {file.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert(`Downloading ${file.name}`)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
