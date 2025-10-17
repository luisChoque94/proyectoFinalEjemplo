import React from 'react';
import { ZoomSDKProvider } from '@zoom/meetingsdk-react-native';
import { ZOOM_JWT_TOKEN } from '../../config';

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(
    ZoomSDKProvider,
    {
      config: {
        jwtToken: ZOOM_JWT_TOKEN,
        domain: "zoom.us",
        enableLog: true,
        logSize: 5,
      }
    },
    children
  );
};