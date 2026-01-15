// schema.ts
import { z } from "zod";
import { sortOptions, bedsPerRoomOptions, roomTypeOptions } from "@/data/constants";

export const searchParamsSchema = z.object({
  // Sort
  sort: z
    .enum(sortOptions.map(option => option.value) as [string, ...string[]])
    .catch("newest")
    .default("newest"),
  
  // Price Range
  minPrice: z.coerce.number().min(3000).max(20000).catch(3000).default(3000),
  maxPrice: z.coerce.number().min(3000).max(20000).catch(20000).default(20000),
  
  // Room Type
  roomType: z.enum(["all", ...roomTypeOptions]).catch("all").default("all"),
  
  // Area
  area: z.string().catch("all").default("all"),
  
  // Beds Per Room - THIS IS THE KEY FIX
  bedsPerRoom: z.enum(["all", ...bedsPerRoomOptions]).catch("all").default("all"),
  
  // Facilities
  facilities: z.string().catch("").default(""),
});

export type SearchParamsValues = z.infer<typeof searchParamsSchema>;