"use client";
import { useEffect, useRef } from 'react';
import { Property } from '@/types/types';

import type {
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';

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
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = (await import('leaflet')).default;
      
      // Fix icon paths
      delete (L.Icon.Default.prototype as unknown as {
        _getIconUrl?: string;
      })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Initialize map centered on Hyderabad, Sindh
      const map = L.map(mapContainerRef.current).setView([25.3960, 68.3578], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapRef.current) return;

      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add markers for each property
      properties.forEach((property) => {
        const { latitude, longitude } = property.address.location;
        
        const marker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin ${selectedProperty?.id === property.id ? 'selected' : ''}">
                     <span>₨${property.rentPerBed}</span>
                   </div>`,
          }),
        }).addTo(mapRef.current!);

        marker.bindPopup(`
          <div class="hostel-popup">
            <h3 class="font-semibold">${property.name}</h3>
            <p class="text-sm">${property.address.street}, ${property.address.area}</p>
            <p class="font-bold">₨${property.rentPerBed}/month</p>
            <p class="text-sm">${property.availableBeds} beds available</p>
          </div>
        `);

        if (onPropertySelect) {
          marker.on('click', () => onPropertySelect(property));
        }

        markersRef.current.push(marker);
      });
    };

    updateMarkers();
  }, [properties, selectedProperty, onPropertySelect]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '600px' }}
    />
  );
}