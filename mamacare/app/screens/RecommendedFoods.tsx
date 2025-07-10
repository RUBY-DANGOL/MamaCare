import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

type Food = {
  name: string;
  image: string;
};

export default function RecommendedFoods() {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recommended-foods')
      .then(res => res.json())
      .then(setFoods)
      .catch(console.error);
  }, []);

  const renderItem = ({ item }: { item: Food }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.foodImg} />
      <Text style={styles.foodName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fulfill Your Nutritional Gap</Text>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcbba1', paddingTop: 24, paddingHorizontal: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4,
    elevation: 2
  },
  foodImg: { width: 60, height: 60, borderRadius: 8, marginRight: 18 },
  foodName: { fontSize: 17 }
});
