export interface TeamColors {
  primary: string;
  secondary: string;
}

export interface Team {
  name: string;
  colors: TeamColors;
}

export type TeamsData = Record<string, Team>;

export const NBA_TEAMS: TeamsData = {
  ATL: { name: "Atlanta Hawks", colors: { primary: "#E03A3E", secondary: "#C1D32F" } },
  BKN: { name: "Brooklyn Nets", colors: { primary: "#000000", secondary: "#FFFFFF" } },
  BOS: { name: "Boston Celtics", colors: { primary: "#008348", secondary: "#BA9653" } },
  CHA: { name: "Charlotte Hornets", colors: { primary: "#1D1160", secondary: "#00788C" } },
  CHI: { name: "Chicago Bulls", colors: { primary: "#CE1141", secondary: "#000000" } },
  CLE: { name: "Cleveland Cavaliers", colors: { primary: "#860038", secondary: "#FDBB30" } },
  DAL: { name: "Dallas Mavericks", colors: { primary: "#00538C", secondary: "#B8C4CA" } },
  DEN: { name: "Denver Nuggets", colors: { primary: "#0E2240", secondary: "#FEC524" } },
  DET: { name: "Detroit Pistons", colors: { primary: "#C8102E", secondary: "#006BB6" } },
  GSW: { name: "Golden State Warriors", colors: { primary: "#006BB6", secondary: "#FDB927" } },
  HOU: { name: "Houston Rockets", colors: { primary: "#CE1141", secondary: "#C4CED3" } },
  IND: { name: "Indiana Pacers", colors: { primary: "#002D62", secondary: "#FDBB30" } },
  LAC: { name: "LA Clippers", colors: { primary: "#C8102E", secondary: "#1D428A" } },
  LAL: { name: "Los Angeles Lakers", colors: { primary: "#552583", secondary: "#FDB927" } },
  MEM: { name: "Memphis Grizzlies", colors: { primary: "#5D76A9", secondary: "#12173F" } },
  MIA: { name: "Miami Heat", colors: { primary: "#98002E", secondary: "#F9A01B" } },
  MIL: { name: "Milwaukee Bucks", colors: { primary: "#00471B", secondary: "#EEE1C6" } },
  MIN: { name: "Minnesota Timberwolves", colors: { primary: "#0C2340", secondary: "#78BE20" } },
  NOP: { name: "New Orleans Pelicans", colors: { primary: "#002B5C", secondary: "#B4975A" } },
  NYK: { name: "New York Knicks", colors: { primary: "#006BB6", secondary: "#F58426" } },
  OKC: { name: "Oklahoma City Thunder", colors: { primary: "#007AC1", secondary: "#EF3B24" } },
  ORL: { name: "Orlando Magic", colors: { primary: "#0077C0", secondary: "#C4CED3" } },
  PHI: { name: "Philadelphia 76ers", colors: { primary: "#006BB6", secondary: "#ED174C" } },
  PHX: { name: "Phoenix Suns", colors: { primary: "#1D1160", secondary: "#E56020" } },
  POR: { name: "Portland Trail Blazers", colors: { primary: "#E03A3E", secondary: "#000000" } },
  SAC: { name: "Sacramento Kings", colors: { primary: "#5A2D81", secondary: "#63727A" } },
  SAS: { name: "San Antonio Spurs", colors: { primary: "#C4CED3", secondary: "#000000" } },
  TOR: { name: "Toronto Raptors", colors: { primary: "#CE1141", secondary: "#A1A1A4" } },
  UTA: { name: "Utah Jazz", colors: { primary: "#002B5C", secondary: "#F9A01B" } },
  WAS: { name: "Washington Wizards", colors: { primary: "#002B5C", secondary: "#E31837" } },
};

export const NFL_TEAMS: TeamsData = {
  ARI: { name: "Arizona Cardinals", colors: { primary: "#97233F", secondary: "#000000" } },
  ATL: { name: "Atlanta Falcons", colors: { primary: "#A71930", secondary: "#000000" } },
  BAL: { name: "Baltimore Ravens", colors: { primary: "#241773", secondary: "#000000" } },
  BUF: { name: "Buffalo Bills", colors: { primary: "#00338D", secondary: "#C60C30" } },
  CAR: { name: "Carolina Panthers", colors: { primary: "#0085CA", secondary: "#101820" } },
  CHI: { name: "Chicago Bears", colors: { primary: "#0B162A", secondary: "#C83803" } },
  CIN: { name: "Cincinnati Bengals", colors: { primary: "#FB4F14", secondary: "#000000" } },
  CLE: { name: "Cleveland Browns", colors: { primary: "#311D00", secondary: "#FF3C00" } },
  DAL: { name: "Dallas Cowboys", colors: { primary: "#003594", secondary: "#869397" } },
  DEN: { name: "Denver Broncos", colors: { primary: "#FB4F14", secondary: "#002244" } },
  DET: { name: "Detroit Lions", colors: { primary: "#0076B6", secondary: "#B0B7BC" } },
  GB: { name: "Green Bay Packers", colors: { primary: "#204E32", secondary: "#FFB612" } },
  HOU: { name: "Houston Texans", colors: { primary: "#03202F", secondary: "#A71930" } },
  IND: { name: "Indianapolis Colts", colors: { primary: "#002C5F", secondary: "#A2AAAD" } },
  JAX: { name: "Jacksonville Jaguars", colors: { primary: "#006778", secondary: "#9F792C" } },
  KC: { name: "Kansas City Chiefs", colors: { primary: "#E31837", secondary: "#FFB612" } },
  LAC: { name: "Los Angeles Chargers", colors: { primary: "#0080C6", secondary: "#FFC20E" } },
  LAR: { name: "Los Angeles Rams", colors: { primary: "#003594", secondary: "#FFA300" } },
  LV: { name: "Las Vegas Raiders", colors: { primary: "#000000", secondary: "#A5ACAF" } },
  MIA: { name: "Miami Dolphins", colors: { primary: "#008E97", secondary: "#FC4C02" } },
  MIN: { name: "Minnesota Vikings", colors: { primary: "#4F2683", secondary: "#FFC62F" } },
  NE: { name: "New England Patriots", colors: { primary: "#002244", secondary: "#C60C30" } },
  NO: { name: "New Orleans Saints", colors: { primary: "#D3BC8D", secondary: "#101820" } },
  NYG: { name: "New York Giants", colors: { primary: "#0B2265", secondary: "#A71930" } },
  NYJ: { name: "New York Jets", colors: { primary: "#125740", secondary: "#000000" } },
  PHI: { name: "Philadelphia Eagles", colors: { primary: "#004C54", secondary: "#A5ACAF" } },
  PIT: { name: "Pittsburgh Steelers", colors: { primary: "#FFB612", secondary: "#101820" } },
  SEA: { name: "Seattle Seahawks", colors: { primary: "#002244", secondary: "#69BE28" } },
  SF: { name: "San Francisco 49ers", colors: { primary: "#AA0000", secondary: "#B3995D" } },
  TB: { name: "Tampa Bay Buccaneers", colors: { primary: "#D50A0A", secondary: "#34302B" } },
  TEN: { name: "Tennessee Titans", colors: { primary: "#0C2340", secondary: "#4B92DB" } },
  WAS: { name: "Washington Commanders", colors: { primary: "#5A1414", secondary: "#FFB612" } },
};

