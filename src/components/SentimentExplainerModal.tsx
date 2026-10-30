import React, { useState } from 'react';
import { analyzeSentiment } from '../utils/sentiment';
import { X, Smile, Meh, Frown, HelpCircle, Check, Sparkles, BrainCircuit } from 'lucide-react';

interface SentimentExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SentimentExplainerModal: React.FC<SentimentExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testText, setTestText] = useState(
    'Компания продемонстрировала рекордный рост выручки и перевыполнила план модернизации, несмотря на задержки поставок'
  );

  if (!isOpen) return null;

  const analysis = analyzeSentiment(testText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl max-w-2xl w-full shadow-2xl z-10 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-base">
                Как устроено определение тональности в KUMAZOR
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Морфологический и контекстный анализ упоминаний в медиа
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
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Smile className="w-4 h-4" /> Позитивная
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Фиксирует маркеры успеха, перевыполнения планов, наград, роста показателей, запуска новых объектов и поддержки.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-semibold">
                <Meh className="w-4 h-4" /> Нейтральная
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Фактологические инфоповоды, официальные пресс-релизы, заседания и статистика без явного эмоционального перевеса.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <Frown className="w-4 h-4" /> Негативная
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Кризисные маркеры: срывы сроков, аварии, жалобы жителей, скандалы, проверки надзорных органов и дефицит.
              </p>
            </div>
          </div>

          {/* Principle Explanation */}
          <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] space-y-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
            <div className="font-semibold text-[var(--text-primary)]">
              Принцип работы алгоритма:
            </div>
            <p>
              1. <b>Лексический скоринг:</b> текст сопоставляется со словарями отраслевых тональных маркеров русского языка (более 150 корневых основ).
            </p>
            <p>
              2. <b>Контекстное взвешивание:</b> негативные маркеры имеют повышенный весовой коэффициент (1.2×), так как для PR и мониторинга брендов риски важнее нейтрального шума.
            </p>
            <p>
              3. <b>Ручной оверрайд:</b> аналитик всегда может изменить тональность публикации в один клик прямо в ленте или таблице, если контекст саркастический или узкоспециализированный.
            </p>
          </div>

          {/* Interactive Tester */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-2.5">
            <label className="font-semibold text-[var(--text-primary)] block">
              Проверьте работу алгоритма на любом фрагменте текста:
            </label>
            <textarea
              rows={3}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
            />

            <div className="p-3 rounded-lg bg-[var(--bg-page)] border border-[var(--border-color)] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[var(--text-secondary)]">Результат анализа: </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {analysis.sentiment === 'positive' && 'Позитивная'}
                  {analysis.sentiment === 'neutral' && 'Нейтральная'}
                  {analysis.sentiment === 'negative' && 'Негативная'}
                </span>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {analysis.explanation}
                </div>
              </div>

              <div>
                {analysis.sentiment === 'positive' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <Smile className="w-4 h-4" /> Позитив
                  </span>
                )}
                {analysis.sentiment === 'neutral' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-[var(--text-secondary)] border border-slate-500/40">
                    <Meh className="w-4 h-4" /> Нейтрал
                  </span>
                )}
                {analysis.sentiment === 'negative' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    <Frown className="w-4 h-4" /> Негатив
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white font-medium transition cursor-pointer"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
