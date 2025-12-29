'use client';
import React, { Suspense } from 'react';
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import PropertyOverview from '../_modules/components/property-overview';
import { Facility, Property } from '@/types/types';

export const PropertySection = ({propertyId}: {propertyId: string}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading property" 
          subtitle="Please try again later." 
        />
      }>
        <PropertySectionContent propertyId={propertyId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PropertySectionContent = ({ propertyId }: { propertyId: string }) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.hostels.getById.queryOptions({ id: propertyId })
  );

  const hostel = data.hostel;

  if (!hostel) {
    return (
      <EmptyState 
        title="No hostel found"
        subtitle="The hostel you're looking for doesn't exist."
      /> 
    );
  }

  // Transform ONLY required fields for PropertyOverview
  const property: Property = {
    id: Number(hostel.id),
    name: hostel.name,
    description: hostel.description,
    address: {
      street: hostel.address.street,
      area: hostel.address.area,
      city: hostel.address.city,
      postalCode: hostel.address.postalCode || '',
      location: {  // ADD THIS
        latitude: hostel.address.location.latitude,
        longitude: hostel.address.location.longitude
      }
    }, 

    // Images
    thumbnail: typeof hostel.thumbnail === 'object' ? hostel.thumbnail?.url ?? '' : '',
    images: hostel.images?.map(imgObj => 
      typeof imgObj.image === 'object' ? imgObj.image?.url ?? '' : ''
    ).filter(Boolean) ?? [],

    // Stats & Room Info
    totalRooms: hostel.totalRooms,
    totalBeds: hostel.totalBeds,
    occupiedBeds: hostel.occupiedBeds,
    availableBeds: hostel.availableBeds,
    bedsPerRoom: hostel.bedsPerRoom,
    roomType: hostel.roomType,
    
    // Financials
    rentPerBed: hostel.rentPerBed,
    securityDeposit: hostel.securityDeposit,
    
    // Amenities
    facilities: Array.from(hostel.facilities || []) as Facility[],
    
    // Management
    manager: hostel.manager,
    contactNumber: hostel.contactNumber,
    updatedAt: hostel.updatedAt,
    
    // Omitted: tenants, createdAt, location (coordinates)
  } as Property;

  return <PropertyOverview property={property} />;
};