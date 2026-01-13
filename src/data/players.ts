export interface PlayerData {
  id: number;
  name: string;
  headshot: string;
  team: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface PlayerData {
  id: number;
  name: string;
  headshot: string;
  team: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const NBA_PLAYERS: Record<string, PlayerData> = {
  "191": {
    id: 191,
    name: "Anthony Davis",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/191?t=1768205701",
    team: "DAL",
    colors: { primary: "#00538C", secondary: "#B8C4CA" }
  },
  "10152": {
    id: 10152,
    name: "Anthony Edwards",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10152?t=1768205310",
    team: "MIN",
    colors: { primary: "#0C2340", secondary: "#78BE20" }
  },
  "272": {
    id: 272,
    name: "Bam Adebayo",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/272?t=1768205615",
    team: "MIA",
    colors: { primary: "#98002E", secondary: "#F9A01B" }
  },
  "540": {
    id: 540,
    name: "Bradley Beal",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/540?t=1768205452",
    team: "LAC",
    colors: { primary: "#C8102E", secondary: "#1D428A" }
  },
  "550": {
    id: 550,
    name: "Brandon Ingram",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/550?t=1768205102",
    team: "TOR",
    colors: { primary: "#CE1141", secondary: "#000000" }
  },
  "11077": {
    id: 11077,
    name: "Cade Cunningham",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/11077?t=1768205185",
    team: "DET",
    colors: { primary: "#C8102E", secondary: "#006BB6" }
  },
  "11996": {
    id: 11996,
    name: "Chet Holmgren",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/11996?t=1768205342",
    team: "OKC",
    colors: { primary: "#007AC1", secondary: "#EF3B24" }
  },
  "648": {
    id: 648,
    name: "CJ McCollum",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/648?t=1768205576",
    team: "ATL",
    colors: { primary: "#E03A3E", secondary: "#C1D32F" }
  },
  "975": {
    id: 975,
    name: "Damian Lillard",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/975?t=1768205373",
    team: "POR",
    colors: { primary: "#E03A3E", secondary: "#000000" }
  },
  "4698": {
    id: 4698,
    name: "Darius Garland",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4698?t=1768205160",
    team: "CLE",
    colors: { primary: "#860038", secondary: "#FDBB30" }
  },
  "1124": {
    id: 1124,
    name: "De'Aaron Fox",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1124?t=1768205823",
    team: "SAC",
    colors: { primary: "#5A2D81", secondary: "#63727A" }
  },
  "10155": {
    id: 10155,
    name: "Desmond Bane",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10155?t=1768205646",
    team: "ORL",
    colors: { primary: "#0077C0", secondary: "#C4CED3" }
  },
  "1218": {
    id: 1218,
    name: "Devin Booker",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1218?t=1768205506",
    team: "PHX",
    colors: { primary: "#1D1160", secondary: "#E56020" }
  },
  "1286": {
    id: 1286,
    name: "Domantas Sabonis",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1286?t=1768205551",
    team: "SAC",
    colors: { primary: "#5A2D81", secondary: "#63727A" }
  },
  "1339": {
    id: 1339,
    name: "Donovan Mitchell",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1339?t=1768205169",
    team: "CLE",
    colors: { primary: "#860038", secondary: "#FDBB30" }
  },
  "1624": {
    id: 1624,
    name: "Fred VanVleet",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1624?t=1768205755",
    team: "HOU",
    colors: { primary: "#CE1141", secondary: "#C4CED3" }
  },
  "1766": {
    id: 1766,
    name: "Giannis Antetokounmpo",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1766?t=1768205247",
    team: "MIL",
    colors: { primary: "#00471B", secondary: "#EEE1C6" }
  },
  "10157": {
    id: 10157,
    name: "Immanuel Quickley",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10157?t=1768205117",
    team: "TOR",
    colors: { primary: "#CE1141", secondary: "#A1A1A4" }
  },
  "1986": {
    id: 1986,
    name: "Isaiah Hartenstein",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/1986?t=1768205340",
    team: "OKC",
    colors: { primary: "#007AC1", secondary: "#EF3B24" }
  },
  "2089": {
    id: 2089,
    name: "Jamal Murray",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2089?t=1768205291",
    team: "DEN",
    colors: { primary: "#0E2240", secondary: "#FEC524" }
  },
  "2106": {
    id: 2106,
    name: "James Harden",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2106?t=1768205462",
    team: "LAC",
    colors: { primary: "#C8102E", secondary: "#1D428A" }
  },
  "4708": {
    id: 4708,
    name: "Ja Morant",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4708?t=1768205773",
    team: "MEM",
    colors: { primary: "#5D76A9", secondary: "#12173F" }
  },
  "2187": {
    id: 2187,
    name: "Jaylen Brown",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2187?t=1768204973",
    team: "BOS",
    colors: { primary: "#008348", secondary: "#BA9653" }
  },
  "2189": {
    id: 2189,
    name: "Jayson Tatum",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2189?t=1768204992",
    team: "BOS",
    colors: { primary: "#008348", secondary: "#BA9653" }
  },
  "2355": {
    id: 2355,
    name: "Jimmy Butler III",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2355?t=1768205419",
    team: "GSW",
    colors: { primary: "#1D428A", secondary: "#FFC72C" }
  },
  "2425": {
    id: 2425,
    name: "Joel Embiid",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2425?t=1768205071",
    team: "PHI",
    colors: { primary: "#006BB6", secondary: "#ED174C" }
  },
  "2604": {
    id: 2604,
    name: "Jrue Holiday",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2604?t=1768205371",
    team: "POR",
    colors: { primary: "#E03A3E", secondary: "#000000" }
  },
  "2646": {
    id: 2646,
    name: "Karl-Anthony Towns",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2646?t=1768205056",
    team: "NYK",
    colors: { primary: "#006BB6", secondary: "#F58426" }
  },
  "2648": {
    id: 2648,
    name: "Kawhi Leonard",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2648?t=1768205465",
    team: "LAC",
    colors: { primary: "#C8102E", secondary: "#1D428A" }
  },
  "2740": {
    id: 2740,
    name: "Kevin Durant",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2740?t=1768205735",
    team: "HOU",
    colors: { primary: "#CE1141", secondary: "#C4CED3" }
  },
  "2777": {
    id: 2777,
    name: "Khris Middleton",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2777?t=1768205686",
    team: "WAS",
    colors: { primary: "#002B5C", secondary: "#E31837" }
  },
  "2817": {
    id: 2817,
    name: "Kyrie Irving",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2817?t=1768205710",
    team: "DAL",
    colors: { primary: "#00538C", secondary: "#B8C4CA" }
  },
  "10166": {
    id: 10166,
    name: "LaMelo Ball",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10166?t=1768205587",
    team: "CHA",
    colors: { primary: "#1D1160", secondary: "#00788C" }
  },
  "2883": {
    id: 2883,
    name: "Lauri Markkanen",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2883?t=1768205406",
    team: "UTA",
    colors: { primary: "#002B5C", secondary: "#F9A01B" }
  },
  "2892": {
    id: 2892,
    name: "LeBron James",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2892?t=1768205486",
    team: "LAL",
    colors: { primary: "#552583", secondary: "#FDB927" }
  },
  "2995": {
    id: 2995,
    name: "Luka Dončić",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/2995?t=1768205479",
    team: "LAL",
    colors: { primary: "#552583", secondary: "#FDB927" }
  },
  "4756": {
    id: 4756,
    name: "Michael Porter Jr.",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4756?t=1768205016",
    team: "BKN",
    colors: { primary: "#000000", secondary: "#FFFFFF" }
  },
  "3429": {
    id: 3429,
    name: "Nikola Jokić",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/3429?t=1768205287",
    team: "DEN",
    colors: { primary: "#0E2240", secondary: "#FEC524" }
  },
  "3454": {
    id: 3454,
    name: "OG Anunoby",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/3454?t=1768205030",
    team: "NYK",
    colors: { primary: "#006BB6", secondary: "#F58426" }
  },
  "12035": {
    id: 12035,
    name: "Paolo Banchero",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/12035?t=1768205644",
    team: "ORL",
    colors: { primary: "#0077C0", secondary: "#C4CED3" }
  },
  "3502": {
    id: 3502,
    name: "Pascal Siakam",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/3502?t=1768205238",
    team: "IND",
    colors: { primary: "#002D62", secondary: "#FDBB30" }
  },
  "3527": {
    id: 3527,
    name: "Paul George",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/3527?t=1768205073",
    team: "PHI",
    colors: { primary: "#006BB6", secondary: "#ED174C" }
  },
  "11124": {
    id: 11124,
    name: "Scottie Barnes",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/11124?t=1768205091",
    team: "TOR",
    colors: { primary: "#CE1141", secondary: "#A1A1A4" }
  },
  "4043": {
    id: 4043,
    name: "Shai Gilgeous-Alexander",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4043?t=1768205338",
    team: "OKC",
    colors: { primary: "#007AC1", secondary: "#EF3B24" }
  },
  "4137": {
    id: 4137,
    name: "Stephen Curry",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4137?t=1768205424",
    team: "GSW",
    colors: { primary: "#1D428A", secondary: "#FDB927" }
  },
  "4398": {
    id: 4398,
    name: "Trae Young",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4398?t=1768205696",
    team: "WAS",
    colors: { primary: "#002B5C", secondary: "#E31837" }
  },
  "10176": {
    id: 10176,
    name: "Tyrese Haliburton",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10176?t=1768205215",
    team: "IND",
    colors: { primary: "#002D62", secondary: "#FDBB30" }
  },
  "10177": {
    id: 10177,
    name: "Tyrese Maxey",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10177?t=1768205080",
    team: "PHI",
    colors: { primary: "#006BB6", secondary: "#ED174C" }
  },
  "13235": {
    id: 13235,
    name: "Victor Wembanyama",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/13235?t=1768205842",
    team: "SAS",
    colors: { primary: "#C4CED3", secondary: "#000000" }
  },
  "4660": {
    id: 4660,
    name: "Zach LaVine",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4660?t=1768205541",
    team: "SAC",
    colors: { primary: "#5A2D81", secondary: "#63727A" }
  },
  "4744": {
    id: 4744,
    name: "Zion Williamson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/4744?t=1768205814",
    team: "NOP",
    colors: { primary: "#002B5C", secondary: "#B4975A" }
  }
};

export const NFL_PLAYERS: Record<string, PlayerData> = {
  "5623": {
    id: 5623,
    name: "Aaron Jones Sr.",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5623?t=1768129628",
    team: "MIN",
    colors: { primary: "#4F2683", secondary: "#FFC62F" }
  },
  "5645": {
    id: 5645,
    name: "Aaron Rodgers",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5645?t=1768127374",
    team: "PIT",
    colors: { primary: "#FFB612", secondary: "#101820" }
  },
  "7029": {
    id: 7029,
    name: "A.J. Brown",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/7029?t=1768128912",
    team: "PHI",
    colors: { primary: "#004C54", secondary: "#A5ACAF" }
  },
  "6390": {
    id: 6390,
    name: "Alvin Kamara",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6390?t=1768130043",
    team: "NO",
    colors: { primary: "#D3BC8D", secondary: "#101820" }
  },
  "6070": {
    id: 6070,
    name: "Austin Ekeler",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6070?t=1768129138",
    team: "WAS",
    colors: { primary: "#5A1414", secondary: "#FFB612" }
  },
  "13359": {
    id: 13359,
    name: "Bijan Robinson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/13359?t=1768129767",
    team: "ATL",
    colors: { primary: "#A71930", secondary: "#000000" }
  },
  "12084": {
    id: 12084,
    name: "Breece Hall",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/12084?t=1768126817",
    team: "NYJ",
    colors: { primary: "#125740", secondary: "#FFFFFF" }
  },
  "11960": {
    id: 11960,
    name: "Brock Purdy",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/11960?t=1768130584",
    team: "SF",
    colors: { primary: "#AA0000", secondary: "#B3995D" }
  },
  "8698": {
    id: 8698,
    name: "CeeDee Lamb",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8698?t=1768128639",
    team: "DAL",
    colors: { primary: "#003594", secondary: "#869397" }
  },
  "11706": {
    id: 11706,
    name: "Chris Olave",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/11706?t=1768130050",
    team: "NO",
    colors: { primary: "#D3BC8D", secondary: "#101820" }
  },
  "5107": {
    id: 5107,
    name: "Christian McCaffrey",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5107?t=1768130589",
    team: "SF",
    colors: { primary: "#AA0000", secondary: "#B3995D" }
  },
  "8752": {
    id: 8752,
    name: "Cole Kmet",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8752?t=1768129191",
    team: "CHI",
    colors: { primary: "#0B162A", secondary: "#C83803" }
  },
  "5980": {
    id: 5980,
    name: "Cooper Kupp",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5980?t=1768130736",
    team: "LAR",
    colors: { primary: "#003594", secondary: "#FFA300" }
  },
  "5419": {
    id: 5419,
    name: "Dak Prescott",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5419?t=1768128627",
    team: "DAL",
    colors: { primary: "#003594", secondary: "#869397" }
  },
  "6717": {
    id: 6717,
    name: "Dallas Goedert",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6717?t=1768129222",
    team: "PHI",
    colors: { primary: "#004C54", secondary: "#A5ACAF" }
  },
  "5405": {
    id: 5405,
    name: "Dalton Schultz",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5405?t=1768127555",
    team: "HOU",
    colors: { primary: "#03202F", secondary: "#A71930" }
  },
  "6632": {
    id: 6632,
    name: "Darren Waller",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6632?t=1768126633",
    team: "MIA",
    colors: { primary: "#008E97", secondary: "#FC4C02" }
  },
  "5651": {
    id: 5651,
    name: "Davante Adams",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5651?t=1768130474",
    team: "LAR",
    colors: { primary: "#003594", secondary: "#FFA300" }
  },
  "5370": {
    id: 5370,
    name: "David Njoku",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5370?t=1768127254",
    team: "CLE",
    colors: { primary: "#311D00", secondary: "#FF3C00" }
  },
  "6885": {
    id: 6885,
    name: "Deebo Samuel",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6885?t=1768129054",
    team: "SF",
    colors: { primary: "#AA0000", secondary: "#B3995D" }
  },
  "7054": {
    id: 7054,
    name: "Derrick Henry",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/7054?t=1768126967",
    team: "BAL",
    colors: { primary: "#241773", secondary: "#000000" }
  },
  "5737": {
    id: 5737,
    name: "Deshaun Watson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5737?t=1768127329",
    team: "CLE",
    colors: { primary: "#311D00", secondary: "#FF3C00" }
  },
  "6862": {
    id: 6862,
    name: "DK Metcalf",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6862?t=1768127384",
    team: "SEA",
    colors: { primary: "#002244", secondary: "#69BE28" }
  },
  "6477": {
    id: 6477,
    name: "Evan Engram",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6477?t=1768128103",
    team: "JAX",
    colors: { primary: "#006778", secondary: "#9F792C" }
  },
  "11780": {
    id: 11780,
    name: "Garrett Wilson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/11780?t=1768126920",
    team: "NYJ",
    colors: { primary: "#125740", secondary: "#FFFFFF" }
  },
  "6942": {
    id: 6942,
    name: "George Kittle",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6942?t=1768130608",
    team: "SF",
    colors: { primary: "#AA0000", secondary: "#B3995D" }
  },
  "6102": {
    id: 6102,
    name: "Hunter Henry",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6102?t=1768126693",
    team: "NE",
    colors: { primary: "#002244", secondary: "#C60C30" }
  },
  "8872": {
    id: 8872,
    name: "Jalen Hurts",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8872?t=1768128901",
    team: "PHI",
    colors: { primary: "#004C54", secondary: "#A5ACAF" }
  },
  "10393": {
    id: 10393,
    name: "Ja'Marr Chase",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10393?t=1768127108",
    team: "CIN",
    colors: { primary: "#FB4F14", secondary: "#000000" }
  },
  "6036": {
    id: 6036,
    name: "Jared Goff",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6036?t=1768129323",
    team: "DET",
    colors: { primary: "#0076B6", secondary: "#B0B7BC" }
  },
  "10383": {
    id: 10383,
    name: "Jaylen Waddle",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10383?t=1768126540",
    team: "MIA",
    colors: { primary: "#008E97", secondary: "#FC4C02" }
  },
  "8696": {
    id: 8696,
    name: "Joe Burrow",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8696?t=1768127094",
    team: "CIN",
    colors: { primary: "#FB4F14", secondary: "#000000" }
  },
  "5243": {
    id: 5243,
    name: "Joe Mixon",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5243?t=1768127618",
    team: "HOU",
    colors: { primary: "#03202F", secondary: "#A71930" }
  },
  "8796": {
    id: 8796,
    name: "Jonathan Taylor",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8796?t=1768127681",
    team: "IND",
    colors: { primary: "#002C5F", secondary: "#A2AAAD" }
  },
  "5024": {
    id: 5024,
    name: "Josh Allen",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5024?t=1768126395",
    team: "BUF",
    colors: { primary: "#00338D", secondary: "#C60C30" }
  },
  "6583": {
    id: 6583,
    name: "Josh Jacobs",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6583?t=1768129473",
    team: "GB",
    colors: { primary: "#204E32", secondary: "#FFB612" }
  },
  "8705": {
    id: 8705,
    name: "Justin Herbert",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8705?t=1768128500",
    team: "LAC",
    colors: { primary: "#0080C6", secondary: "#FFC20E" }
  },
  "8711": {
    id: 8711,
    name: "Justin Jefferson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8711?t=1768129640",
    team: "MIN",
    colors: { primary: "#4F2683", secondary: "#FFC62F" }
  },
  "6236": {
    id: 6236,
    name: "Kirk Cousins",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6236?t=1768129760",
    team: "ATL",
    colors: { primary: "#A71930", secondary: "#000000" }
  },
  "10390": {
    id: 10390,
    name: "Kyle Pitts Sr.",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10390?t=1768129785",
    team: "ATL",
    colors: { primary: "#A71930", secondary: "#000000" }
  },
  "5011": {
    id: 5011,
    name: "Lamar Jackson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5011?t=1768126962",
    team: "BAL",
    colors: { primary: "#241773", secondary: "#000000" }
  },
  "5008": {
    id: 5008,
    name: "Mark Andrews",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5008?t=1768126987",
    team: "BAL",
    colors: { primary: "#241773", secondary: "#000000" }
  },
  "5598": {
    id: 5598,
    name: "Matthew Stafford",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5598?t=1768130465",
    team: "LAR",
    colors: { primary: "#003594", secondary: "#FFA300" }
  },
  "6989": {
    id: 6989,
    name: "Mike Evans",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6989?t=1768130193",
    team: "TB",
    colors: { primary: "#D50A0A", secondary: "#34302B" }
  },
  "5313": {
    id: 5313,
    name: "Nick Chubb",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5313?t=1768127534",
    team: "CLE",
    colors: { primary: "#311D00", secondary: "#FF3C00" }
  },
  "10456": {
    id: 10456,
    name: "Pat Freiermuth",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10456?t=1768127395",
    team: "PIT",
    colors: { primary: "#FFB612", secondary: "#101820" }
  },
  "5953": {
    id: 5953,
    name: "Patrick Mahomes",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5953?t=1768128321",
    team: "KC",
    colors: { primary: "#E31837", secondary: "#FFB612" }
  },
  "10484": {
    id: 10484,
    name: "Rhamondre Stevenson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10484?t=1768126677",
    team: "NE",
    colors: { primary: "#002244", secondary: "#C60C30" }
  },
  "6437": {
    id: 6437,
    name: "Saquon Barkley",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6437?t=1768128905",
    team: "PHI",
    colors: { primary: "#004C54", secondary: "#A5ACAF" }
  },
  "6244": {
    id: 6244,
    name: "Stefon Diggs",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6244?t=1768126683",
    team: "HOU",
    colors: { primary: "#03202F", secondary: "#A71930" }
  },
  "8758": {
    id: 8758,
    name: "Tee Higgins",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8758?t=1768127110",
    team: "CIN",
    colors: { primary: "#FB4F14", secondary: "#000000" }
  },
  "5596": {
    id: 5596,
    name: "T.J. Hockenson",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5596?t=1768129647",
    team: "MIN",
    colors: { primary: "#4F2683", secondary: "#FFC62F" }
  },
  "5399": {
    id: 5399,
    name: "Tony Pollard",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5399?t=1768127953",
    team: "TEN",
    colors: { primary: "#0C2340", secondary: "#4B92DB" }
  },
  "5919": {
    id: 5919,
    name: "Travis Kelce",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5919?t=1768128239",
    team: "KC",
    colors: { primary: "#E31837", secondary: "#FFB612" }
  },
  "10381": {
    id: 10381,
    name: "Trevor Lawrence",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/10381?t=1768127820",
    team: "JAX",
    colors: { primary: "#006778", secondary: "#9F792C" }
  },
  "8708": {
    id: 8708,
    name: "Tua Tagovailoa",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/8708?t=1768126527",
    team: "MIA",
    colors: { primary: "#008E97", secondary: "#FC4C02" }
  },
  "6025": {
    id: 6025,
    name: "Tyler Higbee",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/6025?t=1768130489",
    team: "LAR",
    colors: { primary: "#003594", secondary: "#FFA300" }
  },
  "5976": {
    id: 5976,
    name: "Tyreek Hill",
    headshot: "https://s3.amazonaws.com/clutchpoints-profile-pics/headshots/5976?t=1768126630",
    team: "MIA",
    colors: { primary: "#008E97", secondary: "#FC4C02" }
  }
};
