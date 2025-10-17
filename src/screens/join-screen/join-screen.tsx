import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { TextInputRow } from '../../components/text-input-row';
import { useAuth } from '../../context';
import {useZoom} from '@zoom/meetingsdk-react-native';

type JoinScreenProps = {
  route: any;
  navigation: any;
};

export function JoinScreen({ navigation }: JoinScreenProps) {
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [zak, setZak] = useState('');
  const { user, zoomUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  // Debug: Log user objects to see what's inside
  useEffect(() => {
    console.log('👤 Current Moodle user:', user);
    console.log('👤 Moodle Username:', user?.username);
    console.log('📹 Current Zoom user:', zoomUser);
    console.log('📹 Zoom Display Name:', zoomUser?.display_name);
  }, [user, zoomUser]);
  
  // TEST CHANGE
  useEffect(() => {
    Alert.alert('TEST - Join Screen Loaded');
  }, []);
  const zoom = useZoom();

  useEffect(() => {
  }, []);

  const joinMeeting = async () => {
      if (!meetingNumber.trim()) {
          Alert.alert('Please Enter Valid Meeting Number');
          return;
      };
      if (!displayName.trim()) {
          Alert.alert('Please Enter Display Name');
          return;
      };
      if (!meetingPassword.trim()) {
          Alert.alert('Please Enter Password');
          return;
      };
      try {
        await zoom.joinMeeting({
          userName: displayName,
          meetingNumber: meetingNumber,
          password: meetingPassword,
          userType: 1,
        });
      } catch (e) {
        console.log(e);
        Alert.alert('Failed to join the meeting' + e);
        setTimeout(() => navigation.goBack(), 1000);
      }
  };

    const startMeeting = async () => {
        if (!displayName.trim()) {
            Alert.alert('Please Enter Display Name');
            return;
        };
        if (!zak.trim()) {
            Alert.alert('Please Enter ZAK Token');
            return;
        };
        try {
          await zoom.startMeeting({
            userName: displayName,
            meetingNumber: meetingNumber,
            zoomAccessToken: zak,
          });
        } catch (e) {
          console.log(e);
          Alert.alert('Failed to start the meeting' + e);
          setTimeout(() => navigation.goBack(), 1000);
        }
    };

  return (
    <View style={styles.container}>
      {/* User info header */}
      <View style={styles.userHeader}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.username || 'Guest'}!
          </Text>
          {zoomUser && (
            <View style={styles.zoomInfoContainer}>
              <Text style={styles.zoomBadge}>📹 Zoom</Text>
              <Text style={styles.zoomUserText}>
                {zoomUser.display_name || `${zoomUser.first_name} ${zoomUser.last_name}`}
              </Text>
              <Text style={styles.zoomEmailText}>
                {zoomUser.email}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TextInputRow
        label="Meeting Number"
        placeholder="Required"
        keyboardType="default"
        value={meetingNumber}
        onChangeText={setMeetingNumber}
      />
      <TextInputRow
        label="Display Name"
        placeholder="Required"
        keyboardType="default"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInputRow
        label="Password"
        placeholder="Optional"
        keyboardType="default"
        value={meetingPassword}
        onChangeText={setMeetingPassword}
        secureTextEntry
      />
      <TextInputRow
        label="ZAK Token"
        placeholder="Optional"
        keyboardType="default"
        value={zak}
        onChangeText={setZak}
      />
      <TouchableOpacity
        onPress={startMeeting}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{'Create a Meeting'}</Text>
      </TouchableOpacity>
        <TouchableOpacity
          onPress={joinMeeting}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{'Join a Meeting'}</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  userInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  zoomInfoContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2D8CFF',
  },
  zoomBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D8CFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  zoomUserText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 2,
  },
  zoomEmailText: {
    fontSize: 12,
    color: '#4a5568',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0e71eb',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
