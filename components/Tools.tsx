import React, { useState, useRef } from 'react';
import { LiquidCard } from './ui/LiquidCard';
import { Button } from './ui/Button';
import { Wind, Download, Moon, Sun, Database, X, Upload } from 'lucide-react';
import { exportData, importData } from '../services/storageService';
import { jsPDF } from "jspdf";
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  toggleTheme: () => void;
  isDark: boolean;
}

export const Tools: React.FC<Props> = ({ entries, toggleTheme, isDark }) => {
  const [breathingActive, setBreathingActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    
    doc.setFontSize(20);
    doc.text("Lumina - Relatório Emocional", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
    
    let y = 50;
    entries.slice(0, 50).forEach((e, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const date = new Date(e.timestamp).toLocaleString();
      const mood = e.emotions.map(m => `${m.name} (${m.intensity}%)`).join(', ');
      const context = e.context.map(c => c.name).join(', ');
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(date, 20, y);
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Humor: ${mood}`, 20, y + 6);
      
      if(context) doc.text(`Contexto: ${context}`, 20, y + 12);
      if(e.thoughts?.automaticThought) {
         doc.setFontSize(10);
         doc.setTextColor(80);
         doc.text(`Pensamento: "${e.thoughts.automaticThought.substring(0, 80)}..."`, 20, y + 18);
         y += 6;
      }

      y += 25;
    });

    doc.save("lumina-relatorio.pdf");
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const content = e.target?.result as string;
              if (content) {
                  const success = importData(content);
                  if (success) {
                      alert('Dados restaurados com sucesso! O app será recarregado.');
                      window.location.reload();
                  } else {
                      alert('Erro ao importar arquivo. Verifique se é um backup válido do Lumina.');
                  }
              }
          };
          reader.readAsText(file);
      }
      // Reset input
      if(event.target) event.target.value = '';
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white px-2">Ferramentas</h2>

      {/* Breathing Tool */}
      <LiquidCard className="text-center py-10 relative overflow-hidden transition-all duration-500">
        {!breathingActive ? (
          <div className="space-y-4">
             <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind size={32} />
             </div>
             <h3 className="text-xl font-bold dark:text-white">Respiração Box</h3>
             <p className="text-gray-500">4s Inspirar, 4s Segurar, 4s Expirar, 4s Segurar</p>
             <Button onClick={() => setBreathingActive(true)}>Iniciar</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-8 py-4">
             <div className="relative flex items-center justify-center h-64 w-64">
                {/* Expanding Animation Ring */}
                <div className="absolute w-24 h-24 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full animate-box-breathe"></div>
                
                {/* Optional Outer Border Ring that also breathes slightly later for effect */}
                <div className="absolute w-24 h-24 border border-indigo-500/30 dark:border-indigo-400/30 rounded-full animate-box-breathe"></div>

                {/* Static Center */}
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-full flex flex-col items-center justify-center shadow-xl shadow-indigo-500/30">
                    <span className="font-bold text-lg tracking-wider">Foco</span>
                </div>
            </div>

            <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium animate-pulse">
                 Inspirar... Segurar... Expirar... Segurar...
            </p>
            <Button variant="secondary" onClick={() => setBreathingActive(false)}>Parar</Button>
          </div>
        )}
      </LiquidCard>

      {/* Settings / Export */}
      <div className="grid gap-4">
        <LiquidCard className="flex items-center justify-between !p-4 cursor-pointer" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600">
                   {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <span className="font-medium dark:text-white">Tema</span>
            </div>
            <span className="text-sm text-gray-400">{isDark ? 'Escuro' : 'Claro'}</span>
        </LiquidCard>

        <LiquidCard className="flex items-center justify-between !p-4 cursor-pointer" onClick={handlePDFExport}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                   <Download size={20} />
                </div>
                <span className="font-medium dark:text-white">Exportar PDF</span>
            </div>
        </LiquidCard>

        <LiquidCard className="flex items-center justify-between !p-4 cursor-pointer" onClick={exportData}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
                   <Database size={20} />
                </div>
                <span className="font-medium dark:text-white">Backup JSON</span>
            </div>
        </LiquidCard>

        <LiquidCard className="flex items-center justify-between !p-4 cursor-pointer" onClick={handleImportClick}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                   <Upload size={20} />
                </div>
                <span className="font-medium dark:text-white">Restaurar Dados</span>
            </div>
            <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden"
            />
        </LiquidCard>
      </div>
    </div>
  );
};