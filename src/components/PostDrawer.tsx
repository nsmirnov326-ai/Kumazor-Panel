import React, { useState } from 'react';
import { Publication, SentimentType } from '../types';
import { NetworkBadge } from './NetworkBadge';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown,
  Trash2,
  FileText
} from 'lucide-react';

interface PostDrawerProps {
  post: Publication | null;
  onClose: () => void;
  onUpdateSentiment?: (id: string, sentiment: SentimentType) => void;
  onDeletePost?: (id: string) => void;
}

export const PostDrawer: React.FC<PostDrawerProps> = ({
  post,
  onClose,
  onUpdateSentiment,
  onDeletePost,
}) => {
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  if (!post) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.full_text || post.snippet_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(post.published_at).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface-elevated)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--accent-orange)] font-bold flex items-center justify-center text-base shadow-sm">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[var(--text-primary)] text-base">{post.author_name}</h3>
                <NetworkBadge network={post.network} size="sm" />
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                <a
                  href={post.author_url || post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[var(--accent-orange)]"
                >
                  Перейти к источнику
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg-page)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-xs font-medium transition cursor-pointer"
              title="Скопировать текст"
            >
              {copied ? (
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
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-6 py-3 bg-[var(--bg-surface)] border-b border-[var(--border-color)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-[var(--text-secondary)] text-[11px]">Охват аудитории</div>
            <div className="font-bold text-[var(--text-primary)] text-sm font-mono mt-0.5">
              👥 {post.audience.toLocaleString('ru-RU')}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-[11px]">Фильтр Brand Analytics</div>
            <div className="font-semibold text-purple-300 mt-0.5 truncate" title={post.filter_name}>
              {post.filter_name}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-[11px]">Дата публикации</div>
            <div className="font-medium text-[var(--text-primary)] mt-0.5">
              {formattedDate}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-[11px]">Статус сбора</div>
            <div className="font-medium text-emerald-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Полный текст</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="text-[var(--text-secondary)] font-semibold uppercase tracking-wider text-[11px]">
              {showComparison ? 'Сравнение: Сниппет BA vs Полный текст' : 'Текст публикации'}
            </span>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-[var(--accent-orange)] hover:underline font-medium cursor-pointer"
            >
              {showComparison ? 'Показать только текст' : 'Сравнить со сниппетом'}
            </button>
          </div>

          {showComparison ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl space-y-1.5">
                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>1. Исходный сниппет Brand Analytics:</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed font-mono">
                  {post.snippet_text}
                </p>
              </div>

              <div className="p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl space-y-1.5">
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>2. Дозабранный полный текст публикации:</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {post.full_text}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl shadow-inner">
              <p className="text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed select-text font-sans">
                {post.full_text}
              </p>
            </div>
          )}

          {/* Sentiment Selection */}
          <div className="bg-[var(--bg-surface-elevated)] p-3.5 rounded-xl border border-[var(--border-color)] space-y-2">
            <div className="text-xs text-[var(--text-secondary)] font-medium">Тональность публикации:</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSentiment && onUpdateSentiment(post.id, 'positive')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  post.sentiment === 'positive'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-emerald-400'
                }`}
              >
                <Smile className="w-4 h-4" /> Позитивная
              </button>
              <button
                onClick={() => onUpdateSentiment && onUpdateSentiment(post.id, 'neutral')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  post.sentiment === 'neutral'
                    ? 'bg-slate-600 text-white border-slate-500 shadow-sm'
                    : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Meh className="w-4 h-4" /> Нейтральная
              </button>
              <button
                onClick={() => onUpdateSentiment && onUpdateSentiment(post.id, 'negative')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  post.sentiment === 'negative'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                    : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-rose-400'
                }`}
              >
                <Frown className="w-4 h-4" /> Негативная
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
          {onDeletePost ? (
            <button
              onClick={() => {
                onDeletePost(post.id);
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Удалить</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-medium hover:bg-[var(--border-color)] transition cursor-pointer"
            >
              Закрыть
            </button>
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <span>Открыть оригинал</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
