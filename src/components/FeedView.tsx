import React, { useState } from 'react';
import { Publication, SentimentType } from '../types';
import { HighlightedText } from '../utils/highlighter';
import { NetworkBadge } from './NetworkBadge';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  Smile, 
  Meh, 
  Frown, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Inbox
} from 'lucide-react';

interface FeedViewProps {
  publications: Publication[];
  searchQuery: string;
  onSelectPost: (post: Publication) => void;
  onUpdateSentiment?: (id: string, sentiment: SentimentType) => void;
  onDeletePost?: (id: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  publications,
  searchQuery,
  onSelectPost,
  onUpdateSentiment,
  onDeletePost,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const handleCopy = (p: Publication, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.full_text || p.snippet_text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatRelativeTime = (dateStr: string): string => {
    try {
      const now = Date.now();
      const time = new Date(dateStr).getTime();
      const diffMs = now - time;
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 1) return 'только что';
      if (diffMins < 60) return `${diffMins} мин назад`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} ч назад`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} дн назад`;
    } catch {
      return dateStr;
    }
  };

  const formatAbsoluteDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (publications.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 max-w-xl mx-auto my-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-secondary)]">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Публикаций не найдено</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          По текущим фильтрам и поисковому запросу ничего не найдено.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 max-w-4xl mx-auto py-2">
      {publications.map((post) => {
        const isExpanded = !!expandedIds[post.id];
        const textContent = post.full_text || post.snippet_text;
        const isLongText = textContent.length > 420;
        const displayText = isExpanded || !isLongText 
          ? textContent 
          : textContent.slice(0, 400) + '...';

        return (
          <article
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent-orange)]/50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer space-y-3 relative"
          >
            {/* Top row */}
            <div className="flex items-start justify-between flex-wrap gap-2 text-xs border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-3">
                {/* Author Avatar with calm colors */}
                <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--accent-orange)] font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={post.author_url || post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-orange)] text-sm transition"
                    >
                      {post.author_name}
                    </a>
                    <NetworkBadge network={post.network} />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] mt-0.5">
                    <span className="font-semibold text-[var(--text-primary)] font-mono">
                      👥 {post.audience.toLocaleString('ru-RU')}
                    </span>
                    <span>•</span>
                    <span>{formatRelativeTime(post.published_at)}</span>
                  </div>
                </div>
              </div>

              {/* Right: BA Filter & Full Timestamp */}
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-800/40 font-medium">
                  Фильтр: <b>{post.filter_name}</b>
                </span>
                <span className="text-[var(--text-secondary)] font-mono hidden sm:inline">
                  {formatAbsoluteDate(post.published_at)}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-[var(--text-primary)] text-xs sm:text-sm leading-relaxed">
              <HighlightedText text={displayText} query={searchQuery} />

              {isLongText && (
                <button
                  onClick={(e) => toggleExpand(post.id, e)}
                  className="mt-2 text-xs font-semibold text-[var(--accent-orange)] hover:underline flex items-center gap-1 transition cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <span>Свернуть</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Читать полностью ({post.full_text.length} знаков)</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] px-2 py-0.5 rounded-md border border-[var(--border-color)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-2.5 border-t border-[var(--border-color)] text-xs">
              {/* Left: Sentiment */}
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-secondary)] text-[11px]">Тональность:</span>
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onUpdateSentiment && onUpdateSentiment(post.id, 'positive')}
                    className={`p-1 rounded-md transition cursor-pointer ${
                      post.sentiment === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                        : 'text-[var(--text-secondary)] hover:text-emerald-400'
                    }`}
                    title="Позитивная"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateSentiment && onUpdateSentiment(post.id, 'neutral')}
                    className={`p-1 rounded-md transition cursor-pointer ${
                      post.sentiment === 'neutral'
                        ? 'bg-slate-500/20 text-[var(--text-primary)] ring-1 ring-slate-500/40'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Нейтральная"
                  >
                    <Meh className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateSentiment && onUpdateSentiment(post.id, 'negative')}
                    className={`p-1 rounded-md transition cursor-pointer ${
                      post.sentiment === 'negative'
                        ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
                        : 'text-[var(--text-secondary)] hover:text-rose-400'
                    }`}
                    title="Негативная"
                  >
                    <Frown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {post.is_scraped && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 100% текст
                  </span>
                )}
              </div>

              {/* Right: Actions */}
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => handleCopy(post, e)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition text-xs cursor-pointer"
                  title="Скопировать текст"
                >
                  {copiedId === post.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectPost(post)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-primary)] transition text-xs cursor-pointer"
                  title="Открыть шторку"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                  <span>Детали</span>
                </button>

                <a
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white font-medium transition text-xs shadow-sm cursor-pointer"
                  title="Перейти к публикации"
                >
                  <span>Оригинал</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
