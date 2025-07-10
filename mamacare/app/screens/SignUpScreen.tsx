import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { saveUserData } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type SignUpData = {
  name: string;
  email: string;
  password: string;
  partner_email: string;
};

export default function SignUpScreen({ navigation }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<SignUpData>();
  const [role, setRole] = useState<'mom' | 'dad'>('mom');

  const onSubmit = async (data: SignUpData) => {
    try {
      const userWithRole = {
        ...data,
        role,
        stage: null,
        personalInfo: null,
      };

      await saveUserData(userWithRole);
      Alert.alert('Account Created', `Welcome, ${role === 'mom' ? 'Mom' : 'Dad'}!`);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>खाता सिर्जना गर्नुहोस्</Text>

      <Text>नाम</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Name" value={value} onChangeText={onChange} />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text>इमेल</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Email" value={value} onChangeText={onChange} />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text>पासवर्ड</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Text>साथीको इमेल</Text>
      <Controller
        control={control}
        name="partner_email"
        rules={{ required: 'Partner email is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Partner's Email"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.partner_email && <Text style={styles.error}>{errors.partner_email.message}</Text>}

      <Text>तपाईं को हुनुहुन्छ?</Text>
      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={(value) => setRole(value)}
      >
        <Picker.Item label="Baby's Mom" value="mom" />
        <Picker.Item label="Baby's Dad" value="dad" />
      </Picker>

      <Button title="साइन अप गर्नुहोस्" onPress={handleSubmit(onSubmit)} color="#B67CC7" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffd9d6'
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#B67CC7'
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
});
