import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { CURRENCIES, type CurrencyCode } from '@/lib/currency';
import type { Brand, Category, Attribute } from '../types';
import {
  useAdminAttributesReference,
  useAdminBrands,
  useAdminCategories,
  useAdminSettingsReference,
} from '../../../providers/AdminReferenceDataProvider';
import { logger } from '@/lib/utils/logger';

interface UseProductDataLoadingProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setBrands: (brands: Brand[]) => void;
  setCategories: (categories: Category[]) => void;
  setAttributes: (attributes: Attribute[]) => void;
  setDefaultCurrency: (currency: CurrencyCode) => void;
  attributesDropdownOpen: boolean;
  setAttributesDropdownOpen: (open: boolean) => void;
  attributesDropdownRef: React.RefObject<HTMLDivElement>;
  categoriesExpanded: boolean;
  setCategoriesExpanded: (expanded: boolean) => void;
  brandsExpanded: boolean;
  setBrandsExpanded: (expanded: boolean) => void;
}

export function useProductDataLoading({
  isLoggedIn,
  isAdmin,
  isLoading,
  setBrands,
  setCategories,
  setAttributes,
  setDefaultCurrency,
  attributesDropdownOpen,
  setAttributesDropdownOpen,
  attributesDropdownRef,
  categoriesExpanded,
  setCategoriesExpanded,
  brandsExpanded,
  setBrandsExpanded,
}: UseProductDataLoadingProps) {
  const router = useRouter();
  const { brands, loading: brandsLoading } = useAdminBrands();
  const { categories, loading: categoriesLoading } = useAdminCategories();
  const { attributes, loading: attributesLoading } = useAdminAttributesReference();
  const { settings, loading: settingsLoading } = useAdminSettingsReference();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        router.push('/supersudo');
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attributesDropdownRef.current && !attributesDropdownRef.current.contains(event.target as Node)) {
        setAttributesDropdownOpen(false);
      }
    };

    if (attributesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [attributesDropdownOpen, attributesDropdownRef, setAttributesDropdownOpen]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      return;
    }

    if (!brandsLoading) {
      setBrands(brands as Brand[]);
    }
    if (!categoriesLoading) {
      setCategories(categories as Category[]);
    }
    if (!attributesLoading) {
      setAttributes(attributes as Attribute[]);
      logger.debug('✅ [ADMIN] Reference data synced to product form', {
        brands: brands.length,
        categories: categories.length,
        attributes: attributes.length,
      });
    }
  }, [
    isLoggedIn,
    isAdmin,
    brands,
    categories,
    attributes,
    brandsLoading,
    categoriesLoading,
    attributesLoading,
    setBrands,
    setCategories,
    setAttributes,
  ]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin || settingsLoading) {
      return;
    }

    const currency = (settings?.defaultCurrency || 'AMD') as CurrencyCode;
    if (currency in CURRENCIES) {
      setDefaultCurrency(currency);
      logger.debug('✅ [ADMIN] Default currency loaded from shared settings:', currency);
    } else {
      setDefaultCurrency('AMD');
    }
  }, [isLoggedIn, isAdmin, settings, settingsLoading, setDefaultCurrency]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (categoriesExpanded && !target.closest('[data-category-dropdown]')) {
        setCategoriesExpanded(false);
      }
    };

    if (categoriesExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [categoriesExpanded, setCategoriesExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (brandsExpanded && !target.closest('[data-brand-dropdown]')) {
        setBrandsExpanded(false);
      }
    };

    if (brandsExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [brandsExpanded, setBrandsExpanded]);
}
