// One shared palette keeps every hand-coded sprite in the same visual family.
export const INK = '#15172b';
export const HULL = ['#f2f4ff', '#d3d8f4', '#aab1da', '#8088b8', '#5b6192', '#3f436b'];
export const REGOLITH = ['#646b93', '#565c85', '#494f77', '#3e4369', '#33375a', '#292c4b'];
export const SPACE = '#070816';
export const STAR_COLORS = ['#ffffff', '#cfe3ff', '#ffe9c4', '#b9c4ff', '#ffd3ec'];
export const SHARD_COLORS = ['#fff7c2', '#ffe27a', '#ffffff', '#9be7ff'];

export const ACCENT = {
  welcome: '#4fd1c5',
  privacy: '#a78bfa',
  reactor: '#fb923c',
  ring: '#facc15',
  harbor: '#60a5fa',
  arcade: '#f472b6',
  archive: '#86efac',
  library: '#fde68a',
} as const;
export type StationId = keyof typeof ACCENT;
