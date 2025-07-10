import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'pregnancyLogs.json';

export async function savePregnancyLog(date: string, note: string) {
  try {
    const existing = await loadPregnancyLog();
    const updated = { ...existing, [date]: note };
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save log:', e);
  }
}

export async function loadPregnancyLog(): Promise<Record<string, string>> {
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    if (!info.exists) return {};
    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to load logs:', e);
    return {};
  }
}
