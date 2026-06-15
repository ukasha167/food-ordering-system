import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalContext';

const API_URL = 'https://food-ordering-system-sjrs.onrender.com/api';

export default function CartScreen() {
  const { cart, clearCart, user } = useGlobalContext();
  const router = useRouter();
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id, items: cart, total_amount: total })
      });
      if (!res.ok) throw new Error();
      clearCart();
      router.replace('/success');
    } catch {
      Alert.alert('Error', 'Transaction failed.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.navText}>← BACK</Text></TouchableOpacity>
        <Text style={styles.title}>BASKET</Text>
      </View>

      <View style={styles.invoice}>
        <FlatList
          data={cart}
          keyExtractor={i => i.id.toString()}
          ListEmptyComponent={<Text style={styles.empty}>BASKET IS EMPTY.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowItem}>{item.quantity} × {item.name.toUpperCase()}</Text>
              <Text style={styles.rowPrice}>{(item.price * item.quantity).toFixed(0)}</Text>
            </View>
          )}
        />

        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>TOTAL DUE</Text>
          <Text style={styles.totalValue}>RS. {total.toFixed(0)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>CONFIRM TRANSACTION</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 24, paddingTop: 60, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  navText: { fontSize: 14, fontWeight: '900', color: '#0A0A0A', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '900', color: '#0A0A0A', letterSpacing: -1 },
  invoice: { flex: 1, borderTopWidth: 4, borderColor: '#0A0A0A', paddingTop: 24 },
  empty: { fontSize: 16, fontWeight: '700', color: '#888' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  rowItem: { fontSize: 14, fontWeight: '700', color: '#0A0A0A', flex: 1, paddingRight: 16 },
  rowPrice: { fontSize: 14, fontWeight: '700', color: '#0A0A0A' },
  totalBlock: { borderTopWidth: 2, borderColor: '#0A0A0A', paddingTop: 16, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  totalLabel: { fontSize: 16, fontWeight: '900', color: '#0A0A0A', letterSpacing: 1 },
  totalValue: { fontSize: 32, fontWeight: '900', color: '#E63946', letterSpacing: -1 },
  checkoutBtn: { backgroundColor: '#0A0A0A', padding: 20, alignItems: 'center' },
  checkoutText: { color: '#FAFAFA', fontSize: 14, fontWeight: '900', letterSpacing: 2 }
});
