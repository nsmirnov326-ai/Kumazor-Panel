export type SentimentType = 'positive' | 'neutral' | 'negative';

export type AppTheme = 'kumazor' | 'black' | 'light';

export type NetworkType = 'telegram.org' | 'vk.com' | 'ok.ru' | 'dzen.ru' | 'smi' | string;

export interface Publication {
  id: string;
  filter_name: string;
  network: NetworkType;
  author_name: string;
  author_url: string;
  post_url: string;
  audience: number;
  published_at: string; // ISO 8601 string
  snippet_text: string;
  full_text: string;
  sentiment?: SentimentType;
  tags?: string[];
  created_at: string;
  is_scraped?: boolean;
  workspace_id?: string;
  chat_id?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  chatIds: string[];
  createdAt: string;
}

export interface ConnectedTelegramChat {
  id: string;
  title: string;
  chatId: string; // e.g. -1002491823123 or @brand_alerts
  type: 'supergroup' | 'channel' | 'group' | 'private';
  workspaceId: string;
  status: 'connected' | 'listening' | 'warning';
  addedAt: string;
  lastMessageAt?: string;
  messageCount: number;
  autoScrape: boolean;
}

export interface FilterParams {
  searchQuery: string;
  network: string; // 'all' or specific network
  author: string;
  filterName: string;
  minAudience: number | '';
  maxAudience: number | '';
  period: 'all' | '1h' | '24h' | '7d' | '30d';
  sentiment: 'all' | SentimentType;
  sortBy: 'date_desc' | 'date_asc' | 'audience_desc';
}

export interface ParsedBaAlert {
  filter_name: string;
  audience: number;
  network: NetworkType;
  post_url: string;
  published_at: string;
  author_name: string;
  author_url: string;
  snippet_text: string;
  full_text?: string;
  raw_message: string;
}
