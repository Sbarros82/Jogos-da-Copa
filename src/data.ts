import { Team, Match, PlayerStats } from './types';

export const INITIAL_TEAMS: Team[] = [
  // Grupo A
  { name: 'México', code: 'MEX', flag: '🇲🇽', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo A' },
  { name: 'Coreia do Sul', code: 'KOR', flag: '🇰🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo A' },
  { name: 'África do Sul', code: 'RSA', flag: '🇿🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo A' },
  { name: 'Rep. Tcheca', code: 'CZE', flag: '🇨🇿', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo A' },

  // Grupo B
  { name: 'Canadá', code: 'CAN', flag: '🇨🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo B' },
  { name: 'Bósnia', code: 'BIH', flag: '🇧🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo B' },
  { name: 'Qatar', code: 'QAT', flag: '🇶🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo B' },
  { name: 'Suíça', code: 'SUI', flag: '🇨🇭', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo B' },

  // Grupo C
  { name: 'Brasil', code: 'BRA', flag: '🇧🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo C' },
  { name: 'Marrocos', code: 'MAR', flag: '🇲🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo C' },
  { name: 'Escócia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo C' },
  { name: 'Haiti', code: 'HAI', flag: '🇭🇹', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo C' },

  // Grupo D
  { name: 'EUA', code: 'USA', flag: '🇺🇸', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo D' },
  { name: 'Paraguai', code: 'PAR', flag: '🇵🇾', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo D' },
  { name: 'Austrália', code: 'AUS', flag: '🇦🇺', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo D' },
  { name: 'Turquia', code: 'TUR', flag: '🇹🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo D' },

  // Grupo E
  { name: 'Alemanha', code: 'GER', flag: '🇩🇪', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo E' },
  { name: 'Curaçao', code: 'CUW', flag: '🇨🇼', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo E' },
  { name: 'Costa do Marfim', code: 'CIV', flag: '🇨🇮', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo E' },
  { name: 'Equador', code: 'ECU', flag: '🇪🇨', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo E' },

  // Grupo F
  { name: 'Holanda', code: 'NED', flag: '🇳🇱', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo F' },
  { name: 'Japão', code: 'JPN', flag: '🇯🇵', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo F' },
  { name: 'Suécia', code: 'SWE', flag: '🇸🇪', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo F' },
  { name: 'Tunísia', code: 'TUN', flag: '🇹🇳', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo F' },

  // Grupo G
  { name: 'Bélgica', code: 'BEL', flag: '🇧🇪', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo G' },
  { name: 'Egito', code: 'EGY', flag: '🇪🇬', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo G' },
  { name: 'Irã', code: 'IRN', flag: '🇮🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo G' },
  { name: 'Nova Zelândia', code: 'NZL', flag: '🇳🇿', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo G' },

  // Grupo H
  { name: 'Espanha', code: 'ESP', flag: '🇪🇸', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo H' },
  { name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo H' },
  { name: 'Arábia Saudita', code: 'KSA', flag: '🇸🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo H' },
  { name: 'Uruguai', code: 'URU', flag: '🇺🇾', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo H' },

  // Grupo I
  { name: 'França', code: 'FRA', flag: '🇫🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo I' },
  { name: 'Senegal', code: 'SEN', flag: '🇸🇳', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo I' },
  { name: 'Iraque', code: 'IRQ', flag: '🇮🇶', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo I' },
  { name: 'Noruega', code: 'NOR', flag: '🇳🇴', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo I' },

  // Grupo J
  { name: 'Argentina', code: 'ARG', flag: '🇦🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo J' },
  { name: 'Argélia', code: 'ALG', flag: '🇩🇿', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo J' },
  { name: 'Áustria', code: 'AUT', flag: '🇦🇹', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo J' },
  { name: 'Jordânia', code: 'JOR', flag: '🇯🇴', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo J' },

  // Grupo K
  { name: 'Portugal', code: 'POR', flag: '🇵🇹', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo K' },
  { name: 'RD Congo', code: 'COD', flag: '🇨🇩', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo K' },
  { name: 'Uzbequistão', code: 'UZB', flag: '🇺🇿', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo K' },
  { name: 'Colômbia', code: 'COL', flag: '🇨🇴', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo K' },

  // Grupo L
  { name: 'Inglaterra', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo L' },
  { name: 'Croácia', code: 'CRO', flag: '🇭🇷', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo L' },
  { name: 'Gana', code: 'GHA', flag: '🇬🇭', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo L' },
  { name: 'Panamá', code: 'PAN', flag: '🇵🇦', points: 0, gamesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalsDifference: 0, group: 'Grupo L' },
];

export const INITIAL_MATCHES: Match[] = [
  // --- GRUPO A ---
  {
    id: 'mA1',
    homeTeam: 'México',
    awayTeam: 'África do Sul',
    homeScore: 2,
    awayScore: 0,
    status: 'FINISHED',
    date: '11 de Junho de 2026',
    time: 'Finalizado',
    group: 'Grupo A',
    details: 'México brilha na estreia oficial da Copa do Mundo com gols de Lozano e Giménez!',
    possessionHome: 59,
    possessionAway: 41,
    shotsHome: 15,
    shotsAway: 6,
    faultsHome: 10,
    faultsAway: 12,
    minute: 90,
    events: [
      { id: 'eA1_1', minute: 23, type: 'GOAL', player: 'Santiago Giménez', team: 'home', detail: 'Assistência de Lozano' },
      { id: 'eA1_2', minute: 78, type: 'GOAL', player: 'Hirving Lozano', team: 'home', detail: 'Chute cruzado na entrada da área' }
    ]
  },
  {
    id: 'mA2',
    homeTeam: 'Coreia do Sul',
    awayTeam: 'Rep. Tcheca',
    homeScore: 2,
    awayScore: 1,
    status: 'FINISHED',
    date: '11 de Junho de 2026',
    time: 'Finalizado',
    group: 'Grupo A',
    details: 'Vitória crucial dos sul-coreanos com golaço de Son Heung-min!',
    possessionHome: 48,
    possessionAway: 52,
    shotsHome: 11,
    shotsAway: 12,
    faultsHome: 14,
    faultsAway: 11,
    minute: 90,
    events: [
      { id: 'eA2_1', minute: 34, type: 'GOAL', player: 'Patrik Schick', team: 'away', detail: 'De cabeça no escanteio' },
      { id: 'eA2_2', minute: 61, type: 'GOAL', player: 'Hwang Hee-chan', team: 'home', detail: 'Após contra-ataque rápido' },
      { id: 'eA2_3', minute: 85, type: 'GOAL', player: 'Son Heung-min', team: 'home', detail: 'Falta direta magistral' }
    ]
  },
  { id: 'mA3', homeTeam: 'Rep. Tcheca', awayTeam: 'África do Sul', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '18 de Junho de 2026', time: '13:00', group: 'Grupo A', details: 'Fase de grupos - Rodada 2' },
  { id: 'mA4', homeTeam: 'México', awayTeam: 'Coreia do Sul', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '18 de Junho de 2026', time: '22:00', group: 'Grupo A', details: 'Fase de grupos - Rodada 2' },
  { id: 'mA5', homeTeam: 'Rep. Tcheca', awayTeam: 'México', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '24 de Junho de 2026', time: '22:00', group: 'Grupo A', details: 'Fase de grupos - Rodada 3' },
  { id: 'mA6', homeTeam: 'África do Sul', awayTeam: 'Coreia do Sul', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '24 de Junho de 2026', time: '22:00', group: 'Grupo A', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO B ---
  {
    id: 'mB1',
    homeTeam: 'Canadá',
    awayTeam: 'Bósnia',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    date: '12 de Junho de 2026',
    time: 'Ao Vivo',
    group: 'Grupo B',
    details: 'Confronto equilibrado em andamento! Canadá e Bósnia duelam ponto a ponto com muita intensidade.',
    possessionHome: 54,
    possessionAway: 46,
    shotsHome: 12,
    shotsAway: 9,
    faultsHome: 12,
    faultsAway: 14,
    minute: 74,
    events: [
      { id: 'eB1_1', minute: 40, type: 'GOAL', player: 'Edin Džeko', team: 'away', detail: 'Finalização precisa após rebote' },
      { id: 'eB1_2', minute: 67, type: 'GOAL', player: 'Jonathan David', team: 'home', detail: 'Chute rasteiro cruzado de canhota' }
    ]
  },
  { id: 'mB2', homeTeam: 'Qatar', awayTeam: 'Suíça', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '13 de Junho de 2026', time: '16:00', group: 'Grupo B', details: 'Fase de grupos - Rodada 1' },
  { id: 'mB3', homeTeam: 'Suíça', awayTeam: 'Bósnia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '18 de Junho de 2026', time: '16:00', group: 'Grupo B', details: 'Fase de grupos - Rodada 2' },
  { id: 'mB4', homeTeam: 'Canadá', awayTeam: 'Qatar', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '18 de Junho de 2026', time: '19:00', group: 'Grupo B', details: 'Fase de grupos - Rodada 2' },
  { id: 'mB5', homeTeam: 'Suíça', awayTeam: 'Canadá', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '24 de Junho de 2026', time: '16:00', group: 'Grupo B', details: 'Fase de grupos - Rodada 3' },
  { id: 'mB6', homeTeam: 'Bósnia', awayTeam: 'Qatar', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '24 de Junho de 2026', time: '16:00', group: 'Grupo B', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO C ---
  { id: 'mC1', homeTeam: 'Brasil', awayTeam: 'Marrocos', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '13 de Junho de 2026', time: '19:00', group: 'Grupo C', details: 'Super clássico intercontinental de estreia do Brasil!' },
  { id: 'mC2', homeTeam: 'Haiti', awayTeam: 'Escócia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '13 de Junho de 2026', time: '22:00', group: 'Grupo C', details: 'Fase de grupos - Rodada 1' },
  { id: 'mC3', homeTeam: 'Escócia', awayTeam: 'Marrocos', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '19 de Junho de 2026', time: '19:00', group: 'Grupo C', details: 'Fase de grupos - Rodada 2' },
  { id: 'mC4', homeTeam: 'Brasil', awayTeam: 'Haiti', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '19 de Junho de 2026', time: '21:30', group: 'Grupo C', details: 'Fase de grupos - Rodada 2' },
  { id: 'mC5', homeTeam: 'Escócia', awayTeam: 'Brasil', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '24 de Junho de 2026', time: '19:00', group: 'Grupo C', details: 'Fase de grupos - Rodada 3' },
  { id: 'mC6', homeTeam: 'Marrocos', awayTeam: 'Haiti', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '24 de Junho de 2026', time: '19:00', group: 'Grupo C', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO D ---
  { id: 'mD1', homeTeam: 'EUA', awayTeam: 'Paraguai', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '12 de Junho de 2026', time: '22:00', group: 'Grupo D', details: 'Fase de grupos - Grande estreia dos donos da casa' },
  { id: 'mD2', homeTeam: 'Austrália', awayTeam: 'Turquia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '14 de Junho de 2026', time: '01:00', group: 'Grupo D', details: 'Fase de grupos - Rodada 1' },
  { id: 'mD3', homeTeam: 'Turquia', awayTeam: 'Paraguai', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '20 de Junho de 2026', time: '00:00', group: 'Grupo D', details: 'Fase de grupos - Rodada 2' },
  { id: 'mD4', homeTeam: 'EUA', awayTeam: 'Austrália', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '19 de Junho de 2026', time: '16:00', group: 'Grupo D', details: 'Fase de grupos - Rodada 2' },
  { id: 'mD5', homeTeam: 'Turquia', awayTeam: 'EUA', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '25 de Junho de 2026', time: '23:00', group: 'Grupo D', details: 'Fase de grupos - Rodada 3' },
  { id: 'mD6', homeTeam: 'Paraguai', awayTeam: 'Austrália', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '25 de Junho de 2026', time: '23:00', group: 'Grupo D', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO E ---
  { id: 'mE1', homeTeam: 'Alemanha', awayTeam: 'Curaçao', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '14 de Junho de 2026', time: '14:00', group: 'Grupo E', details: 'Alemanha estreia como favorita diante da surpresa Curaçao' },
  { id: 'mE2', homeTeam: 'Costa do Marfim', awayTeam: 'Equador', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '14 de Junho de 2026', time: '20:00', group: 'Grupo E', details: 'Fase de grupos - Rodada 1' },
  { id: 'mE3', homeTeam: 'Alemanha', awayTeam: 'Costa do Marfim', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '20 de Junho de 2026', time: '17:00', group: 'Grupo E', details: 'Fase de grupos - Rodada 2' },
  { id: 'mE4', homeTeam: 'Equador', awayTeam: 'Curaçao', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '20 de Junho de 2026', time: '21:00', group: 'Grupo E', details: 'Fase de grupos - Rodada 2' },
  { id: 'mE5', homeTeam: 'Equador', awayTeam: 'Alemanha', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '25 de Junho de 2026', time: '17:00', group: 'Grupo E', details: 'Fase de grupos - Rodada 3' },
  { id: 'mE6', homeTeam: 'Curaçao', awayTeam: 'Costa do Marfim', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '25 de Junho de 2026', time: '17:00', group: 'Grupo E', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO F ---
  { id: 'mF1', homeTeam: 'Holanda', awayTeam: 'Japão', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '14 de Junho de 2026', time: '23:00', group: 'Grupo F', details: 'Holanda e Japão fazem o grande espetáculo de abertura da chave' },
  { id: 'mF2', homeTeam: 'Suécia', awayTeam: 'Tunísia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '17 de Junho de 2026', time: '14:00', group: 'Grupo F', details: 'Fase de grupos - Rodada 1' },
  { id: 'mF3', homeTeam: 'Tunísia', awayTeam: 'Japão', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '20 de Junho de 2026', time: '23:00', group: 'Grupo F', details: 'Fase de grupos - Rodada 2' },
  { id: 'mF4', homeTeam: 'Holanda', awayTeam: 'Suécia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '20 de Junho de 2026', time: '20:00', group: 'Grupo F', details: 'Fase de grupos - Rodada 2' },
  { id: 'mF5', homeTeam: 'Tunísia', awayTeam: 'Holanda', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '25 de Junho de 2026', time: '20:00', group: 'Grupo F', details: 'Fase de grupos - Rodada 3' },
  { id: 'mF6', homeTeam: 'Japão', awayTeam: 'Suécia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '25 de Junho de 2026', time: '20:00', group: 'Grupo F', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO G ---
  { id: 'mG1', homeTeam: 'Bélgica', awayTeam: 'Egito', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '15 de Junho de 2026', time: '16:05', group: 'Grupo G', details: 'Fase de grupos - Estreia dos Red Devils' },
  { id: 'mG2', homeTeam: 'Irã', awayTeam: 'Nova Zelândia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '15 de Junho de 2026', time: '22:00', group: 'Grupo G', details: 'Fase de grupos - Rodada 1' },
  { id: 'mG3', homeTeam: 'Bélgica', awayTeam: 'Irã', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '21 de Junho de 2026', time: '16:00', group: 'Grupo G', details: 'Fase de grupos - Rodada 2' },
  { id: 'mG4', homeTeam: 'Nova Zelândia', awayTeam: 'Egito', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '21 de Junho de 2026', time: '22:00', group: 'Grupo G', details: 'Fase de grupos - Rodada 2' },
  { id: 'mG5', homeTeam: 'Nova Zelândia', awayTeam: 'Bélgica', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '00:00', group: 'Grupo G', details: 'Fase de grupos - Rodada 3' },
  { id: 'mG6', homeTeam: 'Egito', awayTeam: 'Irã', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '00:00', group: 'Grupo G', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO H ---
  { id: 'mH1', homeTeam: 'Espanha', awayTeam: 'Cabo Verde', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '15 de Junho de 2026', time: '13:00', group: 'Grupo H', details: 'Furia inicia sua caminhada rumo ao bicampeonato' },
  { id: 'mH2', homeTeam: 'Arábia Saudita', awayTeam: 'Uruguai', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '15 de Junho de 2026', time: '19:00', group: 'Grupo H', details: 'Fase de grupos - Rodada 1' },
  { id: 'mH3', homeTeam: 'Espanha', awayTeam: 'Arábia Saudita', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '21 de Junho de 2026', time: '13:00', group: 'Grupo H', details: 'Fase de grupos - Rodada 2' },
  { id: 'mH4', homeTeam: 'Uruguai', awayTeam: 'Cabo Verde', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '21 de Junho de 2026', time: '19:00', group: 'Grupo H', details: 'Fase de grupos - Rodada 2' },
  { id: 'mH5', homeTeam: 'Uruguai', awayTeam: 'Espanha', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '26 de Junho de 2026', time: '21:00', group: 'Grupo H', details: 'Fase de grupos - Grande confronto sul-americano e europeu' },
  { id: 'mH6', homeTeam: 'Cabo Verde', awayTeam: 'Arábia Saudita', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '26 de Junho de 2026', time: '21:00', group: 'Grupo H', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO I ---
  { id: 'mI1', homeTeam: 'França', awayTeam: 'Senegal', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '16 de Junho de 2026', time: '16:00', group: 'Grupo I', details: 'França de Mbappé estreia encarando a sempre forte seleção senegalesa' },
  { id: 'mI2', homeTeam: 'Iraque', awayTeam: 'Noruega', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '16 de Junho de 2026', time: '19:00', group: 'Grupo I', details: 'Fase de grupos - Estreia do artilheiro Haaland' },
  { id: 'mI3', homeTeam: 'França', awayTeam: 'Iraque', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '22 de Junho de 2026', time: '18:00', group: 'Grupo I', details: 'Fase de grupos - Rodada 2' },
  { id: 'mI4', homeTeam: 'Noruega', awayTeam: 'Senegal', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '22 de Junho de 2026', time: '21:00', group: 'Grupo I', details: 'Fase de grupos - Rodada 2' },
  { id: 'mI5', homeTeam: 'Noruega', awayTeam: 'França', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '26 de Junho de 2026', time: '16:00', group: 'Grupo I', details: 'Fase de grupos - Rodada 3 super clássico nórdico contra galos' },
  { id: 'mI6', homeTeam: 'Senegal', awayTeam: 'Iraque', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '26 de Junho de 2026', time: '16:00', group: 'Grupo I', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO J ---
  { id: 'mJ1', homeTeam: 'Argentina', awayTeam: 'Argélia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '16 de Junho de 2026', time: '22:00', group: 'Grupo J', details: 'Argentina de Messi entra em campo na busca da reconquista da taça' },
  { id: 'mJ2', homeTeam: 'Áustria', awayTeam: 'Jordânia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '17 de Junho de 2026', time: '01:00', group: 'Grupo J', details: 'Fase de grupos - Rodada 1' },
  { id: 'mJ3', homeTeam: 'Argentina', awayTeam: 'Áustria', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '22 de Junho de 2026', time: '14:00', group: 'Grupo J', details: 'Fase de grupos - Rodada 2' },
  { id: 'mJ4', homeTeam: 'Jordânia', awayTeam: 'Argélia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '23 de Junho de 2026', time: '00:00', group: 'Grupo J', details: 'Fase de grupos - Rodada 2' },
  { id: 'mJ5', homeTeam: 'Jordânia', awayTeam: 'Argentina', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '23:00', group: 'Grupo J', details: 'Fase de grupos - Rodada 3' },
  { id: 'mJ6', homeTeam: 'Argélia', awayTeam: 'Áustria', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '23:00', group: 'Grupo J', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO K ---
  { id: 'mK1', homeTeam: 'Portugal', awayTeam: 'RD Congo', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '17 de Junho de 2026', time: '14:00', group: 'Grupo K', details: 'Portugal entra em campo embalada por sua fase ofensiva fulminante' },
  { id: 'mK2', homeTeam: 'Uzbequistão', awayTeam: 'Colômbia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '17 de Junho de 2026', time: '21:00', group: 'Grupo K', details: 'Fase de grupos - Estreia colombiana' },
  { id: 'mK3', homeTeam: 'Portugal', awayTeam: 'Uzbequistão', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '23 de Junho de 2026', time: '14:00', group: 'Grupo K', details: 'Fase de grupos - Rodada 2' },
  { id: 'mK4', homeTeam: 'Colômbia', awayTeam: 'RD Congo', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '23 de Junho de 2026', time: '23:00', group: 'Grupo K', details: 'Fase de grupos - Rodada 2' },
  { id: 'mK5', homeTeam: 'Colômbia', awayTeam: 'Portugal', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '20:30', group: 'Grupo K', details: 'Super clássico luso-latino na rodada final de grupos' },
  { id: 'mK6', homeTeam: 'RD Congo', awayTeam: 'Uzbequistão', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '20:30', group: 'Grupo K', details: 'Fase de grupos - Rodada 3' },

  // --- GRUPO L ---
  { id: 'mL1', homeTeam: 'Inglaterra', awayTeam: 'Croácia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '17 de Junho de 2026', time: '17:00', group: 'Grupo L', details: 'O clássico mais aguardado do Grupo L entre ingleses e croatas' },
  { id: 'mL2', homeTeam: 'Gana', awayTeam: 'Panamá', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '17 de Junho de 2026', time: '20:00', group: 'Grupo L', details: 'Fase de grupos - Rodada 1' },
  { id: 'mL3', homeTeam: 'Inglaterra', awayTeam: 'Gana', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '23 de Junho de 2026', time: '17:00', group: 'Grupo L', details: 'Fase de grupos - Rodada 2' },
  { id: 'mL4', homeTeam: 'Panamá', awayTeam: 'Croácia', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '23 de Junho de 2026', time: '20:00', group: 'Grupo L', details: 'Fase de grupos - Rodada 2' },
  { id: 'mL5', homeTeam: 'Panamá', awayTeam: 'Inglaterra', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '18:00', group: 'Grupo L', details: 'Fase de grupos - Rodada 3' },
  { id: 'mL6', homeTeam: 'Croácia', awayTeam: 'Gana', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '27 de Junho de 2026', time: '18:00', group: 'Grupo L', details: 'Fase de grupos - Rodada 3' },
];

export const INITIAL_PLAYER_STATS: PlayerStats[] = [
  { id: 'p1', name: 'Santiago Giménez', team: 'México', goals: 1, assists: 0, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
  { id: 'p2', name: 'Hirving Lozano', team: 'México', goals: 1, assists: 1, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
  { id: 'p3', name: 'Son Heung-min', team: 'Coreia do Sul', goals: 1, assists: 0, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
  { id: 'p4', name: 'Patrik Schick', team: 'Rep. Tcheca', goals: 1, assists: 0, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
  { id: 'p5', name: 'Hwang Hee-chan', team: 'Coreia do Sul', goals: 1, assists: 0, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
  { id: 'p6', name: 'Jonathan David', team: 'Canadá', goals: 1, assists: 0, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
  { id: 'p7', name: 'Edin Džeko', team: 'Bósnia', goals: 1, assists: 0, matchesPlayed: 1, yellowCards: 0, redCards: 0 },
];
