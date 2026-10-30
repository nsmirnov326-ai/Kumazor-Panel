import React, { useState } from 'react';
import { FilterParams } from '../types';
import { 
  Search, 
  HelpCircle, 
  X, 
  Users, 
  Clock, 
  ArrowUpDown, 
  Smile, 
  Meh, 
  Frown,
  SlidersHorizontal,
  Share2
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterParams;
  setFilters: React.Dispatch<React.SetStateAction<FilterParams>>;
  availableAuthors: string[];
  availableFilters: string[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  availableAuthors,
  availableFilters,
  onReset,
  hasActiveFilters,
}) => {
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyExampleQuery = (q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
    setShowSyntaxHelp(false);
  };

  return (
    <div className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 lg:px-8 py-3 space-y-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main row: Search + Social Network + Channel + BA Filter */}
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center">
          {/* TGStat Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
              <Search className="w-4 h-4 text-[var(--accent-orange)]" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder='Поиск TGStat: Смирнов "Северный путь", слово1 | слово2, -минус...'
              className="w-full pl-9 pr-16 py-2 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-orange)] transition"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute inset-y-0 right-8 flex items-center pr-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Очистить поиск"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition cursor-pointer"
              title="Справка по операторам поиска"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Syntax popover */}
            {showSyntaxHelp && (
              <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl p-3.5 shadow-2xl z-50 text-xs text-[var(--text-primary)] space-y-2">
                <div className="flex items-center justify-between font-semibold border-b border-[var(--border-color)] pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                    Операторы поиска (как в TGStat):
                  </span>
                  <button onClick={() => setShowSyntaxHelp(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div
                    onClick={() => applyExampleQuery('Смирнов логистика')}
                    className="p-1.5 rounded-lg bg-[var(--bg-page)] hover:bg-[var(--border-color)] cursor-pointer transition flex justify-between"
                  >
                    <span><code>слово1 слово2</code> — логическое «И»</span>
                    <span className="text-[var(--accent-orange)] font-mono">Пример</span>
                  </div>
                  <div
                    onClick={() => applyExampleQuery('"Северный морской путь"')}
                    className="p-1.5 rounded-lg bg-[var(--bg-page)] hover:bg-[var(--border-color)] cursor-pointer transition flex justify-between"
                  >
                    <span><code>"точная фраза"</code> — строгий поиск</span>
                    <span className="text-[var(--accent-orange)] font-mono">Пример</span>
                  </div>
                  <div
                    onClick={() => applyExampleQuery('Смирнов | Давыдов')}
                    className="p-1.5 rounded-lg bg-[var(--bg-page)] hover:bg-[var(--border-color)] cursor-pointer transition flex justify-between"
                  >
                    <span><code>слово1 | слово2</code> — логическое «ИЛИ»</span>
                    <span className="text-[var(--accent-orange)] font-mono">Пример</span>
                  </div>
                  <div
                    onClick={() => applyExampleQuery('Смирнов -ЖКХ')}
                    className="p-1.5 rounded-lg bg-[var(--bg-page)] hover:bg-[var(--border-color)] cursor-pointer transition flex justify-between"
                  >
                    <span><code>-минус</code> — исключение слова</span>
                    <span className="text-[var(--accent-orange)] font-mono">Пример</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Network filter */}
          <div className="w-full md:w-44">
            <select
              value={filters.network}
              onChange={(e) => setFilters((prev) => ({ ...prev, network: e.target.value }))}
              className="w-full py-2 px-3 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition"
            >
              <option value="all">Все соцсети</option>
              <option value="telegram.org">Telegram</option>
              <option value="vk.com">ВКонтакте (VK)</option>
              <option value="ok.ru">Одноклассники (OK)</option>
              <option value="dzen.ru">Дзен / СМИ</option>
            </select>
          </div>

          {/* Author/Channel dropdown */}
          <div className="w-full md:w-48">
            <select
              value={filters.author}
              onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
              className="w-full py-2 px-3 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition"
            >
              <option value="">Все каналы / паблики ({availableAuthors.length})</option>
              {availableAuthors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* BA Filter Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={filters.filterName}
              onChange={(e) => setFilters((prev) => ({ ...prev, filterName: e.target.value }))}
              className="w-full py-2 px-3 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition"
            >
              <option value="">Все фильтры BA ({availableFilters.length})</option>
              {availableFilters.map((f) => (
                <option key={f} value={f}>
                  Фильтр: {f}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm transition cursor-pointer ${
              showAdvanced || hasActiveFilters
                ? 'bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] border-[var(--accent-orange)]/50'
                : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
            }`}
            title="Дополнительные фильтры"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Параметры</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs transition cursor-pointer"
              title="Сбросить все фильтры"
            >
              <X className="w-3.5 h-3.5" />
              <span>Сброс</span>
            </button>
          )}
        </div>

        {/* Secondary row: Quick presets and advanced controls */}
        {(showAdvanced || hasActiveFilters) && (
          <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 items-center justify-between text-xs">
            {/* Period presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-secondary)] flex items-center gap-1 mr-1">
                <Clock className="w-3.5 h-3.5" /> Период:
              </span>
              {(['all', '1h', '24h', '7d', '30d'] as const).map((p) => {
                const labels: Record<string, string> = {
                  all: 'Все',
                  '1h': '1ч',
                  '24h': '24ч',
                  '7d': '7 дн',
                  '30d': '30 дн',
                };
                return (
                  <button
                    key={p}
                    onClick={() => setFilters((prev) => ({ ...prev, period: p }))}
                    className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      filters.period === p
                        ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] font-semibold'
                        : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>

            {/* Audience presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Охват:
              </span>
              <div className="flex items-center gap-1">
                {[
                  { label: 'Любой', val: '' },
                  { label: '>10k', val: 10000 },
                  { label: '>50k', val: 50000 },
                  { label: '>100k', val: 100000 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setFilters((prev) => ({ ...prev, minAudience: item.val as number | '' }))}
                    className={`px-2 py-1 rounded-lg border transition cursor-pointer ${
                      filters.minAudience === item.val
                        ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] font-semibold'
                        : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentiment Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-secondary)]">Тональность:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, sentiment: 'all' }))}
                  className={`px-2 py-1 rounded-lg border cursor-pointer ${
                    filters.sentiment === 'all'
                      ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] font-semibold'
                      : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)]'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, sentiment: 'positive' }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer ${
                    filters.sentiment === 'positive'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                      : 'bg-[var(--bg-page)] text-emerald-400 border-[var(--border-color)]'
                  }`}
                >
                  <Smile className="w-3 h-3" /> Позитив
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, sentiment: 'neutral' }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer ${
                    filters.sentiment === 'neutral'
                      ? 'bg-slate-600 text-white border-slate-500 font-semibold'
                      : 'bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-color)]'
                  }`}
                >
                  <Meh className="w-3 h-3" /> Нейтрал
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, sentiment: 'negative' }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer ${
                    filters.sentiment === 'negative'
                      ? 'bg-rose-600 text-white border-rose-500 font-semibold'
                      : 'bg-[var(--bg-page)] text-rose-400 border-[var(--border-color)]'
                  }`}
                >
                  <Frown className="w-3 h-3" /> Негатив
                </button>
              </div>
            </div>

            {/* Sort order */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="py-1 px-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
              >
                <option value="date_desc">Свежие сначала</option>
                <option value="date_asc">Старые сначала</option>
                <option value="audience_desc">По охвату (макс.)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
