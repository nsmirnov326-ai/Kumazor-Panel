import { ParsedBaAlert } from '../types';

/**
 * Parses Brand Analytics alert message text into structured publication data.
 * Directly mirrors the regex logic designed for the Telegram Worker and BA integration.
 */
export function parseBaMessage(rawText: string): ParsedBaAlert {
  const text = rawText.trim();
  const now = new Date().toISOString();

  const data: ParsedBaAlert = {
    filter_name: 'Общий',
    audience: 0,
    network: 'telegram.org',
    post_url: '',
    published_at: now,
    author_name: 'Неизвестный автор',
    author_url: '',
    snippet_text: '',
    raw_message: text,
  };

  if (!text) return data;

  // 1. Извлечение названия фильтра
  const filtMatch = text.match(/персонального фильтра\s*["«]([^"»]+)["»]/i) 
    || text.match(/фильтр(?:а)?[:\s]+["«]?([^"»\n]+)["»]?/i);
  if (filtMatch && filtMatch[1]) {
    data.filter_name = filtMatch[1].trim();
  }

  // 2. Извлечение аудитории
  const audMatch = text.match(/(?:аудиторией|👥)\s*([\d\s\u00A0]+)/i);
  if (audMatch && audMatch[1]) {
    const num = audMatch[1].replace(/[\s\u00A0]+/g, '');
    data.audience = parseInt(num, 10) || 0;
  }

  // 3. Сеть, пост URL и дата
  // Пример: Пост в telegram.org (https://telegram.me/UstKutNet/28837) | 27.10.2026  13:24 (UTC+3)
  const postMatch = text.match(/Пост в\s+([^\s\(]+)\s*\((https?:\/\/[^\)]+)\)\s*\|\s*([\d\.\s\:]+)/i);
  if (postMatch) {
    data.network = postMatch[1].trim();
    data.post_url = postMatch[2].trim();
    const rawDt = postMatch[3].replace(/\s+/g, ' ').trim();
    const parsedDate = parseDateTimeString(rawDt);
    if (parsedDate) {
      data.published_at = parsedDate;
    }
  } else {
    // Резервный поиск URL поста в тексте (t.me/... или telegram.me/...)
    const urlMatch = text.match(/https?:\/\/(?:t\.me|telegram\.me)\/[a-zA-Z0-9_+-]+\/\d+/i);
    if (urlMatch) {
      data.post_url = urlMatch[0];
    }
  }

  // 4. Автор и ссылка на канал
  // Пример: Усть-Кут24 (https://telegram.me/UstKutNet) 👥 11 920
  const authMatch = text.match(/\n([^\n\(]+)\s*\((https?:\/\/[^\)]+)\)\s*👥/i)
    || text.match(/([^\n\(]+)\s*\((https?:\/\/(?:t\.me|telegram\.me)\/[^\)]+)\)/i);
  if (authMatch) {
    data.author_name = authMatch[1].replace(/^[•\-\*]\s*/, '').trim();
    data.author_url = authMatch[2].trim();
  } else {
    // Если ссылка на пост есть, попробуем извлечь автора из канала
    if (data.post_url) {
      const channelMatch = data.post_url.match(/(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/i);
      if (channelMatch) {
        data.author_name = channelMatch[1];
        data.author_url = `https://t.me/${channelMatch[1]}`;
      }
    }
  }

  // 5. Текст публикации (все после строки с автором и аудиторией или разделителя)
  const lines = text.split('\n');
  let startBody = false;
  const bodyLines: string[] = [];

  for (const line of lines) {
    if (startBody) {
      bodyLines.push(line);
    } else if (line.includes('👥') || line.includes('👤') || line.includes('Пост в')) {
      startBody = true;
    }
  }

  if (bodyLines.length > 0) {
    data.snippet_text = bodyLines.join('\n').trim();
  } else {
    data.snippet_text = text;
  }

  return data;
}

/**
 * Parses date format "27.10.2026 13:24" into ISO string
 */
function parseDateTimeString(dtStr: string): string | null {
  try {
    const parts = dtStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s*(\d{1,2})?:?(\d{1,2})?/);
    if (parts) {
      const day = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10) - 1;
      const year = parseInt(parts[3], 10);
      const hour = parts[4] ? parseInt(parts[4], 10) : 12;
      const minute = parts[5] ? parseInt(parts[5], 10) : 0;
      const date = new Date(year, month, day, hour, minute);
      return date.toISOString();
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Matches a text against TGStat-style query operators:
 * - word1 word2: AND (all words must be present)
 * - "exact phrase": exact phrase in text
 * - word1 | word2: OR (at least one word present)
 * - -word: exclude word (must NOT be present)
 */
export function matchesQuery(fullText: string, author: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  const target = `${author} ${fullText}`.toLowerCase();
  const q = query.trim();

  // Extract quoted exact phrases
  const exactPhrases: string[] = [];
  const queryWithoutQuotes = q.replace(/"([^"]+)"/g, (_, phrase) => {
    exactPhrases.push(phrase.toLowerCase().trim());
    return '';
  });

  // Check exact phrases first
  for (const phrase of exactPhrases) {
    if (phrase && !target.includes(phrase)) {
      return false;
    }
  }

  // Handle remaining words
  const tokens = queryWithoutQuotes.split(/\s+/).filter(Boolean);
  if (tokens.length === 0 && exactPhrases.length > 0) return true;

  // Check exclusions (-word)
  const negativeWords: string[] = [];
  const positiveTokens: string[] = [];

  for (const token of tokens) {
    if (token.startsWith('-') && token.length > 1) {
      negativeWords.push(token.substring(1).toLowerCase());
    } else {
      positiveTokens.push(token);
    }
  }

  for (const neg of negativeWords) {
    if (target.includes(neg)) {
      return false;
    }
  }

  // Process OR / AND in positiveTokens
  // Check if tokens contain '|'
  const joinedPositive = positiveTokens.join(' ');
  if (joinedPositive.includes('|')) {
    const orBranches = joinedPositive.split('|').map((b) => b.trim().toLowerCase());
    return orBranches.some((branch) => {
      if (!branch) return false;
      const subWords = branch.split(/\s+/).filter(Boolean);
      return subWords.every((sw) => target.includes(sw));
    });
  }

  // Standard AND search
  return positiveTokens.every((token) => target.includes(token.toLowerCase()));
}
