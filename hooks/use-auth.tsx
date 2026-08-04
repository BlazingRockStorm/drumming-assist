import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import usersData from '@/data/users.json';

const STORAGE_KEY = 'auth-user';

export type Plan = 'free' | 'pro';

/** The full user record as returned by the auth backend (includes the secret). */
type ApiUser = {
  id: string;
  username: string;
  password: string;
  displayName: string;
  email: string;
  plan: Plan;
};

/** The user as kept in app state / storage — never carries the password. */
export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  plan: Plan;
};

// Mock "database". Today this is a bundled JSON file; swap it for a real web
// API by replacing the body of `authenticate` below — the rest is unchanged.
const DB = usersData as { users: ApiUser[] };

/**
 * Verify credentials and return the safe user record, or null if they don't
 * match. This is the single seam to replace with a real backend call, e.g.:
 *
 *   const res = await fetch(`${API_URL}/auth/login`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ username, password }),
 *   });
 *   return res.ok ? ((await res.json()) as AuthUser) : null;
 */
async function authenticate(username: string, password: string): Promise<AuthUser | null> {
  const match = DB.users.find((u) => u.username === username.trim() && u.password === password);
  if (!match) return null;
  const { password: _password, ...safe } = match;
  return safe;
}

type AuthContextValue = {
  /** The signed-in account, or null for a guest. */
  user: AuthUser | null;
  /** Whether the user has paid access, derived from their plan. */
  isPro: boolean;
  /** False until the persisted session has been read from storage. */
  hydrated: boolean;
  /** Attempts a sign-in. Resolves to an error message, or null on success. */
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!saved) return;
        const parsed = JSON.parse(saved) as Partial<AuthUser>;
        if (parsed && typeof parsed.username === 'string' && typeof parsed.id === 'string') {
          setUser(parsed as AuthUser);
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const authed = await authenticate(username, password);
    if (!authed) return 'Incorrect username or password.';
    setUser(authed);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authed)).catch(() => {});
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ user, isPro: user?.plan === 'pro', hydrated, login, logout }),
    [user, hydrated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
