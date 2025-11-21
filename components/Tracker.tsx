import React, { useState, useMemo } from 'react';
import { X, Save, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { EMOTIONS_LIST, COGNITIVE_DISTORTIONS, EMOTION_CATEGORIES } from '../constants';
import { Entry, Emotion, ContextFactor, ThoughtRecord } from '../types';
import { LiquidCard } from './ui/LiquidCard';
import { Button } from './ui/Button';
import { saveEntry } from '../services/storageService';

interface Props {
  onComplete: () => void;
}

export const Tracker: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [context, setContext] = useState<ContextFactor[]>([]);
  const [thought, setThought] = useState<Partial<ThoughtRecord>>({ distortions: [] });
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  const filteredEmotions = useMemo(() => {
    if (activeCategory === 'Todos') return EMOTIONS_LIST;
    return EMOTIONS_LIST.filter(e => e.category === activeCategory);
  }, [activeCategory]);

  const handleEmotionToggle = (emo: { name: string, emoji: string, color: string, category: string }) => {
    const existing = selectedEmotions.find(e => e.name === emo.name);
    if (existing) {
      setSelectedEmotions(prev => prev.filter(e => e.name !== emo.name));
    } else {
      setSelectedEmotions(prev => [...prev, { ...emo, id: Date.now().toString(), intensity: 50 }]);
    }
  };

  const updateIntensity = (name: string, val: number) => {
    setSelectedEmotions(prev => prev.map(e => e.name === name ? { ...e, intensity: val } : e));
  };

  const handleSave = () => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      emotions: selectedEmotions,
      context: context,
      thoughts: thought.automaticThought ? thought as ThoughtRecord : undefined,
    };
    saveEntry(newEntry);
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-32 animate-fade-in">
      
      {/* Step 1: Emotions */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Como você está?</h2>
            <p className="text-gray-500 dark:text-gray-400">Selecione tudo o que se aplica</p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar-mobile">
            {EMOTION_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${activeCategory === cat 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                    : 'bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/60'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 h-80 overflow-y-auto pr-2 custom-scrollbar">
            {filteredEmotions.map(emo => {
              const isSelected = selectedEmotions.find(e => e.name === emo.name);
              return (
                <button
                  key={emo.name}
                  onClick={() => handleEmotionToggle(emo)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200
                    ${isSelected 
                      ? 'bg-white dark:bg-gray-800 shadow-lg scale-95 ring-2 ring-indigo-500' 
                      : 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10'}
                  `}
                >
                  <span className="text-3xl mb-2 filter drop-shadow-sm">{emo.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{emo.name}</span>
                </button>
              );
            })}
          </div>

          {selectedEmotions.length > 0 && (
            <div className="space-y-4 mt-6 animate-slide-up">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Ajustar Intensidade</h3>
              {selectedEmotions.map(emo => (
                <LiquidCard key={emo.name} className="!p-4">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{emo.emoji}</span>
                      <span className="font-bold dark:text-white">{emo.name}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{emo.intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={emo.intensity}
                    onChange={(e) => updateIntensity(emo.name, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </LiquidCard>
              ))}
              <Button fullWidth onClick={() => setStep(2)}>
                Próximo: Contexto <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Context */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
           <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">O que está acontecendo?</h2>
            <p className="text-gray-500 dark:text-gray-400">Adicione contexto aos seus sentimentos</p>
          </div>
          
          <LiquidCard className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Local</label>
              <div className="flex gap-2 flex-wrap">
                {['Casa', 'Trabalho', 'Escola', 'Social', 'Transporte', 'Natureza', 'Cama'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setContext([...context, { id: Date.now().toString(), type: 'location', name: loc }])}
                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
             <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Atividade Específica</label>
              <div className="relative">
                <input 
                    type="text" 
                    placeholder="Ex: Apresentação no trabalho..."
                    className="w-full p-4 bg-gray-50 dark:bg-black/30 rounded-2xl border border-transparent focus:border-indigo-500 focus:ring-0 dark:text-white placeholder-gray-400 transition-all"
                    onBlur={(e) => {
                        if(e.target.value) {
                            setContext([...context, { id: Date.now().toString(), type: 'activity', name: e.target.value }]);
                            e.target.value = '';
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                             setContext([...context, { id: Date.now().toString(), type: 'activity', name: e.currentTarget.value }]);
                             e.currentTarget.value = '';
                        }
                    }}
                />
              </div>
            </div>
            
            {context.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-white/10">
                    {context.map((c, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                            {c.name} 
                            <button 
                                onClick={() => setContext(context.filter((_, i) => i !== idx))}
                                className="p-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-md"
                            >
                                <X size={12}/>
                            </button>
                        </span>
                    ))}
                </div>
            )}
          </LiquidCard>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
            <Button onClick={() => setStep(3)} className="flex-1">Próximo: Pensamentos</Button>
          </div>
        </div>
      )}

      {/* Step 3: Thoughts (Rating Removed) */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Toques Finais</h2>
            <p className="text-gray-500 dark:text-gray-400">Pensamentos Automáticos (Opcional)</p>
          </div>

          <LiquidCard className="space-y-4">
            <textarea
              placeholder="Estou me sentindo assim porque..."
              className="w-full h-28 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-0 resize-none dark:text-white"
              value={thought.automaticThought || ''}
              onChange={(e) => setThought({ ...thought, automaticThought: e.target.value })}
            />
            
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Possíveis Distorções</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-32 overflow-y-auto custom-scrollbar pr-1">
                {COGNITIVE_DISTORTIONS.map(d => {
                   const isActive = thought.distortions?.includes(d.id);
                   return (
                    <button
                        key={d.id}
                        onClick={() => {
                            const current = thought.distortions || [];
                            setThought({
                                ...thought,
                                distortions: isActive ? current.filter(id => id !== d.id) : [...current, d.id]
                            })
                        }}
                        className={`px-3 py-2 text-sm rounded-xl border transition-all text-left
                            ${isActive 
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' 
                                : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}
                        `}
                    >
                        <span className="font-medium block">{d.name}</span>
                    </button>
                   )
                })}
              </div>
            </div>
          </LiquidCard>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
            <Button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                <Save size={18} /> Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};