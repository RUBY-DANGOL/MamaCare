import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadUserData, saveUserData } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Stage'>;

export default function StageScreen({ navigation }: Props) {
  const stages = ['Planning', 'Conception', 'Prenatal', 'Postnatal'];

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>तपाईं कुन चरणमा हुनुहुन्छ?</Text>

      {stages.map(stage => (
        <TouchableOpacity
          key={stage}
          style={styles.stageButton}
          onPress={async () => {
            const existingUser = await loadUserData();

            if (!existingUser) {
              Alert.alert('Error', 'No user data found.');
              return;
            }

            const updatedUser = {
              ...existingUser,
              stage,
            };

            await saveUserData(updatedUser);

            if (updatedUser.role === 'mom') {
              navigation.navigate('Personal');
            } else {
              navigation.navigate('Personal'); // Later redirects to Partner screen
            }
          }}
        >
          <Text style={styles.stageText}>{stage}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffd9d6',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#B67CC7',
    fontWeight: 'bold',
  },
  stageButton: {
    backgroundColor: '#B67CC7',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  stageText: {
    fontSize: 18,
    color: '#fff0f5',
    fontWeight: '600',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
