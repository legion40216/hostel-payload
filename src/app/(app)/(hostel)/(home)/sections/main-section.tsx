"use client";
import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useViewStore } from "@/hooks/view-store";
import { properties } from "@/data/data";
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
    console.log(data);

  const router = useRouter();
  const clientSearchParams = useSearchParams();
  const { viewMode, setViewMode } = useViewStore();

  // Initialize state from URL params
  const [sortBy, setSortBy] = useState(searchParams.sort || "newest");
  const [filters, setFilters] = useState<FilterState>(
    searchParamsToFilters(searchParams)
  );

  const updateURL = (newFilters?: FilterState, newSort?: string) => {
    const params = new URLSearchParams(clientSearchParams.toString());
    const filterParams = filtersToSearchParams(newFilters || filters);

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (newSort && newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    // Remove default values to keep URL clean
    if (params.get("minPrice") === "3000") params.delete("minPrice");
    if (params.get("maxPrice") === "20000") params.delete("maxPrice");
    if (params.get("roomType") === "all") params.delete("roomType");
    if (params.get("area") === "all") params.delete("area");
    if (params.get("bedsPerRoom") === "all") params.delete("bedsPerRoom");
    if (!params.get("facilities")) params.delete("facilities");

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newURL, { scroll: false });
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (property.rentPerBed < filters.priceRange[0] || property.rentPerBed > filters.priceRange[1]) return false;
      if (filters.roomType !== "all" && property.roomType !== filters.roomType) return false;
      if (filters.area !== "all" && property.address.area !== filters.area) return false;
      if (filters.bedsPerRoom !== "all" && property.bedsPerRoom !== filters.bedsPerRoom) return false;
      if (filters.facilities.length > 0) {
        return filters.facilities.every((f) => property.facilities.includes(f));
      }
      return true;
    });
  }, [filters]);

  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    switch (sortBy) {
      case "price_low_high": return sorted.sort((a, b) => a.rentPerBed - b.rentPerBed);
      case "price_high_low": return sorted.sort((a, b) => b.rentPerBed - a.rentPerBed);
      case "oldest": return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default: return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [filteredProperties, sortBy]);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        sortBy={sortBy}
        viewMode={viewMode}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          updateURL(newFilters, sortBy);
        }}
        onSortChange={(newSort) => {
          setSortBy(newSort);
          updateURL(filters, newSort);
        }}
        onViewChange={setViewMode}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="bg-muted rounded-lg flex items-center justify-center min-h-150">
          <p className="text-muted-foreground">Map View Coming Soon</p>
        </div>

        <PropertiesSidebar 
          properties={sortedProperties} 
          viewMode={viewMode} 
          sortedProperties={sortedProperties}
        />
      </div>
    </div>
  );
};