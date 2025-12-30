"use client";
import { useEffect, useRef } from 'react';
import { Property } from '@/types/types';
import type { Map, Marker } from 'leaflet';

type PropertyProps = Pick<
  Property,
  | "id"
  | "name"
  | "address"
  | "description"
  | "thumbnail"
  | "images"
  | "totalRooms"
  | "totalBeds"
  | "occupiedBeds"
  | "availableBeds"
  | "bedsPerRoom"
  | "roomType"
  | "rentPerBed"
  | "facilities"
>;

interface HostelMapProps {
  properties: PropertyProps[];
  selectedProperty?: PropertyProps | null;
  onPropertySelect?: (property: PropertyProps) => void;
}

export default function HostelMap({ 
  properties, 
  selectedProperty,
  onPropertySelect 
}: HostelMapProps) {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Marker[]>([]);
  const isInitializedRef = useRef(false);

  // 1. Initialize Map ONCE
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current || isInitializedRef.current) return;

      const L = (await import('leaflet')).default;
      
      // Add Leaflet CSS via CDN link
      if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }
      
      // Fix marker icon paths
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Default center on Hyderabad
      const center: [number, number] = [25.3960, 68.3578];
      const zoom = 13;

      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;
      isInitializedRef.current = true;

      // Recalculate size to fix centering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty dependency - only run once

  // 2. Update Markers when properties change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapRef.current || !isInitializedRef.current) return;

      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      if (properties.length === 0) return;

      // Add markers for each property
      properties.forEach((property) => {
        if (!property.address.location) {
          console.warn(`Property "${property.name}" missing location data`);
          return;
        }

        const { latitude, longitude } = property.address.location;
        
        const marker = L.marker([latitude, longitude]).addTo(mapRef.current!);

        marker.bindPopup(`
          <div class="p-2 min-w-[150px]">
            <h3 class="font-bold text-sm leading-tight">${property.name}</h3>
            <p class="text-xs text-gray-600 mt-1">${property.address.street}, ${property.address.area}</p>
            <p class="font-semibold text-sm mt-1 text-blue-600">₨${property.rentPerBed}/month</p>
            <p class="text-xs text-gray-500 mt-1">${property.availableBeds} beds available</p>
          </div>
        `);

        if (onPropertySelect) {
          marker.on('click', () => onPropertySelect(property));
        }

        markersRef.current.push(marker);
      });

      // Adjust map view based on markers
      if (markersRef.current.length > 1) {
        const group = L.featureGroup(markersRef.current);
        mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      } else if (markersRef.current.length === 1 && properties[0].address.location) {
        const { latitude, longitude } = properties[0].address.location;
        mapRef.current.setView([latitude, longitude], 15);
      }
    };

    // Small delay to ensure map is fully initialized
    const timeoutId = setTimeout(() => {
      updateMarkers();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [properties, selectedProperty, onPropertySelect]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg bg-gray-100"
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}