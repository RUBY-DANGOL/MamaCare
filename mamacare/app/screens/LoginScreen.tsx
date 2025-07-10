import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadUserData } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const savedUser = await loadUserData();

    if (!savedUser) {
      Alert.alert('No account found', 'Please sign up first.');
      return;
    }

    const isMainUser =
      data.email.toLowerCase() === savedUser.email.toLowerCase() &&
      data.password === savedUser.password;

    const isPartner =
      data.email.toLowerCase() === savedUser.partner_email?.toLowerCase();

    if (isMainUser) {
      if (savedUser.role === 'mom') {
        navigation.replace('Stage');
      } else if (savedUser.role === 'dad') {
        navigation.replace('Stage'); // dad also goes through stage
      } else {
        Alert.alert('अज्ञात भूमिका', 'कृपया पुनः दर्ता गर्नुस् र आफ्नो भूमिका छनोट गर्नुहोस्।');
      }
    } else if (isPartner) {
      navigation.replace('Partner');
    } else {
      Alert.alert('अमान्य प्रमाणपत्रहरू', 'गलत इमेल वा पासवर्ड.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>MamaCare लगिन</Text>

      <Text>इमेल</Text>
      <Controller
        control={control}
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text>पासवर्ड</Text>
      <Controller
        control={control}
        rules={{ required: 'पासवर्ड अनिवार्य छ' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Button
        title="लगिन"
        onPress={handleSubmit(onSubmit)}
        color="#B67CC7"
      />

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signup}>
          के तपाईंको खाता छैन? Sign Up
        </Text>
      </TouchableOpacity>
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
  signup: {
    color: '#B67CC7',
    marginTop: 16,
    textAlign: 'center',
  },
});
