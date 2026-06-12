export interface Team {
  name: string;
  code: string;
  flag: string;
  points: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  group: string;
}

export interface Group {
  name: string; // Group A, B, C, etc.
  teams: Team[];
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB';
  player: string;
  team: string; // e.g., 'home' or 'away'
  detail?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  date: string;
  time: string;
  group: string;
  details: string;
  minute?: number;
  events?: MatchEvent[];
  possessionHome?: number;
  possessionAway?: number;
  shotsHome?: number;
  shotsAway?: number;
  faultsHome?: number;
  faultsAway?: number;
}

export interface PlayerStats {
  id: string;
  name: string;
  team: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
}

export interface AiPrediction {
  analiseTatica: string;
  jogadoresChave: string;
  probabilidadeVitoriaHome: number;
  probabilidadeEmpate: number;
  probabilidadeVitoriaAway: number;
  previsaoPlacar: string;
  curiosidadeHistorica: string;
}

export interface LiveGroundingData {
  newsSummary: string;
  liveMatches: {
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
    date: string;
    time: string;
    details: string;
  }[];
}
