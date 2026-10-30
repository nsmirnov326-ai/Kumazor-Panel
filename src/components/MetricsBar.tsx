import React from 'react';
import { Publication } from '../types';
import { Users, FileText, Radio, Layers, PieChart } from 'lucide-react';

interface MetricsBarProps {
  publications: Publication[];
  totalAll: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ publications, totalAll }) => {
  const totalAudience = publications.reduce((acc, p) => acc + (p.audience || 0), 0);
  const uniqueAuthors = new Set(publications.map((p) => p.author_name)).size;

  // Sentiment counts
  const positiveCount = publications.filter((p) => p.sentiment === 'positive').length;
  const negativeCount = publications.filter((p) => p.sentiment === 'negative').length;
  const neutralCount = publications.filter((p) => p.sentiment === 'neutral' || !p.sentiment).length;

  const total = publications.length || 1;
  const posPct = Math.round((positiveCount / total) * 100);
  const negPct = Math.round((negativeCount / total) * 100);
  const neuPct = 100 - posPct - negPct;

  const formatAudience = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toLocaleString('ru-RU');
  };

  // Top filter
  const filterCounts: Record<string, number> = {};
  publications.forEach((p) => {
    filterCounts[p.filter_name] = (filterCounts[p.filter_name] || 0) + 1;
  });
  const topFilter = Object.entries(filterCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="bg-[var(--bg-surface)]/80 border-b border-[var(--border-color)] px-4 lg:px-8 py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* KPI 1: Publications count */}
        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-[var(--text-secondary)] truncate">Публикаций</div>
            <div className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{publications.length}</span>
              {publications.length !== totalAll && (
                <span className="text-xs text-[var(--text-secondary)] font-normal">из {totalAll}</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 2: Reach */}
        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-[var(--text-secondary)] truncate">Охват аудитории</div>
            <div className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-mono">
              👥 {formatAudience(totalAudience)}
            </div>
          </div>
        </div>

        {/* KPI 3: Unique Sources */}
        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-[var(--text-secondary)] truncate">Источников медиа</div>
            <div className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {uniqueAuthors}
            </div>
          </div>
        </div>

        {/* KPI 4: Sentiment distribution balance */}
        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center flex-shrink-0">
            <PieChart className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-[var(--text-secondary)] truncate">Баланс тональности</div>
            <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold">
              <span className="text-emerald-400" title={`Позитив: ${positiveCount}`}>+{posPct}%</span>
              <span className="text-[var(--text-secondary)]" title={`Нейтрал: ${neutralCount}`}>{neuPct}%</span>
              <span className="text-rose-400" title={`Негатив: ${negativeCount}`}>-{negPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
