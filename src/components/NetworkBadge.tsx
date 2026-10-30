import React from 'react';
import { Send, Globe, MessageSquare, Share2 } from 'lucide-react';

interface NetworkBadgeProps {
  network: string;
  size?: 'sm' | 'md';
}

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({ network, size = 'md' }) => {
  const net = (network || '').toLowerCase();

  const isTg = net.includes('telegram') || net.includes('t.me');
  const isVk = net.includes('vk.com') || net.includes('вконтакте') || net.includes('vkontakte');
  const isOk = net.includes('ok.ru') || net.includes('одноклассники') || net.includes('odnoklassniki');
  const isDzen = net.includes('dzen') || net.includes('дзен');

  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';

  if (isTg) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-sky-950/70 text-sky-300 border border-sky-800/60 ${padding}`}>
        <Send className="w-2.5 h-2.5" />
        <span>Telegram</span>
      </span>
    );
  }

  if (isVk) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/60 ${padding}`}>
        <span className="font-bold">VK</span>
        <span>ВКонтакте</span>
      </span>
    );
  }

  if (isOk) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-amber-950/70 text-amber-300 border border-amber-800/60 ${padding}`}>
        <span className="font-bold">OK</span>
        <span>Одноклассники</span>
      </span>
    );
  }

  if (isDzen) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-orange-950/70 text-orange-300 border border-orange-800/60 ${padding}`}>
        <span>Дзен</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-slate-800/80 text-[var(--text-secondary)] border border-[var(--border-color)] ${padding}`}>
      <Globe className="w-2.5 h-2.5" />
      <span>{network || 'СМИ'}</span>
    </span>
  );
};
