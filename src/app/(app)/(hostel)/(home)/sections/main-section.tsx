"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useViewStore } from "@/hooks/view-store";

import { SearchParamsValues } from "@/schemas";
import {
  searchParamsToFilters,
  filtersToSearchParams,
  FilterState,
} from "@/utils/filterHelpers";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import FilterBar from "../_modules/components/filter-bar";
import PropertiesSidebar from "../_modules/components/properties-sidebar";
import EmptyState from "@/components/global-ui/empty-state";
import { format } from "date-fns";

import dynamic from 'next/dynamic';

// Dynamically import with no SSR
const HostelMap = dynamic(() => import("../_modules/components/hostel-map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading map...</div>
});

interface FilterSectionProps {
  searchParams: SearchParamsValues;
}

export const MainSection = ({ searchParams }: FilterSectionProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary
        fallback={
          <EmptyState
            title="Failed to load hostels"
            subtitle="Please try again later."
          />
        }
      >
        <MainSectionContent searchParams={searchParams} />
      </ErrorBoundary>
    </Suspense>
  );
};

const MainSectionContent = ({ searchParams }: FilterSectionProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.hostels.getAll.queryOptions());
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const router = useRouter();
  const { viewMode, setViewMode } = useViewStore();
  
  // Initialize state directly from URL params (no useEffect needed)
  const [sortBy, setSortBy] = useState(searchParams.sort || "newest");
  const [filters, setFilters] = useState<FilterState>(() => 
    searchParamsToFilters(searchParams)
  );

  // Memoize hostels to prevent dependency issues
  const hostels = useMemo(() => data?.hostels || [], [data?.hostels]);

  const formattedHostels = useMemo(() => {
    return hostels.map((item) => ({
      id: item.id,
      name: item.name,
      address: {
        street: item.address.street,
        area: item.address.area,
        city: item.address.city,
        postalCode: item.address.postalCode ?? null,
        location: {
          latitude: item.address.location.latitude,
          longitude: item.address.location.longitude
        }
      },
      description: item.description,

      thumbnail: typeof item.thumbnail === 'object' && item.thumbnail !== null 
        ? item.thumbnail.url ?? '' 
        : '',
      images: item.images?.map(imgObj => 
        typeof imgObj.image === 'object' && imgObj.image !== null
          ? imgObj.image.url ?? ''
          : ''
      ) ?? [],
      
      totalRooms: item.totalRooms,
      totalBeds: item.totalBeds,
      occupiedBeds: item.occupiedBeds,
      availableBeds: item.availableBeds,
      bedsPerRoom: item.bedsPerRoom as "single" | "double" | "triple",
      roomType: item.roomType as "male" | "female" | "mixed",
      rentPerBed: item.rentPerBed,
      facilities: Array.from(item.facilities || []),
      createdAt: format(new Date(item.createdAt), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    }));
  }, [hostels]);

  const AREAS = useMemo(() => {
    return formattedHostels.map((hostel) => ({
      value: hostel.address.area,
      label: hostel.address.area
    }));
  }, [formattedHostels]);

  const updateURL = (newFilters: FilterState, newSort: string) => {
    const params = new URLSearchParams();
    const filterParams = filtersToSearchParams(newFilters);

    // Only add non-default values to URL
    Object.entries(filterParams).forEach(([key, value]) => {
      if (!value) return;
      
      // Skip default values
      if (key === "minPrice" && value === "3000") return;
      if (key === "maxPrice" && value === "20000") return;
      if (key === "roomType" && value === "all") return;
      if (key === "area" && value === "all") return;
      if (key === "bedsPerRoom" && value === "all") return;
      if (key === "facilities" && value === "") return;
      
      params.set(key, value);
    });

    // Add sort if not default
    if (newSort && newSort !== "newest") {
      params.set("sort", newSort);
    }

    const newURL = params.toString() 
      ? `?${params.toString()}` 
      : window.location.pathname;
    
    router.push(newURL, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateURL(newFilters, sortBy);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateURL(filters, newSort);
  };

  const filteredProperties = useMemo(() => {
    return formattedHostels.filter((property) => {
      // Price filter
      if (property.rentPerBed < filters.priceRange[0] || 
          property.rentPerBed > filters.priceRange[1]) {
        return false;
      }
      
      // Room type filter
      if (filters.roomType !== "all" && property.roomType !== filters.roomType) {
        return false;
      }
      
      // Area filter
      if (filters.area !== "all" && property.address.area !== filters.area) {
        return false;
      }
      
      // Beds per room filter
      if (filters.bedsPerRoom !== "all" && property.bedsPerRoom !== filters.bedsPerRoom) {
        return false;
      }
      
      // Facilities filter
      if (filters.facilities.length > 0) {
        return filters.facilities.every((f) => property.facilities.includes(f));
      }
      
      return true;
    });
  }, [formattedHostels, filters]);

  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    switch (sortBy) {
      case "price_low_high": 
        return sorted.sort((a, b) => a.rentPerBed - b.rentPerBed);
      case "price_high_low": 
        return sorted.sort((a, b) => b.rentPerBed - a.rentPerBed);
      case "oldest": 
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default: 
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [filteredProperties, sortBy]);

  // NOW we can do conditional rendering after all hooks are called
  if (hostels.length === 0) {
    return (
      <EmptyState
        title="No featured hostels found"
        subtitle="Please try again later."
      />
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        areas={AREAS}
        filters={filters}
        sortBy={sortBy}
        viewMode={viewMode}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onViewChange={setViewMode}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(30%,auto)] gap-4">
        <div className={`${viewMode === "grid" ? "aspect-square" : ""} 
          relative bg-muted rounded-lg overflow-hidden isolate`}
        >
          <HostelMap 
            properties={sortedProperties} 
            selectedProperty={null}
            onPropertySelect={(property) => {
              console.log('Selected:', property);
            }}
          />
        </div>

        <PropertiesSidebar
          viewMode={viewMode}
          sortedProperties={sortedProperties}
        />
      </div>
    </div>
  );
};