/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Navigation } from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { ZoomSDKProvider } from '@zoom/meetingsdk-react-native';
import { ZOOM_JWT_TOKEN } from './config';
import React from 'react';

import { AuthProvider } from './src/context';

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <ZoomSDKProvider
          config={{
            jwtToken: ZOOM_JWT_TOKEN,
            domain: "zoom.us",
            enableLog: true,
            logSize: 5,
          }}
        >
          <Navigation />
        </ZoomSDKProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

AppRegistry.registerComponent('ZoomMeetingSDKExample', () => App);
