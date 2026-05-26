import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { UserSession, Role } from '../types/auth.types';

interface AuthState {
  token: string | null;
  user: UserSession | null;
  isAuthenticated: boolean;
  role: Role | null;
  setAuth: (token: string, user: UserSession) => void;
  logout: () => void;
  checkTokenExpiry: () => boolean;
}

interface DecodedToken {
  exp?: number;
  sub?: string;
  role?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,

      setAuth: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          role: user.role,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          role: null,
        });
      },

      checkTokenExpiry: () => {
        const { token } = get();
        if (!token) return false;

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (!decoded.exp) return true;

          const currentTime = Date.now() / 1000;
          // Add 60 seconds leeway for minor client/server clock drifts
          const expiryWithLeeway = decoded.exp + 60;

          if (expiryWithLeeway < currentTime) {
            get().logout();
            return false;
          }
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'incidencias-auth', // localStorage key
    }
  )
);
