import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOODLE_URL as MoodleUrl } from '@env';

interface MoodleTokenResponse {
  token: string;
  privatetoken?: string;
  error?: string;
}

interface MoodleUserInfo {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  error?: string;
}

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@moodle_token',
  USERNAME: '@moodle_username',
};

export class MoodleService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = MoodleUrl;
    console.log('MoodleService initialized with URL:', this.baseUrl);
    
    // Check if MOODLE_URL is properly loaded
    if (!this.baseUrl || this.baseUrl === 'undefined') {
      console.error('⚠️ MOODLE_URL not found in .env file!');
      console.log('Please create a .env file with MOODLE_URL=your_moodle_site_url');
    }
  }

  async login(username: string, password: string): Promise<{ token: string; userid: string } | null> {
    console.log('🚀 Starting Moodle token request...');
    try {
      // Get token only - stop here as requested
      const tokenResponse = await this.getToken(username, password);
      
      // Check for error response
      if (tokenResponse.error || !tokenResponse.token) {
        console.log('❌ Token error:', tokenResponse.error || 'No token received');
        console.log('Full token response:', tokenResponse);
        return null;
      }

      console.log('✅ Token received successfully:', tokenResponse.token);
      
      // Get user info to obtain userid
      const userInfo = await this.getUserInfo(tokenResponse.token);
      if (userInfo.error || !userInfo.id) {
        console.log('❌ User info error:', userInfo.error || 'No user id received');
        return null;
      }

      // Store the token in memory
      this.token = tokenResponse.token;

      // Save token and username to AsyncStorage
      await this.saveTokenToStorage(tokenResponse.token, username);

      // Return both token and userid
      return {
        token: tokenResponse.token,
        userid: userInfo.id.toString()
      };
    } catch (error) {
      console.error('💥 Moodle token request error:', error);
      return null;
    }
  }

  getStoredToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  // AsyncStorage methods for token persistence
  private async saveTokenToStorage(token: string, username: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.USERNAME, username],
      ]);
      console.log('💾 Token and username saved to storage');
    } catch (error) {
      console.error('❌ Failed to save token to storage:', error);
    }
  }

  async getTokenFromStorage(): Promise<{ token: string; username: string } | null> {
    try {
      const values = await AsyncStorage.multiGet([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USERNAME]);
      const token = values[0][1];
      const username = values[1][1];
      
      if (token && username) {
        console.log('📱 Token and username loaded from storage');
        this.token = token; // Update in-memory token
        return { token, username };
      }
      
      console.log('📱 No stored token found');
      return null;
    } catch (error) {
      console.error('❌ Failed to load token from storage:', error);
      return null;
    }
  }

  async clearStoredToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USERNAME]);
      this.token = null;
      console.log('🗑️ Token and username cleared from storage');
    } catch (error) {
      console.error('❌ Failed to clear token from storage:', error);
    }
  }

  private async getToken(username: string, password: string): Promise<MoodleTokenResponse & { error?: string }> {
    const url = `https://aulavirtual.instituto.ort.edu.ar/login/token.php`;
    console.log('🔐 Requesting token from:', url);
    console.log('📝 Username:', username);
    console.log('🔧 Service: moodle_mobile_app');
    console.log('🌐 Base URL:', this.baseUrl);
    console.log('🔍 Full URL being called:', url);
    
    // Check if URL is valid
    if (!this.baseUrl || this.baseUrl === 'undefined' || this.baseUrl.includes('undefined')) {
      console.error('❌ INVALID MOODLE_URL! Check your .env file');
      return { error: 'MOODLE_URL not configured', token: '' };
    }
    
    // Use URL with query parameters como en moodle-cursos.js
    const urlWithParams = `${url}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&service=moodle_mobile_app`;
    
    console.log('📤 Request URL:', urlWithParams.replace(/password=[^&]+/, 'password=***'));
    
    try {
      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('❌ Token request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📨 Token response:', data);
      return data;
    } catch (error) {
      console.error('💥 Fetch error:', error);
      console.error('💥 Error type:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private async getUserInfo(token: string): Promise<MoodleUserInfo & { error?: string }> {
    console.log('👤 Getting user info with token:', token.substring(0, 10) + '...');
    
    const params = new URLSearchParams({
      wstoken: token,
      wsfunction: 'core_webservice_get_site_info',
      moodlewsrestformat: 'json',
    });
    
    const response = await fetch(`${this.baseUrl}/webservice/rest/server.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error('❌ User info request failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('👤 User info response:', data);
    return data;
  }
}

// Convenience helper: standalone exported function so UI code can call
// getMoodleToken(username, password) without instantiating the class.
export async function getMoodleToken(username: string, password: string): Promise<{ token: string; userid: string } | null> {
  const svc = new MoodleService();
  return svc.login(username, password);
}