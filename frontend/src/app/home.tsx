import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

const API_URL = 'https://food-ordering-system-sjrs.onrender.com/api';

type MenuItem = { id: number; name: string; description: string; price: string; category: string; image_url: string };

export default function HomeScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const { user, cart } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/menu`).then(r => r.json()).then(d => { setMenu(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = ['All', 'Burgers', 'Pizzas', 'Desserts', 'Drinks'];
  const filtered = activeCat === 'All' ? menu : menu.filter(i => i.category === activeCat);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.logo}>MENU.</Text>
        <View style={styles.navActions}>
          <TouchableOpacity onPress={() => router.push('/history')}><Text style={styles.navLink}>HISTORY</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart')}><Text style={[styles.navLink, styles.cartLink]}>CART [{cartCount}]</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.filters}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={c => c}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setActiveCat(item)}>
              <Text style={[styles.filterText, activeCat === item && styles.activeFilter]}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? <ActivityIndicator size="large" color="#E63946" style={{ flex: 1 }} /> : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 50)} style={styles.card}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/details', params: item })}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <View style={styles.cardBody}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name.toUpperCase()}</Text>
                  <Text style={styles.itemPrice}>RS. {parseFloat(item.price).toFixed(0)}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: 60 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 2, borderColor: '#0A0A0A' },
  logo: { fontSize: 32, fontWeight: '900', color: '#0A0A0A', letterSpacing: -1 },
  navActions: { flexDirection: 'row', gap: 16 },
  navLink: { fontSize: 14, fontWeight: '700', color: '#0A0A0A', letterSpacing: 1 },
  cartLink: { color: '#E63946' },
  filters: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#EAEAEA' },
  filterText: { fontSize: 14, fontWeight: '700', color: '#888', marginRight: 24, letterSpacing: 1 },
  activeFilter: { color: '#0A0A0A', textDecorationLine: 'underline' },
  grid: { paddingHorizontal: 10, paddingTop: 10 },
  card: { width: '48%', marginBottom: 16, paddingHorizontal: 10 },
  image: { width: '100%', height: 160, backgroundColor: '#EAEAEA' },
  cardBody: { paddingTop: 12 },
  itemName: { fontSize: 14, fontWeight: '800', color: '#0A0A0A', letterSpacing: 0.5 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#E63946', marginTop: 4 }
});
