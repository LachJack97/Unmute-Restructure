// /app/(protected)/Chat/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ChatScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ChatScreen loaded');
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      alert('Error signing out: ' + error.message);
    } else {
      router.replace('/Login');  // if your file is Login.tsx
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chat!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignOut}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing Out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 24 },
  button: {
    marginTop: 24,
    backgroundColor: '#DB4437',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
});
