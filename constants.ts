import { Distortion } from './types';

export const EMOTION_CATEGORIES = ['Todos', 'Alegria', 'Tristeza', 'Medo', 'Raiva', 'Nojo', 'Surpresa'];

export const EMOTIONS_LIST = [
  // Joy (Alegria)
  { name: 'Feliz', emoji: '😊', color: '#10B981', category: 'Alegria' },
  { name: 'Animado', emoji: '🤩', color: '#10B981', category: 'Alegria' },
  { name: 'Grato', emoji: '🙏', color: '#10B981', category: 'Alegria' },
  { name: 'Orgulhoso', emoji: '🦁', color: '#10B981', category: 'Alegria' },
  { name: 'Otimista', emoji: '🌅', color: '#10B981', category: 'Alegria' },
  { name: 'Satisfeito', emoji: '😌', color: '#10B981', category: 'Alegria' },
  { name: 'Brincalhão', emoji: '😜', color: '#10B981', category: 'Alegria' },
  { name: 'Em paz', emoji: '🕊️', color: '#10B981', category: 'Alegria' },

  // Sadness (Tristeza)
  { name: 'Triste', emoji: '😢', color: '#3B82F6', category: 'Tristeza' },
  { name: 'Solitário', emoji: '🐺', color: '#3B82F6', category: 'Tristeza' },
  { name: 'Deprimido', emoji: '😞', color: '#3B82F6', category: 'Tristeza' },
  { name: 'Magoado', emoji: '🩹', color: '#3B82F6', category: 'Tristeza' },
  { name: 'Decepcionado', emoji: '📉', color: '#3B82F6', category: 'Tristeza' },
  { name: 'Culpado', emoji: '🤐', color: '#3B82F6', category: 'Tristeza' },
  { name: 'Luto', emoji: '🕯️', color: '#3B82F6', category: 'Tristeza' },

  // Fear (Medo)
  { name: 'Ansioso', emoji: '😰', color: '#F59E0B', category: 'Medo' },
  { name: 'Assustado', emoji: '😱', color: '#F59E0B', category: 'Medo' },
  { name: 'Estressado', emoji: '😫', color: '#F59E0B', category: 'Medo' },
  { name: 'Inseguro', emoji: '🥺', color: '#F59E0B', category: 'Medo' },
  { name: 'Sobrecarregado', emoji: '🤯', color: '#F59E0B', category: 'Medo' },
  { name: 'Nervoso', emoji: '😬', color: '#F59E0B', category: 'Medo' },

  // Anger (Raiva)
  { name: 'Com Raiva', emoji: '😠', color: '#EF4444', category: 'Raiva' },
  { name: 'Frustrado', emoji: '😤', color: '#EF4444', category: 'Raiva' },
  { name: 'Irritado', emoji: '🙄', color: '#EF4444', category: 'Raiva' },
  { name: 'Furioso', emoji: '🤬', color: '#EF4444', category: 'Raiva' },
  { name: 'Ressentido', emoji: '😒', color: '#EF4444', category: 'Raiva' },
  { name: 'Invejoso', emoji: '👿', color: '#EF4444', category: 'Raiva' },

  // Disgust (Nojo)
  { name: 'Enojado', emoji: '🤢', color: '#8B5CF6', category: 'Nojo' },
  { name: 'Repulsa', emoji: '🤮', color: '#8B5CF6', category: 'Nojo' },
  { name: 'Julgador', emoji: '🧐', color: '#8B5CF6', category: 'Nojo' },
  { name: 'Aversão', emoji: '😖', color: '#8B5CF6', category: 'Nojo' },

  // Surprise (Surpresa)
  { name: 'Surpreso', emoji: '😲', color: '#F97316', category: 'Surpresa' },
  { name: 'Confuso', emoji: '😕', color: '#F97316', category: 'Surpresa' },
  { name: 'Admirado', emoji: '✨', color: '#F97316', category: 'Surpresa' },
  { name: 'Chocado', emoji: '😳', color: '#F97316', category: 'Surpresa' },
];

export const COGNITIVE_DISTORTIONS: Distortion[] = [
  { id: '1', name: 'Tudo ou Nada', description: 'Pensar em extremos absolutos (preto no branco).' },
  { id: '2', name: 'Generalização', description: 'Ver um padrão global com base em um único evento.' },
  { id: '3', name: 'Filtro Mental', description: 'Focar apenas nos aspectos negativos e ignorar os positivos.' },
  { id: '4', name: 'Desqualificar o Positivo', description: 'Rejeitar experiências positivas insistindo que "não contam".' },
  { id: '5', name: 'Leitura Mental', description: 'Achar que sabe o que os outros pensam (geralmente negativo) sem provas.' },
  { id: '6', name: 'Catastrofização', description: 'Esperar sempre o pior cenário possível.' },
  { id: '7', name: 'Raciocínio Emocional', description: 'Acreditar que o que você sente é a realidade.' },
  { id: '8', name: 'Afirmações "Deveria"', description: 'Usar "deveria", "tenho que" de forma rígida.' },
];

export const DEFAULT_HABITS = [
  { id: 'h1', name: 'Meditação', streak: [], color: '#8B5CF6' },
  { id: 'h2', name: 'Exercício', streak: [], color: '#10B981' },
  { id: 'h3', name: 'Leitura', streak: [], color: '#3B82F6' },
];