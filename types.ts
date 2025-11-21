export interface Emotion {
  id: string;
  name: string;
  intensity: number; // 0-100
  color: string;
  emoji: string;
  category: string;
}

export interface ContextFactor {
  id: string;
  type: 'location' | 'person' | 'activity' | 'time';
  name: string;
}

export interface Distortion {
  id: string;
  name: string;
  description: string;
}

export interface ThoughtRecord {
  automaticThought: string;
  distortions: string[]; // IDs of distortions
  rationalResponse: string;
}

export interface Entry {
  id: string;
  timestamp: number;
  emotions: Emotion[];
  context: ContextFactor[];
  thoughts?: ThoughtRecord;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: string[]; // ISO Date strings
  color: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  name: string;
  avatar?: string;
}

export type ViewState = 'dashboard' | 'track' | 'analytics' | 'habits' | 'tools' | 'settings';