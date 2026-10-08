export interface ViewportConfig {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

export interface BrowserStatus {
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  viewport: ViewportConfig;
  quality: number;
  clientCount: number;
  uptime: number;
  sslSecure: boolean;
}

export interface ConsoleMessage {
  type: string;
  text: string;
  timestamp: number;
}

export interface FrameMetadata {
  timestamp: number;
  offsetTop?: number;
  pageScaleFactor?: number;
  deviceWidth?: number;
  deviceHeight?: number;
  scrollOffsetX?: number;
  scrollOffsetY?: number;
}

export interface DevicePreset {
  id: string;
  name: string;
  icon: 'desktop' | 'mobile' | 'tablet' | 'laptop';
  width: number;
  height: number;
  isMobile: boolean;
  hasTouch: boolean;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'desktop-standard',
    name: 'PC (標準 1280×800)',
    icon: 'desktop',
    width: 1280,
    height: 800,
    isMobile: false,
    hasTouch: false,
  },
  {
    id: 'desktop-wide',
    name: 'PC ワイド (1440×900)',
    icon: 'desktop',
    width: 1440,
    height: 900,
    isMobile: false,
    hasTouch: false,
  },
  {
    id: 'tablet',
    name: 'タブレット (768×1024)',
    icon: 'tablet',
    width: 768,
    height: 1024,
    isMobile: true,
    hasTouch: true,
  },
  {
    id: 'mobile-iphone',
    name: 'スマホ (390×844)',
    icon: 'mobile',
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  },
];

export interface BookmarkItem {
  title: string;
  url: string;
  category: string;
  iconBg: string;
}

export const POPULAR_BOOKMARKS: BookmarkItem[] = [
  {
    title: 'YouTube',
    url: 'https://m.youtube.com/',
    category: '動画・配信',
    iconBg: 'bg-red-600/20 text-red-400',
  },
  {
    title: 'Wikipedia (日本語)',
    url: 'https://ja.wikipedia.org/',
    category: '知識・百科事典',
    iconBg: 'bg-zinc-800 text-zinc-200',
  },
  {
    title: 'Yahoo! JAPAN',
    url: 'https://m.yahoo.co.jp/',
    category: 'ニュース・ポータル',
    iconBg: 'bg-red-500/20 text-red-300',
  },
  {
    title: 'Google',
    url: 'https://www.google.com/',
    category: '検索エンジン',
    iconBg: 'bg-blue-500/20 text-blue-300',
  },
  {
    title: 'NHK ニュース',
    url: 'https://www3.nhk.or.jp/news/',
    category: '速報・報道',
    iconBg: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    title: 'GitHub Trending',
    url: 'https://github.com/trending',
    category: '開発・技術',
    iconBg: 'bg-purple-500/20 text-purple-300',
  },
  {
    title: 'Qiita',
    url: 'https://qiita.com/',
    category: '技術ブログ',
    iconBg: 'bg-amber-500/20 text-amber-300',
  },
  {
    title: 'Yahoo! 天気・災害',
    url: 'https://weather.yahoo.co.jp/weather/',
    category: '気象・予報',
    iconBg: 'bg-cyan-500/20 text-cyan-300',
  },
  {
    title: 'Example Domain',
    url: 'https://example.com/',
    category: 'テスト・確認用',
    iconBg: 'bg-slate-700 text-slate-300',
  },
];
