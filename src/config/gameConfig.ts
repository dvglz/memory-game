export const GAME_CONFIG = {
  main: { pairs: 12, columns: 6 },
  tiebreaker: { pairs: 6, columns: 3 },
  timer: 15, // seconds
  flipDelay: 1000, // ms
  victoryDelay: 2000, // ms
  assets: {
    back: '/assets/branding/clutch_minified.svg',
    path: '/assets/teams_nba/'
  }
};

export const NBA_TEAMS = [
  'NBA_ATL', 'NBA_BKN', 'NBA_BOS', 'NBA_CHA', 'NBA_CHI', 'NBA_CLE', 'NBA_DAL', 'NBA_DEN',
  'NBA_DET', 'NBA_GSW', 'NBA_HOU', 'NBA_IND', 'NBA_LAC', 'NBA_LAL', 'NBA_MEM', 'NBA_MIA',
  'NBA_MIL', 'NBA_MIN', 'NBA_NOP', 'NBA_NYK', 'NBA_OKC', 'NBA_ORL', 'NBA_PHI', 'NBA_PHX',
  'NBA_POR', 'NBA_SAC', 'NBA_SAS', 'NBA_TOR', 'NBA_UTA', 'NBA_WAS'
];

