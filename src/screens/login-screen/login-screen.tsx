import React, { useState } from 'react';
import { useAuth } from '../../context';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginMoodle, getUserInfo } from '../../services/moodle-cursos';

type LoginScreenProps = {
  navigation: any;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Add this to check if __DEV__ is working
  console.log('__DEV__ value:', __DEV__);

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Authentication Error', 'Please fill in all fields');
      return;
    }

    console.log('🔑 Login attempt with username:', username.trim());
    
    setLoading(true);
    try {
      // Get token using loginMoodle from moodle-cursos.js
      const tokenResponse = await loginMoodle(username.trim(), password);
      console.log('� Token response:', tokenResponse);
      
      if (tokenResponse.token) {
        // Get user info using the token
        const userInfo = await getUserInfo(tokenResponse.token);
        console.log('👤 User info:', userInfo);
        
        // Guardar los datos en AsyncStorage para acceso global
        await AsyncStorage.setItem('@moodle_token', tokenResponse.token);
        await AsyncStorage.setItem('@moodle_userid', userInfo.userid.toString());
        
        // Call the context login to save the credentials
        await login(username.trim(), password);
        
        console.log('✅ Login successful! Navigating to ZoomLogin...');
        // Navigate to Zoom login screen with credentials and token
        navigation.replace('ZoomLogin', {
          moodleUsername: username.trim(),
          moodlePassword: password,
          token: tokenResponse.token,
          userid: userInfo.userid,
        });
      } else {
        console.log('❌ Login failed - no token received');
        Alert.alert('Authentication Error', 'Invalid credentials. Please check your information and try again.');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="default"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}>
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Debug button - temporarily always visible */}
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => navigation.replace('JoinMeeting')}>
              <Text style={styles.debugButtonText}>🚀 Skip Login (Debug)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F7FAFC',
    color: '#000000',
  },
  loginButton: {
    backgroundColor: '#0E7AFE',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#FF5252',
    borderStyle: 'dashed',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});