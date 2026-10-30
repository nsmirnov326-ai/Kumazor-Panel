import React from 'react';
import { 
  LayoutList, 
  Table2, 
  FileSpreadsheet, 
  Send, 
  FolderKanban, 
  HelpCircle,
  Sun,
  Moon,
  Palette,
  ChevronDown
} from 'lucide-react';
import { AppTheme, Workspace } from '../types';

interface HeaderProps {
  viewMode: 'feed' | 'table';
  setViewMode: (mode: 'feed' | 'table') => void;
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  workspaces: Workspace[];
  currentWorkspaceId: string;
  onOpenWorkspacesModal: () => void;
  onOpenConnectedChatsModal: () => void;
  onOpenSentimentModal: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  totalFiltered: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  currentTheme,
  setTheme,
  workspaces,
  currentWorkspaceId,
  onOpenWorkspacesModal,
  onOpenConnectedChatsModal,
  onOpenSentimentModal,
  onExportExcel,
  onExportCsv,
  totalFiltered,
}) => {
  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0];

  return (
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Brand and Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[var(--accent-orange)] shadow-md flex-shrink-0 bg-[#0B182F]">
            <img
              src="/assets/aistudio/HCMSR_6d8d57de.jpg"
              alt="KUMAZOR Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider text-[var(--text-primary)] font-mono">
                KUMAZOR
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                Мониторинг
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] hidden sm:block">
              Система анализа медиаполя Telegram, VK, OK и алертов Brand Analytics
            </p>
          </div>
        </div>

        {/* Center: Workspace Selector & Mode Switcher */}
        <div className="flex items-center justify-center flex-wrap gap-2 self-center">
          {/* Workspace / Cabinet button */}
          <button
            onClick={onOpenWorkspacesModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-medium transition cursor-pointer"
            title="Переключить рабочий кабинет"
          >
            <FolderKanban className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
            <span className="font-semibold">{currentWorkspace?.name || 'Кабинет'}</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[var(--bg-page)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-[var(--accent-orange)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Режим Ленты (Горячая клавиша: L)"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Лента</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[var(--accent-orange)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Режим Таблицы (Горячая клавиша: T)"
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Таблица</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Connected TG Chats, Sentiment Explainer, Export & Themes */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          {/* Connected Telegram Chats */}
          <button
            onClick={onOpenConnectedChatsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-medium transition cursor-pointer"
            title="Управление подключенными чатами и ботом Telegram"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>TG-чаты</span>
          </button>

          {/* Sentiment Info Button */}
          <button
            onClick={onOpenSentimentModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] text-xs transition cursor-pointer"
            title="Как устроено определение тональности"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Тональность</span>
          </button>

          {/* Export to Excel / CSV */}
          <div className="flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-500 transition shadow-sm">
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium cursor-pointer"
              title={`Экспортировать ${totalFiltered} публикаций в Excel (.xlsx)`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel ({totalFiltered})</span>
            </button>
            <button
              onClick={onExportCsv}
              className="px-2 py-1.5 text-emerald-100 hover:text-white border-l border-emerald-500/50 text-[11px] cursor-pointer"
              title="Экспорт в CSV с кодировкой UTF-8 BOM"
            >
              CSV
            </button>
          </div>

          {/* 3-State Theme Switcher */}
          <div className="flex items-center bg-[var(--bg-page)] p-0.5 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setTheme('kumazor')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentTheme === 'kumazor'
                  ? 'bg-[var(--accent-orange)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Фирменная спокойная тема KUMAZOR (ночное небо + лисий оранжевый)"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('black')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentTheme === 'black'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Черная тема (Графит / OLED)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentTheme === 'light'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Светлая тема (чистый белый фон для работы днем)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
