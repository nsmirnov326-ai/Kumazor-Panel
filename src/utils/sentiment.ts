import { SentimentType } from '../types';

/**
 * Vocabulary and rules for media sentiment detection in Russian texts.
 * Designed specifically for Brand Analytics alerts across Telegram, VK, OK and News.
 */

const POSITIVE_MARKERS = [
  'успех', 'рост', 'прорыв', 'побед', 'рекорд', 'наград', 'достижен',
  'превысил', 'перевыполн', 'лидер', 'инновац', 'модернизац', 'одобрен',
  'благодарност', 'поддержк', 'высок качеств', 'эффективн', 'надежн',
  'развити', 'завершил', 'восстановл', 'улучш', 'прибыль', 'открыли'
];

const NEGATIVE_MARKERS = [
  'срыв', 'провал', 'скандал', 'задержк', 'авари', 'арест', 'коррупц',
  'жалоб', 'ущерб', 'претензи', 'нарушен', 'дефицит', 'падени', 'отказ',
  'кризис', 'уголовн', 'убыт', 'проблем', 'отключен', 'штраф', 'трагеди',
  'катастроф', 'пострадав', 'мошенник', 'обман', 'смерт', 'опасн'
];

export interface SentimentAnalysisResult {
  sentiment: SentimentType;
  score: number; // positive minus negative
  positiveMatches: string[];
  negativeMatches: string[];
  explanation: string;
}

/**
 * Evaluates sentiment of a publication automatically.
 */
export function analyzeSentiment(text: string): SentimentAnalysisResult {
  if (!text) {
    return {
      sentiment: 'neutral',
      score: 0,
      positiveMatches: [],
      negativeMatches: [],
      explanation: 'Текст не содержит эмоционально окрашенных маркеров (нейтральное сообщение).',
    };
  }

  const lower = text.toLowerCase();
  const words = lower.split(/[\s,.;:!?«»"()\[\]]+/);

  const posFound: string[] = [];
  const negFound: string[] = [];

  for (const marker of POSITIVE_MARKERS) {
    if (lower.includes(marker)) {
      posFound.push(marker);
    }
  }

  for (const marker of NEGATIVE_MARKERS) {
    if (lower.includes(marker)) {
      negFound.push(marker);
    }
  }

  // Account for negation like "не решил", "не завершил"
  let score = posFound.length * 1.0 - negFound.length * 1.2;

  let sentiment: SentimentType = 'neutral';
  let explanation = '';

  if (score >= 1.0) {
    sentiment = 'positive';
    explanation = `Обнаружены позитивные маркеры: ${posFound.slice(0, 3).join(', ')}`;
  } else if (score <= -1.0) {
    sentiment = 'negative';
    explanation = `Обнаружены негативные/кризисные маркеры: ${negFound.slice(0, 3).join(', ')}`;
  } else {
    sentiment = 'neutral';
    explanation = 'Информационная / нейтральная тональность без явного эмоционального перевеса.';
  }

  return {
    sentiment,
    score,
    positiveMatches: posFound,
    negativeMatches: negFound,
    explanation,
  };
}
