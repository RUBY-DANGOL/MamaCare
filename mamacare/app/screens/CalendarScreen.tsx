// app/screens/CalendarScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';

import { savePregnancyLog, loadPregnancyLog } from '../utils/pregnancyStorage';

// Minimal static data for demo purposes. Extend as needed.
const bsMonths = [
  '', // dummy for 1-indexed months
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुण', 'चैत्र'
];

// Demo: 2080 BS year, you can add more years and months!
const daysInMonth: Record<number, number[]> = {
  2080: [
    0, // dummy for 1-index
    31, 31, 32, 31, 31, 30, 30, 30, 29, 29, 30, 30, // Baishakh-Chaitra
  ],
};

const currentYear = 2080;
const currentMonth = 1; // Baishakh

export default function CalendarScreen() {
  const [year] = useState(currentYear);
  const [month] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [logDates, setLogDates] = useState<Record<string, string>>({});

  // On mount, load any logs
  React.useEffect(() => {
    loadPregnancyLog().then(setLogDates);
  }, []);

  // Days in this month
  const days = Array.from(
    { length: daysInMonth[year][month] },
    (_, i) => i + 1
  );

  const onDatePress = (day: number) => {
    const formatted = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    setSelectedDate(formatted);
    setNote(logDates[formatted] || '');
  };

  const saveNote = async () => {
    if (!selectedDate) return;
    await savePregnancyLog(selectedDate, note);
    setLogDates((prev) => ({ ...prev, [selectedDate]: note }));
    Alert.alert('✅ Saved', `Pregnancy note for ${selectedDate}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bsMonths[month]} {year}</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item.toString()}
        numColumns={7}
        renderItem={({ item }) => {
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${item
            .toString()
            .padStart(2, '0')}`;
          const isLogged = !!logDates[dateStr];
          return (
            <TouchableOpacity
              onPress={() => onDatePress(item)}
              style={[
                styles.dateCell,
                selectedDate === dateStr && styles.selectedDate,
                isLogged && styles.loggedDate,
              ]}
            >
              <Text style={styles.dateText}>{item}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.grid}
      />

      {selectedDate && (
        <View style={styles.noteContainer}>
          <Text style={styles.selectedDateLabel}>Selected: {selectedDate}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Write pregnancy note"
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
          {logDates[selectedDate] && (
            <Text style={styles.prevNote}>
              Previous: {logDates[selectedDate]}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8f7', padding: 16, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#B67CC7', textAlign: 'center', marginBottom: 12 },
  grid: { justifyContent: 'center', marginBottom: 16 },
  dateCell: {
    width: 44, height: 44, justifyContent: 'center', alignItems: 'center', margin: 4,
    borderRadius: 8, backgroundColor: '#ffe6f3',
  },
  selectedDate: { borderWidth: 2, borderColor: '#B67CC7' },
  loggedDate: { backgroundColor: '#B67CC7' },
  dateText: { color: '#333', fontWeight: '600' },
  noteContainer: { marginTop: 18, backgroundColor: '#fff', borderRadius: 10, padding: 14, elevation: 2 },
  selectedDateLabel: { fontWeight: 'bold', color: '#B67CC7', marginBottom: 6 },
  noteInput: { borderColor: '#B67CC7', borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 10, minHeight: 38 },
  saveButton: { backgroundColor: '#B67CC7', borderRadius: 6, padding: 10, alignItems: 'center', marginBottom: 6 },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  prevNote: { color: '#888', fontSize: 13, marginTop: 3 },
});
