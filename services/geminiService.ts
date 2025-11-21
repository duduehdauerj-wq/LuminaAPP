import { GoogleGenAI } from "@google/genai";
import { Entry } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateInsights = async (entries: Entry[]) => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return "Insights de IA indisponíveis. Verifique a API Key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare a summary of the last 10 entries to save tokens
    const recentEntries = entries.slice(0, 10).map(e => ({
      date: new Date(e.timestamp).toLocaleDateString('pt-BR'),
      emotions: e.emotions.map(em => `${em.name} (${em.intensity}%)`).join(', '),
      context: e.context.map(c => c.name).join(', '),
      thoughts: e.thoughts?.automaticThought || 'Nenhum'
    }));

    const prompt = `
      Analise estas entradas recentes de um diário emocional (TCC).
      Entradas: ${JSON.stringify(recentEntries)}
      
      Forneça 3 insights concisos em tópicos (bullets) focados em:
      1. Padrões de humor ou gatilhos identificados.
      2. Uma distorção cognitiva específica notada (se houver) ou um ponto forte.
      3. Uma breve sugestão comportamental prática para as próximas 24 horas.
      
      Mantenha o tom acolhedor, profissional e minimalista. Responda em Português do Brasil. Não use formatação markdown excessiva.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Não foi possível gerar insights no momento. Tente novamente mais tarde.";
  }
};