import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || '9074917955:AAGgq3CVNx-e1V7RobIpn4Own0Z-QnCjOC4';

app.use(express.json({ limit: '10mb' }));

interface ServerPublication {
  id: string;
  filter_name: string;
  network: string;
  author_name: string;
  author_url: string;
  post_url: string;
  audience: number;
  published_at: string;
  snippet_text: string;
  full_text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
  created_at: string;
  is_scraped?: boolean;
  workspace_id?: string;
  chat_id?: string;
}

const publicationsStore: ServerPublication[] = [];

/**
 * Scrapes Telegram embed widget to retrieve the full, uncropped post text.
 */
async function scrapeTelegramEmbed(url: string, fallbackSnippet: string): Promise<string> {
  if (!url || (!url.includes('t.me/') && !url.includes('telegram.me/'))) {
    return fallbackSnippet;
  }

  let embedUrl = url.replace('telegram.me/', 't.me/');
  if (!embedUrl.includes('?embed=1')) {
    embedUrl = embedUrl.split('?')[0] + '?embed=1';
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(embedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<div class="[^"]*tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (match && match[1]) {
        let content = match[1];
        content = content.replace(/<br\s*\/?>/gi, '\n');
        content = content.replace(/<[^>]+>/g, '');
        content = content
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .trim();

        if (content.length > 0) {
          return content;
        }
      }
    }
  } catch (err) {
    console.warn(`[Scraper Warning] Failed to scrape ${url}:`, err);
  }

  return fallbackSnippet;
}

// Scrape API
app.post('/api/scrape', async (req: Request, res: Response) => {
  const { url, fallback_snippet } = req.body;
  const fullText = await scrapeTelegramEmbed(url, fallback_snippet || '');
  res.json({ full_text: fullText, is_scraped: fullText !== fallback_snippet });
});

// Telegram Bot API Integration
app.get('/api/telegram/bot-info', async (_req: Request, res: Response) => {
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const data = await tgRes.json();
    if (data.ok) {
      res.json(data.result);
    } else {
      res.json({
        id: 9074917955,
        is_bot: true,
        first_name: 'Kumazor Monitor Bot',
        username: 'KumazorMonitorBot',
        can_join_groups: true,
        can_read_all_group_messages: true,
        supports_inline_queries: false,
      });
    }
  } catch {
    res.json({
      id: 9074917955,
      is_bot: true,
      first_name: 'Kumazor Monitor Bot',
      username: 'KumazorMonitorBot',
      can_join_groups: true,
      can_read_all_group_messages: true,
    });
  }
});

app.get('/api/telegram/updates', async (_req: Request, res: Response) => {
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=20`);
    const data = await tgRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Publications endpoints
app.get('/api/posts', (_req: Request, res: Response) => {
  res.json(publicationsStore);
});

app.post('/api/posts', (req: Request, res: Response) => {
  const newPost: ServerPublication = {
    ...req.body,
    id: req.body.id || `pub-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  publicationsStore.unshift(newPost);
  res.status(201).json(newPost);
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = publicationsStore.findIndex((p) => p.id === id);
  if (idx !== -1) {
    publicationsStore.splice(idx, 1);
  }
  res.json({ success: true });
});

// Telegram Bot Webhook endpoint
app.post('/api/webhook/telegram', async (req: Request, res: Response) => {
  const message = req.body?.message || req.body?.channel_post;
  if (!message) {
    res.status(200).send('OK');
    return;
  }

  const text = message.text || message.caption || '';
  const chatId = String(message.chat?.id || '');
  console.log(`[Telegram Alert Received] Chat: ${chatId}, Text: ${text.slice(0, 80)}`);

  res.status(200).json({ status: 'ok' });
});

// Mount Vite in dev / serve dist in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KUMAZOR Monitor running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
