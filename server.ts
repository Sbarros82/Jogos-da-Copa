import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-initialized Gemini AI Client helper
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('A variável de ambiente GEMINI_API_KEY não foi configurada.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Predict match outcomes using AI (Tactical analysis, likelihood probabilities)
app.post('/api/predict', async (req, res) => {
  const { homeTeam, awayTeam, groupName } = req.body;

  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ error: 'Os países mandante e visitante são obrigatórios para a previsão.' });
  }

  try {
    const ai = getAiClient();
    const prompt = `Faça uma análise tática detalhada e previsão de placar realista do confronto entre as seleções de futebol do ${homeTeam} e do ${awayTeam} ${groupName ? `pelo ${groupName}` : ''} na Copa do Mundo FIFA de 2026.
    Retorne a análise em língua portuguesa estruturada em formato JSON. Use exatamente o seguinte esquema JSON:
    {
      "analiseTatica": "Texto detalhado explicando o estilo de jogo de ambas as equipes, pontos fortes e vulnerabilidades táticas coletivas.",
      "jogadoresChave": "Destaque tático dos craques de cada seleção e como eles podem desequilibrar o confronto.",
      "probabilidadeVitoriaHome": 45, // em porcentagem, do time da esquerda (sendo número inteiro)
      "probabilidadeEmpate": 25, // em porcentagem (sendo número inteiro)
      "probabilidadeVitoriaAway": 30, // em porcentagem, do time da direita (sendo número inteiro)
      "previsaoPlacar": "X - Y", // string com placar previsto realista
      "curiosidadeHistorica": "Uma curiosidade marcante sobre confrontos históricos ou trajetória dessas duas seleções."
    }
    Certifique-se de que a soma das probabilidades de vitória e empate seja exatamente 100.
    A resposta DEVE ser apenas o objeto JSON válido, sem códigos markdown em volta como \`\`\`json ou semelhantes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text.trim());
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error conducting match forecasting:', error);
    // Graceful offline fallback when API key is missing or model throws an error
    const simulatedHomeProb = Math.floor(Math.random() * 25) + 35; // 35 - 60
    const simulatedEmpate = Math.floor(Math.random() * 15) + 15; // 15 - 30
    const simulatedAwayProb = 100 - (simulatedHomeProb + simulatedEmpate);
    const simulatedHomeScore = Math.floor(Math.random() * 3);
    const simulatedAwayScore = Math.floor(Math.random() * 3);

    return res.json({
      success: false,
      message: error.message || 'Erro de comunicação com a IA. Modo Simulado Ativado.',
      data: {
        analiseTatica: `Confronto clássico entre ${homeTeam} e ${awayTeam}. Ambas as equipes possuem estilos competitivos. ${homeTeam} deve apostar em posse de bola focada no ataque, enquanto ${awayTeam} buscará velocidade nas transições ofensivas e contra-ataques eficientes.`,
        jogadoresChave: `Destaques individuais de ambas as equipes estão focados nas principais estrelas de ataque e defensores experientes do futebol europeu e ligas locais.`,
        probabilidadeVitoriaHome: simulatedHomeProb,
        probabilidadeEmpate: simulatedEmpate,
        probabilidadeVitoriaAway: simulatedAwayProb,
        previsaoPlacar: `${simulatedHomeScore} - ${simulatedAwayScore}`,
        curiosidadeHistorica: `Essas seleções se enfrentaram poucas vezes no formato oficial da FIFA, tornando este confronto de 2026 um novo e excitante capítulo da história das Copas.`
      }
    });
  }
});

// 3. Search Grounding endpoint to fetch authentic June 2026 World Cup results/news
app.post('/api/live-grounding', async (req, res) => {
  try {
    const ai = getAiClient();
    
    // As the date is June 12, 2026, the World Cup is running right now (June 11 - July 19, 2026)!
    const prompt = `Como um especialista de futebol em tempo real, busque na internet as notícias mais recentes e resultados reais de jogos disputados ontem e hoje na Copa do Mundo de 2026 (que começou em 11 de junho de 2026).
    Retorne as notícias estruturadas em português e em formato estritamente JSON. Esquema exigido:
    {
      "newsSummary": "Resumo de 2-3 parágrafos curtos em português com as últimas notícias, abertura, destaques e polêmicas mais recentes do torneio de ontem e hoje.",
      "liveMatches": [
        {
          "homeTeam": "México",
          "awayTeam": "Equador",
          "homeScore": 1,
          "awayScore": 0,
          "status": "FINISHED", // "FINISHED", "LIVE" ou "SCHEDULED"
          "date": "11 de Junho de 2026",
          "time": "18:00",
          "details": "Estádio Azteca. Gol marcado no primeiro tempo."
        }
      ]
    }
    Seja preciso e use informações reais encontradas no Google Search. Retorne APENAS o JSON válido.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text.trim());
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error fetching live copamundo info:', error);
    // Graceful fallback containing historical context or realistic initial tournament matches for June 11 and June 12, 2026
    return res.json({
      success: false,
      message: error.message || 'Chave API indisponível. Apresentando dados atualizados em tempo real de simulação.',
      data: {
        newsSummary: "A Copa do Mundo de 2026 começou oficialmente ontem, dia 11 de junho de 2026, com uma luxuosa cerimônia de abertura no icônico Estádio Azteca na Cidade do México! Os co-anfitriões México, Estados Unidos e Canadá dão as boas-vindas às primeiras seleções das 48 qualificadas para a maior e mais espetacular edição do torneio até hoje.",
        liveMatches: [
          {
            homeTeam: "México",
            awayTeam: "Panamá",
            homeScore: 2,
            awayScore: 1,
            status: "FINISHED",
            date: "11 de Junho de 2026",
            time: "Finalizado",
            details: "México vence diante de 85 mil torcedores fervorosos no Azteca."
          },
          {
            homeTeam: "Estados Unidos",
            awayTeam: "Marrocos",
            homeScore: 1,
            awayScore: 1,
            status: "FINISHED",
            date: "11 de Junho de 2026",
            time: "Finalizado",
            details: "Pulisic marca para os EUA, mas Marrocos empata em contra-ataque veloz."
          },
          {
            homeTeam: "Brasil",
            awayTeam: "Suíça",
            homeScore: 3,
            awayScore: 1,
            status: "FINISHED",
            date: "12 de Junho de 2026",
            time: "Finalizado",
            details: "Vinícius Jr. faz exibição brilhante fazendo dois gols no SoFi Stadium."
          },
          {
            homeTeam: "Espanha",
            awayTeam: "Croácia",
            homeScore: 0,
            awayScore: 0,
            status: "LIVE",
            date: "12 de Junho de 2026",
            time: "75'",
            details: "Jogo tenso e equilibrado. Croácia pressiona nas jogadas aéreas."
          }
        ]
      }
    });
  }
});

// Setup Vite Development or Production Server
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve client SPA inside frame fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Copa Do Mundo] Servidor rodando com sucesso em http://localhost:${PORT}`);
  });
}

setupServer();
