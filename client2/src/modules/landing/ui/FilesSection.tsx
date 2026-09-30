import React from 'react';
import {
  FileText,
  UploadCloud,
  Download,
  Share2,
  Bell,
  CheckCircle2,
  FileCode,
  FileImage,
  FolderArchive,
  UserCheck,
} from 'lucide-react';

export const FilesSection: React.FC = () => {
  const filesList = [
    { name: 'Architecture_System_Specs_v2.pdf', size: '2.4 MB', date: 'Today', icon: FileText, color: 'text-rose-500' },
    { name: 'Brand_Assets_Kit_2026.zip', size: '18.2 MB', date: 'Yesterday', icon: FolderArchive, color: 'text-amber-500' },
    { name: 'Dashboard_Figma_Handoff.png', size: '4.8 MB', date: '3 days ago', icon: FileImage, color: 'text-indigo-500' },
  ];

  const recentNotifications = [
    { title: 'Task Assigned', desc: 'Sarah assigned you "Payment Integration Stripe Webhook"', time: '5m ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { title: 'Project Updated', desc: 'Backend API milestone marked at 92%', time: '22m ago', icon: FileCode, color: 'text-indigo-500' },
    { title: 'New Member Added', desc: 'Elena Rostova accepted invitation to Workspace', time: '1h ago', icon: UserCheck, color: 'text-purple-500' },
    { title: 'Comment Added', desc: 'Alex Rivera commented on Sprint 4 Retro', time: '2h ago', icon: Share2, color: 'text-blue-500' },
  ];

  return (
    <section id="files" className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Section 6: Files & Documents (/api/files) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Files & Assets Library</h3>
                    <div className="text-[11px] text-slate-500">Fast asset management attached to tasks</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  /api/files
                </span>
              </div>

              {/* Action features: Upload Files, Download Assets, Manage Documents, Team Sharing */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-center">
                  <UploadCloud className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <div className="text-xs font-bold text-slate-800">Upload Files</div>
                  <div className="text-[10px] text-slate-500">Drag & drop docs</div>
                </div>
                <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-center">
                  <Download className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <div className="text-xs font-bold text-slate-800">Download Assets</div>
                  <div className="text-[10px] text-slate-500">Fast direct CDN</div>
                </div>
                <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-center">
                  <FileText className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <div className="text-xs font-bold text-slate-800">Manage Documents</div>
                  <div className="text-[10px] text-slate-500">Version history</div>
                </div>
                <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-center">
                  <Share2 className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <div className="text-xs font-bold text-slate-800">Team Sharing</div>
                  <div className="text-[10px] text-slate-500">Secure permissions</div>
                </div>
              </div>

              {/* Sample Files List */}
              <div className="space-y-2">
                {filesList.map((file, idx) => {
                  const Icon = file.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 ${file.color} shrink-0`} />
                        <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 shrink-0 ml-2">
                        <span>{file.size}</span>
                        <Download className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-600 cursor-pointer" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Unlimited storage on Pro & Enterprise plans</span>
              <span className="text-emerald-600 font-bold">100% Virus-scanned</span>
            </div>
          </div>

          {/* Section 7: Activity & Notifications (/api/activities, /api/notifications) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Activity & Real-time Alerts</h3>
                    <div className="text-[11px] text-slate-500">Instant updates across all devices</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  /api/activities
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {recentNotifications.map((notif, idx) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50/60 border border-slate-100 rounded-2xl flex items-start gap-3 hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="mt-0.5 shrink-0">
                        <Icon className={`w-4 h-4 ${notif.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{notif.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Webhooks & Slack integration available</span>
              <span className="text-indigo-600 font-bold">Zero alert fatigue</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
