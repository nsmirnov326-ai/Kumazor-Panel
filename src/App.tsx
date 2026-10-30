/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Publication, FilterParams, SentimentType, AppTheme, Workspace, ConnectedTelegramChat } from './types';
import { INITIAL_PUBLICATIONS, INITIAL_WORKSPACES, INITIAL_CONNECTED_CHATS } from './data/seedData';
import { matchesQuery } from './utils/parser';
import { exportToExcel, exportToCsv } from './utils/excel';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { FilterBar } from './components/FilterBar';
import { FeedView } from './components/FeedView';
import { TableView } from './components/TableView';
import { PostDrawer } from './components/PostDrawer';
import { ConnectedChatsModal } from './components/ConnectedChatsModal';
import { WorkspaceModal } from './components/WorkspaceModal';
import { SentimentExplainerModal } from './components/SentimentExplainerModal';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_PUBS = 'kumazor_publications_v3';
const STORAGE_KEY_WORKSPACES = 'kumazor_workspaces_v3';
const STORAGE_KEY_CHATS = 'kumazor_chats_v3';
const STORAGE_KEY_THEME = 'kumazor_theme_v3';

export default function App() {
  // Theme state: 'kumazor' (default logo navy + fox orange), 'black', 'light'
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'kumazor' || saved === 'black' || saved === 'light') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'kumazor';
  });

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKSPACES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_WORKSPACES;
  });

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(() => {
    return workspaces[0]?.id || 'ws-default';
  });

  // Connected Telegram Chats state
  const [connectedChats, setConnectedChats] = useState<ConnectedTelegramChat[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_CONNECTED_CHATS;
  });

  // Publications state
  const [publications, setPublications] = useState<Publication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PUBS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PUBLICATIONS;
  });

  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed');
  const [selectedPost, setSelectedPost] = useState<Publication | null>(null);
  const [isChatsModalOpen, setIsChatsModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isSentimentModalOpen, setIsSentimentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterParams>({
    searchQuery: '',
    network: 'all',
    author: '',
    filterName: '',
    minAudience: '',
    maxAudience: '',
    period: 'all',
    sentiment: 'all',
    sortBy: 'date_desc',
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
      localStorage.setItem(STORAGE_KEY_PUBS, JSON.stringify(publications));
      localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(workspaces));
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(connectedChats));
    } catch {
      // ignore
    }
  }, [currentTheme, publications, workspaces, connectedChats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'l' || e.key === 'д') {
        setViewMode('feed');
      } else if (e.key === 't' || e.key === 'е') {
        setViewMode('table');
      } else if (e.key === 'Escape') {
        setSelectedPost(null);
        setIsChatsModalOpen(false);
        setIsWorkspaceModalOpen(false);
        setIsSentimentModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Workspace actions
  const handleCreateWorkspace = (name: string, description: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      description,
      chatIds: [],
      createdAt: new Date().toISOString(),
    };
    setWorkspaces((prev) => [...prev, newWs]);
    setCurrentWorkspaceId(newWs.id);
    showToast(`Создан новый кабинет: "${name}"`);
  };

  const handleDeleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return;
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    if (currentWorkspaceId === id) {
      const remaining = workspaces.filter((w) => w.id !== id);
      setCurrentWorkspaceId(remaining[0]?.id || 'ws-default');
    }
    showToast('Кабинет удален');
  };

  // Chat actions
  const handleAddChat = (chatData: Omit<ConnectedTelegramChat, 'id' | 'addedAt' | 'messageCount'>) => {
    const newChat: ConnectedTelegramChat = {
      ...chatData,
      id: `chat-${Date.now()}`,
      addedAt: new Date().toISOString(),
      messageCount: 0,
    };
    setConnectedChats((prev) => [...prev, newChat]);
    showToast(`Чат "${newChat.title}" успешно привязан к системе!`);
  };

  const handleDeleteChat = (id: string) => {
    setConnectedChats((prev) => prev.filter((c) => c.id !== id));
    showToast('Чат отвязан от мониторинга');
  };

  const handleToggleAutoScrape = (id: string) => {
    setConnectedChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, autoScrape: !c.autoScrape } : c))
    );
  };

  // Extract unique authors & filters
  const availableAuthors = useMemo(() => {
    return Array.from(new Set(publications.map((p) => p.author_name))).sort();
  }, [publications]);

  const availableFilters = useMemo(() => {
    return Array.from(new Set(publications.map((p) => p.filter_name))).sort();
  }, [publications]);

  // Current workspace chat IDs
  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId);

  // Filter & Sort Logic
  const filteredPublications = useMemo(() => {
    const now = Date.now();

    return publications.filter((p) => {
      // Workspace filter: if publication has workspace_id and not default, match it
      if (p.workspace_id && currentWorkspaceId !== 'ws-default' && p.workspace_id !== currentWorkspaceId) {
        return false;
      }

      // Social network filter
      if (filters.network && filters.network !== 'all') {
        const net = (p.network || '').toLowerCase();
        if (filters.network === 'telegram.org' && !net.includes('telegram') && !net.includes('t.me')) return false;
        if (filters.network === 'vk.com' && !net.includes('vk')) return false;
        if (filters.network === 'ok.ru' && !net.includes('ok')) return false;
        if (filters.network === 'dzen.ru' && !net.includes('dzen') && !net.includes('smi')) return false;
      }

      // TGStat Query search
      if (filters.searchQuery) {
        if (!matchesQuery(p.full_text || p.snippet_text, p.author_name, filters.searchQuery)) {
          return false;
        }
      }

      // Author filter
      if (filters.author && p.author_name !== filters.author) {
        return false;
      }

      // BA Filter Name
      if (filters.filterName && p.filter_name !== filters.filterName) {
        return false;
      }

      // Min Audience
      if (filters.minAudience !== '' && p.audience < Number(filters.minAudience)) {
        return false;
      }

      // Sentiment
      if (filters.sentiment !== 'all' && p.sentiment !== filters.sentiment) {
        return false;
      }

      // Period filter
      if (filters.period !== 'all') {
        const pubTime = new Date(p.published_at).getTime();
        const diffMs = now - pubTime;
        if (filters.period === '1h' && diffMs > 60 * 60 * 1000) return false;
        if (filters.period === '24h' && diffMs > 24 * 60 * 60 * 1000) return false;
        if (filters.period === '7d' && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
        if (filters.period === '30d' && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
      if (filters.sortBy === 'date_asc') {
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      }
      if (filters.sortBy === 'audience_desc') {
        return b.audience - a.audience;
      }
      return 0;
    });
  }, [publications, filters, currentWorkspaceId]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.searchQuery ||
      filters.network !== 'all' ||
      filters.author ||
      filters.filterName ||
      filters.minAudience !== '' ||
      filters.period !== 'all' ||
      filters.sentiment !== 'all' ||
      filters.sortBy !== 'date_desc'
    );
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      network: 'all',
      author: '',
      filterName: '',
      minAudience: '',
      maxAudience: '',
      period: 'all',
      sentiment: 'all',
      sortBy: 'date_desc',
    });
  };

  const handleUpdateSentiment = (id: string, sentiment: SentimentType) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, sentiment } : p))
    );
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) => (prev ? { ...prev, sentiment } : null));
    }
  };

  const handleDeletePost = (id: string) => {
    setPublications((prev) => prev.filter((p) => p.id !== id));
    showToast('Публикация удалена из базы мониторинга');
  };

  const themeClass =
    currentTheme === 'black'
      ? 'theme-black'
      : currentTheme === 'light'
      ? 'theme-light'
      : 'theme-kumazor';

  return (
    <div className={`min-h-screen ${themeClass} bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent-orange)] selection:text-white transition-colors duration-200`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
        workspaces={workspaces}
        currentWorkspaceId={currentWorkspaceId}
        onOpenWorkspacesModal={() => setIsWorkspaceModalOpen(true)}
        onOpenConnectedChatsModal={() => setIsChatsModalOpen(true)}
        onOpenSentimentModal={() => setIsSentimentModalOpen(true)}
        onExportExcel={() => exportToExcel(filteredPublications, `kumazor_export_${currentWorkspace?.name || 'monitoring'}.xlsx`)}
        onExportCsv={() => exportToCsv(filteredPublications, `kumazor_export_${currentWorkspace?.name || 'monitoring'}.csv`)}
        totalFiltered={filteredPublications.length}
      />

      {/* Metrics Bar */}
      <MetricsBar
        publications={filteredPublications}
        totalAll={publications.length}
      />

      {/* Filter Bar with Network selector */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        availableAuthors={availableAuthors}
        availableFilters={availableFilters}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
        {viewMode === 'feed' ? (
          <FeedView
            publications={filteredPublications}
            searchQuery={filters.searchQuery}
            onSelectPost={(post) => setSelectedPost(post)}
            onUpdateSentiment={handleUpdateSentiment}
            onDeletePost={handleDeletePost}
          />
        ) : (
          <TableView
            publications={filteredPublications}
            searchQuery={filters.searchQuery}
            onSelectPost={(post) => setSelectedPost(post)}
            onDeletePost={handleDeletePost}
          />
        )}
      </main>

      {/* Detail Slide-out Drawer */}
      <PostDrawer
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onUpdateSentiment={handleUpdateSentiment}
        onDeletePost={handleDeletePost}
      />

      {/* Connected Telegram Chats Modal */}
      <ConnectedChatsModal
        isOpen={isChatsModalOpen}
        onClose={() => setIsChatsModalOpen(false)}
        chats={connectedChats}
        workspaces={workspaces}
        currentWorkspaceId={currentWorkspaceId}
        onAddChat={handleAddChat}
        onDeleteChat={handleDeleteChat}
        onToggleAutoScrape={handleToggleAutoScrape}
      />

      {/* Workspaces / Cabinets Modal */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        workspaces={workspaces}
        currentWorkspaceId={currentWorkspaceId}
        onSelectWorkspace={setCurrentWorkspaceId}
        onCreateWorkspace={handleCreateWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
      />

      {/* Sentiment Explainer Modal */}
      <SentimentExplainerModal
        isOpen={isSentimentModalOpen}
        onClose={() => setIsSentimentModalOpen(false)}
      />
    </div>
  );
}
