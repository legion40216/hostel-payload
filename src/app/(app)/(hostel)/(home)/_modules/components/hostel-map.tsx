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

      console.log('Adding markers for', properties.length, 'properties');

      // Add markers for each property
      properties.forEach((property) => {
        // Check if location exists
        if (!property.address?.location) {
          console.warn(`Property "${property.name}" missing location data`);
          return;
        }

        const { latitude, longitude } = property.address.location;
        
        console.log(`Adding marker for ${property.name} at [${latitude}, ${longitude}]`);

        // Create custom icon with price
        const customIcon = L.divIcon({
          className: 'custom-price-marker',
          html: `
            <div style="
              background: white;
              border: 2px solid #3b82f6;
              border-radius: 20px;
              padding: 4px 10px;
              font-weight: 600;
              font-size: 12px;
              color: #1e40af;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              white-space: nowrap;
              ${selectedProperty?.id === property.id ? 'background: #3b82f6; color: white; transform: scale(1.1);' : ''}
            ">
              ₨${property.rentPerBed}
            </div>
          `,
          iconSize: [80, 40],
          iconAnchor: [40, 40],
        });

        const marker = L.marker([latitude, longitude], {
          icon: customIcon
        }).addTo(mapRef.current!);

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="font-weight: bold; font-size: 14px; line-height: 1.2; margin-bottom: 4px;">${property.name}</h3>
            <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">${property.address.street}, ${property.address.area}</p>
            <p style="font-weight: 600; font-size: 14px; color: #2563eb; margin: 4px 0;">₨${property.rentPerBed}/month</p>
            <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">${property.availableBeds} beds available</p>
          </div>
        `);

        if (onPropertySelect) {
          marker.on('click', () => onPropertySelect(property));
        }

        markersRef.current.push(marker);
      });

      console.log(`Added ${markersRef.current.length} markers to map`);

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
      style={{ minHeight: '600px' }}
    />
  );
}