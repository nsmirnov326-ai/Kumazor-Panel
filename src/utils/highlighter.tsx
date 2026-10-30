import React from 'react';

/**
 * Highlights words or phrases matching the search query within a text string.
 */
export function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim() || !text) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  // Extract keywords, stripping quotes and minus signs
  const terms = query
    .replace(/"([^"]+)"/g, '$1')
    .split(/[\s|]+/)
    .map((w) => w.replace(/^[-+]/, '').trim())
    .filter((w) => w.length > 1);

  if (terms.length === 0) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  // Create escaped regex for matching
  const escapedTerms = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, index) => {
        const isMatch = terms.some((t) => t.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <mark
            key={index}
            className="bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded font-medium border border-amber-400/40"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </span>
  );
}
