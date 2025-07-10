import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  Switch,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadUserData, saveUserData } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Personal'>;

type PersonalData = {
  age: string;
  weight: string;
  height: string;
  foodPreference: 'veg' | 'non-veg';
};

export default function PersonalScreen({ navigation }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<PersonalData>();

  const [conditions, setConditions] = useState({
    thyroid: false,
    pcos: false,
    anemia: false,
    ivf: false,
  });

  const onSubmit = async (data: PersonalData) => {
    const existingUser = await loadUserData();
    if (!existingUser) {
      Alert.alert('Error', 'No user found.');
      return;
    }

    const updatedUser = {
      ...existingUser,
      personal: data,
      conditions,
      loggedIn: true, // In case of direct Home redirect
    };

    await saveUserData(updatedUser);

    if (updatedUser.role === 'mom') {
      navigation.replace('Home');
    } else {
      navigation.replace('Partner');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Your Info</Text>

        <Text>Age</Text>
        <Controller
          control={control}
          name="age"
          rules={{ required: 'Age is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} keyboardType="numeric" placeholder="Age" value={value} onChangeText={onChange} />
          )}
        />
        {errors.age && <Text style={styles.error}>{errors.age.message}</Text>}

        <Text>Weight (kg)</Text>
        <Controller
          control={control}
          name="weight"
          rules={{ required: 'Weight is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} keyboardType="numeric" placeholder="Weight" value={value} onChangeText={onChange} />
          )}
        />
        {errors.weight && <Text style={styles.error}>{errors.weight.message}</Text>}

        <Text>Height (cm)</Text>
        <Controller
          control={control}
          name="height"
          rules={{ required: 'Height is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} keyboardType="numeric" placeholder="Height" value={value} onChangeText={onChange} />
          )}
        />
        {errors.height && <Text style={styles.error}>{errors.height.message}</Text>}

        <Text>Food Preference</Text>
        <Controller
          control={control}
          name="foodPreference"
          rules={{ required: 'Food preference is required' }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.radioContainer}>
              <Button title="Veg" onPress={() => onChange('veg')} color={value === 'veg' ? '#B67CC7' : '#ccc'} />
              <Button title="Non-Veg" onPress={() => onChange('non-veg')} color={value === 'non-veg' ? '#B67CC7' : '#ccc'} />
            </View>
          )}
        />
        {errors.foodPreference && <Text style={styles.error}>{errors.foodPreference.message}</Text>}

        <Text style={styles.subHeader}>Health Conditions</Text>
        {Object.keys(conditions).map((key) => (
          <View key={key} style={styles.switchRow}>
            <Text>{key.toUpperCase()}</Text>
            <Switch
              value={conditions[key as keyof typeof conditions]}
              onValueChange={(val) =>
                setConditions((prev) => ({ ...prev, [key]: val }))
              }
            />
          </View>
        ))}

        <Button title="Continue" onPress={handleSubmit(onSubmit)} color="#B67CC7" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffd9d6',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#B67CC7',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B67CC7',
    marginTop: 20,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
