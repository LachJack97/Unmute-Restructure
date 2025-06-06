// /app/login.tsx

import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Build a redirect URI for OAuth flows inside Expo Go
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);

  // If user is already logged in, send them to “/”
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change event:", _event, "Session:", session); // <-- Added log
      if (session && session.user) {
        router.replace('/Chat'); // Adjust the path to your protected screen
      }
    });

    // Also check on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session on mount:", session); // <-- Added log
      if (session && session.user) {
        router.replace('/Chat'); // Adjust the path to your protected screen
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      // On success, navigate to the protected chat/home screen
      router.replace('/Chat'); // Adjust the path to your protected screen
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });
    setLoading(false);

    if (error) {
      console.log('Google OAuth error:', error.message);
      alert('Google sign-in failed: ' + error.message);
    }
    // Supabase will open a browser/Expo-auth session for you.
    // After the OAuth flow completes, Supabase will redirect back into your app,
    // and the session will be established. You don’t need to call router.replace here.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleEmailLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>— or —</Text>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[styles.buttonText, { color: 'white' }]}>
              Continue with Google
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Don’t have an account?</Text>
          <Pressable onPress={() => router.push('/Register')}>
            <Text style={styles.switchLink}> Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    alignSelf: 'center',
    color: '#111827',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 16,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchText: {
    color: '#6b7280',
    fontSize: 14,
  },
  switchLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});
