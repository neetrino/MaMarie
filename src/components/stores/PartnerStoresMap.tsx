'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PartnerStoreItem } from '@/lib/partner-stores/types';
import { buildGoogleMapsDirectionsUrl } from '@/lib/partner-stores/types';
import {
  STORES_MAP_DEFAULT_CENTER,
  STORES_MAP_DEFAULT_ZOOM,
  STORES_MAP_POPUP_AUTO_PAN,
  STORES_MAP_SELECTED_ZOOM,
} from '@/constants/stores-page';
import styles from './PartnerStoresMap.module.css';

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

const POPUP_OPTIONS: L.PopupOptions = {
  autoPan: STORES_MAP_POPUP_AUTO_PAN,
};

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

function scheduleMapInvalidate(map: L.Map): void {
  requestAnimationFrame(() => {
    map.invalidateSize({ animate: false, pan: false });
  });
}

interface PartnerStoresMapProps {
  stores: PartnerStoreItem[];
  focusStoreId: string | null;
  onFocusStoreHandled: () => void;
  onSelectStore: (storeId: string) => void;
  mapTitle: string;
  getDirectionsLabel: string;
  className?: string;
}

export function PartnerStoresMap({
  stores,
  focusStoreId,
  onFocusStoreHandled,
  onSelectStore,
  mapTitle,
  getDirectionsLabel,
  className = '',
}: PartnerStoresMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersByIdRef = useRef<Map<string, L.Marker>>(new Map());
  const hasFitBoundsRef = useRef(false);
  const onSelectStoreRef = useRef(onSelectStore);
  const directionsLabelRef = useRef(getDirectionsLabel);
  const onFocusStoreHandledRef = useRef(onFocusStoreHandled);

  useEffect(() => {
    onSelectStoreRef.current = onSelectStore;
    directionsLabelRef.current = getDirectionsLabel;
    onFocusStoreHandledRef.current = onFocusStoreHandled;
  }, [onSelectStore, getDirectionsLabel, onFocusStoreHandled]);

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

    const resizeObserver = new ResizeObserver(() => {
      scheduleMapInvalidate(map);
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => {
      scheduleMapInvalidate(map);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      markersByIdRef.current.clear();
      hasFitBoundsRef.current = false;
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
    markersByIdRef.current.clear();

    stores.forEach((store) => {
      const marker = L.marker([store.latitude, store.longitude], { icon: markerIcon });
      marker.bindPopup(buildMarkerPopup(store, directionsLabelRef.current), POPUP_OPTIONS);
      marker.on('click', () => {
        onSelectStoreRef.current(store.id);
        marker.openPopup();
      });
      marker.addTo(markersLayer);
      markersByIdRef.current.set(store.id, marker);
    });

    if (stores.length > 0 && !hasFitBoundsRef.current) {
      const bounds = L.latLngBounds(stores.map((store) => [store.latitude, store.longitude]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: STORES_MAP_DEFAULT_ZOOM });
      hasFitBoundsRef.current = true;
    }
  }, [stores]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusStoreId) {
      return;
    }

    const store = stores.find((item) => item.id === focusStoreId);
    if (!store) {
      onFocusStoreHandledRef.current();
      return;
    }

    map.flyTo([store.latitude, store.longitude], STORES_MAP_SELECTED_ZOOM, {
      duration: 0.8,
    });
    markersByIdRef.current.get(focusStoreId)?.openPopup();
    onFocusStoreHandledRef.current();
  }, [focusStoreId, stores]);

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-brand-brown">
        {mapTitle}
      </h2>

      <div className={`relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-100 ${styles.mapShell}`}>
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full min-h-[320px]" />
      </div>
    </div>
  );
}
