import { notFound } from 'next/navigation';
import { StoresPageClient } from '@/components/stores/StoresPageClient';
import { getStoresPageEnabled } from '@/lib/settings/stores-page-enabled';

export default async function StoresPage() {
  const storesPageEnabled = await getStoresPageEnabled();
  if (!storesPageEnabled) {
    notFound();
  }

  return <StoresPageClient />;
}
