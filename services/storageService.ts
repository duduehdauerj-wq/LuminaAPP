import { Entry, Habit, UserSettings } from '../types';

const KEYS = {
  ENTRIES: 'lumina_entries',
  HABITS: 'lumina_habits',
  SETTINGS: 'lumina_settings',
};

export const getEntries = (): Entry[] => {
  const data = localStorage.getItem(KEYS.ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const saveEntry = (entry: Entry): void => {
  const entries = getEntries();
  const newEntries = [entry, ...entries];
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(newEntries));
};

export const deleteEntry = (id: string): void => {
    const entries = getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(filtered));
}

export const getHabits = (): Habit[] => {
  const data = localStorage.getItem(KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
};

export const getSettings = (): UserSettings => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : { theme: 'system', name: 'User' };
};

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const exportData = () => {
    const data = {
        entries: getEntries(),
        habits: getHabits(),
        settings: getSettings(),
        exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    
    // Basic Validation
    if (!Array.isArray(data.entries) || !Array.isArray(data.habits)) {
      return false;
    }

    // Safe Merge for Entries (Avoid ID collisions)
    const currentEntries = getEntries();
    const currentIds = new Set(currentEntries.map(e => e.id));
    const newEntries = data.entries.filter((e: Entry) => !currentIds.has(e.id));
    const mergedEntries = [...newEntries, ...currentEntries].sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(mergedEntries));

    // Safe Merge for Habits (Update streaks if habit ID matches)
    const currentHabits = getHabits();
    const mergedHabits = data.habits.map((h: Habit) => {
        const existing = currentHabits.find(ch => ch.id === h.id);
        if (existing) {
            // Union of streaks
            const streakSet = new Set([...existing.streak, ...h.streak]);
            return { ...existing, streak: Array.from(streakSet) };
        }
        return h;
    });
    // Add completely new habits
    const habitIds = new Set(mergedHabits.map(h => h.id));
    const uniqueNewHabits = data.habits.filter((h: Habit) => !habitIds.has(h.id));
    localStorage.setItem(KEYS.HABITS, JSON.stringify([...mergedHabits, ...uniqueNewHabits]));

    // Settings (Overwrite if present)
    if (data.settings) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
    }

    return true;
  } catch (error) {
    console.error("Import failed", error);
    return false;
  }
};