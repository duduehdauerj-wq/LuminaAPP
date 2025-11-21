import React, { useEffect, useState } from 'react';
import { Home, BarChart2, PlusCircle, Coffee, Settings, Sparkles, X, Camera } from 'lucide-react';
import { Entry, Habit, ViewState, UserSettings } from './types';
import { getEntries, getHabits, getSettings, saveSettings } from './services/storageService';
import { generateInsights } from './services/geminiService';
import { DEFAULT_HABITS } from './constants';

// Components
import { Tracker } from './components/Tracker';
import { Analytics } from './components/Analytics';
import { Habits } from './components/Habits';
import { Tools } from './components/Tools';
import { LiquidCard } from './components/ui/LiquidCard';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // User Settings State
  const [userSettings, setUserSettings] = useState<UserSettings>({ name: 'User', theme: 'system', avatar: '' });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');

  useEffect(() => {
    // Initial Load
    setEntries(getEntries());
    const loadedHabits = getHabits();
    setHabits(loadedHabits.length ? loadedHabits : DEFAULT_HABITS);
    
    const settings = getSettings();
    setUserSettings(settings);
    
    // Dark Mode Logic
    if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark');
    const newSettings = { ...userSettings, theme: newMode ? 'dark' : 'light' } as UserSettings;
    setUserSettings(newSettings);
    saveSettings(newSettings);
  };

  const refreshData = () => {
    setEntries(getEntries());
    setView('dashboard');
  };

  const handleAIAnalysis = async () => {
    setLoadingInsight(true);
    const result = await generateInsights(entries);
    setInsight(result);
    setLoadingInsight(false);
  };

  const openProfileModal = () => {
      setTempName(userSettings.name);
      setTempAvatar(userSettings.avatar || 'https://picsum.photos/id/64/200/200');
      setIsProfileModalOpen(true);
  }

  const saveProfile = () => {
      const newSettings = { ...userSettings, name: tempName, avatar: tempAvatar };
      setUserSettings(newSettings);
      saveSettings(newSettings);
      setIsProfileModalOpen(false);
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 pb-20 transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header / Top Bar */}
      <header className="sticky top-0 z-20 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Lumina
        </h1>
        <button onClick={openProfileModal} className="group relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500 transition-all">
                <img 
                    src={userSettings.avatar || `https://picsum.photos/id/64/200/200`} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                />
            </div>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-3xl mx-auto pt-6">
        
        {view === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Welcome Card */}
            <div className="mb-8 px-2">
                <h2 className="text-4xl font-light dark:text-white mb-2 tracking-tight">Olá, <span className="font-semibold">{userSettings.name}.</span></h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Pronto para ter clareza hoje?</p>
            </div>

            {/* AI Insight Pill */}
            <LiquidCard className="!bg-gradient-to-r !from-indigo-500/5 !to-purple-500/5 !border-indigo-500/20">
               <div className="flex items-start gap-4">
                 <div className="mt-1 p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/30"><Sparkles size={20} /></div>
                 <div className="flex-1">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">Insight Diário</h3>
                    {loadingInsight ? (
                        <div className="flex space-x-1 pt-2">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    ) : insight ? (
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{insight}</div>
                    ) : (
                        <div className="flex flex-col items-start gap-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Seus padrões são únicos. Deixe a IA analisar seus registros recentes para fornecer sugestões personalizadas.
                            </p>
                            <button onClick={handleAIAnalysis} className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                                GERAR AGORA
                            </button>
                        </div>
                    )}
                 </div>
               </div>
            </LiquidCard>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4">
               <LiquidCard className="flex flex-col items-center justify-center !py-8 gap-3 group" onClick={() => setView('track')}>
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                     <PlusCircle size={28} />
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">Novo Registro</span>
               </LiquidCard>
               <LiquidCard className="flex flex-col items-center justify-center !py-8 gap-3">
                   <span className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter">{entries.length}</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total de Registros</span>
               </LiquidCard>
            </div>

            <h3 className="font-bold text-lg mt-8 px-2 dark:text-white">Atividade Recente</h3>
            {entries.length === 0 ? (
                 <p className="text-center text-gray-400 py-10 italic">Sem registros. Toque em "Novo Registro" para começar.</p>
            ) : (
                <div className="space-y-3">
                    {entries.slice(0, 5).map(entry => (
                        <LiquidCard key={entry.id} className="!p-4 flex items-center gap-4 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <div className="text-3xl filter drop-shadow-md">{entry.emotions[0]?.emoji}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-gray-800 dark:text-gray-100 truncate">{entry.emotions[0]?.name}</span>
                                    <span className="text-xs font-mono text-gray-400">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                    {entry.context.map(c => c.name).join(', ')}
                                </div>
                            </div>
                            <div className={`w-1.5 h-8 rounded-full opacity-80`} style={{ backgroundColor: entry.emotions[0]?.color }}></div>
                        </LiquidCard>
                    ))}
                </div>
            )}
          </div>
        )}

        {view === 'track' && <Tracker onComplete={refreshData} />}
        {view === 'analytics' && <Analytics entries={entries} />}
        {view === 'habits' && <Habits habits={habits} setHabits={setHabits} />}
        {view === 'tools' && <Tools entries={entries} toggleTheme={toggleTheme} isDark={isDark} />}

      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
              <LiquidCard className="w-full max-w-sm !p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold dark:text-white">Editar Perfil</h3>
                      <button onClick={() => setIsProfileModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><X size={20}/></button>
                  </div>
                  
                  <div className="flex flex-col items-center mb-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-4 border-white dark:border-gray-800 shadow-lg relative group">
                           <img src={tempAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-gray-400">Insira a URL de uma imagem abaixo</p>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome de Exibição</label>
                          <input 
                            type="text" 
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">URL do Avatar</label>
                          <input 
                            type="text" 
                            value={tempAvatar}
                            onChange={(e) => setTempAvatar(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                          />
                      </div>
                      <Button fullWidth onClick={saveProfile}>Salvar Alterações</Button>
                  </div>
              </LiquidCard>
          </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto liquid-glass shadow-2xl shadow-black/20 rounded-2xl p-2 flex justify-around items-center z-40">
         <NavBtn icon={<Home size={22} />} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
         <NavBtn icon={<BarChart2 size={22} />} active={view === 'analytics'} onClick={() => setView('analytics')} />
         <div className="-mt-10">
             <button 
                onClick={() => setView('track')}
                className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/50 transition-all duration-300 border border-transparent"
             >
                 <PlusCircle size={32} strokeWidth={1.5} />
             </button>
         </div>
         <NavBtn icon={<Coffee size={22} />} active={view === 'habits'} onClick={() => setView('habits')} />
         <NavBtn icon={<Settings size={22} />} active={view === 'tools'} onClick={() => setView('tools')} />
      </nav>
    </div>
  );
};

const NavBtn: React.FC<{icon: React.ReactNode, active: boolean, onClick: () => void}> = ({ icon, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`p-4 rounded-xl transition-all duration-300 ${active ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
    >
        {icon}
    </button>
);

export default App;