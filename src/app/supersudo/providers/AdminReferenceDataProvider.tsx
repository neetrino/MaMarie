'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  hydrateAdminQueryCacheFromStorage,
  invalidateAdminQuery,
  isAdminQueryFresh,
  peekAdminQuery,
  subscribeAdminQuery,
} from '@/lib/admin/admin-query-cache';
import { ADMIN_QUERY_KEYS, ADMIN_REFERENCE_STALE_MS } from '@/lib/admin/admin-query-keys';
import {
  loadAdminAttributes,
  loadAdminBrands,
  loadAdminCategories,
  loadAdminSettings,
  warmAdminReferenceData,
} from '@/lib/admin/admin-reference-loaders';
import type {
  AdminReferenceAttribute,
  AdminReferenceBrand,
  AdminReferenceCategory,
  AdminReferenceSettings,
} from '@/lib/admin/admin-reference-types';

interface AdminReferenceDataContextValue {
  categories: AdminReferenceCategory[];
  brands: AdminReferenceBrand[];
  attributes: AdminReferenceAttribute[];
  settings: AdminReferenceSettings | null;
  refetchCategories: (force?: boolean) => Promise<AdminReferenceCategory[]>;
  refetchBrands: (force?: boolean) => Promise<AdminReferenceBrand[]>;
  refetchAttributes: (force?: boolean) => Promise<AdminReferenceAttribute[]>;
  refetchSettings: (force?: boolean) => Promise<AdminReferenceSettings>;
}

const AdminReferenceDataContext = createContext<AdminReferenceDataContextValue | null>(null);

const IDLE_WARMUP_DELAY_MS = 1_500;

function readCachedReferenceState(): Pick<
  AdminReferenceDataContextValue,
  'categories' | 'brands' | 'attributes' | 'settings'
> {
  hydrateAdminQueryCacheFromStorage();
  return {
    categories: peekAdminQuery<AdminReferenceCategory[]>(ADMIN_QUERY_KEYS.categories) ?? [],
    brands: peekAdminQuery<AdminReferenceBrand[]>(ADMIN_QUERY_KEYS.brands) ?? [],
    attributes: peekAdminQuery<AdminReferenceAttribute[]>(ADMIN_QUERY_KEYS.attributes) ?? [],
    settings: peekAdminQuery<AdminReferenceSettings>(ADMIN_QUERY_KEYS.settings) ?? null,
  };
}

type ReferenceResourceKind = 'list' | 'settings';

function isReferenceEmpty<T>(value: T, kind: ReferenceResourceKind): boolean {
  if (kind === 'settings') {
    return value === null;
  }
  return Array.isArray(value) && value.length === 0;
}

function useLazyReferenceFetch<T>(
  data: T,
  kind: ReferenceResourceKind,
  cacheKey: string,
  refetch: (force?: boolean) => Promise<T>
): boolean {
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(
    () => isReferenceEmpty(data, kind) && peekAdminQuery<T>(cacheKey) === null
  );

  useEffect(() => {
    if (authLoading || !isLoggedIn || !isAdmin) {
      return;
    }

    let cancelled = false;
    const cached = peekAdminQuery<T>(cacheKey);
    if (cached !== null) {
      setLoading(false);
    } else if (isReferenceEmpty(data, kind)) {
      setLoading(true);
    }

    if (isAdminQueryFresh(cacheKey, ADMIN_REFERENCE_STALE_MS)) {
      return () => {
        cancelled = true;
      };
    }

    void refetch(false).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, isAdmin, refetch, cacheKey, kind]);

  return loading && isReferenceEmpty(data, kind);
}

