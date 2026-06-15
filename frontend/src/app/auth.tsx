import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalContext';

const API_URL = 'https://food-ordering-system-sjrs.onrender.com/api';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useGlobalContext();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) return Alert.alert('Error', 'Fields cannot be empty.');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setUser({ id: data.user.id, email: data.user.email, token: data.token });
      router.replace('/home');
    } catch (err: any) {
      Alert.alert('System Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'IDENTIFY.' : 'REGISTER.'}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL ADDRESS"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleAuth}>
        <Text style={styles.primaryText}>{isLogin ? 'PROCEED' : 'CREATE'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggle}>
        <Text style={styles.toggleText}>{isLogin ? 'SWITCH TO SIGN UP' : 'SWITCH TO LOGIN'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 24, justifyContent: 'center' },
  header: { fontSize: 48, fontWeight: '900', color: '#0A0A0A', letterSpacing: -2, marginBottom: 40 },
  form: { marginBottom: 40 },
  input: { fontSize: 16, fontWeight: '700', color: '#0A0A0A', paddingVertical: 16, borderBottomWidth: 2, borderColor: '#0A0A0A', marginBottom: 24, letterSpacing: 1 },
  primaryButton: { backgroundColor: '#E63946', padding: 20, alignItems: 'center' },
  primaryText: { color: '#FAFAFA', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  toggle: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#0A0A0A', fontWeight: '700', letterSpacing: 1, textDecorationLine: 'underline' }
});
