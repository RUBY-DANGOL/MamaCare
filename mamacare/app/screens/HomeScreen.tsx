import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { clearUserData } from '../utils/storage';
import { saveNutritionLog, loadNutritionLog } from '../utils/nutritionStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const articles = [
  {
    title: 'गर्भावस्था पूर्वको स्वास्थ्य: डब्ल्यूएचओबाट सुझावहरू',
    source: 'World Health Organization',
    content:
      'गर्भावस्थामा नियमित चेक-अपहरूले मातृ र शिशुलाई हुने सम्भावित जोखिमहरू पहिचान गर्न र व्यवस्थापन गर्न सहयोग पुर्‍याउँछ। WHO ले सबै गर्भवती आमाहरूको लागि प्रारम्भिक प्रेनेटल भ्रमणको सिफारिश गर्दछ।',
  },
  {
    title: 'काठमाडौं पोस्ट: गर्भवती महिलाहरूमा रक्ताल्पता समाधान गर्न',
    source: 'The Kathmandu Post',
    content:
      'रक्ताल्पता नेपाली महिलाहरूबीच एक गम्भीर चिन्ता हो। गर्भावस्थामा जटिलताबाट बच्नको लागि सही आयरन सप्लिमेण्ट र पोषणसम्म्पन्न आहार मुख्य कुरा हुन्।',
  },
  {
    title: 'स्वस्थ पुरुष शुक्राणु र महिलाको स्वास्थ्य',
    source: 'Fertility Insights',
    content:
      'Healthy sperm not only improves conception chances but also influences embryo quaस्वस्थ शुक्राणु न केवल गर्भधारणाको सम्भावनालाई सुधार गर्दछ, तर भ्रूणको गुणस्तर र गर्भावस्थाको स्वास्थ्यमा पनि प्रभाव पार्दछ। नष्ट भएको शुक्राणुको DNA गर्भपतन र विकाससँग सम्बन्धित समस्यासँग जोडिएको छ।lity and pregnancy health. Damaged sperm DNA has been linked to miscarriage and developmental issues.',
  },
];

const FOOD_DB = [
  { name: "दाल भात(rice+dal)", calories: 350 },
  { name: "मोमो (filled dumplings)", calories: 280 },
  { name: "गुन्द्रुक(fermented greens)", calories: 50 },
  { name: "आलु तमा (potato+bamboo)", calories: 200 },
  { name: "साग (leafy greens)", calories: 40 },
  { name: "चाटामारी (rice crepe)", calories: 180 },
  { name: "योमारि (sweet)", calories: 300 },
  { name: "फापरको रोटी (buckwheat)", calories: 150 },
  // ...add more foods as needed
];

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Nutrition Tracker States
  const [goal, setGoal] = useState(2100);
  const [bmi, setBmi] = useState<number | null>(22.5);
  const [foodQuery, setFoodQuery] = useState('');
  const [foodList, setFoodList] = useState<{ name: string; calories: number }[]>([]);
  const [searchResults, setSearchResults] = useState<typeof FOOD_DB>([]);
  const [consumed, setConsumed] = useState(0);

  const handleSignOut = async () => {
    await clearUserData();
    Alert.alert('Signed Out', 'तपाईं साइन आउट गरिएको छ।');
    navigation.replace('Login');
  };

  // Nutrition Tracker logic
  useEffect(() => {
    (async () => {
      const savedLog = await loadNutritionLog();
      setFoodList(savedLog);
      setConsumed(savedLog.reduce((acc: number, f: any) => acc + Number(f.calories), 0));
    })();
  }, []);

  useEffect(() => {
    saveNutritionLog(foodList);
    setConsumed(foodList.reduce((acc, f) => acc + Number(f.calories), 0));
  }, [foodList]);

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

  const onAddFood = (food?: { name: string; calories: number }) => {
    const item =
      food || FOOD_DB.find((f) => f.name.toLowerCase() === foodQuery.trim().toLowerCase());
    if (!item) return;
    setFoodList((prev) => [...prev, item]);
    setFoodQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const onClearLog = () => {
    setFoodList([]);
    setConsumed(0);
    saveNutritionLog([]);
  };

  const left = Math.max(0, goal - consumed);
  const progressPercent = Math.min(consumed / goal, 1);

  return (
    <View style={{ flex: 1 }}>
      {/* Calendar Icon - Top Right */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Calendar')}
        style={styles.calendarIconContainer}
      >
        <Image
          source={require('../../assets/calendar-day.png')}
          style={styles.calendarIcon}
        />
      </TouchableOpacity>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Background Header Image */}
        <ImageBackground
          source={require('../../assets/bg.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <Image source={require('../../assets/fetus.png')} style={styles.logo} />
        </ImageBackground>

        {/* Articles Section */}
        <View style={styles.articleSection}>
          {articles.map((article, index) => (
            <View key={index} style={styles.articleCard}>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.source}>{article.source}</Text>
              <Text style={styles.content}>{article.content}</Text>
            </View>
          ))}
        </View>

        {/* ------------------ Nutrition Tracker Section ------------------ */}
        <View style={styles.nutritionSection}>
          <Text style={styles.nutritionHeader}>Nutrition</Text>
          {bmi !== null && (
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: '#B67CC7', fontSize: 16 }}>
                BMI: <Text style={{ fontWeight: 'bold' }}>{bmi}</Text> | Daily Goal: <Text style={{ fontWeight: 'bold' }}>{goal} cal</Text>
              </Text>
            </View>
          )}
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
                  <Text style={{ color: '#999', fontSize: 16 }}>consumed</Text>
                  <Text style={{ fontSize: 15, color: '#444', marginTop: 2 }}>
                    Left: <Text style={{ color: left === 0 ? '#d66' : '#444' }}>{left}</Text>
                  </Text>
                  <Text style={{ fontSize: 13, color: '#999' }}>Goal: {goal}</Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
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
          <TouchableOpacity style={styles.clearBtn} onPress={onClearLog}>
            <Text style={{ color: '#b083ef', fontWeight: 'bold' }}>Clear Log</Text>
          </TouchableOpacity>
        </View>
        {/* ------------------ End Nutrition Tracker ------------------ */}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height * 0.45;

const styles = StyleSheet.create({
  container: { backgroundColor: '#fffaf9' },
  calendarIconContainer: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  calendarIcon: { width: 28, height: 28 },
  background: {
    width: screenWidth,
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 10,
  },
  articleSection: { padding: 16 },
  articleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B67CC7',
    marginBottom: 4,
  },
  source: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
  signOutButton: {
    alignSelf: 'center',
    backgroundColor: '#eee',
    marginVertical: 22,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 28,
  },
  signOutText: {
    color: '#B67CC7',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },

  // Nutrition Tracker styles
  nutritionSection: {
    paddingTop: 18,
    paddingBottom: 36,
    paddingHorizontal: 0,
    marginTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e2d7f3',
  },
  nutritionHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#B67CC7',
    textAlign: 'center',
    marginBottom: 10,
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
  logo: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
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

export default HomeScreen;
