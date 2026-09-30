
import React from "react";

import { Workspace } from "../../../types";

import {
  Building2,
  Users,
  ArrowRight,
} from "lucide-react";

interface WorkspaceCardProps {
  workspace: Workspace;

  isActive?: boolean;

  onSelect: (workspace: Workspace) => void;

  // Open workspace details
  onViewDetails?: (workspace: Workspace) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  isActive = false,
  onSelect,
  onViewDetails,
}) => {
  return (
    <div
      onClick={() => onSelect(workspace)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
        isActive
          ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-md"
          : "border-slate-200/80 hover:border-indigo-200 hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
          <Building2 className="w-5 h-5" />
        </div>

        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
          {workspace.plan}
        </span>
      </div>

      {/* Workspace Name */}
      <h3 className="text-base font-bold text-slate-900 mb-1">
        {workspace.name}
      </h3>

      <p className="text-xs text-slate-500 mb-4">
        slug: @{workspace.slug}
      </p>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-400" />

          <span>
            {workspace.membersCount || 4} members
          </span>
        </div>

        {/* Open Button */}
        {onViewDetails ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(workspace);
            }}
            className="flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors cursor-pointer"
          >
            <span>Open</span>

            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 text-indigo-600 font-semibold">
            <span>Open</span>

            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};

