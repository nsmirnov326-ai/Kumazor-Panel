import * as XLSX from 'xlsx';
import { Publication } from '../types';

/**
 * Generates and triggers instant download of an Excel (.xlsx) file
 * with clean headers and readable columns.
 */
export function exportToExcel(publications: Publication[], filename = 'monitoring_export.xlsx'): void {
  const rows = publications.map((p) => {
    const pubDate = new Date(p.published_at);
    const dateFormatted = !isNaN(pubDate.getTime())
      ? pubDate.toLocaleString('ru-RU')
      : p.published_at;

    return {
      'ID': p.id,
      'Дата / Время': dateFormatted,
      'Соцсеть': p.network,
      'Канал / Автор': p.author_name,
      'Охват (Аудитория)': p.audience,
      'Фильтр Brand Analytics': p.filter_name,
      'Тональность': p.sentiment === 'positive' ? 'Позитив' : p.sentiment === 'negative' ? 'Негатив' : 'Нейтрально',
      'Ссылка на публикацию': p.post_url,
      'Ссылка на автора': p.author_url,
      'Полный текст': p.full_text,
      'Сниппет BA': p.snippet_text,
      'Теги': p.tags ? p.tags.join(', ') : '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set nice column widths
  worksheet['!cols'] = [
    { wch: 10 }, // ID
    { wch: 18 }, // Дата
    { wch: 14 }, // Соцсеть
    { wch: 22 }, // Автор
    { wch: 18 }, // Охват
    { wch: 22 }, // Фильтр
    { wch: 14 }, // Тональность
    { wch: 38 }, // Ссылка пост
    { wch: 34 }, // Ссылка автор
    { wch: 80 }, // Полный текст
    { wch: 40 }, // Сниппет
    { wch: 25 }, // Теги
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Мониторинг BA');

  XLSX.writeFile(workbook, filename);
}

/**
 * Fallback / alternative: Export to clean CSV with UTF-8 BOM
 */
export function exportToCsv(publications: Publication[], filename = 'monitoring_export.csv'): void {
  const headers = ['Дата', 'Сеть', 'Автор', 'Аудитория', 'Фильтр', 'Тональность', 'Ссылка', 'Полный текст'];
  const csvLines = [headers.join(';')];

  for (const p of publications) {
    const row = [
      new Date(p.published_at).toLocaleString('ru-RU'),
      `"${p.network}"`,
      `"${p.author_name.replace(/"/g, '""')}"`,
      p.audience,
      `"${p.filter_name.replace(/"/g, '""')}"`,
      `"${p.sentiment || 'neutral'}"`,
      `"${p.post_url}"`,
      `"${p.full_text.replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`,
    ];
    csvLines.push(row.join(';'));
  }

  const csvContent = '\uFEFF' + csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
