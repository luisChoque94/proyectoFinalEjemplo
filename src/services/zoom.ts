import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } from '@env';

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

interface ZoomUserInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  type: number;
}

// Storage keys
const ZOOM_STORAGE_KEYS = {
  ACCESS_TOKEN: '@zoom_access_token',
  REFRESH_TOKEN: '@zoom_refresh_token',
  USER_EMAIL: '@zoom_user_email',
  EXPIRES_AT: '@zoom_token_expires_at',
};

export class ZoomService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * Authenticate with Zoom using OAuth 2.0
   * Note: For production, you'll need to implement proper OAuth flow with redirect URIs
   * This is a simplified version for demonstration
   */
  async login(email: string, password: string): Promise<{ user: ZoomUserInfo; token: string } | null> {
    console.log('🔐 Starting Zoom OAuth login process...');
    
    try {
      // TODO: Implement proper OAuth 2.0 flow
      // For Zoom, you typically need to:
      // 1. Redirect user to Zoom OAuth authorization page
      // 2. Get authorization code from callback
      // 3. Exchange authorization code for access token
      
      // For now, return null indicating not implemented
      console.warn('⚠️ Zoom OAuth flow not fully implemented yet');
      console.log('📝 Email:', email);
      
      // Placeholder - In production, this would be the OAuth token exchange
      // const tokenResponse = await this.getOAuthToken(authorizationCode);
      
      return null;
    } catch (error) {
      console.error('💥 Zoom login error:', error);
      return null;
    }
  }

  /**
   * Get OAuth access token using Server-to-Server OAuth (for server-side apps)
   * This requires Client ID and Client Secret
   */
  async getServerToServerToken(): Promise<string | null> {
    console.log('🔑 Getting Zoom Server-to-Server OAuth token...');
    
    if (!ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
      console.error('❌ Zoom Client ID or Secret not configured');
      return null;
    }

    try {
      const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
      
      const response = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=YOUR_ACCOUNT_ID', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        console.error('❌ Token request failed:', response.status);
        return null;
      }

      const data: ZoomTokenResponse = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        await this.saveTokenToStorage(data.access_token, data.refresh_token);
        console.log('✅ Zoom token obtained successfully');
        return data.access_token;
      }

      return null;
    } catch (error) {
      console.error('💥 Error getting Zoom token:', error);
      return null;
    }
  }

  /**
   * Get user information from Zoom
   */
  async getUserInfo(accessToken: string): Promise<ZoomUserInfo | null> {
    console.log('👤 Getting Zoom user info...');
    
    try {
      const response = await fetch('https://api.zoom.us/v2/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ User info request failed:', response.status);
        return null;
      }

      const data: ZoomUserInfo = await response.json();
      console.log('✅ Zoom user info retrieved:', data.email);
      return data;
    } catch (error) {
      console.error('💥 Error getting user info:', error);
      return null;
    }
  }

  // Token storage methods
  private async saveTokenToStorage(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      const items: [string, string][] = [[ZOOM_STORAGE_KEYS.ACCESS_TOKEN, accessToken]];
      
      if (refreshToken) {
        items.push([ZOOM_STORAGE_KEYS.REFRESH_TOKEN, refreshToken]);
      }
      
      await AsyncStorage.multiSet(items);
      console.log('💾 Zoom tokens saved to storage');
    } catch (error) {
      console.error('❌ Failed to save Zoom tokens:', error);
    }
  }

  async getTokenFromStorage(): Promise<{ accessToken: string; refreshToken?: string } | null> {
    try {
      const values = await AsyncStorage.multiGet([
        ZOOM_STORAGE_KEYS.ACCESS_TOKEN,
        ZOOM_STORAGE_KEYS.REFRESH_TOKEN,
      ]);
      
      const accessToken = values[0][1];
      const refreshToken = values[1][1];
      
      if (accessToken) {
        console.log('📱 Zoom token loaded from storage');
        this.accessToken = accessToken;
        this.refreshToken = refreshToken || null;
        return { accessToken, refreshToken: refreshToken || undefined };
      }
      
      console.log('📱 No stored Zoom token found');
      return null;
    } catch (error) {
      console.error('❌ Failed to load Zoom token:', error);
      return null;
    }
  }

  async clearStoredToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        ZOOM_STORAGE_KEYS.ACCESS_TOKEN,
        ZOOM_STORAGE_KEYS.REFRESH_TOKEN,
        ZOOM_STORAGE_KEYS.USER_EMAIL,
      ]);
      this.accessToken = null;
      this.refreshToken = null;
      console.log('🗑️ Zoom tokens cleared from storage');
    } catch (error) {
      console.error('❌ Failed to clear Zoom tokens:', error);
    }
  }

  getStoredToken(): string | null {
    return this.accessToken;
  }
}
