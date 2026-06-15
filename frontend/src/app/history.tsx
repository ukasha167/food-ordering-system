import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalContext';

const API_URL = 'https://food-ordering-system-sjrs.onrender.com/api';

export default function HistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (user) fetch(`${API_URL}/orders/user/${user.id}`).then(r => r.json()).then(setOrders);
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.navText}>← BACK</Text></TouchableOpacity>
        <Text style={styles.title}>LEDGER</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={i => i.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>NO DATA FOUND.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.id}>REF #{item.id}</Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString().toUpperCase()}</Text>
            </View>
            <Text style={styles.total}>RS. {parseFloat(item.total_amount).toFixed(0)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottomWidth: 4, borderColor: '#0A0A0A', paddingBottom: 16 },
  navText: { fontSize: 14, fontWeight: '900', color: '#0A0A0A', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '900', color: '#0A0A0A', letterSpacing: -1 },
  empty: { fontSize: 16, fontWeight: '700', color: '#888' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#0A0A0A' },
  id: { fontSize: 16, fontWeight: '900', color: '#0A0A0A' },
  date: { fontSize: 12, fontWeight: '700', color: '#888', marginTop: 4 },
  total: { fontSize: 18, fontWeight: '900', color: '#E63946' }
});
