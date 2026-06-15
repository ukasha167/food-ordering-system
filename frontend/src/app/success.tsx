import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hugeText}>DONE.</Text>
        <Text style={styles.subText}>TRANSACTION RECORDED.</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/home')}>
        <Text style={styles.btnText}>RETURN TO MENU ↗</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E63946', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 100, paddingBottom: 48 },
  hugeText: { fontSize: 80, fontWeight: '900', color: '#FAFAFA', letterSpacing: -4 },
  subText: { fontSize: 18, fontWeight: '900', color: '#0A0A0A', letterSpacing: 2, marginTop: 8 },
  btn: { backgroundColor: '#0A0A0A', padding: 24, alignItems: 'center' },
  btnText: { color: '#FAFAFA', fontSize: 16, fontWeight: '900', letterSpacing: 1 }
});
