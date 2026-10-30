import { Publication, Workspace, ConnectedTelegramChat } from '../types';

export const BOT_CONFIG = {
  token: '9074917955:AAGgq3CVNx-e1V7RobIpn4Own0Z-QnCjOC4',
  name: 'Kumazor Monitor Bot',
  username: '@KumazorMonitorBot',
};

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-default',
    name: 'Основной кабинет',
    description: 'Общий мониторинг алертов Brand Analytics из подключенных чатов',
    chatIds: ['chat-1', 'chat-2', 'chat-3'],
    createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
  },
  {
    id: 'ws-smirnov',
    name: 'Мониторинг Смирнова',
    description: 'Персональный трекинг упоминаний и экспертных комментариев',
    chatIds: ['chat-1'],
    createdAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
  },
  {
    id: 'ws-regions',
    name: 'Региональные медиа',
    description: 'Мониторинг ВК, ОК и региональных Telegram-каналов',
    chatIds: ['chat-2', 'chat-3'],
    createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
  },
];

export const INITIAL_CONNECTED_CHATS: ConnectedTelegramChat[] = [
  {
    id: 'chat-1',
    title: 'Brand Analytics — Алерты "Смирнов"',
    chatId: '-1002491823120',
    type: 'supergroup',
    workspaceId: 'ws-default',
    status: 'connected',
    addedAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    messageCount: 142,
    autoScrape: true,
  },
  {
    id: 'chat-2',
    title: 'Мониторинг VK и Одноклассники (Alerts)',
    chatId: '-1002819401923',
    type: 'channel',
    workspaceId: 'ws-default',
    status: 'connected',
    addedAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    messageCount: 89,
    autoScrape: true,
  },
  {
    id: 'chat-3',
    title: 'Пресс-служба: Оперативные инфоповоды',
    chatId: '-1001948271034',
    type: 'group',
    workspaceId: 'ws-regions',
    status: 'connected',
    addedAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    messageCount: 56,
    autoScrape: true,
  },
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    filter_name: 'Смирнов',
    network: 'telegram.org',
    author_name: 'Ivan Davydov',
    author_url: 'https://telegram.me/ivanfdavydov',
    post_url: 'https://telegram.me/ivanfdavydov/4190',
    audience: 10947,
    published_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    snippet_text: 'Аналитик Смирнов обратил внимание на фундаментальную перестройку логистических маршрутов через Северный морской путь. По его оценкам, рост грузооборота в 2026 году превысит прогнозные показатели Минтранса почти на четверть...',
    full_text: `Аналитик Смирнов обратил внимание на фундаментальную перестройку логистических маршрутов через Северный морской путь. По его оценкам, рост грузооборота в 2026 году превысит прогнозные показатели Минтранса почти на четверть.

«Дело не просто в сезонных колебаниях, а в долгосрочном контрактовании со стороны азиатских партнеров», — подчеркивает эксперт. Если тенденция сохранится, ключевые порты Мурманска и Сабетты выйдут на пиковую мощность к началу зимы.

При этом узким горлышком по-прежнему остается нехватка ледокольного флота повышенного ледового класса и сервисное обслуживание зарубежных силовых установок. Вопрос финансирования модернизации верфей будет вынесен на правительственную комиссию в начале следующего месяца.`,
    sentiment: 'neutral',
    tags: ['Логистика', 'Арктика', 'Экспертиза'],
    created_at: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
    is_scraped: true,
    workspace_id: 'ws-default',
    chat_id: 'chat-1',
  },
  {
    id: 'pub-2',
    filter_name: 'Смирнов',
    network: 'vk.com',
    author_name: 'Подслушано в Иркутске (ВКонтакте)',
    author_url: 'https://vk.com/irkutsk_live',
    post_url: 'https://vk.com/wall-4819283_19284',
    audience: 84500,
    published_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    snippet_text: 'В сообществе обсуждают выступление инженера Сергея Смирнова о ходе модернизации энергосетей в преддверии зимних морозов...',
    full_text: `В сообществе обсуждают выступление инженера Сергея Смирнова о ходе модернизации энергосетей в преддверии зимних морозов.

Смирнов заверил жителей, что ремонтная программа завершена в срок, а резервные трансформаторные подстанции переведены в режим повышенной готовности. На горячую линию поступило более сотни вопросов по графикам подключения частного сектора.`,
    sentiment: 'positive',
    tags: ['ВКонтакте', 'Энергетика', 'Регионы'],
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    is_scraped: true,
    workspace_id: 'ws-default',
    chat_id: 'chat-2',
  },
  {
    id: 'pub-3',
    filter_name: 'Смирнов',
    network: 'telegram.org',
    author_name: 'Усть-Кут24',
    author_url: 'https://telegram.me/UstKutNet',
    post_url: 'https://telegram.me/UstKutNet/28837',
    audience: 11920,
    published_at: new Date(Date.now() - 54 * 60 * 1000).toISOString(),
    snippet_text: 'Глава района Сергей Смирнов провел оперативное совещание по готовности коммунальных служб к отопительному сезону. В ходе выездной проверки выявлены задержки по замене магистрального трубопровода...',
    full_text: `Глава района Сергей Смирнов провел оперативное совещание по готовности коммунальных служб к отопительному сезону. В ходе выездной проверки выявлены задержки по замене магистрального трубопровода в микрорайоне Речники.

Смирнов потребовал от подрядной организации удвоить количество аварийных бригад и завершить гидравлические испытания до конца текущей недели без отключения жилого фонда.

«Никаких оправданий с поставкой труб больше не принимается, все авансы подрядчику перечислены в полном объеме», — заявил глава района. Ситуация взята на персональный контроль районной администрации.`,
    sentiment: 'negative',
    tags: ['ЖКХ', 'Администрация'],
    created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    is_scraped: true,
    workspace_id: 'ws-default',
    chat_id: 'chat-1',
  },
  {
    id: 'pub-4',
    filter_name: 'Регионы',
    network: 'ok.ru',
    author_name: 'Вестник Сибири (Одноклассники)',
    author_url: 'https://ok.ru/group/vestnik_sibiri',
    post_url: 'https://ok.ru/group/5291823/topic/15928371',
    audience: 63200,
    published_at: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    snippet_text: 'В группе Одноклассников обсуждают запуск нового образовательного центра для школьников с участием региональных экспертов...',
    full_text: `В группе Одноклассников обсуждают запуск нового образовательного центра для школьников с участием региональных экспертов.

В центре открыты классы робототехники и цифрового моделирования. По отзывам родителей, запись на первые курсы заполнилась за считанные часы. Проект реализован при поддержке регионального фонда содействия инновациям.`,
    sentiment: 'positive',
    tags: ['Одноклассники', 'Образование'],
    created_at: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    is_scraped: true,
    workspace_id: 'ws-regions',
    chat_id: 'chat-2',
  },
  {
    id: 'pub-5',
    filter_name: 'Смирнов',
    network: 'telegram.org',
    author_name: 'BRIEF',
    author_url: 'https://telegram.me/rusbrief',
    post_url: 'https://telegram.me/rusbrief/109432',
    audience: 524000,
    published_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    snippet_text: 'Экономист Алексей Смирнов в эфире РБК прокомментировал решение Центробанка по ключевой ставке...',
    full_text: `Экономист Алексей Смирнов в эфире РБК прокомментировал решение Центробанка по ключевой ставке:

«Рынок уже заложил текущую траекторию, однако регулятор посылает четкий сигнал о готовности удерживать жесткие монетарные условия до середины следующего года. Снижение инфляционных ожиданий бизнеса происходит медленнее, чем прогнозировалось весной».

По оценкам Смирнова, кредитование крупного корпоративного сектора продолжит охлаждаться, уступая место прямому облигационному финансированию и государственным программам субсидирования.`,
    sentiment: 'neutral',
    tags: ['Экономика', 'ЦБ'],
    created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    is_scraped: true,
    workspace_id: 'ws-default',
    chat_id: 'chat-1',
  },
  {
    id: 'pub-6',
    filter_name: 'Инфоповоды',
    network: 'dzen.ru',
    author_name: 'Деловой Дзен / Медиахолдинг',
    author_url: 'https://dzen.ru/delovoy_media',
    post_url: 'https://dzen.ru/a/Zx98129381',
    audience: 175000,
    published_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    snippet_text: 'Обзор ключевых трендов в российском медиабизнесе: перераспределение рекламных бюджетов между Telegram, ВКонтакте и локальными медиаплатформами...',
    full_text: `Обзор ключевых трендов в российском медиабизнесе: перераспределение рекламных бюджетов между Telegram, ВКонтакте и локальными медиаплатформами.

Аналитики отмечают стабилизацию затрат на инфлюенс-маркетинг при одновременном росте требований к аудиту охватов. Бренды активно внедряют автоматизированный мониторинг упоминаний в социальных сетях.`,
    sentiment: 'neutral',
    tags: ['Дзен', 'Медиа'],
    created_at: new Date(Date.now() - 3.9 * 3600 * 1000).toISOString(),
    is_scraped: true,
    workspace_id: 'ws-default',
    chat_id: 'chat-3',
  },
];
