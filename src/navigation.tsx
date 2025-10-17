import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LoginScreen } from './screens/login-screen';
import { ZoomLoginScreen } from './screens/zoom-login-screen';
import { JoinScreen } from './screens/join-screen';
import { useAuth } from './context';
import CursosScreen from './screens/cursos-screen/CursosScreen';

const Stack = createStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0E7AFE" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

export function Navigation() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking for stored token
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator 
      initialRouteName={user ? "JoinMeeting" : "Login"}
      screenOptions={{
        headerShown: false // Hide header for all screens by default
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ZoomLogin" 
        component={ZoomLoginScreen}
        options={{ 
          headerShown: true,
          title: 'Zoom Sign In',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="JoinMeeting" 
        component={JoinScreen}
        options={{ 
          headerShown: true,
          title: 'Join Meeting',
          // Prevent going back to Login
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="Cursos" 
        component={CursosScreen}
        options={{ 
          headerShown: true,
          title: 'Mis Cursos',
          // Prevent going back to Login
          gestureEnabled: false
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
