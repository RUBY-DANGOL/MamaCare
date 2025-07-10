import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import * as FileSystem from 'expo-file-system';

const STORAGE_PATH = FileSystem.documentDirectory + 'mamacare/pregnancyLogs.json';

const dummyBSCalendar = [
  { day: 'Sun', dates: [1, 8, 15, 22, 29] },
  { day: 'Mon', dates: [2, 9, 16, 23, 30] },
  { day: 'Tue', dates: [3, 10, 17, 24, 31] },
  { day: 'Wed', dates: [4, 11, 18, 25] },
  { day: 'Thu', dates: [5, 12, 19, 26] },
  { day: 'Fri', dates: [6, 13, 20, 27] },
  { day: 'Sat', dates: [7, 14, 21, 28] },
];

type Log = {
  [date: string]: {
    note: string;
    type: 'pregnancy' | 'period';
  };
};

export default function LogPregnancy() {
  const [logs, setLogs] = useState<Log>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [type, setType] = useState<'pregnancy' | 'period'>('pregnancy');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const exists = await FileSystem.getInfoAsync(STORAGE_PATH);
        if (exists.exists) {
          const content = await FileSystem.readAsStringAsync(STORAGE_PATH);
          setLogs(JSON.parse(content));
        }
      } catch (e) {
        console.error('लग्स लोड गर्न असफल भयो', e);
      }
    })();
  }, []);

  const saveLog = async () => {
    if (!selectedDate) return;

    const updated = {
      ...logs,
      [selectedDate]: {
        note,
        type,
      },
    };
    setLogs(updated);
    setModalVisible(false);
    setNote('');

    try {
      await FileSystem.writeAsStringAsync(STORAGE_PATH, JSON.stringify(updated));
    } catch (e) {
      console.error('लग्स लोड गर्न असफल भयो', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bikram Sambat Calendar (Shrawan 2081)</Text>
      <View style={styles.calendarGrid}>
        {dummyBSCalendar.map((col, i) => (
          <View key={i} style={styles.column}>
            <Text style={styles.day}>{col.day}</Text>
            {col.dates.map((date) => {
              const log = logs[`${date}`];
              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateBox,
                    log?.type === 'pregnancy' && styles.pregnancyMark,
                    log?.type === 'period' && styles.periodMark,
                  ]}
                  onPress={() => {
                    setSelectedDate(`${date}`);
                    setModalVisible(true);
                    setNote(log?.note || '');
                    setType(log?.type || 'pregnancy');
                  }}
                >
                  <Text style={styles.dateText}>{date}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Log for Day {selectedDate}</Text>
            <TextInput
              placeholder="Add a note..."
              style={styles.input}
              value={note}
              onChangeText={setNote}
            />
            <View style={styles.typeRow}>
              <TouchableOpacity onPress={() => setType('pregnancy')} style={type === 'pregnancy' ? styles.typeActive : styles.typeButton}>
                <Text>Pregnancy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setType('period')} style={type === 'period' ? styles.typeActive : styles.typeButton}>
                <Text>Period</Text>
              </TouchableOpacity>
            </View>
            <Button title="Save Log" onPress={saveLog} color="#B67CC7" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#ccc" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fffaf9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B67CC7',
    marginBottom: 16,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    alignItems: 'center',
  },
  day: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#B67CC7',
  },
  dateBox: {
    width: 40,
    height: 40,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  dateText: {
    color: '#333',
  },
  pregnancyMark: {
    backgroundColor: '#ffe6f2',
  },
  periodMark: {
    backgroundColor: '#d6f0ff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
  },
  modalBox: {
    backgroundColor: '#fff',
    margin: 32,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  typeButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  typeActive: {
    padding: 10,
    backgroundColor: '#B67CC7',
    borderRadius: 6,
  },
});
