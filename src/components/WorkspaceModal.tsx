import React, { useState } from 'react';
import { Workspace } from '../types';
import { X, Layers, Plus, Check, Trash2, FolderKanban } from 'lucide-react';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  currentWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string, description: string) => void;
  onDeleteWorkspace?: (id: string) => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  currentWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateWorkspace(name.trim(), description.trim());
    setName('');
    setDescription('');
    setShowCreate(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl max-w-xl w-full shadow-2xl z-10 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-base">
                Рабочие кабинеты
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Разделяйте мониторинг по аналитикам, проектам или направлениям
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--text-primary)]">
              Доступные кабинеты ({workspaces.length}):
            </span>
            {!showCreate && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white font-medium transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Новый кабинет</span>
              </button>
            )}
          </div>

          {showCreate && (
            <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-3">
              <div className="font-semibold text-[var(--text-primary)]">Создание нового кабинета</div>
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                  Название кабинета:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Аналитик #2 (Кризисный отдел)"
                  className="w-full px-3 py-1.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                  Описание:
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Цели мониторинга и закрепленные каналы"
                  className="w-full px-3 py-1.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white font-medium"
                >
                  Создать
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {workspaces.map((ws) => {
              const isActive = ws.id === currentWorkspaceId;

              return (
                <div
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[var(--accent-orange)]/10 border-[var(--accent-orange)] shadow-sm'
                      : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] hover:border-[var(--accent-orange)]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-primary)] text-sm">{ws.name}</span>
                      {isActive && (
                        <span className="text-[10px] bg-[var(--accent-orange)] text-white px-2 py-0.5 rounded-full font-semibold">
                          Активный
                        </span>
                      )}
                    </div>
                    {ws.description && (
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {ws.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onDeleteWorkspace && workspaces.length > 1 && !isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteWorkspace(ws.id);
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Удалить кабинет"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--border-color)] transition cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