export function AdminReferenceDataProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [initialReference] = useState(() => readCachedReferenceState());

  const [categories, setCategories] = useState<AdminReferenceCategory[]>(initialReference.categories);
  const [brands, setBrands] = useState<AdminReferenceBrand[]>(initialReference.brands);
  const [attributes, setAttributes] = useState<AdminReferenceAttribute[]>(initialReference.attributes);
  const [settings, setSettings] = useState<AdminReferenceSettings | null>(initialReference.settings);

  const refetchCategories = useCallback(async (force = false) => {
    if (force) {
      invalidateAdminQuery(ADMIN_QUERY_KEYS.categories);
    }
    const data = await loadAdminCategories(force);
    setCategories(data);
    return data;
  }, []);

  const refetchBrands = useCallback(async (force = false) => {
    if (force) {
      invalidateAdminQuery(ADMIN_QUERY_KEYS.brands);
    }
    const data = await loadAdminBrands(force);
    setBrands(data);
    return data;
  }, []);

  const refetchAttributes = useCallback(async (force = false) => {
    if (force) {
      invalidateAdminQuery(ADMIN_QUERY_KEYS.attributes);
    }
    const data = await loadAdminAttributes(force);
    setAttributes(data);
    return data;
  }, []);

  const refetchSettings = useCallback(async (force = false) => {
    if (force) {
      invalidateAdminQuery(ADMIN_QUERY_KEYS.settings);
    }
    const data = await loadAdminSettings(force);
    setSettings(data);
    return data;
  }, []);

  useEffect(() => {
    const unsubscribers = [
      subscribeAdminQuery<AdminReferenceCategory[]>(ADMIN_QUERY_KEYS.categories, setCategories),
      subscribeAdminQuery<AdminReferenceBrand[]>(ADMIN_QUERY_KEYS.brands, setBrands),
      subscribeAdminQuery<AdminReferenceAttribute[]>(ADMIN_QUERY_KEYS.attributes, setAttributes),
      subscribeAdminQuery<AdminReferenceSettings>(ADMIN_QUERY_KEYS.settings, setSettings),
    ];
    return () => {
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }, []);

  useEffect(() => {
    if (authLoading || !isLoggedIn || !isAdmin) {
      return;
    }

    const warmOnIdle = () => warmAdminReferenceData();
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(warmOnIdle, { timeout: IDLE_WARMUP_DELAY_MS });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(warmOnIdle, IDLE_WARMUP_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [authLoading, isLoggedIn, isAdmin]);

  const value = useMemo<AdminReferenceDataContextValue>(
    () => ({
      categories,
      brands,
      attributes,
      settings,
      refetchCategories,
      refetchBrands,
      refetchAttributes,
      refetchSettings,
    }),
    [
      categories,
      brands,
      attributes,
      settings,
      refetchCategories,
      refetchBrands,
      refetchAttributes,
      refetchSettings,
    ]
  );

  return (
    <AdminReferenceDataContext.Provider value={value}>{children}</AdminReferenceDataContext.Provider>
  );
}

export function useAdminReferenceData(): AdminReferenceDataContextValue {
  const context = useContext(AdminReferenceDataContext);
  if (!context) {
    throw new Error('useAdminReferenceData must be used within AdminReferenceDataProvider');
  }
  return context;
}

export function useAdminCategories() {
  const { categories, refetchCategories } = useAdminReferenceData();
  const loading = useLazyReferenceFetch(
    categories,
    'list',
    ADMIN_QUERY_KEYS.categories,
    refetchCategories
  );

  return {
    categories,
    loading,
    refetchCategories: () => refetchCategories(true),
  };
}

export function useAdminBrands() {
  const { brands, refetchBrands } = useAdminReferenceData();
  const loading = useLazyReferenceFetch(
    brands,
    'list',
    ADMIN_QUERY_KEYS.brands,
    refetchBrands
  );

  return {
    brands,
    loading,
    refetchBrands: () => refetchBrands(true),
  };
}

export function useAdminAttributesReference() {
  const { attributes, refetchAttributes } = useAdminReferenceData();
  const loading = useLazyReferenceFetch(
    attributes,
    'list',
    ADMIN_QUERY_KEYS.attributes,
    refetchAttributes
  );

  return {
    attributes,
    loading,
    refetchAttributes: () => refetchAttributes(true),
  };
}

export function useAdminSettingsReference() {
  const { settings, refetchSettings } = useAdminReferenceData();
  const loading = useLazyReferenceFetch(
    settings,
    'settings',
    ADMIN_QUERY_KEYS.settings,
    refetchSettings
  );

  return {
    settings,
    loading,
    refetchSettings: () => refetchSettings(true),
  };
}
