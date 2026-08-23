import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  CloudResumeDocument,
  fetchUserResumes,
  saveResumeToCloud,
  deleteCloudResume,
  duplicateCloudResume,
  renameCloudResume,
} from '../../services/resumeStorageService';
import { ResumeData, ThemeConfig } from '../../types/resume';
import {
  X,
  Cloud,
  Plus,
  FolderOpen,
  Copy,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Sparkles,
  Loader2,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
} from 'lucide-react';

interface CloudResumesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResume: ResumeData;
  currentTheme: ThemeConfig;
  currentAtsScore: number;
  activeCloudResumeId: string | null;
  onLoadResume: (resume: ResumeData, theme?: ThemeConfig, cloudId?: string) => void;
  onSetActiveCloudResumeId: (id: string | null) => void;
  onOpenAuthModal: () => void;
}

export const CloudResumesModal: React.FC<CloudResumesModalProps> = ({
  isOpen,
  onClose,
  currentResume,
  currentTheme,
  currentAtsScore,
  activeCloudResumeId,
  onLoadResume,
  onSetActiveCloudResumeId,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<CloudResumeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [showNewResumeInput, setShowNewResumeInput] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadResumes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchUserResumes(user.uid);
      setResumes(data);
    } catch (err) {
      console.error('Failed to load cloud resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadResumes();
      setShowNewResumeInput(false);
      setFeedbackMsg(null);
    }
  }, [isOpen, user]);

  const handleSaveCurrentAsNew = async () => {
    if (!user) return;
    const title = newResumeTitle.trim() || `${currentResume.personalInfo?.fullName || 'My'} Resume`;
    setActionInProgress('saving-new');
    try {
      const newId = await saveResumeToCloud(
        user.uid,
        null,
        title,
        currentResume,
        currentTheme,
        currentAtsScore
      );
      onSetActiveCloudResumeId(newId);
      setFeedbackMsg({ text: `Saved "${title}" to your Cloud account!`, type: 'success' });
      setShowNewResumeInput(false);
      setNewResumeTitle('');
      await loadResumes();
    } catch (err) {
      console.error('Save error:', err);
      setFeedbackMsg({ text: 'Failed to save resume. Please try again.', type: 'error' });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOverwriteCurrent = async (id: string, existingTitle: string) => {
    if (!user) return;
    setActionInProgress(`overwrite-${id}`);
    try {
      await saveResumeToCloud(
        user.uid,
        id,
        existingTitle,
        currentResume,
        currentTheme,
        currentAtsScore
      );
      onSetActiveCloudResumeId(id);
      setFeedbackMsg({ text: `Updated "${existingTitle}" with your current editor changes!`, type: 'success' });
      await loadResumes();
    } catch (err) {
      console.error('Overwrite error:', err);
      setFeedbackMsg({ text: 'Failed to update resume.', type: 'error' });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleLoad = (doc: CloudResumeDocument) => {
    onLoadResume(doc.resumeData, doc.theme, doc.id);
    onSetActiveCloudResumeId(doc.id);
    setFeedbackMsg({ text: `Loaded "${doc.title}" into editor!`, type: 'success' });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleDuplicate = async (id: string) => {
    if (!user) return;
    setActionInProgress(`dup-${id}`);
    try {
      await duplicateCloudResume(user.uid, id);
      await loadResumes();
      setFeedbackMsg({ text: 'Resume duplicated successfully!', type: 'success' });
    } catch (err) {
      console.error('Duplicate error:', err);
      setFeedbackMsg({ text: 'Failed to duplicate resume.', type: 'error' });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!user) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from your cloud account?`)) {
      return;
    }
    setActionInProgress(`del-${id}`);
    try {
      await deleteCloudResume(user.uid, id);
      if (activeCloudResumeId === id) {
        onSetActiveCloudResumeId(null);
      }
      await loadResumes();
      setFeedbackMsg({ text: `Deleted "${title}"`, type: 'success' });
    } catch (err) {
      console.error('Delete error:', err);
      setFeedbackMsg({ text: 'Failed to delete resume.', type: 'error' });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = async (id: string) => {
    if (!user || !editTitle.trim()) {
      setEditingId(null);
      return;
    }
    setActionInProgress(`rename-${id}`);
    try {
      await renameCloudResume(user.uid, id, editTitle.trim());
      setEditingId(null);
      await loadResumes();
    } catch (err) {
      console.error('Rename error:', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString();
      }
    } catch (e) {
      return 'Recently';
    }
    return 'Recently';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cloud-resumes-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <motion.div
            key="cloud-resumes-card"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-800">My Cloud Resumes</h2>
                    {user && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                        {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Saved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {user
                      ? `Sync and manage your resumes securely for ${user.email || user.displayName}`
                      : 'Sign in to save and manage resumes in the cloud'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification feedback message */}
            {feedbackMsg && (
              <div
                className={`px-5 py-2.5 text-xs font-semibold flex items-center gap-2 ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-b border-rose-200'
                }`}
              >
                {feedbackMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!user ? (
                /* Unauthenticated View */
                <div className="text-center py-8 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-base font-bold text-slate-800">Save Your Resumes to the Cloud</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Create an account or log in to sync your work across all your devices, save multiple versions tailored for different jobs, and never lose your edits.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuthModal();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Sign In or Sign Up Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Authenticated Resumes List */
                <>
                  {/* Action Bar: Save Current Resume */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Current Editor Draft</h4>
                          <p className="text-[11px] text-slate-500">
                            {currentResume.personalInfo?.fullName || 'Untitled'} • {currentTheme.template} template • ATS {currentAtsScore}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeCloudResumeId && (
                          <button
                            onClick={() => {
                              const match = resumes.find((r) => r.id === activeCloudResumeId);
                              handleOverwriteCurrent(activeCloudResumeId, match?.title || 'Current Resume');
                            }}
                            disabled={actionInProgress !== null}
                            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            title="Update the currently loaded cloud document with changes from the editor"
                          >
                            {actionInProgress?.startsWith('overwrite-') ? (
                              <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            ) : (
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                            )}
                            <span>Update Active Cloud Resume</span>
                          </button>
                        )}

                        {!showNewResumeInput ? (
                          <button
                            onClick={() => setShowNewResumeInput(true)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Save as New Cloud Resume</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newResumeTitle}
                              onChange={(e) => setNewResumeTitle(e.target.value)}
                              placeholder="Resume Title (e.g. Google Role)"
                              className="px-2.5 py-1.5 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveCurrentAsNew}
                              disabled={actionInProgress === 'saving-new'}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              {actionInProgress === 'saving-new' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setShowNewResumeInput(false)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* List of Saved Resumes */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                      Your Cloud Documents ({resumes.length})
                    </h3>

                    {loading ? (
                      <div className="text-center py-10 space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                        <p className="text-xs text-slate-500">Loading your saved resumes...</p>
                      </div>
                    ) : resumes.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No cloud resumes saved yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Click "Save as New Cloud Resume" above to store your first resume in the cloud.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {resumes.map((doc) => {
                          const isActive = activeCloudResumeId === doc.id;
                          return (
                            <div
                              key={doc.id}
                              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                isActive
                                  ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Left details */}
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  <FileText className="w-4 h-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  {editingId === doc.id ? (
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="px-2 py-0.5 text-xs bg-white border border-blue-400 rounded-md focus:outline-none w-full"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => handleSaveRename(doc.id)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="p-1 text-slate-400 hover:bg-slate-100 rounded-md"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-bold text-slate-800 truncate">
                                        {doc.title}
                                      </h4>
                                      {isActive && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-600 text-white rounded-md shrink-0">
                                          Currently Open
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleStartRename(doc.id, doc.title)}
                                        className="p-1 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Rename"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(doc.updatedAt)}
                                    </span>
                                    <span>•</span>
                                    <span className="capitalize">{doc.theme?.template || 'modern'} template</span>
                                    <span>•</span>
                                    <span className="font-semibold text-emerald-600">
                                      ATS {doc.atsScore ?? 75}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right actions */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleLoad(doc)}
                                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                  title="Load this resume into the active editor"
                                >
                                  <FolderOpen className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Load</span>
                                </button>

                                <button
                                  onClick={() => handleDuplicate(doc.id)}
                                  disabled={actionInProgress === `dup-${doc.id}`}
                                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Duplicate this resume"
                                >
                                  {actionInProgress === `dup-${doc.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDelete(doc.id, doc.title)}
                                  disabled={actionInProgress === `del-${doc.id}`}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete resume"
                                >
                                  {actionInProgress === `del-${doc.id}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Firestore Security Rules</span>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
