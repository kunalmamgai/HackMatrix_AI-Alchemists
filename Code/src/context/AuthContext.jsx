import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Replace this with your actual Google OAuth Client ID from
// https://console.cloud.google.com/apis/credentials
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('googleUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const loginWithGoogle = useCallback((credentialResponse) => {
    // Decode the JWT ID token to extract user info
    try {
      const payload = JSON.parse(
        atob(credentialResponse.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      const googleUser = {
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      setUser(googleUser);
      setIsLoggedIn(true);
      localStorage.setItem('googleUser', JSON.stringify(googleUser));
      localStorage.setItem('isLoggedIn', 'true');
    } catch (err) {
      console.error('Failed to decode Google token:', err);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('googleUser');
    localStorage.removeItem('isLoggedIn');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
