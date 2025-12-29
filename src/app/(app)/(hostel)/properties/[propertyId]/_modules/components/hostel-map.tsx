"use client";
import { useEffect, useRef } from 'react';
import { Property } from '@/types/types';

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
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  // 1. Initialize Map
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = (await import('leaflet')).default;
      // Add Leaflet CSS via CDN link to avoid TypeScript module error for CSS imports
      if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }
      
      // Fix marker icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      let center: [number, number] = [25.3960, 68.3578];
      let zoom = 13;

      if (properties.length > 0 && properties[0].address.location) {
        const { latitude, longitude } = properties[0].address.location;
        center = [latitude, longitude];
      }

      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;

      // Recalculate size to fix centering in aspect-ratio containers
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); 

  // 2. Update Markers and Camera
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapRef.current) return;

      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      if (properties.length === 0) return;

      properties.forEach((property) => {
        if (!property.address.location) return;

        const { latitude, longitude } = property.address.location;
        
        // Use default marker (removed custom L.divIcon)
        const marker = L.marker([latitude, longitude]).addTo(mapRef.current!);

        marker.bindPopup(`
          <div class="p-1 min-w-[120px]">
            <h3 class="font-bold text-sm leading-tight">${property.name}</h3>
            <p class="text-xs text-gray-600 mt-1">${property.address.area}</p>
            <p class="font-semibold text-xs mt-1 text-blue-600">₨${property.rentPerBed}/mo</p>
          </div>
        `);

        if (onPropertySelect) {
          marker.on('click', () => onPropertySelect(property));
        }

        markersRef.current.push(marker);
      });

      // Camera logic
      if (markersRef.current.length > 1) {
        const group = L.featureGroup(markersRef.current);
        mapRef.current.invalidateSize();
        mapRef.current.fitBounds(group.getBounds(), { padding: [40, 40] });
      } else if (markersRef.current.length === 1 && properties[0].address.location) {
        const { latitude, longitude } = properties[0].address.location;
        mapRef.current.invalidateSize(); 
        mapRef.current.setView([latitude, longitude], 16); // Slightly closer zoom for single property
      }
    };

    updateMarkers();
  }, [properties, selectedProperty, onPropertySelect]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg bg-gray-100"
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}