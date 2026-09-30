import React, { useState } from 'react';
import { Project } from '../../types';
import { FileText, Download, UploadCloud, Search, Folder, Trash2, CheckCircle2 } from 'lucide-react';

interface FilesViewProps {
  projects: Project[];
}

export const FilesView: React.FC<FilesViewProps> = ({ projects }) => {
  const [files, setFiles] = useState([
    {
      id: 'f-1',
      name: 'Design_System_Tokens_v2.fig',
      size: '24.5 MB',
      type: 'Figma Design',
      project: 'Frontend Web App',
      uploadedBy: 'Sarah Jenkins',
      date: 'Sep 18, 2026',
    },
    {
      id: 'f-2',
      name: 'Swagger_OpenAPI_v3.yaml',
      size: '1.2 MB',
      type: 'YAML Specification',
      project: 'Backend Microservices',
      uploadedBy: 'David Kim',
      date: 'Sep 17, 2026',
    },
    {
      id: 'f-3',
      name: 'Q3_Sprint_Deliverables_Summary.pdf',
      size: '4.8 MB',
      type: 'PDF Document',
      project: 'Frontend Web App',
      uploadedBy: 'Alex Morgan',
      date: 'Sep 16, 2026',
    },
    {
      id: 'f-4',
      name: 'iOS_Build_Archive_1.0.4.ipa',
      size: '68.1 MB',
      type: 'iOS Package',
      project: 'Mobile iOS & Android',
      uploadedBy: 'Priya Sharma',
      date: 'Sep 15, 2026',
    },
    {
      id: 'f-5',
      name: 'Landing_Page_Copywriting_v1.docx',
      size: '850 KB',
      type: 'Word Document',
      project: 'Marketing Landing Page',
      uploadedBy: 'Emma Watson',
      date: 'Sep 14, 2026',
    },
  ]);

  const [search, setSearch] = useState('');
  const [uploadedNotification, setUploadedNotification] = useState(false);

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.project.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulateUpload = () => {
    const newFile = {
      id: `f-${Date.now()}`,
      name: `Sprint_Release_Notes_${new Date().toISOString().slice(0, 10)}.pdf`,
      size: '2.1 MB',
      type: 'PDF Document',
      project: projects[0]?.name || 'Frontend Web App',
      uploadedBy: 'Alex Morgan',
      date: 'Today',
    };
    setFiles([newFile, ...files]);
    setUploadedNotification(true);
    setTimeout(() => setUploadedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Workspace Files & Assets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Specifications, architecture diagrams, design tokens, and release archives.
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {uploadedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>New file uploaded successfully to workspace storage.</span>
        </div>
      )}

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span>{files.length} Total Files</span>
          <span className="text-slate-400">Total Size: 99.45 MB</span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">File Name</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{file.name}</div>
                      <div className="text-[11px] text-slate-400">{file.type}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{file.project}</td>
                  <td className="py-3.5 px-4 text-slate-500">{file.size}</td>
                  <td className="py-3.5 px-4 text-slate-600">{file.uploadedBy}</td>
                  <td className="py-3.5 px-4 text-slate-400">{file.date}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => alert(`Simulating secure download for ${file.name}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
