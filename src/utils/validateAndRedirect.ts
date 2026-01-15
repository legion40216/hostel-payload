import { SearchParamsValues } from "@/schemas";
import {
  sortOptions,
  bedsPerRoomOptions,
  roomTypeOptions,
} from "@/data/constants";
import { BedsPerRoom, RoomType, SortOption } from "@/types/types";


type RawSearchParams = { [key: string]: string | string[] | undefined };


// ─────────────────────────────────────────────────────────
// Build strongly-typed sets from your const arrays
// ─────────────────────────────────────────────────────────

const VALID_SORT_VALUES = new Set<SortOption>(
  sortOptions.map(o => o.value)
);

const VALID_ROOM_TYPES = new Set<RoomType | "all">([
  "all",
  ...roomTypeOptions,
]);

const VALID_BEDS_PER_ROOM = new Set<BedsPerRoom | "all">([
  "all",
  ...bedsPerRoomOptions,
]);


// ─────────────────────────────────────────────────────────
// Generic type-guard helper
// ─────────────────────────────────────────────────────────

function isInSet<T extends string>(
  set: ReadonlySet<T>,
  value: string
): value is T {
  return set.has(value as T);
}


// ─────────────────────────────────────────────────────────
// Main validator
// ─────────────────────────────────────────────────────────

export function getRedirectUrlIfInvalid(
  rawParams: RawSearchParams,
  validatedParams: SearchParamsValues
): string | null {
  let hasInvalidParam = false;

  const getString = (key: string): string | undefined => {
    const val = rawParams[key];
    return typeof val === "string" ? val : undefined;
  };

  // sort
  const rawSort = getString("sort");
  if (rawSort && !isInSet(VALID_SORT_VALUES, rawSort)) {
    hasInvalidParam = true;
  }

  // minPrice
  const rawMinPrice = getString("minPrice");
  if (rawMinPrice) {
    const num = Number(rawMinPrice);
    if (isNaN(num) || num < 3000 || num > 20000) {
      hasInvalidParam = true;
    }
  }

  // maxPrice
  const rawMaxPrice = getString("maxPrice");
  if (rawMaxPrice) {
    const num = Number(rawMaxPrice);
    if (isNaN(num) || num < 3000 || num > 20000) {
      hasInvalidParam = true;
    }
  }

  // roomType
  const rawRoomType = getString("roomType");
  if (rawRoomType && !isInSet(VALID_ROOM_TYPES, rawRoomType)) {
    hasInvalidParam = true;
  }

  // bedsPerRoom
  const rawBedsPerRoom = getString("bedsPerRoom");
  if (rawBedsPerRoom && !isInSet(VALID_BEDS_PER_ROOM, rawBedsPerRoom)) {
    hasInvalidParam = true;
  }

  // facilities
  const rawFacilities = getString("facilities");
  if (rawFacilities && rawFacilities.trim() === "") {
    hasInvalidParam = true;
  }

  if (hasInvalidParam) {
    return buildCleanUrl(validatedParams);
  }

  return null;
}


// ─────────────────────────────────────────────────────────
// URL builder
// ─────────────────────────────────────────────────────────

function buildCleanUrl(params: SearchParamsValues): string {
  const urlParams = new URLSearchParams();

  if (params.sort !== "newest") {
    urlParams.set("sort", params.sort.toString());
  }

  if (params.minPrice !== 3000) {
    urlParams.set("minPrice", params.minPrice.toString());
  }

  if (params.maxPrice !== 20000) {
    urlParams.set("maxPrice", params.maxPrice.toString());
  }

  if (params.roomType !== "all") {
    urlParams.set("roomType", params.roomType.toString());
  }

  if (params.area !== "all") {
    urlParams.set("area", params.area.toString());
  }

  if (params.bedsPerRoom !== "all") {
    urlParams.set("bedsPerRoom", params.bedsPerRoom.toString());
  }

  if (params.facilities !== "") {
    urlParams.set("facilities", params.facilities);
  }

  const qs = urlParams.toString();
  return qs ? `/?${qs}` : "/";
}
