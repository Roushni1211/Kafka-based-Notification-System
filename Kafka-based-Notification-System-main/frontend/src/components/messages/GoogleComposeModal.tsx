import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip,
  Send,
  Trash2,
  CheckSquare,
  Square,
  Bold,
  Italic,
  Code,
  FileCode,
  List,
  Quote,
  Eye,
  Edit3,
  Check,
  UploadCloud
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useToast } from '../../context/ToastContext';
import { messageApi } from '../../api/messageApi';
import { useAuth } from '../../context/AuthContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { compressImage } from '../../utils/imageCompressor';
import confetti from 'canvas-confetti';

interface GoogleComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent?: () => void;
  defaultRecipientId?: string;
  defaultSubject?: string;
}

const DRAFT_STORAGE_KEY = 'companyconnect_compose_draft';

export const GoogleComposeModal: React.FC<GoogleComposeModalProps> = ({
  isOpen,
  onClose,
  onMessageSent,
  defaultRecipientId,
  defaultSubject = '',
}) => {
  const { activeCompany, members } = useCompany();
  const { isDemoMode } = useAuth();
  const { showToast } = useToast();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  const [selectedReceivers, setSelectedReceivers] = useState<string[]>(() => {
    return defaultRecipientId ? [defaultRecipientId] : [];
  });
  const [subject, setSubject] = useState<string>(defaultSubject);
  const [content, setContent] = useState<string>('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!isOpen) return;
    if (subject.trim() || content.trim()) {
      const draftData = {
        subject,
        content,
        selectedReceivers,
        companyId: activeCompany?.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setDraftSavedTime(draftData.timestamp);
    }
  }, [subject, content, selectedReceivers, activeCompany?.id, isOpen]);

  // Restore draft when opened (if fields are empty and no default provided)
  useEffect(() => {
    if (isOpen) {
      if (defaultSubject) setSubject(defaultSubject);
      if (defaultRecipientId) setSelectedReceivers([defaultRecipientId]);

      if (!defaultSubject && !defaultRecipientId) {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.subject && !subject) setSubject(parsed.subject);
            if (parsed.content && !content) setContent(parsed.content);
            if (parsed.selectedReceivers?.length && selectedReceivers.length === 0) {
              setSelectedReceivers(parsed.selectedReceivers);
            }
            if (parsed.timestamp) setDraftSavedTime(parsed.timestamp);
          } catch {
            // Ignore invalid JSON
          }
        }
      }
    }
  }, [isOpen, defaultSubject, defaultRecipientId]);

  const resetForm = () => {
    setSelectedReceivers(defaultRecipientId ? [defaultRecipientId] : []);
    setSubject(defaultSubject || '');
    setContent('');
    setAttachment(null);
    setActiveTab('write');
    setDraftSavedTime(null);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleDiscard = () => {
    resetForm();
    showToast('Draft discarded', 'info');
    onClose();
  };

  if (!isOpen) return null;

  const handleToggleSelectAll = () => {
    if (selectedReceivers.length === members.length) {
      setSelectedReceivers([]);
    } else {
      setSelectedReceivers(members.map((m) => m.id));
    }
  };

  const handleToggleMember = (id: string) => {
    setSelectedReceivers((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleFileProcess = async (file: File) => {
    let processedFile = file;
    if (file.type.startsWith('image/')) {
      try {
        processedFile = await compressImage(file, 1200, 1200, 0.85);
      } catch {
        processedFile = file;
      }
      setPreviewUrl(URL.createObjectURL(processedFile));
    } else {
      setPreviewUrl(null);
    }
    setAttachment(processedFile);
    showToast(`Attached file: ${processedFile.name}`, 'info');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Markdown Formatting Toolbar Insertions
  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || placeholder;

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeCompany) {
      showToast('Please select an active Space before sending messages', 'error');
      return;
    }
    if (selectedReceivers.length === 0) {
      showToast('Please select at least one recipient for this message', 'error');
      return;
    }
    if (!subject.trim()) {
      showToast('Please provide a message subject', 'error');
      return;
    }
    if (!content.trim()) {
      showToast('Please enter message content', 'error');
      return;
    }

    setIsSending(true);

    if (isDemoMode) {
      setTimeout(() => {
        setIsSending(false);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        showToast('Message broadcast sent successfully!', 'success');
        resetForm();
        onMessageSent?.();
        onClose();
      }, 500);
      return;
    }

    try {
      await messageApi.sendMessage(
        activeCompany.id,
        {
          receiverIds: selectedReceivers,
          subject,
          content,
        },
        attachment
      );

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      showToast('Message broadcast sent successfully!', 'success');
      resetForm();
      onMessageSent?.();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to send message';
      showToast(typeof msg === 'string' ? msg : 'Error sending message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div
        className={`fixed z-50 animate-compose-in ${
          isExpanded
            ? 'inset-2 sm:inset-6 flex flex-col transition-all duration-200'
            : isMinimized
            ? 'bottom-0 right-4 sm:right-10 w-72 h-12 shadow-google-lg transition-all duration-200'
            : 'bottom-0 sm:bottom-4 right-0 sm:right-10 w-full sm:w-[620px] h-[92vh] sm:h-[640px] shadow-google-lg'
        }`}
      >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white dark:bg-[#1e1f20] border rounded-t-2xl sm:rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl relative ${
          isDraggingOver
            ? 'border-[#1a73e8] dark:border-[#8ab4f8] ring-4 ring-[#1a73e8]/20'
            : 'border-[#dadce0] dark:border-[#3c4043]'
        }`}
      >
        {/* Drag overlay indicator */}
        {isDraggingOver && (
          <div className="absolute inset-0 bg-[#1a73e8]/10 dark:bg-[#1c3a63]/40 backdrop-blur-xs z-50 flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-[#1a73e8] rounded-2xl">
            <UploadCloud className="w-12 h-12 text-[#1a73e8] animate-bounce mb-2" />
            <span className="text-sm font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
              Drop file here to attach to message
            </span>
          </div>
        )}

        {/* Modal Header (Google Gmail Compose Style) */}
        <div className="bg-[#f2f6fc] dark:bg-[#28292a] px-4 py-3 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between select-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-[#202124] dark:text-[#e3e3e3] truncate">
              {subject ? subject : 'New Message'}
            </span>
            <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] truncate">
              ({activeCompany?.name || 'No Space'})
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-[#5f6368] dark:text-[#9aa0a6]">
            <button
              onClick={() => setIsMinimized((p) => !p)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsExpanded((p) => !p);
                setIsMinimized(false);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors hidden sm:block"
              title={isExpanded ? 'Restore' : 'Full screen'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body (Hidden when minimized) */}
        {!isMinimized && (
          <form onSubmit={handleSend} className="flex-1 flex flex-col overflow-hidden">
            {/* Recipient Picker */}
            <div className="border-b border-[#dadce0] dark:border-[#3c4043] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                  Recipients ({selectedReceivers.length}/{members.length})
                </span>
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] hover:underline flex items-center gap-1 font-medium"
                >
                  {selectedReceivers.length === members.length ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Select All Space Members</span>
                    </>
                  )}
                </button>
              </div>

              {/* Members Chips Multiselect */}
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
                {members.map((member) => {
                  const isSelected = selectedReceivers.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleToggleMember(member.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#e8f0fe] dark:bg-[#1c3a63] border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium'
                          : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <span>{member.name}</span>
                      {isSelected && <X className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div className="border-b border-[#dadce0] dark:border-[#3c4043] px-4 py-2">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-transparent border-none outline-none text-sm font-medium text-[#202124] dark:text-[#e3e3e3] placeholder-[#80868b] dark:placeholder-[#9aa0a6]"
              />
            </div>

            {/* Formatting Toolbar & Write/Preview Tabs */}
            <div className="px-3 py-1.5 border-b border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#18191a] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1 text-[#5f6368] dark:text-[#9aa0a6]">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**', 'bold')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Bold (**text**)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*', 'italic')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Italic (*text*)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('`', '`', 'code')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Inline Code (`code`)"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('```\n', '\n```', '// code snippet here')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Code Block (``` ... ```)"
                >
                  <FileCode className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ', '', 'List item')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Bullet List (- item)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ', '', 'Quote text')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Blockquote (> quote)"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Write vs Preview toggle */}
              <div className="flex items-center bg-gray-200/70 dark:bg-gray-700/60 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                    activeTab === 'write'
                      ? 'bg-white dark:bg-[#28292a] text-[#1a73e8] dark:text-[#8ab4f8] font-semibold shadow-2xs'
                      : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124]'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-[#28292a] text-[#1a73e8] dark:text-[#8ab4f8] font-semibold shadow-2xs'
                      : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124]'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Content Area: Write or Markdown Preview */}
            <div className="flex-1 p-4 flex flex-col min-h-0 overflow-hidden">
              {activeTab === 'write' ? (
                <textarea
                  ref={textareaRef}
                  placeholder="Type your message... (Markdown and code blocks supported)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full flex-1 bg-transparent border-none outline-none resize-none text-sm text-[#202124] dark:text-[#e3e3e3] placeholder-[#80868b] dark:placeholder-[#9aa0a6] leading-relaxed overflow-y-auto"
                />
              ) : (
                <div className="w-full flex-1 overflow-y-auto pr-1">
                  {content.trim() ? (
                    <MarkdownRenderer
                      content={content}
                      className="text-sm text-[#202124] dark:text-[#e3e3e3]"
                    />
                  ) : (
                    <div className="text-xs text-gray-400 italic py-4">
                      Nothing to preview yet. Switch to &ldquo;Write&rdquo; and compose your message.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dedicated Attachment Bar */}
            {attachment && (
              <div className="px-4 py-2 border-t border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#18191a] shrink-0 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#28292a] border border-[#e8eaed] dark:border-[#3c4043] shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Attachment preview"
                        className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                        <Paperclip className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#202124] dark:text-[#e3e3e3] truncate">
                        {attachment.name}
                      </p>
                      <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-[#1a73e8] dark:text-[#8ab4f8]">Attached</span>
                        <span>•</span>
                        <span>{(attachment.size / 1024).toFixed(1)} KB</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full transition-colors shrink-0"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <div className="px-4 py-3 border-t border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between bg-white dark:bg-[#1e1f20] shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="google-btn-primary py-2 px-5 text-sm !rounded-full"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending...' : 'Send'}</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-full transition-colors relative ${
                      attachment
                        ? 'bg-blue-100 text-[#1a73e8] dark:bg-blue-900/60 dark:text-[#8ab4f8]'
                        : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#28292a]'
                    }`}
                    title={attachment ? 'Change attachment' : 'Attach file or drag & drop'}
                  >
                    <Paperclip className="w-5 h-5" />
                    {attachment && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1a73e8] dark:bg-[#8ab4f8]" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Draft indicator & Discard action */}
              <div className="flex items-center gap-3">
                {draftSavedTime && (
                  <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-1 hidden sm:inline-flex">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Draft saved ({draftSavedTime})</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleDiscard}
                  className="p-2 text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full transition-colors"
                  title="Discard draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
};
