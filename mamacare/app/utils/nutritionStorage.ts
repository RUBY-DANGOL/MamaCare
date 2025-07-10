import * as FileSystem from 'expo-file-system';


const NUTRITION_FILE = FileSystem.documentDirectory + 'nutrition_log.json';

export async function saveNutritionLog(log: any) {
  try {
    await FileSystem.writeAsStringAsync(NUTRITION_FILE, JSON.stringify(log));
  } catch (e) {
    console.log('Error saving nutrition log:', e);
  }
}

export async function loadNutritionLog() {
  try {
    const file = await FileSystem.getInfoAsync(NUTRITION_FILE);
    if (!file.exists) return [];
    const content = await FileSystem.readAsStringAsync(NUTRITION_FILE);
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}
