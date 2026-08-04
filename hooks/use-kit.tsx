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

import { DEFAULT_IN_KIT } from '@/constants/pieces';

const STORAGE_KEY = 'kit-pieces';

type KitContextValue = {
  /** IDs of the pieces currently in the kit. */
  inKit: Set<string>;
  /** False until the persisted kit has been read from storage. */
  hydrated: boolean;
  isInKit: (id: string) => boolean;
  addPiece: (id: string) => void;
  removePiece: (id: string) => void;
};

const KitContext = createContext<KitContextValue | null>(null);

export function KitProvider({ children }: { children: ReactNode }) {
  const [inKit, setInKit] = useState<Set<string>>(() => new Set(DEFAULT_IN_KIT));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!saved) return;
        const ids = JSON.parse(saved) as unknown;
        if (Array.isArray(ids) && ids.every((x) => typeof x === 'string')) {
          setInKit(new Set(ids));
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const persist = useCallback((next: Set<string>) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next])).catch(() => {});
  }, []);

  const addPiece = useCallback(
    (id: string) =>
      setInKit((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev).add(id);
        persist(next);
        return next;
      }),
    [persist]
  );

  const removePiece = useCallback(
    (id: string) =>
      setInKit((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        persist(next);
        return next;
      }),
    [persist]
  );

  const value = useMemo(
    () => ({ inKit, hydrated, isInKit: (id: string) => inKit.has(id), addPiece, removePiece }),
    [inKit, hydrated, addPiece, removePiece]
  );

  return <KitContext.Provider value={value}>{children}</KitContext.Provider>;
}

export function useKit(): KitContextValue {
  const ctx = useContext(KitContext);
  if (!ctx) throw new Error('useKit must be used within KitProvider');
  return ctx;
}
