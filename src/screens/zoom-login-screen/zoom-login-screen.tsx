import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { INSTITUTIONAL_EMAIL } from '@env';
import { useAuth } from '../../context';

type ZoomLoginScreenProps = {
  navigation: any;
  route: any;
};

export function ZoomLoginScreen({ navigation, route }: ZoomLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const { setZoomUser } = useAuth();

  // Get Moodle credentials from navigation params
  const { moodleUsername, moodlePassword } = route.params || {};

  // Auto-login attempt on mount
  useEffect(() => {
    if (moodleUsername && moodlePassword && !autoLoginAttempted) {
      attemptAutoLogin();
    }
  }, [moodleUsername, moodlePassword]);

  const attemptAutoLogin = async () => {
    setAutoLoginAttempted(true);
    
    // Construct institutional email
    const institutionalDomain = INSTITUTIONAL_EMAIL || '@institution.edu';
    const constructedEmail = `${moodleUsername}${institutionalDomain}`;
    
    console.log('🔄 Attempting auto-login with institutional email:', constructedEmail);
    
    // Set the email in the input field
    setEmail(constructedEmail);
    setPassword(moodlePassword);
    
    // Attempt automatic login
    setLoading(true);
    try {
      // TODO: Implement Zoom authentication
      console.log('🔐 Auto-login attempt with Zoom:', constructedEmail);
      
      // Simulate auto-login attempt
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For testing: Create mock Zoom user data
      const mockZoomUser = {
        id: 'mock_zoom_id_' + Date.now(),
        email: constructedEmail,
        first_name: moodleUsername.split('.')[0] || 'User',
        last_name: moodleUsername.split('.')[1] || 'Name',
        display_name: moodleUsername.replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        type: 1,
      };
      
      // Set Zoom user data
      setZoomUser(mockZoomUser);
      console.log('✅ Mock Zoom user created:', mockZoomUser);
      
      // Navigate to Cursos Screen
      Alert.alert(
        'Auto-Login Successful',
        `Logged in as ${mockZoomUser.display_name}`,
        [
          {
            text: 'Ver Mis Cursos',
            onPress: () => navigation.replace('Cursos', {
              token: route.params.token,
              userid: route.params.userid
            }),
          },
        ]
      );
      
      // For now, simulate failure to allow manual entry (uncomment for failure simulation)
      // console.log('❌ Auto-login failed (simulated)');
      // Alert.alert(
      //   'Auto-Login Failed',
      //   `Could not automatically log in with ${constructedEmail}. Please verify your credentials or enter them manually.`,
      //   [{ text: 'OK' }]
      // );
    } catch (error) {
      console.error('❌ Auto-login failed:', error);
      Alert.alert('Auto-Login Failed', 'Please enter your Zoom credentials manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleZoomLogin = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Authentication Error', 'Please fill in all fields');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Authentication Error', 'Please enter a valid email address');
      return;
    }

    // Validate institutional email domain
    const institutionalDomain = INSTITUTIONAL_EMAIL || '@institution.edu';
    if (!email.trim().toLowerCase().endsWith(institutionalDomain.toLowerCase())) {
      Alert.alert(
        'Invalid Email Domain',
        `Please use your institutional email address (${institutionalDomain})`
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement Zoom authentication
      console.log('🔐 Manual Zoom login attempt:', email);
      
      // Placeholder for Zoom authentication
      // const success = await zoomService.login(email, password);
      
      // For testing: Create mock Zoom user data from email
      const emailUsername = email.split('@')[0];
      const mockZoomUser = {
        id: 'mock_zoom_id_' + Date.now(),
        email: email,
        first_name: emailUsername.split('.')[0] || 'User',
        last_name: emailUsername.split('.')[1] || 'Name',
        display_name: emailUsername.replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        type: 1,
      };
      
      // Set Zoom user data
      setZoomUser(mockZoomUser);
      console.log('✅ Mock Zoom user created from manual login:', mockZoomUser);
      
      // For now, just show a message and navigate
      Alert.alert(
        'Zoom Login Successful',
        `Logged in as ${mockZoomUser.display_name}`,
        [
          {
            text: 'Continue to Meeting',
            onPress: () => navigation.replace('JoinMeeting'),
          },
        ]
      );
    } catch (error) {
      console.error('Zoom login error:', error);
      Alert.alert('Connection Error', 'Unable to connect to Zoom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow users to skip Zoom login for now
    navigation.replace('JoinMeeting');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.contentContainer}>
          {/* Zoom Branding */}
          <View style={styles.headerContainer}>
            <Text style={styles.zoomTitle}>Zoom</Text>
            <Text style={styles.title}>Sign In to Your Account</Text>
            <Text style={styles.subtitle}>
              {autoLoginAttempted 
                ? 'Auto-login attempted with your institutional email' 
                : 'Connect with your Zoom credentials'}
            </Text>
          </View>

          {/* Show loading indicator during auto-login */}
          {loading && !autoLoginAttempted && (
            <View style={styles.autoLoginContainer}>
              <ActivityIndicator size="large" color="#2D8CFF" />
              <Text style={styles.autoLoginText}>
                Attempting automatic login with institutional credentials...
              </Text>
            </View>
          )}

          {/* Show domain requirement after auto-login attempt */}
          {autoLoginAttempted && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                ℹ️ Only institutional email addresses ({INSTITUTIONAL_EMAIL || '@institution.edu'}) are accepted
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={`Email Address (must end with ${INSTITUTIONAL_EMAIL || '@institution.edu'})`}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleZoomLogin}
              disabled={loading}>
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing in...' : 'Sign In with Zoom'}
              </Text>
            </TouchableOpacity>

            {/* Skip button for development */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for now →</Text>
            </TouchableOpacity>
          </View>

          {/* Additional info */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Don't have a Zoom account?{' '}
              <Text style={styles.linkText}>Sign up</Text>
            </Text>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  zoomTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D8CFF',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
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
  },
  loginButton: {
    backgroundColor: '#2D8CFF',
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
  skipButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '500',
  },
  footerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#718096',
  },
  linkText: {
    color: '#2D8CFF',
    fontWeight: '600',
  },
  autoLoginContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    marginBottom: 20,
  },
  autoLoginText: {
    marginTop: 12,
    fontSize: 14,
    color: '#2D8CFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoText: {
    fontSize: 13,
    color: '#8B5A00',
    lineHeight: 18,
  },
});
