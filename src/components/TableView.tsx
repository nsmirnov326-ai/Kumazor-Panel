import React, { useState } from 'react';
import { Publication } from '../types';
import { HighlightedText } from '../utils/highlighter';
import { NetworkBadge } from './NetworkBadge';
import { 
  ExternalLink, 
  Eye, 
  ArrowUpDown, 
  Copy, 
  Check, 
  Smile, 
  Meh, 
  Frown,
  Inbox
} from 'lucide-react';

interface TableViewProps {
  publications: Publication[];
  searchQuery: string;
  onSelectPost: (post: Publication) => void;
  onDeletePost?: (id: string) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  publications,
  searchQuery,
  onSelectPost,
  onDeletePost,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'audience' | 'author'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'date' | 'audience' | 'author') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPublications = [...publications].sort((a, b) => {
    if (sortField === 'date') {
      const ta = new Date(a.published_at).getTime();
      const tb = new Date(b.published_at).getTime();
      return sortDirection === 'asc' ? ta - tb : tb - ta;
    }
    if (sortField === 'audience') {
      return sortDirection === 'asc' ? a.audience - b.audience : b.audience - a.audience;
    }
    if (sortField === 'author') {
      return sortDirection === 'asc'
        ? a.author_name.localeCompare(b.author_name)
        : b.author_name.localeCompare(a.author_name);
    }
    return 0;
  });

  const handleCopy = (p: Publication, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.full_text || p.snippet_text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        time: d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: dateStr, time: '' };
    }
  };

  if (publications.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 max-w-xl mx-auto my-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-secondary)]">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Нет публикаций</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          По текущим параметрам фильтрации записей не обнаружено.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden my-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-b border-[var(--border-color)] font-semibold select-none">
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3.5 cursor-pointer hover:text-[var(--text-primary)] transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Дата</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 whitespace-nowrap">Сеть</th>
              <th
                onClick={() => handleSort('author')}
                className="py-3 px-3.5 cursor-pointer hover:text-[var(--text-primary)] transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Источник</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('audience')}
                className="py-3 px-3.5 cursor-pointer hover:text-[var(--text-primary)] transition whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Охват</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 whitespace-nowrap">Фильтр BA</th>
              <th className="py-3 px-3.5 min-w-[280px]">Фрагмент текста</th>
              <th className="py-3 px-3.5 whitespace-nowrap text-center">Тональность</th>
              <th className="py-3 px-3.5 whitespace-nowrap text-right">Действия</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[var(--border-color)]">
            {sortedPublications.map((p) => {
              const dt = formatShortDate(p.published_at);
              const preview = p.full_text || p.snippet_text;

              return (
                <tr
                  key={p.id}
                  onClick={() => onSelectPost(p)}
                  className="hover:bg-[var(--bg-surface-elevated)]/60 transition duration-150 cursor-pointer"
                >
                  {/* Date */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-[var(--text-secondary)] font-mono">
                    <div className="text-[var(--text-primary)] font-medium">{dt.date}</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">{dt.time}</div>
                  </td>

                  {/* Network */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <NetworkBadge network={p.network} size="sm" />
                  </td>

                  {/* Author / Channel */}
                  <td className="py-3 px-3.5 whitespace-nowrap font-medium text-[var(--text-primary)]">
                    <a
                      href={p.author_url || p.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[var(--accent-orange)] hover:underline"
                    >
                      {p.author_name}
                    </a>
                  </td>

                  {/* Audience */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-right font-mono text-[var(--text-primary)] font-medium">
                    👥 {p.audience.toLocaleString('ru-RU')}
                  </td>

                  {/* Filter Name */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[11px] font-medium">
                      {p.filter_name}
                    </span>
                  </td>

                  {/* Text preview */}
                  <td className="py-3 px-3.5 text-[var(--text-primary)] max-w-md">
                    <div className="line-clamp-2 leading-relaxed">
                      <HighlightedText
                        text={preview.slice(0, 160) + (preview.length > 160 ? '...' : '')}
                        query={searchQuery}
                      />
                    </div>
                  </td>

                  {/* Sentiment */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-center">
                    {p.sentiment === 'positive' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <Smile className="w-3 h-3" /> Позитив
                      </span>
                    )}
                    {p.sentiment === 'neutral' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] bg-slate-500/15 border border-slate-500/30 px-2 py-0.5 rounded-full">
                        <Meh className="w-3 h-3" /> Нейтрал
                      </span>
                    )}
                    {p.sentiment === 'negative' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        <Frown className="w-3 h-3" /> Негатив
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleCopy(p, e)}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
                        title="Скопировать текст"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onSelectPost(p)}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--accent-orange)] transition cursor-pointer"
                        title="Развернуть в шторке"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={p.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white transition cursor-pointer"
                        title="Открыть публикацию"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
