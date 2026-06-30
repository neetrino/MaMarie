'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { openCartDrawer } from '../../lib/cart-drawer';

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    openCartDrawer();
    router.replace('/');
  }, [router]);

  return null;
}
