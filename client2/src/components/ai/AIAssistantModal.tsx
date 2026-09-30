import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Check,
  Clock,
  Tag,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { Project, AIGeneratedTaskItem, AISummaryResult, AIDailyReportResult } from '../../types';
import { api } from '../../services/api';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  defaultTab?: 'generator' | 'summary' | 'standup';
  onImportGeneratedTasks: (projectId: string, tasks: AIGeneratedTaskItem[]) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultTab = 'generator',
  onImportGeneratedTasks,
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'summary' | 'standup'>(defaultTab);

  // Generator State
  const [prompt, setPrompt] = useState('Create Modern E-Commerce Website with Checkout');
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<AIGeneratedTaskItem[]>([]);
  const [selectedTaskIndices, setSelectedTaskIndices] = useState<number[]>([]);
  const [generatorSource, setGeneratorSource] = useState<string>('');

  // Summary State
  const [summaryProjectId, setSummaryProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(null);

  // Standup State
  const [isStandupLoading, setIsStandupLoading] = useState(false);
  const [standupReport, setStandupReport] = useState<AIDailyReportResult | null>(null);

  if (!isOpen) return null;

  // Handle Generate Tasks
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await api.generateAITasks(prompt, targetProjectId);
      setGeneratedTasks(res.tasks || []);
      setGeneratorSource(res.source || 'gemini');
      setSelectedTaskIndices((res.tasks || []).map((_, i) => i));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Import
  const handleImportTasks = () => {
    const tasksToImport = generatedTasks.filter((_, i) => selectedTaskIndices.includes(i));
    if (tasksToImport.length === 0) return;
    onImportGeneratedTasks(targetProjectId, tasksToImport);
    onClose();
  };

  // Handle Project Summary
  const handleRunSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await api.getAIProjectSummary(summaryProjectId);
      setSummaryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle Standup Report
  const handleRunStandup = async () => {
    setIsStandupLoading(true);
    try {
      const res = await api.getAIDailyReport();
      setStandupReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStandupLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">TaskFlow AI Copilot</h2>
              <p className="text-[11px] text-slate-300">Copilot Intelligence Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/70">
          <button
            onClick={() => setActiveTab('generator')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            AI Task Generator
          </button>
          <button
            onClick={() => {
              setActiveTab('summary');
              if (!summaryResult) handleRunSummary();
            }}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Project Summary & Risk
          </button>
          <button
            onClick={() => {
              setActiveTab('standup');
              if (!standupReport) handleRunStandup();
            }}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'standup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daily Standup Digest
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: AI Task Generator */}
          {activeTab === 'generator' && (
            <div className="space-y-5">
              <form onSubmit={handleGenerate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Describe what you want to build
                    </label>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Create Website, Mobile App, Setup Stripe Checkout"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Project
                    </label>
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>TaskFlow Copilot Engine</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isGenerating ? 'Analyzing & Generating...' : 'Generate Tasks'}</span>
                  </button>
                </div>
              </form>

              {/* Generated Tasks List */}
              {generatedTasks.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900">
                      Generated Action Plan ({generatedTasks.length} tasks)
                    </div>
                    <button
                      onClick={() => {
                        if (selectedTaskIndices.length === generatedTasks.length) {
                          setSelectedTaskIndices([]);
                        } else {
                          setSelectedTaskIndices(generatedTasks.map((_, i) => i));
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {selectedTaskIndices.length === generatedTasks.length
                        ? 'Deselect all'
                        : 'Select all'}
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {generatedTasks.map((task, idx) => {
                      const isSelected = selectedTaskIndices.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTaskIndices(selectedTaskIndices.filter((i) => i !== idx));
                            } else {
                              setSelectedTaskIndices([...selectedTaskIndices, idx]);
                            }
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/50 border-indigo-200'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {task.priority}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ~{task.estimatedHours} hrs
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {task.description}
                              </p>

                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {task.subtasks.map((sub, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="flex items-center gap-1.5 text-[11px] text-slate-600"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-indigo-400" />
                                      <span>{sub}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Import Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleImportTasks}
                      disabled={selectedTaskIndices.length === 0}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add {selectedTaskIndices.length} Tasks to Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI Project Summary & Risk Analysis */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select
                  value={summaryProjectId}
                  onChange={(e) => setSummaryProjectId(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium focus:outline-hidden"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleRunSummary}
                  disabled={isSummarizing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  {isSummarizing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Regenerate Summary</span>
                </button>
              </div>

              {summaryResult && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-indigo-900">Executive Summary</span>
                      <span className="text-xs font-extrabold text-indigo-600">
                        {summaryResult.progressPercent}% Completed
                      </span>
                    </div>
                    <p className="text-xs text-indigo-950 leading-relaxed">
                      {summaryResult.executiveSummary}
                    </p>
                  </div>

                  {/* Highlights and Bottlenecks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Recent Completed Highlights</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {summaryResult.completedHighlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-amber-700">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Critical Bottlenecks</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {summaryResult.pendingBottlenecks.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-900 mb-2">Recommended Next Actions</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {summaryResult.recommendedActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-bold text-indigo-600">{i + 1}.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Daily Standup Digest */}
          {activeTab === 'standup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Today's Automated Standup</h3>
                <button
                  onClick={handleRunStandup}
                  disabled={isStandupLoading}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isStandupLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Standup</span>
                </button>
              </div>

              {standupReport && (
                <div className="space-y-4">
                  {/* Standup metric cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                      <span className="text-xl font-bold text-emerald-700 block">
                        {standupReport.completedTodayCount}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600">Completed Today</span>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
                      <span className="text-xl font-bold text-indigo-700 block">
                        {standupReport.inProgressCount}
                      </span>
                      <span className="text-[11px] font-medium text-indigo-600">In Progress</span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                      <span className="text-xl font-bold text-rose-700 block">
                        {standupReport.overdueCount}
                      </span>
                      <span className="text-[11px] font-medium text-rose-600">Overdue</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Standup Digest</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {standupReport.standupSummary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                    <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Action Items for Team Sync</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-950">
                      {standupReport.urgentActionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span>→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
