import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Keyboard, ScrollView
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { saveNutritionLog, loadNutritionLog } from '../utils/nutritionStorage';

const FOOD_DB = [
  { name: "Dal Bhat (rice+dal)", calories: 350 },
  { name: "Momo (filled dumplings)", calories: 280 },
  { name: "Gundruk (fermented greens)", calories: 50 },
  { name: "Aloo Tama (potato+bamboo)", calories: 200 },
  { name: "Saag (leafy greens)", calories: 40 },
  { name: "Chatamari (rice crepe)", calories: 180 },
  { name: "Yomari (sweet)", calories: 300 },
  { name: "Phapar ko Roti (buckwheat)", calories: 150 },
  // ...add more foods as needed
];

const NutriScreen = () => {
  const [goal, setGoal] = useState(2100);
  const [bmi, setBmi] = useState<number | null>(22.5);
  const [foodQuery, setFoodQuery] = useState('');
  const [foodList, setFoodList] = useState<{ name: string; calories: number }[]>([]);
  const [searchResults, setSearchResults] = useState<typeof FOOD_DB>([]);
  const [consumed, setConsumed] = useState(0);

  // Load saved log on mount
  useEffect(() => {
    (async () => {
      const savedLog = await loadNutritionLog();
      setFoodList(savedLog);
      setConsumed(savedLog.reduce((acc: number, f: any) => acc + Number(f.calories), 0));
    })();
  }, []);

  // Save log on every change
  useEffect(() => {
    saveNutritionLog(foodList);
    setConsumed(foodList.reduce((acc, f) => acc + Number(f.calories), 0));
  }, [foodList]);

  // Food search
  const onSearch = (text: string) => {
    setFoodQuery(text);
    if (text.length > 0) {
      const found = FOOD_DB.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(found);
    } else {
      setSearchResults([]);
    }
  };

  // Add food to log
  const onAddFood = (food?: { name: string; calories: number }) => {
    const item =
      food || FOOD_DB.find((f) => f.name.toLowerCase() === foodQuery.trim().toLowerCase());
    if (!item) return;
    setFoodList((prev) => [...prev, item]);
    setFoodQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  // Optionally: Clear log button
  const onClearLog = () => {
    setFoodList([]);
    setConsumed(0);
    saveNutritionLog([]);
  };

  const left = Math.max(0, goal - consumed);
  const progressPercent = Math.min(consumed / goal, 1);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Nutrition</Text>
      </View>
      {bmi !== null && (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#B67CC7', fontSize: 16 }}>
            BMI: <Text style={{ fontWeight: 'bold' }}>{bmi}</Text> | Daily Goal: <Text style={{ fontWeight: 'bold' }}>{goal} cal</Text>
          </Text>
        </View>
      )}

      {/* Search and add */}
      <Text style={styles.sectionTitle}>Log what you ate</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food..."
          value={foodQuery}
          onChangeText={onSearch}
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => onAddFood()}>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
      {searchResults.length > 0 && (
        <FlatList
          style={styles.suggestionList}
          data={searchResults}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => onAddFood(item)}>
              <Text>{item.name} ({item.calories} cal)</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Progress Circle */}
      <View style={{ alignItems: 'center', marginVertical: 24 }}>
        <AnimatedCircularProgress
          size={170}
          width={18}
          fill={progressPercent * 100}
          tintColor="#b083ef"
          backgroundColor="#f2e7fe"
          rotation={0}
          duration={500}
        >
          {() => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#b083ef' }}>{consumed} cal</Text>
              <Text style={{ color: '#999', fontSize: 16 }}>खपत</Text>
              <Text style={{ fontSize: 15, color: '#444', marginTop: 2 }}>
                Left: <Text style={{ color: left === 0 ? '#d66' : '#444' }}>{left}</Text>
              </Text>
              <Text style={{ fontSize: 13, color: '#999' }}>Goal: {goal}</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Food log */}
      {foodList.length > 0 && (
        <View style={styles.logList}>
          <Text style={styles.logListTitle}>Today's log</Text>
          <FlatList
            data={foodList}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.logItem}>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: '#555' }}>{item.calories} cal</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Optional: Clear log button */}
      <TouchableOpacity style={styles.clearBtn} onPress={onClearLog}>
        <Text style={{ color: '#b083ef', fontWeight: 'bold' }}>Clear Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcd7d6',
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#B67CC7',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 6,
    marginLeft: 16,
    color: '#B67CC7',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 10,
    backgroundColor: '#fbecec',
    borderRadius: 18,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    paddingLeft: 14,
    borderRadius: 18,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#b083ef',
    borderRadius: 18,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    shadowColor: '#cebbfa',
    shadowRadius: 2,
    shadowOpacity: 0.22,
    elevation: 2,
  },
  suggestionList: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    maxHeight: 100,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  logList: {
    backgroundColor: '#fdecec',
    margin: 14,
    borderRadius: 18,
    padding: 14,
  },
  logListTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: '#b07dcc',
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomColor: '#f2bada',
    borderBottomWidth: 1,
  },
  clearBtn: {
    alignSelf: 'center',
    marginVertical: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f4edfa',
    borderColor: '#b083ef',
    borderWidth: 1,
  },
});

export default NutriScreen;
