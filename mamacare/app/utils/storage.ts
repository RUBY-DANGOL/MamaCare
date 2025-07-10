import * as FileSystem from 'expo-file-system';

const mamaCareDir = FileSystem.documentDirectory + 'mamacare/';
const userFilePath = mamaCareDir + 'user.json';
const pregnancyLogPath = mamaCareDir + 'pregnancy-log.json';

// Ensure the mamacare folder exists
async function ensureFolderExists() {
  const dirInfo = await FileSystem.getInfoAsync(mamaCareDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(mamaCareDir, { intermediates: true });
  }
}

// Save full user data (including personal info, conditions, role, etc.)
export async function saveUserData(data: object) {
  try {
    await ensureFolderExists();
    await FileSystem.writeAsStringAsync(userFilePath, JSON.stringify(data));
    console.log('✅ User data saved at:', userFilePath);
  } catch (e) {
    console.error('❌ Failed to save user data:', e);
  }
}

// Load the full user data
export async function loadUserData(): Promise<any | null> {
  try {
    const exists = await FileSystem.getInfoAsync(userFilePath);
    if (!exists.exists) return null;

    const content = await FileSystem.readAsStringAsync(userFilePath);
    return JSON.parse(content);
  } catch (e) {
    console.error('❌ Failed to load user data:', e);
    return null;
  }
}

// Clear user data (logout)
export async function clearUserData() {
  try {
    await FileSystem.deleteAsync(userFilePath, { idempotent: true });
    console.log('✅ User data cleared.');
  } catch (e) {
    console.error('❌ Failed to clear user data:', e);
  }
}

// Save only the stage into the existing user.json
export async function saveStage(stage: string) {
  try {
    const userData = await loadUserData();
    if (!userData) throw new Error('User data not found');

    const updated = {
      ...userData,
      stage,
    };

    await saveUserData(updated);
    console.log('✅ Stage saved to user.json');
  } catch (e) {
    console.error('❌ Error saving stage:', e);
  }
}

// Load only the stage
export async function loadStage(): Promise<string | null> {
  try {
    const userData = await loadUserData();
    return userData?.stage ?? null;
  } catch (e) {
    console.error('❌ Error loading stage:', e);
    return null;
  }
}

// Check if a user is already logged in
export async function isUserLoggedIn(): Promise<boolean> {
  try {
    const userData = await loadUserData();
    return userData?.loggedIn === true;
  } catch {
    return false;
  }
}

// Save a new pregnancy log entry
export async function savePregnancyLog(entry: { date: string; notes?: string }) {
  await ensureFolderExists();
  let logs = [];
  try {
    const exists = await FileSystem.getInfoAsync(pregnancyLogPath);
    if (exists.exists) {
      const content = await FileSystem.readAsStringAsync(pregnancyLogPath);
      logs = JSON.parse(content);
    }
  } catch (e) {
    console.error('❌ Failed reading pregnancy log:', e);
  }

  logs.push({ ...entry, createdAt: new Date().toISOString() });

  try {
    await FileSystem.writeAsStringAsync(pregnancyLogPath, JSON.stringify(logs));
    console.log('✅ Pregnancy log saved');
  } catch (e) {
    console.error('❌ Failed to save pregnancy log:', e);
  }
}

// Load pregnancy logs
export async function loadPregnancyLogs(): Promise<any[]> {
  try {
    const exists = await FileSystem.getInfoAsync(pregnancyLogPath);
    if (!exists.exists) return [];

    const content = await FileSystem.readAsStringAsync(pregnancyLogPath);
    return JSON.parse(content);
  } catch (e) {
    console.error('❌ Failed to load pregnancy logs:', e);
    return [];
  }
}
