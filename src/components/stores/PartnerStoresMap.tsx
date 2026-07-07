'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PartnerStoreItem } from '@/lib/partner-stores/types';
import { buildGoogleMapsDirectionsUrl } from '@/lib/partner-stores/types';
import {
  STORES_MAP_DEFAULT_CENTER,
  STORES_MAP_DEFAULT_ZOOM,
  STORES_MAP_SELECTED_ZOOM,
} from '@/constants/stores-page';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function resetLeafletContainer(element: HTMLElement | null): void {
  if (!element) {
    return;
  }
  element.replaceChildren();
  delete (element as HTMLElement & { _leaflet_id?: number })._leaflet_id;
}

function buildMarkerPopup(store: PartnerStoreItem, directionsLabel: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'space-y-2 p-1';

  const title = document.createElement('p');
  title.className = 'text-sm font-semibold text-brand-brown';
  title.textContent = store.name;

  const address = document.createElement('p');
  address.className = 'text-xs text-brand-muted';
  address.textContent = store.address;

  const link = document.createElement('a');
  link.className = 'inline-block text-xs font-medium text-blue-600 hover:text-blue-800';
  link.href = buildGoogleMapsDirectionsUrl(store.latitude, store.longitude, store.address);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = directionsLabel;

  wrapper.append(title, address, link);
  return wrapper;
}

interface PartnerStoresMapProps {
  stores: PartnerStoreItem[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
  mapTitle: string;
  getDirectionsLabel: string;
  className?: string;
}

export function PartnerStoresMap({
  stores,
  selectedStoreId,
  onSelectStore,
  mapTitle,
  getDirectionsLabel,
  className = '',
}: PartnerStoresMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const onSelectStoreRef = useRef(onSelectStore);
  const directionsLabelRef = useRef(getDirectionsLabel);

  onSelectStoreRef.current = onSelectStore;
  directionsLabelRef.current = getDirectionsLabel;

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    resetLeafletContainer(container);

    const map = L.map(container, {
      center: [STORES_MAP_DEFAULT_CENTER.latitude, STORES_MAP_DEFAULT_CENTER.longitude],
      zoom: STORES_MAP_DEFAULT_ZOOM,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: OSM_ATTRIBUTION,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      resetLeafletContainer(container);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) {
      return;
    }

    markersLayer.clearLayers();

    stores.forEach((store) => {
      const marker = L.marker([store.latitude, store.longitude], { icon: markerIcon });
      marker.bindPopup(buildMarkerPopup(store, directionsLabelRef.current));
      marker.on('click', () => {
        onSelectStoreRef.current(store.id);
      });
      marker.addTo(markersLayer);
    });
  }, [stores]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || stores.length === 0) {
      return;
    }

    const selectedStore = stores.find((store) => store.id === selectedStoreId);
    if (selectedStore) {
      map.flyTo([selectedStore.latitude, selectedStore.longitude], STORES_MAP_SELECTED_ZOOM, {
        duration: 0.8,
      });
      return;
    }

    const bounds = L.latLngBounds(stores.map((store) => [store.latitude, store.longitude]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: STORES_MAP_DEFAULT_ZOOM });
  }, [selectedStoreId, stores]);

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-brand-brown">
        {mapTitle}
      </h2>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-100">
        <div ref={mapContainerRef} className="h-full min-h-[320px] w-full" />
      </div>
    </div>
  );
}
