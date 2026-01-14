// ============================================
// 3. utils/filterHelpers.ts - Conversion utilities
// ============================================

import { SearchParamsValues } from "@/schemas";
import { BedsPerRoom, Facility, RoomType } from "@/types/types";

export interface FilterState {
  priceRange: [number, number];
  facilities: Facility[];
  roomType: RoomType | "all";
  area: string;
  bedsPerRoom: BedsPerRoom | "all";
}

// Convert URL params to FilterState
export function searchParamsToFilters(params: SearchParamsValues): FilterState {
  return {
    priceRange: [params.minPrice, params.maxPrice],
    facilities: params.facilities 
      ? (params.facilities.split(',').filter(Boolean) as Facility[])
      : [],
    roomType: params.roomType,
    area: params.area,
    bedsPerRoom: params.bedsPerRoom,
  };
}

// Convert FilterState to URL search params object
export function filtersToSearchParams(filters: FilterState): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.priceRange[0] !== 3000) {
    params.minPrice = filters.priceRange[0].toString();
  }
  if (filters.priceRange[1] !== 20000) {
    params.maxPrice = filters.priceRange[1].toString();
  }
  if (filters.roomType !== "all") {
    params.roomType = filters.roomType;
  }
  if (filters.area !== "all") {
    params.area = filters.area;
  }
  if (filters.bedsPerRoom !== "all") {
    params.bedsPerRoom = filters.bedsPerRoom;
  }
  if (filters.facilities.length > 0) {
    params.facilities = filters.facilities.join(',');
  }
  
  return params;
}