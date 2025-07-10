import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PartnerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Partner!</Text>
      <Text style={styles.subtitle}>You have limited access to MamaCare content.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef3f7' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B67CC7' },
  subtitle: { fontSize: 16, marginTop: 8 },
});
