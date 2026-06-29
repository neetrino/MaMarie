'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRAND_ASSETS } from '../../constants/brand';
import { getCartCount, getWishlistCount } from '../../lib/storageCounts';

const ICON_SIZE_PX = 30;

export function HeaderActionIcons() {
  const router = useRouter();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(getWishlistCount());
      setCartCount(getCartCount());
    };

    updateCounts();
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('cart-updated', updateCounts);

    return () => {
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('cart-updated', updateCounts);
    };
  }, []);

  const handleSearch = () => {
    router.push('/products');
  };

  return (
    <div className="flex h-[41px] items-center gap-2.5 rounded-[22px] bg-brand-pink px-3">
      <button
        type="button"
        onClick={handleSearch}
        className="flex h-[30px] w-[30px] items-center justify-center transition-opacity hover:opacity-80"
        aria-label="Search products"
      >
        <Image src={BRAND_ASSETS.iconSearch} alt="" width={ICON_SIZE_PX} height={ICON_SIZE_PX} />
      </button>

      <Link
        href="/wishlist"
        className="relative flex h-[30px] w-[30px] items-center justify-center transition-opacity hover:opacity-80"
        aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : 'Wishlist'}
      >
        <Image src={BRAND_ASSETS.iconHeart} alt="" width={ICON_SIZE_PX} height={ICON_SIZE_PX} />
      </Link>

      <Link
        href="/cart"
        className="relative flex h-[30px] w-[33px] items-center justify-center transition-opacity hover:opacity-80"
        aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
      >
        <Image src={BRAND_ASSETS.iconCart} alt="" width={ICON_SIZE_PX} height={29} />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-1 text-[8.5px] leading-[15px] text-brand-brown">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}
