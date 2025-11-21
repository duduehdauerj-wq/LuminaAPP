import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { Entry } from '../types';
import { LiquidCard } from './ui/LiquidCard';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  entries: Entry[];
}

type Tab = 'overview' | 'patterns' | 'history';

export const Analytics: React.FC<Props> = ({ entries }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // --- DATA PROCESSING ---

  const moodOverTime = useMemo(() => {
    if (entries.length === 0) return [];
    return [...entries].reverse().map(e => {
      const dominant = e.emotions.reduce((prev, current) => (prev.intensity > current.intensity) ? prev : current, e.emotions[0]);
      return {
        date: new Date(e.timestamp).toLocaleDateString('pt-BR', { weekday: 'short', hour: 'numeric' }),
        intensity: dominant?.intensity || 0,
        mood: dominant?.name || 'Neutro'
      };
    });
  }, [entries]);

  const moodDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(e => {
        e.emotions.forEach(em => {
            if(!counts[em.name]) counts[em.name] = 0;
            counts[em.name] += 1;
        })
    });
    return Object.keys(counts).map(key => ({ subject: key, A: counts[key], fullMark: entries.length }));
  }, [entries]);

  const contextCorrelation = useMemo(() => {
      const contextData: Record<string, { totalIntensity: number, count: number }> = {};
      entries.forEach(e => {
          const maxIntensity = Math.max(...e.emotions.map(em => em.intensity), 0);
          e.context.forEach(c => {
              if (!contextData[c.name]) contextData[c.name] = { totalIntensity: 0, count: 0 };
              contextData[c.name].totalIntensity += maxIntensity;
              contextData[c.name].count += 1;
          });
      });
      return Object.keys(contextData)
        .map(k => ({ name: k, avgIntensity: Math.round(contextData[k].totalIntensity / contextData[k].count) }))
        .sort((a, b) => b.avgIntensity - a.avgIntensity)
        .slice(0, 7); // Top 7
  }, [entries]);

  const hourlyBreakdown = useMemo(() => {
      const hours = Array(24).fill(0);
      entries.forEach(e => {
          const h = new Date(e.timestamp).getHours();
          hours[h] += 1;
      });
      return hours.map((count, hour) => ({
          hour: `${hour}:00`,
          entries: count
      }));
  }, [entries]);

  const weeklySummary = useMemo(() => {
      if (entries.length === 0) return [];
      const end = new Date();
      const start = startOfWeek(end, { weekStartsOn: 1 }); // Monday start
      const days = eachDayOfInterval({ start, end: endOfWeek(end, { weekStartsOn: 1 }) });

      return days.map(day => {
          const dayEntries = entries.filter(e => isSameDay(new Date(e.timestamp), day));
          const dominantEmotion = dayEntries.length > 0 ? dayEntries[0].emotions[0]?.emoji : '-';
          
          return {
              day: format(day, 'EEE', { locale: ptBR }),
              date: format(day, 'd'),
              count: dayEntries.length,
              icon: dominantEmotion
          }
      });
  }, [entries]);

  // --- RENDER ---

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Sem dados ainda. Comece a registrar para ver estatísticas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32 animate-fade-in">
      <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Análises</h2>
          <div className="flex gap-1 bg-gray-200 dark:bg-white/10 p-1 rounded-lg">
              {[
                { id: 'overview', label: 'Resumo' },
                { id: 'patterns', label: 'Padrões' },
                { id: 'history', label: 'Histórico' }
              ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setActiveTab(t.id as Tab)}
                    className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${activeTab === t.id ? 'bg-white dark:bg-gray-800 shadow text-indigo-600' : 'text-gray-500'}`}
                  >
                      {t.label}
                  </button>
              ))}
          </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <LiquidCard className="h-72">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">Linha do Tempo de Intensidade</h3>
                <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={moodOverTime}>
                    <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="intensity" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIntensity)" />
                </AreaChart>
                </ResponsiveContainer>
            </LiquidCard>

            <div className="grid grid-cols-1 gap-6">
                <LiquidCard>
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Resumo da Semana</h3>
                    <div className="grid grid-cols-7 gap-1">
                        {weeklySummary.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400 uppercase">{day.day}</span>
                                <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-lg ${day.count > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20' : 'bg-gray-50 dark:bg-white/5'}`}>
                                    {day.icon}
                                </div>
                            </div>
                        ))}
                    </div>
                </LiquidCard>
            </div>
          </div>
      )}

      {/* PATTERNS TAB */}
      {activeTab === 'patterns' && (
          <div className="space-y-6 animate-fade-in">
              <LiquidCard className="h-80">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Radar Emocional</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={moodDistribution}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    <Radar
                        name="Frequência"
                        dataKey="A"
                        stroke="#ec4899"
                        strokeWidth={2}
                        fill="#ec4899"
                        fillOpacity={0.4}
                    />
                    </RadarChart>
                </ResponsiveContainer>
            </LiquidCard>

            <LiquidCard className="h-72">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Contextos de Alta Intensidade</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={contextCorrelation} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px' }} />
                        <Bar dataKey="avgIntensity" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </LiquidCard>

             <LiquidCard className="h-64">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Atividade por Horário</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={hourlyBreakdown}>
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                         <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px' }} />
                        <Bar dataKey="entries" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </LiquidCard>
          </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
          <div className="animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500">Histórico Completo</h3>
                <span className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-full">{entries.length} Registros</span>
              </div>
              
              <LiquidCard className="!p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 dark:bg-white/5">
                              <tr>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500 whitespace-nowrap">Data & Hora</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500 whitespace-nowrap">Emoção</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500 whitespace-nowrap">Contexto</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500 whitespace-nowrap">Nota</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                              {[...entries].reverse().map(entry => (
                                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                      <td className="p-4 text-sm dark:text-gray-300 whitespace-nowrap">
                                          <div className="font-medium">{new Date(entry.timestamp).toLocaleDateString()}</div>
                                          <div className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="flex items-center gap-2">
                                              <span className="text-lg">{entry.emotions[0]?.emoji}</span>
                                              <span className="text-sm font-medium dark:text-white">{entry.emotions[0]?.name}</span>
                                              <span className="text-xs text-gray-400">({entry.emotions[0]?.intensity}%)</span>
                                          </div>
                                      </td>
                                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                                          {entry.context.map(c => c.name).join(', ')}
                                      </td>
                                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                                          {entry.thoughts?.automaticThought || '-'}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </LiquidCard>
          </div>
      )}
    </div>
  );
};