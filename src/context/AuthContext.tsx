import React, { createContext, useContext, useState, useEffect } from 'react';
import { MoodleService } from '../services/moodle';

interface AuthContextType {
  user: any | null;
  token: string | null;
  userid: string | null;
  zoomUser: any | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; token?: string; userid?: string }>;
  setZoomUser: (user: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const moodleService = new MoodleService();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userid, setUserid] = useState<string | null>(null);
  const [zoomUser, setZoomUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username: string, password: string) => {
    try {
      const result = await moodleService.login(username, password);
      if (result && result.token && result.userid) {
        // For now, create a simple user object since we're only getting the token
        setUser({ username, token: result.token, userid: result.userid });
        setToken(result.token);
        setUserid(result.userid);
        console.log('Login successful, token:', result.token, 'userid:', result.userid);
        return { 
          success: true, 
          token: result.token, 
          userid: result.userid 
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setZoomUser(null);
    await moodleService.clearStoredToken();
  };

  // Check for stored token on app startup
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const storedAuth = await moodleService.getTokenFromStorage();
        if (storedAuth) {
          setUser({ username: storedAuth.username, token: storedAuth.token });
          setToken(storedAuth.token);
          // Silently restore user - no console log for cleaner startup
        }
      } catch (error) {
        console.error('Failed to check stored token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, userid, zoomUser, isLoading, login, setZoomUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};