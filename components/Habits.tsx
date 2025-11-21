import React, { useState } from 'react';
import { Habit } from '../types';
import { LiquidCard } from './ui/LiquidCard';
import { Check, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { saveHabits } from '../services/storageService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export const Habits: React.FC<Props> = ({ habits, setHabits }) => {
  const [today] = useState(new Date().toISOString().split('T')[0]);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleDate = (habitId: string, dateStr: string) => {
    setHabits(prev => {
      const newHabits = prev.map(h => {
        if (h.id !== habitId) return h;
        const hasCompleted = h.streak.includes(dateStr);
        const newStreak = hasCompleted 
            ? h.streak.filter(d => d !== dateStr)
            : [...h.streak, dateStr];
        return { ...h, streak: newStreak };
      });
      saveHabits(newHabits);
      return newHabits;
    });
  };

  // Generate last 14 days for mini-streak view
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  const renderCalendar = (habit: Habit) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <button onClick={(e) => { e.stopPropagation(); setCurrentMonth(subMonths(currentMonth, 1))}} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"><ChevronLeft size={16}/></button>
                <span className="font-semibold dark:text-white capitalize">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</span>
                <button onClick={(e) => { e.stopPropagation(); setCurrentMonth(addMonths(currentMonth, 1))}} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"><ChevronRight size={16}/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="text-xs text-gray-400 font-medium py-1">{d}</div>)}
                {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.streak.includes(dateStr);
                    const isFuture = day > new Date();
                    
                    return (
                        <button
                            key={dateStr}
                            disabled={isFuture}
                            onClick={(e) => { e.stopPropagation(); toggleDate(habit.id, dateStr); }}
                            className={`
                                aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                                ${isCompleted 
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-400'}
                                ${isFuture ? 'opacity-20 cursor-default' : ''}
                            `}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
       <div className="flex justify-between items-center px-2">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hábitos</h2>
         <button className="text-indigo-500 text-sm font-medium hover:underline">+ Adicionar Hábito</button>
       </div>

       <div className="grid gap-4">
         {habits.map(habit => {
           const isDone = habit.streak.includes(today);
           const isExpanded = expandedHabit === habit.id;

           return (
             <LiquidCard 
                key={habit.id} 
                className="!p-5 cursor-pointer transition-all duration-500"
                onClick={() => setExpandedHabit(isExpanded ? null : habit.id)}
             >
               <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-4">
                   <button 
                    onClick={(e) => { e.stopPropagation(); toggleDate(habit.id, today); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${isDone ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-indigo-400'}`}
                   >
                     <Check size={16} />
                   </button>
                   <div className="flex flex-col">
                        <span className={`font-bold text-lg ${isDone ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {habit.name}
                        </span>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            {habit.streak.length} dias no total
                            {!isExpanded && <span className="text-indigo-500">• Clique para ver o calendário</span>}
                        </span>
                   </div>
                 </div>
                 <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-gray-400`}>
                    <CalendarIcon size={20} />
                 </div>
               </div>
               
               {/* Mini Streak (Hidden if expanded) */}
               {!isExpanded && (
                <div className="flex gap-1 justify-between animate-fade-in">
                    {last14Days.map((date, i) => (
                    <div 
                        key={date}
                        className={`
                        h-8 w-full rounded-md transition-all duration-500
                        ${habit.streak.includes(date) 
                            ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' 
                            : 'bg-gray-100 dark:bg-white/5'}
                        `}
                        style={{ opacity: habit.streak.includes(date) ? 0.6 + (i/35) : 1 }} 
                    />
                    ))}
                </div>
               )}

               {isExpanded && renderCalendar(habit)}
             </LiquidCard>
           )
         })}
       </div>
    </div>
  );
};