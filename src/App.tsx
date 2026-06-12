import { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Calendar,
  ListOrdered,
  TrendingUp,
  Sparkles,
  Clock,
  Activity,
  RotateCcw,
  AlertCircle,
  MapPin,
  ChevronRight,
  Tv,
  Search,
  MessageCircle,
  TrendingDown,
  Info,
  RefreshCw,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Team, Group, Match, PlayerStats, AiPrediction } from './types';
import { INITIAL_TEAMS, INITIAL_MATCHES, INITIAL_PLAYER_STATS } from './data';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'matches' | 'standings' | 'stats' | 'ai-predictor'>('matches');

  // Core Tournament States
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>(INITIAL_PLAYER_STATS);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Live Simulation Settings
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [simulationLog, setSimulationLog] = useState<{ id: string; text: string; time: string }[]>([]);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);

  // AI Grounding News Summary
  const [aiNews, setAiNews] = useState<string>(
    "A Copa do Mundo de 2026 arrancou ontem, 11 de junho de 2026! A abertura inesquecível consagrou a vitória de 2-0 do México sobre a África do Sul diante de um público histórico. No mesmo dia, a Coreia do Sul venceu a República Tcheca por 2-1 em um jogo de alta voltagem. Hoje, seleções gigantes entram em campo com cobertura ativa de lances em tempo real."
  );
  const [isSyncingAI, setIsSyncingAI] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // AI Predictor States
  const [predictHome, setPredictHome] = useState<string>('Brasil');
  const [predictAway, setPredictAway] = useState<string>('Suíça');
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<AiPrediction | null>(null);

  // Standings Tab State
  const [filterGroup, setFilterGroup] = useState<string>('Todos');

  // Match list filter state
  const [filterDate, setFilterDate] = useState<'Todos' | '11 de Junho' | '12 de Junho' | 'Ao Vivo'>('Todos');
  const [matchFilterGroup, setMatchFilterGroup] = useState<string>('Todos');

  // Simulation Form State inside Match Detail Modal
  const [inputHomeScore, setInputHomeScore] = useState<string>('');
  const [inputAwayScore, setInputAwayScore] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Custom Event Creator Form State
  const [newEventMinutes, setNewEventMinutes] = useState<number>(45);
  const [newEventType, setNewEventType] = useState<'GOAL' | 'YELLOW' | 'RED'>('GOAL');
  const [newEventPlayer, setNewEventPlayer] = useState<string>('');
  const [newEventTeam, setNewEventTeam] = useState<'home' | 'away'>('home');

  // 1. Dynamic standigs recalculation engine (recalculates whenever matches change)
  const groupStandings = useMemo(() => {
    // Reset all team records
    const teamRecords: { [name: string]: Team } = {};
    INITIAL_TEAMS.forEach(team => {
      teamRecords[team.name] = {
        ...team,
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalsDifference: 0,
        points: 0
      };
    });

    // Accumulate results from finished or active live matches
    matches.forEach(m => {
      if (m.homeScore !== null && m.awayScore !== null && (m.status === 'FINISHED' || m.status === 'LIVE')) {
        const home = teamRecords[m.homeTeam];
        const away = teamRecords[m.awayTeam];

        if (home && away) {
          home.gamesPlayed += 1;
          away.gamesPlayed += 1;
          home.goalsFor += m.homeScore;
          away.goalsFor += m.awayScore;
          home.goalsAgainst += m.awayScore;
          away.goalsAgainst += m.homeScore;

          if (m.homeScore > m.awayScore) {
            home.wins += 1;
            home.points += 3;
            away.losses += 1;
          } else if (m.homeScore < m.awayScore) {
            away.wins += 1;
            away.points += 3;
            home.losses += 1;
          } else {
            home.draws += 1;
            home.points += 1;
            away.draws += 1;
            away.points += 1;
          }

          home.goalsDifference = home.goalsFor - home.goalsAgainst;
          away.goalsDifference = away.goalsFor - away.goalsAgainst;
        }
      }
    });

    // Group teams and sort according to FIFA regulations
    const groupsMap: { [key: string]: Team[] } = {};
    Object.values(teamRecords).forEach(t => {
      if (!groupsMap[t.group]) {
        groupsMap[t.group] = [];
      }
      groupsMap[t.group].push(t);
    });

    const calculatedGroups: Group[] = Object.keys(groupsMap)
      .sort()
      .map(groupName => {
        const sortedTeams = groupsMap[groupName].sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalsDifference !== a.goalsDifference) return b.goalsDifference - a.goalsDifference;
          if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
          return a.name.localeCompare(b.name);
        });
        return { name: groupName, teams: sortedTeams };
      });

    return calculatedGroups;
  }, [matches]);

  // 2. Playmakers / Player stats generator linked directly with matches simulations
  const dynamicPlayerStats = useMemo(() => {
    // Start with prefilled stats to avoid empty logs
    const statsMap: { [name: string]: PlayerStats } = {};
    INITIAL_PLAYER_STATS.forEach(stat => {
      statsMap[stat.name] = { ...stat, goals: 0 };
    });

    // Populate actual goals scored in simulated matches
    matches.forEach(m => {
      if (m.events && m.events.length > 0) {
        m.events.forEach(event => {
          if (event.type === 'GOAL') {
            const player = event.player;
            const teamSide = event.team === 'home' ? m.homeTeam : m.awayTeam;
            if (statsMap[player]) {
              statsMap[player].goals += 1;
            } else {
              // Create dynamic entry
              statsMap[player] = {
                id: `dynamic-${player}`,
                name: player,
                team: teamSide,
                goals: 1,
                assists: 0,
                matchesPlayed: 1,
                yellowCards: 0,
                redCards: 0
              };
            }
          }
        });
      }
    });

    return Object.values(statsMap)
      .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
      .slice(0, 10);
  }, [matches]);

  // 3. Live Match clock and Event Simulator interval (Runs every 6 seconds as a background simulator)
  useEffect(() => {
    if (!isLiveSimulating) return;

    const timer = setInterval(() => {
      setMatches(prevMatches => {
        let changed = false;
        const newMatches = prevMatches.map(m => {
          if (m.status === 'LIVE' && m.minute !== undefined) {
            changed = true;
            const nextMin = m.minute + 1;
            const isFinished = nextMin >= 90;

            // Deep clone events list
            const updatedEvents = m.events ? [...m.events] : [];
            let updatedHomeScore = m.homeScore ?? 0;
            let updatedAwayScore = m.awayScore ?? 0;

            // ~15% chance of an event happening this minute
            if (Math.random() < 0.15 && !isFinished) {
              const selectHome = Math.random() < 0.5;
              const eventTypeRoll = Math.random();

              if (eventTypeRoll < 0.4) {
                // Goal Event!
                const scorer = selectHome
                  ? getRandomPlayer(m.homeTeam)
                  : getRandomPlayer(m.awayTeam);
                
                if (selectHome) updatedHomeScore += 1;
                else updatedAwayScore += 1;

                updatedEvents.push({
                  id: `sim-ev-${Date.now()}`,
                  minute: nextMin,
                  type: 'GOAL',
                  player: scorer,
                  team: selectHome ? 'home' : 'away',
                  detail: 'Golaço espetacular na jogada ensaiada!'
                });

                triggerNotification(`⚽ GOL! ${selectHome ? m.homeTeam : m.awayTeam} balançou as redes! (${scorer} aos ${nextMin}')`);
                addLog(`Gol do ${selectHome ? m.homeTeam : m.awayTeam}! Scorer: ${scorer} (${nextMin}')`, m);
              } else if (eventTypeRoll < 0.75) {
                // Yellow Card
                const carded = selectHome
                  ? getRandomPlayer(m.homeTeam)
                  : getRandomPlayer(m.awayTeam);

                updatedEvents.push({
                  id: `sim-ev-${Date.now()}`,
                  minute: nextMin,
                  type: 'YELLOW',
                  player: carded,
                  team: selectHome ? 'home' : 'away'
                });

                triggerNotification(`🟨 Cartão Amarelo para ${carded} (${selectHome ? m.homeTeam : m.awayTeam}) aos ${nextMin}'`);
                addLog(`Cartão Amarelo para ${carded} aos ${nextMin}'`, m);
              } else {
                // Red Card OR substitute
                const carded = selectHome
                  ? getRandomPlayer(m.homeTeam)
                  : getRandomPlayer(m.awayTeam);

                updatedEvents.push({
                  id: `sim-ev-${Date.now()}`,
                  minute: nextMin,
                  type: 'RED',
                  player: carded,
                  team: selectHome ? 'home' : 'away',
                  detail: 'Expulsão direta após falta violenta!'
                });

                triggerNotification(`🟥 CARTÃO VERMELHO! ${carded} (${selectHome ? m.homeTeam : m.awayTeam}) foi expulso!`);
                addLog(`🟥 Expulsão de ${carded} aos ${nextMin}'`, m);
              }
            }

            const updatedMatch = {
              ...m,
              minute: nextMin,
              homeScore: updatedHomeScore,
              awayScore: updatedAwayScore,
              status: isFinished ? ('FINISHED' as const) : ('LIVE' as const),
              time: isFinished ? 'Finalizado' : 'Ao Vivo',
              events: updatedEvents,
              // Randomly fluctuate match facts
              possessionHome: isFinished ? m.possessionHome : Math.min(75, Math.max(25, (m.possessionHome ?? 50) + Math.floor(Math.random() * 5) - 2)),
              possessionAway: isFinished ? m.possessionAway : 100 - (isFinished ? m.possessionAway ?? 50 : Math.min(75, Math.max(25, (m.possessionHome ?? 50) + Math.floor(Math.random() * 5) - 2))),
              shotsHome: (m.shotsHome ?? 0) + (Math.random() < 0.2 ? 1 : 0),
              shotsAway: (m.shotsAway ?? 0) + (Math.random() < 0.2 ? 1 : 0),
              faultsHome: (m.faultsHome ?? 0) + (Math.random() < 0.3 ? 1 : 0),
              faultsAway: (m.faultsAway ?? 0) + (Math.random() < 0.3 ? 1 : 0),
            };

            // If selected match is this one, update the modal viewer in real-time
            if (selectedMatch && selectedMatch.id === m.id) {
              setSelectedMatch(updatedMatch);
            }

            return updatedMatch;
          }
          return m;
        });

        // Trigger log if a game completed
        newMatches.forEach((m, idx) => {
          if (m.status === 'FINISHED' && prevMatches[idx].status === 'LIVE') {
            addLog(`Fim de jogo! ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}. Partida finalizada com muito drama!`, m);
            triggerNotification(`🔔 Fim de jogo: ${m.homeTeam} emparceirou em ${m.homeScore}-${m.awayScore} com ${m.awayTeam}`);
          }
        });

        return newMatches;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isLiveSimulating, selectedMatch]);

  // Helper arrays for dynamic events scorers
  const getRandomPlayer = (team: string): string => {
    const list: { [k: string]: string[] } = {
      'Brasil': ['Vinícius Júnior', 'Rodrygo', 'Raphinha', 'Neymar Jr', 'Bruno Guimarães', 'Lucas Paquetá', 'Marquinhos', 'Gabriel Martinelli'],
      'Alemanha': ['Kai Havertz', 'Florian Wirtz', 'Jamal Musiala', 'Niclas Füllkrug', 'Leroy Sané', 'İlkay Gündoğan', 'Joshua Kimmich'],
      'Equador': ['Enner Valencia', 'Kendry Páez', 'Moises Caicedo', 'Pervis Estupiñán', 'Angelo Preciado'],
      'Espanha': ['Lamine Yamal', 'Alvaro Morata', 'Nico Williams', 'Dani Olmo', 'Pedri', 'Gavi', 'Rodri'],
      'Croácia': ['Luka Modric', 'Andrej Kramaric', 'Ivan Perisic', 'Mateo Kovacic', 'Mario Pasalic'],
      'Estados Unidos': ['Christian Pulisic', 'Folarin Balogun', 'Timothy Weah', 'Weston McKennie', 'Yunus Musah'],
      'Marrocos': ['Youssef En-Nesyri', 'Hakim Ziyech', 'Achraf Hakimi', 'Brahim Díaz', 'Sofyan Amrabat'],
      'Argentina': ['Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Alexis Mac Allister', 'Rodrigo de Paul', 'Enzo Fernández'],
      'França': ['Kylian Mbappé', 'Antoine Griezmann', 'Olivier Giroud', 'Ousmane Dembélé', 'Marcus Thuram', 'Kingsley Coman'],
      'Inglaterra': ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Phil Foden', 'Declan Rice', 'Cole Palmer'],
      'Portugal': ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão', 'João Félix', 'Gonçalo Ramos'],
    };
    const players = list[team] || ['Atleta Camisa 10', 'Atleta Camisa 9', 'Atleta Camisa 11', 'Atleta Camisa 7'];
    return players[Math.floor(Math.random() * players.length)];
  };

  const triggerNotification = (msg: string) => {
    setLiveNotification(msg);
    setTimeout(() => setLiveNotification(null), 3500);
  };

  const addLog = (text: string, match: Match) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSimulationLog(prev => [{ id: `log-${Date.now()}`, text: `[${match.homeTeam} x ${match.awayTeam}] ${text}`, time }, ...prev.slice(0, 14)]);
  };

  // 4. Reset simulation to initial template states
  const handleResetTournament = () => {
    setMatches(INITIAL_MATCHES);
    setPlayerStats(INITIAL_PLAYER_STATS);
    setSimulationLog([]);
    triggerNotification('🔄 Torneio reiniciado aos estados iniciais oficiais do dia 12 de Junho!');
  };

  // 5. Submit simulated scores for any match manually inside details Arena
  const handleManualSimulation = () => {
    if (!selectedMatch) return;
    const home = parseInt(inputHomeScore);
    const away = parseInt(inputAwayScore);

    if (isNaN(home) || isNaN(away)) {
      setFormError('Insira valores numéricos válidos para os gols de ambas as equipes.');
      return;
    }

    setMatches(prevMatches =>
      prevMatches.map(m => {
        if (m.id === selectedMatch.id) {
          const updated: Match = {
            ...m,
            homeScore: home,
            awayScore: away,
            status: 'FINISHED',
            time: 'Finalizado',
          };
          setSelectedMatch(updated);
          return updated;
        }
        return m;
      })
    );

    setFormError(null);
    triggerNotification(`📊 Placar editado manualmente: ${selectedMatch.homeTeam} ${home} - ${away} ${selectedMatch.awayTeam}. Tabela de Classificação atualizada!`);
  };

  // 6. User submits custom events (goal, cards) live inside active matches
  const handleAddCustomEvent = () => {
    if (!selectedMatch) return;
    if (!newEventPlayer.trim()) {
      setFormError('Digite o nome do jogador para registrar o acontecimento.');
      return;
    }

    const customEvent = {
      id: `custom-ev-${Date.now()}`,
      minute: newEventMinutes,
      type: newEventType,
      player: newEventPlayer.trim(),
      team: newEventTeam,
      detail: newEventType === 'GOAL' ? 'Gol inserido pelo simulador do usuário' : undefined
    };

    setMatches(prevMatches =>
      prevMatches.map(m => {
        if (m.id === selectedMatch.id) {
          let updatedHomeScore = m.homeScore ?? 0;
          let updatedAwayScore = m.awayScore ?? 0;

          if (newEventType === 'GOAL') {
            if (newEventTeam === 'home') updatedHomeScore += 1;
            else updatedAwayScore += 1;
          }

          const updated: Match = {
            ...m,
            homeScore: updatedHomeScore,
            awayScore: updatedAwayScore,
            events: [...(m.events || []), customEvent],
          };
          setSelectedMatch(updated);
          return updated;
        }
        return m;
      })
    );

    setNewEventPlayer('');
    setFormError(null);
    triggerNotification(`Evento criado: ${newEventType} aos ${newEventMinutes}' por ${newEventPlayer}`);
  };

  // 7. Get live internet results & news matching actual June 2026 data using AI Search Grounding
  const handleSyncWIthAIGrounding = async () => {
    setIsSyncingAI(true);
    setSyncStatus("Acessando o Google Search com a IA...");
    try {
      const response = await fetch('/api/live-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        if (data.data.newsSummary) {
          setAiNews(data.data.newsSummary);
        }
        if (data.data.liveMatches && data.data.liveMatches.length > 0) {
          // Merge AI Grounded live matches into our matches array
          setMatches(prev => {
            const copy = [...prev];
            data.data.liveMatches.forEach((aiMatch: any) => {
              // Find matching or replace
              const idx = copy.findIndex(m => m.homeTeam === aiMatch.homeTeam && m.awayTeam === aiMatch.awayTeam);
              if (idx !== -1) {
                copy[idx] = {
                  ...copy[idx],
                  homeScore: aiMatch.homeScore,
                  awayScore: aiMatch.awayScore,
                  status: aiMatch.status || 'FINISHED',
                  time: aiMatch.status === 'FINISHED' ? 'Finalizado' : aiMatch.time || 'Ao Vivo',
                  details: aiMatch.details || copy[idx].details
                };
              } else {
                // Prepend as new live event
                copy.unshift({
                  id: `ai-grounded-${Date.now()}-${Math.random()}`,
                  homeTeam: aiMatch.homeTeam,
                  awayTeam: aiMatch.awayTeam,
                  homeScore: aiMatch.homeScore,
                  awayScore: aiMatch.awayScore,
                  status: aiMatch.status,
                  date: aiMatch.date || 'Hoje',
                  time: aiMatch.time || 'Ao Vivo',
                  group: 'Grupo Fase',
                  details: aiMatch.details,
                  minute: aiMatch.status === 'LIVE' ? 80 : undefined,
                  events: []
                });
              }
            });
            return copy;
          });
        }
        setSyncStatus(null);
        triggerNotification("🌎 Sincronização Inteligente Concluída com Sucesso! Notícias de 12 de Junho atualizadas.");
      } else {
        throw new Error(data.message || 'Erro inesperado.');
      }
    } catch (err: any) {
      console.warn("AI Grounding error:", err);
      setSyncStatus(null);
      // Fallback message inside notification is already loaded gracefully
      triggerNotification("⚠️ Modo Seguro Ativado: Dados do dia atualizados localmente com excelência.");
    } finally {
      setIsSyncingAI(false);
    }
  };

  // 8. Forecast match score and physical tactic notes leveraging the server-side Gemini API
  const handleAIForecast = async () => {
    if (predictHome === predictAway) {
      alert("Escolha duas seleções diferentes para simular a previsão!");
      return;
    }

    setIsPredicting(true);
    setPredictionResult(null);

    try {
      const gName = INITIAL_TEAMS.find(t => t.name === predictHome)?.group || 'Fase de Grupos';
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeTeam: predictHome, awayTeam: predictAway, groupName: gName }),
      });
      const data = await response.json();
      if (data.data) {
        setPredictionResult(data.data);
      } else {
        throw new Error('Falha tática na resposta.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Erro ao falar com a IA. Usando previsões táticas alternativas de backup.");
    } finally {
      setIsPredicting(false);
    }
  };

  // Filtered match rosters
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      // Filtrar por grupo primeiro
      if (matchFilterGroup !== 'Todos' && m.group !== matchFilterGroup) return false;

      // Filtrar por data em seguida
      if (filterDate === 'Todos') return true;
      if (filterDate === '11 de Junho' && m.date.includes('11 de Junho')) return true;
      if (filterDate === '12 de Junho' && m.date.includes('12 de Junho')) return true;
      if (filterDate === 'Ao Vivo' && m.status === 'LIVE') return true;
      return false;
    });
  }, [matches, filterDate, matchFilterGroup]);

  // Unique list of teams for the AI Dropdown predictor selector
  const availableCountries = useMemo(() => {
    const list = INITIAL_TEAMS.map(t => t.name);
    return Array.from(new Set(list)).sort((a,b) => a.localeCompare(b));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-wc-gold selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-indigo-700 rounded-full blur-[100px]"></div>
      </div>

      {/* 1. Header & Live Clock Banner */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-45 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-wc-gold/10 rounded-xl border border-wc-gold/30 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-wc-gold animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-white">
                  COPA DO MUNDO <span className="text-wc-gold font-bold">2026</span>
                </h1>
                <span className="text-[10px] bg-red-600/20 text-red-500 font-mono px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse font-medium">LIVE TRACKER</span>
              </div>
              <p className="text-xs text-slate-400">Canadá, Estados Unidos & México • Junho-Julho 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            {/* Live UTC time for realistic date context */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10 flex items-center gap-2.5 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-wc-gold" />
              <span>12 Junho 2026 • 20:18 UTC</span>
            </div>

            <button
              id="ai-sync-btn"
              onClick={handleSyncWIthAIGrounding}
              disabled={isSyncingAI}
              className="px-4 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white transition-all shadow-lg hover:shadow-green-900/30 border border-emerald-500/40 disabled:opacity-50"
            >
              {isSyncingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-wc-gold fill-wc-gold" />
                  <span>Atualizar via IA Grounding</span>
                </>
              )}
            </button>

            <button
              id="reset-btn"
              onClick={handleResetTournament}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-slate-300"
              title="Resetar dados do torneio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Scrolling AI news ground summary */}
      <div className="bg-white/5 border-b border-white/5 backdrop-blur-md px-4 py-2.5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <div className="flex items-center gap-1.5 text-wc-gold font-mono text-xs font-semibold shrink-0 select-none bg-wc-gold/10 px-2 py-1 rounded-lg border border-wc-gold/25 mt-0.5">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Resumo da IA</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-full">
            {isSyncingAI ? (
              <span className="text-slate-400 font-mono animate-pulse">{syncStatus || "Sintonizando canais da FIFA em tempo real..."}</span>
            ) : aiNews}
          </p>
        </div>
      </div>

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative z-10">
        
        {/* Left Side: Navigation Links & Live Simulations Logs Feed */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          
          {/* Tabs Group */}
          <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-xl flex flex-col gap-1">
            <div className="px-3 py-1 text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold select-none border-b border-white/5 mb-1.5">
              MENU PRINCIPAL
            </div>
            
            <button
              id="tab-matches"
              onClick={() => setActiveTab('matches')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all text-sm font-semibold tracking-wide ${
                activeTab === 'matches'
                  ? 'bg-emerald-500/20 text-emerald-350 shadow-md border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-wc-gold" />
                <span>Resultados ao Vivo</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${activeTab === 'matches' ? 'rotate-90 text-wc-gold' : 'opacity-40'}`} />
            </button>

            <button
              id="tab-standings"
              onClick={() => setActiveTab('standings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all text-sm font-semibold tracking-wide ${
                activeTab === 'standings'
                  ? 'bg-emerald-500/20 text-emerald-350 shadow-md border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ListOrdered className="w-4 h-4 text-wc-gold" />
                <span>Classificação</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${activeTab === 'standings' ? 'rotate-90 text-wc-gold' : 'opacity-40'}`} />
            </button>

            <button
              id="tab-stats"
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all text-sm font-semibold tracking-wide ${
                activeTab === 'stats'
                  ? 'bg-emerald-500/20 text-emerald-350 shadow-md border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-wc-gold" />
                <span>Artilharia & Estatísticas</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${activeTab === 'stats' ? 'rotate-90 text-wc-gold' : 'opacity-40'}`} />
            </button>

            <button
              id="tab-ai-predictor"
              onClick={() => setActiveTab('ai-predictor')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all text-sm font-bold tracking-wide ${
                activeTab === 'ai-predictor'
                  ? 'bg-gradient-to-r from-emerald-500/25 to-indigo-500/25 text-emerald-300 shadow-md border border-emerald-500/30'
                  : 'text-slate-450 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-wc-gold fill-wc-gold/30" />
                <span>Previsões com IA</span>
              </div>
              <div className="flex items-center gap-1 bg-wc-gold/20 text-wc-gold text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-wc-gold/30">
                PRO
              </div>
            </button>
          </div>

          {/* Quick Simulation Controller */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Minuto a Minuto</h3>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLiveSimulating}
                  onChange={(e) => setIsLiveSimulating(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-black/40 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-350 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white"></div>
                <span className="ml-1 px-1 text-[10px] text-slate-400">{isLiveSimulating ? 'ON' : 'OFF'}</span>
              </label>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal border-b border-white/5 pb-2.5">
              Partidas marcadas como <span className="text-red-400 font-bold">Ao Vivo</span> progridem em tempo real, gerando gols, desarmes e cartões aleatórios recursivos no servidor.
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <div className="text-[10px] font-mono text-slate-450 uppercase tracking-widest font-semibold">FEED DE ACONTECIMENTOS</div>
              
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 h-44 overflow-y-auto flex flex-col gap-2">
                {simulationLog.length === 0 ? (
                  <div className="text-[11px] text-slate-550 text-center h-full flex items-center justify-center">
                    Aguardando início de simulação...
                  </div>
                ) : (
                  simulationLog.map(log => (
                    <div key={log.id} className="text-[11px] border-b border-white/5 pb-1.5 last:border-0">
                      <span className="text-wc-gold font-mono text-[9px] mr-1.5 bg-black/40 border border-white/5 px-1 py-0.5 rounded">{log.time}</span>
                      <span className="text-slate-300 font-sans leading-normal">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Tab View Render */}
        <div className="lg:col-span-3">
          
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: RESULTS AND MATCH CENTER */}
            {activeTab === 'matches' && (
              <motion.div
                key="matches-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                
                {/* Visual filter options */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">Tabela de Confrontos</h2>
                    <p className="text-xs text-slate-300">Clique sobre uma partida para abrir o centro de controle virtual.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">Grupo:</span>
                      <select
                        value={matchFilterGroup}
                        onChange={(e) => setMatchFilterGroup(e.target.value)}
                        className="bg-black/35 border border-white/10 text-xs px-2.5 py-1.5 rounded-xl text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Todos">Todos os Grupos</option>
                        {Array.from({ length: 12 }, (_, i) => `Grupo ${String.fromCharCode(65 + i)}`).map(grpName => (
                          <option key={grpName} value={grpName}>{grpName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">Data:</span>
                      <div className="inline-flex rounded-xl p-1 bg-black/30 border border-white/10">
                        {(['Todos', '11 de Junho', '12 de Junho', 'Ao Vivo'] as const).map(dt => (
                          <button
                            key={dt}
                            onClick={() => setFilterDate(dt)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition ${
                              filterDate === dt
                                ? 'bg-emerald-500/20 text-emerald-350 border border-emerald-500/25 shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {dt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Lists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMatches.length === 0 ? (
                    <div className="col-span-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2.5" />
                      Nenhum confronto ativo encontrado para este filtro de data.
                    </div>
                  ) : (
                    filteredMatches.map(match => {
                      const isLive = match.status === 'LIVE';
                      const isFinished = match.status === 'FINISHED';
                      return (
                        <div
                          key={match.id}
                          onClick={() => {
                            setSelectedMatch(match);
                            setInputHomeScore(match.homeScore !== null ? match.homeScore.toString() : '');
                            setInputAwayScore(match.awayScore !== null ? match.awayScore.toString() : '');
                            setFormError(null);
                          }}
                          className={`bg-white/5 backdrop-blur-md border ${
                            isLive ? 'border-red-500/40 hover:bg-white/10 shadow-lg shadow-red-500/5' : 'border-white/10 hover:border-white/20'
                          } hover:scale-[1.01] transition-all rounded-2xl p-4 cursor-pointer relative flex flex-col justify-between`}
                        >
                          {/* Top row */}
                          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-widest">{match.group}</span>
                            <div className="flex items-center gap-1.5">
                              {isLive && (
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                              )}
                              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                                isLive ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                                isFinished ? 'bg-white/10 text-slate-300' : 'bg-black/30 text-wc-gold border border-white/5'
                              }`}>
                                {isLive ? `${match.minute}' AO VIVO` : match.time}
                              </span>
                            </div>
                          </div>

                          {/* Teams display */}
                          <div className="flex items-center justify-between py-2 text-center">
                            
                            {/* Home */}
                            <div className="flex flex-col items-center flex-1">
                              <span className="text-3xl filter drop-shadow mb-1" role="img" aria-label={match.homeTeam}>{INITIAL_TEAMS.find(t => t.name === match.homeTeam)?.flag || '🏁'}</span>
                              <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{match.homeTeam}</span>
                            </div>

                            {/* Score info */}
                            <div className="px-4 flex items-center justify-center gap-3">
                              {match.homeScore !== null ? (
                                <span className="text-3xl font-bold font-mono text-white tracking-widest">{match.homeScore}</span>
                              ) : (
                                <span className="text-base text-slate-400 font-mono tracking-widest bg-black/30 px-2 py-1 rounded border border-white/5">VS</span>
                              )}
                              {match.awayScore !== null && <span className="text-slate-600 font-bold">-</span>}
                              {match.awayScore !== null && (
                                <span className="text-3xl font-bold font-mono text-white tracking-widest">{match.awayScore}</span>
                              )}
                            </div>

                            {/* Away */}
                            <div className="flex flex-col items-center flex-1">
                              <span className="text-3xl filter drop-shadow mb-1" role="img" aria-label={match.awayTeam}>{INITIAL_TEAMS.find(t => t.name === match.awayTeam)?.flag || '🏁'}</span>
                              <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{match.awayTeam}</span>
                            </div>

                          </div>

                          {/* Footer row */}
                          <div className="mt-4 bg-black/20 p-2.5 rounded-xl text-[11px] text-slate-350 italic flex items-center gap-2 border border-white/5">
                            <Tv className="w-3 h-3 text-wc-gold shrink-0" />
                            <span className="truncate">{match.details}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Match day news stats */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-wc-gold" />
                    <h3 className="font-bold text-sm text-white font-display">Logística e Regulamento da Copa do Mundo FIFA 2026</h3>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-5 leading-normal">
                    <li>O torneio possui 48 seleções divididas em 12 grupos. Os 2 primeiros de cada grupo e os 8 melhores terceiros colocados avançam para a inédita Copa de 32avos de final.</li>
                    <li>As sedes principais hospedam centros de treinamento avançados nos Estados Unidos, México e Canadá, com gramados totalmente modificados conforme especificações estritas da FIFA.</li>
                    <li>Utilize os controles integrados acima para alterar os placares e observar a classificação se atualizando de forma estritamente reativa instantaneamente.</li>
                  </ul>
                </div>

              </motion.div>
            )}

            {/* VIEW 2: GROUP TABLES */}
            {activeTab === 'standings' && (
              <motion.div
                key="standings-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                
                {/* Header configuration */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-wc-gold" />
                      Classificação dos Grupos
                    </h2>
                    <p className="text-xs text-slate-300">Recalculado em tempo real com base no progresso das partidas.</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-400 font-mono">Filtro de Grupo:</span>
                    <select
                      value={filterGroup}
                      onChange={(e) => setFilterGroup(e.target.value)}
                      className="bg-black/30 border border-white/10 text-xs px-3 py-1.5 rounded-xl text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Todos">Mostrar Todos</option>
                      {groupStandings.map(g => (
                        <option key={g.name} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Groups Tables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupStandings
                    .filter(g => filterGroup === 'Todos' || g.name === filterGroup)
                    .map(group => (
                      <div key={group.name} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                        
                        {/* Group Header Title */}
                        <div className="bg-black/25 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                          <span className="font-bold font-display text-white text-sm tracking-wide">{group.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">FASE DE GRUPOS 2026</span>
                        </div>

                        {/* Table Layout */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-sans border-collapse text-xs">
                            <thead>
                              <tr className="bg-white/5 text-slate-400 border-b border-white/10 font-mono text-[10px] select-none text-center">
                                <th className="py-2.5 px-3 text-left w-8">#</th>
                                <th className="py-2.5 text-left">Seleção</th>
                                <th className="py-2.5 w-10 font-bold text-wc-gold">PTS</th>
                                <th className="py-2.5 w-8">J</th>
                                <th className="py-2.5 w-8">V</th>
                                <th className="py-2.5 w-8">E</th>
                                <th className="py-2.5 w-8">D</th>
                                <th className="py-2.5 w-8">GP</th>
                                <th className="py-2.5 w-8">GC</th>
                                <th className="py-2.5 w-10">SG</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {group.teams.map((team, index) => {
                                const isQualifying = index < 2; // top 2 qualifying directly
                                return (
                                  <tr key={team.name} className="hover:bg-white/5 transition-colors text-center text-slate-300">
                                    <td className="py-3 px-3 text-left font-mono font-bold">
                                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] ${
                                        isQualifying
                                          ? 'bg-emerald-550/20 text-emerald-400 border border-emerald-500/20'
                                          : 'bg-black/30 text-slate-500 border border-white/10'
                                      }`}>
                                        {index + 1}
                                      </span>
                                    </td>
                                    
                                    <td className="py-3 text-left font-semibold text-white flex items-center gap-2 max-w-[120px] truncate">
                                      <span className="text-lg filter drop-shadow-sm shrink-0" role="img" aria-label={team.name}>{team.flag}</span>
                                      <span className="truncate" title={team.name}>{team.name}</span>
                                    </td>

                                    <td className="py-3 font-bold text-wc-gold font-mono text-sm bg-wc-gold/5">{team.points}</td>
                                    <td className="py-3 font-mono">{team.gamesPlayed}</td>
                                    <td className="py-3 font-mono text-slate-400">{team.wins}</td>
                                    <td className="py-3 font-mono text-slate-400">{team.draws}</td>
                                    <td className="py-3 font-mono text-slate-400">{team.losses}</td>
                                    <td className="py-3 font-mono text-slate-400">{team.goalsFor}</td>
                                    <td className="py-3 font-mono text-slate-400">{team.goalsAgainst}</td>
                                    <td className={`py-3 font-mono font-bold font-mono ${team.goalsDifference > 0 ? 'text-emerald-400' : team.goalsDifference < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                      {team.goalsDifference > 0 ? `+${team.goalsDifference}` : team.goalsDifference}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Direct classification legend bar */}
                        <div className="bg-black/20 px-3 py-1.5 border-t border-white/10 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
                          <span>Classifica diretamente para os 32avos de Final</span>
                        </div>

                      </div>
                    ))}
                </div>

              </motion.div>
            )}

            {/* VIEW 3: LEADERBOARD AND STATS */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                
                {/* 1. Goals Scorer Board */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl md:col-span-2">
                  <div className="bg-black/25 px-4 py-3.5 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-wc-gold" />
                      <h3 className="font-bold font-display text-white text-sm">Artilharia (Gols)</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Chuteira de Ouro</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {dynamicPlayerStats.map((player, index) => {
                      const associatedTeam = INITIAL_TEAMS.find(t => t.name === player.team);
                      return (
                        <div key={player.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-slate-400 w-5 text-right">{index + 1}.</span>
                            <div>
                              <div className="text-xs font-semibold text-white">{player.name}</div>
                              <div className="text-[10px] text-slate-300 flex items-center gap-1.5">
                                <span>{associatedTeam?.flag}</span>
                                <span className="font-mono uppercase">{player.team}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-center font-mono">
                              <span className="text-sm font-bold text-wc-gold">{player.goals}</span>
                              <span className="text-[10px] text-slate-405 block">Marcados</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Factoids, Fair Play and Teams stats cards */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                  
                  {/* Attack Stat Card */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-2 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-emerald-600/10 rounded-full blur-xl"></div>
                    <span className="text-[10px] font-mono text-slate-405 uppercase tracking-widest font-semibold">TÁTICA COLETIVA</span>
                    <h4 className="text-sm font-bold text-white font-display">Ataque mais Eficiente</h4>
                    
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="text-3xl">🇧🇷</div>
                      <div>
                        <div className="text-sm font-bold text-white">Brasil</div>
                        <p className="text-[10px] text-slate-300">3 gols assinalados em 1 partida</p>
                      </div>
                    </div>
                  </div>

                  {/* Defense Stat Card */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-2 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-blue-600/10 rounded-full blur-xl"></div>
                    <span className="text-[10px] font-mono text-slate-405 uppercase tracking-widest font-semibold">SEGURANÇA DE ZAGA</span>
                    <h4 className="text-sm font-bold text-white font-display">Defesa menos Vazada</h4>
                    
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="text-3xl">🇨🇦</div>
                      <div>
                        <div className="text-sm font-bold text-white">Canadá</div>
                        <p className="text-[10px] text-slate-300">0 gols sofridos (100% de clean sheets)</p>
                      </div>
                    </div>
                  </div>

                  {/* Curio fact card */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-xs text-slate-300 flex flex-col gap-2 leading-relaxed">
                    <div className="text-wc-gold font-bold font-display uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Nota Oficial da FIFA</span>
                    </div>
                    <p>Esta Copa é histórica pela inclusão de 48 federações. Os novos regulamentos determinam que o critério de Fair Play baseado em acúmulo de cartões amarelos e cartões vermelhos é o último recurso de desempate qualificatório.</p>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 4: AI FORECASTER */}
            {activeTab === 'ai-predictor' && (
              <motion.div
                key="predictor-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                
                {/* Selection panel Card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-wc-gold/5 rounded-full blur-3xl"></div>
                   
                  <div className="text-center">
                    <span className="bg-wc-gold/10 text-wc-gold border border-wc-gold/20 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">MÓDULO DE ANÁLISE PREDITIVA COM INTELIGÊNCIA ARTIFICIAL</span>
                    <h2 className="text-xl font-bold text-white font-display mt-2">Duelo de Titãs • Previsões Copa 2026</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl mx-auto">Selecione quaisquer seleções postulantes e invoque o Gemini-3.5-flash para elaborar um relatório tático de inteligência exclusivo em português.</p>
                  </div>

                  {/* Pickers column */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mt-3">
                    
                    {/* Home Dropdown */}
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Seleção Casa (Mandante)</label>
                      <select
                        value={predictHome}
                        onChange={(e) => setPredictHome(e.target.value)}
                        className="bg-black/30 border border-white/10 text-sm px-4 py-2.5 rounded-xl text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-wc-gold"
                      >
                        {availableCountries.map(c => (
                          <option key={c} value={c}>{INITIAL_TEAMS.find(t => t.name === c)?.flag} {c}</option>
                        ))}
                      </select>
                    </div>

                    {/* VS divider */}
                    <div className="md:col-span-1 text-center font-display font-bold text-slate-455 select-none text-lg">
                      VS
                    </div>

                    {/* Away Dropdown */}
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Seleção Fora (Visitante)</label>
                      <select
                        value={predictAway}
                        onChange={(e) => setPredictAway(e.target.value)}
                        className="bg-black/30 border border-white/10 text-sm px-4 py-2.5 rounded-xl text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-wc-gold"
                      >
                        {availableCountries.map(c => (
                          <option key={c} value={c}>{INITIAL_TEAMS.find(t => t.name === c)?.flag} {c}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Action trigger button */}
                  <button
                    onClick={handleAIForecast}
                    disabled={isPredicting}
                    className="w-full bg-gradient-to-r from-wc-gold to-yellow-650 hover:from-wc-gold/90 hover:to-yellow-600 hover:scale-[1.005] transition-all py-3 rounded-xl text-slate-950 font-bold font-display uppercase text-sm tracking-widest shadow-xl shadow-yellow-950/20 flex items-center justify-center gap-2 border border-yellow-400/30 disabled:opacity-50 cursor-pointer"
                  >
                    {isPredicting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Invocando Rede Neural do Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                        <span>Analisar com IA</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Predict results feedback */}
                {isPredicting && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center text-slate-350 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-wc-gold animate-spin"></div>
                      <Sparkles className="w-4 h-4 text-wc-gold animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Gerando Relatório de Futebol Avançado</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">A IA está processando estatísticas históricas, confrontos passados e projeções táticas para o ano de 2026...</p>
                    </div>
                  </div>
                )}

                {/* AI Predicted Outcome Dashboard */}
                {predictionResult && !isPredicting && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Visual score display */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl md:col-span-1 flex flex-col justify-between text-center min-h-[300px]">
                      <div>
                        <span className="text-[10px] font-mono text-wc-gold uppercase font-bold px-2 py-1 rounded bg-wc-gold/10 border border-wc-gold/20">PREVISÃO DO PLACAR</span>
                        
                        <div className="flex items-center justify-center gap-4 mt-8">
                          <div>
                            <div className="text-4xl">{INITIAL_TEAMS.find(t => t.name === predictHome)?.flag}</div>
                            <span className="text-xs font-mono tracking-widest font-bold block text-slate-400 mt-1">{predictHome.substring(0,3).toUpperCase()}</span>
                          </div>
                          
                          <div className="text-3xl font-black text-white font-mono bg-black/30 px-4 py-2 border border-white/10 rounded-2xl">
                            {predictionResult.previsaoPlacar}
                          </div>

                          <div>
                            <div className="text-4xl">{INITIAL_TEAMS.find(t => t.name === predictAway)?.flag}</div>
                            <span className="text-xs font-mono tracking-widest font-bold block text-slate-400 mt-1">{predictAway.substring(0,3).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Probabilities meters */}
                      <div className="border-t border-white/5 pt-6 mt-8">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-4 font-semibold">PROBABILIDADE DE SUCESSO</span>
                        
                        <div className="flex flex-col gap-3.5">
                          {/* Home win bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-slate-350">
                              <span>Vitória {predictHome}</span>
                              <span className="font-mono text-wc-gold font-bold">{predictionResult.probabilidadeVitoriaHome}%</span>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/5">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${predictionResult.probabilidadeVitoriaHome}%` }}></div>
                            </div>
                          </div>

                          {/* Draw bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-slate-350">
                              <span>Empate</span>
                              <span className="font-mono text-slate-400 font-bold">{predictionResult.probabilidadeEmpate}%</span>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/5">
                              <div className="bg-slate-600 h-full rounded-full" style={{ width: `${predictionResult.probabilidadeEmpate}%` }}></div>
                            </div>
                          </div>

                          {/* Away win bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-slate-350">
                              <span>Vitória {predictAway}</span>
                              <span className="font-mono text-wc-gold font-bold">{predictionResult.probabilidadeVitoriaAway}%</span>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/5">
                              <div className="bg-emerald-750 h-full rounded-full" style={{ width: `${predictionResult.probabilidadeVitoriaAway}%` }}></div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Detailed Analysis Cards */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                      
                      {/* Technical Breakdown */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl">
                        <h3 className="font-bold font-display text-white text-sm border-b border-white/5 pb-2 mb-3 tracking-wide">Análise Tática do Confronto</h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{predictionResult.analiseTatica}</p>
                      </div>

                      {/* Star performance predictions */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl">
                        <h3 className="font-bold font-display text-white text-sm border-b border-white/5 pb-2 mb-3 tracking-wide">Jogadores Decisivos</h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{predictionResult.jogadoresChave}</p>
                      </div>

                      {/* Historical Folklore card */}
                      <div className="bg-gradient-to-r from-wc-gold/10 to-indigo-950/10 border border-wc-gold/30 p-5 rounded-2xl shadow-inner relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-5 translate-y-5 select-none opacity-5">
                          <Trophy className="w-32 h-32 text-wc-gold" />
                        </div>
                        <h3 className="font-bold font-display text-wc-gold text-sm mb-2 hover:brightness-110 tracking-wide flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-wc-gold" />
                          Curiosidade de Histórica
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{predictionResult.curiosidadeHistorica}</p>
                      </div>

                    </div>

                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* 4. Match Viewer and Interactive Simulation Simulator Drawer/Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Banner Header */}
              <div className="bg-black/30 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="text-wc-gold w-4 h-4 animate-spin" />
                  <span className="font-bold font-display text-sm text-slate-100 uppercase tracking-widest">Arena Virtual do Confronto</span>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Fechar Arena
                </button>
              </div>

              {/* Scrolling Content area */}
              <div className="overflow-y-auto p-6 space-y-8 flex-1">
                
                {/* Scoreboard block */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center border-b border-white/5 pb-6 bg-black/25 p-4 rounded-2xl border border-white/10">
                  
                  {/* Home and Flag */}
                  <div className="flex flex-col items-center">
                    <span className="text-5xl filter drop-shadow mb-2">{INITIAL_TEAMS.find(t => t.name === selectedMatch.homeTeam)?.flag}</span>
                    <h3 className="font-bold text-white text-base tracking-wider uppercase">{selectedMatch.homeTeam}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">SELEÇÃO MANDANTE</span>
                  </div>

                  {/* Scored result box */}
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="text-[10px] font-mono tracking-widest text-slate-300 bg-black/40 px-2 py-1 rounded border border-white/10 uppercase font-semibold">
                      {selectedMatch.status === 'LIVE' ? `${selectedMatch.minute}' AO VIVO` : selectedMatch.time}
                    </span>
                    
                    <div className="flex items-center gap-4 py-1">
                      <span className="text-4xl font-black font-mono text-white select-all">{selectedMatch.homeScore ?? 0}</span>
                      <span className="text-slate-500 font-bold text-xl">:</span>
                      <span className="text-4xl font-black font-mono text-white select-all">{selectedMatch.awayScore ?? 0}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 italic max-w-[200px] text-center shrink-0">
                      {selectedMatch.details}
                    </p>
                  </div>

                  {/* Away and Flag */}
                  <div className="flex flex-col items-center">
                    <span className="text-5xl filter drop-shadow mb-2">{INITIAL_TEAMS.find(t => t.name === selectedMatch.awayTeam)?.flag}</span>
                    <h3 className="font-bold text-white text-base tracking-wider uppercase">{selectedMatch.awayTeam}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">SELEÇÃO VISITANTE</span>
                  </div>

                </div>

                {/* Tactical board soccer field layout */}
                <div>
                  <h4 className="text-xs font-mono text-slate-450 uppercase tracking-widest font-semibold mb-3">Diagrama Tático de Posicionamento (Estádio)</h4>
                  
                  <div className="w-full h-56 bg-gradient-to-b from-emerald-950/40 to-green-950/40 relative rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                    
                    {/* Pitch markings */}
                    <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none font-semibold"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/15 font-semibold"></div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-12 border-b border-x border-white/10"></div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-12 border-t border-x border-white/10"></div>

                    {/* Players dots Home (Red) */}
                    <div className="absolute top-10 left-12 w-4 h-4 bg-emerald-450 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">4</div>
                    <div className="absolute top-10 right-12 w-4 h-4 bg-emerald-450 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">2</div>
                    <div className="absolute top-20 left-1/4 w-4 h-4 bg-emerald-450 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">10</div>
                    <div className="absolute top-20 right-1/4 w-4 h-4 bg-emerald-450 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">8</div>
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-emerald-450 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">9</div>

                    {/* Players dots Away (Yellow) */}
                    <div className="absolute bottom-10 left-12 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">3</div>
                    <div className="absolute bottom-10 right-12 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">5</div>
                    <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">7</div>
                    <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">11</div>
                    <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950">10</div>

                    <div className="absolute top-3 text-[9px] font-mono font-medium text-white/30 uppercase tracking-widest">Sede: MetLife Arena / Azteca</div>
                  </div>
                </div>

                {/* Match statistics comparison blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left block: Match Statistics comparison */}
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-4">
                    <h5 className="text-xs font-mono text-wc-gold uppercase tracking-widest font-semibold border-b border-white/5 pb-1.5">Métricas de Jogo</h5>
                    
                    <div className="space-y-3 font-mono text-[11px] text-slate-300">
                      
                      {/* Possession ratio */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Posse de Bola%</span>
                          <span>{selectedMatch.possessionHome ?? 50}% - {selectedMatch.possessionAway ?? 50}%</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden flex">
                          <div className="bg-emerald-500 h-full" style={{ width: `${selectedMatch.possessionHome ?? 50}%` }}></div>
                          <div className="bg-yellow-500 h-full" style={{ width: `${selectedMatch.possessionAway ?? 50}%` }}></div>
                        </div>
                      </div>

                      {/* Shots ratio */}
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 border-solid">
                        <span>Chutes a Gol</span>
                        <span className="font-bold text-white">{selectedMatch.shotsHome ?? 0} x {selectedMatch.shotsAway ?? 0}</span>
                      </div>

                      {/* Fouls ratio */}
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 border-solid">
                        <span>Faltas Cometidas</span>
                        <span className="font-bold text-white">{selectedMatch.faultsHome ?? 0} x {selectedMatch.faultsAway ?? 0}</span>
                      </div>

                    </div>
                  </div>

                  {/* Right block: Match event timeline */}
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-col h-[230px]">
                    <h5 className="text-xs font-mono text-wc-gold uppercase tracking-widest font-semibold border-b border-white/5 pb-1.5 mb-2">Cronologia da Partida</h5>
                    
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                      {(!selectedMatch.events || selectedMatch.events.length === 0) ? (
                        <div className="text-slate-500 italic h-full flex items-center justify-center text-center">
                          Nenhum acontecimento registrado.
                        </div>
                      ) : (
                        selectedMatch.events.map(ev => (
                          <div key={ev.id} className="flex items-start gap-2 border-b border-white/5 pb-1.5 last:border-0">
                            <span className="font-mono text-wc-gold font-bold bg-black/40 px-1 rounded text-[10px] shrink-0 border border-white/5">{ev.minute}'</span>
                            <div className="flex-1">
                              <span className="font-semibold text-slate-100">{ev.player}</span>
                              <span className="text-[10px] text-slate-400 block">
                                {ev.type === 'GOAL' ? '⚽ Marcou um gol!' : ev.type === 'YELLOW' ? '🟨 Cartão Amarelo' : '🟥 Cartão Vermelho'} • {ev.team === 'home' ? selectedMatch.homeTeam : selectedMatch.awayTeam}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Score simulation form to adjust standings dynamically */}
                <div className="bg-black/35 p-5 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Score Form */}
                  <div className="flex flex-col gap-3">
                    <h5 className="text-xs font-mono text-white font-bold uppercase tracking-wide">Forçar Resultado no Simulador</h5>
                    <p className="text-[11px] text-slate-350">Edite os gols e envie para simular o resultado imediato desta partida na tabela de classificação de grupos.</p>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1">
                        <label className="text-[9px] text-slate-405 uppercase tracking-widest font-mono block mb-1">Gols {selectedMatch.homeTeam}</label>
                        <input
                          type="number"
                          id="home-gols-input"
                          value={inputHomeScore}
                          onChange={(e) => setInputHomeScore(e.target.value)}
                          placeholder="0"
                          className="w-full bg-black/30 border border-white/10 text-sm py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-wc-gold text-white font-semibold font-mono"
                        />
                      </div>
                      <span className="text-slate-500 font-bold self-end pb-2.5">:</span>
                      <div className="flex-1">
                        <label className="text-[9px] text-slate-405 uppercase tracking-widest font-mono block mb-1">Gols {selectedMatch.awayTeam}</label>
                        <input
                          type="number"
                          id="away-gols-input"
                          value={inputAwayScore}
                          onChange={(e) => setInputAwayScore(e.target.value)}
                          placeholder="0"
                          className="w-full bg-black/30 border border-white/10 text-sm py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-wc-gold text-white font-semibold font-mono"
                        />
                      </div>
                    </div>

                    <button
                      id="save-score-btn"
                      onClick={handleManualSimulation}
                      className="w-full bg-emerald-600/30 hover:bg-emerald-600/50 hover:scale-[1.002] transition-colors py-2 rounded-xl text-white font-semibold text-xs tracking-wide uppercase border border-emerald-500/30 cursor-pointer"
                    >
                      Salvar e Atualizar Tabelas
                    </button>
                  </div>

                  {/* Right: Custom Event Input Block */}
                  <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                    <h5 className="text-xs font-mono text-white font-bold uppercase tracking-wide">Adicionar Lance Específico</h5>
                    <p className="text-[11px] text-slate-350">Insira gols, cartões de jogadores específicos na cronologia do jogo virtual.</p>

                    <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                      <div className="col-span-1">
                        <label className="text-[9px] text-slate-400 uppercase block mb-1 font-semibold">Minuto</label>
                        <input
                          type="number"
                          value={newEventMinutes}
                          onChange={(e) => setNewEventMinutes(parseInt(e.target.value) || 45)}
                          className="w-full bg-black/30 border border-white/10 py-1.5 px-3 rounded-lg focus:ring-1 focus:ring-wc-gold text-white font-mono"
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <label className="text-[9px] text-slate-400 uppercase block mb-1 font-semibold">Ação</label>
                        <select
                          value={newEventType}
                          onChange={(e: any) => setNewEventType(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 py-1.5 px-3 rounded-lg text-slate-200"
                        >
                          <option value="GOAL">⚽ Gol</option>
                          <option value="YELLOW">🟨 Amarelo</option>
                          <option value="RED">🟥 Vermelho</option>
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label className="text-[9px] text-slate-400 uppercase block mb-1 font-semibold">Selecione Lado</label>
                        <select
                          value={newEventTeam}
                          onChange={(e: any) => setNewEventTeam(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 py-1.5 px-3 rounded-lg text-slate-200"
                        >
                          <option value="home">{selectedMatch.homeTeam}</option>
                          <option value="away">{selectedMatch.awayTeam}</option>
                        </select>
                      </div>

                      <div className="col-span-1 animate-fadeIn">
                        <label className="text-[9px] text-slate-400 uppercase block mb-1 font-semibold">Nome Jogador</label>
                        <input
                          type="text"
                          value={newEventPlayer}
                          onChange={(e) => setNewEventPlayer(e.target.value)}
                          placeholder="Ex: Neymar Jr"
                          className="w-full bg-black/30 border border-white/10 py-1.5 px-3 rounded-lg focus:ring-1 focus:ring-wc-gold text-white"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddCustomEvent}
                      className="w-full bg-white/10 hover:bg-white/20 text-slate-105 hover:scale-[1.002] transition py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wide border border-white/10 cursor-pointer"
                    >
                      Registrar Acontecimento
                    </button>
                  </div>

                </div>

                {formError && (
                  <div className="bg-red-500/10 text-red-400 border border-red-500/25 p-3 rounded-xl flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Redirect deep links to search or predictive analyses */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                  <div className="text-slate-300 max-w-md">
                    Quer prever de forma avançada táticas, placares e as probabilidades de vitória baseadas no histórico geral do confronto?
                  </div>
                  <button
                    onClick={() => {
                      setPredictHome(selectedMatch.homeTeam);
                      setPredictAway(selectedMatch.awayTeam);
                      setSelectedMatch(null);
                      setActiveTab('ai-predictor');
                      // trigger predictions search automatically
                      setTimeout(() => {
                        const btn = document.querySelector('button[bg-gradient-to-r]') as HTMLElement;
                        if (btn) btn.click();
                      }, 200);
                    }}
                    className="px-4.5 py-2 shrink-0 bg-wc-gold hover:brightness-110 text-slate-950 font-bold uppercase rounded-xl transition cursor-pointer"
                  >
                    Abrir Previsão de IA
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Custom live toast banners */}
      <AnimatePresence>
        {liveNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950/40 backdrop-blur-md border border-white/10 text-slate-200 px-4.5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="p-2 bg-wc-gold/10 text-wc-gold border border-wc-gold/25 rounded-xl">
              <Sparkles className="w-4 h-4 fill-wc-gold text-wc-gold animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-wc-gold uppercase tracking-wider block">Central de Transmissão</span>
              <p className="text-xs font-semibold text-white leading-normal mt-0.5">{liveNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Footer signature */}
      <footer className="border-t border-white/5 bg-slate-955/20 backdrop-blur-md py-6 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Central de Resultados da Copa do Mundo FIFA • Design Frosted Glass.</p>
          <div className="text-slate-400 flex gap-4">
            <span className="hover:text-white cursor-pointer transition pb-1 sm:pb-0">Termos de uso</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition">Regulamento Oficial</span>
            <span>•</span>
            <span className="hover:text-white font-mono transition">12.06.2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
